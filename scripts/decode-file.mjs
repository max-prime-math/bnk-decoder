#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { decodeBnkFile, toPortableJson, toPortableQuestionPackage, toTypst } from '../packages/bnk-core/src/index.ts';
import { reportPath } from './output-paths.mjs';

const inputPath = process.argv[2];
const outDir = process.argv[3] ?? reportPath('decoded');

if (!inputPath) {
  console.error('Usage: npm run decode:file -- <path-to-bnk-or-tst> [output-dir]');
  process.exit(1);
}

const bytes = readFileSync(inputPath);
const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const result = await decodeBnkFile(arrayBuffer, { filename: inputPath });
const baseName = basename(inputPath).replace(/\.[^.]+$/, '');

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${baseName}.json`), `${JSON.stringify(toPortableJson(result), null, 2)}\n`);
writeFileSync(join(outDir, `${baseName}.pqp.json`), `${JSON.stringify(toPortableQuestionPackage(result), null, 2)}\n`);
writeFileSync(join(outDir, `${baseName}.typ`), toTypst(result, { includeDiagnostics: true }));

if (result.assets.length) {
  const assetDir = join(outDir, `${baseName}-assets`);
  mkdirSync(assetDir, { recursive: true });
  for (const asset of result.assets) {
    writeFileSync(join(assetDir, asset.filename ?? `${asset.id}.bin`), asset.bytes);
  }
}

console.log(`Decoded ${inputPath}`);
console.log(`Questions: ${result.stats.questionCount}`);
console.log(`Assets: ${result.stats.assetCount}`);
console.log(`Diagnostics: ${result.stats.diagnosticCount}`);
console.log(`Unsupported fragments: ${result.stats.unsupportedFragmentCount}`);
if (result.stats.quality) {
  console.log(
    `Quality: clean ${result.stats.quality.clean}, suspect ${result.stats.quality.suspect}, garbage ${result.stats.quality.garbage}, avg ${result.stats.quality.averageScore}/100`,
  );
}
console.log(`Wrote ${join(outDir, `${baseName}.json`)}`);
console.log(`Wrote ${join(outDir, `${baseName}.pqp.json`)}`);
console.log(`Wrote ${join(outDir, `${baseName}.typ`)}`);
if (result.assets.length) console.log(`Wrote assets to ${join(outDir, `${baseName}-assets`)}`);

const qualityIssues = result.questions
  .filter((question) => question.quality && question.quality.verdict !== 'clean')
  .slice(0, 10);

if (qualityIssues.length) {
  console.log('Quality issues:');
  for (const question of qualityIssues) {
    const findings = question.quality?.findings.slice(0, 3).map((finding) => finding.code).join(', ') ?? 'none';
    console.log(`  - ${question.id}: ${question.quality?.verdict} (${question.quality?.score}/100) [${findings}]`);
  }
}

for (const diagnostic of result.diagnostics) {
  console.log(`[${diagnostic.level}] ${diagnostic.code}: ${diagnostic.message}`);
}
