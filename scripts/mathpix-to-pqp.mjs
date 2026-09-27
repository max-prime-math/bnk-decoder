#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const TOOL_ROOT = resolve(SCRIPT_DIR, '..');
const DEFAULT_INPUT = join(TOOL_ROOT, 'ignore/Mathpix/Pre-Calculus 12');
const DEFAULT_OUTPUT = join(TOOL_ROOT, 'reports/pqp/pre-calculus-12');
// Optional test-generator custom-classes.json; the embedded Manitoba 40S map is used otherwise.
const CURRICULUM_CLASSES_PATH = process.env.CURRICULUM_CLASSES
  ? resolve(process.env.CURRICULUM_CLASSES)
  : null;
const KNOWN_SECTIONS = new Set([
  'MULTIPLE CHOICE',
  'COMPLETION',
  'MATCHING',
  'SHORT ANSWER',
  'PROBLEM',
]);
const META_KEYS = ['DIF', 'OBJ', 'NAT', 'TOP', 'KEY'];
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const SOURCE_METADATA = {
  sourceSystem: 'ExamView',
  sourceApp: 'Mathpix',
  publisher: 'McGraw Hill',
  publisherConfidence: 'inferred-from-bank-family',
  collection: 'Pre-Calculus 12 ExamView Test Banks',
  curriculum: 'Manitoba Pre-Calculus 40S',
};
// Mathpix page crops are 254 px per inch (10 px/mm); used to print crops at their original size.
const MATHPIX_PIXELS_PER_INCH = 254;
// Original Mathpix image stem -> { name, width } for the chapter being converted.
const IMAGE_NAMES = new Map();
const MANITOBA_CLASS = loadManitobaClass();
const MANITOBA_OUTCOMES = buildOutcomeLookup(MANITOBA_CLASS);

const inputPath = resolve(process.argv[2] ?? DEFAULT_INPUT);
const outputDir = resolve(process.argv[3] ?? DEFAULT_OUTPUT);
// "Pre-Calculus 12" -> "pc12": word initials plus numbers, used to prefix image names.
const BANK_PREFIX = basename(statSync(inputPath, { throwIfNoEntry: false })?.isDirectory() ? inputPath : dirname(inputPath))
  .split(/[^A-Za-z0-9]+/)
  .filter(Boolean)
  .map((word) => (/^\d+$/.test(word) ? word : word[0].toLowerCase()))
  .join('');
// Optional hand-reviewed fixes for OCR failures, keyed by chapter stem, then
// source question number (see data/pqp-overrides/).
const overridesPath = process.argv[4] ? resolve(process.argv[4]) : null;
const OVERRIDES = overridesPath ? JSON.parse(readFileSync(overridesPath, 'utf8')) : {};

if (!existsSync(inputPath)) {
  console.error(`Input path does not exist: ${inputPath}`);
  process.exit(1);
}

const zipPaths = statSync(inputPath).isDirectory()
  ? readdirSync(inputPath)
    .filter((name) => name.toLowerCase().endsWith('.zip'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => join(inputPath, name))
  : [inputPath];

if (!zipPaths.length) {
  console.error(`No .zip files found in ${inputPath}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
mkdirSync(join(outputDir, 'raw-tex'), { recursive: true });
mkdirSync(join(outputDir, 'assets'), { recursive: true });

const summaries = [];
for (const zipPath of zipPaths) {
  summaries.push(convertZip(zipPath));
}

writeFileSync(
  join(outputDir, 'conversion-summary.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), inputPath, outputDir, chapters: summaries }, null, 2)}\n`,
);
writeFileSync(join(outputDir, 'README.md'), renderReadme(summaries));

const totalQuestions = summaries.reduce((sum, item) => sum + item.questionCount, 0);
const totalDiagnostics = summaries.reduce((sum, item) => sum + item.diagnosticCount, 0);
console.log(`Converted ${summaries.length} Mathpix zip(s) to PQP`);
console.log(`Questions: ${totalQuestions}`);
console.log(`Diagnostics: ${totalDiagnostics}`);
console.log(`Output: ${outputDir}`);

function convertZip(zipPath) {
  const zipName = basename(zipPath);
  const chapterStem = zipName.replace(/\.zip$/i, '');
  const chapterSlug = slug(chapterStem);
  const zipEntries = readZipEntries(zipPath);
  const entries = Object.keys(zipEntries);
  const texEntry = entries.find((entry) => entry.toLowerCase().endsWith('.tex'));
  if (!texEntry) throw new Error(`No .tex file found in ${zipPath}`);

  const imageEntries = entries
    .filter((entry) => IMAGE_EXTENSIONS.has(extname(entry).toLowerCase()))
    .sort((a, b) => cropPosition(a).localeCompare(cropPosition(b)));
  const assetDir = join(outputDir, 'assets', chapterStem);
  mkdirSync(assetDir, { recursive: true });
  const assetByBase = new Map();
  const assets = [];
  IMAGE_NAMES.clear();

  imageEntries.forEach((entry, index) => {
    const originalName = basename(entry);
    const base = originalName.slice(0, originalName.length - extname(originalName).length);
    // Short, bank-unique names: test-generator keys its image store by name, and sizes
    // MCQ choice grids by string length, so long Mathpix UUID names force one column.
    const name = `${BANK_PREFIX}-ch${chapterNumber(chapterStem)}-${String(index + 1).padStart(2, '0')}`;
    const filename = `${name}${extname(originalName).toLowerCase()}`;
    const cropWidth = Number(base.match(/-\d+_\d+_(\d+)_\d+_\d+$/)?.[1]);
    IMAGE_NAMES.set(base, {
      name,
      width: cropWidth ? `${(cropWidth / MATHPIX_PIXELS_PER_INCH).toFixed(2)}in` : null,
    });
    const bytes = Buffer.from(zipEntries[entry]);
    writeFileSync(join(assetDir, filename), bytes);
    const id = `${chapterSlug}-asset-${name}`;
    const asset = {
      id,
      kind: 'image',
      filename,
      mimeType: mimeTypeFor(filename),
      storage: {
        mode: 'external',
        path: join('assets', chapterStem, filename),
      },
      source: {
        originalPath: entry,
      },
      extensions: {},
    };
    assetByBase.set(base, asset);
    assets.push(asset);
  });

  const tex = new TextDecoder('utf-8').decode(zipEntries[texEntry]);
  writeFileSync(join(outputDir, 'raw-tex', `${chapterStem}.tex`), tex);

  const parsed = parseExamViewLatex(tex, {
    chapterStem,
    chapterSlug,
    zipPath,
    texEntry,
    assetByBase,
  });

  const originFiles = [relative(TOOL_ROOT, zipPath)];
  const pqp = {
    format: 'portable-question-package',
    version: '1.0',
    producer: {
      app: 'bnk-decoder',
      appVersion: '0.1.0',
      pipeline: 'mathpix-examview-pdf',
      exportedAt: new Date().toISOString(),
    },
    source: {
      kind: 'mathpix-zip',
      label: zipName,
      sourceSystem: SOURCE_METADATA.sourceSystem,
      sourceApp: SOURCE_METADATA.sourceApp,
      publisher: SOURCE_METADATA.publisher,
      publisherConfidence: SOURCE_METADATA.publisherConfidence,
      collection: SOURCE_METADATA.collection,
      curriculum: SOURCE_METADATA.curriculum,
      originFiles,
    },
    questions: parsed.questions,
    assets: assets.filter((asset) => parsed.usedAssetIds.has(asset.id)),
    diagnostics: parsed.diagnostics,
    extensions: {
      mathpix: {
        texEntry,
        imageEntryCount: imageEntries.length,
        rawTexPath: join('raw-tex', `${chapterStem}.tex`),
      },
      source: SOURCE_METADATA,
      curriculum: {
        classId: MANITOBA_CLASS.id,
        className: MANITOBA_CLASS.name,
        sourcePath: CURRICULUM_CLASSES_PATH ? relative(TOOL_ROOT, CURRICULUM_CLASSES_PATH) : 'embedded',
      },
    },
  };

  const pqpPath = join(outputDir, `${chapterStem}.pqp.json`);
  writeFileSync(pqpPath, `${JSON.stringify(pqp, null, 2)}\n`);

  const summary = summarizePackage({
    zipName,
    chapterStem,
    texEntry,
    imageEntryCount: imageEntries.length,
    pqpPath,
    pqp,
  });
  writeFileSync(join(outputDir, `${chapterStem}.summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`${chapterStem}: ${summary.questionCount} questions, ${summary.assetCount} assets, ${summary.diagnosticCount} diagnostics`);
  return summary;
}

function parseExamViewLatex(tex, context) {
  const chapterTitle = extractChapterTitle(tex) ?? context.chapterStem;
  const lines = normalizeDocumentLines(tex);
  const blocks = splitIntoSectionBlocks(lines);
  const diagnostics = [];
  const questions = [];
  const usedAssetIds = new Set();
  let sequence = 0;

  for (const block of blocks) {
    if (!KNOWN_SECTIONS.has(block.section)) continue;
    const parsedQuestions = block.section === 'MATCHING'
      ? parseMatchingBlock(block, context, chapterTitle)
      : parseQuestionBlock(block, context, chapterTitle);

    for (const question of parsedQuestions) {
      sequence += 1;
      question.id = `${context.chapterSlug}-q${String(sequence).padStart(3, '0')}`;
      const override = OVERRIDES[context.chapterStem]?.[question.provenance.sourceQuestionNumber];
      if (override) applyOverride(question, override, context);
      const questionDiagnostics = validateQuestion(question);
      if (questionDiagnostics.length) {
        question.extensions = {
          ...(question.extensions ?? {}),
          decodeDiagnostics: [
            ...((question.extensions?.decodeDiagnostics) ?? []),
            ...questionDiagnostics,
          ],
        };
      }
      const quality = qualityFromDiagnostics(questionDiagnostics);
      question.extensions = {
        ...(question.extensions ?? {}),
        quality,
      };
      for (const assetId of question.assets ?? []) usedAssetIds.add(assetId);
      diagnostics.push(...questionDiagnostics.map((diagnostic) => ({ ...diagnostic, questionId: question.id })));
      questions.push(question);
    }
  }

  diagnostics.unshift({
    level: 'info',
    code: 'MATHPIX_PARSE_SUMMARY',
    message: `Parsed ${questions.length} question(s) from ${context.chapterStem}.`,
  });

  return { questions, diagnostics, usedAssetIds };
}

function applyOverride(question, override, context) {
  if (override.answer) question.answer = { type: 'choice', value: override.answer };
  if (override.choiceImages) {
    const bases = Object.values(override.choiceImages);
    let stem = question.content.stem.text;
    for (const base of bases) {
      const name = IMAGE_NAMES.get(base)?.name ?? base;
      stem = stem.replace(new RegExp(`#image\\("/imgs/${escapeRegExp(name)}"[^)]*\\)\\s*`, 'g'), '');
    }
    question.content.stem = { ...question.content.stem, text: stem.trim() };
    question.content.choices = Object.entries(override.choiceImages)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, base]) => ({ id, body: rich(`\\includegraphics[max width=\\textwidth]{${base}}`) }));
    const assetIds = bases.map((base) => context.assetByBase.get(base)?.id).filter(Boolean);
    question.assets = [...new Set([...(question.assets ?? []), ...assetIds])];
  }
  question.extensions = {
    ...(question.extensions ?? {}),
    override: { note: override.note, fields: Object.keys(override).filter((key) => key !== 'note') },
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseQuestionBlock(block, context, chapterTitle) {
  const segments = splitQuestionSegments(block.lines);
  return segments.map((segment) => {
    const answerIndex = segment.lines.findIndex(isAnswerMarkerLine);
    const stemAndChoiceLines = answerIndex >= 0 ? segment.lines.slice(0, answerIndex) : segment.lines;
    const answerLines = answerIndex >= 0 ? segment.lines.slice(answerIndex) : [];
    const answer = parseAnswerBlock(answerLines);
    const segmentMetadata = collectMetadataValues(normalizeContent(segment.lines));
    const metadata = mergeMetadata(segmentMetadata, answer.metadata);
    const sectionSlug = slug(block.section);
    const sourceQuestionNumber = `${block.section} ${segment.number ?? '?'}`;
    const common = {
      id: '',
      kind: block.section === 'MULTIPLE CHOICE' ? 'mcq' : 'frq',
      scoring: {
        points: block.section === 'MULTIPLE CHOICE' ? 1 : 5,
      },
      classification: classificationFor(block.section, chapterTitle, metadata, normalizeContent(segment.lines)),
      provenance: provenanceFor(context, sourceQuestionNumber),
      extensions: {
        examview: {
          sourceSection: block.section,
          sourceQuestionNumber: segment.number,
          metadata,
        },
      },
    };

    if (block.section === 'MULTIPLE CHOICE') {
      let { stemLines, choices } = splitChoices(stemAndChoiceLines);
      if (choices.length < 2) ({ stemLines, choices } = splitFigureChoices(stemAndChoiceLines, choices));
      choices = assignGridChoices(choices);
      choices = [...choices].sort((a, b) => a.id.localeCompare(b.id));
      const combinedText = [stemLines.join('\n'), ...choices.map((choice) => choice.lines.join('\n')), answer.text].join('\n');
      const assetIds = collectAssetIds(combinedText, context.assetByBase);
      const rawStemWithMetadata = normalizeContent(stemLines);
      const rawStem = stripMetadataText(rawStemWithMetadata);
      const rawChoices = choices.map((choice) => ({
        id: choice.id,
        text: stripMetadataText(normalizeContent(choice.lines)),
      }));
      const rawAnswer = normalizeContent(answerLines);
      // Mathpix sometimes OCRs the answer line as a table: \text { ANS: } & \text { B }
      const answerLetter = answer.text
        ? answer.text.trim().slice(0, 1).toUpperCase()
        : normalizeContent(segment.lines).match(/ANS:\s*\}?\s*&\s*\\text\s*\{\s*([A-E])\s*\}/)?.[1];
      return pruneUndefined({
        ...common,
        content: {
          stem: rich(rawStem),
          choices: choices.map((choice) => ({
            id: choice.id,
            body: rich(stripMetadataText(normalizeContent(choice.lines))),
          })),
          // ExamView MCQ answers are a bare letter; only keep a solution with real content.
          solution: /[A-Za-z0-9]/.test(answer.text.trim().slice(1)) ? rich(answer.text) : undefined,
        },
        answer: answerLetter ? {
          type: 'choice',
          value: answerLetter,
        } : undefined,
        assets: assetIds.length ? assetIds : undefined,
        extensions: {
          ...common.extensions,
          mathpix: {
            sourceSectionSlug: sectionSlug,
            rawFormat: 'latex',
            outputFormat: 'typst',
            rawStem: normalizeContent(stemAndChoiceLines),
            rawStemLatex: rawStem,
            rawChoicesLatex: rawChoices,
            rawAnswer: rawAnswer,
            rawAnswerLatex: rawAnswer,
          },
        },
      });
    }

    const stemText = stripMetadataText(normalizeContent(stemAndChoiceLines));
    const solutionText = answer.text;
    const combinedText = [stemText, solutionText].join('\n');
    const assetIds = collectAssetIds(combinedText, context.assetByBase);
    return pruneUndefined({
      ...common,
      content: {
        stem: rich(stemText),
        solution: solutionText ? rich(solutionText) : undefined,
      },
      answer: block.section === 'COMPLETION' && solutionText ? {
        type: 'text',
        value: latexToTypst(solutionText),
        sourceFormat: 'latex',
      } : undefined,
      assets: assetIds.length ? assetIds : undefined,
      extensions: {
        ...common.extensions,
        mathpix: {
          sourceSectionSlug: sectionSlug,
          rawFormat: 'latex',
          outputFormat: 'typst',
          rawStem: stemText,
          rawStemLatex: stemText,
          rawAnswer: normalizeContent(answerLines),
          rawAnswerLatex: normalizeContent(answerLines),
        },
      },
    });
  });
}

