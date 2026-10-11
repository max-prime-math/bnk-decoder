// Native export evidence reader. This is not a general-purpose RTF-to-PQP converter.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const destinations = new Set(['fonttbl', 'colortbl', 'stylesheet', 'info', 'header', 'footer', 'headerl', 'headerr', 'footerl', 'footerr', 'generator']);
export function readNativeRtf(input) {
  const source = Buffer.isBuffer(input) ? input.toString('latin1') : input;
  const stack = [], tokens = [], pictures = [], diagnostics = [];
  let state = { skip: false, uc: 1, bold: false, italic: false, underline: false, font: 0, downHalfPoints: 0 }, fallback = 0, at = 0;
  const emit = (text, extra = {}) => { if (!state.skip && text) tokens.push({ text, bold: state.bold, italic: state.italic, underline: state.underline, font: state.font, ...extra }); };
  function skipGroup(start) {
    let depth = 1, cursor = start;
    while (cursor < source.length && depth) {
      const c = source[cursor++];
      if (c === '\\') {
        const bin = /^bin(\d+) ?/.exec(source.slice(cursor));
        if (bin) { cursor += bin[0].length + Number(bin[1]); if (cursor > source.length) throw new Error('truncated RTF binary'); }
        else if (/[\\{}]/.test(source[cursor] ?? '')) cursor++;
      } else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    if (depth) throw new Error('unterminated RTF picture group');
    return cursor;
  }
  while (at < source.length) {
    const c = source[at++];
    if (c === '{') { stack.push(state); state = { ...state }; continue; }
    if (c === '}') { if (!stack.length) throw new Error('unbalanced RTF closing group'); state = stack.pop(); continue; }
    if (c === '\r' || c === '\n') continue;
    if (c !== '\\') { if (fallback) fallback--; else emit(c.charCodeAt(0) >= 128 ? new TextDecoder('windows-1252').decode(Uint8Array.of(c.charCodeAt(0))) : c); continue; }
    if (at >= source.length) throw new Error('truncated RTF escape');
    const symbol = source[at];
    if (!/[a-z]/i.test(symbol)) {
      at++;
      if (symbol === '*') state.skip = true;
      else if (symbol === "'") { const hex = source.slice(at, at + 2); if (!/^[0-9a-f]{2}$/i.test(hex)) throw new Error('invalid RTF hex escape'); at += 2; if (fallback) fallback--; else emit(new TextDecoder('windows-1252').decode(Uint8Array.of(parseInt(hex, 16)))); }
      else { const text = ({ '\\': '\\', '{': '{', '}': '}', '~': '\u00a0', '_': '\u2011', '-': '\u00ad' })[symbol]; if (fallback) fallback--; else if (text) emit(text); }
      continue;
    }
    const match = /^([a-z]+)(-?\d+)? ?/i.exec(source.slice(at));
    at += match[0].length;
    const word = match[1], value = match[2] === undefined ? undefined : Number(match[2]);
    if (word === 'pict') {
      const end = skipGroup(at), content = source.slice(at, end - 1);
      const controls = [...content.matchAll(/\\([a-z]+)(-?\d*) ?/gi)];
      const metadata = Object.fromEntries(controls.map(m => [m[1], m[2] ? Number(m[2]) : true]));
      metadata.baselineShiftPoints = state.downHalfPoints / 2;
      const hex = content.replace(/\\[a-z]+-?\d* ?/gi, '').replace(/\s/g, '');
      if (!/^(?:[0-9a-f]{2})*$/i.test(hex)) throw new Error('unsupported non-hex RTF picture');
      const index = pictures.length + 1;
      pictures.push({ index, metadata, bytes: Buffer.from(hex, 'hex') });
      emit(`[IMAGE:${index}]`, { image: index });
      at = end - 1; continue;
    }
    if (destinations.has(word)) { state.skip = true; continue; }
    if (word === 'bin') { if (value === undefined || value < 0 || at + value > source.length) throw new Error('invalid RTF binary length'); diagnostics.push('Binary payload outside pictures is not decoded'); at += value; continue; }
    if (word === 'uc') { if (value === undefined || value < 0 || value > 16) throw new Error('invalid RTF Unicode fallback'); state.uc = value; }
    else if (word === 'u') { if (value === undefined || value < -32768 || value > 65535) throw new Error('invalid RTF Unicode unit'); emit(String.fromCharCode(value & 65535)); fallback = state.uc; }
    else if (word === 'b') state.bold = value !== 0;
    else if (word === 'i') state.italic = value !== 0;
    else if (word === 'ul') state.underline = value !== 0;
    else if (word === 'ulnone') state.underline = false;
    else if (word === 'f') state.font = value;
    else if (word === 'dn') state.downHalfPoints = value ?? 6;
    else if (word === 'up') state.downHalfPoints = -(value ?? 6);
    else if (word === 'plain') { state.bold = state.italic = state.underline = false; state.font = 0; state.downHalfPoints = 0; }
    else if (word === 'par' || word === 'line') emit('\n');
    else if (word === 'tab' || word === 'cell') emit('\t', { tableCell: word === 'cell' });
    else if (word === 'row') emit('\n', { tableRow: true });
    else if (word === 'emdash') emit('\u2014');
    else if (word === 'endash') emit('\u2013');
    else if (word === 'bullet') emit('\u2022');
  }
  if (stack.length) throw new Error('unterminated RTF group');
  const text = tokens.map(t => t.text).join('');
  // Exported bank questions carry their native displayed number, followed by a tab.
  const marks = [...text.matchAll(/(?:^|\n)[ \t]*(\d+)\.\t/g)];
  const numberedSegments = marks.map((m, i) => {
    const chunk = text.slice(m.index, marks[i + 1]?.index ?? text.length).trim();
    const answerAt = chunk.indexOf('ANS:\t');
    const remainder = answerAt < 0 ? '' : chunk.slice(answerAt + 5);
    const metadataAt = remainder.search(/(?:\t|\n)(?:DIF|PTS|REF|OBJ|NAT|TOP|KEY|MSC):\t/);
    return { ordinal: i + 1, displayedNumber: Number(m[1]), text: chunk, answer: (metadataAt < 0 ? remainder : remainder.slice(0, metadataAt)).trim(), images: [...chunk.matchAll(/\[IMAGE:(\d+)\]/g)].map(x => Number(x[1])), hasAnswerMarker: answerAt >= 0 };
  });
  // Matching exports print their numbered stems and their answer key separately.
  // Preserve both; only the answer-bearing segments represent exported records.
  const questions = numberedSegments.filter(q => q.hasAnswerMarker).map((q, i) => ({ ...q, answerOrdinal: i + 1 }));
  return { text, tokens, pictures, numberedSegments, questions, diagnostics };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = readNativeRtf(readFileSync(process.argv[2]));
  const report = { ...result, pictures: result.pictures.map(({ bytes, ...p }) => ({ ...p, byteLength: bytes.length, base64: bytes.toString('base64') })) };
  if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(report, null, 2), { flag: 'wx' });
  console.log(JSON.stringify({ questions: result.questions.length, pictures: result.pictures.length, missingAnswers: result.questions.filter(q => !q.hasAnswerMarker).map(q => q.ordinal), diagnostics: result.diagnostics }));
}
