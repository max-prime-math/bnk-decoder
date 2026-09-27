#!/usr/bin/env node
// Readiness gates for a folder of generated .pqp.json files:
//   1. every question compiles as standalone Typst (images resolved like test-generator does)
//   2. optional: section counts and MCQ/completion answer keys match ExamView RTF exports
//   3. optional: test-generator's own importer accepts every question, and its algorithm
//      engine turns each algorithmic question into variants that resolve and compile
//
// Usage: npm run check:pqp -- <pqp-dir> [rtf-dir]
// Set TEST_GENERATOR_DIR to point at a test-generator checkout (default ../test-generator).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SECTIONS = ['MULTIPLE CHOICE', 'COMPLETION', 'MATCHING', 'SHORT ANSWER', 'PROBLEM'];

const pqpDir = process.argv[2] && resolve(process.argv[2]);
const rtfDir = process.argv[3] && resolve(process.argv[3]);
if (!pqpDir) {
  console.error('Usage: npm run check:pqp -- <pqp-dir> [rtf-dir]');
  process.exit(1);
}

const files = readdirSync(pqpDir)
  .filter((file) => file.endsWith('.pqp.json'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const work = mkdtempSync(join(tmpdir(), 'check-pqp-'));
const rtfText = rtfDir ? convertRtfExports(rtfDir, work) : new Map();
const importer = await loadImporter();

let failures = 0;
const VARIANT_SEEDS = 25;
const RESOLVE_SEEDS = 100;
const totals = { questions: 0, typstFailures: 0, answerChecks: 0, answerMismatches: 0, countMismatches: 0, algorithmic: 0 };

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
  + (importer
    ? `test-generator importer checked; ${totals.algorithmic} algorithmic questions × ${VARIANT_SEEDS} generated variants checked`
    : 'test-generator importer not found, skipped'),
);
process.exit(failures ? 1 : 0);

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
