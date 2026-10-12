#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';

const [bankArg, reportArg, ...pqpArgs] = process.argv.slice(2);
if (!bankArg || !reportArg || !pqpArgs.length) {
  console.error('Usage: node scripts/compare-testgen-bank.mjs <expanded-testgen-bank> <report-prefix> <pqp.json...>');
  process.exit(1);
}

const bankRoot = resolve(bankArg);
const reportPrefix = resolve(reportArg);
const questionDir = join(bankRoot, 'questions');
const imageDir = join(bankRoot, 'images');
const driveQuestions = new Map(readdirSync(questionDir)
  .filter((file) => file.endsWith('.json') && file !== 'index.json')
  .map((file) => {
    const question = JSON.parse(readFileSync(join(questionDir, file), 'utf8')).question;
    return [question.id, question];
  }));
const driveImages = new Map((existsSync(imageDir) ? readdirSync(imageDir) : [])
  .filter((file) => file !== 'desktop.ini')
  .map((file) => [basename(file, extname(file)), join(imageDir, file)]));

const comparisons = [];
const chapters = [];
for (const pqpArg of pqpArgs) {
  const pqpPath = resolve(pqpArg);
  const pkg = JSON.parse(readFileSync(pqpPath, 'utf8'));
  const label = pkg.questions.find((question) => question.provenance?.sourceLabel)?.provenance.sourceLabel ?? basename(pqpPath);
  const chapter = Number(label.match(/Chapter\s+(\d+)/i)?.[1]);
  if (!chapter) throw new Error(`Could not identify chapter for ${pqpPath}`);
  const prefix = `pc12-chapter-${String(chapter).padStart(2, '0')}-q`;
  const localAssets = new Map((pkg.assets ?? []).map((asset) => [basename(asset.filename, extname(asset.filename)), asset]));
  const localQuestions = pkg.questions.map((question) => {
    // TestGen's chapter IDs follow ExamView's exported-question order. Source
    // record numbers diverge after a matching group because several source
    // records are represented by one exported matching question.
    const nativeExportOrdinal = question.extensions?.examview?.nativeExportOrdinal;
    const idNumber = Number.isInteger(nativeExportOrdinal)
      ? nativeExportOrdinal
      : question.provenance?.sourceQuestionNumber;
    return {
      id: `${prefix}${String(idNumber ?? '').padStart(3, '0')}`,
      question,
    };
  });
  const driveForChapter = [...driveQuestions.values()].filter((question) => question.id.startsWith(prefix));
  const chapterRows = [];
  for (const { id, question } of localQuestions) {
    const drive = driveQuestions.get(id);
    if (!drive) {
      chapterRows.push({ id, missingInDrive: true });
      continue;
    }
    const local = asTestGenQuestion(question);
    const localRefs = imageRefs([local.body, ...Object.values(local.choices ?? {}), local.solution]);
    const driveRefs = imageRefs([drive.body, ...Object.values(drive.choices ?? {}), drive.solution]);
    const localHashes = localRefs.flatMap((name) => {
      const asset = localAssets.get(name);
      const bytes = assetBytes(asset, dirname(pqpPath));
      return bytes ? [sha256(bytes)] : [];
    });
    const driveHashes = driveRefs.flatMap((name) => {
      const path = driveImages.get(name);
      return path && existsSync(path) ? [sha256(readFileSync(path))] : [];
    });
    const localModel = canonicalModel(local.algorithmModel);
    const driveModel = canonicalModel(drive.algorithmModel);
    const localChoices = stable(local.choices ?? null);
    const driveChoices = stable(drive.choices ?? null);
    const localBody = local.body ?? '';
    const driveBody = drive.body ?? '';
    const answerComparable = drive.answer !== null && drive.answer !== undefined;
    chapterRows.push({
      id,
      sourceQuestionNumber: question.provenance?.sourceQuestionNumber,
      nativeExportOrdinal: question.extensions?.examview?.nativeExportOrdinal,
      localQuestionType: local.questionType,
      driveQuestionType: drive.questionType,
      answerComparable,
      answerEqual: answerComparable ? stable(local.answer) === stable(drive.answer) : null,
      localHasAnswer: local.answer !== null && local.answer !== undefined && local.answer !== '',
      driveHasAnswer: answerComparable,
      questionTypeEqual: local.questionType === drive.questionType,
      questionFamilyEqual: questionFamily(local.questionType) === questionFamily(drive.questionType),
      bodyExact: localBody === driveBody,
      bodyNormalized: normalizeText(localBody) === normalizeText(driveBody),
      choicesExact: localChoices === driveChoices,
      choicesNormalized: stable(normalizeTextObject(local.choices)) === stable(normalizeTextObject(drive.choices)),
      solutionExact: (local.solution ?? null) === (drive.solution ?? null),
      localHasSolution: Boolean(local.solution),
      driveHasSolution: Boolean(drive.solution),
      localAlgorithm: Boolean(local.algorithmModel),
      driveAlgorithm: Boolean(drive.algorithmModel),
      algorithmModelEqual: localModel === driveModel,
      localImageReferences: localRefs.length,
      driveImageReferences: driveRefs.length,
      localUniqueImages: new Set(localRefs).size,
      driveUniqueImages: new Set(driveRefs).size,
      exactImageBytesShared: [...new Set(localHashes)].filter((hash) => new Set(driveHashes).has(hash)).length,
      localAlgorithmStatus: question.extensions?.examview?.algorithm?.status ?? 'none',
      driveDiagnostics: drive.decodeDiagnostics ?? [],
    });
  }
  const missingLocally = driveForChapter.map((question) => question.id)
    .filter((id) => !localQuestions.some((item) => item.id === id));
  const summary = summarize(chapterRows);
  chapters.push({
    chapter,
    pqpPath,
    localQuestions: localQuestions.length,
    driveQuestions: driveForChapter.length,
    missingLocally,
    summary,
  });
  comparisons.push(...chapterRows.map((row) => ({ chapter, ...row })));
}

