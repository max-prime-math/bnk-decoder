#!/usr/bin/env node
// Attach ExamView algorithms from BNK files to PQP questions built from the printed test.
//
// The printed test (and therefore the PQP text) shows each variable's stored sample value.
// The BNK says how many times each variable is displayed; this script finds exactly those
// places in the PQP text and records them as algorithmModel.slots, which test-generator
// replaces when it calculates a new version. A question only gets an algorithmModel when
// the places are unambiguous and every rule can be evaluated; everything else stays a fixed
// question, with the reason recorded.
//
// Usage: npm run pqp:algorithms -- <pqp-dir> <bnk-dir> [algorithm-overrides.json]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { unzlibSync } from 'fflate';
import { readAlgorithmBlocks } from '../packages/bnk-core/src/algorithms.ts';
import { readGraphObjects } from '../packages/bnk-core/src/graphs.ts';
import {
  buildGraphTemplate, CROP_PIXELS_PER_INCH, graphIdentifiers, jpegSize, matchPicture, MIN_MATCH, picturesInGraphOrder,
} from './graph-templates.mjs';

const pqpDir = process.argv[2] && resolve(process.argv[2]);
const bnkDir = process.argv[3] && resolve(process.argv[3]);
// Optional reviewed fixes for ExamView authoring flaws: { chapter: { question: { note, conditions } } }.
const OVERRIDES = process.argv[4] ? JSON.parse(readFileSync(resolve(process.argv[4]), 'utf8')) : {};
if (!pqpDir || !bnkDir) {
  console.error('Usage: npm run pqp:algorithms -- <pqp-dir> <bnk-dir> [algorithm-overrides.json]');
  process.exit(1);
}

// Mirrors the functions test-generator's evaluator supports.
const SUPPORTED_FUNCTIONS = new Set([
  'range', 'rand', 'choose', 'if', 'isunique', 'abs', 'sqrt', 'pow', 'exp', 'ln', 'log', 'log10', 'floor', 'ceil',
  'ceiling', 'int', 'round', 'sigfig', 'min', 'max', 'sgn', 'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'asin', 'acos',
  'atan', 'arcsin', 'arccos', 'arctan', 'acsc', 'asec', 'acot', 'fact', 'comb', 'perm', 'gcf', 'gcd', 'lcm', 'prime',
  'chr', 'str', 'fracs', 'mixfracs', 'sqrs',
]);
const MIN_MATCH_SCORE = 3;
const KNOWN_IDENTIFIERS = new Set([...SUPPORTED_FUNCTIONS, 'pi', 'true', 'false', 'and', 'or', 'not']);

