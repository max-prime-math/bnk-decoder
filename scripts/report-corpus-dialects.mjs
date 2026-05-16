#!/usr/bin/env node
import { inflateSync } from 'node:zlib';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.argv[2] ?? 'ignore/ExamView/Banks';
const outDir = process.argv[3] ?? 'reports/corpus-dialects';
const jsonOut = join(outDir, 'corpus-dialects.json');
const mdOut = join(outDir, 'corpus-dialects.md');

const wanted = new Set(['.bnk']);
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

function parseHeader(bytes) {
  const raw = bytes.subarray(0, headerLength);
  const marker = raw.toString('latin1');
  const match = /^\x1aFSCBNK#([A-Z])#(\d\d)#(\d\d)#/.exec(marker);
  if (!match) {
    return {
      recognized: false,
      rawHex: raw.toString('hex').match(/../g)?.join(' ') ?? '',
      rawText: marker.replace(/[^\x20-\x7e]+/g, '.'),
      versionKey: 'unknown',
    };
  }

  return {
    recognized: true,
    kind: 'bank',
    platform: match[1],
    majorVersion: match[2],
    minorVersion: match[3],
    versionKey: `${match[1]} ${match[2]}.${match[3]}`,
    rawHex: raw.toString('hex').match(/../g)?.join(' ') ?? '',
    rawText: marker.replace(/[^\x20-\x7e]+/g, '.'),
  };
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

function countNeedles(text, needles) {
  return Object.fromEntries(needles.map((needle) => [needle, countOccurrences(text, needle)]));
}

function fingerprint(path) {
  const bytes = readFileSync(path);
  const header = parseHeader(bytes);
  const compressed = bytes.subarray(headerLength);
  const summary = {
    path: relative(process.cwd(), path),
    family: relative(root, path).split(/[\\/]/)[0],
    byteLength: bytes.length,
    header,
    inflated: false,
    inflatedLength: undefined,
    markers: undefined,
    diagnostics: undefined,
  };
  summary.dialect = classifyDialect(summary.family, header.versionKey);

  try {
    const inflated = inflateSync(compressed);
    const ascii = inflated.toString('latin1');
    const utf16 = inflated.toString('utf16le');
    summary.inflated = true;
    summary.inflatedLength = inflated.length;
    summary.markers = {
      question: countNeedles(ascii, ['Question', 'question']),
      answer: countNeedles(ascii, ['Answer', 'answer']),
      solution: countNeedles(ascii, ['Solution', 'solution']),
      difficulty: countNeedles(ascii, ['Easy', 'Average', 'Difficult', 'Hard']),
      narrative: countNeedles(utf16, ['narr1', 'narr2', 'narr3', 'narr4', 'narr5', 'narr6']),
      matching: countNeedles(utf16, ['Match the correct term', 'Match']),
      embedded: countNeedles(utf16, ['[embedded object]', '[DIAGRAM NEEDED]', '[embedded value]']),
      math: countNeedles(utf16, ['$', '#math.', 't_n', 'S_8', 'f(11)', 'sqrt(']),
    };
    summary.diagnostics = {
      hasNarrativeCatalog: summary.markers.narrative['narr1'] > 0 || summary.markers.narrative['narr2'] > 0,
      hasMatchingPrompt: summary.markers.matching['Match the correct term'] > 0,
      embeddedPlaceholderCount:
        summary.markers.embedded['[embedded object]'] +
        summary.markers.embedded['[DIAGRAM NEEDED]'] +
        summary.markers.embedded['[embedded value]'],
    };
  } catch (error) {
    summary.inflateError = error instanceof Error ? error.message : String(error);
  }

  return summary;
}

function classifyDialect(family, versionKey) {
  if (versionKey === 'W 05.00') {
    return {
      version: 'v05',
      family,
      profile: 'v05-calculus',
      notes: ['Known single-file v05 outlier; defer until a dedicated v05 parser exists.'],
    };
  }

  const normalizedFamily = family.toLowerCase();
  if (normalizedFamily.includes('pre-calculus') && normalizedFamily.includes('mickelson')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-precalculus-mickelson',
      notes: ['Narrative-heavy, structure-rich pre-calculus dialect.'],
    };
  }
  if (normalizedFamily.includes('pre-calculus')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-precalculus-standard',
      notes: ['Baseline pre-calculus dialect used for regression control.'],
    };
  }
  if (normalizedFamily.includes('mathworks')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-mathworks',
      notes: ['Broader applied-math prompt style; likely more embedded content and varied layouts.'],
    };
  }
  if (normalizedFamily.includes('foundations')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-foundations',
      notes: ['Large applied/foundations banks; likely heavier on template text and nontrivial assets.'],
    };
  }
  if (normalizedFamily.includes('math apprenticeship')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-math-apprenticeship',
      notes: ['Very large banks with heavy applied wording; good stress test for preservation and performance.'],
    };
  }
  if (normalizedFamily.includes('math makes sense')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-math-makes-sense',
      notes: ['School-style unit banks; often language-dense and template-driven.'],
    };
  }
  if (normalizedFamily.includes('calculus')) {
    return {
      version: 'v06',
      family,
      profile: 'v06-calculus',
      notes: ['Legacy/edge bank family; isolate before broad heuristics change.'],
    };
  }
  return {
    version: versionKey === 'unknown' ? 'unknown' : 'v06',
    family,
    profile: 'v06-unknown',
    notes: ['Unclassified bank family; keep behavior conservative until profiled.'],
  };
}

