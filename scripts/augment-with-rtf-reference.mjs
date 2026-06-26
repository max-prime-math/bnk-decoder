#!/usr/bin/env node
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, extname, join } from 'node:path';
import { reportPath } from './output-paths.mjs';

const decodedDir = process.argv[2];
const rtfDir = process.argv[3];
const outDir = process.argv[4] ?? reportPath('rtf-augmented');

if (!decodedDir || !rtfDir) {
  console.error('Usage: node scripts/augment-with-rtf-reference.mjs <decoded-dir> <rtf-html-dir> [out-dir]');
  process.exit(1);
}

const unresolvedBodyPattern = /\[(?:DIAGRAM[^\]]+|embedded [^\]]+|inline [^\]]+|diagram\/object not decoded yet|inline object not decoded yet|inline math\/object not decoded yet)\]/gi;
const imageDir = join(outDir, 'rtf-assets');
const copiedAssets = new Map();

mkdirSync(outDir, { recursive: true });
mkdirSync(imageDir, { recursive: true });

const summary = {
  decodedDir,
  rtfDir,
  outDir,
  chapters: [],
  assetsCopied: 0,
  questionsAugmented: 0,
};

for (const file of readdirSync(decodedDir).sort()) {
  const source = join(decodedDir, file);
  const dest = join(outDir, file);
  if (!statSync(source).isFile()) continue;
  if (!/^Chapter \d{2}\.(?:pqp\.)?json$/.test(file)) {
    copyFileSync(source, dest);
  }
}

for (const file of readdirSync(decodedDir).filter((name) => /^Chapter \d{2}\.json$/.test(name)).sort()) {
  const chapterNo = Number(file.match(/Chapter (\d{2})/)?.[1]);
  const sourceJsonPath = join(decodedDir, file);
  const sourcePqpPath = join(decodedDir, file.replace(/\.json$/, '.pqp.json'));
  const outJsonPath = join(outDir, file);
  const outPqpPath = join(outDir, file.replace(/\.json$/, '.pqp.json'));
  const blocks = parseRtfBlocks(chapterNo);
  const decoded = JSON.parse(readFileSync(sourceJsonPath, 'utf8'));
  const pqp = existsSync(sourcePqpPath) ? JSON.parse(readFileSync(sourcePqpPath, 'utf8')) : undefined;
  const pqpQuestions = new Map((pqp?.questions ?? []).map((question) => [question.id, question]));
  const chapterSummary = {
    chapter: chapterNo,
    questionsAugmented: 0,
    assetsAdded: 0,
    unmatched: [],
  };

  for (const question of decoded.questions ?? []) {
    const bodyText = question.body?.text ?? '';
    const hasUnresolvedBody = unresolvedBodyPattern.test(bodyText);
    unresolvedBodyPattern.lastIndex = 0;
    const wantsRenderedVisual = hasUnresolvedBody || shouldAttachRenderedVisualReference(question);
    if (!wantsRenderedVisual) continue;

    const match = bestRtfBlock(question, blocks);
    if (!match || match.images.length === 0) {
      if (hasUnresolvedBody) {
        chapterSummary.unmatched.push({
          id: question.id,
          title: question.metadata?.title ?? '',
          reason: match ? 'matched block has no question images' : 'no matching RTF block',
        });
      }
      continue;
    }

    const refs = match.images.map((image, index) => materializeRtfImage(chapterNo, question.id, image, index));
    const body = applyImageReferences(bodyText, refs);
    question.body.text = body;
    question.assets = unique([...(question.assets ?? []), ...refs.map((ref) => ref.id)]);
    question.decodeDiagnostics = [
      ...(question.decodeDiagnostics ?? []),
      {
        level: 'info',
        code: 'RTF_REFERENCE_ASSETS_ATTACHED',
        message: `Attached ${refs.length} rendered ExamView RTF asset${refs.length === 1 ? '' : 's'} from reference question ${match.n}.`,
      },
    ];

    decoded.assets = [
      ...(decoded.assets ?? []),
      ...refs.map((ref) => ({
        id: ref.id,
        kind: 'image',
        mimeType: ref.mimeType,
        filename: ref.filename,
        byteLength: ref.byteLength,
        sourceOffset: 0,
        sourceLength: ref.byteLength,
      })),
    ];

    const pqpQuestion = pqpQuestions.get(question.id);
    if (pqpQuestion) {
      pqpQuestion.content.stem.text = body;
      pqpQuestion.assets = unique([...(pqpQuestion.assets ?? []), ...refs.map((ref) => ref.id)]);
      pqpQuestion.extensions = {
        ...(pqpQuestion.extensions ?? {}),
        rtfReference: {
          chapter: chapterNo,
          questionNumber: match.n,
          imageCount: refs.length,
        },
      };
    }

    if (pqp) {
      pqp.assets = [
        ...(pqp.assets ?? []),
        ...refs.map((ref) => ({
          id: ref.id,
          kind: 'image',
          filename: ref.filename,
          mimeType: ref.mimeType,
          storage: {
            mode: 'inline-base64',
            base64: ref.base64,
          },
          source: {
            originalPath: ref.sourcePath,
          },
          extensions: {
            rtfReference: {
              chapter: chapterNo,
              questionId: question.id,
              originalName: basename(ref.sourcePath),
            },
          },
        })),
      ];
    }

    chapterSummary.questionsAugmented++;
    chapterSummary.assetsAdded += refs.length;
  }

  summary.questionsAugmented += chapterSummary.questionsAugmented;
  summary.chapters.push(chapterSummary);
  writeFileSync(outJsonPath, `${JSON.stringify(decoded, null, 2)}\n`);
  if (pqp) writeFileSync(outPqpPath, `${JSON.stringify(pqp, null, 2)}\n`);
}