function parseMatchingBlock(block, context, chapterTitle) {
  const answerStart = block.lines.findIndex((line) => {
    const normalized = line.replace(/^@@ITEM\s+/, '').trim();
    return /^(\d+\.\s*)?ANS:/i.test(normalized);
  });
  const stemLines = answerStart >= 0 ? block.lines.slice(0, answerStart) : block.lines;
  const answerLines = answerStart >= 0 ? block.lines.slice(answerStart) : [];
  const answerKey = parseMatchingAnswerKey(answerLines);
  const answerText = answerLines.map((line) => line.replace(/^@@ITEM\s+/, '')).join('\n');
  const metadata = collectMetadataValues(answerText);
  const assets = collectAssetIds(`${normalizeContent(stemLines)}\n${answerText}`, context.assetByBase);
  // The items to match are list entries; number them on their own paragraphs so
  // they don't collapse into one line, and give the key as "1 → A" rather than
  // the raw ANS/DIF/OBJ lines.
  let itemNumber = 0;
  const numberedStemLines = stemLines.map((line) => (
    line.startsWith('@@ITEM ') ? `\n${(itemNumber += 1)}. ${line.slice('@@ITEM '.length).trim()}` : line
  ));
  const keyText = answerKey.map(([number, value]) => `${number} → ${value}`).join('\\\\\n');
  return [pruneUndefined({
    id: '',
    kind: 'matching',
    content: {
      stem: rich(numberedStemLines),
      solution: keyText ? rich(keyText) : undefined,
    },
    answer: answerKey.length ? {
      type: 'text',
      value: answerKey.map(([number, value]) => `${number}:${value}`).join('; '),
    } : undefined,
    scoring: {
      points: Math.max(1, answerKey.length),
    },
    classification: classificationFor('MATCHING', chapterTitle, metadata),
    assets: assets.length ? assets : undefined,
    provenance: provenanceFor(context, 'MATCHING'),
    extensions: {
      examview: {
        sourceSection: 'MATCHING',
        answerKey: Object.fromEntries(answerKey),
        metadata,
      },
      mathpix: {
        sourceSectionSlug: 'matching',
        rawFormat: 'latex',
        outputFormat: 'typst',
        rawStem: normalizeContent(stemLines),
        rawStemLatex: normalizeContent(stemLines),
        rawAnswer: normalizeContent(answerLines),
        rawAnswerLatex: normalizeContent(answerLines),
      },
    },
  })];
}

function splitQuestionSegments(lines) {
  const segments = [];
  let current = null;
  let implicitNumber = 0;
  let inAnswer = false;
  let seenMetadataAfterAnswer = false;
  for (const line of lines) {
    const start = questionStart(line);
    if (start) {
      // Every ExamView question ends with ANS + metadata, so a list item before that point
      // belongs to the current question (e.g. numbered steps inside a problem). Only an
      // explicitly numbered next question can start early, for items whose ANS line OCR lost.
      const isNextNumber = start.number !== null && start.number === (current?.number ?? 0) + 1;
      const shouldStartNew = !current || seenMetadataAfterAnswer || (!inAnswer && isNextNumber);
      if (shouldStartNew) {
        if (current && normalizeContent(current.lines)) segments.push(current);
        implicitNumber += 1;
        current = {
          number: start.number ?? implicitNumber,
          lines: start.text ? [start.text] : [],
        };
        inAnswer = false;
        seenMetadataAfterAnswer = false;
      } else if (current) {
        current.lines.push(line);
      }
      if (current && isAnswerMarkerLine(line)) inAnswer = true;
      if (inAnswer && hasMetadataToken(line)) seenMetadataAfterAnswer = true;
      continue;
    }
    if (current) {
      current.lines.push(line);
      if (isAnswerMarkerLine(line)) inAnswer = true;
      if (inAnswer && hasMetadataToken(line)) seenMetadataAfterAnswer = true;
    }
  }
  if (current && normalizeContent(current.lines)) segments.push(current);
  return segments;
}

