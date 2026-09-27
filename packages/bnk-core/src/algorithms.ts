// Structural reader for ExamView v06 algorithm blocks.
//
// Layout (inflated payload, little-endian, any byte alignment):
//   int32 byteLength            counts itself; the block ends at start + byteLength
//   entry*                      until the block end
// entry:
//   int32 nameLength, ruleLength, displayLength   (UTF-16 code units)
//   int32 kind                  0 = variable, 3 = condition
//   int32 valueType             1 = number, 2 = string (0 for conditions)
//   int32 format                0 plain, 1 fixed decimals, 4 always signed, 5/6 other number styles
//   int32 decimals
//   int32 flags
//   float64 value               numeric sample (0 for strings and conditions)
//   UTF-16 name, rule, display  each followed by one 16-bit terminator slot
//
// The metadata strings (difficulty, objective, reference, topic, key) sit
// immediately before the block. Inside the question that follows, variables
// are referenced three ways:
//   text slot       UTF-16 "X" string followed by the variable name
//   equation slot   byte 0x0a + ASCII name + 0x00 inside compact equation objects
//   graph object    UTF-16 expression strings such as "x1", "(x + h)^2 + k"

export type AlgorithmEntryKind = 'variable' | 'condition' | 'control';

export interface AlgorithmEntry {
  kind: AlgorithmEntryKind;
  name: string;
  rule: string;
  /** Display text exactly as ExamView stored it (may contain font escapes). */
  rawDisplay: string;
  /** Display text with ExamView font escapes mapped to plain characters; undefined if unmappable. */
  display: string | undefined;
  value: number;
  valueType: 'number' | 'string' | 'none';
  format: number;
  decimals: number;
  flags: number;
}

export interface AlgorithmReferences {
  text: Record<string, number>;
  equation: Record<string, number>;
  /** Variables used by graph objects (coordinates, function expressions). */
  graph: string[];
}

export interface AlgorithmBlock {
  offset: number;
  byteLength: number;
  metadata: {
    difficulty: string;
    objective: string;
    reference: string;
    topic: string;
    key: string;
  };
  entries: AlgorithmEntry[];
  /** Byte range of the question record the block belongs to. */
  recordEnd: number;
  references: AlgorithmReferences;
  /** Readable prose from the question record (for matching against other sources). */
  displayText: string;
}

const MIN_BLOCK_LENGTH = 44;
const MAX_BLOCK_LENGTH = 200_000;
const MAX_STRING_LENGTH = 4000;
const UTF16 = new TextDecoder('utf-16le', { fatal: false });
const IDENTIFIER = /^[A-Za-z][A-Za-z0-9_]*$/;
const PRINTABLE_RULE = /^[\x20-\x7e–−]+$/;
const DIFFICULTY = /^(easy|average|medium|moderate|difficult|hard)$/i;

// ExamView switches to the Symbol font with \x01 + U+F08x and then uses
// U+F0xx private-use code points for Symbol glyphs.
const SYMBOL_FONT: Record<number, string> = {
  0x20: ' ', 0x2d: '-', 0x2b: '+', 0x3d: '=', 0x28: '(', 0x29: ')', 0x2c: ',', 0x2e: '.',
  0x70: 'π', 0x71: 'θ', 0xb0: '°', 0xb1: '±', 0xb4: '×', 0xb8: '÷', 0xd6: '√', 0xa3: '≤', 0xb3: '≥',
};

