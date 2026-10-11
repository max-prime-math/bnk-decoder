import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { renderRecordQuestion } from '../../packages/bnk-core/src/record-questions.ts';
import { readNativeRtf } from './read-native-rtf.mjs';
import { convertNativeExport } from '../native-export-to-pqp.mjs';
const fixtures = [
  ['MR', 'ExamView/Banks/Pre-Calculus 11 (Mickelson)/2.1 Properties of Rational Expressions.bnk', 'native-rare-MR.pqp.native-AHFSQv'],
  ['TF', 'ExamView/Banks/Pre-Calculus 11 (Mickelson)/1.2 Radical Operations.bnk', 'native-rare-TF.pqp.native-jS2HKT'],
  ['YN', 'ExamView/Banks/Pre-Calculus 11 (Mickelson)/3.6 Law of Cosines.bnk', 'native-rare-YN.pqp.native-uuEw9S'],
];
const results = {};
for (const [type, file, folder] of fixtures) {
  const root = `reports/rea-examview/${folder}`, bytes = fs.readFileSync(file);
  const inventories = fs.readdirSync(root).filter(f => /^inventory.*\.json$/.test(f)).sort();
  const inventory = JSON.parse(fs.readFileSync(`${root}/${inventories.at(-1)}`));
  const common = { inventory, bank: readQuestionRecords(inflateSync(bytes.subarray(16))), sourceName: file, sourceSha256: createHash('sha256').update(bytes).digest('hex'), pairedNativeEvidence: true, rtf: readNativeRtf(fs.readFileSync(`${root}/bank.rtf`)) };
  const result = convertNativeExport(common); results[type] = { common, result };
  // Images in free-response solutions come from native HTML; no RTF callback needed here.
  assert.equal(result.counts.omittedRecords, 0);
  assert.equal(result.pqp.extensions.nativeConversion.status, 'complete');
}
const mr = results.MR.result.pqp.questions.find(q => q.classification.questionType === 'multiple_response');
assert.equal(mr.kind, 'multiple_response');assert.equal(mr.answer.value, 'b, c, d');assert.equal(mr.content.choices.length, 4);
assert.ok(results.MR.result.diagnostics.some(d => d.code === 'NATIVE_MULTIPLE_ANSWER_INDEXING'));
const structural = renderRecordQuestion(results.MR.common.bank.records.find(r => r.number === 1), {});
assert.equal(structural.answer, 'B, C, D');assert.equal(structural.choices.length, 4);
const tf = results.TF.result.pqp.questions.find(q => q.extensions.examview.sourceRecords[0].number === 10);
assert.equal(tf.content.choices.find(c => c.id === tf.answer.value).body.text, 'false');assert.ok(tf.content.solution.text.includes('#box('));
assert.ok(results.TF.result.diagnostics.some(d => d.code === 'NATIVE_TRUE_FALSE_CONDITION_CONFLICT'));
const yn = results.YN.result.pqp.questions.find(q => q.extensions.examview.sourceRecords[0].number === 5);
assert.equal(yn.content.choices.find(c => c.id === yn.answer.value).body.text, 'Yes');
const wrongMask = structuredClone(results.MR.common.bank);wrongMask.records.find(r => r.number === 1).answerCode = 7;
assert.ok(convertNativeExport({ ...results.MR.common, bank: wrongMask }).diagnostics.some(d => d.message.includes('mask conflicts')));
const badRtf = structuredClone(results.TF.common.rtf);badRtf.questions[0].answer = 'T';
assert.ok(convertNativeExport({ ...results.TF.common, rtf: badRtf }).diagnostics.some(d => d.message.includes('boolean key')));
console.log('Actual rare native types verified: TF semantic-key repair/rationale, zero-based MR conjunction with source/RTF corroboration, and YN exported as MC. Conflicting evidence fails closed.');
