#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const SUPPORTED_IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'bmp', 'pdf']);
const requireFromTestGenerator = createRequire(new URL('../../test-generator/package.json', import.meta.url));
let sharpInstance;

function usage() {
  console.error('Usage: node scripts/export-testgen-safe-bank.mjs <pqp-directory> [output-json]');
  process.exit(1);
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function textOf(value) {
  return isRecord(value) && typeof value.text === 'string' ? value.text : '';
}

function slug(value, fallback) {
  const raw = String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return raw || fallback;
}

function splitFilename(filename) {
  const base = basename(String(filename || ''));
  const ext = extname(base).replace(/^\./, '').toLowerCase();
  const stem = ext ? base.slice(0, -(ext.length + 1)) : base;
  return { stem, ext };
}

function imageKeyFromReference(ref) {
  const raw = String(ref || '').trim();
  if (!raw) return '';
  const decoded = raw.replace(/^\/?imgs\//, '').split(/[?#]/)[0];
  return splitFilename(decoded).stem || decoded;
}

function imageExtFromAsset(asset) {
  const filenameExt = splitFilename(asset.filename || '').ext;
  if (filenameExt) return filenameExt;
  switch (asset.mimeType) {
    case 'image/png': return 'png';
    case 'image/jpeg': return 'jpg';
    case 'image/svg+xml': return 'svg';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    case 'image/bmp': return 'bmp';
    case 'application/pdf': return 'pdf';
    default: return '';
  }
}

function loadSharp() {
  if (sharpInstance !== undefined) return sharpInstance;
  try {
    sharpInstance = requireFromTestGenerator('sharp');
  } catch {
    sharpInstance = null;
  }
  return sharpInstance;
}

async function normalizeImageBytes(base64, ext, stats) {
  const bytes = Buffer.from(base64, 'base64');
  if (ext !== 'bmp') return { bytes, ext, mime: undefined };

  const sharp = loadSharp();
  if (!sharp) {
    stats.unconvertedBmpImages += 1;
    return { bytes, ext, mime: undefined };
  }

  try {
    const converted = await sharp(bytes).png().toBuffer();
    stats.convertedBmpImages += 1;
    return { bytes: converted, ext: 'png', mime: 'image/png' };
  } catch {
    stats.omittedInvalidBmpImages += 1;
    return null;
  }
}

function sanitizeText(raw, stats, context) {
  let text = String(raw ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return '';

  const before = text;
  text = escapePlainTypstPreservingImages(text);
  if (text !== before) {
    stats.plainEscapedFields += 1;
    stats.sanitizedFields.push({ context, reason: 'plain-typst-escape', before: before.slice(0, 180), after: text.slice(0, 180) });
  }

  return text;
}

function escapePlainTypstSegment(segment) {
  return segment
    .replace(/\\/g, '\\\\')
    .replace(/([#$@_*^()[\]{}<>])/g, '\\$1');
}

function escapePlainTypstPreservingImages(text) {
  const imagePattern = /#image\("[^"]+"(?:,\s*[^)]*)?\)/g;
  let out = '';
  let lastIndex = 0;
  for (const match of text.matchAll(imagePattern)) {
    out += escapePlainTypstSegment(text.slice(lastIndex, match.index));
    out += match[0];
    lastIndex = match.index + match[0].length;
  }
  out += escapePlainTypstSegment(text.slice(lastIndex));
  return out;
}

function normalizeParts(rawParts, stats, context) {
  if (!isRecord(rawParts)) return undefined;
  const itemsRaw = Array.isArray(rawParts.items) ? rawParts.items : [];
  const items = itemsRaw
    .filter(isRecord)
    .map((item, index) => {
      const body = sanitizeText(textOf(item.body), stats, `${context}.part-${index + 1}`);
      return {
        label: typeof item.label === 'string' && item.label.trim() ? item.label.trim() : undefined,
        body,
        parts: normalizeParts(item.parts, stats, `${context}.part-${index + 1}`),
      };
    })
    .filter((item) => item.body || item.parts?.items?.length);

  if (items.length < 2) return undefined;
  return {
    stem: sanitizeText(textOf(rawParts.stem), stats, `${context}.parts-stem`),
    items,
  };
}

function normalizeChoices(rawChoices, stats, context) {
  if (!Array.isArray(rawChoices)) return undefined;
  const choices = {};
  for (const choice of rawChoices) {
    if (!isRecord(choice)) continue;
    const id = typeof choice.id === 'string' ? choice.id.trim().toUpperCase() : '';
    const body = sanitizeText(textOf(choice.body), stats, `${context}.choice-${id || 'unknown'}`);
    if (id && body) choices[id] = body;
  }
  return Object.keys(choices).length >= 2 ? choices : undefined;
}

function normalizeDiagnostics(value) {
  if (!Array.isArray(value)) return undefined;
  const diagnostics = value
    .filter(isRecord)
    .map((entry) => ({
      level: entry.level === 'warning' || entry.level === 'error' ? entry.level : 'info',
      code: typeof entry.code === 'string' ? entry.code : 'BNK_DECODER_NOTE',
      message: typeof entry.message === 'string' ? entry.message : '',
    }))
    .filter((entry) => entry.code && entry.message);
  return diagnostics.length ? diagnostics : undefined;
}

function normalizeAnswer(answer) {
  if (!isRecord(answer)) return '';
  if (answer.type === 'choice' && typeof answer.value === 'string') return answer.value.trim().toUpperCase();
  if (typeof answer.value === 'string') return answer.value.trim();
  return '';
}

async function makeAssetMaps(pkg, imageNameCounts, images, stats) {
  const idToName = new Map();
  const refRename = new Map();
  const omittedRefs = new Set();
  const assets = Array.isArray(pkg.assets) ? pkg.assets : [];
  for (const asset of assets) {
    if (!isRecord(asset) || typeof asset.id !== 'string') continue;
    const storage = isRecord(asset.storage) ? asset.storage : {};
    const base64 = typeof storage.base64 === 'string' ? storage.base64 : '';
    const rawExt = imageExtFromAsset(asset);
    const originalName = splitFilename(asset.filename || asset.id).stem || asset.id;
    if (!base64 || !rawExt || !SUPPORTED_IMAGE_EXTENSIONS.has(rawExt)) {
      continue;
    }
    const normalized = await normalizeImageBytes(base64, rawExt, stats);
    if (!normalized) {
      omittedRefs.add(originalName);
      continue;
    }

    let safeName = slug(originalName, asset.id);
    const previousCount = imageNameCounts.get(safeName) ?? 0;
    imageNameCounts.set(safeName, previousCount + 1);
    if (previousCount > 0) safeName = `${safeName}-${previousCount + 1}`;

    idToName.set(asset.id, safeName);
    refRename.set(originalName, safeName);
    images.push({
      name: safeName,
      ext: normalized.ext,
      mime: normalized.mime ?? (typeof asset.mimeType === 'string' ? asset.mimeType : undefined),
      size: normalized.bytes.byteLength,
      data: normalized.bytes.toString('base64'),
    });
  }
  stats.packageAssets += assets.length;
  return { idToName, refRename, omittedRefs };
}

function rewriteImageRefs(text, refRename) {
  let out = text;
  for (const [original, renamed] of refRename) {
    if (original === renamed) continue;
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`/imgs/${escaped}(?=[\\\".)])`, 'g'), `/imgs/${renamed}`);
  }
  return out;
}

function rewriteOmittedImageRefs(text, omittedRefs) {
  let out = text;
  for (const original of omittedRefs) {
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp(`#image\\("/imgs/${escaped}"(?:,\\s*[^)]*)?\\)`, 'g'),
      `\\[image omitted: ${escapePlainTypstSegment(original)}\\]`,
    );
  }
  return out;
}

function collectQuestionImages(question, idToName) {
  const assetIds = Array.isArray(question.assets)
    ? question.assets.filter((id) => typeof id === 'string')
    : [];
  const refs = assetIds.map((id) => idToName.get(id)).filter(Boolean);
  return refs.length ? [...new Set(refs)] : undefined;
}

function chapterInfo(fileName) {
  const stem = basename(fileName).replace(/\.pqp\.json$/i, '').replace(/\.json$/i, '');
  const match = stem.match(/chapter\s*0*(\d+)/i);
  const number = match ? Number(match[1]) : undefined;
  const padded = number ? String(number).padStart(2, '0') : slug(stem, 'unit');
  return {
    label: number ? `Chapter ${padded}` : stem,
    unitId: number ? `chapter-${padded}` : slug(stem, 'unit'),
    sectionId: number ? `chapter-${padded}` : slug(stem, 'section'),
    prefix: number ? `ch${padded}` : slug(stem, 'ch'),
  };
}

function convertQuestion(question, fileName, index, assetMaps, stats, now) {
  const chapter = chapterInfo(fileName);
  const id = `precalculus-12-${chapter.prefix}-${slug(question.id || `q-${index + 1}`, `q-${index + 1}`)}`;
  const content = isRecord(question.content) ? question.content : {};
  const context = `${basename(fileName)}:${question.id || index + 1}`;
  let body = sanitizeText(textOf(content.stem), stats, `${context}.stem`);
  body = rewriteImageRefs(body, assetMaps.refRename);
  body = rewriteOmittedImageRefs(body, assetMaps.omittedRefs);

  const parts = normalizeParts(content.parts, stats, context);
  if (parts) {
    parts.stem = rewriteImageRefs(parts.stem, assetMaps.refRename);
    parts.stem = rewriteOmittedImageRefs(parts.stem, assetMaps.omittedRefs);
    for (const item of parts.items) {
      item.body = rewriteImageRefs(item.body, assetMaps.refRename);
      item.body = rewriteOmittedImageRefs(item.body, assetMaps.omittedRefs);
    }
  }

  if (!body && parts?.items?.length) {
    body = 'Answer the following.';
    stats.partsOnlyQuestions += 1;
  }

  const scoring = isRecord(question.scoring) ? question.scoring : {};
  const classification = isRecord(question.classification) ? question.classification : {};
  const extensions = isRecord(question.extensions) ? question.extensions : {};
  const tags = Array.isArray(classification.tags)
    ? classification.tags.filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim())
    : [];

  const diagnostics = [
    ...(normalizeDiagnostics(extensions.decodeDiagnostics) ?? []),
  ];
  if (extensions.graphTypst) {
    diagnostics.push({
      level: 'info',
      code: 'GRAPH_TYPST_OMITTED_FOR_SAFE_EXPORT',
      message: 'Generated graph Typst was omitted from the safe working copy so rendering is not blocked by graph recovery errors.',
    });
    stats.omittedGraphTypst += 1;
  }

  return {
    id,
    body: body || 'Recovered question text was empty.',
    parts,
    algorithmModel: isRecord(extensions.algorithmModel) ? extensions.algorithmModel : undefined,
    algorithmEvaluation: isRecord(extensions.algorithmEvaluation) ? extensions.algorithmEvaluation : undefined,
    graphModel: isRecord(extensions.graphModel) ? extensions.graphModel : undefined,
    decodeDiagnostics: diagnostics.length ? diagnostics : undefined,
    questionType: typeof classification.questionType === 'string' ? classification.questionType : (typeof question.kind === 'string' ? question.kind : undefined),
    answer: normalizeAnswer(question.answer) || undefined,
    solution: sanitizeText(textOf(content.solution), stats, `${context}.solution`) || undefined,
    choices: normalizeChoices(content.choices, stats, context),
    points: typeof scoring.points === 'number' && Number.isFinite(scoring.points) ? scoring.points : 1,
    tags: [...new Set(['precalculus-12', chapter.unitId, ...tags])],
    images: collectQuestionImages(question, assetMaps.idToName),
    classId: 'precalculus-12',
    unitId: chapter.unitId,
    sectionId: chapter.sectionId,
    createdAt: now,
    checked: false,
  };
}

async function main() {
  const inputArg = process.argv[2];
  if (!inputArg) usage();
  const inputDir = resolve(inputArg);
  const defaultOut = resolve(inputDir, '..', 'testgen-safe', `${basename(inputDir)}.testgen-safe-bank.json`);
  const outputPath = process.argv[3] ? resolve(process.argv[3]) : defaultOut;
  const reportPath = outputPath.replace(/\.json$/i, '.report.json');

  const files = readdirSync(inputDir)
    .filter((file) => file.endsWith('.pqp.json'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!files.length) throw new Error(`No .pqp.json files found in ${inputDir}`);

  const now = Date.now();
  const images = [];
  const imageNameCounts = new Map();
  const stats = {
    files: files.length,
    packageQuestions: 0,
    outputQuestions: 0,
    packageAssets: 0,
    outputImages: 0,
    partsOnlyQuestions: 0,
    omittedGraphTypst: 0,
    unbalancedDollarFields: 0,
    plainEscapedFields: 0,
    convertedBmpImages: 0,
    unconvertedBmpImages: 0,
    omittedInvalidBmpImages: 0,
    sanitizedFields: [],
  };
  const units = [];
  const questions = [];

  for (const file of files) {
    const chapter = chapterInfo(file);
    units.push({ id: chapter.unitId, name: chapter.label, sections: [{ id: chapter.sectionId, name: chapter.label }] });
    const pkg = JSON.parse(readFileSync(join(inputDir, file), 'utf8'));
    const assetMaps = await makeAssetMaps(pkg, imageNameCounts, images, stats);
    const pqpQuestions = Array.isArray(pkg.questions) ? pkg.questions : [];
    stats.packageQuestions += pqpQuestions.length;
    pqpQuestions.forEach((question, index) => {
      if (!isRecord(question)) return;
      questions.push(convertQuestion(question, file, index, assetMaps, stats, now));
    });
  }

  stats.outputQuestions = questions.length;
  stats.outputImages = images.length;

  const output = {
    format: 'test-generator-question-bank',
    version: 2,
    exportedAt: new Date().toISOString(),
    source: {
      kind: 'testgen-safe-pqp',
      label: 'Pre-Calculus 12 safe working copy',
      originDirectory: inputDir,
    },
    producer: {
      app: 'testgen-safe-pqp-export',
      exportedAt: new Date().toISOString(),
    },
    notes: [
      'Safe working-copy export from Portable Question Package files.',
      'Embedded images are included for normal TestGen bank import.',
      'Generated graph Typst is omitted from visible rendering, but graph models are preserved where available.',
      'Fields with malformed dollar math are simplified so the bank can render.',
    ],
    customClasses: [
      {
        id: 'precalculus-12',
        name: 'Pre-Calculus 12',
        units,
      },
    ],
    questions,
    images,
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  writeFileSync(reportPath, `${JSON.stringify(stats, null, 2)}\n`);

  console.log(`Read ${files.length} PQP files from ${inputDir}`);
  console.log(`Questions: ${stats.packageQuestions} -> ${stats.outputQuestions}`);
  console.log(`Images: ${stats.packageAssets} assets -> ${stats.outputImages} embedded images`);
  console.log(`Parts-only questions recovered: ${stats.partsOnlyQuestions}`);
  console.log(`Graph Typst omitted: ${stats.omittedGraphTypst}`);
  console.log(`Plain-escaped text fields: ${stats.plainEscapedFields}`);
  console.log(`BMP images converted to PNG: ${stats.convertedBmpImages}`);
  if (stats.unconvertedBmpImages) console.log(`BMP images left as BMP: ${stats.unconvertedBmpImages}`);
  if (stats.omittedInvalidBmpImages) console.log(`Invalid BMP image calls omitted: ${stats.omittedInvalidBmpImages}`);
  console.log(`Wrote ${outputPath}`);
  console.log(`Report ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