const totals = { questions: 0, matched: 0, attached: 0, reasons: {} };
for (const file of readdirSync(pqpDir).filter((name) => name.endsWith('.pqp.json')).sort()) {
  // Chapter packages ("Chapter 01.pqp.json") pair with "Chapter 01.bnk"; per-section packages
  // pair with the BNK of the same name.
  const chapter = file.match(/Chapter \d+/i)?.[0] ?? file.replace(/\.pqp\.json$/, '');
  const bnkPath = join(bnkDir, `${chapter}.bnk`);
  let blocks;
  let payload;
  try {
    payload = unzlibSync(readFileSync(bnkPath).subarray(16));
    blocks = readAlgorithmBlocks(payload);
  } catch {
    console.warn(`${file}: no readable ${chapter}.bnk in ${bnkDir}, skipped`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(join(pqpDir, file), 'utf8'));
  const pairs = alignBlocks(blocks, pkg.questions);
  let attached = 0;
  for (const { block, question } of pairs) {
    const override = OVERRIDES[chapter]?.[question.provenance.sourceQuestionNumber];
    const graphs = readGraphObjects(payload, block.offset + block.byteLength, block.recordEnd);
    const pictures = new Map((pkg.assets ?? []).map((asset) => [asset.filename.replace(/\.\w+$/, ''), join(pqpDir, asset.storage.path)]));
    const result = buildAlgorithm(block, question, override, { graphs, pictures });
    if (override && result.model) {
      for (const expression of override.conditions ?? []) {
        result.model.definitions.push({
          id: `alg-${result.model.definitions.length + 1}`,
          name: `condition_${result.model.definitions.filter((item) => item.kind === 'condition').length + 1}`,
          kind: 'condition',
          rawExpression: expression,
          dependencies: [],
          source: `bnk-decoder override: ${override.note}`,
        });
      }
    }
    question.extensions = {
      ...question.extensions,
      examview: {
        ...question.extensions?.examview,
        algorithm: {
          entries: block.entries.map(({ kind, name, rule, rawDisplay, valueType, format, decimals }) => (
            { kind, name, rule, display: rawDisplay, valueType, format, decimals }
          )),
          references: block.references,
          status: result.model ? 'attached' : 'static',
          reason: result.reason,
        },
      },
    };
    const diagnostics = (question.extensions.decodeDiagnostics ?? []).filter((item) => !item.code.startsWith('ALGORITHM_'));
    if (result.model) {
      question.extensions.algorithmModel = result.model;
      diagnostics.push({ level: 'info', code: 'ALGORITHM_ATTACHED', message: 'ExamView algorithm attached; use Calculate values for new versions.' });
      attached += 1;
    } else {
      delete question.extensions.algorithmModel;
      diagnostics.push({ level: 'info', code: 'ALGORITHM_STATIC', message: `Kept as a fixed question: ${result.reason}` });
      totals.reasons[result.reasonCode] = (totals.reasons[result.reasonCode] ?? 0) + 1;
    }
    question.extensions.decodeDiagnostics = diagnostics;
  }
  writeFileSync(join(pqpDir, file), `${JSON.stringify(pkg, null, 2)}\n`);
  totals.questions += pkg.questions.length;
  totals.matched += pairs.length;
  totals.attached += attached;
  console.log(`${file}: ${blocks.length} algorithm blocks, ${pairs.length} matched, ${attached} attached`);
}
console.log(`\n${totals.attached} of ${totals.matched} algorithmic questions attached (${totals.questions} questions total)`);
for (const [code, count] of Object.entries(totals.reasons).sort((a, b) => b[1] - a[1])) console.log(`  static: ${count} ${code}`);

// Order-preserving alignment (both follow bank order) scored by metadata and shared words.
function alignBlocks(blocks, questions) {
  const words = (text) => new Set((text.toLowerCase().match(/[a-z]{4,}/g) ?? []));
  const blockWords = blocks.map((block) => words(block.displayText));
  const questionWords = questions.map((question) => words([
    question.content.stem.text,
    ...(question.content.choices ?? []).map((choice) => choice.body.text),
  ].join(' ')));
  const score = (bi, qi) => {
    const metadata = questions[qi].extensions?.examview?.metadata ?? {};
    let total = 0;
    if ((metadata.KEY ?? '').split(' | ')[0] === blocks[bi].metadata.key.split(' | ')[0]) total += 2;
    if ((metadata.TOP ?? '').split(' | ')[0] === blocks[bi].metadata.topic.split(' | ')[0]) total += 1;
    const qw = questionWords[qi];
    if (qw.size) total += 4 * [...qw].filter((word) => blockWords[bi].has(word)).length / qw.size;
    return total;
  };

  const rows = blocks.length + 1;
  const cols = questions.length + 1;
  const best = Array.from({ length: rows }, () => new Float64Array(cols).fill(-Infinity));
  const step = Array.from({ length: rows }, () => new Uint8Array(cols));
  best[0][0] = 0;
  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      if (i === 0 && j === 0) continue;
      if (j > 0 && best[i][j - 1] > best[i][j]) { best[i][j] = best[i][j - 1]; step[i][j] = 1; }
      if (i > 0 && best[i - 1][j] - 1 > best[i][j]) { best[i][j] = best[i - 1][j] - 1; step[i][j] = 2; }
      if (i > 0 && j > 0) {
        const value = best[i - 1][j - 1] + score(i - 1, j - 1) - MIN_MATCH_SCORE;
        if (value > best[i][j]) { best[i][j] = value; step[i][j] = 3; }
      }
    }
  }
  const pairs = [];
  for (let i = rows - 1, j = cols - 1; i > 0 || j > 0;) {
    if (step[i][j] === 3) { pairs.push({ block: blocks[i - 1], question: questions[j - 1] }); i -= 1; j -= 1; }
    else if (step[i][j] === 1) j -= 1;
    else i -= 1;
  }
  return pairs.reverse();
}

