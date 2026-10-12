// Structural reader for ExamView v06 question records.
//
// Layout (inflated payload, little-endian). The first int32 of the payload is the bank id.
//
// Bank header is 0xffc bytes; counts at +f58/+f5c/+f60 specify questions/narratives/groups.
// Records follow sequentially in that order (ExamView writer FUN_0047edc0).
// Question record:
//   +0x00 int32 question number     +0x04 int32 bank id     +0x08 int32 type code
//   +0x0c int32 narrative id (-1 none) +0x10 int32 bank id +0x14 first text present (0/1)
//   +0x18 int32 second text present (0/1)
//   +0x1c int32 answer: choice index for multiple choice (0 = a), 0/1 = True/False, Yes/No
//   +0x24 int32 choice count (multiple choice)
//   +0x214 metadata block: int32 byteLength counting itself, then NUL-terminated UTF-16 strings
//          followed by an algorithm block with its own self-inclusive int32 byteLength.
//          Empty metadata and algorithm blocks each have length 4: first text is then +0x21c.
//   Blocks follow each other until the next record: block 0 is the question, block 1 the
//   answer of short-answer and problem questions.
//
// Rich-text block:
//   15 int32: byteLength (counts itself), 1, charCount, paragraphRuns, paragraphStyles,
//             charRuns, charStyles, faces, 0, 0, tables, tableCells, objects, 1, 0
//   UTF-16 text (charCount units) + 2-byte terminator
//   paragraphRuns × 12 bytes   [int32 start, int32 style, int32 0]
//   paragraphStyles × 168 bytes (6-byte prefix + 162)
//   charRuns × 12 bytes        [int32 start, int32 style, int32 0]
//   charStyles × 24 bytes      [int32 size, int32 flags (1 bold, 2 underline, 4 italic),
//                               int32 face, int32 weight, int32 pitch/charset, int32 0]
//   faces × 66 bytes           UTF-16 face name ("Times New Roman", "Symbol")
//   tables × 20 bytes, then tableCells × 52 bytes [int32 start, ..., int16 flags at +20:
//                               2 first cell in a row, 4 row-end marker, 8 last row]
//   objects × 72 bytes         [int32 char position, 0, 0, int32 width, int32 height (twips),
//                               ..., int32 kind at +36 (1 equation, 0 picture), ...]
//   objects × payload          [int32 length, bytes]; equation: 11 int32 + token stream
//                               (equations.ts); picture: int32 1, int32 width+1, int32
//                               height+1 (twips), then a Windows DIB (BITMAPINFOHEADER).
// Text control characters: 0x09 tab, 0x0d paragraph, 0x0f object, 0x10 table start,
// 0x11 end of table cell (a row ends with an extra, empty marker cell).

import { parseEquation, type EquationNode } from './equations.ts';
import { readNativeGraphObject, type NativeGraphObject } from './graphs.ts';

export type RecordQuestionType =
  | 'true-false'
  | 'multiple-choice'
  | 'bimodal'
  | 'multiple-response'
  | 'yes-no'
  | 'completion'
  | 'matching'
  | 'short-answer'
  | 'problem'
  | 'unknown';

// Type codes verified against printed banks: 0/2/5/9/10 in Pre-Calculus 12 (Mickelson)
// (question text and answers), 2/4/7/8/9/10 in McGraw-Hill Pre-Calculus 12 (PDF sections).
// 4 is bimodal: native UI identifies it as "Short Answer (Bimodal)" and can toggle
// its stored choices into "Multiple Choice (Bimodal)" without replacing the question.
// 3 (multiple response: "circle all answers that apply", answer is a bitmask of choices) and
// 8 (matching item, answer index at +0x24) from Pre-Calculus 11 (Mickelson).
const TYPE_CODES: Record<number, RecordQuestionType> = {
  0: 'true-false',
  2: 'multiple-choice',
  3: 'multiple-response',
  4: 'bimodal',
  5: 'yes-no',
  7: 'completion',
  8: 'matching',
  9: 'short-answer',
  10: 'problem',
};

export interface CharStyle {
  size: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  face: string;
  /** Native LOGFONT weight and packed pitch/family/charset, retained for font fidelity. */
  weight?: number;
  fontFlags?: number;
}

