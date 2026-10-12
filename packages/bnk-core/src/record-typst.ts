// Typst rendering for rich-text blocks read by records.ts, plus picture conversion.

import { zlibSync } from 'fflate';
import { equationToTypst, SYMBOL_FONT, type StoredVariables } from './equations.ts';
import type { RichObject, RichTable, RichTextBlock, TextRun } from './records.ts';

export interface RenderOptions {
  /** Typst for a picture object (usually an #image call). */
  picture: (object: Extract<RichObject, { kind: 'picture' }>) => string;
  /** Display samples recovered from this record's algorithm; no expression evaluation. */
  variables?: StoredVariables;
}

export interface RenderedContent {
  typst: string;
  errors: string[];
}

export interface ChoiceTable {
  /** End of the stem text (the choice table's marker). */
  stemEnd: number;
  choices: Array<{ label: string; start: number; end: number }>;
}

// Publisher tables use bare A/B/C/D; teacher-made tables usually use a./b./c./d.
// Only accept these in alternating label/content cells of the final table.
const CHOICE_LABEL = /^\s*([a-z])\s*[.)]?\s*$/i;
const MAX_PICTURE_WIDTH_IN = 6;

/** Render text positions [start, end) of a block as Typst markup. */
export function renderRange(block: RichTextBlock, start: number, end: number, options: RenderOptions): RenderedContent {
  const errors: string[] = [];
  const typst = renderSpan(block, start, end, options, errors);
  return { typst: tidy(typst), errors };
}

export function renderBlock(block: RichTextBlock, options: RenderOptions): RenderedContent {
  return renderRange(block, 0, block.text.length, options);
}

/**
 * Teacher-made multiple-choice questions type their choices into a borderless table at the
 * end of the question: rows of "a." | choice | "c." | choice. Returns the choices by label.
 */
export function findChoiceTable(block: RichTextBlock): ChoiceTable | undefined {
  const table = block.tables[block.tables.length - 1];
  if (!table) return undefined;
  if (block.text.slice(table.end).replace(/[\s\r\t]/g, '')) return undefined;
  const choices: ChoiceTable['choices'] = [];
  for (const row of table.rows) {
    if (row.length % 2) return undefined;
    for (let index = 0; index < row.length; index += 2) {
      const label = block.text.slice(row[index].start, row[index].end).match(CHOICE_LABEL)?.[1]?.toLowerCase();
      if (!label) return undefined;
      choices.push({ label, start: row[index + 1].start, end: row[index + 1].end });
    }
  }
  const labels = choices.map((choice) => choice.label);
  if (new Set(labels).size !== labels.length) return undefined;
  choices.sort((a, b) => a.label.localeCompare(b.label));
  return { stemEnd: table.start, choices };
}

function renderSpan(block: RichTextBlock, start: number, end: number, options: RenderOptions, errors: string[]): string {
  const out: string[] = [];
  let segment = '';
  let segmentRun: TextRun | undefined;

  const flush = () => {
    if (segment) out.push(formatRun(segment, segmentRun));
    segment = '';
    segmentRun = undefined;
  };

  let position = start;
  while (position < end) {
    const char = block.text[position];
    if (position === start || block.text[position - 1] === '\r') {
      const lineEnd = lineEndAt(block.text, position, end);
      if (isTabLayoutLine(block.text, position, lineEnd)) {
        flush();
        out.push(renderTabLine(block, position, lineEnd, options, errors));
        position = lineEnd;
        continue;
      }
    }
    if (char === '\u0010') {
      flush();
      const table = block.tables.find((item) => item.start === position);
      if (!table) {
        errors.push('table marker without a table');
        position += 1;
        continue;
      }
      out.push(`\n${renderTable(block, table, options, errors)}\n`);
      position = table.end;
      continue;
    }
    if (char === '\u000f') {
      flush();
      const objects = block.objects.filter((object) => object.position === position);
      if (objects.length !== 1) errors.push(`object marker at ${position} has ${objects.length} objects`);
      if (objects[0]) {
        // ExamView sets objects in their own box, so a word typed right against one still
        // prints with a gap ("√x has", not "√xhas").
        const before = /\p{L}/u.test(block.text[position - 1] ?? '') ? ' ' : '';
        const after = /\p{L}/u.test(block.text[position + 1] ?? '') ? ' ' : '';
        out.push(`${before}${renderObject(objects[0], options, errors)}${after}`);
      }
      position += 1;
      continue;
    }
    if (char === '\r') {
      flush();
      out.push('\r');
      position += 1;
      continue;
    }
    if (char === '\t') {
      // Tabs that only indent a table or a displayed equation carry no layout.
      flush();
      out.push(' ');
      position += 1;
      continue;
    }
    if (char === '\u0011') {
      errors.push('table cell marker outside a table');
      position += 1;
      continue;
    }
    if (/[\u0000-\u001f]/.test(char)) {
      errors.push(`unknown text control character U+${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
      position += 1;
      continue;
    }
    const run = block.runs.find((item) => position >= item.start && position < item.end);
    if (segment && !sameFormat(run, segmentRun)) flush();
    segmentRun = run;
    segment += decodeTextChar(char, run, errors);
    position += 1;
  }
  flush();
  return out.join('');
}

// ExamView's default tab stops are every half inch. Lines that use tabs to place text (letter
// pyramids, two-column lists) are laid out with the same stops; each tab moves to the next stop
// past the text so far, measured at render time. Spaces keep their width (3pt, Times 12pt).
const TAB_STOP = '36pt';
const SPACE_WIDTH_PT = 3;

function lineEndAt(text: string, from: number, end: number): number {
  const next = text.indexOf('\r', from);
  return next < 0 || next > end ? end : next;
}

function isTabLayoutLine(text: string, from: number, to: number): boolean {
  const line = text.slice(from, to);
  const firstTab = line.indexOf('\t');
  if (firstTab < 0 || /[\u0010\u0011]/.test(line)) return false;
  return /[\p{L}\p{N}]/u.test(line.slice(firstTab + 1));
}

function renderTabLine(block: RichTextBlock, from: number, to: number, options: RenderOptions, errors: string[]): string {
  const segments: string[] = [];
  let segmentStart = from;
  for (let position = from; position <= to; position += 1) {
    if (position < to && block.text[position] !== '\t') continue;
    const parts: string[] = [];
    let cursor = segmentStart;
    while (cursor < position) {
      let stop = cursor;
      const spaces = block.text[cursor] === ' ';
      while (stop < position && (block.text[stop] === ' ') === spaces) stop += 1;
      parts.push(spaces
        ? `#h(${(stop - cursor) * SPACE_WIDTH_PT}pt)`
        : tidy(renderSpan(block, cursor, stop, options, errors)));
      cursor = stop;
    }
    segments.push(`[${parts.join('')}]`);
    segmentStart = position + 1;
  }
  return `#context {
  let x = 0pt
  for (i, segment) in (${segments.join(', ')},).enumerate() {
    if i > 0 {
      let next = (calc.floor(x / ${TAB_STOP}) + 1) * ${TAB_STOP}
      h(next - x)
      x = next
    }
    segment
    x += measure(segment).width
  }
}`;
}