export function readAlgorithmBlocks(payload: Uint8Array): AlgorithmBlock[] {
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const blocks: AlgorithmBlock[] = [];
  let position = 0;
  while (position < payload.byteLength - 4) {
    const entries = parseBlock(payload, view, position);
    if (!entries) {
      position += 1;
      continue;
    }
    const byteLength = view.getInt32(position, true);
    const metadata = readMetadataBefore(payload, view, position);
    if (metadata) {
      blocks.push({
        offset: position,
        byteLength,
        metadata,
        entries,
        recordEnd: payload.byteLength,
        references: { text: {}, equation: {}, graph: [] },
        displayText: '',
      });
    }
    position += byteLength;
  }

  blocks.forEach((block, index) => {
    const nextBlock = blocks[index + 1]?.offset ?? payload.byteLength;
    block.recordEnd = findNextRecordStart(payload, block.offset + block.byteLength, nextBlock);
    block.references = readReferences(payload, block);
    block.displayText = readProse(payload, block.offset + block.byteLength, block.recordEnd);
  });
  return blocks;
}

function parseBlock(payload: Uint8Array, view: DataView, start: number): AlgorithmEntry[] | undefined {
  const byteLength = view.getInt32(start, true);
  if (byteLength < MIN_BLOCK_LENGTH || byteLength > MAX_BLOCK_LENGTH || start + byteLength > payload.byteLength) return undefined;
  const end = start + byteLength;
  const entries: AlgorithmEntry[] = [];
  let cursor = start + 4;
  while (cursor < end) {
    if (cursor + 40 > end) return undefined;
    const header = Array.from({ length: 8 }, (_, index) => view.getInt32(cursor + index * 4, true));
    const [nameLength, ruleLength, displayLength, kind, valueType, format, decimals, flags] = header;
    if ([nameLength, ruleLength, displayLength].some((length) => length < 0 || length > MAX_STRING_LENGTH)) return undefined;
    if (!ruleLength) return undefined;
    const value = view.getFloat64(cursor + 32, true);
    let offset = cursor + 40;
    const name = readUtf16(payload, offset, nameLength);
    offset += 2 * (nameLength + 1);
    const rule = readUtf16(payload, offset, ruleLength);
    offset += 2 * (ruleLength + 1);
    const rawDisplay = readUtf16(payload, offset, displayLength);
    offset += 2 * (displayLength + 1);
    if (offset > end) return undefined;
    if (name && !IDENTIFIER.test(name)) return undefined;
    if (!PRINTABLE_RULE.test(rule)) return undefined;
    entries.push({
      kind: !name ? 'condition' : name.toLowerCase() === 'scramble' ? 'control' : 'variable',
      name,
      rule,
      rawDisplay,
      display: cleanDisplay(rawDisplay),
      value,
      valueType: kind === 3 || !name ? 'none' : valueType === 2 ? 'string' : 'number',
      format,
      decimals,
      flags,
    });
    cursor = offset;
  }
  return cursor === end && entries.length ? entries : undefined;
}

function readUtf16(payload: Uint8Array, offset: number, length: number): string {
  return UTF16.decode(payload.subarray(offset, offset + length * 2));
}

/** Map ExamView display text to plain characters; undefined when it uses glyphs we can't map. */
export function cleanDisplay(raw: string): string | undefined {
  let unmapped = false;
  const text = raw
    .replace(/\u0001[-]/g, '')
    .replace(/[-]/g, (char) => {
      const mapped = SYMBOL_FONT[char.charCodeAt(0) - 0xf000];
      if (mapped === undefined) unmapped = true;
      return mapped ?? '';
    })
    .replace(/[–−]/g, '-');
  return unmapped || /[\u0000-\u001f]/.test(text) ? undefined : text;
}

// Five metadata strings end exactly where the block starts.
function readMetadataBefore(payload: Uint8Array, view: DataView, start: number): AlgorithmBlock['metadata'] | undefined {
  const strings: string[] = [];
  let end = start - 2;
  for (let count = 0; count < 5; count += 1) {
    if (end < 0 || view.getUint16(end, true) !== 0) return undefined;
    let begin = end;
    while (begin >= 2) {
      const code = view.getUint16(begin - 2, true);
      if (code < 0x20 || code >= 0xfffe) break;
      begin -= 2;
    }
    strings.unshift(UTF16.decode(payload.subarray(begin, end)));
    end = begin - 2;
  }
  const [difficulty, objective, reference, topic, key] = strings;
  if (!DIFFICULTY.test(difficulty)) return undefined;
  return { difficulty, objective, reference, topic, key };
}

