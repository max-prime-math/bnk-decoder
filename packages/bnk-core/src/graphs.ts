// Structural reader for ExamView v06 Cartesian graph objects.
//
// A graph object is a fixed-layout record (strings are fixed-width UTF-16 buffers):
//   +0x000 int32 byteLength (2456 + 1796 per item), int32 5
//   +0x008 four 16-character strings (view settings, usually "0")
//   +0x86c x-axis record: label (12 chars), float64 scale, int32 ticksPerInch,
//          int32 ticksPerLabel, int32 1, int32 1, font (LOGFONT-like)
//   +0x8fc y-axis record, same layout
//   +0xa1c + k*0x704  item k, addressed from its main string E:
//          E-0x80 domain min, E-0x60 domain max, E-0x40 display condition (16 chars each)
//          E-0x20 int32 type, E-0x14 int32 colour index, E-0x08 int32 line width
//          E      expression / first coordinate
// Item types: 0 y = f(x), 1 x = f(y), 3 circle, 6 point, 7 segment, 12 text, 18 number-line ray.
// Colour indexes seen: 1 black, 2 blue, 6 red. Line width 300 thin, 600 thick.
// Points: x at E, y at E+0x20, marker at E+0x60 (1 solid, 2 hollow), label style at E+0x64
// (1 = coordinates), label position at E+0x68. Segments: two point records, the second at
// E+0xc4. Text: text at E, position at E+0x98 / E+0xb8.
//
// The view size is stored in twips (minus one) in a frame record shortly before the object
// for many graphs; graphs used as choices don't carry one nearby.

export type GraphItem =
  | { type: 'function'; expression: string; domain: { min: string; max: string }; condition: string; colour: number; width: number }
  | { type: 'relation-y'; expression: string; domain: { min: string; max: string }; condition: string; colour: number; width: number }
  | { type: 'point'; x: string; y: string; marker: number; labelStyle: number; condition: string; colour: number }
  | { type: 'segment'; from: GraphPointRecord; to: GraphPointRecord; condition: string; colour: number; width: number }
  | { type: 'text'; text: string; x: string; y: string; condition: string; colour: number }
  | { type: 'other'; code: number; strings: string[] };

export interface GraphPointRecord {
  x: string;
  y: string;
  /** 1 solid, 2 hollow. */
  marker: number;
  /** 1 = label with coordinates. */
  labelStyle: number;
}

export interface GraphAxis {
  label: string;
  scale: number;
  ticksPerInch: number;
  ticksPerLabel: number;
  /** Tick labels (+0x88) or tick marks (+0x8c) switched on. */
  showLabels: boolean;
}

export interface GraphObject {
  offset: number;
  byteLength: number;
  view: string[];
  /** Frame size in inches when a frame record was found near the object. */
  frame?: { width: number; height: number };
  axes: { x: GraphAxis; y: GraphAxis };
  items: GraphItem[];
}

const HEADER_TO_X_AXIS = 0x86c;
const AXIS_STRIDE = 0x90;
const FIRST_ITEM = 0xa1c;
const ITEM_STRIDE = 0x704;
const BASE_LENGTH = 2456;
const UTF16 = new TextDecoder('utf-16le', { fatal: false });

// x-axis font block that directly follows the scale/ticks fields: int32 1, int32 1, then the
// LOGFONT height and face name ("Times New Roman" or "Symbol").
const AXIS_SIGNATURE = /\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000.ÿ(?:T\u0000i\u0000m\u0000e\u0000s|S\u0000y\u0000m)/gs;