function splitChoices(lines) {
  const stemLines = [];
  const choices = [];
  let currentChoice = null;
  let sawChoice = false;

  for (const line of lines) {
    const choice = choiceStart(line);
    if (choice) {
      sawChoice = true;
      if (currentChoice) choices.push(currentChoice);
      currentChoice = { id: choice.id, lines: choice.text ? [choice.text] : [] };
      continue;
    }
    if (sawChoice) {
      if (currentChoice) currentChoice.lines.push(line);
    } else {
      stemLines.push(line);
    }
  }
  if (currentChoice) choices.push(currentChoice);

  return repairChoiceBlock(stemLines, choices);
}

// Graph-choice items come through Mathpix as one captioned figure per choice:
// \begin{figure} ... \caption{A} \includegraphics{...} ... \end{figure}
// Mathpix occasionally drops the last caption and leaves a bare \includegraphics
// after the final figure; that image is the single missing letter.
function splitFigureChoices(lines, fallbackChoices) {
  const text = lines.join('\n');
  const figurePattern = /\\begin\{figure\}[\s\S]*?\\caption\{([A-D])\}[\s\S]*?(\\includegraphics(?:\[[^\]]*\])?\{[^}]+\})[\s\S]*?\\end\{figure\}/g;
  const figures = [...text.matchAll(figurePattern)];
  if (figures.length < 2) return { stemLines: lines, choices: fallbackChoices };

  const choices = figures.map((match) => ({ id: match[1], lines: [match[2]] }));
  const lastFigure = figures.at(-1);
  const afterFigures = text.slice(lastFigure.index + lastFigure[0].length);
  const trailingImages = [...afterFigures.matchAll(/\\includegraphics(?:\[[^\]]*\])?\{[^}]+\}/g)];
  const missing = ['A', 'B', 'C', 'D'].filter((id) => !choices.some((choice) => choice.id === id));
  let remainder = afterFigures;
  if (choices.length === 3 && missing.length === 1 && trailingImages.length === 1) {
    choices.push({ id: missing[0], lines: [trailingImages[0][0]] });
    remainder = afterFigures.replace(trailingImages[0][0], '');
  }

  const stemText = text.slice(0, figures[0].index) + remainder;
  return { stemLines: stemText.split('\n'), choices };
}

// ExamView prints four picture choices as a 2x2 grid: A top-left, B bottom-left, C top-right,
// D bottom-right. Mathpix sometimes attaches a picture to the wrong label (an empty B, two
// pictures under C); the crop positions (page_height_width_top_left) settle it. Labels Mathpix
// did read must agree with the positions, or the choices are left as they are.
function assignGridChoices(choices) {
  const imagePattern = /\\includegraphics\s*(?:\[[^\]]*\])?\s*\{([^}]+)\}/g;
  const placed = [];
  for (const choice of choices) {
    const text = choice.lines.join('\n');
    if (text.replace(imagePattern, '').replace(/\\\\|\s/g, '')) return choices;
    for (const match of text.matchAll(imagePattern)) {
      const position = imageStem(match[1]).match(/-(\d+)_\d+_\d+_(\d+)_(\d+)$/);
      if (!position) return choices;
      placed.push({ label: choice.id, call: match[0], page: Number(position[1]), top: Number(position[2]), left: Number(position[3]) });
    }
  }
  if (placed.length !== 4 || new Set(placed.map((image) => image.page)).size !== 1) return choices;
  const byTop = [...placed].sort((a, b) => a.top - b.top);
  const rows = [byTop.slice(0, 2), byTop.slice(2)];
  if (rows[1][0].top - rows[0][1].top < 100) return choices;
  const [[topLeft, topRight], [bottomLeft, bottomRight]] = rows.map((row) => [...row].sort((a, b) => a.left - b.left));
  const grid = { A: topLeft, B: bottomLeft, C: topRight, D: bottomRight };
  const reliable = Object.entries(grid).every(([letter, image]) => {
    const owner = choices.find((choice) => choice.id === letter);
    const own = owner ? [...owner.lines.join('\n').matchAll(imagePattern)] : [];
    return own.length !== 1 || own[0][0] === image.call;
  });
  if (!reliable) return choices;
  return Object.entries(grid).map(([letter, image]) => ({ id: letter, lines: [image.call] }));
}

function repairChoiceBlock(stemLines, choices) {
  if (choices.length <= 4 && new Set(choices.map((choice) => choice.id)).size === choices.length) {
    return { stemLines, choices };
  }

  let candidate = 0;
  for (let index = 0; index <= choices.length - 4; index += 1) {
    const ids = new Set(choices.slice(index, index + 4).map((choice) => choice.id));
    if (['A', 'B', 'C', 'D'].every((id) => ids.has(id))) {
      candidate = index;
      break;
    }
  }

  if (candidate === 0) return { stemLines, choices };

  const recoveredStemLines = choices.slice(0, candidate).flatMap((choice) => {
    const [first = '', ...rest] = choice.lines;
    return [`${choice.id} ${first}`.trim(), ...rest];
  });
  return {
    stemLines: [...stemLines, ...recoveredStemLines],
    choices: choices.slice(candidate),
  };
}

function parseAnswerBlock(lines) {
  if (!lines.length) return { text: '', metadata: {} };
  const answerText = lines
    .map((line, index) => index === 0 ? stripAnswerPrefix(line) : line)
    .join('\n');
  const split = splitMetadata(answerText);
  return {
    text: normalizeContent(split.content),
    metadata: split.metadata,
  };
}

function splitMetadata(text) {
  const matches = metadataTokens(text).filter((token) => token.key);
  if (!matches.length) return { content: text, metadata: {} };

  const metadata = collectMetadataValues(text);
  return {
    content: text.slice(0, matches[0].index),
    metadata,
  };
}

function collectMetadataValues(text) {
  const tokens = metadataTokens(text);
  const metadata = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.key) continue;
    const end = index + 1 < tokens.length ? tokens[index + 1].index : text.length;
    const value = cleanMetadataValue(text.slice(token.valueStart, end));
    if (!value) continue;
    addMetadataValue(metadata, token.key, value);
  }
  return metadata;
}

function mergeMetadata(...metadataItems) {
  const merged = {};
  for (const item of metadataItems) {
    for (const [key, value] of Object.entries(item ?? {})) {
      if (META_KEYS.includes(key)) addMetadataValue(merged, key, value);
    }
  }
  return merged;
}

function stripMetadataText(text) {
  const answerArrayIndex = text.search(/\$?\\begin\{array\}[\s\S]*?(?:ANS:|\\text\s*\{\s*ANS:)/i);
  if (answerArrayIndex >= 0) return text.slice(0, answerArrayIndex).trim();
  const firstMetadataToken = metadataTokens(text).find((token) => token.key);
  return firstMetadataToken ? text.slice(0, firstMetadataToken.index).trim() : text;
}

function metadataTokens(text) {
  const tokens = [];
  const tokenPattern = /\b(DIF|OBJ|NAT|TOP|KEY):\s*|(?:^|\n)\s*(?:\d+\.\s*)?ANS:\s*/g;
  for (const match of text.matchAll(tokenPattern)) {
    tokens.push({
      key: match[1] ?? null,
      index: match.index,
      valueStart: match.index + match[0].length,
    });
  }
  return tokens;
}

function addMetadataValue(metadata, key, value) {
  const parts = splitMetadataItems(value);
  if (!parts.length) return;
  const existing = splitMetadataItems(metadata[key] ?? '');
  metadata[key] = [...new Set([...existing, ...parts])].join(' | ');
}

function splitMetadataItems(value) {
  return String(value ?? '')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitIntoSectionBlocks(lines) {
  const blocks = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('@@SECTION:')) {
      const section = line.slice('@@SECTION:'.length).trim().toUpperCase();
      if (KNOWN_SECTIONS.has(section)) {
        if (current) blocks.push(current);
        current = { section, lines: [] };
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) blocks.push(current);
  return blocks;
}

function normalizeDocumentLines(tex) {
  const body = normalizeFullWidth(extractDocumentBody(tex))
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const normalized = [];
  const listStack = [];
  for (const rawLine of body.split('\n')) {
    let line = rawLine.trim();
    if (!line || /^\\captionsetup\b/.test(line)) {
      normalized.push('');
      continue;
    }
    if (/^\\begin\{document\}|^\\end\{document\}/.test(line)) continue;

    const beginList = line.match(/^\\begin\{(enumerate|itemize)\}/);
    if (beginList) {
      listStack.push(beginList[1]);
      if (beginList[1] === 'itemize') normalized.push(line);
      continue;
    }

    const endList = line.match(/^\\end\{(enumerate|itemize)\}/);
    if (endList) {
      const index = listStack.lastIndexOf(endList[1]);
      if (index >= 0) listStack.splice(index, 1);
      if (endList[1] === 'itemize') normalized.push(line);
      continue;
    }

    const section = line.match(/^\\section\*\{(.+)\}$/);
    if (section) {
      const title = cleanLatexSectionTitle(section[1]);
      const upper = title.toUpperCase();
      if (upper === 'ANS:') {
        normalized.push('ANS:');
        continue;
      }
      if (KNOWN_SECTIONS.has(upper)) {
        normalized.push(`@@SECTION:${upper}`);
        continue;
      }
      normalized.push(`\\section*{${title}}`);
      continue;
    }

    if (line.startsWith('\\item') && listStack.at(-1) === 'enumerate') {
      line = line.replace(/^\\item\b\s*/, '@@ITEM ');
    }
    normalized.push(line);
  }
  return normalized;
}

// Mathpix sometimes OCRs a whole section with CJK full-width punctuation
// (`1．`, `ANS：`, `｜`), which hides question and metadata markers.
function normalizeFullWidth(value) {
  return value
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
    .replace(/。/g, '.')
    .replace(/、/g, ',')
    .replace(/　/g, ' ');
}

function extractDocumentBody(tex) {
  const start = tex.indexOf('\\begin{document}');
  const end = tex.lastIndexOf('\\end{document}');
  if (start >= 0 && end > start) return tex.slice(start + '\\begin{document}'.length, end);
  if (start >= 0) return tex.slice(start + '\\begin{document}'.length);
  return tex;
}

function extractChapterTitle(tex) {
  const body = extractDocumentBody(tex);
  const match = body.match(/\\section\*\{(Chapter\s+\d+:[^}]+)\}/i);
  return match ? cleanLatexSectionTitle(match[1]) : null;
}

function cleanLatexSectionTitle(value) {
  return value.replace(/\\+/g, '\\').trim();
}

function questionStart(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('@@ITEM ')) {
    return { number: null, text: trimmed.slice('@@ITEM '.length).trim() };
  }
  const match = trimmed.match(/^(\d+)\.(?!\d)\s*(.*)$/);
  if (!match) return null;
  return { number: Number(match[1]), text: match[2].trim() };
}

