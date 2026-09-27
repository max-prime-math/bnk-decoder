// Structural reader for ExamView v06 question records.
//
// Layout (inflated payload, little-endian). The first int32 of the payload is the bank id.
//
// Question record (starts anywhere; found by its header signature):
//   +0x00 int32 question number     +0x04 int32 bank id     +0x08 int32 type code
//   +0x0c int32 -1                  +0x10 int32 bank id     +0x14 int32 1
//   +0x18 int32 (1 for written-response types)
//   +0x1c int32 answer: choice index for multiple choice (0 = a), 0/1 = True/False, Yes/No
//   +0x24 int32 choice count (multiple choice)
//   +0x21c first rich-text block, when the record carries no metadata strings (teacher-made
//          banks such as Pre-Calculus 12 (Mickelson)); publisher banks store variable-length
//          metadata and algorithm blocks here instead, which this reader does not handle.
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
//   charStyles × 24 bytes      [int32 size, int32 flags (1 bold, 2 italic, 4 underline),
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

export type RecordQuestionType =
  | 'true-false'
  | 'multiple-choice'
  | 'multiple-response'
  | 'yes-no'
  | 'completion'
  | 'matching'
  | 'short-answer'
  | 'problem'
  | 'unknown';

// Type codes verified against printed banks: 0/2/5/9/10 in Pre-Calculus 12 (Mickelson)
// (question text and answers), 2/4/7/8/9/10 in McGraw-Hill Pre-Calculus 12 (PDF sections).
// 3 (multiple response: "circle all answers that apply", answer is a bitmask of choices) and
// 8 (matching item, answer index at +0x24) from Pre-Calculus 11 (Mickelson).
const TYPE_CODES: Record<number, RecordQuestionType> = {
  0: 'true-false',
  2: 'multiple-choice',
  3: 'multiple-response',
  4: 'multiple-choice',
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

export type RichObject =
  | { kind: 'equation'; position: number; widthTwips: number; heightTwips: number; nodes: EquationNode[]; errors: string[]; /** Token stream bytes in the payload, for diagnostics. */ range: [number, number] }
  | { kind: 'picture'; position: number; widthTwips: number; heightTwips: number; dib: Uint8Array }
  | { kind: 'unknown'; position: number; widthTwips: number; heightTwips: number; code: number };

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
  /** ExamView's question number (not necessarily contiguous). */
  number: number;
  typeCode: number;
  type: RecordQuestionType;
  /** Raw answer field at +0x1c. */
  answerCode: number;
  /** Choice count at +0x24 (multiple choice); for a matching item, the 0-based index of its match. */
  choiceCount: number;
  blocks: RichTextBlock[];
}

/**
 * A matching group: the shared prompt and choices of the matching items (type 8) in the same
 * file. 44-byte header: int32 number, bankId, choiceCount, 1|2, 1, 1, 0, 0, 0, 0, 4; then one
 * text block with the prompt and an a./b./… choice table.
 */
export interface MatchingGroup {
  offset: number;
  number: number;
  choiceCount: number;
  blocks: RichTextBlock[];
}

export interface RecordBank {
  bankId: number;
  /** Bank title and section title from the file header (fixed UTF-16 fields at 0x4 and 0x16c). */
  title: string;
  sectionTitle: string;
  records: QuestionRecord[];
  groups: MatchingGroup[];
}

const BLOCK_HEADER = 60;
const GROUP_HEADER = 44;
const FIRST_BLOCK = 0x21c;
const UTF16 = new TextDecoder('utf-16le', { fatal: false });

/**
 * Read every question record of a metadata-free v06 bank. Returns undefined when the payload
 * doesn't follow this layout exactly (every record must split into blocks with no bytes left).
 */
/** Why the last readQuestionRecords call returned undefined (the failed layout check). */
export let lastRecordFailure = '';
function fail(reason: string): undefined {
  if (!lastRecordFailure) lastRecordFailure = reason;
  return undefined;
}