export function readGraphObjects(payload: Uint8Array, start = 0, end = payload.byteLength): GraphObject[] {
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const text = latin1(payload.subarray(start, end));
  const axes = [...text.matchAll(AXIS_SIGNATURE)].map((match) => start + match.index!);
  const graphs: GraphObject[] = [];
  for (let index = 0; index < axes.length - 1; index += 1) {
    if (axes[index + 1] - axes[index] !== AXIS_STRIDE) continue;
    const xAxis = axes[index] - 0x28;
    const offset = xAxis - HEADER_TO_X_AXIS;
    if (offset < 0) continue;
    const byteLength = view.getInt32(offset, true);
    const count = Math.round((byteLength - BASE_LENGTH) / ITEM_STRIDE);
    if (count < 0 || count > 100 || offset + byteLength > payload.byteLength) continue;
    graphs.push({
      offset,
      byteLength,
      view: [0, 1, 2, 3].map((k) => readString(payload, offset + 8 + k * 32, 16)),
      frame: findFrame(view, offset),
      axes: { x: readAxis(payload, view, xAxis), y: readAxis(payload, view, xAxis + AXIS_STRIDE) },
      items: Array.from({ length: count }, (_, k) => readItem(payload, view, offset + FIRST_ITEM + k * ITEM_STRIDE)),
    });
    index += 1;
  }
  return graphs;
}

function readAxis(payload: Uint8Array, view: DataView, at: number): GraphAxis {
  return {
    label: readString(payload, at, 12),
    scale: view.getFloat64(at + 0x18, true),
    ticksPerInch: view.getInt32(at + 0x20, true),
    ticksPerLabel: view.getInt32(at + 0x24, true),
    showLabels: view.getInt32(at + 0x88, true) !== 0 || view.getInt32(at + 0x8c, true) !== 0,
  };
}

function readItem(payload: Uint8Array, view: DataView, e: number): GraphItem {
  const code = view.getInt32(e - 0x20, true);
  const condition = readString(payload, e - 0x40, 16);
  const colour = view.getInt32(e - 0x14, true);
  const width = view.getInt32(e - 0x08, true);
  const domain = { min: readString(payload, e - 0x80, 16), max: readString(payload, e - 0x60, 16) };
  const point = (at: number): GraphPointRecord => ({
    x: readString(payload, at, 16),
    y: readString(payload, at + 0x20, 16),
    marker: view.getInt16(at + 0x60, true),
    labelStyle: view.getInt16(at + 0x64, true),
  });
  switch (code) {
    case 0:
      return { type: 'function', expression: readString(payload, e, 256), domain, condition, colour, width };
    case 1:
      return { type: 'relation-y', expression: readString(payload, e, 256), domain, condition, colour, width };
    case 6:
      return { type: 'point', ...point(e), condition, colour };
    case 7:
      return { type: 'segment', from: point(e), to: point(e + 0xc4), condition, colour, width };
    case 12:
      return { type: 'text', text: readString(payload, e, 32), x: readString(payload, e + 0x98, 16), y: readString(payload, e + 0xb8, 16), condition, colour };
    default:
      return { type: 'other', code, strings: [readString(payload, e, 16), readString(payload, e + 4, 16)] };
  }
}

// Frame record: width and height in twips minus one, consecutive int32s, within 2 KB before
// the object. Only whole 1/40-inch sizes are accepted, which is what ExamView's dialog produces.
function findFrame(view: DataView, offset: number): GraphObject['frame'] {
  for (let distance = 4; distance < 0x800 && offset - distance >= 0; distance += 1) {
    const width = view.getInt32(offset - distance, true);
    const height = view.getInt32(offset - distance + 4, true);
    if (isFrameSize(width) && isFrameSize(height)) return { width: (width + 1) / 1440, height: (height + 1) / 1440 };
  }
  return undefined;
}

function isFrameSize(twips: number): boolean {
  return twips >= 700 && twips <= 12000 && (twips + 1) % 36 === 0;
}

function readString(payload: Uint8Array, at: number, maxChars: number): string {
  const decoded = UTF16.decode(payload.subarray(at, at + maxChars * 2));
  const end = decoded.indexOf('\u0000');
  return (end >= 0 ? decoded.slice(0, end) : decoded).trim();
}

function latin1(bytes: Uint8Array): string {
  let output = '';
  for (let index = 0; index < bytes.length; index += 8192) output += String.fromCharCode(...bytes.subarray(index, index + 8192));
  return output;
}