summary.assetsCopied = copiedAssets.size;
writeFileSync(join(outDir, 'rtf-augmentation-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.table(summary.chapters.map((chapter) => ({
  chapter: chapter.chapter,
  questions: chapter.questionsAugmented,
  assets: chapter.assetsAdded,
  unmatched: chapter.unmatched.length,
})));
console.log(`Questions augmented: ${summary.questionsAugmented}`);
console.log(`RTF assets copied: ${summary.assetsCopied}`);
console.log(`Wrote ${outDir}`);

function parseRtfBlocks(chapterNo) {
  const htmlPath = join(rtfDir, `Pre-Calculus 12 - Chapter ${String(chapterNo).padStart(2, '0')}.html`);
  if (!existsSync(htmlPath)) return [];
  const html = readFileSync(htmlPath, 'utf8');
  const startPattern = /<b>\s*(?:\t|&nbsp;|\s)*(\d+)\.\s*(?:\t|&nbsp;|\s)*<\/b>/gi;
  const starts = [...html.matchAll(startPattern)];
  const blocks = [];

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : html.length;
    const fragment = html.slice(start, end);
    const text = htmlToText(fragment);
    const answerIndex = fragment.search(/>\s*ANS:\s*</i);
    const questionFragment = answerIndex >= 0 ? fragment.slice(0, answerIndex) : fragment;
    const questionText = htmlToText(questionFragment);
    const key = normalizeKey(text.match(/KEY:\s*(.*?)\s*$/i)?.[1] ?? '');
    blocks.push({
      n: Number(starts[i][1]),
      key,
      text,
      questionText,
      images: extractImages(questionFragment),
    });
  }

  return blocks;
}