function groupBy(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

function sum(items, selector) {
  return items.reduce((acc, item) => acc + selector(item), 0);
}

function average(items, selector) {
  return items.length ? Math.round(sum(items, selector) / items.length) : 0;
}

const files = walk(root).sort();
const fingerprints = files.map(fingerprint);
const byFamily = groupBy(fingerprints, (file) => file.family);
const byVersion = groupBy(fingerprints, (file) => file.header.versionKey);

const report = {
  generatedAt: new Date().toISOString(),
  root,
  fileCount: fingerprints.length,
  inflatedCount: fingerprints.filter((file) => file.inflated).length,
  versionCounts: Object.fromEntries([...byVersion.entries()].map(([version, group]) => [version, group.length])),
  familyCounts: Object.fromEntries([...byFamily.entries()].map(([family, group]) => [family, group.length])),
  familySummaries: [...byFamily.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([family, group]) => ({
      family,
      files: group.length,
      dialects: Object.fromEntries(Object.entries(group.reduce((acc, file) => {
        const key = file.dialect?.profile ?? 'unknown';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}))),
      versions: Object.fromEntries(Object.entries(group.reduce((acc, file) => {
        acc[file.header.versionKey] = (acc[file.header.versionKey] ?? 0) + 1;
        return acc;
      }, {}))),
      inflated: group.filter((file) => file.inflated).length,
      averageBytes: average(group, (file) => file.byteLength),
      averageInflatedBytes: average(group.filter((file) => file.inflated), (file) => file.inflatedLength ?? 0),
      narrativeHits: sum(group, (file) => file.diagnostics?.hasNarrativeCatalog ? 1 : 0),
      matchingHits: sum(group, (file) => file.diagnostics?.hasMatchingPrompt ? 1 : 0),
      embeddedPlaceholderCount: sum(group, (file) => file.diagnostics?.embeddedPlaceholderCount ?? 0),
    })),
  dialectCounts: Object.fromEntries([...groupBy(fingerprints, (file) => file.dialect?.profile ?? 'unknown').entries()].map(([dialect, group]) => [dialect, group.length])),
  interestingFiles: fingerprints
    .filter((file) => file.header.versionKey !== 'W 06.00' || file.diagnostics?.hasNarrativeCatalog || file.diagnostics?.hasMatchingPrompt || (file.diagnostics?.embeddedPlaceholderCount ?? 0) > 20)
    .sort((a, b) => {
      const score = (file) => (file.header.versionKey !== 'W 06.00' ? 1000 : 0)
        + (file.diagnostics?.hasNarrativeCatalog ? 100 : 0)
        + (file.diagnostics?.hasMatchingPrompt ? 50 : 0)
        + (file.diagnostics?.embeddedPlaceholderCount ?? 0);
      return score(b) - score(a);
    })
    .slice(0, 50),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = [];
md.push('# BNK Corpus Dialect Report');
md.push('');
md.push(`- Generated: ${report.generatedAt}`);
md.push(`- Root: \`${root}\``);
md.push(`- Files: ${report.fileCount}`);
md.push(`- Inflated: ${report.inflatedCount}`);
md.push('');
md.push('## Version Split');
md.push('');
for (const [version, count] of Object.entries(report.versionCounts).sort((a, b) => b[1] - a[1])) {
  md.push(`- ${version}: ${count}`);
}
md.push('');
md.push('## Family Summary');
md.push('');
md.push('## Dialect Split');
md.push('');
for (const [dialect, count] of Object.entries(report.dialectCounts).sort((a, b) => b[1] - a[1])) {
  md.push(`- ${dialect}: ${count}`);
}
md.push('');
md.push('| Family | Files | Dialects | Versions | Avg Bytes | Avg Inflated | Narrative Hits | Matching Hits | Embedded Placeholders |');
md.push('|---|---:|---|---|---:|---:|---:|---:|---:|');
for (const family of report.familySummaries) {
  md.push(`| ${family.family} | ${family.files} | ${Object.entries(family.dialects).map(([k, v]) => `${k}:${v}`).join(', ')} | ${Object.entries(family.versions).map(([k, v]) => `${k}:${v}`).join(', ')} | ${family.averageBytes} | ${family.averageInflatedBytes} | ${family.narrativeHits} | ${family.matchingHits} | ${family.embeddedPlaceholderCount} |`);
}
md.push('');
md.push('## Interesting Files');
md.push('');
for (const file of report.interestingFiles) {
  md.push(`- ${file.path} (${file.header.versionKey}, ${file.byteLength} bytes${file.inflatedLength ? `, inflated ${file.inflatedLength}` : ''})`);
}
md.push('');
writeFileSync(mdOut, `${md.join('\n')}\n`);

console.log(`Wrote ${jsonOut}`);
console.log(`Wrote ${mdOut}`);