function choiceStart(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^([A-D])(?:[.)])?(?:\s+|\\\\\s*|$)(.*)$/);
  if (!match) return null;
  return { id: match[1], text: match[2].trim() };
}

function isAnswerMarkerLine(line) {
  const normalized = line.replace(/^@@ITEM\s+/, '').trim();
  return /^ANS:/i.test(normalized);
}

function hasMetadataToken(line) {
  return /\b(?:DIF|OBJ|NAT|TOP|KEY):\s*/.test(line);
}

function stripAnswerPrefix(line) {
  return line
    .replace(/^@@ITEM\s+/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^ANS:\s*/i, '');
}

function parseMatchingAnswerKey(lines) {
  const pairs = [];
  let implicit = 1;
  for (const line of lines) {
    const normalized = line.replace(/^@@ITEM\s+/, '').trim();
    const match = normalized.match(/^(?:(\d+)\.\s*)?ANS:\s*([A-Z])/i);
    if (!match) continue;
    const number = match[1] ? Number(match[1]) : implicit;
    pairs.push([String(number), match[2].toUpperCase()]);
    implicit = number + 1;
  }
  return pairs;
}

function classificationFor(section, chapterTitle, metadata, evidenceText = '') {
  const objective = metadata.OBJ ?? '';
  const topic = metadata.TOP ?? '';
  const key = metadata.KEY ?? '';
  const explicitOutcomeCodes = manitobaOutcomeCodes(metadata.NAT ?? '');
  const inferredOutcomeCodes = explicitOutcomeCodes.length ? [] : inferManitobaOutcomeCodes({
    chapterTitle,
    objective,
    topic,
    key,
    evidenceText,
  });
  const outcomeCodes = explicitOutcomeCodes.length ? explicitOutcomeCodes : inferredOutcomeCodes;
  const outcomeSource = explicitOutcomeCodes.length ? 'examview-nat' : inferredOutcomeCodes.length ? 'inferred-from-topic' : undefined;
  const primaryOutcome = outcomeCodes[0] ? MANITOBA_OUTCOMES.get(outcomeCodes[0]) : undefined;
  const tags = [
    'examview',
    'mathpix',
    'mcgraw-hill',
    'pre-calculus-40s',
    section.toLowerCase().replace(/\s+/g, '-'),
    ...outcomeCodes.map(curriculumOutcomeTag),
  ];
  if (key) tags.push(...key.split('|').map((item) => item.trim()).filter(Boolean));
  return pruneUndefined({
    questionType: section.toLowerCase().replace(/\s+/g, '-'),
    tags: uniqueTags(tags),
    classId: MANITOBA_CLASS.id,
    className: MANITOBA_CLASS.name,
    unitId: primaryOutcome?.unitId ?? chapterIdFromTitle(chapterTitle),
    unitName: primaryOutcome?.unitName ?? chapterTitle,
    sectionId: primaryOutcome?.sectionId ?? sectionIdFromObjective(objective),
    sectionName: primaryOutcome?.sectionName ?? (topic || objective || undefined),
    outcomeCode: primaryOutcome?.sectionId,
    curriculum: pruneUndefined({
      jurisdiction: 'Manitoba',
      course: MANITOBA_CLASS.name,
      classId: MANITOBA_CLASS.id,
      className: MANITOBA_CLASS.name,
      unitId: primaryOutcome?.unitId,
      unitName: primaryOutcome?.unitName,
      outcomeCode: primaryOutcome?.sectionId,
      slo: primaryOutcome?.sectionName,
      outcomes: outcomeCodes.map((code) => {
        const outcome = MANITOBA_OUTCOMES.get(code);
        return pruneUndefined({
          outcomeCode: code,
          unitId: outcome?.unitId,
          unitName: outcome?.unitName,
          slo: outcome?.sectionName,
        });
      }),
      examviewObjective: objective || undefined,
      examviewOutcome: metadata.NAT || undefined,
      outcomeSource,
      difficulty: metadata.DIF || undefined,
      topic: topic || undefined,
      key: key || undefined,
    }),
    source: {
      system: SOURCE_METADATA.sourceSystem,
      app: SOURCE_METADATA.sourceApp,
      publisher: SOURCE_METADATA.publisher,
      publisherConfidence: SOURCE_METADATA.publisherConfidence,
      collection: SOURCE_METADATA.collection,
    },
  });
}

function curriculumOutcomeTag(code) {
  const outcome = MANITOBA_OUTCOMES.get(code);
  return outcome ? `${code}. ${outcome.sectionName}` : code;
}

function uniqueTags(tags) {
  const seen = new Set();
  const result = [];
  for (const value of tags) {
    const tag = canonicalTagValue(value);
    if (!tag) continue;
    const identity = canonicalTagIdentity(tag);
    if (seen.has(identity)) continue;
    seen.add(identity);
    result.push(tag);
  }
  return result;
}

function canonicalTagValue(value) {
  const tag = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!tag) return '';
  const lower = tag.toLowerCase();
  if (lower === 'pre-calculus 40s' || lower === 'pre-calculus-40s') return 'pre-calculus-40s';
  if (lower === 'mcgraw hill' || lower === 'mcgraw-hill') return 'mcgraw-hill';
  if (lower === 'exam view' || lower === 'examview') return 'examview';
  if (lower === 'mathpix') return 'mathpix';
  return tag;
}

function canonicalTagIdentity(tag) {
  return canonicalTagValue(tag).toLowerCase();
}

function provenanceFor(context, sourceQuestionNumber) {
  return {
    sourceApp: 'mathpix',
    sourceSystem: SOURCE_METADATA.sourceSystem,
    publisher: SOURCE_METADATA.publisher,
    publisherConfidence: SOURCE_METADATA.publisherConfidence,
    collection: SOURCE_METADATA.collection,
    sourceLabel: basename(context.zipPath),
    sourceQuestionNumber,
    confidence: 'medium',
    originFiles: [relative(TOOL_ROOT, context.zipPath)],
  };
}

function collectAssetIds(text, assetByBase) {
  const ids = [];
  const seen = new Set();
  for (const match of text.matchAll(/\\includegraphics(?:\[[^\]]*])?\{([^}]+)\}/g)) {
    const raw = match[1].trim();
    const name = basename(raw);
    const base = name.slice(0, name.length - extname(name).length) || name;
    const asset = assetByBase.get(base);
    if (asset && !seen.has(asset.id)) {
      seen.add(asset.id);
      ids.push(asset.id);
    }
  }
  return ids;
}

function rich(value) {
  const text = Array.isArray(value) ? normalizeContent(value) : normalizeContent(String(value ?? ''));
  return {
    format: 'typst',
    text: latexToTypst(text),
    sourceFormat: 'latex',
  };
}

function normalizeContent(value) {
  const text = Array.isArray(value) ? value.join('\n') : String(value ?? '');
  return text
    .replace(/^@@ITEM\s+/gm, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function latexToTypst(value) {
  const imageCalls = [];
  let text = normalizePaste(String(value ?? ''));
  text = repairSplitTextMath(text);
  const tableCalls = [];
  text = protectTables(text, tableCalls);
  text = protectImages(text, imageCalls);
  text = convertWrappedDisplayMathEnvironments(text);
  text = convertDisplayMathEnvironments(text);
  text = convertLatexLists(text);
  text = convertLatexStructure(text);
  text = processMathSegments(text, convertTypstText);
  text = restoreImages(text, imageCalls);
  text = restoreTables(text, tableCalls);
  return cleanupTypst(text);
}

// LaTeX tabular -> Typst #table. Innermost tables convert first so a nested
// single-column tabular (a stacked header label) becomes line breaks in its cell.
// Column-spec bars and \hline become explicit table rules, so both full grids
// (|c|c|) and synthetic-division layouts (r|rrrr) keep their lines.
function protectTables(value, tableCalls) {
  const pattern = /\\begin\{tabular\}\s*\{([^}]*)\}((?:(?!\\begin\{tabular\})[\s\S])*?)\\end\{tabular\}/;
  let text = value;
  let match;
  while ((match = text.match(pattern))) {
    const token = `\u001eTAB${tableCalls.length}\u001e`;
    tableCalls.push(convertTabular(match[1], match[2], tableCalls));
    text = text.slice(0, match.index) + token + text.slice(match.index + match[0].length);
  }
  return text;
}

function convertTabular(spec, body, tableCalls) {
  const columns = [...spec.replace(/[@p]\{[^}]*\}/g, 'l')].filter((char) => /[lcr|]/.test(char));
  const aligns = columns.filter((char) => char !== '|');
  const rows = [];
  const hlines = [];
  for (const rawRow of splitTopLevel(body, /\\\\(?:\[[^\]]*\])?/)) {
    let row = rawRow.trim();
    while (/^\\hline\b/.test(row)) {
      hlines.push(rows.length);
      row = row.replace(/^\\hline\b\s*/, '');
    }
    if (row) rows.push(splitTopLevel(row, /&/).map((cell) => convertTableCell(cell.trim(), tableCalls)));
  }
  if (aligns.length === 1) return rows.map((cells) => cells.map((cell) => cell.text).join(' ')).join(' \\ ');

  const vlines = [];
  let columnIndex = 0;
  for (const char of columns) {
    if (char === '|') vlines.push(columnIndex);
    else columnIndex += 1;
  }
  const alignNames = { l: 'left', c: 'center', r: 'right' };
  const items = [
    `columns: ${aligns.length}`,
    'stroke: none',
    `align: (${aligns.map((char) => alignNames[char]).join(', ')},)`,
    ...[...new Set(vlines)].map((x) => `table.vline(x: ${x})`),
    ...[...new Set(hlines)].map((y) => `table.hline(y: ${y})`),
    ...rows.flatMap((cells) => {
      const spanned = cells.reduce((sum, cell) => sum + cell.colspan, 0);
      const padding = Array.from({ length: Math.max(0, aligns.length - spanned) }, () => ({ text: '', colspan: 1 }));
      return [...cells, ...padding].map((cell) => (
        cell.colspan > 1 ? `table.cell(colspan: ${cell.colspan})[${cell.text}]` : `[${cell.text}]`
      ));
    }),
  ];
  return `#table(${items.join(', ')})`;
}

