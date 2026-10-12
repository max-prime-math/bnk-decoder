// Independent renderer for ExamView v06 graph objects (rich object kind 0 / subtype 9).
//
// The drawing rules follow ExamView 7.5's own graph painter in evpro.exe, recovered with REA
// (Ghidra 12.1.4); function addresses are cited inline. Output is a display list in device
// pixels at 96 dpi — the resolution ExamView uses when it exports graphs as metafiles — which
// is serialized to SVG. scripts/research/compare-graphs.mjs replays ExamView's exported EMF
// metafiles for the same graphs and measures the difference.
//
// Memory layout used by the painter versus the stored (UTF-16, version 5) layout read here:
//   graph header  type +0x858, item count +0x85c, flags +0x860 (bit 0: centred view),
//                 background +0x988 (1 dots, 2 lines), background style +0x98c, colour +0x990
//   view strings  +0x004 centre x, +0x024 centre y, +0x044 left x, +0x064 bottom y
//   axes          +0x868 / +0x8f8, 0x90 bytes each (see readAxis)
//   item          +0x00 domain min, +0x20 domain max, +0x40 display condition, +0x60 code,
//                 +0x64 relation, +0x68 pattern, +0x6c colour, +0x70 shading, +0x78 steps,
//                 +0x7c flags (bit 0 visible), +0x80 type-specific data

import type { NativeGraphObject } from './graphs.ts';
import { evaluate, evaluateNumber, ExpressionError, formatNumber, type Scope, type Value } from './graph-expr.ts';

export type Point = [number, number];
export interface Font { face: string; sizePx: number; bold: boolean; italic: boolean; underline: boolean; colour: string }
export type Prim = ({ clipped?: boolean }) & (
  | { t: 'path'; pts: Point[]; bezier?: boolean; stroke: string; width: number; dash?: number[]; closed?: boolean }
  | { t: 'rect'; x: number; y: number; w: number; h: number; fill: string }
  | { t: 'ellipse'; box: [number, number, number, number]; stroke?: string; width?: number; fill?: string; dash?: number[] }
  | { t: 'region'; polys: Point[][]; shading: number; colour: string; evenOdd?: boolean; clipRect?: [number, number, number, number] }
  | { t: 'dotted'; x1: number; y1: number; x2: number; y2: number; colour: string }
  | { t: 'text'; x: number; y: number; text: string; align: number; font: Font; angle?: number });

export interface RenderedGraph { width: number; height: number; prims: Prim[]; clip: [number, number, number, number]; errors: string[]; warnings: string[] }

