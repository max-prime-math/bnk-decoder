// Integration checks against actual ExamView-authored bank files in this workspace.
// Retains artifacts for review; does not delete or overwrite existing outputs.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
import { unzlibSync } from 'fflate';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';

mkdirSync('reports/rea-examview', { recursive: true });
const directory = mkdtempSync(resolve('reports/rea-examview', 'bnk-pqp-smoke-'));
const cli = resolve('scripts/bnk-to-pqp.mjs');
function run(input, name, expectedStatus) {
  const output = join(directory, name);
  const result = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', cli, input, output], { encoding: 'utf8' });
  assert.equal(result.status, expectedStatus, result.stderr);
  return { output, result, pqp: existsSync(output) ? JSON.parse(readFileSync(output, 'utf8')) : undefined };
}
const publisher = run('ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk', 'publisher.pqp.json', 2);
const first = publisher.pqp.questions.find((q) => q.extensions.examview.questionNumber === 1);
assert.ok(first, 'Publisher Q1 must convert');
assert.match(first.content.stem.text, /f \( x \) = x \^\(2\)/);
assert.match(first.content.stem.text, /g \( x \) = x \^\(2\) - 9/);
assert.deepEqual(first.content.choices.map((choice) => choice.body.text), ['9 units to the left', '9 units to the right', '9 units down', '9 units up']);
assert.deepEqual(first.answer, { type: 'choice', value: 'C' });
assert.equal(first.extensions.examview.storedAlgorithmEntries[0].entries.find((entry) => entry.name === 'k').value, -9);
assert.ok(first.extensions.examview.algorithm.bytes.length);
const counts = publisher.pqp.extensions.bnk.counts;
assert.equal(counts.convertedRecords + counts.omittedRecords, counts.sourceRecords);
assert.equal(publisher.pqp.extensions.bnk.omittedQuestions.length, counts.omittedRecords);
const sourceBank = readQuestionRecords(unzlibSync(readFileSync('ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk').subarray(16)));
const namedEquations = sourceBank.records.filter((record) => record.blocks.some((block) => block.objects.some((object) => object.kind === 'equation' && object.footer?.name)));
assert.ok(namedEquations.some((record) => record.number === 32), 'Actual conditional-alternatives fixture must be present');
for (const record of namedEquations) {
  assert.ok(!publisher.pqp.questions.some((question) => question.extensions.examview.questionNumber === record.number || question.extensions.examview.records?.some((source) => source.questionNumber === record.number)), `Named equation in Q${record.number} must not publish while visibility semantics are unresolved`);
  const omitted = publisher.pqp.extensions.bnk.omittedQuestions.find((item) => item.questionNumber === record.number);
  assert.ok(omitted?.reasons.some((reason) => reason.includes('unsupported named-equation visibility') || (record.type === 'completion' && reason.includes('completion) is not supported'))), `Named equation Q${record.number} must have an explicit diagnostic`);
}
const namedWritten = run('ignore/ExamView/Banks/Foundations of Math 10/APL-banks/Area.bnk', 'named-written-response.pqp.json', 2);
for (const number of [13, 15]) {
  assert.ok(!namedWritten.pqp.questions.some((question) => question.extensions.examview.questionNumber === number), `Named written-response Q${number} must not publish`);
  const omitted = namedWritten.pqp.extensions.bnk.omittedQuestions.find((item) => item.questionNumber === number);
  assert.ok(omitted?.reasons.some((reason) => reason.includes('unsupported named-equation visibility')));
}
const images = run('ignore/ExamView/Banks/Pre-Calculus 12 (Mickelson)/7.5 Pathway Problems.bnk', 'images.pqp.json', 0);
assert.equal(images.pqp.questions.length, 11);
assert.equal(images.pqp.assets.length, 9);
for (const asset of images.pqp.assets) {
  assert.equal(asset.storage.mode, 'inline-base64');
  const bytes = Buffer.from(asset.storage.base64, 'base64');
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let cursor = 8;
  const data = [];
  while (cursor < bytes.length) {
    const length = bytes.readUInt32BE(cursor);
    assert.ok(cursor + length + 12 <= bytes.length);
    if (bytes.toString('ascii', cursor + 4, cursor + 8) === 'IDAT') data.push(bytes.subarray(cursor + 8, cursor + 8 + length));
    cursor += length + 12;
  }
  assert.ok(inflateSync(Buffer.concat(data)).length);
}
for (const q of images.pqp.questions) for (const id of q.assets ?? []) assert.ok(images.pqp.assets.some((asset) => asset.id === id));
const narrative = run('ignore/decoder-lab/narr-01.bnk', 'narrative.pqp.json', 0);
assert.equal(narrative.pqp.questions.length, 2);
for (const q of narrative.pqp.questions) assert.match(q.content.stem.text, /^This is the narrative text\.\n\n(?:first|second)-question$/);
assert.ok(narrative.pqp.extensions.bnk.narratives[0].rawRecordBase64);
const original = readFileSync(images.output);
const refusal = run('ignore/ExamView/Banks/Pre-Calculus 12 (Mickelson)/7.5 Pathway Problems.bnk', 'images.pqp.json', 1);
assert.match(refusal.result.stderr, /Output already exists/);
assert.deepEqual(readFileSync(images.output), original);
const invalid = join(directory, 'invalid.bnk');
writeFileSync(invalid, 'not an ExamView bank', { flag: 'wx' });
assert.equal(run(invalid, 'invalid.pqp.json', 1).pqp, undefined);
console.log(`PQP integration smoke passed: publisher sample values and answer, named conditional-equation exclusions, narrative linkage, nine embedded PNGs, output preservation, invalid-input refusal.\nArtifacts: ${directory}`);