export interface TextRun {
  start: number;
  end: number;
  style: CharStyle;
}

export interface TableCell {
  /** Text range of the cell content (the terminating 0x11 is at `end`). */
  start: number;
  end: number;
}

export interface RichTable {
  /** Position of the 0x10 table marker. */
  start: number;
  /** Position just after the last row-end marker. */
  end: number;
  rows: TableCell[][];
}

export interface RichObjectSource {
  subtype: number;
  /** The exact serialized object header and body; no semantic fields are inferred here. */
  header: Uint8Array;
  bytes: Uint8Array;
  range: [number, number];
}

export type RichObject = (
  | { kind: 'equation'; position: number; widthTwips: number; heightTwips: number; nodes: EquationNode[]; errors: string[]; /** Token stream bytes in the payload, for diagnostics. */ range: [number, number]; footer?: { name: string; text: string; bytes: Uint8Array; secondaryBytes: Uint8Array } }
  | { kind: 'picture'; position: number; widthTwips: number; heightTwips: number; dib: Uint8Array }
  | { kind: 'graph'; position: number; widthTwips: number; heightTwips: number; graph: NativeGraphObject; errors: string[] }
  | { kind: 'variable'; position: number; widthTwips: number; heightTwips: number; name: string; rawFlags: number; range: [number, number] }
  | { kind: 'unknown'; position: number; widthTwips: number; heightTwips: number; code: number }
) & { source?: RichObjectSource };

export interface RichTextBlock {
  offset: number;
  byteLength: number;
  text: string;
  runs: TextRun[];
  tables: RichTable[];
  objects: RichObject[];
  errors: string[];
}

export interface QuestionRecord {
  offset: number;
  end: number;
  narrativeId: number;
  hasQuestion: boolean;
  hasSolution: boolean;
  blockRoles: Array<'question' | 'solution'>;
  /** Native +0x1c identifies a matching group for type 8. */
  groupId?: number;
  /** ExamView's question number (not necessarily contiguous). */
  number: number;
  typeCode: number;
  type: RecordQuestionType;
  /** Raw answer field at +0x1c. */
  answerCode: number;
  /** Choice count at +0x24 (multiple choice); for a matching item, the 0-based index of its match. */
  choiceCount: number;
  metadata: string[];
  prefix: { metadata: [number, number]; algorithm: [number, number]; richTextOffset: number };
  algorithmBytes: Uint8Array;
  blocks: RichTextBlock[];
}

/**
 * A matching group: the shared prompt and choices of the matching items (type 8) in the same
 * file. 40-byte fixed header, length-prefixed algorithm block, then optional text block.
 * With an empty four-byte algorithm block the text starts at +44.
 */
export interface MatchingGroup {
  offset: number;
  end: number;
  algorithmBytes: Uint8Array;
  number: number;
  choiceCount: number;
  blocks: RichTextBlock[];
}

export interface NarrativeRecord {
  offset: number;
  end: number;
  number: number;
  name: string;
  description: string;
  algorithmBytes: Uint8Array;
  blocks: RichTextBlock[];
}

export interface RecordBank {
  bankId: number;
  /** Bank title and section title from the file header (fixed UTF-16 fields at 0x4 and 0x16c). */
  title: string;
  sectionTitle: string;
  records: QuestionRecord[];
  groups: MatchingGroup[];
  narratives: NarrativeRecord[];
  trailingBytes: Uint8Array;
  trailingRange: [number, number];
  diagnostics: Array<{ code: string; message: string }>;
}

const BLOCK_HEADER = 60;
const BANK_HEADER = 0xffc;
const GROUP_HEADER = 0x28;
const NARRATIVE_HEADER = 0x24c;
const METADATA_BLOCK = 0x214;
const UTF16 = new TextDecoder('utf-16le', { fatal: false });

/**
 * Read declared v06 question, narrative, and matching records sequentially. Malformed
 * declared data fails; bytes after those records are preserved as an opaque trailer.
 */
/** Why the last readQuestionRecords call returned undefined (the failed layout check). */
export let lastRecordFailure = '';
function fail(reason: string): undefined {
  if (!lastRecordFailure) lastRecordFailure = reason;
  return undefined;
}