function buildAlgorithm(block, question, override = {}, { graphs = [], pictures = new Map() } = {}) {
  const refs = block.references;
  const variables = block.entries.filter((entry) => entry.kind === 'variable');
  const byName = new Map(variables.map((entry) => [entry.name, entry]));
  const displayed = variables.filter((entry) => (refs.text[entry.name] ?? 0) + (refs.equation[entry.name] ?? 0) > 0);
  // Graphs that use variables are redrawn from them; graphs that don't stay as printed.
  const variableGraphs = graphs.filter((graph) => graphIdentifiers(graph).some((name) => byName.has(name)));
  for (const graph of variableGraphs) {
    const missing = graphIdentifiers(graph).filter((name) => !byName.has(name));
    if (missing.length) return fail('OUTSIDE_VARIABLE', `its graph uses ${missing.join(', ')}, which the question's algorithm doesn't define`);
  }
  if (!displayed.length && !variableGraphs.length) return fail('NO_DISPLAYED_VARIABLES', 'none of its variables appear in the question text or its graphs');

  // Keep what the displayed values, graphs and conditions need; drop dead helpers.
  const conditions = block.entries.filter((entry) => entry.kind === 'condition');
  const needed = new Set(displayed.map((entry) => entry.name));
  for (const graph of variableGraphs) for (const name of graphIdentifiers(graph)) if (byName.has(name)) needed.add(name);
  for (const condition of conditions) for (const name of identifiers(condition.rule)) if (byName.has(name)) needed.add(name);
  for (let grew = true; grew;) {
    grew = false;
    for (const name of [...needed]) {
      for (const dependency of identifiers(byName.get(name).rule)) {
        if (byName.has(dependency) && !needed.has(dependency)) { needed.add(dependency); grew = true; }
      }
    }
  }

  // Every picture must be an ExamView graph we can pair with it: a picture that isn't a graph
  // (a diagram drawn from a displayed value, say) can't follow new values.
  const graphTemplates = [];
  const orderedPictures = picturesInGraphOrder(question);
  if (!orderedPictures.length && variableGraphs.length) {
    // The graph wasn't captured (or ExamView draws it only in the answer key): new values
    // would change a function whose graph the question never shows.
    return fail('MISSING_GRAPH', `ExamView draws ${graphs.length} graph(s) that use the values, but the question has no picture of them`);
  }
  if (orderedPictures.length) {
    if (orderedPictures.length !== graphs.length) {
      return fail('PICTURE', `it has ${orderedPictures.length} picture(s) but ${graphs.length} ExamView graph(s), so the pictures can't all be redrawn`);
    }
    const samples = new Map(variables.map((entry) => [entry.name, entry.valueType === 'number' ? entry.value : NaN]));
    for (const [index, graph] of graphs.entries()) {
      if (!variableGraphs.includes(graph)) continue;
      const picture = orderedPictures[index];
      const path = pictures.get(picture);
      const size = path && jpegSize(path);
      if (!size) return fail('GRAPH_UNVERIFIED', `picture ${picture} could not be read`);
      const frame = graph.frame ?? { width: size.width / CROP_PIXELS_PER_INCH, height: size.height / CROP_PIXELS_PER_INCH };
      const built = buildGraphTemplate(graph, frame);
      if (built.error) return fail('GRAPH_UNSUPPORTED', built.error);
      const match = matchPicture(graph, samples, path, frame);
      if (match === undefined) return fail('GRAPH_UNVERIFIED', `the redrawn graph for ${picture} could not be checked against the printed one`);
      if (match < MIN_MATCH) {
        return fail('GRAPH_MISMATCH', `the decoded graph matches only ${Math.round(match * 100)}% of printed picture ${picture}`);
      }
      graphTemplates.push({ image: picture, graph: built.graph });
    }
  }

  const definitions = [];
  let conditionIndex = 0;
  for (const entry of block.entries) {
    if (entry.kind === 'control') continue;
    if (entry.kind === 'variable' && !needed.has(entry.name)) continue;
    const expression = translateRule(entry.rule);
    if (!expression.ok) return fail('UNSUPPORTED_RULE', `${entry.name || 'a condition'} uses ${expression.reason}`);
    if (entry.kind === 'condition') {
      conditionIndex += 1;
      definitions.push({
        id: `alg-${definitions.length + 1}`,
        name: `condition_${conditionIndex}`,
        kind: 'condition',
        rawExpression: expression.value,
        dependencies: identifiers(entry.rule).filter((name) => byName.has(name)),
        source: 'examview-bnk',
      });
      continue;
    }
    const isDisplayed = displayed.includes(entry);
    const display = isDisplayed ? displayFormat(entry) : undefined;
    const printed = isDisplayed ? printedValue(entry, display) : undefined;
    if (isDisplayed && printed === undefined) return fail('UNREADABLE_DISPLAY', `the displayed value of ${entry.name} uses formatting that can't be matched`);
    // Only displayed variables carry a sample value: if the slots ever go stale, test-generator
    // falls back to rewriting every sample value it finds in the text.
    definitions.push({
      id: '',
      name: entry.name,
      kind: 'variable',
      rawExpression: expression.value,
      ...(printed !== undefined ? { sampleValue: printed } : {}),
      ...(display ? { display } : {}),
      dependencies: identifiers(entry.rule).filter((dependency) => byName.has(dependency)),
      source: 'examview-bnk',
    });
  }
  const defined = new Set(definitions.filter((item) => item.kind !== 'condition').map((item) => item.name));
  for (const item of definitions) {
    const missing = identifiers(item.rawExpression).filter((name) => !defined.has(name) && !KNOWN_IDENTIFIERS.has(name.toLowerCase()));
    if (missing.length) return fail('OUTSIDE_VARIABLE', `it uses ${missing.join(', ')}, defined outside the question (e.g. in a shared narrative)`);
  }
  const ordered = orderByDependencies(definitions, defined);
  if (!ordered) return fail('CIRCULAR_RULES', 'its rules depend on each other in a cycle');
  definitions.splice(0, definitions.length, ...ordered);

  const located = locateSlots(question, definitions, refs);
  if (located.error) return fail('TEXT_MISMATCH', located.error);
  const fixedCopy = fixedTextCopies(question, definitions, located.slots, override.acceptFixedText ?? []);
  if (fixedCopy) return fail('FIXED_TEXT_COPY', fixedCopy);
  promoteSignedTerms(question, definitions, located.slots);
  wrapMathValues(question, definitions, located.slots);

  // ExamView authors don't always forbid equal choices (tan 353° and sin 353° both print
  // -0.12). Choices with the same shape are equal exactly when every printed value matches,
  // so require at least one position to differ, comparing values as printed.
  const distinct = distinctChoiceCondition(question, located.slots, definitions);
  if (distinct) {
    definitions.push({
      id: '',
      name: `condition_${definitions.filter((item) => item.kind === 'condition').length + 1}`,
      kind: 'condition',
      rawExpression: distinct.expression,
      dependencies: distinct.names,
      source: 'bnk-decoder: distinct choices',
    });
  }
  definitions.forEach((item, index) => { item.id = `alg-${index + 1}`; });

  return {
    model: {
      scope: { kind: 'question' }, definitions, sequence: [], slots: located.slots,
      ...(graphTemplates.length ? { graphs: graphTemplates } : {}),
    },
  };

  function fail(reasonCode, reason) {
    return { model: undefined, reasonCode, reason };
  }
}

