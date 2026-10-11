#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords, lastRecordFailure } from '../../packages/bnk-core/src/records.ts';
import { findChoiceTable } from '../../packages/bnk-core/src/record-typst.ts';

const fixtures = [
  ['ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk', 71, 5],
  ['ignore/ExamView/Banks/Pre-Calculus 12 (Mickelson)/1.1 Functions and Relations.bnk', 6, 0],
  ['ignore/ExamView/Banks/MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk', 23, 6],
];
for (const [file, count, fields] of fixtures) {
  const payload = inflateSync(readFileSync(file).subarray(16)), bank = readQuestionRecords(payload);
  assert.ok(bank, `${file}: ${lastRecordFailure}`);
  assert.equal(bank.records.length, count);
  assert.equal(bank.records[0].metadata.length, fields);
  if (fields === 5) {
    const choices = findChoiceTable(bank.records[0].blocks[0]);
    assert.ok(choices, 'publisher bare uppercase choice labels');
    assert.equal(choices.choices.map(c => c.label).join(''), 'abcd');
    const equations = bank.records.flatMap(r => r.blocks.flatMap(b => b.objects)).filter(o => o.kind === 'equation');
    assert.equal(equations.length, 217);
    assert.equal(equations.filter(o => o.footer).length, 217);
    assert.ok(equations.every(o => !o.errors.some(e => e.includes('footer'))));
    const equation = equations[0], badFooter = Buffer.from(payload);
    badFooter.writeInt32LE(payload.length, equation.range[1] + 42);
    const altered = readQuestionRecords(badFooter);
    assert.ok(altered);
    assert.ok(altered.records.flatMap(r => r.blocks.flatMap(b => b.objects))
      .some(o => o.kind === 'equation' && o.errors.includes('invalid equation footer text length')));
  }
  const starts = [...bank.records, ...bank.groups].map(r => r.offset).sort((a, b) => a - b);
  for (const r of bank.records) {
    assert.equal(r.prefix.richTextOffset, r.blocks[0].offset);
    const final = r.blocks.at(-1);
    assert.equal(final.offset + final.byteLength, starts.find(at => at > r.offset) ?? payload.length);
    assert.equal(r.algorithmBytes.length, r.prefix.algorithm[1] - r.prefix.algorithm[0] - 4);
  }
  const r = bank.records[0];
  for (const [label, at, value] of [
    ['negative metadata', r.prefix.metadata[0], -1],
    ['oversized metadata', r.prefix.metadata[0], payload.length],
    ['odd metadata', r.prefix.metadata[0], 5],
    ['short algorithm', r.prefix.algorithm[0], 3],
    ['oversized algorithm', r.prefix.algorithm[0], payload.length],
    ['oversized rich-text counts', r.blocks[0].offset + 8, 100000],
  ]) {
    const bad = Buffer.from(payload); bad.writeInt32LE(value, at);
    assert.equal(readQuestionRecords(bad), undefined, label);
    assert.ok(lastRecordFailure, label);
  }
  if (fields) {
    const bad = Buffer.from(payload); bad.writeUInt16LE(65, r.prefix.metadata[1] - 2);
    assert.equal(readQuestionRecords(bad), undefined, 'unterminated metadata');
  }
}
for (const [file, questions, narratives, groups] of [
  ['test-test-bank.bnk', 1, 1, 0],
  ['ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk', 81, 6, 1],
]) {
  const payload = inflateSync(readFileSync(file).subarray(16)), bank = readQuestionRecords(payload);
  assert.ok(bank, lastRecordFailure);
  assert.equal(bank.records.length, questions);
  assert.equal(bank.narratives.length, narratives);
  assert.equal(bank.groups.length, groups);
  const all = [...bank.records, ...bank.narratives, ...bank.groups];
  assert.equal(all[0].offset, 4092);
  for (let n = 1; n < all.length; n++) assert.equal(all[n].offset, all[n - 1].end);
  assert.equal(all.at(-1).end, payload.length);
  const linked = bank.records.filter(r => r.narrativeId > 0);
  assert.ok(linked.length);
  for (const r of linked) assert.ok(bank.narratives.some(n => n.number === r.narrativeId));
  const bad = Buffer.from(payload); bad.writeInt32LE(100001, 0xf58);
  assert.equal(readQuestionRecords(bad), undefined, 'invalid question count');
  assert.equal(readQuestionRecords(payload.subarray(0, 4091)), undefined, 'truncated bank header');
  if (file === 'test-test-bank.bnk') {
    assert.equal(bank.narratives[0].name, 'found-narrative-name');
    assert.equal(bank.narratives[0].blocks[0].text, 'This is a narrative.');
    assert.equal(bank.records[0].narrativeId, 1);
  }
}
{
  const original = inflateSync(readFileSync('test-test-bank.bnk').subarray(16));
  const payload = Buffer.concat([original, Buffer.from([7, 8, 9])]);
  const bank = readQuestionRecords(payload);
  assert.ok(bank);
  assert.deepEqual([...bank.trailingBytes], [7, 8, 9]);
  assert.deepEqual(bank.trailingRange, [original.length, payload.length]);
  assert.equal(bank.diagnostics[0].code, 'OPAQUE_BANK_TRAILER');
}
function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, e.name);
    if (e.isDirectory()) yield* walk(file);
    else if (/\.bnk$/i.test(e.name)) yield file;
  }
}
const results = [];
for (const file of walk(process.argv[2] ?? 'ExamView/Banks')) {
  try {
    const bytes = readFileSync(file);
    if (!/^\x1aFSCBNK#W#06#/.test(bytes.subarray(0, 16).toString('latin1'))) { results.push({ file, status: 'other-version' }); continue; }
    const bank = readQuestionRecords(inflateSync(bytes.subarray(16)));
    results.push(bank ? { file, status: 'parsed', records: bank.records.length, narratives: bank.narratives.length, groups: bank.groups.length,
      trailingBytes: bank.trailingBytes.length, diagnostics: bank.diagnostics,
      equations: bank.records.flatMap(r => r.blocks.flatMap(b => b.objects)).filter(o => o.kind === 'equation').length,
      embeddedVariables: bank.records.flatMap(r => r.blocks.flatMap(b => b.objects)).filter(o => o.kind === 'variable').length,
      equationErrors: bank.records.flatMap(r => r.blocks.flatMap(b => b.objects)).filter(o => o.kind === 'equation' && o.errors.length).length,
    } : { file, status: 'rejected', reason: lastRecordFailure });
  } catch (error) { results.push({ file, status: 'exception', reason: error.message }); }
}
const counts = {};
for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
mkdirSync('reports/rea-examview', { recursive: true });
const summary = { fixturesPassed: fixtures.length + 2, counts, banksWithOpaqueTrailers: results.filter(r => r.trailingBytes).length,
  questions: results.reduce((n, r) => n + (r.records ?? 0), 0), equations: results.reduce((n, r) => n + (r.equations ?? 0), 0), equationErrors: results.reduce((n, r) => n + (r.equationErrors ?? 0), 0) };
writeFileSync('reports/rea-examview/record-prefix-regression.json', JSON.stringify({ ...summary, results }, null, 2) + '\n');
console.log(JSON.stringify(summary));