function decodeTextChar(char: string, run: TextRun | undefined, errors: string[]): string {
  const code = char.charCodeAt(0);
  const symbolFace = /^symbol$/i.test(run?.style.face ?? '');
  if (symbolFace || (code >= 0xf020 && code <= 0xf0ff)) {
    const mapped = SYMBOL_FONT[code & 0xff];
    if (mapped === undefined) errors.push(`unmapped Symbol glyph U+${code.toString(16)}`);
    return mapped ?? '';
  }
  if (code >= 0xe000 && code <= 0xf8ff) errors.push(`private-use character U+${code.toString(16)}`);
  if (char === '�') errors.push('replacement character in text');
  return char;
}

function sameFormat(a: TextRun | undefined, b: TextRun | undefined): boolean {
  const key = (run: TextRun | undefined) => (run ? `${run.style.bold}${run.style.italic}${run.style.underline}` : 'falsefalsefalse');
  return key(a) === key(b);
}

function formatRun(text: string, run: TextRun | undefined): string {
  let markup = escapeMarkup(text);
  if (!run || !text.trim()) return markup;
  const leading = markup.match(/^\s*/)?.[0] ?? '';
  const trailing = markup.match(/\s*$/)?.[0] ?? '';
  let core = markup.trim();
  // The terminator keeps following punctuation such as `(x)` in markup mode instead of
  // being parsed as another argument to the styling function.
  if (run.style.underline) core = `#underline[${core}];`;
  if (run.style.italic) core = `#emph[${core}];`;
  if (run.style.bold) core = `#strong[${core}];`;
  markup = `${leading}${core}${trailing}`;
  return markup;
}

function renderObject(object: RichObject, options: RenderOptions, errors: string[]): string {
  if (object.kind === 'picture') return options.picture(object);
  if (object.kind === 'variable') {
    const sample = options.variables?.get(object.name);
    if (sample?.displayError) {
      errors.push(`stored text variable ${object.name}: ${sample.displayError}`);
      return '';
    }
    if (!sample || sample.display === undefined || sample.valueType === 'none') {
      errors.push(`unresolved stored text variable ${object.name}`);
      return '';
    }
    return sample.mathDisplay ? `$${sample.mathDisplay}$` : formatRun(sample.display, undefined);
  }
  if (object.kind === 'graph') {
    errors.push(...object.errors, 'native graph decoded; visual rendering is not yet verified');
    return '';
  }
  if (object.kind === 'unknown') {
    errors.push(`unsupported embedded object kind ${object.code}`);
    return '';
  }
  errors.push(...object.errors);
  if (object.footer?.name) {
    errors.push(`unsupported named-equation visibility: ${object.footer.name}`);
    return '';
  }
  const rendered = equationToTypst(object.nodes, options.variables);
  errors.push(...rendered.errors);
  return rendered.multiline ? `\n$ ${rendered.math} $\n` : `$${rendered.math}$`;
}

