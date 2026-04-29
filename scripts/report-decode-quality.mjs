#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const inputDir = process.argv[2];
const outPath = process.argv[3];

if (!inputDir) {
  console.error('Usage: npm run report:quality -- <decoded-json-dir> [out-json]');
  process.exit(1);
}

const files = readdirSync(inputDir).filter((file) => file.endsWith('.json')).sort();
const chapters = files
  .map((file) => summarizeFile(join(inputDir, file), file))
  .filter((chapter) => chapter !== undefined);
const report = {
  generatedAt: new Date().toISOString(),
  inputDir,
  chapterCount: chapters.length,
  questionCount: chapters.reduce((sum, chapter) => sum + chapter.questions, 0),
  notDecodedBodyCount: chapters.reduce((sum, chapter) => sum + chapter.notDecodedBodies, 0),
  embeddedBodyCount: chapters.reduce((sum, chapter) => sum + chapter.embeddedBodies, 0),
  inlineObjectCount: chapters.reduce((sum, chapter) => sum + chapter.inlineObjects, 0),
  badChoiceCount: chapters.reduce((sum, chapter) => sum + chapter.badChoices, 0),
  chapters,
};

console.table(chapters.map((chapter) => ({
  file: chapter.file,
  questions: chapter.questions,
  notDecoded: chapter.notDecodedBodies,
  embeddedBodies: chapter.embeddedBodies,
  inlineObjects: chapter.inlineObjects,
  badChoices: chapter.badChoices,
})));

console.log(`Questions: ${report.questionCount}`);
console.log(`Body "not decoded yet" markers: ${report.notDecodedBodyCount}`);
console.log(`Bodies with embedded placeholders: ${report.embeddedBodyCount}`);
console.log(`Inline objects: ${report.inlineObjectCount}`);
console.log(`Bad choice tokens: ${report.badChoiceCount}`);

if (outPath) {
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${outPath}`);
}

function summarizeFile(path, file) {
  const decoded = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(decoded.questions)) return undefined;
  const bodyIssues = [];
  let badChoices = 0;
  let embeddedBodies = 0;
  let inlineObjects = 0;

  decoded.questions.forEach((question, index) => {
    const body = question.body?.text ?? '';
    if (/\[embedded /.test(body)) embeddedBodies++;
    if (/not decoded yet|\bundefined\b|\bNaN\b|\[object Object\]/i.test(body)) {
      bodyIssues.push({
        number: index + 1,
        id: question.id,
        title: question.metadata?.title,
        body,
      });
    }

    inlineObjects += question.inlineObjects?.length ?? 0;
    for (const choice of question.choices ?? []) {
      const text = choice.body?.text ?? '';
      if (/not decoded yet|\bDIS\d*\b|\bANS\b|\bundefined\b|\bNaN\b/i.test(text)) badChoices++;
    }
  });

  return {
    file: basename(file),
    questions: decoded.questions.length,
    notDecodedBodies: bodyIssues.length,
    embeddedBodies,
    inlineObjects,
    badChoices,
    bodyIssues,
  };
}
