#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const decodedDir = process.argv[2];
const pdfDir = process.argv[3];
const outPath = process.argv[4] ?? 'reports/pdf-reference-audit.json';

if (!decodedDir || !pdfDir) {
  console.error('Usage: node scripts/audit-pdf-reference.mjs <decoded-json-dir> <pdf-dir> [out-json]');
  process.exit(1);
}

const decodedFiles = readdirSync(decodedDir)
  .filter((file) => /^Chapter \d+\.json$/i.test(file))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

const chapters = decodedFiles.map((file) => auditChapter(join(decodedDir, file), join(pdfDir, file.replace(/\.json$/i, '.pdf'))));
const summary = chapters.reduce((acc, chapter) => {
  acc.decodedQuestions += chapter.decodedQuestionCount;
  acc.pdfQuestions += chapter.pdfQuestionCount;
  acc.comparedQuestions += chapter.comparedQuestionCount;
  acc.lowStemSimilarity += chapter.lowStemSimilarityCount;
  acc.answerMatches += chapter.answerMatches;
  acc.answerCompared += chapter.answerCompared;
  acc.choiceMatches += chapter.choiceMatches;
  acc.choiceCompared += chapter.choiceCompared;
  acc.decodedPlaceholderQuestions += chapter.decodedPlaceholderQuestions;
  return acc;
}, {
  decodedQuestions: 0,
  pdfQuestions: 0,
  comparedQuestions: 0,
  lowStemSimilarity: 0,
  answerMatches: 0,
  answerCompared: 0,
  choiceMatches: 0,
  choiceCompared: 0,
  decodedPlaceholderQuestions: 0,
});

const report = {
  generatedAt: new Date().toISOString(),
  decodedDir,
  pdfDir,
  summary: {
    ...summary,
    stemSimilarityPassRate: summary.comparedQuestions
      ? roundPct((summary.comparedQuestions - summary.lowStemSimilarity) / summary.comparedQuestions)
      : 0,
    answerMatchRate: summary.answerCompared ? roundPct(summary.answerMatches / summary.answerCompared) : 0,
    choiceMatchRate: summary.choiceCompared ? roundPct(summary.choiceMatches / summary.choiceCompared) : 0,
  },
  chapters,
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`PDF reference audit: ${decodedDir} vs ${pdfDir}`);
console.log(`Questions compared: ${summary.comparedQuestions}/${summary.pdfQuestions} PDF, decoded ${summary.decodedQuestions}`);
console.log(`Low stem similarity: ${summary.lowStemSimilarity}`);
console.log(`Decoded questions with placeholders: ${summary.decodedPlaceholderQuestions}`);
console.log(`Answer matches: ${summary.answerMatches}/${summary.answerCompared}`);
console.log(`Choice matches: ${summary.choiceMatches}/${summary.choiceCompared}`);
console.log(`Wrote ${outPath}`);

for (const chapter of chapters) {
  console.log(
    `${chapter.chapter}: decoded ${chapter.decodedQuestionCount}, PDF ${chapter.pdfQuestionCount}, `
      + `low stems ${chapter.lowStemSimilarityCount}, placeholders ${chapter.decodedPlaceholderQuestions}, `
      + `answers ${chapter.answerMatches}/${chapter.answerCompared}, `
      + `choices ${chapter.choiceMatches}/${chapter.choiceCompared}`,
  );
  for (const mismatch of chapter.examples.slice(0, 3)) {
    console.log(`  - Q${mismatch.number}: stem ${mismatch.stemSimilarity}; missing: ${mismatch.missingReferenceTokens.slice(0, 8).join(', ') || 'none'}`);
  }
}