function renderTable(block: RichTextBlock, table: RichTable, options: RenderOptions, errors: string[]): string {
  const columns = Math.max(1, ...table.rows.map((row) => row.length));
  const cells: string[] = [];
  for (const row of table.rows) {
    for (let index = 0; index < columns; index += 1) {
      const cell = row[index];
      const content = cell ? tidy(renderSpan(block, cell.start, cell.end, options, errors)).trim() : '';
      cells.push(`[${content}]`);
    }
  }
  return `#table(columns: ${columns}, align: center + horizon, ${cells.join(', ')})`;
}

// Escape Typst markup syntax in plain text.
export function escapeMarkup(text: string): string {
  return text
    .replace(/[\\#$*_`<>@\[\]~]/g, (char) => `\\${char}`)
    .replace(/\/(?=[/*])/g, '\\/')
    .replace(/(^|\r)(\s*)(=|[-+](?=\s)|\/(?=\s)|\d+\.(?=\s))/g, (_, start, space, marker) => `${start}${space}\\${marker}`);
}

// Paragraph marks → Typst line and paragraph breaks.
function tidy(typst: string): string {
  return typst
    .replace(/^[\r\s]+|[\r\s]+$/g, '')
    .replace(/[ \t]*\r[ \t]*(?:\r[ \t]*)+/g, '\n\n')
    .replace(/[ \t]*\r[ \t]*/g, ' \\\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/ {2,}/g, ' ');
}

/** Picture width in inches, capped to a printable width. */
export function pictureWidthInches(object: { widthTwips: number }): number {
  return Math.min(MAX_PICTURE_WIDTH_IN, Math.max(0.2, object.widthTwips / 1440));
}

// ---------------------------------------------------------------------------
// DIB (BITMAPINFOHEADER, uncompressed) → PNG

export function dibToPng(dib: Uint8Array): Uint8Array {
  const view = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);
  const headerSize = view.getInt32(0, true);
  const width = view.getInt32(4, true);
  const rawHeight = view.getInt32(8, true);
  const bitCount = view.getInt16(14, true);
  const compression = view.getInt32(16, true);
  const height = Math.abs(rawHeight);
  if (headerSize < 40 || width <= 0 || height === 0 || width > 20000 || height > 20000) throw new Error('bad DIB header');
  if (compression !== 0) throw new Error(`DIB compression ${compression} not supported`);
  if (![1, 4, 8, 24, 32].includes(bitCount)) throw new Error(`DIB bit count ${bitCount} not supported`);
  const paletteCount = bitCount <= 8 ? view.getInt32(32, true) || 1 << bitCount : 0;
  const paletteAt = headerSize;
  const pixelsAt = paletteAt + paletteCount * 4;
  const stride = Math.ceil((width * bitCount) / 32) * 4;
  if (pixelsAt + stride * height > dib.byteLength) throw new Error('DIB pixel data truncated');

  const indexed = bitCount <= 8;
  const outRowBytes = indexed ? Math.ceil((width * bitCount) / 8) : width * 3;
  const raw = new Uint8Array((outRowBytes + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const sourceRow = rawHeight > 0 ? height - 1 - y : y;
    const source = pixelsAt + sourceRow * stride;
    const target = y * (outRowBytes + 1);
    raw[target] = 0;
    if (indexed) {
      raw.set(dib.subarray(source, source + outRowBytes), target + 1);
    } else {
      const step = bitCount / 8;
      for (let x = 0; x < width; x += 1) {
        raw[target + 1 + x * 3] = dib[source + x * step + 2];
        raw[target + 2 + x * 3] = dib[source + x * step + 1];
        raw[target + 3 + x * 3] = dib[source + x * step];
      }
    }
  }

  const chunks: Uint8Array[] = [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])];
  const ihdr = new Uint8Array(13);
  const ihdrView = new DataView(ihdr.buffer);
  ihdrView.setUint32(0, width);
  ihdrView.setUint32(4, height);
  ihdr[8] = indexed ? bitCount : 8;
  ihdr[9] = indexed ? 3 : 2;
  chunks.push(pngChunk('IHDR', ihdr));
  if (indexed) {
    const palette = new Uint8Array(paletteCount * 3);
    for (let index = 0; index < paletteCount; index += 1) {
      palette[index * 3] = dib[paletteAt + index * 4 + 2];
      palette[index * 3 + 1] = dib[paletteAt + index * 4 + 1];
      palette[index * 3 + 2] = dib[paletteAt + index * 4];
    }
    chunks.push(pngChunk('PLTE', palette));
  }
  chunks.push(pngChunk('IDAT', zlibSync(raw, { level: 9 })));
  chunks.push(pngChunk('IEND', new Uint8Array(0)));
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const png = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    png.set(chunk, offset);
    offset += chunk.length;
  }
  return png;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length);
  for (let index = 0; index < 4; index += 1) chunk[4 + index] = type.charCodeAt(index);
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
  return chunk;
}

let CRC_TABLE: Uint32Array | undefined;
function crc32(bytes: Uint8Array): number {
  if (!CRC_TABLE) {
    CRC_TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
