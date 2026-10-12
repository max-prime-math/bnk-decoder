// Structural reader for ExamView v06 equation objects, and a Typst renderer for them.
//
// An equation object's payload (see records.ts) is an int32 byte length followed by 11 int32
// layout fields (widths, ascent, sizes) and then a token stream:
//
//   0x09 int32 a, int32 class, int32 flags   style change for the characters that follow
//                                            class -11 regular, -10 Greek (Symbol letters),
//                                            -6 Symbol operators, -9 extra symbols (0x9e = ∘)
//   0x01 int16 flags, int16 0, int32 slotCount, int16 kind, int16 variant,
//        int32 extraLength, extra bytes      template; every slot starts with int32 metadata
//                                            and then a terminated line. Matrix extra data
//                                            stores columns/rows at offsets 8/12.
//   0x03 uint8 embellishment                 postfix/pair presentation marker. Observed native
//                                            meanings: 0x0e paired cancellation, 0x0f postfix
//                                            cancellation, 0x10 prime, 0x11 double-prime,
//                                            0x14 multiline alignment, 0x17 overbar.
//   0x04–0x08                                spaces, narrowest to widest (typed between an
//                                            expression and its condition: "x − 1,  x ≥ 2")
//   0x0b int32 shape                         standalone symbol: 0 △, 1 ▱, 2 −.
//                                            Any vertex letters are peer tokens, not a nested line.
//   0x0d                                     line break inside the equation
//   0x00                                     end of the current line (slot or root)
//   other bytes                              one character each (Windows-1252 / Symbol font)
//
// Templates seen (kind.variant, slots): 0.0/0.1 ( ), 0.2 { }, 0.4 | |, 1.0 stacked fraction (2),
// 1.1 small fraction (2), 1.2 slash fraction (2), 1.5 square root, 1.6 nth root
// (radicand, index), 1.7 long division (divisor before, dividend in slot), 2.0 superscript,
// 2.1 subscript, 2.2 paired lower/upper scripts, 2.4 left subscript (attaches to what
// follows, as in ₆C₃), 5.0 overbar, 5.2 underline, 0.19 left brace
// only (piecewise function; rows are the slot's lines), 0.24 set-builder condition bar,
// 1.8 polynomial long division (work, quotient), 3.2 summation (body, lower, upper).
// The root line ends with 0x00; the payload is zero-padded after it.

export type EquationNode =
  | { type: 'char'; code: number; style: number }
  | { type: 'variable'; name: string; range: [number, number] }
  | { type: 'break' }
  | { type: 'space'; width: number }
  | { type: 'format'; code: number }
  | { type: 'geometry'; shape: number; name: EquationNode[] }
  | { type: 'template'; kind: number; variant: number; slots: EquationNode[][]; slotMetadata?: number[]; extra?: Uint8Array };

export interface ParsedEquation {
  nodes: EquationNode[];
  errors: string[];
}

export interface EquationTypst {
  /** Typst math source without the surrounding dollar signs. */
  math: string;
  /** True when the equation has line breaks and should be set as display math. */
  multiline: boolean;
  errors: string[];
}

const STYLE_REGULAR = -11;
const STYLE_GREEK = -10;
const STYLE_EXTRA = -9;
const STYLE_SYMBOL = -6;
const MAX_DEPTH = 32;