export function readQuestionRecords(payload: Uint8Array): RecordBank | undefined {
  lastRecordFailure = '';
  if (payload.byteLength < BANK_HEADER) return fail('bank header truncated');
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const bankId = view.getInt32(0, true);
  if (bankId === 0 || bankId === -1) return fail('bankId === 0 || bankId === -1');
  // FUN_0047edc0 writes counts at header +f58/f5c/f60, then typed records in this order.
  const counts = [0xf58, 0xf5c, 0xf60].map(at => view.getInt32(at, true));
  if (counts.some(count => count < 0 || count > 100000)) return fail('invalid bank record counts');
  const records: QuestionRecord[] = [], narratives: NarrativeRecord[] = [], groups: MatchingGroup[] = [];
  let cursor = BANK_HEADER;
  const readText = (): RichTextBlock | undefined => {
    if (cursor + BLOCK_HEADER > payload.length) return fail('rich-text header truncated');
    const length = view.getInt32(cursor, true);
    if (length < BLOCK_HEADER || cursor + length > payload.length) return fail('invalid rich-text length');
    const block = readBlock(payload, view, cursor, length);
    if (block) cursor += length;
    return block;
  };
  const readAlgorithm = (): Uint8Array | undefined => {
    if (cursor + 4 > payload.length) return fail('algorithm length truncated');
    const length = view.getInt32(cursor, true);
    if (length < 4 || cursor + length > payload.length) return fail('invalid algorithm length');
    const bytes = payload.slice(cursor + 4, cursor + length); cursor += length; return bytes;
  };
  const fixedHeader = (size: number): boolean => {
    if (cursor + size > payload.length) { fail('typed record header truncated'); return false; }
    if (view.getInt32(cursor + 4, true) !== bankId) { fail('typed record bank id mismatch'); return false; }
    return true;
  };
  const presence = (at: number): number | undefined => {
    const value = view.getInt32(at, true);
    if (value !== 0 && value !== 1) return fail('invalid rich-text presence flag'); return value;
  };
  for (let n = 0; n < counts[0]; n++) {
    const offset = cursor; if (!fixedHeader(METADATA_BLOCK)) return undefined;
    const first = presence(offset + 20), second = presence(offset + 24);
    if (first === undefined || second === undefined) return undefined;
    const prefix = readRecordPrefix(payload, view, offset, payload.length); if (!prefix) return undefined;
    cursor = prefix.prefix.richTextOffset;
    const blocks: RichTextBlock[] = [], blockRoles: Array<'question' | 'solution'> = [];
    for (const [index, flag] of [first, second].entries()) if (flag) {
      const block = readText(); if (!block) return undefined; blocks.push(block); blockRoles.push(index === 0 ? 'question' : 'solution');
    }
    const typeCode = view.getInt32(offset + 8, true);
    records.push({ offset, end: cursor, narrativeId: view.getInt32(offset + 12, true), hasQuestion: !!first, hasSolution: !!second,
      blockRoles, groupId: typeCode === 8 ? view.getInt32(offset + 0x1c, true) : undefined, number: view.getInt32(offset, true), typeCode,
      type: TYPE_CODES[typeCode] ?? 'unknown', answerCode: view.getInt32(offset + 0x1c, true), choiceCount: view.getInt32(offset + 0x24, true), ...prefix, blocks });
  }
  for (let n = 0; n < counts[1]; n++) {
    const offset = cursor; if (!fixedHeader(NARRATIVE_HEADER)) return undefined;
    const flag = presence(offset + 0x238); if (flag === undefined) return undefined;
    cursor += NARRATIVE_HEADER; const algorithmBytes = readAlgorithm(); if (!algorithmBytes) return undefined;
    const blocks: RichTextBlock[] = [];
    if (flag) { const block = readText(); if (!block) return undefined; blocks.push(block); }
    narratives.push({ offset, end: cursor, number: view.getInt32(offset, true), name: readFixedString(payload, offset + 8, 26), description: readFixedString(payload, offset + 60, 252), algorithmBytes, blocks });
  }
  for (let n = 0; n < counts[2]; n++) {
    const offset = cursor; if (!fixedHeader(GROUP_HEADER)) return undefined;
    const flag = presence(offset + 16); if (flag === undefined) return undefined;
    cursor += GROUP_HEADER; const algorithmBytes = readAlgorithm(); if (!algorithmBytes) return undefined;
    const blocks: RichTextBlock[] = [];
    if (flag) { const block = readText(); if (!block) return undefined; blocks.push(block); }
    groups.push({ offset, end: cursor, number: view.getInt32(offset, true), choiceCount: view.getInt32(offset + 8, true), algorithmBytes, blocks });
  }
  // FUN_0047f680 returns after declared records; cleanup FUN_00485c20 does not read more.
  const trailingBytes = payload.slice(cursor);
  const diagnostics = trailingBytes.length ? [{ code: 'OPAQUE_BANK_TRAILER', message: `${trailingBytes.length} bytes after declared records preserved without decoding` }] : [];
  return { bankId, title: readFixedString(payload, 4, 180), sectionTitle: readFixedString(payload, 0x16c, 128), records, groups, narratives,
    trailingBytes, trailingRange: [cursor, payload.length], diagnostics };
}

