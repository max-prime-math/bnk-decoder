import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';

const originalPath = process.argv[2] ?? 'ExamView/Banks/Calculus/GQ-Calculus.bnk';
const upgradedPath = process.argv[3] ?? 'reports/rea-examview/runtime-oracle/GQ-Calculus-upgraded.bnk';
const original = readFileSync(originalPath);
const upgradedBytes = readFileSync(upgradedPath);
const upgraded = readQuestionRecords(inflateSync(upgradedBytes.subarray(16)));
if (!upgraded) throw new Error('The upgraded v06 fixture is not structurally valid.');
if (original.subarray(0, 16).toString('latin1') !== '\x1aFSCBNK#W#05#00#') throw new Error('Expected the exact v05 signature.');

const headerAt = 16;
const bankId = original.readInt32LE(headerAt);
const count = original.readInt32LE(headerAt + 0x8a8);
const narrativeCount = original.readInt32LE(headerAt + 0x8ac);
const groupCount = original.readInt32LE(headerAt + 0x8b0);
const recordsAt = headerAt + 0x920;
const rows = [];
for (let ordinal = 0; ordinal < count; ordinal++) {
  const at = recordsAt + ordinal * 0x154;
  const pointers = [original.readInt32LE(at + 0x14), original.readInt32LE(at + 0x18)];
  rows.push({
    ordinal,
    at,
    number: original.readInt32LE(at),
    bankId: original.readInt32LE(at + 4),
    typeCode: original.readInt32LE(at + 8),
    narrativeId: original.readInt32LE(at + 0xc),
    repeatedBankId: original.readInt32LE(at + 0x10),
    pointers,
    answerCode: original.readInt32LE(at + 0x1c),
    choiceCount: original.readInt32LE(at + 0x24),
    linked: pointers.map(pointer => pointer === 0 ? null : ({ pointer, length: original.readInt32LE(pointer) })),
  });
}

const upgradedByNumber = new Map(upgraded.records.map(record => [record.number, record]));
const comparisons = rows.map(row => {
  const record = upgradedByNumber.get(row.number);
  return {
    ordinal: row.ordinal,
    number: row.number,
    type: [row.typeCode, record?.typeCode],
    narrative: [row.narrativeId, record?.narrativeId],
    answer: [row.answerCode, record?.answerCode],
    choiceCount: [row.choiceCount, record?.choiceCount],
    present: row.pointers.map(Boolean),
    upgradedPresent: record ? [record.hasQuestion, record.hasSolution] : null,
  };
});
const mismatches = comparisons.filter(row => !row.upgradedPresent || row.type[0] !== row.type[1] || row.narrative[0] !== row.narrative[1] || row.answer[0] !== row.answer[1] || row.choiceCount[0] !== row.choiceCount[1] || row.present.some((value, index) => value !== row.upgradedPresent[index]));
console.log(JSON.stringify({
  original: { path: originalPath, sha256: createHash('sha256').update(original).digest('hex'), bytes: original.length, bankId, count, narrativeCount, groupCount },
  upgraded: { path: upgradedPath, sha256: createHash('sha256').update(upgradedBytes).digest('hex'), records: upgraded.records.length, narratives: upgraded.narratives.length, groups: upgraded.groups.length },
  directoryEnd: recordsAt + count * 0x154,
  firstLinkedOffset: Math.min(...rows.flatMap(row => row.pointers).filter(Boolean)),
  comparisons,
  mismatches,
}, null, 2));
