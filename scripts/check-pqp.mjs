#!/usr/bin/env node
// Readiness gates for a folder of generated .pqp.json files:
//   1. every question compiles as standalone Typst (images resolved like test-generator does)
//   2. optional: section counts and MCQ/completion answer keys match ExamView RTF exports
//   3. optional (--bnk <dir>, for banks decoded without a printout): every choice answer key
//      matches the answer field of its BNK question record, read here independently of the
//      decoder, and every record in the BNK is either shipped or listed as left out
//   4. no decoder placeholders or garbled characters, and every picture is referenced and present
//   5. optional: test-generator's own importer accepts every question, and its algorithm
//      engine turns each algorithmic question into variants that resolve and compile
//
// Usage: npm run check:pqp -- <pqp-dir> [rtf-dir] [--bnk <bnk-dir>]
// Set TEST_GENERATOR_DIR to point at a test-generator checkout (default ../test-generator).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { inflateSync } from 'node:zlib';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SECTIONS = ['MULTIPLE CHOICE', 'COMPLETION', 'MATCHING', 'SHORT ANSWER', 'PROBLEM'];

const args = process.argv.slice(2);
const bnkFlag = args.indexOf('--bnk');
const bnkDir = bnkFlag >= 0 && args[bnkFlag + 1] ? resolve(args[bnkFlag + 1]) : null;
if (bnkFlag >= 0) args.splice(bnkFlag, 2);
const pqpDir = args[0] && resolve(args[0]);
const rtfDir = args[1] && resolve(args[1]);
if (!pqpDir) {
  console.error('Usage: npm run check:pqp -- <pqp-dir> [rtf-dir] [--bnk <bnk-dir>]');
  process.exit(1);
}
// Placeholders the decoders emit when content is missing, and characters that mean garbled text.
const GARBLED = /[\ufffd\ue000-\uf8ff\u0000-\u0008\u000b\u000c\u000e-\u001f]|not decoded|\[embedded|\[\[slot\]\]|\[inline object/i;

const files = readdirSync(pqpDir)
  .filter((file) => file.endsWith('.pqp.json'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const work = mkdtempSync(join(tmpdir(), 'check-pqp-'));
const rtfText = rtfDir ? convertRtfExports(rtfDir, work) : new Map();
const importer = await loadImporter();

let failures = 0;
const VARIANT_SEEDS = 25;
const RESOLVE_SEEDS = 100;
const totals = { questions: 0, typstFailures: 0, answerChecks: 0, answerMismatches: 0, countMismatches: 0, algorithmic: 0, bnkAnswerChecks: 0, bnkProblems: 0, garbled: 0, assetProblems: 0 };

for (const file of files) {
  const raw = readFileSync(join(pqpDir, file), 'utf8');
  const pkg = JSON.parse(raw);
  const problems = [];
  totals.questions += pkg.questions.length;

  for (const failure of compileQuestions(pkg, file)) {
    totals.typstFailures += 1;
    problems.push(`typst ${failure.label}: ${failure.error}`);
  }

  const chapter = file.match(/Chapter \d+/i)?.[0];
  const rtf = chapter ? rtfText.get(chapter.toLowerCase()) : null;
  if (rtf) {
    const key = parseRtfKey(rtf);
    const counts = Object.fromEntries(SECTIONS.map((section) => [section, 0]));
    for (const question of pkg.questions) {
      const [, section, number] = question.provenance.sourceQuestionNumber.match(/^(.*?)(?: (\d+))?$/);
      counts[section] = (counts[section] ?? 0) + 1;
      const expected = key.answers.get(`${section} ${number}`);
      if (expected === undefined) continue;
      const actual = question.answer?.value ?? '';
      if (section === 'MULTIPLE CHOICE' || section === 'COMPLETION') {
        totals.answerChecks += 1;
        if (!answersMatch(section, actual, expected)) {
          totals.answerMismatches += 1;
          problems.push(`answer ${section} ${number}: pqp=${JSON.stringify(actual)} rtf=${JSON.stringify(expected)}`);
        }
      }
    }
    for (const section of SECTIONS) {
      if (section === 'MATCHING') continue;
      const expected = key.counts.get(section) ?? 0;
      if (expected !== counts[section]) {
        totals.countMismatches += 1;
        problems.push(`count ${section}: pqp=${counts[section]} rtf=${expected}`);
      }
    }
  }

  for (const problem of checkTextAndAssets(pkg)) {
    problems.push(problem);
    if (problem.startsWith('garbled')) totals.garbled += 1;
    else totals.assetProblems += 1;
  }

  if (bnkDir) {
    for (const problem of checkBnkAnswers(pkg)) {
      totals.bnkProblems += 1;
      problems.push(problem);
    }
  }

  if (importer) {
    const parsed = importer.parse(raw);
    if (!parsed || parsed.error || parsed.kind !== 'portable-question-package') {
      problems.push(`import: ${parsed?.error ?? 'not recognized as PQP'}`);
    } else if (parsed.questions.length !== pkg.questions.length) {
      problems.push(`import: ${parsed.questions.length}/${pkg.questions.length} questions accepted`);
    } else {
      parsed.questions.forEach((draft, index) => {
        const source = pkg.questions[index];
        if (source.kind === 'mcq' && (!draft.choices || !(draft.answer in draft.choices))) {
          problems.push(`import ${source.provenance.sourceQuestionNumber}: MCQ without a matching choice answer`);
        }
      });
      problems.push(...checkAlgorithms(pkg, parsed.questions, file));
    }
  }

  failures += problems.length;
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${file} (${pkg.questions.length} questions)`);
  for (const problem of problems) console.log(`     ${problem}`);
}

rmSync(work, { recursive: true, force: true });
console.log(
  `\n${totals.questions} questions; typst failures ${totals.typstFailures}; `
  + (rtfDir ? `answer keys ${totals.answerChecks - totals.answerMismatches}/${totals.answerChecks} match RTF; section count mismatches ${totals.countMismatches}; ` : 'RTF check skipped; ')
  + (bnkDir ? `BNK answer keys checked ${totals.bnkAnswerChecks}, BNK problems ${totals.bnkProblems}; ` : '')
  + `garbled text ${totals.garbled}; asset problems ${totals.assetProblems}; `
  + (importer
    ? `test-generator importer checked; ${totals.algorithmic} algorithmic questions × ${VARIANT_SEEDS} generated variants checked`
    : 'test-generator importer not found, skipped'),
);
process.exit(failures ? 1 : 0);

function questionTexts(question) {
  return [
    ['stem', question.content.stem?.text],
    ['narrative', question.content.narrative?.text],
    ['solution', question.content.solution?.text],
    ...(question.content.choices ?? []).map((choice) => [`choice ${choice.id}`, choice.body?.text]),
  ].filter(([, text]) => text);
}

// No placeholders or garbled characters; every picture a question uses is a package asset
// whose file exists, and every package asset is used.
function checkTextAndAssets(pkg) {
  const problems = [];
  const assetNames = new Map((pkg.assets ?? []).map((asset) => [basename(asset.filename, extname(asset.filename)), asset]));
  const used = new Set();
  for (const question of pkg.questions) {
    for (const [field, text] of questionTexts(question)) {
      if (GARBLED.test(text)) problems.push(`garbled ${question.provenance.sourceQuestionNumber} ${field}: ${JSON.stringify(text.match(GARBLED)[0])}`);
      for (const [, name] of text.matchAll(/"\/imgs\/([^"\n]+)"/g)) {
        const stem = basename(name, extname(name));
        used.add(stem);
        if (!assetNames.has(stem)) problems.push(`asset ${question.provenance.sourceQuestionNumber}: picture ${stem} is not a package asset`);
      }
    }
  }
  for (const [name, asset] of assetNames) {
    if (!used.has(name)) problems.push(`asset ${name}: not used by any question`);
    if (asset.storage?.path && !existsSync(resolve(pqpDir, asset.storage.path))) problems.push(`asset ${name}: file ${asset.storage.path} is missing`);
  }
  return problems;
}

// Answer keys against the BNK itself. Record headers are read here with a minimal reader,
// independent of the decoder: int32 question number, bank id, type code, -1, bank id, 1, ..,
// answer (+0x1c), .., choice count (+0x24). Choice answers: 0 = A (True, Yes), 1 = B, ...
function checkBnkAnswers(pkg) {
  const problems = [];
  const label = pkg.source?.label;
  const path = label && join(bnkDir, label);
  if (!path || !existsSync(path)) return [`bnk: ${label ?? 'source file'} not found in ${bnkDir}`];
  const payload = inflateSync(readFileSync(path).subarray(16));
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const bank = view.getInt32(0, true);
  const records = new Map();
  for (let at = 4; at + 0x28 <= payload.byteLength; at += 1) {
    if (view.getInt32(at + 4, true) !== bank || view.getInt32(at + 16, true) !== bank || view.getInt32(at + 12, true) !== -1) continue;
    records.set(view.getInt32(at, true), { type: view.getInt32(at + 8, true), answer: view.getInt32(at + 0x1c, true), choices: view.getInt32(at + 0x24, true) });
  }
  const leftOut = new Set((pkg.diagnostics ?? [])
    .filter((item) => item.code === 'QUESTION_LEFT_OUT')
    .map((item) => Number(item.message.match(/ExamView question (\d+)/)?.[1])));
  const shipped = new Set();
  const OPTIONS = { 0: ['True', 'False'], 5: ['Yes', 'No'] };
  for (const question of pkg.questions) {
    const label = question.provenance.sourceQuestionNumber;
    const number = question.extensions?.examview?.questionNumber;
    const record = records.get(number);
    if (!record) {
      problems.push(`bnk ${label}: no record for ExamView question ${number}`);
      continue;
    }
    shipped.add(number);
    if (question.kind !== 'mcq') {
      if (!question.content.solution?.text?.trim()) problems.push(`bnk ${label}: written-answer question has no answer text`);
      continue;
    }
    totals.bnkAnswerChecks += 1;
    const expected = String.fromCharCode(65 + record.answer);
    if (question.answer?.value !== expected) problems.push(`bnk ${label}: answer ${question.answer?.value} but the BNK record says ${expected}`);
    const choices = question.content.choices ?? [];
    if (OPTIONS[record.type]) {
      const texts = choices.map((choice) => choice.body.text);
      if (JSON.stringify(texts) !== JSON.stringify(OPTIONS[record.type])) problems.push(`bnk ${label}: choices ${JSON.stringify(texts)} for record type ${record.type}`);
    } else if (choices.length !== record.choices) {
      problems.push(`bnk ${label}: ${choices.length} choices, the BNK record has ${record.choices}`);
    }
    if (!choices.some((choice) => choice.id === question.answer?.value)) problems.push(`bnk ${label}: answer is not one of the choices`);
  }
  for (const number of records.keys()) {
    if (!shipped.has(number) && !leftOut.has(number)) problems.push(`bnk: ExamView question ${number} is neither shipped nor listed as left out`);
  }
  return problems;
}

function compileQuestions(pkg, file) {
  const root = join(work, basename(file, '.pqp.json'));
  mkdirSync(join(root, 'imgs'), { recursive: true });
  for (const asset of pkg.assets ?? []) {
    const source = resolve(pqpDir, asset.storage?.path ?? asset.filename);
    const target = join(root, 'imgs', asset.filename);
    if (existsSync(source) && !existsSync(target)) symlinkSync(source, target);
  }
  const extensionByStem = new Map((pkg.assets ?? []).map((asset) => [
    basename(asset.filename, extname(asset.filename)),
    extname(asset.filename),
  ]));

  // Each field goes in its own file, included from one main document, so a single
  // typst run reports every broken field by file path.
  mkdirSync(join(root, 'fields'), { recursive: true });
  const labels = new Map();
  const includes = [];
  pkg.questions.forEach((question, index) => {
    const fields = [
      ['stem', question.content.stem?.text],
      ['narrative', question.content.narrative?.text],
      ['solution', question.content.solution?.text],
      ...(question.content.choices ?? []).map((choice) => [`choice ${choice.id}`, choice.body?.text]),
    ].filter(([, text]) => text);
    fields.forEach(([field, text], fieldIndex) => {
      const name = `fields/q${index}-f${fieldIndex}.typ`;
      const source = text.replace(/"\/imgs\/([^"]+)"/g, (full, imageName) => (
        extname(imageName) ? full : `"/imgs/${imageName}${extensionByStem.get(imageName) ?? ''}"`
      ));
      writeFileSync(join(root, name), `${source}\n`);
      labels.set(name, `${question.provenance.sourceQuestionNumber} ${field}`);
      includes.push(`#block(include "${name}")`);
    });
  });
  const mainPath = join(root, 'main.typ');
  writeFileSync(mainPath, `#set page(width: 6.5in, height: auto, margin: 0.25in)\n${includes.join('\n')}\n`);
  const result = spawnSync('typst', ['compile', '--root', root, mainPath, join(root, 'main.pdf')], { encoding: 'utf8' });
  if (result.status === 0) return [];

  const failures = [];
  const errorPattern = /error: (.*)\n\s*┌─ (.+?):\d+:\d+/g;
  for (const [, message, path] of result.stderr.matchAll(errorPattern)) {
    const name = path.slice(path.indexOf('fields/'));
    failures.push({ label: labels.get(name) ?? name, error: message.trim() });
  }
  if (!failures.length) failures.push({ label: 'document', error: result.stderr.trim().split('\n')[0] });
  return failures;
}