function convertTableCell(cell, tableCalls) {
  const multi = cell.match(/^\\multicolumn\s*\{(\d+)\}\s*\{[^}]*\}\s*\{([\s\S]*)\}$/);
  const content = multi ? multi[2] : cell;
  return {
    text: restoreTables(latexToTypst(content), tableCalls),
    colspan: multi ? Number(multi[1]) : 1,
  };
}

function splitTopLevel(value, separator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  const pattern = new RegExp(separator.source, 'y');
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    // Separators inside math (\( ... \), $ ... $) or nested environments belong to the cell.
    if (value.startsWith('\\(', index)) {
      const close = value.indexOf('\\)', index + 2);
      index = close >= 0 ? close + 1 : value.length;
      continue;
    }
    if (char === '$') {
      let close = index + 1;
      while (close < value.length && !(value[close] === '$' && value[close - 1] !== '\\')) close += 1;
      index = close;
      continue;
    }
    if (value.startsWith('\\begin{', index)) depth += 1;
    else if (value.startsWith('\\end{', index)) depth -= 1;
    else if (char === '{') depth += 1;
    else if (char === '}') depth -= 1;
    else if (char === '\\' && value[index + 1] === '$') index += 1;
    if (depth !== 0) continue;
    pattern.lastIndex = index;
    const match = pattern.exec(value);
    if (match && !(separator.source === '&' && value[index - 1] === '\\')) {
      parts.push(value.slice(start, index));
      index += match[0].length - 1;
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}

function restoreTables(value, tableCalls) {
  return value.replace(/\u001eTAB(\d+)\u001e/g, (full, index) => tableCalls[Number(index)] ?? full);
}

function normalizePaste(value) {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/ﬁ/g, 'fi')
    .replace(/ﬂ/g, 'fl')
    .replace(/ﬀ/g, 'ff')
    .replace(/ﬃ/g, 'ffi')
    .replace(/ﬄ/g, 'ffl')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00AD/g, '')
    .replace(/\u2013/g, '--')
    .replace(/\u2014/g, '---')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
}

function repairSplitTextMath(value) {
  return value
    .replace(/\\right\.\$\s*([A-Za-z][A-Za-z ]*)\s*\$\)/g, (_full, label) => (
      `\\right) \\text { ${label.trim()} }`
    ))
    .replace(/\/\$\s*([A-Za-z][A-Za-z ]*)\s*\$/g, (_full, label) => (
      `/ \\text { ${label.trim()} }`
    ));
}

function protectImages(value, imageCalls) {
  return value.replace(/\\includegraphics\s*(?:\[([^\]]*)\])?\s*\{([^}]+)\}/g, (_full, opts, pathArg) => {
    const renamed = IMAGE_NAMES.get(imageStem(pathArg));
    const stem = renamed?.name ?? imageStem(pathArg);
    // Mathpix's "max width=\textwidth" is a cap, not a size; print crops at their scanned size.
    const args = renamed?.width ? `width: ${renamed.width}` : convertGraphicsOpts(opts ?? '');
    const call = args
      ? `#image("/imgs/${stem}", ${args})`
      : `#image("/imgs/${stem}")`;
    const token = `\u001fIMG${imageCalls.length}\u001f`;
    imageCalls.push(call);
    return token;
  });
}

// Mathpix crop names end in _page_height_width_top_left; sort crops in reading order.
function cropPosition(entry) {
  const match = basename(entry).match(/-(\d+)_\d+_\d+_(\d+)_(\d+)\.\w+$/);
  if (!match) return basename(entry);
  return [match[1], match[2], match[3]].map((value) => value.padStart(5, '0')).join('-');
}

function chapterNumber(chapterStem) {
  return (chapterStem.match(/\d+/)?.[0] ?? '0').padStart(2, '0');
}

function imageStem(pathArg) {
  const filename = basename(String(pathArg ?? '').trim());
  const extension = extname(filename);
  return extension ? filename.slice(0, -extension.length) : filename;
}

function convertGraphicsOpts(opts) {
  const args = [];
  for (const rawPart of String(opts ?? '').split(',')) {
    const match = /^\s*(max\s+width|width|height)\s*=\s*(.+?)\s*$/.exec(rawPart);
    if (!match) continue;
    const key = match[1] === 'height' ? 'height' : 'width';
    const length = convertGraphicsLength(match[2]);
    if (length) args.push(`${key}: ${length}`);
  }
  return [...new Set(args)].join(', ');
}

function convertGraphicsLength(rawValue) {
  const value = String(rawValue ?? '').trim();
  const scaled = /^([\d.]+)\s*\\(?:textwidth|linewidth|columnwidth|hsize)\s*$/.exec(value);
  if (scaled) return `${Math.round(Number.parseFloat(scaled[1]) * 100)}%`;
  if (/^\\(?:textwidth|linewidth|columnwidth|hsize)\s*$/.test(value)) return '100%';
  const absolute = /^([\d.]+)\s*(cm|mm|in|pt|pc|em)\s*$/.exec(value);
  if (absolute) return `${absolute[1]}${absolute[2]}`;
  return '';
}

function restoreImages(value, imageCalls) {
  let restored = value;
  imageCalls.forEach((call, index) => {
    restored = restored.replaceAll(`\u001fIMG${index}\u001f`, call);
  });
  return restored;
}

function convertWrappedDisplayMathEnvironments(value) {
  const environment = String.raw`(equation\*?|align\*?|aligned|gather\*?|multline\*?|eqnarray\*?)`;
  let text = value.replace(
    new RegExp(String.raw`\$\$\s*\\begin\{${environment}\}([\s\S]*?)\\end\{\1\}\s*\$\$`, 'g'),
    (_full, _env, body) => `\n\n$ ${convertAlignedBody(body)} $\n\n`,
  );
  text = text.replace(
    new RegExp(String.raw`\\\[\s*\\begin\{${environment}\}([\s\S]*?)\\end\{\1\}\s*\\\]`, 'g'),
    (_full, _env, body) => `\n\n$ ${convertAlignedBody(body)} $\n\n`,
  );
  // Inline wrappers around an environment (\( \begin{aligned} ... \) or $\begin{aligned} ... $),
  // which Mathpix emits inside table cells; converting both layers would produce `$$`.
  text = text.replace(
    new RegExp(String.raw`(?:\\\(|(?<!\\)\$)\s*\\begin\{${environment}\}([\s\S]*?)\\end\{\1\}\s*(?:\\\)|\$)`, 'g'),
    (_full, _env, body) => `$ ${convertAlignedBody(body)} $`,
  );
  return text;
}

// Keep multi-line display math multi-line: LaTeX rows (\\) become Typst line
// breaks and & alignment points are preserved per row.
function convertAlignedBody(body) {
  const rows = splitTopLevel(body.replace(/\\hline/g, ''), /\\\\(?:\[[^\]]*\])?/)
    .map((row) => splitTopLevel(row, /&/).map((cell) => convertMath(cell.trim())).join(' & ').trim())
    .filter((row) => row && row !== '&');
  return rows.join(' \\\n');
}

function convertDisplayMathEnvironments(value) {
  return value.replace(
    /\\begin\{(equation\*?|align\*?|aligned|gather\*?|multline\*?|eqnarray\*?)\}([\s\S]*?)\\end\{\1\}/g,
    (_full, _env, body) => `\n\n$ ${convertAlignedBody(body)} $\n\n`,
  );
}

function convertLatexLists(value) {
  let text = value.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    (_full, body) => body.replace(/\\item\s*/g, '\n+ ').trim(),
  );
  text = text.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    (_full, body) => body.replace(/\\item\s*/g, '\n- ').trim(),
  );
  // Question splitting can leave half a list (the end lands after the choices).
  text = text.replace(/\\begin\{itemize\}([\s\S]*)$/, (_full, body) => body.replace(/\\item\s*/g, '\n- '));
  return text.replace(/\\end\{itemize\}/g, '');
}

function convertLatexStructure(value) {
  return value
    .replace(/\\caption\s*\{([^}]*)\}/g, '\n*$1*\n')
    .replace(/\\begin\{tabular\}\s*\{[^}]*\}/g, '')
    .replace(/\\(?:begin|end)\{(?:figure|center|document|tabular)\}(?:\[[^\]]*])?/g, '')
    .replace(/\\(?:section|subsection|subsubsection)\*?\s*\{([^}]*)\}/g, '$1\n')
    .replace(/\\(?:noindent|centering|raggedright|raggedleft|smallskip|medskip|bigskip)\b\s*/g, '')
    .replace(/\\(?:vspace|hspace)\s*\{[^}]*\}\s*/g, '')
    .replace(/\\\\(?:\[[^\]]*])?/g, '\n');
}