// FUN_0059bfc0: ExamView colour index → RGB.
const PALETTE = ['#000000', '#000000', '#0000ff', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#ffff00', '#ffffff', '#000080', '#008000', '#800080', '#800000', '#808000', '#808080', '#c0c0c0'];
export const colourOf = (index: number): string => PALETTE[index] ?? '#000000';
const colourRef = (ref: number): string => '#' + [ref & 255, (ref >> 8) & 255, (ref >> 16) & 255].map((v) => v.toString(16).padStart(2, '0')).join('');

// GDI text-align flags.
export const TA = { LEFT: 0, RIGHT: 2, CENTER: 6, TOP: 0, BOTTOM: 8, BASELINE: 24 };

const DPI = 96;
/** FUN_004df5d0: twips → device pixels, at least 1. */
const px = (twips: number): number => Math.max(1, Math.round((DPI * twips) / 1440));
/** FUN_004ddef0 / FUN_004ddf50 rounding: half away from zero, then truncate. */
const roundGdi = (v: number): number => (v > 0 ? Math.trunc(v + 0.5) : Math.trunc(v - 0.5));
const clampInt = (v: number): number => (v < -2147483648 ? -2147483648 : v > 2147483647 ? 2147483647 : roundGdi(v));

const UTF16 = new TextDecoder('utf-16le');
function str(bytes: Uint8Array, at: number, chars: number): string {
  const s = UTF16.decode(bytes.subarray(at, at + chars * 2));
  const end = s.indexOf('\u0000');
  return end >= 0 ? s.slice(0, end) : s;
}
const i32 = (b: Uint8Array, at: number): number => new DataView(b.buffer, b.byteOffset, b.byteLength).getInt32(at, true);
const i16 = (b: Uint8Array, at: number): number => new DataView(b.buffer, b.byteOffset, b.byteLength).getInt16(at, true);
const f64 = (b: Uint8Array, at: number): number => new DataView(b.buffer, b.byteOffset, b.byteLength).getFloat64(at, true);

/** Stored font record, 0x58 bytes: height, face, pitch/charset/precision, flags, point size, colour. */
function readFont(b: Uint8Array, at: number): Font {
  const flags = i32(b, at + 0x48);
  const points = i16(b, at + 0x50);
  // FUN_004de2b0: lfHeight = -MulDiv(points, dpi, 72).
  return { face: str(b, at + 2, 32) || 'Times New Roman', sizePx: Math.round((points * DPI) / 72), bold: !!(flags & 1), underline: !!(flags & 2), italic: !!(flags & 4), colour: colourRef(i32(b, at + 0x54)) };
}

interface Axis { label: string; scale: number; ticksPerInch: number; ticksPerLabel: number; width: number; colour: number; font: Font; showTicks: boolean; labelTicks: boolean }
function readAxis(raw: Uint8Array): Axis {
  return { label: str(raw, 0, 9), scale: f64(raw, 0x18), ticksPerInch: i32(raw, 0x20), ticksPerLabel: i32(raw, 0x24), width: i32(raw, 0x28), colour: i32(raw, 0x2c), font: readFont(raw, 0x30), showTicks: i32(raw, 0x88) !== 0, labelTicks: i32(raw, 0x8c) !== 0 };
}

interface PointRecord { x: string; y: string; label: string; style: number; labelStyle: number; labelPosition: number; font: Font }
const readPoint = (d: Uint8Array, at: number): PointRecord => ({ x: str(d, at, 16), y: str(d, at + 0x20, 16), label: str(d, at + 0x40, 16), style: i32(d, at + 0x60), labelStyle: i32(d, at + 0x64), labelPosition: i32(d, at + 0x68), font: readFont(d, at + 0x6c) });

/** Approximate GDI advance widths (Times New Roman, em fractions) for overlap tests and text extents. */
const WIDTHS: Record<string, number> = { ' ': 0.25, '.': 0.25, ',': 0.25, '–': 0.5, '-': 0.333, '(': 0.333, ')': 0.333, '/': 0.278, ':': 0.278, i: 0.278, j: 0.278, l: 0.278, t: 0.278, f: 0.333, r: 0.333, I: 0.333, m: 0.778, w: 0.722, M: 0.889, W: 0.944 };
export function textWidth(text: string, font: Font): number {
  let w = 0;
  for (const ch of text) w += Math.max(1, Math.round((WIDTHS[ch] ?? (/[0-9]/.test(ch) ? 0.5 : /[A-Z]/.test(ch) ? 0.667 : 0.5)) * font.sizePx));
  return w;
}
/** GDI tmHeight (ascent + descent) for the font. */
export const textHeight = (font: Font): number => Math.ceil(font.sizePx * 1.15);

/** FUN_004de360: axis tick label text. */
function tickLabel(value: number, scale: number): string {
  let s: string;
  if (scale > 100000 || scale < 0.0001) {
    s = value.toExponential(3).replace(/\.?0+e/, 'e').replace(/e([-+])(\d)$/, 'e$10$2');
    s = s.replace(/e\+?0?/, 'e').replace(/e-0?/, 'e-');
  } else s = formatNumber(Number(value.toPrecision(10)));
  return s.replace(/-/g, '–');
}

export interface GraphContext {
  /** Algorithm variables visible to the question (stored sample values). */
  variables: Map<string, Value>;
}

export function renderGraph(graph: NativeGraphObject, widthTwips: number, heightTwips: number, context: GraphContext): RenderedGraph {
  const errors: string[] = [], warnings: string[] = [];
  const W = Math.round(((widthTwips + 1) * DPI) / 1440), H = Math.round(((heightTwips + 1) * DPI) / 1440);
  const prims: Prim[] = [];
  const raw = graph.raw;
  const type = i32(raw, 0x858), flags = i32(raw, 0x860), background = i32(raw, 0x988), backgroundColour = i32(raw, 0x990);
  const centred = (flags & 1) !== 0;
  if (type !== 0) errors.push(type === 2 ? 'number-line graphs are not yet rendered' : `graph type ${type} (polar) is not yet rendered`);
  const [xAxis, yAxis] = graph.axes.map((axis) => readAxis(axis.raw));

  const bound = new Map<string, Value>();
  const scope: Scope = {
    lookup(name) {
      if (bound.has(name)) return bound.get(name);
      if (context.variables.has(name)) return context.variables.get(name);
      for (const [key, value] of context.variables) if (key.toLowerCase() === name.toLowerCase()) return value;
      return undefined;
    },
  };
  const num = (source: string, fallback?: number): number => {
    if (!source.trim()) {
      if (fallback === undefined) throw new ExpressionError('empty numeric field');
      return fallback;
    }
    return evaluateNumber(source, scope);
  };

  // --- FUN_004dfb30: coordinate system -------------------------------------------------------
  const P: [number, number, number, number] = [1, 1, W - 1, H - 1]; // frame inset by 1 (clip)
  const pen = px(15), u = px(45); // DAT_00652be8 = 3 px at 96 dpi
  const I = [P[0] + 2 * u, P[1] + 2 * u, P[2] - 2 * u, P[3] - 2 * u];
  const pxPerTickX = Math.round((DPI * Math.trunc(1440 / xAxis.ticksPerInch)) / 1440) + (type === 0 ? 0.2 : 0);
  const pxPerTickY = Math.round((DPI * Math.trunc(1440 / yAxis.ticksPerInch)) / 1440);
  const ppuX = pxPerTickX / xAxis.scale, ppuY = pxPerTickY / yAxis.scale;
  const view = graph.viewExpressions.map((s) => s.trim());
  let cx = 0, cy = 0, left = 0, bottom = 0;
  try { [cx, cy, left, bottom] = view.map((s) => num(s, 0)); } catch (error) { errors.push(`graph view: ${(error as Error).message}`); }
  // Non-centred views whose stored left/bottom bound is zero reserve ten drawing units for
  // labels on the corresponding axis. Native MW12 record 4 (3599×3599 twips) records its
  // origin at (37,203): the ordinary 7 px inset plus/minus 10 * DAT_00652be8 (3 px).
  // Retained native EMF coordinates: graph-coordinate-evidence.json / runtime-mw12-r4-zero-bounds.
  if (!centred && left === 0) I[0] += 10 * u;
  if (!centred && bottom === 0) I[3] -= 10 * u;
  const Iw = I[2] - I[0], Ih = I[3] - I[1];
  const xmin = centred ? cx - (Iw / ppuX) * 0.5 : left, xmax = xmin + Iw / ppuX;
  const ymin = centred ? cy - (Ih / ppuY) * 0.5 : bottom, ymax = ymin + Ih / ppuY;
  const ox = Math.trunc(I[0] - xmin * ppuX + (I[0] - xmin * ppuX > 0 ? 0.5 : -0.5)); // DAT_00652c00
  const oy = Math.trunc(I[3] + ymin * ppuY + (I[3] + ymin * ppuY > 0 ? 0.5 : -0.5)); // DAT_00652bf0
  const X = (x: number): number => clampInt(ppuX * x + ox);
  const Y = (y: number): number => clampInt(oy - ppuY * y);
  const clip: [number, number, number, number] = [P[0], P[1], P[2], P[3]];

  // Axis placement. A row/column outside the inner area is pinned (TODO: break marks).
  const tickFontX = { ...xAxis.font, italic: false }, tickFontY = { ...yAxis.font, italic: false };
  const axisRow = Math.min(Math.max(oy, I[1]), I[3]);
  const axisCol = Math.min(Math.max(ox, I[0]), I[2]);
  if (axisRow !== oy || axisCol !== ox) warnings.push('axis origin outside the view; ExamView pins the axis with a break mark (approximated)');
  const stepX = Math.trunc(pxPerTickX), stepY = Math.trunc(pxPerTickY);
  const ticks = (origin: number, step: number, lo: number, hi: number): Array<{ at: number; k: number }> => {
    const out: Array<{ at: number; k: number }> = [];
    if (step <= 0) return out;
    for (let k = 0, at = origin; at >= lo; k--, at -= step) if (at <= hi) out.push({ at, k });
    for (let k = 1, at = origin + step; at <= hi; k++, at += step) if (at >= lo) out.push({ at, k });
    return out.sort((a, b) => a.at - b.at);
  };
  const xTicks = ticks(ox, stepX, I[0] + 2 * u, I[2] - 2 * u);
  const yTicks = ticks(oy, stepY, I[1] + 2 * u, I[3] - 2 * u).map(({ at, k }) => ({ at, k: -k }));

  // --- FUN_004e28d0: background ---------------------------------------------------------------
  if (xTicks.length && yTicks.length) {
    const [x0, x1] = [xTicks[0].at, xTicks[xTicks.length - 1].at], [y0, y1] = [yTicks[0].at, yTicks[yTicks.length - 1].at];
    const colour = colourOf(backgroundColour);
    if (background === 1) for (const xt of xTicks) for (const yt of yTicks) prims.push({ t: 'rect', x: xt.at, y: yt.at, w: pen, h: pen, fill: colour });
    if (background === 2 && type === 0) {
      for (const xt of xTicks) prims.push({ t: 'dotted', x1: xt.at, y1: y0, x2: xt.at, y2: y1, colour });
      for (const yt of yTicks) prims.push({ t: 'dotted', x1: x0, y1: yt.at, x2: x1, y2: yt.at, colour });
    }
  }

  // --- FUN_004ea390: items, clipped to the plot area ---------------------------------------------
  const items = graph.items;
  const itemsStart = prims.length;
  for (const [index, item] of items.entries()) {
    const d = item.data;
    const [relation, pattern, colourIndex, shading, , steps, itemFlags] = item.styleFields;
    if (!(itemFlags & 1)) continue;
    const label = `graph item ${index + 1} (code ${item.code})`;
    try {
      if (item.condition.trim() && !evaluateNumber(item.condition, scope)) continue;
      const colour = colourOf(colourIndex);
      switch (item.code) {
        case 0: case 1: {
          // FUN_004e7780 (y = f(x)) / FUN_004e7a60 (x = f(y)).
          const ofX = item.code === 0;
          const variable = ofX ? 'x' : 'y';
          const expression = str(d, 0, 0x340);
          const lo = Math.max(num(item.domain.min, -Infinity), ofX ? xmin : ymin);
          const hi = Math.min(num(item.domain.max, Infinity), ofX ? xmax : ymax);
          const n = steps;
          if (!(n > 0) || !(hi >= lo)) break;
          const pts: Point[] = [];
          let previous = lo >= 0 || hi <= 0 ? Infinity : -Infinity;
          for (let k = 0, v = lo; k <= n; k++) {
            const at = v > 0 && previous < 0 ? 0 : v;
            bound.set(variable, at);
            let w: number | undefined;
            try { w = evaluateNumber(expression, scope); } catch (error) { if (!(error instanceof ExpressionError) || /unknown variable|unsupported function|expected|unexpected/.test(error.message)) throw error; }
            bound.delete(variable);
            if (w === undefined || !Number.isFinite(w)) pts.push([UNDEFINED, UNDEFINED]);
            else pts.push(ofX ? [X(at), Y(w)] : [X(w), Y(at)]);
            previous = v;
            v += (hi - lo) / n;
          }
          const style = penStyle(pattern === 0 && relation === 1 || relation === 3 ? 1 : pattern, pen, colour);
          if (relation !== 0) {
            const defined = pts.filter((p) => p[0] !== UNDEFINED);
            if (defined.length) {
              const toward = relation === 3 || relation === 4;
              const poly: Point[] = ofX
                ? [...defined, [defined[defined.length - 1][0], toward ? clip[1] : clip[3]], [defined[0][0], toward ? clip[1] : clip[3]]]
                : [...defined, [toward ? clip[2] : clip[0], defined[defined.length - 1][1]], [toward ? clip[2] : clip[0], defined[0][1]]];
              prims.push({ t: 'region', polys: [poly], shading, colour });
            }
          }
          drawCurve(prims, pts, ofX, clip, { ...style, colour });
          break;
        }
        case 3: {
          // FUN_004e3ed0: circle, radius measured on the x scale.
          const kind = i32(d, 0);
          const r = Math.abs(clampInt(ppuX * num(str(d, 4, 16)) + 0));
          const [ccx, ccy] = kind === 1 ? [X(num(str(d, 0x24, 16))), Y(num(str(d, 0x44, 16)))] : [ox, oy];
          const style = penStyle(pattern === 0 && relation === 1 || relation === 3 ? 1 : pattern, pen, colour);
          if (relation !== 0) warnings.push(`${label}: circle shading approximated`);
          if (relation !== 0) prims.push({ t: 'region', polys: [ellipsePolygon(ccx, ccy, r, r)], shading, colour, evenOdd: relation === 3 || relation === 4, clipRect: clip });
          prims.push({ t: 'ellipse', box: [ccx - r, ccy - r, ccx + r, ccy + r], stroke: colour, width: style.width, dash: style.dash });
          break;
        }
        case 6: {
          const p = readPoint(d, 0);
          drawPoint(prims, p, colour, num(p.x), num(p.y));
          break;
        }
        case 7: {
          // FUN_004e87e0: segment, then both endpoints as points; style 5 endpoints are arrows.
          const a = readPoint(d, 0), b = readPoint(d, 0xc4);
          const ax = num(a.x), ay = num(a.y), bx = num(b.x), by = num(b.y);
          const [x1, y1, x2, y2] = [X(ax), Y(ay), X(bx), Y(by)];
          const style = penStyle(pattern, pen, colour);
          prims.push({ t: 'path', pts: [[x1, y1], [x2, y2]], stroke: colour, width: style.width, dash: style.dash });
          drawPoint(prims, a, colour, ax, ay);
          drawPoint(prims, b, colour, bx, by);
          if (x1 === x2 && y1 === y2) break;
          const angle = Math.atan2(y1 - y2, x2 - x1);
          if (a.style === 5) arrow(prims, x1, y1, angle, colour, pen);
          if (b.style === 5) arrow(prims, x2, y2, angle + Math.PI, colour, pen);
          break;
        }
        case 12: {
          // FUN_004e1490 / FUN_004de5b0: text centred on (x, y), rotated counter-clockwise.
          const textSource = str(d, 0, 32);
          const text = textValue(textSource, scope);
          const font = readFont(d, 0x40);
          const x = num(str(d, 0x98, 16)), y = num(str(d, 0xb8, 16)), angle = num(str(d, 0xd8, 16), 0);
          const h = textHeight(font);
          const rad = (-angle * Math.PI) / 180;
          // ExtTextOut(x - round(sin·h/2), y - round(cos·h/2)) with TA_CENTER|TA_TOP.
          const tx = X(x) - Math.trunc(Math.sin(-rad) * (h / 2)), ty = Y(y) - Math.trunc(Math.cos(rad) * (h / 2));
          prims.push({ t: 'text', x: tx, y: ty, text, align: TA.CENTER | TA.TOP, font, angle });
          break;
        }
        default:
          errors.push(`${label}: item type not yet rendered`);
      }
    } catch (error) {
      errors.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (let i = itemsStart; i < prims.length; i++) prims[i].clipped = true;

  // --- FUN_004e2d90: axes, ticks and labels (drawn over the items) ------------------------------
  const ec = (axis: Axis) => (axis.width === 2 ? 2 * u : u);
  if (xAxis.width) {
    const colour = colourOf(xAxis.colour), w = xAxis.width === 2 ? 2 * pen : pen;
    const full = centred || left !== 0;
    prims.push({ t: 'path', pts: [[full ? P[0] + pen + w : axisCol, axisRow], [P[2] - pen - w, axisRow]], stroke: colour, width: w });
    if (xAxis.showTicks) for (const { at } of xTicks) if (at !== ox) prims.push({ t: 'rect', x: at - Math.trunc(w / 2), y: axisRow - Math.trunc(w / 2) - u, w, h: w + 2 * u, fill: colour });
    const e = ec(xAxis);
    if (full) prims.push({ t: 'path', pts: [[P[0] + pen + e, axisRow - e], [P[0] + pen, axisRow], [P[0] + pen + e, axisRow + e]], stroke: colour, width: pen });
    prims.push({ t: 'path', pts: [[P[2] - pen - e, axisRow - e], [P[2] - pen, axisRow], [P[2] - pen - e, axisRow + e]], stroke: colour, width: pen });
  }
  if (yAxis.width) {
    const colour = colourOf(yAxis.colour), w = yAxis.width === 2 ? 2 * pen : pen;
    const full = centred || bottom !== 0;
    prims.push({ t: 'path', pts: [[axisCol, full ? P[3] - w : axisRow], [axisCol, P[1] + w]], stroke: colour, width: w });
    if (yAxis.showTicks) for (const { at } of yTicks) if (at !== oy) prims.push({ t: 'rect', x: axisCol - Math.trunc(w / 2) - u, y: at - Math.trunc(w / 2), w: w + 2 * u, h: w, fill: colour });
    const e = ec(yAxis);
    prims.push({ t: 'path', pts: [[axisCol - e, P[1] + e], [axisCol, P[1]], [axisCol + e, P[1] + e]], stroke: colour, width: pen });
    if (full) prims.push({ t: 'path', pts: [[axisCol - e, P[3] - pen - e], [axisCol, P[3] - pen], [axisCol + e, P[3] - pen - e]], stroke: colour, width: pen });
  }
  const xNameWidth = xAxis.label ? textWidth(xAxis.label, xAxis.font) : 0;
  if (xAxis.labelTicks) {
    for (const { at, k } of xTicks) {
      if (k === 0 || k % xAxis.ticksPerLabel !== 0) continue;
      const text = tickLabel(k * xAxis.scale, xAxis.scale);
      if (Math.trunc(textWidth(text, tickFontX) / 2) + at >= P[2] - (xNameWidth + 2 * u)) continue;
      prims.push({ t: 'text', x: at, y: axisRow + 2 * u, text, align: TA.CENTER | TA.TOP, font: tickFontX });
    }
  }
  if (xAxis.label) prims.push({ t: 'text', x: P[2], y: axisRow + 2 * u, text: xAxis.label, align: TA.RIGHT | TA.TOP, font: xAxis.font });
  if (type === 0) {
    if (yAxis.labelTicks) {
      for (const { at, k } of yTicks) {
        if (at === axisRow || k === 0 || k % yAxis.ticksPerLabel !== 0) continue;
        prims.push({ t: 'text', x: axisCol - 2 * u, y: at - Math.trunc(textHeight(tickFontY) / 2), text: tickLabel(k * yAxis.scale, yAxis.scale), align: TA.RIGHT | TA.TOP, font: tickFontY });
      }
    }
    if (yAxis.label) prims.push({ t: 'text', x: axisCol + 2 * ec(yAxis), y: P[1], text: yAxis.label, align: TA.LEFT | TA.TOP, font: yAxis.font });
  }

  // --- point helper (FUN_004e80b0) ------------------------------------------------------------
  function drawPoint(out: Prim[], p: PointRecord, colour: string, x: number, y: number): void {
    const X0 = X(x), Y0 = Y(y);
    const r = u; // marker radius
    if (p.style === 1 || p.style === 2) out.push({ t: 'ellipse', box: [X0 - r, Y0 - r, X0 + r, Y0 + r], stroke: colour, width: pen, fill: p.style === 1 ? colour : '#ffffff' });
    let text = '';
    if (p.labelStyle === 1) text = `(${tickLabel(x, xAxis.scale)}, ${tickLabel(y, yAxis.scale)})`;
    else if (p.labelStyle === 2) text = textValue(p.label, scope);
    if (!text) return;
    const h = textHeight(p.font);
    let tx = X0, ty = Y0, align = 10;
    switch (p.labelPosition) {
      case 1: ty -= u + r; align = 14; break;
      case 2: tx += r; ty -= r; align = 8; break;
      case 3: tx += u + r; ty += Math.trunc(h / 2); align = 8; break;
      case 4: tx += r; ty += r; align = 0; break;
      case 5: ty += r + u; align = 6; break;
      case 6: tx -= r; ty += r; align = 2; break;
      case 7: tx -= u + r; ty += Math.trunc(h / 2); align = 10; break;
      default: tx -= r; ty -= r; align = 10;
    }
    out.push({ t: 'text', x: tx, y: ty, text, align, font: p.font });
  }

  if (prims.some((p) => p.t === 'text')) warnings.push('font advance widths and baselines are approximated; native text placement is not verified');
  return { width: W, height: H, prims, clip, errors, warnings };
}

/** Text-box and label strings: quoted literals or str() expressions are evaluated, plain text kept. */
function textValue(source: string, scope: Scope): string {
  if (!/["()+]/.test(source)) {
    const value = scope.lookup(source.trim());
    return value === undefined ? source : typeof value === 'number' ? formatNumber(value) : value;
  }
  try {
    const value = evaluate(source, scope);
    return typeof value === 'number' ? formatNumber(value) : value;
  } catch {
    return source;
  }
}

const UNDEFINED = -0x7fffffff;

interface PenStyle { width: number; dash?: number[] }
/** FUN_004e1ee0 / FUN_004de0b0: item pattern → pen. 5 is a doubled-width solid line. */
function penStyle(pattern: number, width: number, _colour: string): PenStyle {
  const unit = px(45);
  switch (pattern) {
    case 1: return { width, dash: [unit, unit] };
    case 2: return { width, dash: [unit * 3, unit, unit, unit, unit, unit] };
    case 3: return { width, dash: [unit * 3, unit * 2, unit, unit * 2] };
    case 4: return { width, dash: [unit * 6, unit * 2] };
    case 5: return { width: width * 2 };
    default: return { width };
  }
}

/** FUN_004e73c0 + FUN_004e1d40: split runs at undefined samples and asymptote jumps, then draw. */
function drawCurve(out: Prim[], input: Point[], ofX: boolean, clip: [number, number, number, number], style: PenStyle & { colour: string }): void {
  const pts = input.map((p) => (p[0] === UNDEFINED ? p : [Math.max(-30000, Math.min(30000, p[0])), Math.max(-30000, Math.min(30000, p[1]))] as Point));
  const outside = input.some((p) => p[0] !== UNDEFINED && (ofX ? p[1] < clip[1] || p[1] > clip[3] : p[0] < clip[0] || p[0] > clip[2]));
  let run: Point[] = [];
  const flush = () => { if (run.length) emitRun(out, run, ofX, style); run = []; };
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (p[0] === UNDEFINED) { flush(); continue; }
    if (outside && run.length > 1) {
      const a = run[run.length - 2], b = run[run.length - 1];
      const turn = ofX ? (b[1] - a[1]) * (p[1] - b[1]) : (b[0] - a[0]) * (p[0] - b[0]);
      if (turn < -5000) { flush(); }
    }
    run.push(p);
  }
  flush();
}

function emitRun(out: Prim[], run: Point[], ofX: boolean, style: PenStyle & { colour: string }): void {
  const currentStroke = style.colour;
  if (isStraight(run, ofX)) {
    out.push({ t: 'path', pts: [run[0], run[run.length - 1]], stroke: currentStroke, width: style.width, dash: style.dash });
    return;
  }
  let count = Math.trunc(run.length / 3) * 3 + 1;
  if (run.length < count) count -= 3;
  if (count >= 4) out.push({ t: 'path', pts: run.slice(0, count), bezier: true, stroke: currentStroke, width: style.width, dash: style.dash });
  else count = 0;
  if (count < run.length) out.push({ t: 'path', pts: run.slice(Math.max(0, count - 1)), stroke: currentStroke, width: style.width, dash: style.dash });
}

/** FUN_004de720: a run whose interior stays within 2 px of the chord is drawn as one line. */
function isStraight(p: Point[], ofX: boolean): boolean {
  const n = p.length;
  if (n < 2) return false;
  if (n === 2) return true;
  const [x0, y0] = p[0], [xn, yn] = p[n - 1];
  if (ofX) {
    if (p.every((q) => q[0] === x0)) return true;
    if (yn === y0) return false;
    for (let i = 1; i < n - 2; i++) if (Math.abs((p[i][1] - y0) * ((xn - x0) / (yn - y0)) + x0 - p[i][0]) > 2) return false;
    return true;
  }
  if (p.every((q) => q[1] === y0)) return true;
  if (xn === x0) return false;
  for (let i = 1; i < n - 2; i++) if (Math.abs((p[i][0] - x0) * ((yn - y0) / (xn - x0)) + y0 - p[i][1]) > 2) return false;
  return true;
}

function ellipsePolygon(cx: number, cy: number, rx: number, ry: number): Point[] {
  return Array.from({ length: 72 }, (_, k) => [cx + rx * Math.cos((k * Math.PI) / 36), cy + ry * Math.sin((k * Math.PI) / 36)] as Point);
}

/** FUN_004e2200 (metafile branch): two strokes at ±135° from the direction. */
function arrow(out: Prim[], x: number, y: number, angle: number, colour: string, pen: number): void {
  const len = px(45) * 2;
  for (const turn of [2.356194490192345, 3.9269908169872414]) {
    const a = angle + turn;
    out.push({ t: 'path', pts: [[x, y], [x + Math.trunc(Math.cos(a) * len), y - Math.trunc(Math.sin(a) * len)]], stroke: colour, width: pen });
  }
}


// --- SVG serialization ---------------------------------------------------------------------------

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** GDI hatch / mono pattern brushes (FUN_004defb0) as 8×8 SVG patterns; bit 0 = ink. */
const SHADING_ROWS: Record<number, number[]> = {
  0: [0x55, 0xff, 0x55, 0xff, 0x55, 0xff, 0x55, 0xff],
  1: [0x77, 0xff, 0xff, 0xff, 0x77, 0xff, 0xff, 0xff],
  2: [0x77, 0x77, 0x77, 0x77, 0x77, 0x77, 0x77, 0x77],
  3: [0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff],
  4: [0x77, 0xbb, 0xdd, 0xee, 0x77, 0xbb, 0xdd, 0xee],
  5: [0xee, 0xdd, 0xbb, 0x77, 0xee, 0xdd, 0xbb, 0x77],
};

/** Serialize only a supported drawing by default. Partial previews require an explicit opt-in. */
export function graphToSvg(g: RenderedGraph, widthIn: number, heightIn: number, options: { allowPartialPreview?: boolean } = {}): string {
  if (!options.allowPartialPreview && (g.errors.length || g.warnings.length)) {
    throw new Error(`Graph SVG is incomplete or approximate: ${[...g.errors, ...g.warnings].join('; ')}`);
  }
  if (![widthIn, heightIn, g.width, g.height].every((v) => Number.isFinite(v) && v > 0)) throw new Error('Graph SVG dimensions must be positive finite numbers');
  const defs: string[] = [];
  const body: string[] = [];
  const patterns = new Map<string, string>();
  const patternFor = (shading: number, colour: string): string => {
    const key = `${shading}${colour}`;
    let id = patterns.get(key);
    if (id) return id;
    id = `s${patterns.size}`;
    patterns.set(key, id);
    const rows = SHADING_ROWS[shading];
    if (!rows) throw new Error(`Unsupported graph shading pattern ${shading}`);
    const cells: string[] = [];
    rows.forEach((bits, y) => { for (let x = 0; x < 8; x++) if (!((bits >> (7 - x)) & 1)) cells.push(`M${x} ${y}h1v1h-1z`); });
    defs.push(`<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><path d="${cells.join('')}" fill="${colour}"/></pattern>`);
    return id;
  };
  const [cl, ct, cr, cb] = g.clip;
  defs.push(`<clipPath id="plot"><rect x="${cl}" y="${ct}" width="${cr - cl}" height="${cb - ct}"/></clipPath>`);
  const line = (pts: Point[], bezier: boolean | undefined, width: number) => {
    const o = width % 2 ? 0.5 : 0;
    const f = (p: Point) => `${p[0] + o} ${p[1] + o}`;
    if (!bezier) return `M${pts.map(f).join('L')}`;
    let d = `M${f(pts[0])}`;
    for (let i = 1; i + 2 < pts.length; i += 3) d += `C${f(pts[i])} ${f(pts[i + 1])} ${f(pts[i + 2])}`;
    return d;
  };
  let inClip = false;
  for (const p of g.prims) {
    if (!!p.clipped !== inClip) { body.push(inClip ? '</g>' : '<g clip-path="url(#plot)">'); inClip = !inClip; }
    switch (p.t) {
      case 'path':
        body.push(`<path d="${line(p.pts, p.bezier, p.width)}" fill="none" stroke="${p.stroke}" stroke-width="${p.width}"${p.dash ? ` stroke-dasharray="${p.dash.join(' ')}"` : ''} stroke-linecap="square"/>`);
        break;
      case 'rect': body.push(`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${p.fill}"/>`); break;
      case 'ellipse': {
        const [x0, y0, x1, y1] = p.box;
        const o = (p.width ?? 1) % 2 ? 0.5 : 0;
        body.push(`<ellipse cx="${(x0 + x1) / 2}" cy="${(y0 + y1) / 2}" rx="${(x1 - x0) / 2 - o}" ry="${(y1 - y0) / 2 - o}" fill="${p.fill ?? 'none'}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.width ?? 1}"` : ''}${p.dash ? ` stroke-dasharray="${p.dash.join(' ')}"` : ''}/>`);
        break;
      }
      case 'region': {
        const fill = p.shading === 6 ? p.colour : `url(#${patternFor(p.shading, p.colour)})`;
        let d = p.polys.map((poly) => `M${poly.map((q) => `${q[0]} ${q[1]}`).join('L')}Z`).join('');
        if (p.evenOdd && p.clipRect) { const [a, b, c, e] = p.clipRect; d = `M${a} ${b}H${c}V${e}H${a}Z` + d; }
        body.push(`<path d="${d}" fill="${fill}" fill-rule="evenodd"/>`);
        break;
      }
      case 'dotted': {
        const horizontal = p.y1 === p.y2;
        body.push(`<path d="M${p.x1 + (horizontal ? 0 : 0.5)} ${p.y1 + (horizontal ? 0.5 : 0)}L${p.x2 + (horizontal ? 1 : 0.5)} ${p.y2 + (horizontal ? 0.5 : 1)}" stroke="${p.colour}" stroke-width="1" stroke-dasharray="1 1"/>`);
        break;
      }
      case 'text': {
        const anchor = (p.align & 6) === 6 ? 'middle' : (p.align & 2) ? 'end' : 'start';
        const h = textHeight(p.font);
        const ascent = Math.round(p.font.sizePx * 0.891);
        const valign = p.align & 24;
        const dy = valign === 24 ? 0 : valign === 8 ? -(h - ascent) : ascent;
        const style = `font-family="${esc(p.font.face)}, Times New Roman, serif" font-size="${p.font.sizePx}"${p.font.italic ? ' font-style="italic"' : ''}${p.font.bold ? ' font-weight="bold"' : ''}${p.font.underline ? ' text-decoration="underline"' : ''}`;
        const rotate = p.angle ? ` transform="rotate(${-p.angle} ${p.x} ${p.y})"` : '';
        body.push(`<text x="${p.x}" y="${p.y + dy}" text-anchor="${anchor}" fill="${p.font.colour}" ${style}${rotate} xml:space="preserve">${esc(p.text)}</text>`);
        break;
      }
    }
  }
  if (inClip) body.push('</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthIn}in" height="${heightIn}in" viewBox="0 0 ${g.width} ${g.height}"><defs>${defs.join('')}</defs>${body.join('')}</svg>`;
}