function readRecordPrefix(payload: Uint8Array, view: DataView, offset: number, end: number):
  Pick<QuestionRecord, 'metadata' | 'prefix' | 'algorithmBytes'> | undefined {
  const metadataAt = offset + METADATA_BLOCK;
  if (metadataAt + 4 > end) return fail('metadata length truncated');
  const metadataLength = view.getInt32(metadataAt, true);
  if (metadataLength < 4 || metadataLength % 2 || metadataAt + metadataLength > end) return fail('invalid metadata length');
  const algorithmAt = metadataAt + metadataLength;
  const metadataText = UTF16.decode(payload.subarray(metadataAt + 4, algorithmAt));
  if (metadataText && !metadataText.endsWith('\u0000')) return fail('metadata string not terminated');
  const metadata = metadataText ? metadataText.slice(0, -1).split('\u0000') : [];
  if (algorithmAt + 4 > end) return fail('algorithm length truncated');
  const algorithmLength = view.getInt32(algorithmAt, true);
  if (algorithmLength < 4 || algorithmAt + algorithmLength > end) return fail('invalid algorithm length');
  const richTextOffset = algorithmAt + algorithmLength;
  return { metadata, prefix: { metadata: [metadataAt, algorithmAt], algorithm: [algorithmAt, richTextOffset], richTextOffset }, algorithmBytes: payload.slice(algorithmAt + 4, richTextOffset) };
}