// Generate variants with test-generator's own engine and make sure each one is usable.
function checkAlgorithms(pkg, drafts, file) {
  const problems = [];
  const variantQuestions = [];
  const generatedAssets = [];
  drafts.forEach((draft, index) => {
    if (!draft.algorithmModel) return;
    totals.algorithmic += 1;
    const label = pkg.questions[index].provenance.sourceQuestionNumber;
    // Every picture in a question with new values must be redrawn with them.
    const templated = new Set((draft.algorithmModel.graphs ?? []).map((graph) => graph.image));
    const pictures = JSON.stringify([draft.body, draft.choices, draft.solution]).match(/\/imgs\/[\w-]+/g) ?? [];
    const fixed = [...new Set(pictures.map((ref) => ref.slice(6)))].filter((name) => !templated.has(name));
    if (fixed.length) {
      problems.push(`variant ${label}: picture(s) ${fixed.join(', ')} would not follow new values`);
      return;
    }
    // Strict conditions can make some seeds fail, so sample more seeds than we compile.
    for (let seed = VARIANT_SEEDS + 1; seed <= RESOLVE_SEEDS; seed += 1) {
      const warning = importer.calculate(draft, seed).diagnostics.find((item) => item.level !== 'info');
      if (warning) {
        problems.push(`variant ${label} seed ${seed}: ${warning.message}`);
        return;
      }
    }
    for (let seed = 1; seed <= VARIANT_SEEDS; seed += 1) {
      const result = importer.calculate(draft, seed);
      const warning = result.diagnostics.find((item) => item.level !== 'info');
      const unresolved = result.updates.algorithmEvaluation.entries.filter((entry) => entry.status !== 'resolved');
      if (warning || unresolved.length) {
        problems.push(`variant ${label} seed ${seed}: ${warning?.message ?? `unresolved ${unresolved.map((entry) => entry.name).join(', ')}`}`);
        return;
      }
      const choices = Object.values(result.updates.choices ?? {});
      if (new Set(choices).size !== choices.length) {
        problems.push(`variant ${label} seed ${seed}: duplicate choices ${JSON.stringify(result.updates.choices)}`);
        return;
      }
      // Graphs redrawn for this variant: compile against the generated SVGs.
      for (const image of result.images ?? []) {
        const path = join(work, 'generated', `${image.name}.svg`);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, image.svg);
        generatedAssets.push({ filename: `${image.name}.svg`, storage: { path } });
      }
      variantQuestions.push({
        provenance: { sourceQuestionNumber: `${label} seed ${seed}` },
        content: {
          stem: { text: result.updates.body },
          solution: result.updates.solution ? { text: result.updates.solution } : undefined,
          choices: Object.entries(result.updates.choices ?? {}).map(([id, text]) => ({ id, body: { text } })),
        },
      });
    }
    const mismatch = recomputeMismatch(draft, importer);
    if (mismatch) problems.push(`variant ${label}: ${mismatch}`);
  });
  for (const failure of compileQuestions({ assets: [...(pkg.assets ?? []), ...generatedAssets], questions: variantQuestions }, file.replace('.pqp.json', '-variants.pqp.json'))) {
    problems.push(`variant typst ${failure.label}: ${failure.error}`);
  }
  return problems;
}