function htmlToText(html) {
  return html
    .replace(/<img\b([^>]+)>/gi, (_match, attrs) => {
      const src = attr(attrs, 'src');
      const name = attr(attrs, 'name');
      const width = attr(attrs, 'width');
      const height = attr(attrs, 'height');
      return ` [[IMG ${decodeHtml(decodeUriLoose(src))} ${name} ${width}x${height}]] `;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImages(html) {
  return [...html.matchAll(/<img\b([^>]+)>/gi)]
    .map((match) => {
      const attrs = match[1];
      const src = decodeUriLoose(attr(attrs, 'src'));
      if (!src) return undefined;
      return {
        src,
        width: Number(attr(attrs, 'width')) || undefined,
        height: Number(attr(attrs, 'height')) || undefined,
      };
    })
    .filter(Boolean);
}

function bestRtfBlock(question, blocks) {
  const key = normalizeKey(question.metadata?.title ?? '');
  const candidates = blocks
    .filter((block) => block.key === key || block.key.includes(key) || key.includes(block.key))
    .concat(blocks.filter((block) => block.key !== key && !block.key.includes(key) && !key.includes(block.key)));
  if (!candidates.length) return undefined;

  const wantsVisual = unresolvedBodyPattern.test(question.body?.text ?? '');
  unresolvedBodyPattern.lastIndex = 0;

  return candidates
    .map((block) => ({
      ...block,
      score: wordScore(question.body?.text ?? '', block.questionText)
        + (block.key === key ? 0.25 : 0)
        + (wantsVisual && block.images.length ? 0.35 : 0),
    }))
    .sort((left, right) => right.score - left.score)[0];
}

function shouldAttachRenderedVisualReference(question) {
  const body = question.body?.text ?? '';
  const title = question.metadata?.title ?? '';
  if (!/\b(?:graph|graphs|scatter plot|diagram|figure|shown|sketch|plot)\b/i.test(body)) return false;
  return /\b(?:graph|modelling|function|trigonometric|unit circle|cosine law|sine law|rational|exponential|logarithmic|sinusoidal|transformations?)\b/i.test(`${title} ${body}`);
}

function wordScore(left, right) {
  const leftWords = wordSet(left);
  const rightWords = wordSet(right);
  let hits = 0;
  for (const word of leftWords) {
    if (rightWords.has(word)) hits++;
  }
  return hits / Math.max(1, Math.sqrt(leftWords.size * rightWords.size));
}

function wordSet(text) {
  const stop = new Set(['the', 'and', 'that', 'with', 'for', 'are', 'not', 'what', 'which', 'where', 'when', 'from', 'this', 'into', 'then', 'each', 'using', 'given']);
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((word) => word.length > 2 && !stop.has(word)));
}

function materializeRtfImage(chapterNo, questionId, image, index) {
  const sourcePath = join(rtfDir, image.src);
  const ext = extname(image.src).replace('.', '').toLowerCase() || 'gif';
  const id = `rtf-ch${String(chapterNo).padStart(2, '0')}-${questionId}-img${index + 1}`;
  const filename = `${id}.${ext}`;
  const destPath = join(imageDir, filename);
  if (!copiedAssets.has(id)) {
    copyFileSync(sourcePath, destPath);
    copiedAssets.set(id, destPath);
  }
  const bytes = readFileSync(sourcePath);
  return {
    id,
    filename,
    sourcePath,
    mimeType: mimeTypeForExt(ext),
    byteLength: bytes.length,
    base64: bytes.toString('base64'),
    typst: `#image("/imgs/${id}", width: 65%)`,
  };
}

function applyImageReferences(body, refs) {
  let index = 0;
  let updated = body.replace(unresolvedBodyPattern, () => refs[index++]?.typst ?? '[rendered RTF object missing]');
  const remaining = refs.slice(index);
  if (remaining.length) {
    updated = `${updated.trim()}\nRendered ExamView reference: ${remaining.map((ref) => ref.typst).join(' ')}`;
  }
  return updated.trim();
}

function normalizeKey(value) {
  return value
    .replace(/\b(?:MULTIPLE CHOICE|COMPLETION|MATCHING|SHORT ANSWER|PROBLEM)\b.*$/i, '')
    .replace(/\bNOT:\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function attr(attrs, name) {
  return attrs.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1] ?? '';
}

function decodeUriLoose(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeHtml(value) {
  return value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function mimeTypeForExt(ext) {
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'bmp') return 'image/bmp';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'webp') return 'image/webp';
  return 'image/gif';
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