function processMathSegments(value, textFn) {
  let result = '';
  let index = 0;
  while (index < value.length) {
    if (value[index] === '\\' && value[index + 1] === '[') {
      const end = value.indexOf('\\]', index + 2);
      if (end === -1) break;
      result += textFn(value.slice(0, 0));
      result += `\n\n$ ${convertMath(value.slice(index + 2, end))} $\n\n`;
      index = end + 2;
      continue;
    }
    if (value[index] === '\\' && value[index + 1] === '(') {
      const end = value.indexOf('\\)', index + 2);
      if (end === -1) break;
      result += `$${convertMath(value.slice(index + 2, end))}$`;
      index = end + 2;
      continue;
    }
    if (value[index] === '$' && value[index + 1] === '$') {
      const end = findClosingDoubleDollar(value, index + 2);
      if (end === -1) break;
      result += `\n\n$ ${convertMath(value.slice(index + 2, end))} $\n\n`;
      index = end + 2;
      continue;
    }
    if (value[index] === '$') {
      const end = findClosingDollar(value, index + 1);
      if (end === -1) break;
      result += `$${convertMath(value.slice(index + 1, end))}$`;
      index = end + 1;
      continue;
    }

    const nextMath = nextMathBoundary(value, index);
    const end = nextMath === -1 ? value.length : nextMath;
    result += textFn(value.slice(index, end));
    index = end;
  }
  if (index < value.length) result += textFn(value.slice(index));
  return result;
}

function nextMathBoundary(value, start) {
  const indexes = [
    findClosingDollar(value, start),
    value.indexOf('\\(', start),
    value.indexOf('\\[', start),
  ].filter((item) => item >= 0);
  return indexes.length ? Math.min(...indexes) : -1;
}

function findClosingDollar(value, start) {
  for (let index = start; index < value.length; index += 1) {
    if (value[index] === '$' && value[index - 1] !== '\\') return index;
  }
  return -1;
}

function findClosingDoubleDollar(value, start) {
  for (let index = start; index < value.length - 1; index += 1) {
    if (value[index] === '$' && value[index + 1] === '$' && value[index - 1] !== '\\') return index;
  }
  return -1;
}

function convertTypstText(value) {
  let text = String(value ?? '');
  text = text
    .replace(/\\textbf\s*\{([^}]*)\}/g, '*$1*')
    .replace(/\\(?:textit|emph)\s*\{([^}]*)\}/g, '_$1_')
    .replace(/\\underline\s*\{([^}]*)\}/g, '#underline[$1]')
    .replace(/\\texttt\s*\{([^}]*)\}/g, '`$1`')
    .replace(/\\text(?:rm|normal|sf)\s*\{([^}]*)\}/g, '$1')
    .replace(/\\([%&_{}])/g, '$1')
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*])?\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*])?/g, '')
    .replace(/[{}]/g, '');
  return escapeTypstText(text);
}

function escapeTypstText(value) {
  return value
    // LaTeX-escaped specials (\$150, wire \#2) are literal characters, not backslashes.
    .replace(/\\([#$%&_{}])/g, '$1')
    .replace(/\\/g, '\\\\')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/@/g, '\\@')
    .replace(/\[/g, '\\[')
    .replace(/]/g, '\\]')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}

function cleanupTypst(value) {
  return value
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

// Spaces around binary operators render identically in Typst math, but they let
// test-generator's value replacement find signed values glued to a letter
// (x-4, a>0). Two-character operators and quoted text are left intact.
function spaceOperators(value) {
  let output = '';
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '"' && value[index - 1] !== '\\') quoted = !quoted;
    const startsPair = char === '!' && value[index + 1] === '=';
    if (quoted || (!'+-=<>'.includes(char) && !startsPair) || value[index - 1] === '\\') {
      output += char;
      continue;
    }
    const pair = value.slice(index, index + 2);
    if (['<=', '>=', '!=', '=>', '->', '<-', '=='].includes(pair)) {
      output += ` ${pair} `;
      index += 1;
      continue;
    }
    // A sign at the start of a group stays attached: (-3, 4), f(-x), e^(-2).
    const previous = output.trimEnd().at(-1);
    if ((char === '-' || char === '+') && (previous === undefined || '([{,;=<>^_'.includes(previous))) {
      output += char;
      continue;
    }
    output += ` ${char} `;
  }
  return output.replace(/ {2,}/g, ' ').trim();
}

function convertMath(value) {
  let text = String(value ?? '').trim();
  if (/^root\(s\)$/i.test(text)) return '"root(s)"';
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\\\$\s*([0-9][0-9.,]*)/g, (_full, amount) => `"$${amount}"`)
    .replace(/\\\$/g, '"$"')
    .replace(/\\%/g, '"%"')
    .replace(/(?:\\_){2,}/g, '"____"')
    .replace(/\\_/g, '_')
    .replace(/\\\\/g, '; ')
    .replace(/\\left\s*\\\{/g, '{')
    .replace(/\\right\s*\\\}/g, '}')
    .replace(/\\left\s*\\\[/g, '[')
    .replace(/\\right\s*\\\]/g, ']')
    .replace(/\\left\s*\\\(/g, '(')
    .replace(/\\right\s*\\\)/g, ')')
    .replace(/\\left\s*\|/g, '|')
    .replace(/\\right\s*\|/g, '|')
    .replace(/\\left\s*\./g, '')
    .replace(/\\right\s*\./g, '')
    .replace(/\\left\s*([([<])/g, '$1')
    .replace(/\\right\s*([)\]>])/g, '$1')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}');

  text = convertLatexMathEnvironments(text);
  text = convertLatexArrays(text);
  text = convertLatexFractions(text);
  text = convertLatexSqrt(text);
  text = convertMathTextWrappers(text);
  text = convertMathDecorators(text);
  text = convertMathCommands(text);
  // An empty group carrying a prescript ({ }_{7} C_{4}) becomes an empty Typst string.
  text = convertScripts(text.replace(/\{\s*\}(?=\s*[\^_])/g, '""'));

  return spaceOperators(text
    .replace(/\s*\\over\s*/g, ' / ')
    .replace(/&/g, '')
    .replace(/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle)\s*/g, '')
    .replace(/\\color\s*\{[^}]*\}\s*\{([^}]*)\}/g, '$1')
    .replace(/\\color\s*\{[^}]*\}/g, '')
    .replace(/~/g, ' ')
    .replace(/\\[a-zA-Z]+\*?\s*/g, '')
    .replace(/(?<!")\bpH\b(?!")/g, '"pH"')
    .replace(/\broot\(s\)/gi, '"root(s)"')
    .replace(/\bsuch\b/g, '"such"')
    .replace(/(?<!")\b(?!RR\b|ZZ\b|NN\b|QQ\b|CC\b)([A-Z]{2,})\b(?!")/g, '"$1"')
    .replace(/\b([0-9]+(?:\.[0-9]+)?)-\s*(cm|mm|km|kg|mg|ft|rad)\b/g, '"$1-$2"')
    .replace(/\b([0-9]+(?:\.[0-9]+)?)\s*(cm|mm|km|kg|mg|ft|J|rad|lux|mol|rev|card|cards|year|years|day|days|min|sec)\b/g, '$1 "$2"')
    .replace(/\/\s*(cm|mm|km|kg|mg|ft|J|rad|lux|mol|L|rev|card|cards|year|years|day|days|min|sec|s|h)\b/g, '/ "$1"')
    .replace(/\b(cm|mm|km|kg|mg|ft|rad)\^\(([^)]+)\)/g, '"$1"^($2)')
    .replace(/,\s*(cm|mm|km|kg|mg|ft|J|rad|lux|mol|L|rev|card|cards|year|years|day|days|min|sec|s|h)\)/g, ', "$1")')
    .replace(/\bpi\s+(rad)\b/g, 'pi "$1"')
    .replace(/([})])\s*(cm|mm|km|kg|mg|ft|J|rad|lux|mol)\b/g, '$1 "$2"')
    .replace(/\{(?:aligned|array|gathered)\}/g, '')
    .replace(/^\/\s*"([^"]+)"$/, (_full, unit) => `"/ ${unit}"`)
    .replace(/\s+/g, ' ')
    .trim());
}

function typstMathString(value) {
  const text = String(value ?? '')
    .replace(/\\[a-zA-Z]+\*?/g, ' ')
    .replace(/[{}$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `"${text.replace(/"/g, '\\"')}"`;
}

function convertLatexArrays(value) {
  return value.replace(/\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/g, (_full, body) => (
    body
      .replace(/\\hline/g, '')
      .split(/\\\\/)
      .map((row) => row
        .split('&')
        .map((cell) => convertMath(cell.trim()))
        .filter(Boolean)
        .join(' ; '))
      .filter(Boolean)
      .join(' ; ')
  ));
}

function convertLatexMathEnvironments(value) {
  return value.replace(/\\begin\{(aligned|align\*?|equation\*?|gather\*?|gathered)\}([\s\S]*?)\\end\{\1\}/g, (_full, _env, body) => (
    body
      .replace(/\\hline/g, '')
      .split(/\\\\/)
      .map((row) => convertMath(row.replace(/&/g, '').trim()))
      .filter(Boolean)
      .join(' ; ')
  ));
}

// OCR can split \left( ... \right) pairs across fraction arguments. An unmatched
// paren inside a Typst function argument breaks parsing, so make it literal.
function escapeUnbalancedParens(value) {
  const unmatched = new Set();
  const open = [];
  let inString = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '"' && value[index - 1] !== '\\') inString = !inString;
    if (inString || value[index - 1] === '\\') continue;
    if (char === '(') open.push(index);
    else if (char === ')') {
      if (open.length) open.pop();
      else unmatched.add(index);
    }
  }
  for (const index of open) unmatched.add(index);
  if (!unmatched.size) return value;
  return [...value].map((char, index) => (unmatched.has(index) ? `\\${char}` : char)).join('');
}

