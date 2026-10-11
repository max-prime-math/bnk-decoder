#!/usr/bin/env node
// Research inference only: candidate validation does not establish ExamView field semantics.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { dirname } from 'node:path';

const output = process.argv[2] ?? 'reports/rea-examview/rich-block-inventory.json';
const files = process.argv.slice(3);
if (!files.length) files.push(
  'ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk',
  'ignore/ExamView/Banks/Pre-Calculus 12 (Mickelson)/1.1 Functions and Relations.bnk',
  'ignore/ExamView/Banks/MathWorks 11/Ch1-Slope and Rate of Change/1.1 Rise Over Run.bnk',
  'test-test-bank.bnk',
);
function inventory(file) {
  const bytes = readFileSync(file), p = inflateSync(bytes.subarray(16));
  const v = new DataView(p.buffer, p.byteOffset, p.length), bankId = v.getInt32(0, true);
  const i32 = at => v.getInt32(at, true);
  const starts = [];
  for (let at = 4; at + 24 <= p.length; at++) {
    if (i32(at + 4) === bankId && i32(at + 12) === -1 && [0, bankId].includes(i32(at + 16)) && i32(at + 20) === 1) starts.push(at);
  }
  function candidate(at, end) {
    if (at + 60 > end) return;
    const h = Array.from({ length: 15 }, (_, n) => i32(at + n * 4));
    const [length, one, chars, paraRuns, paraStyles, charRuns, charStyles, faces, , , tables, cells, objects] = h;
    if (length < 60 || at + length > end || one !== 1 || h[13] !== 1 || h[14] !== 0) return;
    if ([chars, paraRuns, paraStyles, charRuns, charStyles, faces, tables, cells, objects].some(n => n < 0 || n > 100000)) return;
    let cursor = at + 60 + chars * 2 + 2 + paraRuns * 12 + paraStyles * 168 + charRuns * 12 + charStyles * 24 + faces * 66 + tables * 20 + cells * 52 + objects * 72;
    const blockEnd = at + length;
    if (cursor > blockEnd) return;
    for (let n = 0; n < objects; n++) {
      if (cursor + 4 > blockEnd) return;
      const size = i32(cursor);
      if (size < 0 || cursor + 4 + size > blockEnd) return;
      cursor += 4 + size;
    }
    if (cursor !== blockEnd) return;
    return { offset: at, length, chars, tables, objects, textPreview: p.subarray(at + 60, at + 60 + Math.min(chars, 130) * 2).toString('utf16le') };
  }
  const records = starts.map((offset, index) => {
    const end = starts[index + 1] ?? p.length, blocks = [];
    for (let at = offset + 24; at + 60 <= end; at++) {
      const b = candidate(at, end);
      if (b) { blocks.push({ ...b, relative: at - offset }); at += b.length - 1; }
    }
    const chainsEndingAtRecordEnd = [];
    for (const first of blocks) {
      const chain = [first]; let next = first.offset + first.length;
      while (next < end) { const b = blocks.find(b => b.offset === next); if (!b) break; chain.push(b); next += b.length; }
      if (next === end) chainsEndingAtRecordEnd.push(chain.map(b => b.offset));
    }
    // Probe variable-count zero-terminated metadata strings. At +532 the first int32 plausibly
    // contains their block byte size counting its four-byte length field and string terminators.
    const at = offset + 532; let metadata;
    if (at + 4 < end) {
      const length = i32(at);
      if (length >= 4 && length < 10000 && at + length <= end) {
        const text = p.subarray(at + 4, at + length).toString('utf16le');
        const fields = text.split('\0');
        metadata = { relative: 532, length, fields, endsAtRelative: 532 + length, stringCount: fields.length - 1, terminatedStringBlock: fields[fields.length - 1] === '' };
      }
    }
    let algorithm;
    if (metadata) {
      const algorithmAt = offset + metadata.endsAtRelative;
      if (algorithmAt + 4 <= end) {
        const length = i32(algorithmAt);
        if (length >= 4 && algorithmAt + length <= end) algorithm = {
          relative: algorithmAt - offset, length, endsAtRelative: algorithmAt + length - offset,
          followedImmediatelyByRichText: blocks.some(b => b.offset === algorithmAt + length),
        };
      }
    }
    return { offset, end, number: i32(offset), typeCode: i32(offset + 8), blocks, chainsEndingAtRecordEnd, metadata, algorithm };
  });
  return { file, bankId, inflatedLength: p.length, recordsDetected: starts.length, fullCandidates: records.reduce((n, r) => n + r.blocks.length, 0), alignedRecords: records.filter(r => r.chainsEndingAtRecordEnd.length).length, firstRecords: records.slice(0, 3), relativeBlockOffsets: [...new Set(records.flatMap(r => r.blocks.map(b => b.relative)))].slice(0, 30), metadataLengthConfirmedRecords: records.filter(r => r.metadata?.terminatedStringBlock).length, algorithmEndsAtRichTextRecords: records.filter(r => r.algorithm?.followedImmediatelyByRichText).length, algorithmGaps: records.filter(r => r.algorithm && !r.algorithm.followedImmediatelyByRichText).map(r => ({ number: r.number, algorithmEnd: r.algorithm.endsAtRelative, firstBlock: r.blocks[0]?.relative })).slice(0, 12) };
}
const report = { evidence: 'Inferred from file structure; not executable-backed. Block candidates validate all count-derived fixed lengths, object payload lengths, and exact consumption. Record boundaries use an existing unverified signature.', files: files.map(inventory) };
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.files.map(({ file, recordsDetected, fullCandidates, alignedRecords, metadataLengthConfirmedRecords }) => ({ file, recordsDetected, fullCandidates, alignedRecords, metadataLengthConfirmedRecords })), null, 2));