/** Adobe Symbol font encoding → Unicode (used by equation styles and Symbol-font text runs). */
export const SYMBOL_FONT: Record<number, string> = {
  0x20: ' ', 0x21: '!', 0x22: '∀', 0x23: '#', 0x24: '∃', 0x25: '%', 0x26: '&', 0x27: '∋', 0x28: '(', 0x29: ')',
  0x2a: '∗', 0x2b: '+', 0x2c: ',', 0x2d: '−', 0x2e: '.', 0x2f: '/', 0x30: '0', 0x31: '1', 0x32: '2', 0x33: '3',
  0x34: '4', 0x35: '5', 0x36: '6', 0x37: '7', 0x38: '8', 0x39: '9', 0x3a: ':', 0x3b: ';', 0x3c: '<', 0x3d: '=',
  0x3e: '>', 0x3f: '?', 0x40: '≅', 0x41: 'Α', 0x42: 'Β', 0x43: 'Χ', 0x44: 'Δ', 0x45: 'Ε', 0x46: 'Φ', 0x47: 'Γ',
  0x48: 'Η', 0x49: 'Ι', 0x4a: 'ϑ', 0x4b: 'Κ', 0x4c: 'Λ', 0x4d: 'Μ', 0x4e: 'Ν', 0x4f: 'Ο', 0x50: 'Π', 0x51: 'Θ',
  0x52: 'Ρ', 0x53: 'Σ', 0x54: 'Τ', 0x55: 'Υ', 0x56: 'ς', 0x57: 'Ω', 0x58: 'Ξ', 0x59: 'Ψ', 0x5a: 'Ζ', 0x5b: '[',
  0x5c: '∴', 0x5d: ']', 0x5e: '⊥', 0x5f: '_', 0x61: 'α', 0x62: 'β', 0x63: 'χ', 0x64: 'δ', 0x65: 'ε', 0x66: 'φ',
  0x67: 'γ', 0x68: 'η', 0x69: 'ι', 0x6a: 'ϕ', 0x6b: 'κ', 0x6c: 'λ', 0x6d: 'μ', 0x6e: 'ν', 0x6f: 'ο', 0x70: 'π',
  0x71: 'θ', 0x72: 'ρ', 0x73: 'σ', 0x74: 'τ', 0x75: 'υ', 0x76: 'ϖ', 0x77: 'ω', 0x78: 'ξ', 0x79: 'ψ', 0x7a: 'ζ',
  0x7b: '{', 0x7c: '|', 0x7d: '}', 0x7e: '∼', 0xa1: 'ϒ', 0xa2: '′', 0xa3: '≤', 0xa4: '⁄', 0xa5: '∞', 0xa6: 'ƒ',
  0xab: '↔', 0xac: '←', 0xad: '↑', 0xae: '→', 0xaf: '↓', 0xb0: '°', 0xb1: '±', 0xb2: '″', 0xb3: '≥', 0xb4: '×',
  0xb5: '∝', 0xb6: '∂', 0xb7: '•', 0xb8: '÷', 0xb9: '≠', 0xba: '≡', 0xbb: '≈', 0xbc: '…', 0xc6: '∅', 0xc7: '∩',
  0xc8: '∪', 0xc9: '⊃', 0xca: '⊇', 0xcb: '⊄', 0xcc: '⊂', 0xcd: '⊆', 0xce: '∈', 0xcf: '∉', 0xd0: '∠', 0xd1: '∇',
  0xd5: '∏', 0xd6: '√', 0xd7: '⋅', 0xd8: '¬', 0xd9: '∧', 0xda: '∨', 0xdb: '⇔', 0xdc: '⇐', 0xdd: '⇑', 0xde: '⇒',
  0xdf: '⇓', 0xe0: '◊', 0xe1: '⟨', 0xe5: '∑', 0xf1: '⟩', 0xf2: '∫',
};

// Class -9 is a small extra-symbol font. Evidenced: the composition ring (f ∘ g), and the
// number sets in "{x | x ∈ ℝ, x ≠ 3}" and "n ∈ ℕ" (Pre-Calculus 11 Mickelson).
// Native ExamView exports confirm these characters from its extra-symbol font.
// 0x80 is the parallel relation and 0x91 is the centered ellipsis used in series.
const EXTRA_FONT: Record<number, string> = {
  0x80: '∥',
  0x91: '…',
  0x98: 'ℝ',
  0x9e: '∘',
  0xbd: 'ℕ',
};
const SPACES: Record<number, string> = { 0x04: 'thin', 0x05: 'thin', 0x06: 'thin', 0x07: 'med', 0x08: 'thick' };
const SHAPES: Record<number, string> = { 0: '△', 1: '▱', 2: '-' };

const WINDOWS_1252 = new TextDecoder('windows-1252');

