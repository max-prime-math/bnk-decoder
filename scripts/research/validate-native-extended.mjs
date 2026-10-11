import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const directory = mkdtempSync('reports/rea-examview/native-extended-');
const cases = [
 ['Area', 'ExamView/Banks/Foundations of Math 10/APL-banks/Area.bnk', 'area-dual-bridge-evidence', 15, 10],
 ['PC11', 'ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk', 'pc11-dual2-bridge-evidence', 81, 30],
 ['GQ-Calculus', 'ExamView/Banks/Calculus/GQ-Calculus.bnk', 'gq-upgraded-dual-bridge-evidence', 146, 103],
];
const report = { scope: 'Verified paired native evidence, both bimodal modes, legacy upgrade, embedded assets and actual Typst compilation. Pixel parity and consumer import are not established.', cases: [] };
function run(script, args, log) {
 const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
 writeFileSync(join(directory, log), result.stdout + result.stderr);
 assert.equal(result.status, 0, `${script}: ${result.stdout}\n${result.stderr}`);
}
for (const [name, source, evidence, records, bimodal] of cases) {
 const before = hash(readFileSync(source)), output = join(directory, `${name}.pqp.json`);
 run('scripts/examview-to-pqp.mjs', [source, output, '--evidence', `reports/rea-examview/runtime-oracle/${evidence}`], `${name}.conversion.log`);
 const pqp = JSON.parse(readFileSync(output));
 assert.equal(hash(readFileSync(source)), before); assert.equal(hash(Buffer.from(pqp.extensions.examviewSource.originalBnkBase64, 'base64')), before);
 assert.equal(pqp.extensions.nativeConversion.status, 'complete'); assert.equal(pqp.extensions.nativeConversion.counts.convertedRecords, records);
 assert.equal(pqp.extensions.nativeConversion.bimodalCoverage.sourceBimodalRecords, bimodal);
 assert.equal(pqp.extensions.nativeConversion.bimodalCoverage.attachedPresentations, bimodal * 2);
 const assets = new Map(pqp.assets.map(asset => [asset.id, asset]));
 for (const question of pqp.questions) {
  for (const id of question.assets ?? []) assert.ok(assets.has(id));
  for (const variant of question.extensions.examview.bimodalPresentations ?? []) for (const id of variant.assets ?? []) assert.ok(assets.has(id));
 }
 assert.ok(pqp.assets.some(asset => asset.extensions.examview.rtfRepair?.originalWmfBase64), 'lossless paired metafile evidence retained');
 run('scripts/research/compile-native-html.mjs', [output, '--batch-size', '100'], `${name}.compile.log`);
 const compile = JSON.parse(readFileSync(`reports/rea-examview/runtime-oracle/typst-compile/${name}-pqp.diagnostics.json`));
 assert.equal(compile.hasError, false); assert.equal(compile.diagnostics.length, 0);
 report.cases.push({ source: resolve(source), output: resolve(output), sourceSha256: before, counts: pqp.extensions.nativeConversion.counts, bimodal: pqp.extensions.nativeConversion.bimodalCoverage, nativeUpgrade: pqp.extensions.examviewSource.nativeUpgrade, compile, warnings: pqp.diagnostics });
 writeFileSync(join(directory, 'summary.json'), JSON.stringify(report, null, 2));
 console.log(`${name}: ${records}/${records} records, ${bimodal * 2} bimodal presentations, ${compile.materials} rich fields compiled.`);
}
run('scripts/research/verify-pqp-types.mjs', [directory], 'package-types.log');
console.log(directory);
