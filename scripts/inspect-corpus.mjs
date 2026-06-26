#!/usr/bin/env node
import { inflateSync } from 'node:zlib';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { reportPath } from './output-paths.mjs';

const root = process.argv[2] ?? 'ignore';
const outDir = process.argv[3] ?? reportPath();
const outFile = join(outDir, 'corpus-summary.json');

const wanted = new Set(['.bnk', '.tst']);
const headerLength = 16;

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) entries.push(...walk(path));
    else if (wanted.has(extname(name).toLowerCase())) entries.push(path);
  }
  return entries;
}

function printableAscii(bytes, limit = 4000) {
  return bytes
    .subarray(0, limit)
    .toString('latin1')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function printableUtf16Le(bytes, limit = 8000) {
  const slice = bytes.subarray(0, Math.min(bytes.length, limit));
  return slice
    .toString('utf16le')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function parseHeader(bytes) {
  const raw = bytes.subarray(0, headerLength);
  const marker = raw.toString('latin1');
  const match = /^\x1aFSC(BNK|TST)#([^#]+)#([^#]+)#([^#]+)#/.exec(marker);
  if (!match) {
    return {
      recognized: false,
      rawHex: raw.toString('hex').match(/../g)?.join(' ') ?? '',
      rawText: marker.replace(/[^\x20-\x7e]+/g, '.'),
    };
  }

  return {
    recognized: true,
    kind: match[1] === 'BNK' ? 'bank' : 'test',
    platform: match[2],
    majorVersion: match[3],
    minorVersion: match[4],
    rawHex: raw.toString('hex').match(/../g)?.join(' ') ?? '',
    rawText: marker.replace(/[^\x20-\x7e]+/g, '.'),
  };
}

function inspectFile(path) {
  const bytes = readFileSync(path);
  const header = parseHeader(bytes);
  const compressed = bytes.subarray(headerLength);
  const summary = {
    path: relative(process.cwd(), path),
    byteLength: bytes.length,
    header,
    compression: {
      offset: headerLength,
      firstBytes: compressed.subarray(0, 4).toString('hex').match(/../g)?.join(' ') ?? '',
      inflated: false,
    },
    textPreview: {},
    markers: {},
  };

  try {
    const inflated = inflateSync(compressed);
    summary.compression.inflated = true;
    summary.compression.inflatedLength = inflated.length;
    summary.textPreview.ascii = printableAscii(inflated);
    summary.textPreview.utf16le = printableUtf16Le(inflated);
    summary.markers = countMarkers(inflated);
  } catch (error) {
    summary.compression.error = error instanceof Error ? error.message : String(error);
  }

  return summary;
}

function countMarkers(bytes) {
  const ascii = bytes.toString('latin1');
  const utf16 = bytes.toString('utf16le');
  const needles = ['Question', 'Answer', 'Solution', 'Difficulty', 'Multiple Choice', 'True/False', 'Algorithm'];
  return Object.fromEntries(
    needles.map((needle) => [
      needle,
      {
        ascii: countOccurrences(ascii, needle),
        utf16le: countOccurrences(utf16, needle),
      },
    ]),
  );
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

const files = walk(root).sort();
const fileSummaries = files.map(inspectFile);
const summary = {
  generatedAt: new Date().toISOString(),
  root,
  fileCount: fileSummaries.length,
  inflatedCount: fileSummaries.filter((file) => file.compression.inflated).length,
  byKind: fileSummaries.reduce((counts, file) => {
    const kind = file.header.kind ?? 'unknown';
    counts[kind] = (counts[kind] ?? 0) + 1;
    return counts;
  }, {}),
  largestFiles: [...fileSummaries]
    .sort((a, b) => b.byteLength - a.byteLength)
    .slice(0, 20)
    .map(({ path, byteLength, compression }) => ({
      path,
      byteLength,
      inflatedLength: compression.inflatedLength,
    })),
  files: fileSummaries,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Inspected ${summary.fileCount} files.`);
console.log(`Inflated ${summary.inflatedCount} files.`);
console.log(`Wrote ${outFile}.`);
