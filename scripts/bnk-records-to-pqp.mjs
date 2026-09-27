#!/usr/bin/env node
// Build Portable Question Packages straight from ExamView BNK question records (route B: no
// printout). Reads every .bnk in a folder with the structural record reader
// (packages/bnk-core/src/records.ts), renders question text, equations, tables and pictures
// as Typst, and writes one <section>.pqp.json per BNK file with its pictures under
// assets/<section>/. A question that can't be rendered completely, or whose answer can't be
// read, is left out and listed with its reasons in the package diagnostics and summary.
//
// Usage: node --experimental-strip-types scripts/bnk-records-to-pqp.mjs <bnk-dir> <out-dir> <bank-config.json> [overrides.json]
// The bank config (see data/pqp-banks/) names the bank and maps each section to its
// curriculum outcomes. The optional overrides file (see data/pqp-overrides/) lists reviewed
// ExamView authoring errors, keyed by section file and source question number:
//   { "<section>": { "MULTIPLE CHOICE 3": { "exclude": true, "note": "why" } } }
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzlibSync } from 'fflate';
import { readQuestionRecords } from '../packages/bnk-core/src/records.ts';
import { renderRecordQuestion } from '../packages/bnk-core/src/record-questions.ts';
import { dibToPng, pictureWidthInches } from '../packages/bnk-core/src/record-typst.ts';
import { buildOutcomeLookup, loadManitobaClass } from './manitoba-curriculum.mjs';

const TOOL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [bnkArg, outArg, configArg, overridesArg] = process.argv.slice(2);
if (!bnkArg || !outArg || !configArg) {
  console.error('Usage: node --experimental-strip-types scripts/bnk-records-to-pqp.mjs <bnk-dir> <out-dir> <bank-config.json>');
  process.exit(1);
}
const bnkDir = resolve(bnkArg);
const outDir = resolve(outArg);
const config = JSON.parse(readFileSync(resolve(configArg), 'utf8'));
const OVERRIDES = overridesArg ? JSON.parse(readFileSync(resolve(overridesArg), 'utf8')) : {};
const CURRICULUM = loadManitobaClass(process.env.CURRICULUM_CLASSES ? resolve(process.env.CURRICULUM_CLASSES) : null);
const OUTCOMES = buildOutcomeLookup(CURRICULUM);