export function parseEquation(bytes: Uint8Array, start: number, end: number): ParsedEquation {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > bytes.byteLength || start >= end) return { nodes: [], errors: ['invalid equation byte range'] };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const errors: string[] = [];
  let cursor = start;

  const line = (depth: number): EquationNode[] => {
    const nodes: EquationNode[] = [];
    let style = STYLE_REGULAR;
    if (depth > MAX_DEPTH) {
      errors.push('templates nested too deeply');
      cursor = end;
      return nodes;
    }
    while (cursor < end) {
      const byte = bytes[cursor];
      if (byte === 0x00) {
        cursor += 1;
        return nodes;
      }
      if (byte === 0x09) {
        if (cursor + 13 > end) break;
        style = view.getInt32(cursor + 5, true);
        cursor += 13;
        continue;
      }
      if (byte === 0x0a) {
        const tokenStart = cursor;
        cursor += 1;
        const nameStart = cursor;
        while (cursor + 2 <= end && view.getUint16(cursor, true) !== 0) cursor += 2;
        if (cursor + 2 > end) { errors.push('unterminated equation variable name'); cursor = end; return nodes; }
        const name = new TextDecoder('utf-16le').decode(bytes.subarray(nameStart, cursor));
        cursor += 2;
        if (!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(name)) errors.push('invalid equation variable name');
        nodes.push({ type: 'variable', name, range: [tokenStart, cursor] });
        continue;
      }
      if (byte === 0x01) {
        if (cursor + 17 > end) break;
        let slotCount = view.getInt32(cursor + 5, true);
        const kind = view.getInt16(cursor + 9, true);
        const variant = view.getInt16(cursor + 11, true);
        const extraLength = view.getInt32(cursor + 13, true);
        cursor += 17;
        if (extraLength < 0 || extraLength > end - cursor) { errors.push('invalid equation template extra-data length'); cursor = end; return nodes; }
        const extra = bytes.slice(cursor, cursor + extraLength);
        cursor += extraLength;
        if (kind === 8) {
          if (extraLength < 16) { errors.push('truncated matrix template dimensions'); cursor = end; return nodes; }
          const dims = new DataView(extra.buffer, extra.byteOffset, extra.byteLength);
          const columns = dims.getInt32(8, true), rows = dims.getInt32(12, true);
          if (columns < 1 || rows < 1 || columns > 100 || rows > 100 || columns * rows !== slotCount) { errors.push('invalid matrix template dimensions'); cursor = end; return nodes; }
          slotCount = columns * rows;
        }
        if (slotCount < 1 || slotCount > 1000) {
          errors.push(`template ${kind}.${variant} has ${slotCount} slots`);
          cursor = end;
          return nodes;
        }
        const slots: EquationNode[][] = [];
        const slotMetadata: number[] = [];
        for (let slot = 0; slot < slotCount; slot += 1) {
          if (cursor + 4 > end) { errors.push(`template ${kind}.${variant} slot metadata truncated`); cursor = end; return nodes; }
          slotMetadata.push(view.getInt32(cursor, true));
          cursor += 4;
          slots.push(line(depth + 1));
        }
        nodes.push({ type: 'template', kind, variant, slots, slotMetadata, extra });
        continue;
      }
      if (byte === 0x03) {
        if (cursor + 2 > end) break;
        nodes.push({ type: 'format', code: bytes[cursor + 1] });
        cursor += 2;
        continue;
      }
      if (byte >= 0x04 && byte <= 0x08) {
        nodes.push({ type: 'space', width: byte });
        cursor += 1;
        continue;
      }
      if (byte === 0x0b) {
        if (cursor + 5 > end) break;
        const shape = view.getInt32(cursor + 1, true);
        cursor += 5;
        // Native FUN_004bc520 copies exactly five bytes for this token. Recursing here
        // consumes the enclosing slot terminator and corrupts subsequent fractions.
        nodes.push({ type: 'geometry', shape, name: [] });
        continue;
      }
      if (byte === 0x0d) {
        nodes.push({ type: 'break' });
        cursor += 1;
        continue;
      }
      if (byte < 0x20) {
        errors.push(`unknown equation control byte 0x${byte.toString(16)}`);
        cursor += 1;
        continue;
      }
      nodes.push({ type: 'char', code: byte, style });
      cursor += 1;
    }
    errors.push('equation stream ended inside a line');
    return nodes;
  };

  const nodes = line(0);
  for (let index = cursor; index < end; index += 1) {
    if (bytes[index] !== 0) {
      errors.push('unexpected bytes after the equation');
      break;
    }
  }
  return { nodes, errors };
}

