#!/usr/bin/env node
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { decodeBnkFile } from '../packages/bnk-core/src/index.ts';
import { reportPath } from './output-paths.mjs';

const inputRoot = process.argv[2] ?? 'ignore/ExamView/Banks';
const outDir = process.argv[3] ?? reportPath('precalc-audit');
const outFile = join(outDir, 'precalc-corpus-quality.json');

const wanted = new Set(['.bnk', '.tst']);
const selected = walk(inputRoot)
  .filter((file) => /Pre-Calculus 11|Pre-Calculus 12/i.test(file))
  .filter((file) => wanted.has(extname(file).toLowerCase()))
  .sort();

const summaries = [];

for (const file of selected) {
  const bytes = readFileSync(file);
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const result = await decodeBnkFile(arrayBuffer, { filename: file, preserveRaw: false });
  const quality = result.stats.quality ?? {
    clean: 0,
    suspect: 0,
    garbage: 0,
    averageScore: 0,
  };

  const topIssues = result.questions
    .filter((question) => question.quality && question.quality.verdict !== 'clean')
    .slice(0, 8)
    .map((question) => ({
      id: question.id,
      score: question.quality?.score ?? 0,
      verdict: question.quality?.verdict ?? 'suspect',
      findings: question.quality?.findings.slice(0, 4).map((finding) => finding.code) ?? [],
      bodyPreview: question.body.text.slice(0, 160),
    }));

  summaries.push({
    file: relative(process.cwd(), file),
    questions: result.stats.questionCount,
    assets: result.stats.assetCount,
    diagnostics: result.stats.diagnosticCount,
    unsupportedFragments: result.stats.unsupportedFragmentCount,
    quality,
    topIssues,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  inputRoot,
  fileCount: summaries.length,
  questionCount: summaries.reduce((sum, entry) => sum + entry.questions, 0),
  quality: {
    clean: summaries.reduce((sum, entry) => sum + entry.quality.clean, 0),
    suspect: summaries.reduce((sum, entry) => sum + entry.quality.suspect, 0),
    garbage: summaries.reduce((sum, entry) => sum + entry.quality.garbage, 0),
    averageScore: summaries.length
      ? Math.round(summaries.reduce((sum, entry) => sum + entry.quality.averageScore, 0) / summaries.length)
      : 0,
  },
  files: summaries,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);

console.table(summaries.map((entry) => ({
  file: entry.file,
  questions: entry.questions,
  clean: entry.quality.clean,
  suspect: entry.quality.suspect,
  garbage: entry.quality.garbage,
  avgScore: entry.quality.averageScore,
  diagnostics: entry.diagnostics,
  unsupported: entry.unsupportedFragments,
})));

console.log(`Files: ${report.fileCount}`);
console.log(`Questions: ${report.questionCount}`);
console.log(`Quality: clean ${report.quality.clean}, suspect ${report.quality.suspect}, garbage ${report.quality.garbage}, avg ${report.quality.averageScore}/100`);
console.log(`Wrote ${outFile}`);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) entries.push(...walk(path));
    else entries.push(path);
  }
  return entries;
}
