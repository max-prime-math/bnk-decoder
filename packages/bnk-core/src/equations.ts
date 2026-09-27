// Structural reader for ExamView v06 equation objects, and a Typst renderer for them.
//
// An equation object's payload (see records.ts) is an int32 byte length followed by 11 int32
// layout fields (widths, ascent, sizes) and then a token stream:
//
//   0x09 int32 a, int32 class, int32 flags   style change for the characters that follow
//                                            class -11 regular, -10 Greek (Symbol letters),
//                                            -6 Symbol operators, -9 extra symbols (0x9e = ∘)
//   0x01 int16 flags, int16 0, int32 slotCount, int16 kind, int16 variant, 8 bytes
//                                            template; its slots follow as lines, slots after
//                                            the first are each preceded by an int32 0
//   0x0d                                     line break inside the equation
//   0x00                                     end of the current line (slot or root)
//   other bytes                              one character each (Windows-1252 / Symbol font)
//
// Templates seen (kind.variant, slots): 0.0 ( ), 0.2 { }, 0.4 | |, 1.0 stacked fraction (2),
// 1.1 small fraction (2), 1.2 slash fraction (2), 1.5 square root, 1.6 nth root
// (radicand, index), 1.7 long division (divisor before, dividend in slot), 2.0 superscript,
// 2.1 subscript, 2.4 left subscript (attaches to what follows, as in ₆C₃).
// The root line ends with 0x00; the payload is zero-padded after it.

export type EquationNode =
  | { type: 'char'; code: number; style: number }
  | { type: 'break' }
  | { type: 'template'; kind: number; variant: number; slots: EquationNode[][] };

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

// Class -9 is a small extra-symbol font; only the composition ring is evidenced (f ∘ g).
const EXTRA_FONT: Record<number, string> = { 0x9e: '∘' };

const WINDOWS_1252 = new TextDecoder('windows-1252');

export function parseEquation(bytes: Uint8Array, start: number, end: number): ParsedEquation {
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
      if (byte === 0x01) {
        if (cursor + 21 > end) break;
        const slotCount = view.getInt32(cursor + 5, true);
        const kind = view.getInt16(cursor + 9, true);
        const variant = view.getInt16(cursor + 11, true);
        cursor += 21;
        if (slotCount < 1 || slotCount > 4) {
          errors.push(`template ${kind}.${variant} has ${slotCount} slots`);
          cursor = end;
          return nodes;
        }
        const slots: EquationNode[][] = [];
        for (let slot = 0; slot < slotCount; slot += 1) {
          if (slot > 0) {
            if (view.getInt32(cursor, true) !== 0) errors.push(`template ${kind}.${variant} slot separator is not zero`);
            cursor += 4;
          }
          slots.push(line(depth + 1));
        }
        nodes.push({ type: 'template', kind, variant, slots });
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

export function equationToTypst(nodes: EquationNode[]): EquationTypst {
  const errors: string[] = [];
  const multiline = hasBreak(nodes);
  const math = renderLine(nodes, errors, false).trim();
  return { math: math || '""', multiline, errors };
}

// Authors also break lines inside a template slot (a derivation typed into a denominator);
// any break means the equation needs display layout.
function hasBreak(nodes: EquationNode[]): boolean {
  return nodes.some((node) => node.type === 'break' || (node.type === 'template' && node.slots.some(hasBreak)));
}

function renderLine(nodes: EquationNode[], errors: string[], inArgument: boolean): string {
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

  for (const node of nodes) {
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
    if (node.type === 'break') {
      out.push('\\\n');
      continue;
    }
    const slots = node.slots.map((slot) => renderLine(slot, errors, true).trim());
    const slot = (index: number) => slots[index] || '""';
    const key = `${node.kind}.${node.variant}`;
    switch (key) {
      case '0.0':
        push(`(${slots[0]})`);
        break;
      case '0.2':
        push(`lr(\\{ ${slots[0]} \\})`);
        break;
      case '0.4':
        push(`abs(${slot(0)})`);
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
      case '2.0':
        out.push(out.length ? `^(${slot(0)})` : `""^(${slot(0)})`);
        break;
      case '2.1':
        out.push(out.length ? `_(${slot(0)})` : `""_(${slot(0)})`);
        break;
      case '2.4':
        prefix = `""_(${slot(0)})`;
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