export function readQuestionRecords(payload: Uint8Array): RecordBank | undefined {
  lastRecordFailure = '';
  if (payload.byteLength < FIRST_BLOCK + BLOCK_HEADER) return fail('payload.byteLength < FIRST_BLOCK + BLOCK_HEADER');
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const bankId = view.getInt32(0, true);
  if (bankId === 0 || bankId === -1) return fail('bankId === 0 || bankId === -1');

  // Question records: number, bankId, type, -1, bankId (0 in some matching items), 1.
  // Group records: number, bankId, choiceCount, n, 1, 1, …, then a block 44 bytes in.
  const starts: Array<{ at: number; group: boolean }> = [];
  for (let at = 4; at + 24 <= payload.byteLength; at += 1) {
    if (view.getInt32(at + 4, true) !== bankId) continue;
    const linked = view.getInt32(at + 16, true);
    if ((linked === bankId || linked === 0) && view.getInt32(at + 12, true) === -1 && view.getInt32(at + 20, true) === 1) {
      starts.push({ at, group: false });
    } else if (
      linked === 1 && view.getInt32(at + 20, true) === 1 && at + GROUP_HEADER + 8 <= payload.byteLength
      && view.getInt32(at + GROUP_HEADER + 4, true) === 1 && view.getInt32(at + GROUP_HEADER, true) >= BLOCK_HEADER
    ) {
      starts.push({ at, group: true });
    }
  }
  if (!starts.some((start) => !start.group)) return fail('!offsets.length');

  const records: QuestionRecord[] = [];
  const groups: MatchingGroup[] = [];
  for (let index = 0; index < starts.length; index += 1) {
    const { at: offset, group } = starts[index];
    const end = starts[index + 1]?.at ?? payload.byteLength;
    const blocks = readBlocks(payload, view, offset + (group ? GROUP_HEADER : FIRST_BLOCK), end);
    if (!blocks) return fail('!blocks');
    if (group) {
      groups.push({ offset, number: view.getInt32(offset, true), choiceCount: view.getInt32(offset + 8, true), blocks });
      continue;
    }
    const typeCode = view.getInt32(offset + 8, true);
    records.push({
      offset,
      number: view.getInt32(offset, true),
      typeCode,
      type: TYPE_CODES[typeCode] ?? 'unknown',
      answerCode: view.getInt32(offset + 0x1c, true),
      choiceCount: view.getInt32(offset + 0x24, true),
      blocks,
    });
  }
  return { bankId, title: readFixedString(payload, 4, 180), sectionTitle: readFixedString(payload, 0x16c, 128), records, groups };
}

function readBlocks(payload: Uint8Array, view: DataView, start: number, end: number): RichTextBlock[] | undefined {
  const blocks: RichTextBlock[] = [];
  let at = start;
  while (at < end) {
    if (at + BLOCK_HEADER > end) return fail('at + BLOCK_HEADER > end');
    const byteLength = view.getInt32(at, true);
    if (byteLength < BLOCK_HEADER || at + byteLength > end) return fail('byteLength < BLOCK_HEADER || at + byteLength > end');
    const block = readBlock(payload, view, at, byteLength);
    if (!block) return fail('!block');
    blocks.push(block);
    at += byteLength;
  }
  return at === end && blocks.length ? blocks : undefined;
}

function readBlock(payload: Uint8Array, view: DataView, at: number, byteLength: number): RichTextBlock | undefined {
  const header = Array.from({ length: 15 }, (_, index) => view.getInt32(at + index * 4, true));
  const [, one, charCount, paragraphRuns, paragraphStyles, charRuns, charStyles, faceCount, , , tableCount, cellCount, objectCount] = header;
  const counts = [charCount, paragraphRuns, paragraphStyles, charRuns, charStyles, faceCount, tableCount, cellCount, objectCount];
  if (one !== 1 || counts.some((count) => count < 0 || count > 100_000)) return fail('one !== 1 || counts.some((count) => count < 0 || count > 100_000)');
  const end = at + byteLength;
  const errors: string[] = [];

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
        italic: (style.flags & 2) !== 0,
        underline: (style.flags & 4) !== 0,
        face: faces[style.face] ?? '',
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
    const body = cursor + 4;
    if (kind === 1 && length >= 44) {
      const parsed = parseEquation(payload, body + 44, body + length);
      objects.push({ kind: 'equation', position, widthTwips, heightTwips, nodes: parsed.nodes, errors: parsed.errors, range: [body + 44, body + length] });
    } else if (kind === 0 && length > 12 + 40 && view.getInt32(body, true) === 1 && view.getInt32(body + 12, true) === 40) {
      objects.push({ kind: 'picture', position, widthTwips, heightTwips, dib: payload.slice(body + 12, body + length) });
    } else {
      objects.push({ kind: 'unknown', position, widthTwips, heightTwips, code: kind });
    }
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
