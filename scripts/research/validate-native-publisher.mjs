// Rebuild all publisher chapters from synchronized, hash-verified native evidence.
// Retains every prior artifact and independently checks choice keys against native RTF.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readNativeRtf } from './read-native-rtf.mjs';
const output = mkdtempSync(resolve('reports/rea-examview/native-publisher-'));
const banks = [], totals = { sourceRecords: 0, convertedRecords: 0, questions: 0, assets: 0, checkedChoiceKeys: 0 };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (let chapter = 1; chapter <= 11; chapter++) {
  const label = String(chapter).padStart(2, '0');
  const initial = JSON.parse(readFileSync(`reports/rea-examview/native-chapter${label}.pqp.json`, 'utf8'));
  const evidence = initial.extensions.nativeEvidence.directory;
  const input = `ExamView/Banks/Pre-Calculus 12/Chapter ${label}.bnk`, target = join(output, `Chapter ${label}.pqp.json`);
  const before = hash(readFileSync(input));
  const converted = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'scripts/examview-to-pqp.mjs', input, target, '--evidence', evidence], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  assert.equal(converted.status, 0, converted.stdout + converted.stderr);
  assert.equal(hash(readFileSync(input)), before);
  const pqp = JSON.parse(readFileSync(target, 'utf8')), counts = pqp.extensions.nativeConversion.counts;
  assert.equal(pqp.extensions.nativeConversion.status, 'complete');
  assert.equal(counts.omittedRecords, 0);
  const rtf = readNativeRtf(readFileSync(join(evidence, 'bank.rtf')));
  assert.equal(rtf.questions.length, counts.sourceRecords, 'Native RTF record coverage');
  let sourceOrdinal = 0, checkedChoiceKeys = 0;
  const assetIds = new Set(pqp.assets.map(asset => asset.id));
  assert.equal(assetIds.size, pqp.assets.length);
  for (const question of pqp.questions) {
    for (const id of question.assets ?? []) assert.ok(assetIds.has(id), `missing asset ${id}`);
    if (question.kind === 'mcq') {
      assert.equal(question.answer.value.toUpperCase(), rtf.questions[sourceOrdinal].answer.trim().toUpperCase(), `Chapter ${label} choice key at source ordinal ${sourceOrdinal + 1}`);
      checkedChoiceKeys++;
    }
    sourceOrdinal += question.extensions.examview.sourceRecords.length;
  }
  assert.equal(sourceOrdinal, counts.sourceRecords);
  const compile = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'scripts/research/compile-native-html.mjs', target], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  assert.equal(compile.status, 0, compile.stdout + compile.stderr);
  const warnings = pqp.diagnostics.filter(d => d.level !== 'info');
  banks.push({ chapter, output: target, evidence, counts, checkedChoiceKeys, sourceSha256: before, typstCompiled: true, warnings });
  for (const key of ['sourceRecords', 'convertedRecords', 'questions', 'assets']) totals[key] += counts[key];
  totals.checkedChoiceKeys += checkedChoiceKeys;
  console.log(`Chapter ${label}: ${counts.convertedRecords}/${counts.sourceRecords} records, ${counts.questions} questions, ${counts.assets} assets; ${checkedChoiceKeys} native choice keys checked; Typst compiled.`);
  writeFileSync(join(output, 'summary.json'), JSON.stringify({ output, totals, banks, limitations: ['Record coverage and compilation do not establish pixel parity or importer acceptance.', 'Native Windows font substitutions are explicitly recorded; absent original font semantics remain unknown.', 'Native snapshots preserve one loaded instance; randomized variants are not reproduced.'] }, null, 2));
}
assert.equal(totals.sourceRecords, 739);
assert.equal(totals.convertedRecords, 739);
console.log(JSON.stringify({ output, totals }));
