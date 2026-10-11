#!/usr/bin/env node
// Inferred linkage probe. Does not establish semantics from executable code.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
const files = process.argv.slice(2);
if (!files.length) files.push('test-test-bank.bnk', 'ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk');
const results = files.map(file => {
  const p = inflateSync(readFileSync(file).subarray(16)), i = a => p.readInt32LE(a), bankId = i(0), questions = [], narratives = [];
  for (let at = 4; at + 24 <= p.length; at++) {
    if (i(at + 4) !== bankId) continue;
    if ([bankId, 0].includes(i(at + 16)) && i(at + 20) === 1) {
      const metaAt = at + 532;
      if (metaAt + 4 > p.length) continue;
      const algAt = metaAt + i(metaAt);
      if (algAt < metaAt + 4 || algAt + 4 > p.length) continue;
      const richAt = algAt + i(algAt);
      if (richAt < algAt + 4 || richAt + 60 > p.length) continue;
      questions.push({ offset: at, number: i(at), type: i(at + 8), inferredNarrativeId: i(at + 12), richTextOffset: richAt, text: p.subarray(richAt + 60, richAt + 60 + Math.min(180, i(richAt + 8)) * 2).toString('utf16le') });
    } else {
      const name = p.subarray(at + 8, at + 8 + 128 * 2).toString('utf16le').split('\0')[0];
      const richAt = at + 592;
      if (!/^[\x20-\x7e]{1,100}$/.test(name) || richAt + 60 > p.length) continue;
      const length = i(richAt);
      if (length < 60 || richAt + length > p.length || i(richAt + 4) !== 1 || i(richAt + 52) !== 1) continue;
      narratives.push({ offset: at, id: i(at), name, richTextOffset: richAt, richTextLength: length, end: richAt + length, text: p.subarray(richAt + 60, richAt + 60 + Math.min(180, i(richAt + 8)) * 2).toString('utf16le') });
    }
  }
  return { file, bankId, inflatedLength: p.length, questionsDetected: questions.length, linkedQuestions: questions.filter(q => q.inferredNarrativeId !== -1), narratives };
});
mkdirSync('reports/rea-examview', { recursive: true });
writeFileSync('reports/rea-examview/narrative-link-probe.json', JSON.stringify({ evidence: 'File-structure inference; +592 narrative rich-text offset is a candidate requiring executable confirmation and full block validation.', results }, null, 2) + '\n');
console.log(JSON.stringify(results.map(r => ({ file: r.file, questions: r.questionsDetected, linked: r.linkedQuestions.length, narratives: r.narratives.length }))));