function convertLatexFractions(value) {
  let text = value;
  let index = text.indexOf('\\frac');
  while (index >= 0) {
    const openNum = skipWhitespace(text, index + '\\frac'.length);
    if (text[openNum] !== '{') {
      index = text.indexOf('\\frac', index + 5);
      continue;
    }
    const [numerator, afterNum] = extractBraces(text, openNum);
    const openDen = skipWhitespace(text, afterNum);
    if (text[openDen] !== '{') {
      index = text.indexOf('\\frac', index + 5);
      continue;
    }
    const [denominator, afterDen] = extractBraces(text, openDen);
    // OCR occasionally loses a denominator (\frac{x}{}); keep the numerator rather than an invalid frac.
    const converted = denominator.trim()
      ? `frac(${escapeUnbalancedParens(convertMath(numerator))}, ${escapeUnbalancedParens(convertMath(denominator))})`
      : convertMath(numerator);
    text = `${text.slice(0, index)}${converted}${text.slice(afterDen)}`;
    index = text.indexOf('\\frac', index + converted.length);
  }
  return text;
}

// \sqrt{...} and \sqrt[n]{...}, with nested braces in the body (\sqrt{2^{6}}).
function convertLatexSqrt(value) {
  let text = value;
  for (let index = text.indexOf('\\sqrt'); index >= 0; index = text.indexOf('\\sqrt', index + 1)) {
    let cursor = skipWhitespace(text, index + '\\sqrt'.length);
    let degree;
    if (text[cursor] === '[') {
      const close = text.indexOf(']', cursor);
      if (close < 0) continue;
      degree = text.slice(cursor + 1, close);
      cursor = skipWhitespace(text, close + 1);
    }
    if (text[cursor] !== '{') continue;
    const [body, after] = extractBraces(text, cursor);
    const converted = degree !== undefined
      ? `root(${convertMath(degree)}, ${convertMath(body)})`
      : `sqrt(${convertMath(body)})`;
    text = `${text.slice(0, index)}${converted}${text.slice(after)}`;
  }
  return text;
}

function convertMathTextWrappers(value) {
  return value
    .replace(/\\text\s*\{([^}]*)\}/g, '"$1"')
    .replace(/\\(?:mathrm|operatorname)\s*\{([^}]*)\}/g, '$1')
    .replace(/\\mathbb\s*\{([A-Z])\}/g, (_full, letter) => ({
      R: 'RR',
      Z: 'ZZ',
      N: 'NN',
      C: 'CC',
      Q: 'QQ',
    }[letter] ?? letter))
    .replace(/\\mathbf\s*\{([^}]*)\}/g, 'bold($1)');
}

function convertMathDecorators(value) {
  const decorators = {
    vec: 'arrow',
    hat: 'hat',
    bar: 'macron',
    overline: 'overline',
    underline: 'underline',
    tilde: 'tilde',
    widehat: 'hat',
    widetilde: 'tilde',
    dot: 'dot',
    ddot: 'dot.double',
  };
  let text = value;
  for (const [command, typst] of Object.entries(decorators)) {
    text = text.replace(new RegExp(`\\\\${command}\\s*\\{([^}]*)\\}`, 'g'), `${typst}($1)`);
  }
  return text;
}

function convertMathCommands(value) {
  const replacements = {
    alpha: 'alpha',
    beta: 'beta',
    gamma: 'gamma',
    Gamma: 'Gamma',
    delta: 'delta',
    Delta: 'Delta',
    epsilon: 'epsilon',
    varepsilon: 'epsilon',
    zeta: 'zeta',
    eta: 'eta',
    theta: 'theta',
    Theta: 'Theta',
    vartheta: 'theta.alt',
    iota: 'iota',
    kappa: 'kappa',
    lambda: 'lambda',
    Lambda: 'Lambda',
    mu: 'mu',
    nu: 'nu',
    xi: 'xi',
    Xi: 'Xi',
    pi: 'pi',
    Pi: 'Pi',
    rho: 'rho',
    sigma: 'sigma',
    Sigma: 'Sigma',
    tau: 'tau',
    phi: 'phi',
    Phi: 'Phi',
    chi: 'chi',
    psi: 'psi',
    omega: 'omega',
    Omega: 'Omega',
    sin: 'sin',
    cos: 'cos',
    tan: 'tan',
    cot: 'cot',
    sec: 'sec',
    csc: 'csc',
    arcsin: 'arcsin',
    arccos: 'arccos',
    arctan: 'arctan',
    ln: 'ln',
    log: 'log',
    exp: 'exp',
    lim: 'lim',
    int: 'integral',
    sum: 'sum',
    prod: 'product',
    infty: 'infinity',
    partial: 'partial',
    nabla: 'nabla',
    leq: '<=',
    le: '<=',
    geq: '>=',
    ge: '>=',
    neq: '!=',
    ne: '!=',
    approx: 'approx',
    equiv: 'equiv',
    sim: 'tilde.op',
    propto: 'prop',
    in: 'in',
    notin: 'in.not',
    subset: 'subset',
    subseteq: 'subset.eq',
    supset: 'supset',
    supseteq: 'supset.eq',
    cup: 'union',
    cap: 'sect',
    emptyset: 'nothing',
    forall: 'forall',
    exists: 'exists',
    cdot: 'dot.op',
    times: 'times',
    div: 'div',
    pm: 'plus.minus',
    mp: 'minus.plus',
    to: '->',
    rightarrow: '->',
    leftarrow: '<-',
    circ: 'degree',
    mid: '|',
    lvert: '|',
    rvert: '|',
    vert: '|',
    quad: ' ',
    qquad: ' ',
    dots: 'dots.h',
    ldots: 'dots.h',
    cdots: 'dots.h',
    angle: 'angle',
    perp: 'perp',
    parallel: 'parallel',
  };
  let text = value;
  for (const [command, typst] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`\\\\${command}(?![a-zA-Z])`, 'g'), typst);
  }
  return text
    .replace(/\\[,;:!]\s*/g, ' ')
    .replace(/\bd([a-zA-Z])(?=[^a-zA-Z]|$)/g, 'd $1')
    .replace(/\\not\s*(<|>|=)/g, (_full, operator) => `${operator}.not`);
}

function skipWhitespace(value, index) {
  let current = index;
  while (/\s/.test(value[current] ?? '')) current += 1;
  return current;
}

// LaTeX groups scripts with braces (x^{2}); Typst math treats braces as literal
// delimiters, so script groups must become parentheses (x^(2)).
function convertScripts(value) {
  let output = '';
  let index = 0;
  while (index < value.length) {
    const char = value[index];
    if (char === '^' || char === '_') {
      const braceIndex = skipWhitespace(value, index + 1);
      if (value[braceIndex] === '{') {
        const [content, end] = extractBraces(value, braceIndex);
        output += `${char}(${convertScripts(content).trim()})`;
        index = end;
        continue;
      }
    }
    output += char;
    index += 1;
  }
  return output;
}

function extractBraces(value, openIndex) {
  let depth = 0;
  let start = openIndex + 1;
  for (let index = openIndex; index < value.length; index += 1) {
    if (value[index] === '{') {
      if (depth === 0) start = index + 1;
      depth += 1;
    } else if (value[index] === '}') {
      depth -= 1;
      if (depth === 0) return [value.slice(start, index), index + 1];
    }
  }
  return [value.slice(start), value.length];
}

function cleanMetadataValue(value) {
  return value
    .replace(/\\\\/g, ' ')
    .replace(/\\text\s*\{/g, '')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.;,\s]+$/g, '')
    .trim();
}

function validateQuestion(question) {
  const diagnostics = [];
  const stem = question.content?.stem?.text?.trim() ?? '';
  if (!stem) {
    diagnostics.push({
      level: 'error',
      code: 'MATHPIX_EMPTY_STEM',
      message: 'Question has no recovered stem text.',
    });
  }
  if (question.kind === 'mcq') {
    const choices = question.content?.choices ?? [];
    if (choices.length < 2) {
      diagnostics.push({
        level: 'warning',
        code: 'MATHPIX_MCQ_CHOICES_MISSING',
        message: `Multiple-choice question has ${choices.length} recovered choice(s).`,
      });
    }
    const answer = question.answer?.value;
    if (!answer) {
      diagnostics.push({
        level: 'warning',
        code: 'MATHPIX_ANSWER_MISSING',
        message: 'Multiple-choice answer key was not recovered.',
      });
    } else if (!choices.some((choice) => choice.id === answer)) {
      diagnostics.push({
        level: 'warning',
        code: 'MATHPIX_ANSWER_NOT_IN_CHOICES',
        message: `Answer ${answer} does not match a recovered choice id.`,
      });
    }
  }
  return diagnostics;
}

function qualityFromDiagnostics(diagnostics) {
  const errorCount = diagnostics.filter((diagnostic) => diagnostic.level === 'error').length;
  const warningCount = diagnostics.filter((diagnostic) => diagnostic.level === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 50 - warningCount * 15);
  return {
    score,
    verdict: errorCount ? 'garbage' : warningCount ? 'suspect' : 'clean',
    findings: diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      level: diagnostic.level,
      message: diagnostic.message,
    })),
    metrics: {
      diagnosticCount: diagnostics.length,
      errorCount,
      warningCount,
    },
  };
}

function summarizePackage({ zipName, chapterStem, texEntry, imageEntryCount, pqpPath, pqp }) {
  const byKind = {};
  const bySection = {};
  const quality = { clean: 0, suspect: 0, garbage: 0 };
  for (const question of pqp.questions) {
    byKind[question.kind] = (byKind[question.kind] ?? 0) + 1;
    const section = question.extensions?.examview?.sourceSection ?? 'UNKNOWN';
    bySection[section] = (bySection[section] ?? 0) + 1;
    const verdict = question.extensions?.quality?.verdict ?? 'suspect';
    quality[verdict] = (quality[verdict] ?? 0) + 1;
  }
  return {
    zipName,
    chapterStem,
    texEntry,
    pqpFile: basename(pqpPath),
    questionCount: pqp.questions.length,
    assetCount: pqp.assets.length,
    imageEntryCount,
    diagnosticCount: pqp.diagnostics.length,
    byKind,
    bySection,
    quality,
  };
}

