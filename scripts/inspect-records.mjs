#!/usr/bin/env node
import { inflateSync } from 'node:zlib';
import { basename, join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const inputPath = process.argv[2];
const outDir = process.argv[3] ?? 'reports/record-inspector';

if (!inputPath) {
  console.error('Usage: npm run inspect:records -- <path-to-bnk-or-tst> [output-dir]');
  process.exit(1);
}

const TEXT_DECODER = new TextDecoder('utf-8', { fatal: false });
const HEADER_LENGTH = 16;
const INLINE_SLOT = '[[slot]]';

const bytes = readFileSync(inputPath);
const header = parseHeader(bytes);
const payload = header.recognized ? bytes.subarray(HEADER_LENGTH) : bytes;
const inflated = inflateSync(payload);
const strings = extractUtf16LeStrings(inflated, 1);
const chunks = findQuestionChunks(strings, inflated.length);
const records = chunks.map((chunk, index) => inspectChunk(chunk, inflated, index));
const summary = summarize(records);
const report = {
  source: {
    path: inputPath,
    byteLength: bytes.length,
    inflatedByteLength: inflated.length,
    header,
  },
  summary,
  records,
};

mkdirSync(outDir, { recursive: true });
const base = basename(inputPath).replace(/\.[^.]+$/, '');
const jsonPath = join(outDir, `${base}.record-inspection.json`);
const mdPath = join(outDir, `${base}.record-inspection.md`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(mdPath, renderMarkdown(report));

console.log(`Inspected ${inputPath}`);
console.log(`Records: ${records.length}`);
console.log(`Inline slots: ${summary.inlineSlotCount}`);
console.log(`Records with unresolved slots: ${summary.recordsWithSlotsWithoutRefs}`);
console.log(`Wrote ${jsonPath}`);
console.log(`Wrote ${mdPath}`);

function parseHeader(fileBytes) {
  if (fileBytes.length < HEADER_LENGTH) return { recognized: false };
  const headerText = TEXT_DECODER.decode(fileBytes.subarray(0, HEADER_LENGTH));
  const match = /^\x1aFSC(BNK|TST)#([^#]+)#([^#]+)#([^#]+)#/.exec(headerText);
  if (!match) {
    return {
      recognized: false,
      rawText: headerText.replace(/[^\x20-\x7e]+/g, '.'),
      rawHex: fileBytes.subarray(0, HEADER_LENGTH).toString('hex').match(/../g)?.join(' ') ?? '',
    };
  }

  return {
    recognized: true,
    kind: match[1] === 'BNK' ? 'bank' : 'test',
    platform: match[2],
    majorVersion: match[3],
    minorVersion: match[4],
    rawText: headerText.replace(/^\x1a/, '\\x1a'),
  };
}

function extractUtf16LeStrings(fileBytes, minLength) {
  return [
    ...extractUtf16LeStringsWithParity(fileBytes, minLength, 0),
    ...extractUtf16LeStringsWithParity(fileBytes, minLength, 1),
  ]
    .sort((left, right) => left.offset - right.offset || right.byteLength - left.byteLength)
    .filter((entry, index, all) => {
      const previous = all[index - 1];
      if (!previous) return true;
      return previous.offset !== entry.offset
        || previous.byteLength !== entry.byteLength
        || previous.text !== entry.text;
    });
}

function extractUtf16LeStringsWithParity(fileBytes, minLength, parity) {
  const out = [];
  let start = -1;
  let text = '';

  for (let offset = parity; offset + 1 < fileBytes.length; offset += 2) {
    const codePoint = fileBytes[offset] | (fileBytes[offset + 1] << 8);
    if (codePoint === 0x0f) {
      if (start === -1) start = offset;
      text += INLINE_SLOT;
      continue;
    }

    if (isReadableUtf16CodePoint(codePoint)) {
      if (start === -1) start = offset;
      text += String.fromCharCode(codePoint);
      continue;
    }

    if (text.trim().length >= minLength) {
      out.push({
        offset: start,
        byteLength: offset - start,
        text: normalizeText(text),
        parity,
      });
    }

    start = -1;
    text = '';
  }

  if (text.trim().length >= minLength) {
    out.push({
      offset: start,
      byteLength: fileBytes.length - start,
      text: normalizeText(text),
      parity,
    });
  }

  return out.filter((entry) => entry.text.length >= minLength);
}

function isReadableUtf16CodePoint(codePoint) {
  return codePoint === 0x09
    || codePoint === 0x0a
    || codePoint === 0x0d
    || (codePoint >= 0x20 && codePoint <= 0x7e)
    || codePoint === 0xa0
    || codePoint === 0x2013
    || codePoint === 0x2014
    || codePoint === 0x2212
    || codePoint === 0x221e
    || (codePoint >= 0x03b1 && codePoint <= 0x03c9);
}

function normalizeText(text) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\u2212/g, '-')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function findQuestionChunks(allStrings, byteLength) {
  const startIndexes = [];
  for (let index = 0; index < allStrings.length; index++) {
    const current = allStrings[index];
    const next = allStrings[index + 1];
    if (!isDifficultyLabel(current.text)) continue;
    if (!next || next.offset - current.offset > 256) continue;
    if (!isQuestionMetadataStart(allStrings, index)) continue;
    startIndexes.push(index);
  }

  return startIndexes.map((startIndex, index) => {
    const nextStartIndex = startIndexes[index + 1];
    return {
      start: allStrings[startIndex],
      endOffset: nextStartIndex === undefined ? byteLength : allStrings[nextStartIndex].offset,
      strings: allStrings.slice(startIndex, nextStartIndex ?? allStrings.length),
    };
  });
}

function isDifficultyLabel(text) {
  return /^(easy|average|medium|moderate|difficult|hard)$/i.test(text);
}

function isQuestionMetadataStart(allStrings, index) {
  if (allStrings[index + 1]?.text?.startsWith('Section ')) return true;
  return isCompactCurriculumCode(allStrings[index + 2]?.text)
    && isCompactMetadataText(allStrings[index + 3]?.text)
    && isCompactMetadataText(allStrings[index + 4]?.text);
}

function isCompactCurriculumCode(text) {
  return Boolean(text && /^[0-9]{1,2}\.[A-Z][A-Z0-9]*(?:\.[A-Z0-9]+)?$/i.test(text));
}

function isCompactMetadataText(text) {
  return Boolean(text && /^[A-Za-z][A-Za-z /&-]{2,}$/.test(text) && !isDifficultyLabel(text));
}

function inspectChunk(chunk, fileBytes, index) {
  const strings = chunk.strings;
  const layout = inferLayout(strings);
  const displayStart = findFirstLikelyDisplayStringIndex(strings, layout.metadataEndIndex);
  const fontIndex = strings.findIndex((entry, entryIndex) => entryIndex > displayStart && isFontString(entry.text));
  const preDisplay = strings.slice(layout.variableStartIndex, displayStart).map((entry) => entry.text).filter(isUsefulPayloadString);
  const displaySegment = strings.slice(displayStart, fontIndex === -1 ? strings.length : fontIndex);
  const displayStrings = displaySegment.map((entry) => entry.text).filter(isLikelyQuestionText);
  const postFontSegment = fontIndex === -1 ? [] : strings.slice(fontIndex + 1);
  const postFontRefs = postFontSegment.map((entry) => entry.text).filter(isVariableName);
  const variables = extractVariables(preDisplay);
  const variableMap = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  const slotRefs = postFontRefs.filter((ref) => variableMap.has(ref.toLowerCase()));
  const visibleChoices = inferVisibleChoices(displaySegment.map((entry) => entry.text));
  const slotDetails = collectSlotDetails(displaySegment, slotRefs, variableMap, fileBytes);

  return {
    index: index + 1,
    id: `record-${index + 1}`,
    offset: chunk.start.offset,
    endOffset: chunk.endOffset,
    byteLength: chunk.endOffset - chunk.start.offset,
    metadata: {
      difficulty: strings[0]?.text,
      sectionName: layout.sectionName,
      reference: layout.reference,
      topic: layout.topic,
      title: layout.title,
      layout: layout.kind,
    },
    counts: {
      stringCount: strings.length,
      preDisplayStringCount: preDisplay.length,
      displayStringCount: displayStrings.length,
      postFontRefCount: postFontRefs.length,
      variableCount: variables.length,
      inlineSlotCount: slotDetails.length,
      visibleChoiceCount: visibleChoices.length,
    },
    variables,
    display: {
      startOffset: strings[displayStart]?.offset,
      fontOffset: fontIndex === -1 ? undefined : strings[fontIndex].offset,
      strings: displayStrings,
      stitched: stitch(displayStrings),
      visibleChoices,
    },
    refs: {
      postFontRefs: postFontRefs.slice(0, 120),
      slotCandidateRefs: slotRefs,
      unusedPostFontRefs: postFontRefs.filter((ref) => !variableMap.has(ref.toLowerCase())).slice(0, 80),
    },
    inlineSlots: slotDetails,
    suspicious: suspiciousFindings({ variables, displayStrings, slotDetails, postFontRefs, visibleChoices }),
    rawPreview: makeRawPreview(fileBytes, chunk.start.offset, Math.min(chunk.endOffset - chunk.start.offset, 768)),
  };
}

function inferLayout(strings) {
  if (strings[1]?.text?.startsWith('Section ')) {
    return {
      kind: 'section-record',
      sectionName: strings[1].text,
      reference: strings[2]?.text,
      topic: strings[3]?.text,
      title: strings[4]?.text,
      metadataEndIndex: 5,
      variableStartIndex: 4,
    };
  }

  if (isCompactCurriculumCode(strings[2]?.text) && strings[3]?.text && strings[4]?.text) {
    return {
      kind: 'compact-curriculum-record',
      sectionName: strings[1]?.text,
      reference: strings[2]?.text,
      topic: strings[3]?.text,
      title: strings[4]?.text,
      metadataEndIndex: 5,
      variableStartIndex: 5,
    };
  }

  return {
    kind: 'unknown-v06-record',
    topic: strings[1]?.text,
    metadataEndIndex: 2,
    variableStartIndex: 2,
  };
}

function findFirstLikelyDisplayStringIndex(strings, startIndex) {
  const promptIndex = strings.findIndex((entry, entryIndex) => entryIndex >= startIndex && isLikelyPromptText(entry.text));
  if (promptIndex !== -1) return promptIndex;

  const readableSentenceIndex = strings.findIndex((entry, entryIndex) => (
    entryIndex >= startIndex
    && isLikelyQuestionText(entry.text)
    && /[A-Za-z]/.test(entry.text)
    && entry.text.length >= 8
    && /\s|[?.]/.test(entry.text)
  ));
  if (readableSentenceIndex !== -1) return readableSentenceIndex;

  const index = strings.findIndex((entry, entryIndex) => entryIndex >= startIndex && isLikelyQuestionText(entry.text));
  return index === -1 ? startIndex : index;
}

function isLikelyQuestionText(text) {
  if (!isUsefulPayloadString(text)) return false;
  if (/^(?:Convert|Calculate|Estimate|Measure)$/i.test(text)) return true;
  if (text.length < 2) return false;
  if (/^[A-Z]{2,}\d*$/i.test(text)) return false;
  if (/^[a-z_]\w*$/i.test(text)) return false;
  if (/^(true|false)$/i.test(text)) return false;
  if (/^(range|if|choose|rand|fracs|isunique)\(/i.test(text)) return false;
  if (/^[\w_]+\(/.test(text) && !/\s/.test(text)) return false;
  return /[ ?.,=<>()[\]{}+\-*/^]|\d/.test(text);
}

function isLikelyPromptText(text) {
  if (!isUsefulPayloadString(text)) return false;
  if (/^(?:If|When|Given|Convert|Calculate|Estimate|Measure)$/i.test(text)) return true;
  if (text.length < 12) return false;
  if (!/\s/.test(text)) return false;
  if (/^(?:range|if|choose|rand|fracs?|isunique|abs)\(/i.test(text)) return false;
  if (/^[A-Za-z_][A-Za-z0-9_]*\s*(?:<>|=|>|<)/.test(text)) return false;
  if (/^[+\-–−]?\d/.test(text)) return false;
  return /^(?:Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|The|A |An |If |Given|Let |Use |Consider|Prove|Show|Find|Select|List|State|Describe|For |In )\b/i.test(text);
}

function isUsefulPayloadString(text) {
  if (!text) return false;
  if (isBoilerplateString(text)) return false;
  if (isFontString(text)) return false;
  return true;
}

function isFontString(text) {
  return /^Times New Roman$/i.test(text) || /^(Symbol|FSC Symbol)$/i.test(text);
}

function isBoilerplateString(text) {
  return /^Copyright \d{4}/.test(text)
    || /\.(bmp|std)$/i.test(text)
    || /^[A-Z]{2}( [A-Z]{2}){5,}$/.test(text);
}

function extractVariables(items) {
  const variables = [];
  for (let index = 0; index < items.length; index++) {
    const name = items[index];
    const rule = items[index + 1];
    if (!isVariableName(name) || !rule || isVariableName(rule)) continue;
    if (isPredicateOrControlRule(name) || isPredicateOrControlRule(rule)) continue;
    const sample = items[index + 2];
    variables.push({
      name,
      rule,
      sampleValue: sample && isSampleValueForRule(rule, sample) ? sample : undefined,
      sourceIndex: index,
    });
  }

  const seen = new Set();
  return variables.filter((variable) => {
    const key = variable.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isVariableName(text) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(text)
    && !/^[A-Z]$/.test(text)
    && !/^(true|false|easy|average|medium|moderate|difficult|hard)$/i.test(text)
    && !/^(convert|calculate|estimate|measure|determine|which|what|how|find)$/i.test(text)
    && !/^(range|if|choose|rand|list|fracs|frac|pow|abs|chr|isunique)$/i.test(text);
}

function isPredicateOrControlRule(text) {
  return /^scramble$/i.test(text)
    || /^(true|false)$/i.test(text)
    || /^[A-Za-z_][A-Za-z0-9_]*\s*(<>|=|>|<)/.test(text)
    || /^isunique\(/i.test(text);
}

function isSampleValueForRule(rule, sample) {
  if (!sample || isPredicateOrControlRule(sample)) return false;
  if (!isVariableName(sample)) return true;
  return /"[^"]*"/.test(rule) || /^list\(/i.test(rule) || /^choose\(/i.test(rule);
}

function inferVisibleChoices(displayStrings) {
  const choices = [];
  const labelPattern = /^([A-H])\.?$/;
  for (let index = 0; index < displayStrings.length; index++) {
    const label = labelPattern.exec(displayStrings[index])?.[1];
    if (!label || choices.some((choice) => choice.id === label)) continue;
    const parts = [];
    for (let partIndex = index + 1; partIndex < displayStrings.length; partIndex++) {
      const part = displayStrings[partIndex];
      if (labelPattern.test(part) || isFontString(part)) break;
      if (parts.length && part.length <= 3 && !/\d/.test(part) && !/[A-Za-z]{3,}/.test(part)) break;
      if (!part || /^[#"'`;:()[\]{}!.,+-]+$/.test(part) || /^[A-Z]$/.test(part) || /^X[A-Za-z0-9_]+$/.test(part)) continue;
      parts.push(part);
    }
    const text = stitch(parts);
    if (text) choices.push({ id: label, text });
  }
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    .map((id) => choices.find((choice) => choice.id === id))
    .filter(Boolean)
    .slice(0, 8);
}

function collectSlotDetails(displaySegment, slotRefs, variableMap, fileBytes) {
  const slots = [];
  let slotIndex = 0;
  for (const entry of displaySegment) {
    const slotOffsets = slotOffsetsInString(entry.text);
    for (const stringIndex of slotOffsets) {
      const ref = slotRefs[slotIndex];
      const variable = ref ? variableMap.get(ref.toLowerCase()) : undefined;
      const absoluteOffset = estimateSlotOffset(entry, stringIndex);
      const context = entry.text
        .slice(Math.max(0, stringIndex - 90), stringIndex + INLINE_SLOT.length + 90)
        .replace(/\s+/g, ' ')
        .trim();
      slots.push({
        index: slotIndex + 1,
        stringOffset: entry.offset,
        estimatedByteOffset: absoluteOffset,
        context,
        candidateRef: ref,
        candidateValue: variable?.sampleValue ?? variable?.rule,
        candidateRule: variable?.rule,
        classification: classifySlotContext(context, variable),
        rawAroundSlot: makeRawPreview(fileBytes, Math.max(0, absoluteOffset - 64), 192),
      });
      slotIndex++;
    }
  }
  return slots;
}

function slotOffsetsInString(text) {
  const offsets = [];
  let index = text.indexOf(INLINE_SLOT);
  while (index !== -1) {
    offsets.push(index);
    index = text.indexOf(INLINE_SLOT, index + INLINE_SLOT.length);
  }
  return offsets;
}

function estimateSlotOffset(entry, stringIndex) {
  const before = entry.text.slice(0, stringIndex);
  const markerAdjustedCodeUnits = before.length - countOccurrences(before, INLINE_SLOT) * (INLINE_SLOT.length - 1);
  return entry.offset + markerAdjustedCodeUnits * 2;
}

function classifySlotContext(context, variable) {
  if (variable) return 'variable-ref';
  if (/\[\[slot\]\]\s*(?:mm|cm|m|km|in\.?|ft\.?|yd\.?|mi\.?|m2|m3|cm2|cm3|in2|in3|ft2|ft3|square|cubic)\b/i.test(context)) return 'fixed-value';
  if (/\b(?:equation|formula|expression|identity|function)\b/i.test(context)) return 'math-object';
  if (/\b(?:shown|diagram|object|pyramid|cone|sphere|tetrahedron|composite|graph)\b/i.test(context)) return 'diagram-object';
  return 'unknown-object';
}

function suspiciousFindings(record) {
  const findings = [];
  if (record.slotDetails?.some((slot) => !slot.candidateRef)) findings.push('slot-without-variable-ref');
  if (record.displayStrings.some((text) => /\[\[slot\]\]/.test(text)) && !record.postFontRefs.length) findings.push('slots-but-no-post-font-refs');
  if (record.variables.length === 0 && record.displayStrings.some((text) => /\[\[slot\]\]/.test(text))) findings.push('slots-but-no-algorithmic-variables');
  if (record.visibleChoices.length === 0 && record.displayStrings.some((text) => /^A\.?$/.test(text))) findings.push('choice-labels-without-choice-text');
  return findings;
}

function stitch(parts) {
  return parts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+([,.;:?])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function makeRawPreview(fileBytes, offset, length) {
  const slice = fileBytes.subarray(offset, Math.min(fileBytes.length, offset + length));
  return {
    offset,
    length: slice.length,
    hex: Buffer.from(slice).toString('hex').match(/../g)?.join(' ') ?? '',
    utf16le: Buffer.from(slice).toString('utf16le')
      .replace(/\u000f/g, INLINE_SLOT)
      .replace(/[^\x09\x0a\x0d\x20-\x7e–—−∞α-ω[\]]+/g, ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .trim(),
  };
}

function summarize(records) {
  const slotClassCounts = {};
  for (const record of records) {
    for (const slot of record.inlineSlots) {
      slotClassCounts[slot.classification] = (slotClassCounts[slot.classification] ?? 0) + 1;
    }
  }
  return {
    recordCount: records.length,
    inlineSlotCount: records.reduce((sum, record) => sum + record.inlineSlots.length, 0),
    recordsWithSlots: records.filter((record) => record.inlineSlots.length).length,
    recordsWithSlotsWithoutRefs: records.filter((record) => record.inlineSlots.some((slot) => !slot.candidateRef)).length,
    variableCount: records.reduce((sum, record) => sum + record.variables.length, 0),
    visibleChoiceCount: records.reduce((sum, record) => sum + record.display.visibleChoices.length, 0),
    slotClassCounts,
    layoutCounts: countBy(records.map((record) => record.metadata.layout)),
    difficultyCounts: countBy(records.map((record) => record.metadata.difficulty ?? 'unknown')),
  };
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count++;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push(`# Record Inspection: ${basename(report.source.path)}`);
  lines.push('');
  lines.push(`- Source: \`${report.source.path}\``);
  lines.push(`- Inflated bytes: ${report.source.inflatedByteLength}`);
  lines.push(`- Records: ${report.summary.recordCount}`);
  lines.push(`- Inline slots: ${report.summary.inlineSlotCount}`);
  lines.push(`- Slot classes: ${Object.entries(report.summary.slotClassCounts).map(([key, value]) => `${key}=${value}`).join(', ') || 'none'}`);
  lines.push('');

  for (const record of report.records) {
    lines.push(`## ${record.id} @ ${record.offset}`);
    lines.push('');
    lines.push(`- Metadata: ${record.metadata.difficulty ?? '?'} | ${record.metadata.sectionName ?? '?'} | ${record.metadata.reference ?? '?'} | ${record.metadata.topic ?? '?'} | ${record.metadata.title ?? '?'}`);
    lines.push(`- Counts: strings=${record.counts.stringCount}, variables=${record.counts.variableCount}, display=${record.counts.displayStringCount}, refs=${record.counts.postFontRefCount}, slots=${record.counts.inlineSlotCount}, visibleChoices=${record.counts.visibleChoiceCount}`);
    if (record.suspicious.length) lines.push(`- Suspicious: ${record.suspicious.join(', ')}`);
    lines.push('');
    lines.push('```text');
    lines.push(record.display.stitched.slice(0, 2000));
    lines.push('```');
    if (record.display.visibleChoices.length) {
      lines.push('');
      lines.push('Choices:');
      for (const choice of record.display.visibleChoices) lines.push(`- ${choice.id}. ${choice.text}`);
    }
    if (record.variables.length) {
      lines.push('');
      lines.push('Variables:');
      for (const variable of record.variables.slice(0, 24)) {
        lines.push(`- ${variable.name} = ${variable.sampleValue ?? '?'}  rule: \`${variable.rule ?? '?'}\``);
      }
    }
    if (record.inlineSlots.length) {
      lines.push('');
      lines.push('Inline slots:');
      for (const slot of record.inlineSlots) {
        lines.push(`- #${slot.index} ${slot.classification} ref=${slot.candidateRef ?? '-'} value=${slot.candidateValue ?? '-'} offset=${slot.estimatedByteOffset}`);
        lines.push(`  context: ${slot.context}`);
      }
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}