function auditChapter(decodedPath, pdfPath) {
  const chapter = basename(decodedPath).replace(/\.json$/i, '');
  const textPath = pdfPath.replace(/\.pdf$/i, '.txt');

  const decoded = JSON.parse(readFileSync(decodedPath, 'utf8'));
  const pdfText = existsSync(textPath)
    ? readFileSync(textPath, 'utf8')
    : existsSync(pdfPath)
      ? extractPdfText(pdfPath)
      : '';
  if (!pdfText) {
    return emptyChapter(chapter, decodedPath, pdfPath, 'PDF/text reference file not found or produced no output.');
  }

  const pdfQuestions = parsePdfQuestions(pdfText);
  const decodedQuestions = decoded.questions ?? [];
  const comparedQuestionCount = Math.min(decodedQuestions.length, pdfQuestions.length);
  const examples = [];
  let lowStemSimilarityCount = 0;
  let answerMatches = 0;
  let answerCompared = 0;
  let choiceMatches = 0;
  let choiceCompared = 0;
  let decodedPlaceholderQuestions = 0;

  for (let index = 0; index < comparedQuestionCount; index++) {
    const decodedQuestion = decodedQuestions[index];
    const pdfQuestion = pdfQuestions[index];
    const stem = compareText(decodedQuestion.body?.text ?? '', pdfQuestion.stem);
    const choiceComparison = compareChoices(decodedQuestion.choices ?? [], pdfQuestion.choices);
    const hasDecodedPlaceholder = decodedQuestionHasPlaceholder(decodedQuestion);
    const decodedAnswer = normalizedAnswer(decodedQuestion.answer?.value);
    const pdfAnswer = normalizedAnswer(pdfQuestion.answer);

    if (stem.similarity < 0.62) lowStemSimilarityCount++;
    if (hasDecodedPlaceholder) decodedPlaceholderQuestions++;
    if (pdfAnswer && decodedAnswer) {
      answerCompared++;
      if (pdfAnswer === decodedAnswer) answerMatches++;
    }

    choiceCompared += choiceComparison.compared;
    choiceMatches += choiceComparison.matches;

    if (stem.similarity < 0.62 || hasDecodedPlaceholder || choiceComparison.mismatches.length || (pdfAnswer && decodedAnswer && pdfAnswer !== decodedAnswer)) {
      examples.push({
        number: pdfQuestion.number,
        decodedId: decodedQuestion.id,
        stemSimilarity: stem.similarity,
        hasDecodedPlaceholder,
        missingReferenceTokens: stem.missingReferenceTokens,
        decodedStemPreview: preview(decodedQuestion.body?.text ?? ''),
        pdfStemPreview: preview(pdfQuestion.stem),
        answer: {
          decoded: decodedAnswer,
          pdf: pdfAnswer,
        },
        choiceMismatches: choiceComparison.mismatches.slice(0, 4),
      });
    }
  }

  return {
    chapter,
    decodedPath,
    pdfPath,
    referenceTextPath: existsSync(textPath) ? textPath : undefined,
    decodedQuestionCount: decodedQuestions.length,
    pdfQuestionCount: pdfQuestions.length,
    comparedQuestionCount,
    lowStemSimilarityCount,
    answerMatches,
    answerCompared,
    choiceMatches,
    choiceCompared,
    decodedPlaceholderQuestions,
    examples: examples.slice(0, 30),
  };
}

function emptyChapter(chapter, decodedPath, pdfPath, error) {
  return {
    chapter,
    decodedPath,
    pdfPath,
    error,
    decodedQuestionCount: 0,
    pdfQuestionCount: 0,
    comparedQuestionCount: 0,
    lowStemSimilarityCount: 0,
    answerMatches: 0,
    answerCompared: 0,
    choiceMatches: 0,
    choiceCompared: 0,
    decodedPlaceholderQuestions: 0,
    examples: [],
  };
}

function extractPdfText(pdfPath) {
  const result = spawnSync('pdftotext', ['-layout', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`pdftotext failed for ${pdfPath}: ${result.stderr}`);
  }
  return result.stdout;
}

function parsePdfQuestions(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const questions = [];
  let current;

  const flush = () => {
    if (!current) return;
    const parsed = parsePdfQuestionBlock(current.number, current.lines);
    if (parsed.stem || parsed.choices.length || parsed.answer) questions.push(parsed);
    current = undefined;
  };

  for (const line of lines) {
    const start = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (start && !/\b(?:ANS|DIF|OBJ|NAT|TOP|KEY)\s*:/i.test(line)) {
      flush();
      current = {
        number: Number(start[1]),
        lines: [start[2]],
      };
      continue;
    }

    if (current) current.lines.push(line);
  }

  flush();
  return questions;
}

function parsePdfQuestionBlock(number, lines) {
  const answerLine = lines.find((line) => /\bANS\s*:/i.test(line)) ?? '';
  const answer = answerLine.match(/\bANS\s*:\s*([A-H]|[-+]?[\d.]+)/i)?.[1];
  const contentLines = lines
    .slice(0, answerLine ? lines.indexOf(answerLine) : lines.length)
    .filter((line) => !/^\s*(?:DIF|OBJ|NAT|TOP|KEY)\s*:/i.test(line))
    .filter((line) => !/^\s*(?:Copyright|Chapter \d+|MULTIPLE CHOICE|SHORT ANSWER|MATCHING|PROBLEM|NUMERICAL RESPONSE)\b/i.test(line));

  const choiceStart = contentLines.findIndex((line) => parsePdfChoiceLine(line).length > 0);
  const stemLines = choiceStart === -1 ? contentLines : contentLines.slice(0, choiceStart);
  const choiceLines = choiceStart === -1 ? [] : contentLines.slice(choiceStart);

  return {
    number,
    stem: normalizePdfWhitespace(stemLines.join(' ')),
    choices: parsePdfChoices(choiceLines),
    answer,
  };
}

