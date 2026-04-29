#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { decodeBnkFile } from '../packages/bnk-core/src/index.ts';

const bnkPath = process.argv[2];
const rtfPath = process.argv[3];
const outDir = process.argv[4] ?? 'reports/evaluation';

if (!bnkPath || !rtfPath) {
  console.error('Usage: npm run evaluate:rtf -- <path-to-bnk-or-tst> <path-to-rtf> [output-dir]');
  process.exit(1);
}

const bnkBytes = readFileSync(bnkPath);
const result = await decodeBnkFile(
  bnkBytes.buffer.slice(bnkBytes.byteOffset, bnkBytes.byteOffset + bnkBytes.byteLength),
  { filename: bnkPath },
);
const rtf = readFileSync(rtfPath, 'latin1');
const rtfText = rtfToPlainText(rtf);
const answerKey = extractAnswerKey(rtfText);
const questionCount = countQuestionPrompts(rtfText);
const decodedAnswers = result.questions.map((question, index) => ({
  number: index + 1,
  decoded: question.answer?.value,
  rtf: answerKey.get(index + 1),
  matches: normalizeAnswer(question.answer?.value) === normalizeAnswer(answerKey.get(index + 1)),
}));

const report = {
  generatedAt: new Date().toISOString(),
  bnkPath,
  rtfPath,
  decodedQuestionCount: result.questions.length,
  rtfQuestionPromptCount: questionCount,
  rtfAnswerCount: answerKey.size,
  answerMatches: decodedAnswers.filter((answer) => answer.matches).length,
  decodedAnswers,
  diagnostics: result.diagnostics,
};

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${basename(bnkPath).replace(/\.[^.]+$/, '')}.rtf-eval.json`);
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Decoded questions: ${report.decodedQuestionCount}`);
console.log(`RTF question prompts: ${report.rtfQuestionPromptCount}`);
console.log(`RTF answers: ${report.rtfAnswerCount}`);
console.log(`Answer matches: ${report.answerMatches}/${Math.min(report.decodedQuestionCount, report.rtfAnswerCount)}`);
console.log(`Wrote ${outPath}`);

function rtfToPlainText(input) {
  return input
    .replace(/\{\\pict[\s\S]*?\}/g, ' [image] ')
    .replace(/\\'[0-9a-fA-F]{2}/g, (match) => String.fromCharCode(Number.parseInt(match.slice(2), 16)))
    .replace(/\\u(-?\d+)\??/g, (_, code) => {
      const value = Number(code);
      return String.fromCharCode(value < 0 ? value + 65536 : value);
    })
    .replace(/\\tab(?![a-zA-Z])/g, '\t')
    .replace(/\\par(?![a-zA-Z])/g, '\n')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
    .replace(/[{}]/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractAnswerKey(text) {
  const answerSectionIndex = text.indexOf('Answer Section');
  const answerText = answerSectionIndex === -1 ? text : text.slice(answerSectionIndex);
  const key = new Map();
  const lines = answerText.split('\n').map((line) => line.trim()).filter(Boolean);

  for (let index = 0; index < lines.length; index++) {
    const number = /^(\d+)\.$/.exec(lines[index])?.[1];
    if (!number) continue;

    const answerLabelIndex = lines.findIndex((line, lineIndex) => lineIndex > index && /^ANS:\s*$/i.test(line));
    const nextNumberIndex = lines.findIndex((line, lineIndex) => lineIndex > index && /^\d+\.$/.test(line));
    if (answerLabelIndex === -1) continue;
    if (nextNumberIndex !== -1 && answerLabelIndex > nextNumberIndex) continue;

    const answer = lines[answerLabelIndex + 1];
    const parsedNumber = Number(number);
    if (answer && !key.has(parsedNumber)) key.set(parsedNumber, answer);
  }

  return key;
}

function countQuestionPrompts(text) {
  const beforeAnswers = text.split('Answer Section')[0] ?? text;
  return [...beforeAnswers.matchAll(/(?:^|\n)\s*____\s+(\d+)\./g)].length;
}

function normalizeAnswer(answer) {
  return answer?.trim().toUpperCase() ?? '';
}