// Recompute every deterministic rule from the engine's own inputs; a disagreement means the
// engine could not evaluate the rule and silently kept the old sample value.
function recomputeMismatch(draft, engine) {
  for (let seed = 1; seed <= VARIANT_SEEDS; seed += 1) {
    const entries = engine.calculate(draft, seed).updates.algorithmEvaluation.entries;
    const values = new Map(entries.map((entry) => [entry.name, entry.value]));
    for (const definition of draft.algorithmModel.definitions) {
      const rule = definition.rawExpression ?? '';
      if (!rule || /\b(range|rand|choose)\s*\(/i.test(rule) || definition.kind === 'condition') continue;
      const expected = evaluateRule(rule, values);
      const actual = values.get(definition.name);
      if (expected === undefined || actual === undefined) continue;
      const same = typeof expected === 'number'
        // Engine values are reported to 6 decimals, which steep functions (tan) amplify.
        ? Math.abs(expected - Number(actual)) <= 1e-3 * Math.max(1, Math.abs(expected))
        : String(expected) === String(actual) || (typeof expected === 'boolean' && String(Number(expected)) === String(actual));
      if (!same) return `${definition.name} = ${rule} should be ${expected} but test-generator produced ${actual} (seed ${seed})`;
    }
  }
  return undefined;
}

function evaluateRule(rule, values) {
  const strings = [];
  let js = rule.replace(/"[^"]*"/g, (literal) => `__s${strings.push(literal) - 1}__`)
    .replace(/\bAND\b/gi, '&&').replace(/\bOR\b/gi, '||').replace(/\bNOT\b/gi, '!')
    .replace(/<>/g, '!=').replace(/(?<![<>=!])=(?!=)/g, '==').replace(/\^/g, '**')
    .replace(/\bif\s*\(/gi, '__if(');
  js = js.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (token) => {
    if (/^__(s\d+__|if|round)$/.test(token)) return token;
    const lower = token.toLowerCase();
    if (lower === 'pi') return 'Math.PI';
    if (lower === 'true' || lower === 'false') return lower;
    if (values.has(token)) {
      const value = values.get(token);
      return /^-?\d+(\.\d+)?$/.test(value) ? `(${value})` : JSON.stringify(value);
    }
    if (lower === 'round') return '__round';
    const math = { ceiling: 'ceil', int: 'trunc', ln: 'log', log: 'log10' }[lower] ?? lower;
    return typeof Math[math] === 'function' ? `Math.${math}` : token;
  }).replace(/__s(\d+)__/g, (_match, index) => strings[Number(index)]);
  try {
    const round = (x, digits = 0) => Math.round(x * 10 ** digits) / 10 ** digits;
    const value = Function('__if', '__round', `"use strict"; return (${js});`)((condition, a, b) => (condition ? a : b), round);
    return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' ? value : undefined;
  } catch {
    return undefined;
  }
}

function convertRtfExports(dir, workDir) {
  const out = join(workDir, 'rtf');
  mkdirSync(out, { recursive: true });
  const rtfs = readdirSync(dir).filter((file) => file.toLowerCase().endsWith('.rtf'));
  const result = spawnSync('soffice', ['--headless', '--convert-to', 'txt:Text', '--outdir', out, ...rtfs.map((file) => join(dir, file))], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`soffice failed to convert RTF exports: ${result.stderr}`);
    process.exit(1);
  }
  const texts = new Map();
  for (const file of readdirSync(out)) {
    const chapter = file.match(/Chapter \d+/i)?.[0];
    if (chapter) texts.set(chapter.toLowerCase(), readFileSync(join(out, file), 'utf8').replace(/^﻿/, ''));
  }
  return texts;
}