function renderReadme(summaries) {
  const rows = summaries.map((item) => (
    `| ${item.chapterStem} | ${item.questionCount} | ${item.assetCount}/${item.imageEntryCount} | ${item.diagnosticCount} | ${formatCounts(item.bySection)} | ${formatCounts(item.quality)} |`
  )).join('\n');
  const totalQuestions = summaries.reduce((sum, item) => sum + item.questionCount, 0);
  const totalAssets = summaries.reduce((sum, item) => sum + item.assetCount, 0);
  const totalDiagnostics = summaries.reduce((sum, item) => sum + item.diagnosticCount, 0);
  return `# Mathpix PQP Output

Generated from ExamView PDF exports processed through Mathpix.

## Totals

- Chapters: ${summaries.length}
- Questions: ${totalQuestions}
- Referenced assets: ${totalAssets}
- Diagnostics: ${totalDiagnostics}
- Content format: Typst (\`content.*.format = "typst"\`)
- Curriculum tags: full Manitoba Pre-Calculus 40S outcome labels, for example \`12P.T.1. Demonstrate an understanding of angles in standard position, expressed in degrees and radians.\`
- Source tags: \`examview\`, \`mathpix\`, \`mcgraw-hill\`, \`pre-calculus-40s\`

## Chapter Summary

| Chapter | Questions | Assets used / exported | Diagnostics | Sections | Quality |
| --- | ---: | ---: | ---: | --- | --- |
${rows}

## Files

- \`*.pqp.json\`: generated Portable Question Package files.
- \`*.summary.json\`: per-chapter conversion summaries.
- \`conversion-summary.json\`: aggregate conversion summary.
- \`raw-tex/\`: original Mathpix LaTeX exported from each zip.
- \`assets/\`: real copied image files referenced by the PQP packages.
- \`typst-audit/\`: generated Typst review files, PDFs, and compile report from \`npm run audit:mathpix-typst\`.

Raw Mathpix LaTeX is also preserved per question under \`extensions.mathpix\`
for review and repair.
`;
}

function formatCounts(counts) {
  return Object.entries(counts)
    .map(([key, value]) => `${key}: ${value}`)
    .join('<br>');
}

function loadManitobaClass() {
  try {
    if (CURRICULUM_CLASSES_PATH && existsSync(CURRICULUM_CLASSES_PATH)) {
      const parsed = JSON.parse(readFileSync(CURRICULUM_CLASSES_PATH, 'utf8'));
      const classes = Array.isArray(parsed.classes) ? parsed.classes : [];
      const found = classes.find((item) => item?.id === 'pre-calculus-40s');
      if (found) return found;
    }
  } catch {
    // Fall back to the embedded Manitoba 40S map below.
  }
  return fallbackManitobaClass();
}

function fallbackManitobaClass() {
  return {
    id: 'pre-calculus-40s',
    name: 'Pre-Calculus 40S',
    units: [
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        sections: [
          { id: '12P.T.1', name: 'Demonstrate an understanding of angles in standard position, expressed in degrees and radians.' },
          { id: '12P.T.2', name: 'Develop and apply the equation of the unit circle.' },
          { id: '12P.T.3', name: 'Solve problems, using the six trigonometric ratios for angles expressed in radians and degrees.' },
          { id: '12P.T.4', name: 'Graph and analyze the trigonometric functions sine, cosine, and tangent to solve problems.' },
          { id: '12P.T.5', name: 'Solve, algebraically and graphically, first- and second-degree trigonometric equations with the domain expressed in degrees and radians.' },
          { id: '12P.T.6', name: 'Prove trigonometric identities, using reciprocal identities, quotient identities, Pythagorean identities, sum or difference identities (restricted to sine, cosine, and tangent), and double-angle identities (restricted to sine, cosine, and tangent).' },
        ],
      },
      {
        id: 'relations-and-functions',
        name: 'Relations and Functions',
        sections: [
          { id: '12P.R.1', name: 'Demonstrate an understanding of operations on, and compositions of, functions.' },
          { id: '12P.R.2', name: 'Demonstrate an understanding of the effects of horizontal and vertical translations on the graphs of functions and their related equations.' },
          { id: '12P.R.3', name: 'Demonstrate an understanding of the effects of horizontal and vertical compressions and stretches on the graphs of functions and their related equations.' },
          { id: '12P.R.4', name: 'Apply translations, compressions, and stretches to the graphs and equations of functions.' },
          { id: '12P.R.5', name: 'Demonstrate an understanding of the effects of reflections on the graphs of functions and their related equations, including reflections through the x-axis, y-axis, and line y = x.' },
          { id: '12P.R.6', name: 'Demonstrate an understanding of inverses of relations.' },
          { id: '12P.R.7', name: 'Demonstrate an understanding of logarithms.' },
          { id: '12P.R.8', name: 'Demonstrate an understanding of the product, quotient, and power laws of logarithms.' },
          { id: '12P.R.9', name: 'Graph and analyze exponential and logarithmic functions.' },
          { id: '12P.R.10', name: 'Solve problems that involve exponential and logarithmic equations.' },
          { id: '12P.R.11', name: 'Demonstrate an understanding of factoring polynomials of degree greater than 2 (limited to polynomials of degree ≤ 5 with integral coefficients).' },
          { id: '12P.R.12', name: 'Graph and analyze polynomial functions (limited to polynomial functions of degree ≤ 5).' },
          { id: '12P.R.13', name: 'Graph and analyze radical functions (limited to functions involving one radical).' },
          { id: '12P.R.14', name: 'Graph and analyze rational functions (limited to numerators and denominators that are monomials, binomials, or trinomials).' },
        ],
      },
      {
        id: 'permutations-combinations-binomial-theorem',
        name: 'Permutations, Combinations, and Binomial Theorem',
        sections: [
          { id: '12P.P.1', name: 'Apply the fundamental counting principle to solve problems.' },
          { id: '12P.P.2', name: 'Determine the number of permutations of n elements taken r at a time to solve problems.' },
          { id: '12P.P.3', name: 'Determine the number of combinations of n different elements taken r at a time to solve problems.' },
          { id: '12P.P.4', name: 'Expand powers of a binomial in a variety of ways, including using the binomial theorem (restricted to exponents that are natural numbers).' },
        ],
      },
    ],
  };
}

function buildOutcomeLookup(curriculumClass) {
  const lookup = new Map();
  for (const unit of curriculumClass.units ?? []) {
    for (const section of unit.sections ?? []) {
      lookup.set(section.id, {
        unitId: unit.id,
        unitName: unit.name,
        sectionId: section.id,
        sectionName: section.name,
      });
    }
  }
  return lookup;
}

function manitobaOutcomeCodes(rawValue) {
  const raw = String(rawValue ?? '');
  const codes = new Set();

  for (const match of raw.matchAll(/\b12P[.-]([TRP])[.-]\s*(\d{1,2})\b/gi)) {
    const code = `12P.${match[1].toUpperCase()}.${Number(match[2])}`;
    if (MANITOBA_OUTCOMES.has(code)) codes.add(code);
  }

  for (const match of raw.matchAll(/\b(RF|PC|T)\s*(\d{1,2})\b/gi)) {
    const code = legacyOutcomeCode(match[1].toUpperCase(), Number(match[2]));
    if (code && MANITOBA_OUTCOMES.has(code)) codes.add(code);
  }

  return [...codes];
}

function inferManitobaOutcomeCodes({ chapterTitle, objective, topic, key, evidenceText }) {
  const haystack = [chapterTitle, objective, topic, key, evidenceText]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const inferred = [];
  const add = (code) => {
    if (MANITOBA_OUTCOMES.has(code) && !inferred.includes(code)) inferred.push(code);
  };

  if (/inverse|line \$?y\s*=\s*x|perpendicular lines|opposite side of the line/.test(haystack)) add('12P.R.6');
  if (/combining transformations|translated|translation|stretch|compression|reflection/.test(haystack)) add('12P.R.4');
  if (/factor theorem|factor fully|synthetic division|factoring polynomial|remainder theorem/.test(haystack)) add('12P.R.11');
  if (/arc length|radian|degree|standard position/.test(haystack)) add('12P.T.1');
  if (/unit circle/.test(haystack)) add('12P.T.2');
  if (/trigonometric ratio|reference angle|exact value|sine ratio|cosine ratio|tangent ratio/.test(haystack)) add('12P.T.3');
  if (/trigonometric equation/.test(haystack)) add('12P.T.5');
  if (/identity|identities/.test(haystack)) add('12P.T.6');
  if (/sum[s]? of functions|difference[s]? of functions|product[s]? and quotient[s]? of functions|composite function|combined function|operations on functions|divide functions|multiply functions/.test(haystack)) add('12P.R.1');
  if (/radical|square root/.test(haystack)) add('12P.R.13');
  if (/rational function/.test(haystack)) add('12P.R.14');
  if (/exponential/.test(haystack)) add('12P.R.9');
  if (/logarithm|laws of logarithms/.test(haystack)) add('12P.R.8');
  if (/permutation/.test(haystack)) add('12P.P.2');
  if (/combination/.test(haystack)) add('12P.P.3');
  if (/binomial/.test(haystack)) add('12P.P.4');

  return inferred;
}

function legacyOutcomeCode(prefix, number) {
  if (prefix === 'RF') return `12P.R.${number}`;
  if (prefix === 'PC') return `12P.P.${number}`;
  if (prefix === 'T') return `12P.T.${number}`;
  return '';
}

function chapterIdFromTitle(title) {
  const match = title.match(/\bChapter\s+0*(\d+)/i);
  return match ? `chapter-${match[1].padStart(2, '0')}` : slug(title);
}

function sectionIdFromObjective(objective) {
  const match = objective.match(/\bSection\s+([0-9.]+)/i);
  return match?.[1] ?? undefined;
}

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'item';
}

function pruneUndefined(value) {
  if (Array.isArray(value)) return value.map(pruneUndefined);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .map(([key, entry]) => [key, pruneUndefined(entry)]),
  );
}

function mimeTypeFor(filename) {
  switch (extname(filename).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

function readZipEntries(zipPath) {
  return unzipSync(new Uint8Array(readFileSync(zipPath)));
}
