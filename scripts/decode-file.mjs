#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { decodeBnkFile, toPortableJson, toTypst } from '../packages/bnk-core/src/index.ts';

const inputPath = process.argv[2];
const outDir = process.argv[3] ?? 'reports/decoded';

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
console.log(`Wrote ${join(outDir, `${baseName}.json`)}`);
console.log(`Wrote ${join(outDir, `${baseName}.typ`)}`);
if (result.assets.length) console.log(`Wrote assets to ${join(outDir, `${baseName}-assets`)}`);

for (const diagnostic of result.diagnostics) {
  console.log(`[${diagnostic.level}] ${diagnostic.code}: ${diagnostic.message}`);
}