const TYPE_INFO = {
  'true-false': { label: 'TRUE/FALSE', kind: 'mcq', points: 1 },
  'yes-no': { label: 'YES/NO', kind: 'mcq', points: 1 },
  'multiple-choice': { label: 'MULTIPLE CHOICE', kind: 'mcq', points: 1 },
  'short-answer': { label: 'SHORT ANSWER', kind: 'frq', points: 2 },
  problem: { label: 'PROBLEM', kind: 'frq', points: 5 },
};
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const files = readdirSync(bnkDir)
  .filter((file) => file.toLowerCase().endsWith('.bnk'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const summaries = files.map((file) => convertFile(file));
writeFileSync(join(outDir, 'summary.json'), `${JSON.stringify(summaries, null, 2)}\n`);
writeFileSync(join(outDir, 'README.md'), renderReadme(summaries));
const total = (key) => summaries.reduce((sum, item) => sum + item[key], 0);
console.log(`\n${total('shipped')} of ${total('found')} questions shipped from ${files.length} files; ${total('leftOut')} left out; ${total('pictures')} pictures`);

function convertFile(file) {
  const stem = file.replace(/\.bnk$/i, '');
  const sourcePath = relative(TOOL_ROOT, join(bnkDir, file));
  const bytes = readFileSync(join(bnkDir, file));
  const header = new TextDecoder('latin1').decode(bytes.subarray(0, 16));
  const summary = { file, section: stem, found: 0, shipped: 0, leftOut: 0, pictures: 0, byType: {}, leftOutQuestions: [] };
  const unusedOverrides = new Set(Object.keys(OVERRIDES[stem] ?? {}));
  if (!/^\x1aFSC(BNK|TST)#W#06#/.test(header)) {
    console.warn(`${file}: not an ExamView v06 file, skipped`);
    return summary;
  }
  const bank = readQuestionRecords(unzlibSync(bytes.subarray(16)));
  if (!bank) {
    console.warn(`${file}: records don't follow the metadata-free v06 layout, skipped`);
    return summary;
  }

  const sectionKey = bank.sectionTitle.match(/^(\d+\.\d+)/)?.[1] ?? stem.match(/^(\d+\.\d+)/)?.[1] ?? stem;
  const sectionConfig = config.sections?.[sectionKey] ?? {};
  const chapterNumber = sectionKey.split('.')[0];
  const assetDir = join(outDir, 'assets', stem);
  const assets = [];
  const assetByHash = new Map();
  const questions = [];
  const diagnostics = [];
  const counters = {};

  for (const record of bank.records) {
    summary.found += 1;
    const info = TYPE_INFO[record.type];
    const label = info?.label ?? `TYPE ${record.typeCode}`;
    counters[label] = (counters[label] ?? 0) + 1;
    const sourceQuestionNumber = `${label} ${counters[label]}`;
    summary.byType[label] ??= { found: 0, shipped: 0 };
    summary.byType[label].found += 1;

    const pictureProblems = [];
    const usedAssets = new Set();
    // Pictures are staged per question and only written when the question ships.
    const staged = [];
    const options = {
      picture(object) {
        let png;
        try {
          png = dibToPng(object.dib);
        } catch (error) {
          pictureProblems.push(`picture: ${error.message}`);
          return '';
        }
        const hash = createHash('sha1').update(png).digest('hex');
        let asset = assetByHash.get(hash) ?? staged.find((item) => item.hash === hash)?.asset;
        if (!asset) {
          const name = `${config.prefix}-${sectionKey.replace('.', '-')}-${String(assets.length + staged.length + 1).padStart(2, '0')}`;
          asset = {
            id: `${slug(stem)}-asset-${name}`,
            kind: 'image',
            filename: `${name}.png`,
            mimeType: 'image/png',
            storage: { mode: 'external', path: join('assets', stem, `${name}.png`) },
            source: { originalPath: `${sourcePath}#question-${record.number}` },
            extensions: { examview: { widthTwips: object.widthTwips, heightTwips: object.heightTwips } },
          };
          staged.push({ hash, png, asset });
        }
        usedAssets.add(asset.id);
        // Inline box: pictures typed side by side ("shown on the left ... right") stay side by side.
        return `#box(image("/imgs/${asset.filename.replace(/\.png$/, '')}", width: ${pictureWidthInches(object).toFixed(2)}in))`;
      },
    };

    const rendered = renderRecordQuestion(record, options);
    const problems = [...rendered.problems, ...pictureProblems];
    const content = {
      stem: rich(rendered.stem),
      choices: rendered.choices?.map((choice) => ({ id: choice.id, body: rich(choice.text) })),
      solution: rendered.solution ? rich(rendered.solution) : undefined,
    };
    const answer = rendered.answer ? { type: 'choice', value: rendered.answer } : undefined;
    const override = OVERRIDES[stem]?.[sourceQuestionNumber];
    unusedOverrides.delete(sourceQuestionNumber);
    if (override?.exclude) {
      if (override.questionNumber !== undefined && override.questionNumber !== record.number) {
        throw new Error(`${stem} ${sourceQuestionNumber}: override is for ExamView question ${override.questionNumber}, found ${record.number}`);
      }
      problems.push(`reviewed authoring error: ${override.note}`);
    }

    if (problems.length) {
      summary.leftOut += 1;
      summary.leftOutQuestions.push({ sourceQuestionNumber, recordNumber: record.number, reasons: [...new Set(problems)] });
      diagnostics.push({
        level: 'warning',
        code: 'QUESTION_LEFT_OUT',
        message: `${sourceQuestionNumber} (ExamView question ${record.number}) left out: ${[...new Set(problems)].join('; ')}`,
      });
      continue;
    }

    for (const { hash, png, asset } of staged) {
      mkdirSync(assetDir, { recursive: true });
      writeFileSync(join(assetDir, asset.filename), png);
      assetByHash.set(hash, asset);
      assets.push(asset);
    }
    summary.shipped += 1;
    summary.byType[label].shipped += 1;
    questions.push(pruneUndefined({
      id: `${config.prefix}-${sectionKey.replace('.', '-')}-q${String(record.number).padStart(2, '0')}`,
      kind: info?.kind ?? 'frq',
      content,
      answer,
      scoring: { points: info?.points ?? 1 },
      classification: classificationFor(record.type, sectionKey, sectionConfig, bank, chapterNumber),
      assets: usedAssets.size ? [...usedAssets] : undefined,
      provenance: {
        sourceApp: 'bnk-decoder',
        sourceSystem: 'ExamView',
        author: config.author,
        collection: config.bank,
        sourceLabel: file,
        sourceQuestionNumber,
        confidence: 'high',
        originFiles: [sourcePath],
      },
      extensions: {
        examview: {
          sourceSection: label,
          sourceQuestionNumber: counters[label],
          questionNumber: record.number,
          typeCode: record.typeCode,
          answerCode: rendered.answer ? record.answerCode : undefined,
          recordOffset: record.offset,
        },
        decodeDiagnostics: [{ level: 'info', code: 'BNK_RECORD_DECODED', message: 'Decoded from the ExamView question record (no printout).' }],
      },
    }));
  }
  if (unusedOverrides.size) throw new Error(`${stem}: overrides for questions that don't exist: ${[...unusedOverrides].join(', ')}`);
  summary.pictures = assets.length;

  const pqp = {
    format: 'portable-question-package',
    version: '1.0',
    producer: { app: 'bnk-decoder', appVersion: '0.1.0', pipeline: 'bnk-records', exportedAt: new Date().toISOString() },
    source: {
      kind: 'bnk',
      label: file,
      sourceSystem: 'ExamView',
      author: config.author,
      collection: config.bank,
      curriculum: 'Manitoba Pre-Calculus 40S',
      bankTitle: bank.title,
      sectionTitle: bank.sectionTitle,
      originFiles: [sourcePath],
    },
    questions,
    assets,
    diagnostics,
    extensions: {
      curriculum: { classId: CURRICULUM.id, className: CURRICULUM.name },
      bnk: { bankId: bank.bankId, records: bank.records.length },
    },
  };
  writeFileSync(join(outDir, `${stem}.pqp.json`), `${JSON.stringify(pqp, null, 2)}\n`);
  console.log(`${stem}: ${summary.shipped}/${summary.found} shipped, ${summary.leftOut} left out, ${summary.pictures} pictures`);
  return summary;
}

function classificationFor(type, sectionKey, sectionConfig, bank, chapterNumber) {
  const codes = (sectionConfig.outcomes ?? []).filter((code) => OUTCOMES.has(code));
  const primary = codes[0] ? OUTCOMES.get(codes[0]) : undefined;
  const chapterName = config.chapters?.[chapterNumber] ?? `Chapter ${chapterNumber}`;
  const unit = primary ?? (sectionConfig.unitId ? CURRICULUM.units.find((item) => item.id === sectionConfig.unitId) : undefined);
  const sectionName = bank.sectionTitle || sectionKey;
  return pruneUndefined({
    questionType: type,
    tags: [...new Set(['examview', ...(config.tags ?? []), 'pre-calculus-40s', type])],
    classId: CURRICULUM.id,
    className: CURRICULUM.name,
    unitId: primary?.unitId ?? unit?.id ?? `${config.prefix}-chapter-${chapterNumber.padStart(2, '0')}`,
    unitName: primary?.unitName ?? unit?.name ?? `Chapter ${chapterNumber}: ${chapterName}`,
    sectionId: primary?.sectionId ?? `${config.prefix}-${sectionKey}`,
    sectionName: primary?.sectionName ?? sectionName,
    outcomeCode: primary?.sectionId,
    curriculum: pruneUndefined({
      jurisdiction: 'Manitoba',
      course: CURRICULUM.name,
      classId: CURRICULUM.id,
      className: CURRICULUM.name,
      unitId: primary?.unitId,
      unitName: primary?.unitName,
      outcomeCode: primary?.sectionId,
      slo: primary?.sectionName,
      outcomes: codes.map((code) => pruneUndefined({
        outcomeCode: code,
        unitId: OUTCOMES.get(code).unitId,
        unitName: OUTCOMES.get(code).unitName,
        slo: OUTCOMES.get(code).sectionName,
      })),
      outcomeSource: codes.length ? 'section-table' : undefined,
      examviewChapter: `Chapter ${chapterNumber}: ${chapterName}`,
      examviewSection: sectionName,
    }),
    source: { system: 'ExamView', app: 'bnk-decoder', author: config.author, collection: config.bank },
  });
}

function renderReadme(items) {
  const rows = items.map((item) => {
    const types = Object.entries(item.byType).map(([label, count]) => `${label} ${count.shipped}/${count.found}`).join(', ');
    return `| ${item.section} | ${item.found} | ${item.shipped} | ${item.leftOut} | ${item.pictures} | ${types} |`;
  });
  const leftOut = items.flatMap((item) => item.leftOutQuestions.map((question) => (
    `- ${item.section}, ${question.sourceQuestionNumber} (ExamView question ${question.recordNumber}): ${question.reasons.join('; ')}`
  )));
  return `# ${config.bank}: Portable Question Packages

Generated by \`scripts/bnk-records-to-pqp.mjs\` straight from the ExamView BNK question records
(no printout or Mathpix output exists for this bank). Content is Typst; answers come from the
BNK record (multiple-choice index, true/false and yes/no flag, short-answer and problem answer text).

Regenerate with \`npm run pqp:mickelson12\`; check with
\`TEST_GENERATOR_DIR=<test-generator> npm run check:pqp -- ${relative(TOOL_ROOT, outDir)} --bnk '${relative(TOOL_ROOT, bnkDir)}'\`.

| Section | Found | Shipped | Left out | Pictures | By type (shipped/found) |
|---|---:|---:|---:|---:|---|
${rows.join('\n')}

## Left out

${leftOut.length ? leftOut.join('\n') : 'None.'}
`;
}

function rich(text) {
  return { format: 'typst', text };
}

function slug(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

function pruneUndefined(value) {
  if (Array.isArray(value)) return value.map(pruneUndefined);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined).map(([key, entry]) => [key, pruneUndefined(entry)]));
}