// ---------------------------------------------------------------------------
// Typst rendering

const FUNCTION_NAMES = ['arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'log', 'ln', 'exp', 'lim', 'max', 'min'];
// Units and words ExamView authors type inside equations; printed upright as text.
const UNITS = new Set(['cm', 'mm', 'km', 'kg', 'mg', 'mL', 'ml', 'kL', 'km/h', 'min', 'hr', 'hrs', 's', 'm']);
const MULTI_CHAR_UNITS = new Set([...UNITS].filter((unit) => unit.length > 1 && /^[A-Za-z]+$/.test(unit) && !FUNCTION_NAMES.includes(unit)));
// Characters that are Typst math syntax when typed literally.
const MATH_ESCAPES: Record<string, string> = {
  '/': '\\/', '\\': '\\\\', '#': '\\#', '$': '\\$', '&': '\\&', '"': '\\"', '_': '\\_', '^': '\\^', '{': '\\{', '}': '\\}',
  '@': '\\@', "'": "'", '~': '\\~', '`': '\\`', ';': '\\;',
};

interface Token {
  kind: 'number' | 'letters' | 'symbol' | 'text' | 'raw';
  text: string;
}

export interface StoredVariableDisplay { display: string | undefined; valueType: 'number' | 'string' | 'none'; mathDisplay?: string; displayError?: string }
export type StoredVariables = ReadonlyMap<string, StoredVariableDisplay>;

export function equationToTypst(nodes: EquationNode[], variables?: StoredVariables): EquationTypst {
  const errors: string[] = [];
  const multiline = hasBreak(nodes);
  let math = renderLine(nodes, errors, false, variables).trim();
  if (multiline && !math.includes('&')) {
    const lines = math.split('\n');
    const relation = /\s(=|≈|≤|≥|<|>)\s/;
    if (lines.filter(line => relation.test(line)).length > 1) math = lines.map(line => line.replace(relation, ' & $1 ')).join('\n');
  }
  return { math: math || '""', multiline, errors };
}

// Authors also break lines inside a template slot (a derivation typed into a denominator);
// any break means the equation needs display layout.
function hasBreak(nodes: EquationNode[]): boolean {
  // A piecewise brace sets its own rows, so its breaks don't make the equation multi-line.
  return nodes.some((node) => node.type === 'break'
    || (node.type === 'template' && !(node.kind === 0 && node.variant === 19) && node.slots.some(hasBreak)));
}

function renderLine(nodes: EquationNode[], errors: string[], inArgument: boolean, variables?: StoredVariables): string {
  const out: string[] = [];
  let pending: { style: number; chars: string[] } | undefined;
  let prefix = ''; // left subscript waiting for the next atom

  const flush = () => {
    if (!pending) return;
    for (const token of tokenize(pending.chars, pending.style, errors)) {
      const rendered = renderToken(token, inArgument);
      // A word after a value ("28.72 years") gets a thin space, as ExamView prints it.
      out.push(token.kind === 'text' && out.length && /[\p{L}\p{N})]$/u.test(out[out.length - 1]) ? `thin ${rendered}` : rendered);
    }
    pending = undefined;
  };
  const push = (text: string) => {
    if (prefix) {
      out.push(prefix);
      prefix = '';
    }
    out.push(text);
  };

  const wrapPrevious = (label: string, transform: (value: string) => string) => {
    flush();
    if (!out.length || out[out.length - 1] === '\\\n' || out[out.length - 1] === '&') {
      errors.push(`${label} has no preceding equation atom`);
      return;
    }
    out[out.length - 1] = transform(out[out.length - 1]);
  };

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.type === 'char') {
      const char = decodeChar(node.code, node.style, errors);
      if (pending && pending.style === classOf(node.style)) {
        pending.chars.push(char);
      } else {
        flush();
        if (prefix) {
          out.push(prefix);
          prefix = '';
        }
        pending = { style: classOf(node.style), chars: [char] };
      }
      continue;
    }
    flush();
    if (node.type === 'format') {
      if (node.code === 0x0e) {
        const close = nodes.findIndex((candidate, candidateIndex) => candidateIndex > index && candidate.type === 'format' && candidate.code === 0x0e);
        if (close < 0) errors.push('paired equation cancellation marker is not closed');
        else {
          const content = renderLine(nodes.slice(index + 1, close), errors, true, variables).trim();
          if (!content) errors.push('paired equation cancellation marker is empty');
          else push(`cancel(${content})`);
          index = close;
        }
      } else if (node.code === 0x0f) {
        wrapPrevious('equation cancellation marker', value => `cancel(${value})`);
      } else if (node.code === 0x10) {
        wrapPrevious('equation prime marker', value => `${value}'`);
      } else if (node.code === 0x11) {
        wrapPrevious('equation double-prime marker', value => `${value}''`);
      } else if (node.code === 0x14) {
        if (out.length && out[out.length - 1] === '=') out[out.length - 1] = '& =';
        else out.push('&');
      } else if (node.code === 0x17) {
        wrapPrevious('equation overbar marker', value => `overline(${value})`);
      } else {
        errors.push(`unsupported equation character format 0x${node.code.toString(16)}`);
      }
      continue;
    }
    if (node.type === 'variable') {
      const sample = variables?.get(node.name);
      if (sample?.displayError) {
        errors.push(`stored equation variable ${node.name}: ${sample.displayError}`);
      } else if (!sample || sample.display === undefined || sample.valueType === 'none') {
        errors.push(`unresolved stored equation variable ${node.name}`);
      } else {
        if (sample.mathDisplay) { push(sample.mathDisplay); continue; }
        const tokens = sample.valueType === 'string' ? [{ kind: 'text' as const, text: sample.display }] : tokenize([...sample.display], STYLE_REGULAR, errors);
        push(tokens.map((token) => renderToken(token, inArgument)).join(' '));
      }
      continue;
    }
    if (node.type === 'break') {
      out.push('\\\n');
      continue;
    }
    if (node.type === 'space') {
      out.push(SPACES[node.width]);
      continue;
    }
    if (node.type === 'geometry') {
      const shape = SHAPES[node.shape];
      if (!shape) errors.push(`unknown geometry shape ${node.shape}`);
      // Vertex letters are separate points (△ABC, ▱ABCD), never a word.
      const letters = node.name.every((item) => item.type === 'char' && /^[A-Za-z]$/.test(String.fromCharCode(item.code)));
      const name = letters
        ? node.name.map((item) => (item.type === 'char' ? String.fromCharCode(item.code) : '')).join(' ')
        : renderLine(node.name, errors, inArgument, variables).trim();
      push(`${shape ?? ''} ${name}`);
      continue;
    }
    if (node.kind === 0 && node.variant === 19) {
      // Piecewise function: one row per line of the slot; commas inside a row are escaped.
      const rows: EquationNode[][] = [[]];
      for (const item of node.slots[0] ?? []) {
        if (item.type === 'break') rows.push([]);
        else rows[rows.length - 1].push(item);
      }
      push(`cases(${rows.map((row) => renderLine(row, errors, true, variables).trim() || '""').join(', ')})`);
      continue;
    }
    const slots = node.slots.map((slot) => renderLine(slot, errors, true, variables).trim());
    const slot = (index: number) => slots[index] || '""';
    const key = `${node.kind}.${node.variant}`;
    if (node.kind === 8 && node.variant === 0) {
      const dimensions = node.extra && node.extra.byteLength >= 16
        ? new DataView(node.extra.buffer, node.extra.byteOffset, node.extra.byteLength)
        : undefined;
      const mode = dimensions?.getInt32(0, true), columns = dimensions?.getInt32(8, true), rows = dimensions?.getInt32(12, true);
      if (!columns || !rows || columns * rows !== slots.length) {
        errors.push('invalid matrix template dimensions');
        push(`(${slots.join(', ')})`);
      } else if (columns === 1 && rows === 1) {
        // ExamView also uses a 1x1 matrix as an alignment wrapper.
        push(slot(0));
      } else {
        const cells = slots.map(value => `[$ ${value || '""'} $]`).join(', ');
        if (mode === 1) {
          // Publisher factor tables use a fully ruled grid.
          push(`#table(columns: ${columns}, inset: 2pt, stroke: 0.5pt, ${cells})`);
        } else if (mode === 4) {
          // Synthetic division: separator after column one and after row two.
          push(`#table(columns: ${columns}, inset: 2pt, stroke: (x, y) => (left: if x == 1 { 0.5pt } else { none }, bottom: if y == 1 { 0.5pt } else { none }), ${cells})`);
        } else {
          // One-row coefficient/vector layouts have no rulings.
          push(`#grid(columns: ${columns}, column-gutter: 0.5em, ${cells})`);
        }
      }
      continue;
    }
    switch (key) {
      case '0.0':
      case '0.1':
        push(`(${slots[0]})`);
        break;
      case '0.2':
        push(`lr(\\{ ${slots[0]} \\})`);
        break;
      case '0.4':
        push(`abs(${slot(0)})`);
        break;
      case '0.24':
        push(`${slot(0)} |`);
        break;
      case '1.0':
      case '1.1':
        push(`frac(${slot(0)}, ${slot(1)})`);
        break;
      case '1.2':
        push(`${wrapGroup(slot(0))} \\/ ${wrapGroup(slot(1))}`);
        break;
      case '1.5':
        push(`sqrt(${slot(0)})`);
        break;
      case '1.6':
        push(`root(${slot(1)}, ${slot(0)})`);
        break;
      case '1.7':
        push(`thin lr(\\)) overline(${slot(0)})`);
        break;
      case '1.8':
        // Polynomial long division owns the divisor immediately before the template.
        // A two-column matrix keeps that divisor aligned with the dividend while the
        // quotient occupies the cell above it.
        {
          const divisor = out.splice(0).join(' ') || '""';
          push(`#grid(columns: (auto, auto), column-gutter: 0pt, [], [$ ${slot(1)} $], [$ ${divisor} thin lr(\\)) $], [$ overline(${slot(0)}) $])`);
        }
        break;
      case '2.0':
        out.push(out.length ? `^(${slot(0)})` : `""^(${slot(0)})`);
        break;
      case '2.1':
        out.push(out.length ? `_(${slot(0)})` : `""_(${slot(0)})`);
        break;
      case '2.2':
        out.push(out.length ? `_(${slot(0)})^(${slot(1)})` : `""_(${slot(0)})^(${slot(1)})`);
        break;
      case '2.4':
        prefix = `""_(${slot(0)})`;
        break;
      case '2.3':
        prefix = `""^(${slot(0)})`;
        break;
      case '3.2':
        push(`sum${slots[1] ? `_(${slots[1]})` : ''}${slots[2] ? `^(${slots[2]})` : ''} ${slot(0)}`);
        break;
      case '5.0':
        push(`overline(${slot(0)})`);
        break;
      case '5.2':
        push(`underline(${slot(0)})`);
        break;
      case '6.0':
        push(`arrow.r.long ${slot(0)}`);
        break;
      default:
        errors.push(`unsupported equation template ${key}`);
        push(`(${slots.join(', ')})`);
    }
  }
  flush();
  if (prefix) out.push(prefix);
  return balanceBrackets(out.join(' '));
}

