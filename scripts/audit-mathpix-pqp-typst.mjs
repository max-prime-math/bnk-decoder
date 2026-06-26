#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { reportPath } from './output-paths.mjs';

const DEFAULT_INPUT = reportPath('mathpix-pqp', 'precalculus-12');

const inputDir = resolve(process.argv[2] ?? DEFAULT_INPUT);
const outputDir = resolve(process.argv[3] ?? join(inputDir, 'typst-audit'));

if (!existsSync(inputDir)) {
  console.error(`Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir)
  .filter((file) => file.endsWith('.pqp.json'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) {
  console.error(`No .pqp.json files found in ${inputDir}`);
  process.exit(1);
}

const report = {
  generatedAt: new Date().toISOString(),
  inputDir,
  outputDir,
  files: [],
};

for (const file of files) {
  const pkg = JSON.parse(readFileSync(join(inputDir, file), 'utf8'));
  const assetMap = assetPathMap(pkg.assets ?? []);
  const typPath = join(outputDir, file.replace(/\.pqp\.json$/i, '.typ'));
  const pdfPath = typPath.replace(/\.typ$/i, '.pdf');
  const typ = renderTypstAudit(pkg, file, assetMap);
  writeFileSync(typPath, typ);

  const compiled = spawnSync('typst', ['compile', '--root', inputDir, typPath, pdfPath], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  const status = compiled.error
    ? 'error'
    : compiled.status === 0
      ? 'ok'
      : 'error';
  report.files.push({
    file,
    questionCount: Array.isArray(pkg.questions) ? pkg.questions.length : 0,
    assetCount: Array.isArray(pkg.assets) ? pkg.assets.length : 0,
    typPath: relative(outputDir, typPath),
    pdfPath: existsSync(pdfPath) ? relative(outputDir, pdfPath) : undefined,
    status,
    error: status === 'error'
      ? (compiled.error?.message ?? compiled.stderr ?? compiled.stdout ?? `typst exited ${compiled.status}`)
      : undefined,
  });
}

report.summary = {
  files: report.files.length,
  compiled: report.files.filter((item) => item.status === 'ok').length,
  failed: report.files.filter((item) => item.status !== 'ok').length,
  questions: report.files.reduce((sum, item) => sum + item.questionCount, 0),
  assets: report.files.reduce((sum, item) => sum + item.assetCount, 0),
};

writeFileSync(join(outputDir, 'typst-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(`Typst audit files: ${report.summary.files}`);
console.log(`Compiled: ${report.summary.compiled}`);
console.log(`Failed: ${report.summary.failed}`);
console.log(`Questions: ${report.summary.questions}`);
console.log(`Output: ${outputDir}`);
if (report.summary.failed) process.exit(1);

function assetPathMap(assets) {
  const map = new Map();
  for (const asset of assets) {
    const filename = typeof asset.filename === 'string' ? asset.filename : '';
    const storage = asset.storage && typeof asset.storage === 'object' && !Array.isArray(asset.storage)
      ? asset.storage
      : {};
    const storagePath = typeof storage.path === 'string' ? storage.path : '';
    const path = storagePath || filename;
    if (!filename || !path) continue;
    const stem = filename.slice(0, filename.length - extname(filename).length) || filename;
    map.set(stem, relative(dirname(join(outputDir, 'audit.typ')), join(inputDir, path)));
  }
  return map;
}

function renderTypstAudit(pkg, file, assetMap) {
  const title = (pkg.source?.label ?? file).replace(/"/g, '\\"');
  const questions = Array.isArray(pkg.questions) ? pkg.questions : [];
  const lines = [
    '#set page(paper: "us-letter", margin: 0.55in)',
    '#set text(size: 8.5pt)',
    '#show heading: it => block(above: 0.8em, below: 0.35em, it)',
    `= ${title}`,
    '',
  ];
  questions.forEach((question, index) => {
    lines.push(`== ${question.id || `question-${index + 1}`}`);
    lines.push(renderQuestion(question, assetMap));
    lines.push('');
  });
  return `${lines.join('\n')}\n`;
}

function renderQuestion(question, assetMap) {
  const content = question.content && typeof question.content === 'object' && !Array.isArray(question.content)
    ? question.content
    : {};
  const blocks = [];
  blocks.push(rewriteImages(textOf(content.stem), assetMap) || '[missing stem]');

  const choices = Array.isArray(content.choices) ? content.choices : [];
  if (choices.length) {
    blocks.push(renderChoices(choices, assetMap));
  }

  const solution = rewriteImages(textOf(content.solution), assetMap);
  if (solution) {
    blocks.push(`#block(inset: 0.45em, stroke: rgb("#dddddd"), radius: 2pt)[\n*Solution.*\n\n${solution}\n]`);
  }
  return blocks.join('\n\n');
}

function renderChoices(choices, assetMap) {
  const cells = choices
    .filter((choice) => choice && typeof choice === 'object' && !Array.isArray(choice))
    .map((choice) => {
      const id = typeof choice.id === 'string' ? choice.id : '?';
      const body = rewriteImages(textOf(choice.body), assetMap);
      return `[(${id}) ${body}]`;
    });
  const columns = Math.min(Math.max(cells.length, 1), 4);
  return `#grid(columns: (${Array(columns).fill('1fr').join(', ')}), column-gutter: 1em, row-gutter: 0.55em, ${cells.join(', ')})`;
}

function textOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && typeof value.text === 'string'
    ? value.text
    : '';
}

function rewriteImages(value, assetMap) {
  return String(value ?? '').replace(/"\/imgs\/([^"]+)"/g, (full, rawName) => {
    const name = rawName.split(/[?#]/, 1)[0];
    const stem = name.includes('.') ? basename(name, extname(name)) : name;
    const assetPath = assetMap.get(stem);
    if (!assetPath) return full;
    return `"${assetPath.replace(/\\/g, '/')}"`;
  });
}