// ExamView RTF exports list each section header, then numbered questions, each
// followed by "ANS:<tab>value<tab>DIF:...". Completion answers can wrap.
function parseRtfKey(text) {
  const answers = new Map();
  const counts = new Map();
  let section = null;
  let number = null;
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (SECTIONS.includes(trimmed)) {
      section = trimmed;
      continue;
    }
    if (!section) continue;
    const question = line.match(/^\t?(\d+)\.\t(?!ANS)/);
    if (question) {
      number = Number(question[1]);
      counts.set(section, Math.max(counts.get(section) ?? 0, number));
      continue;
    }
    const answer = trimmed.match(/^ANS:\t([^\t]*)/);
    if (answer && number !== null) answers.set(`${section} ${number}`, answer[1].trim());
  }
  return { answers, counts };
}

function answersMatch(section, actual, expected) {
  if (section === 'MULTIPLE CHOICE') return actual === expected;
  // RTF renders math answers as pictures, so only compare the plain text it kept.
  const plain = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!plain(expected)) return true;
  return plain(actual).includes(plain(expected));
}

async function loadImporter() {
  const dir = resolve(process.env.TEST_GENERATOR_DIR ?? join(SCRIPT_DIR, '../../test-generator'));
  const modulePath = join(dir, 'src/lib/bulk-import.ts');
  if (!existsSync(modulePath)) return null;
  try {
    const module = await import(pathToFileURL(modulePath).href);
    const variants = await import(pathToFileURL(join(dir, 'src/lib/algorithm-variant.ts')).href);
    return { parse: module.parseBulkImportJson, calculate: variants.calculateAlgorithmicQuestionVariant };
  } catch (error) {
    console.warn(`Could not load test-generator importer (${error.message}); run with node --experimental-strip-types.`);
    return null;
  }
}
