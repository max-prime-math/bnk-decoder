#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { decodeBnkFile } from '../packages/bnk-core/src/index.ts';
import { reportPath } from './output-paths.mjs';

const outDir = process.argv[2] ?? reportPath('dialect-regression');
const jsonOut = join(outDir, 'dialect-regression.json');
const mdOut = join(outDir, 'dialect-regression.md');

const fixtures = [
  {
    dialect: 'v06-precalculus-standard',
    label: 'Pre-Calculus 11 baseline',
    path: 'ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk',
    expectInflated: true,
    minQuestions: 20,
    maxGarbage: 2,
    minAverageScore: 85,
  },
  {
    dialect: 'v06-precalculus-standard',
    label: 'Pre-Calculus 12 baseline',
    path: 'ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk',
    expectInflated: true,
    minQuestions: 20,
    maxGarbage: 2,
    minAverageScore: 85,
  },
  {
    dialect: 'v06-precalculus-mickelson',
    label: 'Pre-Calculus 11 Mickelson stress',
    path: 'ignore/ExamView/Banks/Pre-Calculus 11 (Mickelson)/4.6 Reciprocal Functions.bnk',
    expectInflated: true,
    minQuestions: 5,
    maxGarbage: 8,
    minAverageScore: 55,
  },
  {
    dialect: 'v06-precalculus-mickelson',
    label: 'Pre-Calculus 12 Mickelson representative',
    path: 'ignore/ExamView/Banks/Pre-Calculus 12 (Mickelson)/1.1 Functions and Relations.bnk',
    expectInflated: true,
    minQuestions: 1,
    maxGarbage: 2,
    minAverageScore: 70,
  },
  {
    dialect: 'v06-mathworks',
    label: 'MathWorks 11 representative',
    path: 'ignore/ExamView/Banks/MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk',
    expectInflated: true,
    minQuestions: 5,
    maxGarbage: 8,
    minAverageScore: 55,
  },
  {
    dialect: 'v06-foundations',
    label: 'Foundations of Math 10 representative',
    path: 'ignore/ExamView/Banks/Foundations of Math 10/Chapter 01/MMS10_1.1.bnk',
    expectInflated: true,
    minQuestions: 5,
    maxGarbage: 8,
    minAverageScore: 55,
  },
  {
    dialect: 'v06-math-makes-sense',
    label: 'Math Makes Sense 9 representative',
    path: 'ignore/ExamView/Banks/Math Makes Sense 9/Unit 01/MMS9_1.1.bnk',
    expectInflated: true,
    minQuestions: 5,
    maxGarbage: 8,
    minAverageScore: 55,
  },
  {
    dialect: 'v06-math-apprenticeship',
    label: 'Math Apprenticeship 10 representative',
    path: 'ignore/ExamView/Banks/Math Apprenticeship 10/Chapter 01 AW10.bnk',
    expectInflated: true,
    minQuestions: 5,
    maxGarbage: 8,
    minAverageScore: 55,
  },
  {
    dialect: 'v05-calculus',
    label: 'Calculus v05 representative',
    path: 'ignore/ExamView/Banks/Calculus/GQ-Calculus.bnk',
    expectInflated: false,
    minQuestions: 100,
    maxGarbage: 10,
    minAverageScore: 75,
  },
];

const summaries = [];
let failed = 0;

for (const fixture of fixtures) {
  const bytes = readFileSync(fixture.path);
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const result = await decodeBnkFile(arrayBuffer, { filename: fixture.path, preserveRaw: false });
  const quality = result.stats.quality ?? {
    clean: 0,
    suspect: 0,
    garbage: 0,
    averageScore: 0,
  };

  const checks = [];
  checks.push(check('inflated', result.source.inflatedByteLength !== undefined, fixture.expectInflated));
  checks.push(check('minQuestions', result.stats.questionCount >= fixture.minQuestions, true));
  checks.push(check('maxGarbage', quality.garbage <= fixture.maxGarbage, true));
  checks.push(check('minAverageScore', quality.averageScore >= fixture.minAverageScore, true));
  if (fixture.expectedUnsupported) {
    checks.push(check('expectedUnsupported', result.stats.questionCount === 0 || result.source.examView?.majorVersion === '05', true));
  }
  const pass = checks.every((item) => item.pass);
  if (!pass) failed++;

  summaries.push({
    dialect: fixture.dialect,
    label: fixture.label,
    path: fixture.path,
    source: {
      detectedFormat: result.source.detectedFormat,
      version: result.source.examView ? `${result.source.examView.platform} ${result.source.examView.majorVersion}.${result.source.examView.minorVersion}` : 'unknown',
      inflatedByteLength: result.source.inflatedByteLength ?? 0,
      dialect: result.source.dialect,
    },
    stats: {
      questions: result.stats.questionCount,
      diagnostics: result.stats.diagnosticCount,
      unsupportedFragments: result.stats.unsupportedFragmentCount,
      quality,
    },
    checks,
    pass,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  fixtureCount: summaries.length,
  passed: summaries.length - failed,
  failed,
  summaries,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = [];
md.push('# Dialect Regression Report');
md.push('');
md.push(`- Generated: ${report.generatedAt}`);
md.push(`- Fixtures: ${report.fixtureCount}`);
md.push(`- Passed: ${report.passed}`);
md.push(`- Failed: ${report.failed}`);
md.push('');
md.push('| Dialect | Label | Questions | Clean | Suspect | Garbage | Avg Score | Pass |');
md.push('|---|---|---:|---:|---:|---:|---:|---|');
for (const summary of summaries) {
  md.push(`| ${summary.dialect} | ${summary.label} | ${summary.stats.questions} | ${summary.stats.quality.clean} | ${summary.stats.quality.suspect} | ${summary.stats.quality.garbage} | ${summary.stats.quality.averageScore} | ${summary.pass ? 'yes' : 'no'} |`);
}
md.push('');
md.push('## Fixture Checks');
md.push('');
for (const summary of summaries) {
  md.push(`### ${summary.label}`);
  md.push('');
  md.push(`- Path: \`${summary.path}\``);
  md.push(`- Detected dialect: \`${summary.source.dialect?.profile ?? 'unknown'}\``);
  md.push(`- Version: \`${summary.source.version}\``);
  for (const checkResult of summary.checks) {
    md.push(`- ${checkResult.name}: ${checkResult.pass ? 'pass' : 'fail'} (expected ${formatExpected(checkResult.expected)}, actual ${formatExpected(checkResult.actual)})`);
  }
  md.push('');
}
writeFileSync(mdOut, `${md.join('\n')}\n`);

console.table(summaries.map((summary) => ({
  dialect: summary.dialect,
  label: summary.label,
  questions: summary.stats.questions,
  clean: summary.stats.quality.clean,
  suspect: summary.stats.quality.suspect,
  garbage: summary.stats.quality.garbage,
  avgScore: summary.stats.quality.averageScore,
  pass: summary.pass,
})));
console.log(`Wrote ${relative(process.cwd(), jsonOut)}`);
console.log(`Wrote ${relative(process.cwd(), mdOut)}`);
if (failed > 0) process.exitCode = 1;

function check(name, actual, expected) {
  return {
    name,
    pass: actual === expected || (expected === true && actual === true),
    expected,
    actual,
  };
}

function formatExpected(value) {
  if (typeof value === 'number' && !Number.isFinite(value)) return 'infinity';
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}