function classOf(style: number): number {
  return style === STYLE_GREEK || style === STYLE_SYMBOL || style === STYLE_EXTRA ? style : STYLE_REGULAR;
}

function decodeChar(code: number, style: number, errors: string[]): string {
  const cls = classOf(style);
  if (cls === STYLE_GREEK || cls === STYLE_SYMBOL) {
    const mapped = SYMBOL_FONT[code];
    if (mapped === undefined) errors.push(`unmapped Symbol glyph 0x${code.toString(16)}`);
    return mapped ?? '';
  }
  if (cls === STYLE_EXTRA) {
    const mapped = EXTRA_FONT[code];
    if (mapped === undefined) errors.push(`unmapped extra-symbol glyph 0x${code.toString(16)}`);
    return mapped ?? '';
  }
  if (code >= 0x80) {
    const decoded = WINDOWS_1252.decode(new Uint8Array([code]));
    if (!decoded || decoded === '\ufffd' || /[\u0080-\u009f]/.test(decoded)) errors.push(`unmapped equation byte 0x${code.toString(16)}`);
    return decoded;
  }
  return String.fromCharCode(code);
}

function tokenize(chars: string[], style: number, errors: string[]): Token[] {
  const tokens: Token[] = [];
  const text = chars.join('');
  if (style !== STYLE_REGULAR) {
    for (const char of text) tokens.push({ kind: /\p{L}/u.test(char) ? 'letters' : 'symbol', text: char });
    return tokens;
  }
  const pattern = /(\d+(?:\.\d+)?|\.\d+)|([A-Za-z]+)|(\s+)|(.)/gsu;
  for (const match of text.matchAll(pattern)) {
    if (match[1]) tokens.push({ kind: 'number', text: match[1] });
    else if (match[2]) tokens.push(...splitLetters(match[2]));
    else if (match[4]) tokens.push({ kind: 'symbol', text: match[4] });
  }
  if (tokens.some((token) => token.kind === 'symbol' && /[\u0000-\u001f]/.test(token.text))) errors.push('control character in equation text');
  return tokens;
}

