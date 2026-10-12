import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readNativeRtf } from './read-native-rtf.mjs';
const path = process.argv[2];
const report = JSON.parse(readFileSync(path)), directory = dirname(path);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const banks = [];
for (const previous of report.banks) {
 const output = previous.chapter === 4 ? join(directory, 'native-publisher-dual-chapter04-verified.pqp.json') : previous.output;
 const pqp = JSON.parse(readFileSync(output));
 const source = `ExamView/Banks/Pre-Calculus 12/Chapter ${String(previous.chapter).padStart(2, '0')}.bnk`;
 const digest = hash(readFileSync(source)), conversion = pqp.extensions.nativeConversion;
 assert.equal(conversion.status, 'complete'); assert.equal(conversion.sourceSha256, digest);
 assert.equal(hash(Buffer.from(pqp.extensions.examviewSource.originalBnkBase64, 'base64')), digest);
 assert.equal(conversion.counts.omittedRecords, 0);
 const assets = new Map(pqp.assets.map(asset => [asset.id, asset]));
 for (const asset of assets.values()) assert.ok(asset.id.endsWith(hash(Buffer.from(asset.storage.base64, 'base64')).slice(0, 20)), 'asset content digest');
 const evidence = pqp.extensions.nativeEvidence, receipt = evidence.receipt;
 const inventories = readdirSync(evidence.directory).filter(name => /^inventory-.*\.json$/.test(name)).map(name => JSON.parse(readFileSync(join(evidence.directory, name), 'utf8').replace(/^\uFEFF/, '')));
 function oracle(zip, rtfPath) {
  const inventory = inventories.find(value => resolve(value.zip) === resolve(zip)); assert.ok(inventory);
  const rtf = readNativeRtf(readFileSync(rtfPath)), positions = new Map(); let cursor = 0;
  for (const item of inventory.items) { positions.set(item.ordinal, cursor); cursor += item.type === 'Matching' ? item.responses.length : 1; }
  assert.equal(cursor, rtf.questions.length); return { rtf, positions };
 }
 const primary = oracle(receipt.output, receipt.rtfOutput), alternatives = new Map(receipt.alternateEvidence.map(e => [e.mode, oracle(e.output, e.rtfOutput)]));
 let keys = 0, presentations = 0;
 function check(question, ordinal, reference) {
  for (const id of question.assets ?? []) assert.ok(assets.has(id), 'question asset reference');
  if (question.kind !== 'mcq') return;
  const position = reference.positions.get(ordinal); assert.ok(Number.isInteger(position));
  const key = /^([A-Z](?:,\s*[A-Z])*)(?=\s|$)/i.exec(reference.rtf.questions[position].answer.trim()); assert.ok(key);
  assert.equal(question.answer.value.toUpperCase().replace(/\s/g, ''), key[1].toUpperCase().replace(/\s/g, '')); keys++;
 }
 for (const question of pqp.questions) {
  check(question, question.extensions.examview.nativeExportOrdinal, primary);
  const variants = question.extensions.examview.bimodalPresentations ?? [];
  if (question.classification.questionType === 'bimodal') assert.equal(variants.length, 2);
  for (const variant of variants) { check(variant, variant.nativeExportOrdinal, alternatives.get(variant.mode)); presentations++; }
 }
 assert.equal(presentations, conversion.bimodalCoverage.attachedPresentations);
 if (previous.chapter === 4) {
  const compile = spawnSync(process.execPath, ['scripts/research/compile-native-html.mjs', output], { encoding: 'utf8' });
  writeFileSync(join(directory, 'chapter04.verified.compile.log'), compile.stdout + compile.stderr); assert.equal(compile.status, 0);
 } else assert.equal(previous.typstCompiled, true);
 banks.push({ chapter: previous.chapter, output: resolve(output), status: conversion.status, sourceSha256: digest, counts: conversion.counts, bimodalCoverage: conversion.bimodalCoverage, checkedChoiceKeys: keys, typstCompiled: true, warnings: pqp.diagnostics });
}
const types = spawnSync(process.execPath, ['scripts/research/verify-pqp-types.mjs', directory], { encoding: 'utf8' }); assert.equal(types.status, 0, types.stdout + types.stderr);
const sum = field => banks.reduce((n, bank) => n + bank.counts[field], 0);
const final = { banks, totals: { sourceRecords: sum('sourceRecords'), convertedRecords: sum('convertedRecords'), questions: sum('questions'), assets: sum('assets'), bimodalPresentations: banks.reduce((n, bank) => n + bank.bimodalCoverage.attachedPresentations, 0), checkedChoiceKeys: banks.reduce((n, bank) => n + bank.checkedChoiceKeys, 0) }, limitations: report.limitations };
writeFileSync(join(directory, 'validated-summary.json'), JSON.stringify(final, null, 2), { flag: 'wx' });
console.log(JSON.stringify(final.totals));