function parsePdfChoices(lines) {
  const choices = [];
  const seen = new Set();

  for (const line of lines) {
    for (const choice of parsePdfChoiceLine(line)) {
      if (seen.has(choice.id)) continue;
      seen.add(choice.id);
      choices.push(choice);
    }
  }

  return choices.sort((left, right) => left.id.localeCompare(right.id));
}

function parsePdfChoiceLine(line) {
  const choices = [];
  const normalized = line.replace(/\t/g, '    ');
  const pattern = /(?:^|\s{2,})([A-H])\s+(.+?)(?=(?:\s{2,}[A-H]\s+)|$)/g;
  for (const match of normalized.matchAll(pattern)) {
    const text = normalizePdfWhitespace(match[2]);
    if (text && !/\b(?:ANS|DIF|OBJ|NAT|TOP|KEY)\s*:/i.test(text)) {
      choices.push({ id: match[1], text });
    }
  }
  return choices;
}

function compareText(decodedText, pdfText) {
  const decodedTokens = tokenSet(decodedText);
  const referenceTokens = tokens(pdfText);
  if (!referenceTokens.length) return { similarity: 1, missingReferenceTokens: [] };

  const matched = referenceTokens.filter((token) => decodedTokens.has(token));
  const missing = referenceTokens.filter((token, index, all) => !decodedTokens.has(token) && all.indexOf(token) === index);
  return {
    similarity: roundPct(matched.length / referenceTokens.length),
    missingReferenceTokens: missing.slice(0, 20),
  };
}

function compareChoices(decodedChoices, pdfChoices) {
  let compared = 0;
  let matches = 0;
  const mismatches = [];
  const decodedById = new Map(decodedChoices.map((choice) => [String(choice.id).toUpperCase(), choice.body?.text ?? '']));

  for (const pdfChoice of pdfChoices) {
    const decoded = decodedById.get(pdfChoice.id.toUpperCase());
    if (!decoded) continue;
    compared++;
    const choiceMatch = compareText(decoded, pdfChoice.text);
    if (choiceMatch.similarity >= 0.8) {
      matches++;
    } else {
      mismatches.push({
        id: pdfChoice.id,
        similarity: choiceMatch.similarity,
        decoded: preview(decoded),
        pdf: preview(pdfChoice.text),
        missingReferenceTokens: choiceMatch.missingReferenceTokens,
      });
    }
  }

  return { compared, matches, mismatches };
}

function decodedQuestionHasPlaceholder(question) {
  const texts = [
    question.body?.text ?? '',
    ...(question.choices ?? []).map((choice) => choice.body?.text ?? ''),
  ];
  return texts.some((text) => /\[\[slot\]\]|\[(?:embedded|inline|diagram|graph|math|object|choice)[^\]]+\]/i.test(text));
}

function tokens(text) {
  return normalizeForComparison(text)
    .split(/\s+/)
    .filter((token) => token.length >= 2 || /^\d+$/.test(token))
    .filter((token) => !/^(?:the|and|with|that|this|from|are|was|were|for|each|below|shown|here|embedded|math|expression)$/.test(token));
}

function tokenSet(text) {
  return new Set(tokens(text));
}

function normalizeForComparison(text) {
  return normalizePdfWhitespace(text)
    .toLowerCase()
    .replace(/[=]/g, ' equals ')
    .replace(/[|]/g, ' abs ')
    .replace(/[−–—]/g, ' - ')
    .replace(/\^/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b([a-z])\s+2\b/g, '$1 2')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePdfWhitespace(text) {
  return text
    .replace(/\f/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizedAnswer(value) {
  if (value === undefined || value === null) return undefined;
  return String(value).trim().toUpperCase();
}

function preview(text) {
  const normalized = normalizePdfWhitespace(text);
  return normalized.length <= 220 ? normalized : `${normalized.slice(0, 217)}...`;
}

function roundPct(value) {
  return Math.round(value * 1000) / 1000;
}