// ExamView evaluates rules in dependency order; test-generator evaluates top to bottom.
// Conditions go as early as their inputs allow so rejected attempts stop quickly.
function orderByDependencies(definitions, defined) {
  const remaining = [...definitions];
  const done = new Set();
  const ordered = [];
  while (remaining.length) {
    const index = remaining.findIndex((item) => identifiers(item.rawExpression)
      .filter((name) => defined.has(name) && name !== item.name)
      .every((name) => done.has(name)));
    if (index < 0) return undefined;
    const [item] = remaining.splice(index, 1);
    ordered.push(item);
    if (item.kind !== 'condition') done.add(item.name);
  }
  return ordered;
}

function identifiers(rule) {
  return [...new Set(rule.replace(/"[^"]*"/g, '').match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [])];
}

// ExamView -> test-generator expression syntax. Anything we can't express exactly fails.
function translateRule(rule) {
  // ExamView accepts "range (-10,10,1)"; test-generator only recognizes calls written "range(".
  let expression = rule.replace(/[–−]/g, '-').replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s+\(/g, '$1(');
  const functions = [...expression.replace(/"[^"]*"/g, '').matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1].toLowerCase());
  const unsupported = functions.find((name) => !SUPPORTED_FUNCTIONS.has(name));
  if (unsupported) return { ok: false, reason: `ExamView's ${unsupported}(), which test-generator can't evaluate` };
  if (/\\/.test(expression.replace(/"[^"]*"/g, ''))) return { ok: false, reason: 'integer division (\\), which test-generator lacks' };

  // choose(index, a, b, ...) picks by index in ExamView but at random in test-generator.
  // A random index over every option means the same thing; otherwise spell it out with if().
  for (let match; (match = expression.match(/\bchoose\(([^()]*(?:\([^()]*(?:\([^()]*\)[^()]*)*\)[^()]*)*)\)/i));) {
    const args = splitArguments(match[1]);
    const count = args[0].match(/^rand\((\d+)\)$/i)?.[1];
    const options = args.slice(1);
    const replacement = Number(count) === options.length
      ? `pick(${options.join(',')})`
      : options.reduceRight((otherwise, option, index) => `if((${args[0]})=${index + 1},${option},${otherwise})`, '""');
    expression = expression.replace(match[0], replacement);
  }
  expression = expression.replace(/\bpick\(/g, 'choose(');
  return { ok: true, value: expression };
}

function splitArguments(value) {
  const args = [];
  let depth = 0;
  let quoted = false;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '"') quoted = !quoted;
    if (quoted) continue;
    if (char === '(') depth += 1;
    else if (char === ')') depth -= 1;
    else if (char === ',' && depth === 0) {
      args.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  args.push(value.slice(start).trim());
  return args;
}

// ExamView display formats -> test-generator's `display`.
function displayFormat(entry) {
  if (entry.format === 4) return { sign: 'always' };
  if (entry.valueType !== 'number') return undefined;
  if (entry.format === 1) return { decimals: entry.decimals };
  if (entry.format === 6) return { decimals: entry.decimals, group: true };
  return undefined;
}

// The sample as test-generator will print it (must equal what the printout shows).
function printedValue(entry, display) {
  // fracs()/mixfracs()/sqrs() values are shown as 2-D math (\x01 + U+F080/F081 escape);
  // test-generator produces them as Typst: "-frac(5, 3)", "2".
  const math = entry.rawDisplay.match(/^\u0001[\uf080\uf081](.*)$/);
  if (math) {
    const rational = math[1].replace(/[\u2013\u2212]/g, '-').trim().match(/^(-?)(\d+)(?:\s+(\d+))?(?:\/(\d+))?$/);
    if (!rational) return undefined;
    const [, sign, first, second, denominator] = rational;
    const magnitude = !denominator ? first : second ? `${first} frac(${second}, ${denominator})` : `frac(${first}, ${denominator})`;
    if (display?.sign === 'always') return `${sign ? '-' : '+'} ${magnitude}`;
    return `${sign}${magnitude}`;
  }
  if (entry.display === undefined) return undefined;
  if (entry.valueType !== 'number') return entry.display.trim() || undefined;
  const magnitude = Math.abs(entry.value);
  let digits = display?.decimals !== undefined
    ? magnitude.toFixed(display.decimals)
    : Number.isInteger(magnitude) ? String(magnitude) : magnitude.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  if (display?.group) {
    const [integer, fraction] = digits.split('.');
    if (integer.length >= 5) digits = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (fraction !== undefined ? `.${fraction}` : '');
  }
  const negative = entry.value < 0 && Number(digits.replace(/ /g, '')) !== 0;
  const text = display?.sign === 'always' ? `${negative ? '-' : '+'} ${digits}` : `${negative ? '-' : ''}${digits}`;
  // Cross-check against ExamView's own display string.
  const stored = entry.display.replace(/\s+/g, '');
  return stored === text.replace(/\s+/g, '') ? text : undefined;
}

// ExamView authors sometimes print a plain value right after a term ("x [dis]" showing
// "x –9"), which reads correctly only while the value is negative. When every place a
// numeric variable is shown follows an operand, print it as a signed term instead.
function promoteSignedTerms(question, definitions, slots) {
  const fields = new Map(questionFields(question));
  const followsOperand = (slot) => {
    const text = fields.get(slot.field);
    let start = -1;
    for (let count = 0; count <= slot.occurrence; count += 1) start = text.indexOf(slot.text, start + 1);
    // Only inside math ($x - 9$); in prose "7 and -7" the word before is not an operand.
    return /^-/.test(slot.text) && mathRegions(text)[start] && /[A-Za-z0-9)]\s*$/.test(text.slice(0, start));
  };
  for (const item of definitions) {
    if (item.kind === 'condition' || item.display?.sign || item.sampleValue === undefined || !/^-?\d/.test(item.sampleValue)) continue;
    const mine = slots.filter((slot) => slot.name === item.name);
    // Only the printed format changes; the slot text must keep matching the source.
    if (mine.length && mine.every(followsOperand)) item.display = { ...item.display, sign: 'always' };
  }
}

// ExamView authors sometimes type a value into the text instead of inserting the variable
// ("her 50 favourite songs" while m = range(50,150,10)); new versions would then contradict
// themselves. Flag a displayed value (2+ characters, to skip coincidences like the 2 in x^2)
// that also appears where no slot covers it.
function fixedTextCopies(question, definitions, slots, accepted) {
  for (const [field, text] of questionFields(question)) {
    const covered = slots.filter((slot) => slot.field === field).map((slot) => {
      let start = -1;
      for (let count = 0; count <= slot.occurrence; count += 1) start = text.indexOf(slot.text, start + 1);
      return [start, start + slot.text.length];
    });
    for (const item of definitions) {
      const value = item.sampleValue;
      if (!value || value.replace(/\s/g, '').length < 2 || accepted.includes(item.name)) continue;
      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      for (const match of text.matchAll(new RegExp(`(?<![\\w.])${escaped}(?![\\w.])`, 'g'))) {
        if (covered.some(([start, end]) => match.index >= start && match.index < end)) continue;
        return `the text also shows ${item.name}'s value ${value} as fixed text, so new versions would contradict themselves (an ExamView authoring issue)`;
      }
    }
  }
  return undefined;
}

// fracs()/mixfracs()/sqrs() produce Typst math ("-frac(5, 7)"); a slot for one in prose
// ("C  -2") would print that source literally, so put the slot itself in math.
function wrapMathValues(question, definitions, slots) {
  const mathValued = new Set(definitions
    .filter((item) => /\b(fracs|mixfracs|sqrs)\(/i.test(item.rawExpression ?? ''))
    .map((item) => item.name));
  const content = question.content;
  const getText = (field) => field === 'body' ? content.stem.text
    : field === 'solution' ? content.solution.text
    : field === 'narrative' ? content.narrative.text
    : content.choices.find((choice) => `choice:${choice.id}` === field).body.text;
  const setText = (field, text) => {
    if (field === 'body') content.stem.text = text;
    else if (field === 'solution') content.solution.text = text;
    else if (field === 'narrative') content.narrative.text = text;
    else content.choices.find((choice) => `choice:${choice.id}` === field).body.text = text;
  };
  // Right to left within a field so earlier positions stay valid.
  const targets = slots
    .filter((slot) => mathValued.has(slot.name))
    .map((slot) => {
      const text = getText(slot.field);
      let start = -1;
      for (let count = 0; count <= slot.occurrence; count += 1) start = text.indexOf(slot.text, start + 1);
      return { slot, start };
    })
    .filter(({ slot, start }) => !mathRegions(getText(slot.field))[start])
    .sort((left, right) => right.start - left.start);
  for (const { slot, start } of targets) {
    const text = getText(slot.field);
    setText(slot.field, `${text.slice(0, start)}$${slot.text}$${text.slice(start + slot.text.length)}`);
  }
}

function questionFields(question) {
  const content = question.content;
  const fields = [['body', content.stem?.text]];
  if (content.narrative?.text) fields.push(['narrative', content.narrative.text]);
  if (content.solution?.text) fields.push(['solution', content.solution.text]);
  for (const choice of content.choices ?? []) fields.push([`choice:${choice.id}`, choice.body.text]);
  return fields.filter(([, text]) => text);
}

// Find exactly where each displayed variable is printed. Each variable must take as many
// places as the BNK references it; places may not overlap. Equation references must be in
// math and text references outside it when that is needed to decide between solutions.
function locateSlots(question, definitions, refs) {
  const displayed = definitions.filter((item) => item.sampleValue !== undefined);
  const candidates = [];
  const fields = questionFields(question);
  for (const [field, text] of fields) {
    const mathMask = mathRegions(text);
    for (const item of displayed) {
      // Mathpix and ExamView space things differently ("(0, -2)" vs "(0,-2)"); the slot
      // records whatever the PQP text actually contains.
      const compact = item.sampleValue.replace(/\s+/g, '');
      const pattern = new RegExp([...compact].map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*'), 'g');
      for (let match; (match = pattern.exec(text));) {
        const index = match.index;
        const end = index + match[0].length;
        pattern.lastIndex = index + 1;
        if (/[A-Za-z0-9_.]/.test(text[index - 1] ?? '') && /^[A-Za-z0-9]/.test(compact)) continue;
        if (/[A-Za-z0-9_.]/.test(text[end] ?? '') && /[A-Za-z0-9]$/.test(compact)) continue;
        candidates.push({ name: item.name, field, start: index, end, text: match[0], inMath: mathMask[index] });
      }
    }
  }
  const need = new Map(displayed.map((item) => [item.name, {
    text: refs.text[item.name] ?? 0,
    equation: refs.equation[item.name] ?? 0,
  }]));

  let solutions = solveAssignment(candidates, need, false);
  if (solutions.length > 1) solutions = solveAssignment(candidates, need, true);
  if (!solutions.length) {
    const short = displayed.find((item) => candidates.filter((c) => c.name === item.name).length < need.get(item.name).text + need.get(item.name).equation);
    return { error: short
      ? `${short.name} is displayed ${need.get(short.name).text + need.get(short.name).equation} time(s) but "${short.sampleValue}" appears fewer times in the text`
      : 'the displayed values overlap in the text in a way that has no consistent reading' };
  }
  if (solutions.length > 1) return { error: 'equal or repeated values make it ambiguous which printed numbers are the variables' };

  const slots = solutions[0].map((candidate) => {
    const text = fields.find(([field]) => field === candidate.field)[1];
    let occurrence = 0;
    for (let index = text.indexOf(candidate.text); index >= 0 && index < candidate.start; index = text.indexOf(candidate.text, index + 1)) occurrence += 1;
    return { name: candidate.name, field: candidate.field, text: candidate.text, occurrence };
  });
  return { slots };
}

// All ways to give each variable exactly its needed number of non-overlapping places (up to 2).
function solveAssignment(candidates, need, strictMath) {
  const names = [...need.keys()];
  const results = [];
  const chosen = [];
  const overlaps = (candidate) => chosen.some((other) => other.field === candidate.field && other.start < candidate.end && candidate.start < other.end);
  const pick = (nameIndex, pool, remaining, fromIndex) => {
    if (results.length > 1) return;
    if (nameIndex === names.length) {
      results.push([...chosen]);
      return;
    }
    const name = names[nameIndex];
    if (remaining === 0) {
      const next = names[nameIndex + 1];
      pick(nameIndex + 1, candidates.filter((c) => c.name === next), next ? need.get(next).text + need.get(next).equation : 0, 0);
      return;
    }
    for (let index = fromIndex; index < pool.length; index += 1) {
      const candidate = pool[index];
      if (overlaps(candidate)) continue;
      chosen.push(candidate);
      pick(nameIndex, pool, remaining - 1, index + 1);
      chosen.pop();
    }
  };
  const first = names[0];
  if (!first) return [[]];
  const filtered = strictMath ? candidates.filter((candidate) => {
    const counts = need.get(candidate.name);
    return candidate.inMath ? counts.equation > 0 : counts.text > 0;
  }) : candidates;
  const run = (list) => {
    const saved = candidates;
    candidates = list;
    pick(0, candidates.filter((c) => c.name === first), need.get(first).text + need.get(first).equation, 0);
    candidates = saved;
  };
  run(filtered);
  if (strictMath) {
    // Math placement must also match the counts exactly.
    return results.filter((solution) => names.every((name) => {
      const mine = solution.filter((c) => c.name === name);
      return mine.filter((c) => c.inMath).length === need.get(name).equation;
    }));
  }
  return results;
}

function mathRegions(text) {
  const mask = new Array(text.length).fill(false);
  let inMath = false;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '$' && text[index - 1] !== '\\') inMath = !inMath;
    mask[index] = inMath;
  }
  return mask;
}

function distinctChoiceCondition(question, slots, definitions) {
  if (question.kind !== 'mcq') return undefined;
  const shown = (name) => {
    const decimals = definitions.find((item) => item.name === name)?.display?.decimals;
    return decimals === undefined ? `(${name})` : `round((${name})*10^${decimals})`;
  };
  const choices = (question.content.choices ?? []).map((choice) => {
    const text = choice.body.text;
    const placed = slots
      .filter((slot) => slot.field === `choice:${choice.id}`)
      .map((slot) => {
        let start = -1;
        for (let count = 0; count <= slot.occurrence; count += 1) start = text.indexOf(slot.text, start + 1);
        return { ...slot, start };
      })
      .sort((left, right) => left.start - right.start);
    let shape = '';
    let cursor = 0;
    for (const slot of placed) {
      shape += `${text.slice(cursor, slot.start)}\u0000`;
      cursor = slot.start + slot.text.length;
    }
    return { shape: shape + text.slice(cursor), names: placed.map((slot) => slot.name) };
  });
  const clauses = [];
  const names = new Set();
  const bare = (shape) => shape.replace(/[$\s]/g, '');
  for (let i = 0; i < choices.length; i += 1) {
    for (let j = i + 1; j < choices.length; j += 1) {
      const [a, b] = [choices[i], choices[j]];
      // A fixed numeric choice ("1") against a choice that is one value.
      for (const [fixed, single] of [[a, b], [b, a]]) {
        if (!fixed.names.length && /^-?\d+(\.\d+)?$/.test(bare(fixed.shape)) && single.names.length === 1 && bare(single.shape) === '\u0000') {
          clauses.push(`${shown(single.names[0])}<>${shown(single.names[0]).replace(`(${single.names[0]})`, `(${bare(fixed.shape)})`)}`);
          names.add(single.names[0]);
        }
      }
      if (!a.names.length || a.shape !== b.shape) continue;
      const differing = a.names.map((name, index) => [name, b.names[index]]).filter(([left, right]) => left !== right);
      if (!differing.length) continue;
      clauses.push(`(${differing.map(([left, right]) => `${shown(left)}<>${shown(right)}`).join(' or ')})`);
      for (const pair of differing) pair.forEach((name) => names.add(name));
    }
  }
  return clauses.length ? { expression: clauses.join(' and '), names: [...names] } : undefined;
}