function readBlock(payload: Uint8Array, view: DataView, at: number, byteLength: number): RichTextBlock | undefined {
  const header = Array.from({ length: 15 }, (_, index) => view.getInt32(at + index * 4, true));
  const [, one, charCount, paragraphRuns, paragraphStyles, charRuns, charStyles, faceCount, , , tableCount, cellCount, objectCount] = header;
  const counts = [charCount, paragraphRuns, paragraphStyles, charRuns, charStyles, faceCount, tableCount, cellCount, objectCount];
  if (one !== 1 || counts.some((count) => count < 0 || count > 100_000)) return fail('one !== 1 || counts.some((count) => count < 0 || count > 100_000)');
  const end = at + byteLength;
  const errors: string[] = [];

  const fixedBytes = BLOCK_HEADER + charCount * 2 + 2 + paragraphRuns * 12 + paragraphStyles * 168
    + charRuns * 12 + charStyles * 24 + faceCount * 66 + tableCount * 20 + cellCount * 52 + objectCount * 72;
  if (fixedBytes > byteLength) return fail('rich-text fixed spans exceed block');

  let cursor = at + BLOCK_HEADER;
  const text = UTF16.decode(payload.subarray(cursor, cursor + charCount * 2));
  cursor += charCount * 2 + 2 + paragraphRuns * 12 + paragraphStyles * 168;

  const runStarts = Array.from({ length: charRuns }, (_, index) => ({
    start: view.getInt32(cursor + index * 12, true),
    style: view.getInt32(cursor + index * 12 + 4, true),
  }));
  cursor += charRuns * 12;
  const styleRecords = Array.from({ length: charStyles }, (_, index) => ({
    size: view.getInt32(cursor + index * 24, true),
    flags: view.getInt32(cursor + index * 24 + 4, true),
    face: view.getInt32(cursor + index * 24 + 8, true),
    weight: view.getInt32(cursor + index * 24 + 12, true),
    fontFlags: view.getInt32(cursor + index * 24 + 16, true),
  }));
  cursor += charStyles * 24;
  const faces = Array.from({ length: faceCount }, (_, index) => readFixedString(payload, cursor + index * 66, 32));
  cursor += faceCount * 66;
  if (cursor > end) return fail('cursor > end');

  const runs: TextRun[] = [];
  runStarts.forEach((run, index) => {
    const style = styleRecords[run.style];
    const runEnd = runStarts[index + 1]?.start ?? charCount;
    if (!style || run.start < 0 || runEnd < run.start || runEnd > charCount) {
      errors.push('character run does not fit the text');
      return;
    }
    runs.push({
      start: run.start,
      end: runEnd,
      style: {
        size: style.size,
        bold: (style.flags & 1) !== 0,
        italic: (style.flags & 4) !== 0,
        underline: (style.flags & 2) !== 0,
        face: faces[style.face] ?? '',
        weight: style.weight,
        fontFlags: style.fontFlags,
      },
    });
  });

  const tableStart = cursor;
  cursor += tableCount * 20;
  const cells = Array.from({ length: cellCount }, (_, index) => ({
    start: view.getInt32(cursor + index * 52, true),
    flags: view.getInt16(cursor + index * 52 + 20, true),
  }));
  cursor += cellCount * 52;
  const tables = readTables(text, view, tableStart, tableCount, cells, errors);

  const objectHeaders = cursor;
  cursor += objectCount * 72;
  const objects: RichObject[] = [];
  for (let index = 0; index < objectCount; index += 1) {
    const headerAt = objectHeaders + index * 72;
    if (cursor + 4 > end) return fail('cursor + 4 > end');
    const length = view.getInt32(cursor, true);
    if (length < 0 || cursor + 4 + length > end) return fail('length < 0 || cursor + 4 + length > end');
    const position = view.getInt32(headerAt, true);
    const widthTwips = view.getInt32(headerAt + 12, true);
    const heightTwips = view.getInt32(headerAt + 16, true);
    const kind = view.getInt32(headerAt + 36, true);
    const subtype = view.getInt32(headerAt + 40, true);
    const body = cursor + 4;
    if (kind === 1 && subtype === 6) {
      let nameEnd = body;
      const nameLimit = body + 84;
      while (nameEnd + 2 <= nameLimit && nameEnd + 2 <= body + length && view.getUint16(nameEnd, true) !== 0) nameEnd += 2;
      const name = UTF16.decode(payload.subarray(body, nameEnd));
      if (length !== 88 || nameEnd + 2 > nameLimit || !/^[A-Za-z][A-Za-z0-9_]*$/.test(name)
        || payload.subarray(nameEnd, nameLimit).some(byte => byte !== 0)) {
        errors.push('invalid embedded variable name or padding');
        objects.push({ kind: 'unknown', position, widthTwips, heightTwips, code: kind });
      } else objects.push({ kind: 'variable', position, widthTwips, heightTwips, name, rawFlags: view.getUint32(body + 84, true), range: [body, body + length] });
    } else if (kind === 1 && length >= 44) {
      const declaredTokenEnd = body + view.getInt32(body, true) + 4;
      let tokenEnd = body + length;
      let footer: Extract<RichObject, { kind: 'equation' }>['footer'];
      const footerErrors: string[] = [];
      // Native subtype8 writer FUN_004be0d0 appends UTF-16 and font data after token bytes.
      if (subtype === 8 && declaredTokenEnd >= body + 44 && declaredTokenEnd + 50 <= body + length) {
        tokenEnd = declaredTokenEnd;
        const textLength = view.getInt32(tokenEnd + 42, true);
        const secondaryAt = tokenEnd + 46 + textLength;
        if (textLength < 0 || textLength % 2 || secondaryAt + 4 > body + length) footerErrors.push('invalid equation footer text length');
        else {
          const secondaryLength = view.getInt32(secondaryAt, true);
          if (secondaryLength < 0 || secondaryAt + 4 + secondaryLength !== body + length
            || (secondaryLength !== 0 && (secondaryLength < 244 || secondaryLength % 2))) footerErrors.push('invalid equation secondary footer length');
          else {
            const name = UTF16.decode(payload.subarray(tokenEnd, tokenEnd + 42));
            if (!name.includes('\u0000')) footerErrors.push('equation footer name not terminated');
            const secondaryBody = secondaryAt + 4;
            if (secondaryLength) {
              const namesAt = secondaryBody + 244, namesLength = secondaryLength - 244;
              for (let n = 0; n < 9; n++) {
                const nameOffset = view.getInt32(secondaryBody + 96 + n * 16, true);
                if (nameOffset < 0 || nameOffset % 2 || nameOffset >= namesLength) { footerErrors.push('equation footer font offset out of bounds'); break; }
                const fontName = UTF16.decode(payload.subarray(namesAt + nameOffset, secondaryBody + secondaryLength));
                if (!fontName.includes('\u0000')) { footerErrors.push('equation footer font name not terminated'); break; }
              }
            }
            footer = { name: name.split('\u0000')[0], text: UTF16.decode(payload.subarray(tokenEnd + 46, secondaryAt)), bytes: payload.slice(tokenEnd, body + length), secondaryBytes: payload.slice(secondaryBody, body + length) };
          }
        }
      }
      const parsed = parseEquation(payload, body + 44, tokenEnd);
      objects.push({ kind: 'equation', position, widthTwips, heightTwips, nodes: parsed.nodes, errors: [...parsed.errors, ...footerErrors], range: [body + 44, tokenEnd], footer });
    } else if (kind === 0 && subtype === 9) {
      try {
        const graph = readNativeGraphObject(payload.subarray(body, body + length));
        objects.push({ kind: 'graph', position, widthTwips, heightTwips, graph, errors: [] });
      } catch (error) {
        errors.push(`invalid graph object: ${error instanceof Error ? error.message : String(error)}`);
        objects.push({ kind: 'unknown', position, widthTwips, heightTwips, code: kind });
      }
    } else if (kind === 0 && length > 12 + 40 && view.getInt32(body, true) === 1 && view.getInt32(body + 12, true) === 40) {
      objects.push({ kind: 'picture', position, widthTwips, heightTwips, dib: payload.slice(body + 12, body + length) });
    } else {
      objects.push({ kind: 'unknown', position, widthTwips, heightTwips, code: kind });
    }
    const object = objects[objects.length - 1];
    object.source = { subtype, header: payload.slice(headerAt, headerAt + 72), bytes: payload.slice(body, body + length), range: [body, body + length] };
    cursor = body + length;
  }
  if (cursor !== end) return fail('cursor !== end');
  return { offset: at, byteLength, text, runs, tables, objects, errors };
}

