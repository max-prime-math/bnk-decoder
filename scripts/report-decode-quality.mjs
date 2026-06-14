#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const inputDir = process.argv[2];
const outPath = process.argv[3];

if (!inputDir) {
  console.error('Usage: npm run report:quality -- <decoded-json-dir> [out-json]');
  process.exit(1);
}

const files = readdirSync(inputDir)
  .filter((file) => file.endsWith('.json') && !file.endsWith('.pqp.json'))
  .sort();
const PLACEHOLDER_PATTERN = /\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]|\[\[slot\]\]/i;
const BODY_UNRESOLVED_PATTERN = /not decoded yet|\bNaN\b|\[object Object\]|\[\[slot\]\]|\[DIAGRAM[^\]]+\]|\[embedded [^\]]+\]|\[inline [^\]]+\]/i;
const CHOICE_UNRESOLVED_PATTERN = /not decoded yet|\bDIS\d*\b|\bANS\b|\bNaN\b|\[\[slot\]\]|\[DIAGRAM[^\]]+\]|\[embedded [^\]]+\]|\[inline [^\]]+\]/i;
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
  slotBodyCount: chapters.reduce((sum, chapter) => sum + chapter.slotBodies, 0),
  inlineObjectCount: chapters.reduce((sum, chapter) => sum + chapter.inlineObjects, 0),
  badChoiceCount: chapters.reduce((sum, chapter) => sum + chapter.badChoices, 0),
  quality: {
    clean: chapters.reduce((sum, chapter) => sum + chapter.quality.clean, 0),
    suspect: chapters.reduce((sum, chapter) => sum + chapter.quality.suspect, 0),
    garbage: chapters.reduce((sum, chapter) => sum + chapter.quality.garbage, 0),
    averageScore: chapters.length
      ? Math.round(chapters.reduce((sum, chapter) => sum + chapter.quality.averageScore, 0) / chapters.length)
      : 0,
  },
  chapters,
};

console.table(chapters.map((chapter) => ({
  file: chapter.file,
  questions: chapter.questions,
  notDecoded: chapter.notDecodedBodies,
  embeddedBodies: chapter.embeddedBodies,
  slotBodies: chapter.slotBodies,
  inlineObjects: chapter.inlineObjects,
  badChoices: chapter.badChoices,
  clean: chapter.quality.clean,
  suspect: chapter.quality.suspect,
  garbage: chapter.quality.garbage,
  avgScore: chapter.quality.averageScore,
})));

console.log(`Questions: ${report.questionCount}`);
console.log(`Body "not decoded yet" markers: ${report.notDecodedBodyCount}`);
console.log(`Bodies with embedded placeholders: ${report.embeddedBodyCount}`);
console.log(`Bodies with raw slot placeholders: ${report.slotBodyCount}`);
console.log(`Inline objects: ${report.inlineObjectCount}`);
console.log(`Bad choice tokens: ${report.badChoiceCount}`);
console.log(
  `Quality: clean ${report.quality.clean}, suspect ${report.quality.suspect}, garbage ${report.quality.garbage}, avg ${report.quality.averageScore}/100`,
);

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
  let slotBodies = 0;
  let inlineObjects = 0;
  const quality = {
    clean: 0,
    suspect: 0,
    garbage: 0,
    averageScore: 0,
  };
  let qualityScoreTotal = 0;

  decoded.questions.forEach((question, index) => {
    const body = question.body?.text ?? '';
    const assessment = question.quality ?? legacyQuestionQuality(question);
    quality[assessment.verdict] += 1;
    qualityScoreTotal += assessment.score;

    if (/\[embedded /.test(body)) embeddedBodies++;
    if (/\[\[slot\]\]/.test(body)) slotBodies++;
    if (BODY_UNRESOLVED_PATTERN.test(body)) {
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
      if (CHOICE_UNRESOLVED_PATTERN.test(text)) badChoices++;
    }
  });

  quality.averageScore = decoded.questions.length ? Math.round(qualityScoreTotal / decoded.questions.length) : 0;

  return {
    file: basename(file),
    questions: decoded.questions.length,
    notDecodedBodies: bodyIssues.length,
    embeddedBodies,
    slotBodies,
    inlineObjects,
    badChoices,
    quality,
    bodyIssues,
  };
}

function legacyQuestionQuality(question) {
  const body = question.body?.text ?? '';
  const choiceTexts = (question.choices ?? []).map((choice) => choice.body?.text ?? '');
  const findings = [];
  let score = 100;

  if (!body.trim()) score -= 70;
  if (PLACEHOLDER_PATTERN.test(body)) score -= 30;
  if (BODY_UNRESOLVED_PATTERN.test(body)) score -= 20;
  if (choiceTexts.some((text) => PLACEHOLDER_PATTERN.test(text))) score -= 15;
  if (choiceTexts.some((text) => CHOICE_UNRESOLVED_PATTERN.test(text))) score -= 10;
  if ((question.choices?.length ?? 0) < 2 && question.questionType === 'mcq') score -= 25;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    verdict: score >= 75 ? 'clean' : score >= 45 ? 'suspect' : 'garbage',
    findings,
  };
}