const report = {
  generatedAt: new Date().toISOString(),
  bankRoot,
  bankName: existsSync(join(bankRoot, 'bank-name.json')) ? JSON.parse(readFileSync(join(bankRoot, 'bank-name.json'), 'utf8')).name : undefined,
  packages: pqpArgs.map((path) => resolve(path)),
  chapters,
  questions: comparisons,
};
mkdirSync(dirname(reportPrefix), { recursive: true });
writeFileSync(`${reportPrefix}.json`, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(`${reportPrefix}.md`, markdown(report));
console.log(JSON.stringify({
  json: `${reportPrefix}.json`,
  markdown: `${reportPrefix}.md`,
  bank: report.bankName,
  chapters: chapters.map(({ chapter, localQuestions, driveQuestions, summary }) => ({ chapter, localQuestions, driveQuestions, ...summary })),
}, null, 2));

function asTestGenQuestion(question) {
  const choices = question.content?.choices
    ? Object.fromEntries(question.content.choices.map((choice) => [choice.id.toUpperCase(), choice.body?.text ?? '']))
    : undefined;
  const answer = question.answer?.type === 'choice' && typeof question.answer.value === 'string'
    ? question.answer.value.toUpperCase()
    : question.answer?.value;
  const model = question.extensions?.algorithmModel
    ? {
        ...question.extensions.algorithmModel,
        slots: question.extensions.algorithmModel.slots?.map((slot) => ({
          ...slot,
          field: slot.field.replace(/^choice:([A-Za-z0-9]+)$/, (_match, id) => `choice:${id.toUpperCase()}`),
        })),
      }
    : undefined;
  return {
    body: question.content?.stem?.text,
    choices,
    answer,
    solution: question.content?.solution?.text,
    questionType: testGenQuestionType(question),
    algorithmModel: model,
  };
}

function testGenQuestionType(question) {
  const classified = question.classification?.questionType;
  if (['mcq', 'multiple_choice', 'bimodal', 'true_false', 'yes_no'].includes(classified)) return 'mcq';
  if (classified === 'short_answer') return 'short-answer';
  if (['completion', 'matching', 'problem'].includes(classified)) return classified;
  if (question.kind === 'matching') return 'matching';
  if (question.kind === 'mcq') return 'mcq';
  return question.kind;
}

function canonicalModel(model) {
  if (!model) return null;
  const copy = JSON.parse(JSON.stringify(model));
  delete copy.source;
  for (const slot of copy.slots ?? []) {
    if (typeof slot.text === 'string') slot.text = normalizeText(slot.text);
  }
  return stable(copy);
}

function normalizeTextObject(value) {
  return value ? Object.fromEntries(Object.entries(value).map(([key, text]) => [key, normalizeText(text)])) : null;
}

function questionFamily(type) {
  if (type === 'mcq') return 'mcq';
  if (type === 'matching') return 'matching';
  return 'constructed-response';
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/[–−]/g, '-')
    .replace(/π/g, 'pi')
    .replace(/θ/g, 'theta')
    .replace(/\^\(([^()]*)\)/g, '^$1')
    .replace(/#text\(font:\s*"[^"]+"\)\[/g, '')
    .replace(/#box\([^\n;]*?image\("\/imgs\/[^"]+"[^\n;]*?\)\);/g, '<image>')
    .replace(/#image\("\/imgs\/[^"]+"[^)]*\)/g, '<image>')
    .replace(/\bmed\b/g, '')
    .replace(/[\[\];]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function imageRefs(values) {
  return values.flatMap((value) => [...String(value ?? '').matchAll(/\/imgs\/([\w-]+)/g)].map((match) => match[1]));
}

function assetBytes(asset, packageDir) {
  if (!asset) return undefined;
  if (asset.storage?.mode === 'inline-base64' && asset.storage.base64) return Buffer.from(asset.storage.base64, 'base64');
  if (asset.storage?.path) {
    const path = resolve(packageDir, asset.storage.path);
    if (existsSync(path)) return readFileSync(path);
  }
  return undefined;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function summarize(rows) {
  const valid = rows.filter((row) => !row.missingInDrive);
  const count = (key) => valid.filter((row) => row[key]).length;
  const comparableAnswers = valid.filter((row) => row.answerComparable);
  const bothAlgorithmic = valid.filter((row) => row.localAlgorithm && row.driveAlgorithm);
  return {
    matched: valid.length,
    missingInDrive: rows.length - valid.length,
    comparableAnswers: comparableAnswers.length,
    answersEqual: comparableAnswers.filter((row) => row.answerEqual).length,
    localAnswers: count('localHasAnswer'),
    driveAnswers: count('driveHasAnswer'),
    questionTypesEqual: count('questionTypeEqual'),
    questionFamiliesEqual: count('questionFamilyEqual'),
    bodiesExact: count('bodyExact'),
    bodiesNormalized: count('bodyNormalized'),
    choicesExact: count('choicesExact'),
    choicesNormalized: count('choicesNormalized'),
    solutionsLocal: count('localHasSolution'),
    solutionsDrive: count('driveHasSolution'),
    localAlgorithms: count('localAlgorithm'),
    driveAlgorithms: count('driveAlgorithm'),
    bothAlgorithmic: bothAlgorithmic.length,
    algorithmModelsEqual: bothAlgorithmic.filter((row) => row.algorithmModelEqual).length,
    algorithmModelMismatches: bothAlgorithmic.filter((row) => !row.algorithmModelEqual).map((row) => row.id),
    newlyAlgorithmic: valid.filter((row) => row.localAlgorithm && !row.driveAlgorithm).map((row) => row.id),
    noLongerAlgorithmic: valid.filter((row) => !row.localAlgorithm && row.driveAlgorithm).map((row) => row.id),
    answerMismatches: comparableAnswers.filter((row) => !row.answerEqual).map((row) => row.id),
    typeMismatches: valid.filter((row) => !row.questionTypeEqual).map((row) => row.id),
    localImageReferences: valid.reduce((sum, row) => sum + row.localImageReferences, 0),
    driveImageReferences: valid.reduce((sum, row) => sum + row.driveImageReferences, 0),
    exactImageBytesShared: valid.reduce((sum, row) => sum + row.exactImageBytesShared, 0),
  };
}

function markdown(report) {
  const lines = [
    '# Local PQP vs Google Drive TestGen bank', '',
    `Drive bank: **${report.bankName ?? report.bankRoot}**`, '',
    '| Chapter | Questions local / Drive | Comparable answers equal | Answer coverage local / Drive | Types equal | Body exact / normalized | Choices exact / normalized | Algorithms local / Drive | Equal models / both algorithmic | Image refs local / Drive |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const item of report.chapters) {
    const s = item.summary;
    lines.push(`| ${String(item.chapter).padStart(2, '0')} | ${item.localQuestions} / ${item.driveQuestions} | ${s.answersEqual}/${s.comparableAnswers} | ${s.localAnswers}/${s.driveAnswers} | ${s.questionTypesEqual}/${s.matched} | ${s.bodiesExact}/${s.bodiesNormalized} | ${s.choicesExact}/${s.choicesNormalized} | ${s.localAlgorithms}/${s.driveAlgorithms} | ${s.algorithmModelsEqual}/${s.bothAlgorithmic} | ${s.localImageReferences}/${s.driveImageReferences} |`);
  }
  lines.push('', '## Algorithm changes', '');
  for (const item of report.chapters) {
    const added = item.summary.newlyAlgorithmic;
    const removed = item.summary.noLongerAlgorithmic;
    lines.push(`- Chapter ${String(item.chapter).padStart(2, '0')}: ${added.length} newly algorithmic${added.length ? ` (${added.join(', ')})` : ''}; ${removed.length} no longer algorithmic${removed.length ? ` (${removed.join(', ')})` : ''}.`);
  }
  lines.push('', '## Integrity differences', '');
  for (const item of report.chapters) {
    const s = item.summary;
    lines.push(`- Chapter ${String(item.chapter).padStart(2, '0')}: ${s.answerMismatches.length} mismatches among ${s.comparableAnswers} Drive answers; ${s.questionTypesEqual}/${s.matched} exact TestGen question types; ${s.missingInDrive} missing in Drive; ${item.missingLocally.length} missing locally.`);
  }
  lines.push('', 'Questions are matched by ExamView native export ordinal. “Normalized” text is a heuristic comparison that ignores whitespace, font wrappers, and a small set of equivalent math glyphs.', '', 'Exact image-byte matches count only images referenced by the same matched question. A zero does not mean the diagrams differ visually; the Drive bank uses separately cropped JPEG assets while the local PQPs embed native ExamView PNG/JPEG assets.');
  return `${lines.join('\n')}\n`;
}