// Cells are listed in text order and belong to the table whose marker precedes them; a cell
// flagged 4 is the empty marker that ends a row.
function readTables(
  text: string,
  view: DataView,
  tableStart: number,
  tableCount: number,
  cells: Array<{ start: number; flags: number }>,
  errors: string[],
): RichTable[] {
  const starts = Array.from({ length: tableCount }, (_, index) => view.getInt32(tableStart + index * 20, true));
  let assigned = 0;
  const tables = starts.map((start, index) => {
    const limit = starts[index + 1] ?? Number.POSITIVE_INFINITY;
    if (text[start] !== '\u0010') errors.push(`table ${index + 1} does not start at a table marker`);
    const rows: TableCell[][] = [];
    let row: TableCell[] = [];
    let end = start + 1;
    for (const cell of cells) {
      if (cell.start <= start || cell.start >= limit) continue;
      assigned += 1;
      const close = text.indexOf('\u0011', cell.start);
      if (close < 0) {
        errors.push('table cell has no end marker');
        continue;
      }
      end = Math.max(end, close + 1);
      if (cell.flags & 4) {
        rows.push(row);
        row = [];
      } else {
        row.push({ start: cell.start, end: close });
      }
    }
    if (row.length) errors.push('table row has no row-end marker');
    return { start, end, rows };
  });
  if (assigned !== cells.length) errors.push('table cells outside any table');
  return tables;
}

function readFixedString(payload: Uint8Array, at: number, maxChars: number): string {
  const decoded = UTF16.decode(payload.subarray(at, Math.min(payload.byteLength, at + maxChars * 2)));
  const end = decoded.indexOf('\u0000');
  return (end >= 0 ? decoded.slice(0, end) : decoded).trim();
}