// A question record starts with its difficulty label; the next one bounds this record.
function findNextRecordStart(payload: Uint8Array, from: number, limit: number): number {
  const labels = ['Easy', 'Average', 'Moderate', 'Difficult', 'Medium', 'Hard']
    .map((label) => encodeUtf16(`\u0000${label}\u0000`));
  let best = limit;
  for (const label of labels) {
    const index = indexOfBytes(payload, label, from, best);
    if (index >= 0 && index < best) best = index;
  }
  return best;
}

function readReferences(payload: Uint8Array, block: AlgorithmBlock): AlgorithmReferences {
  const names = new Set(block.entries.filter((entry) => entry.kind === 'variable').map((entry) => entry.name));
  const start = block.offset + block.byteLength;
  const region = payload.subarray(start, block.recordEnd);
  const text: Record<string, number> = {};
  const equation: Record<string, number> = {};
  const graph = new Set<string>();
  const consumed = new Set<number>();

  // Text slots: UTF-16 "X\0" then the name.
  const textSlot = /X\u0000\u0000\u0000((?:[A-Za-z0-9_]\u0000){1,40})\u0000\u0000/g;
  const latin1 = latin1String(region);
  for (const match of latin1.matchAll(textSlot)) {
    const name = match[1].replace(/\u0000/g, '');
    if (!names.has(name)) continue;
    text[name] = (text[name] ?? 0) + 1;
    consumed.add(match.index! + 4);
  }

  // Equation slots: byte 0x0a + UTF-16 name + UTF-16 terminator.
  for (const match of latin1.matchAll(/\n((?:[A-Za-z0-9_]\u0000){1,40})\u0000\u0000/g)) {
    const name = match[1].replace(/\u0000/g, '');
    if (!names.has(name)) continue;
    equation[name] = (equation[name] ?? 0) + 1;
    consumed.add(match.index! + 1);
  }

  // Graph objects: short UTF-16 expression strings made only of known names, functions and numbers.
  for (const match of latin1.matchAll(/(?:[\x20-\x7e]\u0000){1,120}(?=\u0000\u0000)/g)) {
    if (consumed.has(match.index!)) continue;
    const expression = match[0].replace(/\u0000/g, '');
    if (!/^[\w\s.+\-*/^(),<>=]+$/.test(expression)) continue;
    const tokens = expression.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
    if (!tokens.length || !tokens.every((token) => names.has(token) || /^(x|y|pi|sin|cos|tan|sqrt|abs|log|ln)$/i.test(token))) continue;
    for (const token of tokens) if (names.has(token)) graph.add(token);
  }
  return { text, equation, graph: [...graph] };
}

function readProse(payload: Uint8Array, start: number, end: number): string {
  const latin1 = latin1String(payload.subarray(start, end));
  return [...latin1.matchAll(/(?:[\x20-\x7e]\u0000){4,}/g)]
    .map((match) => match[0].replace(/\u0000/g, ''))
    .filter((text) => /[A-Za-z]{3,}\s/.test(text))
    .join(' ');
}

function latin1String(bytes: Uint8Array): string {
  let output = '';
  for (let index = 0; index < bytes.length; index += 8192) {
    output += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return output;
}

function encodeUtf16(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length * 2);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index * 2] = value.charCodeAt(index) & 0xff;
    bytes[index * 2 + 1] = value.charCodeAt(index) >> 8;
  }
  return bytes;
}

function indexOfBytes(haystack: Uint8Array, needle: Uint8Array, from: number, limit: number): number {
  const last = Math.min(limit, haystack.length) - needle.length;
  outer: for (let index = from; index <= last; index += 1) {
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (haystack[index + offset] !== needle[offset]) continue outer;
    }
    return index;
  }
  return -1;
}