// Letters typed next to each other are separate variables in ExamView ("xy", "sinx"), but
// function names and words must stay together.
function splitLetters(run: string): Token[] {
  const tokens: Token[] = [];
  let rest = run;
  while (rest) {
    const name = FUNCTION_NAMES.find((candidate) => rest.startsWith(candidate));
    if (name) {
      tokens.push({ kind: 'raw', text: name });
      rest = rest.slice(name.length);
      continue;
    }
    if (UNITS.has(rest) && rest.length > 1) {
      tokens.push({ kind: 'text', text: rest });
      break;
    }
    const unit = [...MULTI_CHAR_UNITS].find((candidate) => rest === candidate);
    if (unit) {
      tokens.push({ kind: 'text', text: unit });
      break;
    }
    // A long run with no function name inside is a word ("years", "quotient").
    if (rest.length >= 4 && !FUNCTION_NAMES.some((candidate) => rest.includes(candidate))) {
      tokens.push({ kind: 'text', text: rest });
      break;
    }
    tokens.push({ kind: 'letters', text: rest[0] });
    rest = rest.slice(1);
  }
  return tokens;
}

function renderToken(token: Token, inArgument: boolean): string {
  switch (token.kind) {
    case 'number':
      return token.text;
    case 'letters':
    case 'raw':
      return token.text;
    case 'text':
      return `"${token.text.replace(/["\\]/g, '\\$&')}"`;
    case 'symbol': {
      const char = token.text;
      if (char === ',' && inArgument) return '\\,';
      if (MATH_ESCAPES[char] !== undefined) return MATH_ESCAPES[char];
      if (char === '−') return '-';
      return char;
    }
    default:
      return token.text;
  }
}

function wrapGroup(value: string): string {
  return /^[\p{L}\p{N}.]+$/u.test(value) ? value : `(${value})`;
}

// Typed brackets that don't pair up (interval notation such as "(2, 5]") are escaped so
// Typst doesn't try to group them. Brackets produced by templates are always balanced.
function balanceBrackets(source: string): string {
  const tokens = [...source.matchAll(/\\.|"(?:[^"\\]|\\.)*"|[()[\]]|[^\\"()[\]]+/gs)].map((match) => match[0]);
  const stack: number[] = [];
  const unmatched = new Set<number>();
  const pairs: Record<string, string> = { ')': '(', ']': '[' };
  tokens.forEach((token, index) => {
    if (token === '(' || token === '[') stack.push(index);
    else if (token === ')' || token === ']') {
      const open = stack.length ? stack[stack.length - 1] : -1;
      if (open >= 0 && tokens[open] === pairs[token]) stack.pop();
      else unmatched.add(index);
    }
  });
  stack.forEach((index) => unmatched.add(index));
  if (!unmatched.size) return source;
  return tokens.map((token, index) => (unmatched.has(index) ? `\\${token}` : token)).join('');
}
