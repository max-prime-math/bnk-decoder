// Turn ExamView graph objects (packages/bnk-core/src/graphs.ts) into test-generator graph
// templates: Math Graph documents whose numbers and expressions refer to the algorithm
// variables, redrawn by test-generator whenever it calculates new values.
//
// Each template replaces one printed picture. Before a template is trusted, its curves and
// points are drawn with the stored sample values and projected onto that picture: they must
// land on its ink, which confirms both the decoding (ranges, expressions) and which picture
// it belongs to.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

// Mathpix page crops are 254 px per inch (10 px per mm).
export const CROP_PIXELS_PER_INCH = 254;
const COLOURS = { 1: '#000000', 2: '#0000ff', 6: '#ff0000' };
const SUPPORTED_FUNCTIONS = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'sqrt', 'abs', 'exp', 'ln', 'log']);
const MIN_MATCH = 0.7;

// Order of a question's graph objects in the BNK: stem, then choices laid out in two
// columns and stored row by row (A, C, B, D), then the rest. Returns picture names in
// the same order as the graphs.
export function picturesInGraphOrder(question) {
  const refs = (text) => [...(text ?? '').matchAll(/\/imgs\/([\w-]+)/g)].map((match) => match[1]);
  const choices = (question.content.choices ?? []).map((choice) => refs(choice.body.text));
  const columnOrder = choices.length === 4 ? [0, 2, 1, 3] : choices.map((_, index) => index);
  return [
    ...refs(question.content.stem?.text),
    ...columnOrder.flatMap((index) => choices[index] ?? []),
    ...refs(question.content.solution?.text),
  ];
}

/** Variables a graph uses (so their definitions are kept). */
export function graphIdentifiers(graph) {
  const strings = [graph.view[0], graph.view[1]];
  for (const item of graph.items) {
    if (item.type === 'function') strings.push(item.expression, item.domain.min, item.domain.max, item.condition);
    // x = f(y): y is the curve's own variable.
    if (item.type === 'relation-y') strings.push(item.expression.replace(/\by\b/g, ''), item.domain.min, item.domain.max, item.condition);
    if (item.type === 'other') strings.push(...item.strings);
    if (item.type === 'point') strings.push(item.x, item.y, item.condition);
    if (item.type === 'segment') strings.push(item.from.x, item.from.y, item.to.x, item.to.y, item.condition);
    if (item.type === 'text') strings.push(item.x, item.y, item.condition);
  }
  return [...new Set(strings.join(' ').match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [])]
    .filter((name) => !['x', 'pi', 'inf', ...SUPPORTED_FUNCTIONS].includes(name));
}

/**
 * Build a Math Graph template. Returns { graph } or { error } when the graph uses something
 * Math Graph can't draw. `frame` is the view size in inches.
 */
export function buildGraphTemplate(graph, frame) {
  const unsupported = graph.items.find((item) => !['function', 'point', 'segment', 'text'].includes(item.type));
  const kind = { 'relation-y': 'an x = f(y) curve' }[unsupported?.type] ?? (unsupported?.type === 'other' ? `an ExamView type-${unsupported.code} object (circle, number-line ray, ...)` : `a ${unsupported?.type}`);
  if (unsupported) return { error: `its graph has ${kind}, which Math Graph can't draw` };
  for (const item of graph.items.filter((entry) => entry.type === 'function')) {
    const functions = [...item.expression.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1]);
    const bad = functions.find((name) => !SUPPORTED_FUNCTIONS.has(name));
    if (bad) return { error: `its graph uses ${bad}(), which Math Graph can't draw` };
  }

  const expression = (text, fallback) => (text === '' || text === undefined ? fallback : /^-?\d+(\.\d+)?$/.test(text) ? Number(text) : text);
  const centre = [expression(graph.view[0], 0), expression(graph.view[1], 0)];
  const axis = (which, inches, index) => {
    const { scale, ticksPerInch } = graph.axes[which];
    // ExamView's axes reach the frame edge; its grid stops about one tick inside.
    const half = (inches * ticksPerInch * scale) / 2 - scale;
    const c = centre[index];
    return typeof c === 'number'
      ? [c - half, c + half]
      : [`(${c}) - ${half}`, `(${c}) + ${half}`];
  };
  const [xmin, xmax] = axis('x', frame.width, 0);
  const [ymin, ymax] = axis('y', frame.height, 1);


  const objects = [];
  const points = [];
  let pointNumber = 0;
  const safeDomain = (domain) => {
    let min = expression(domain.min, null), max = expression(domain.max, null);
    const open = (value) => value === null || /^[+-]?inf$/i.test(String(value));
    if (!open(min) && !open(max)) {
      if (typeof min === 'number' && typeof max === 'number') {
        if (min >= max) min = max - 0.000001;
      } else {
        // TestGen validates function domains even for a currently hidden conditional arc.
        // ExamView stores reversed or zero-width bounds for those inactive pieces, so make
        // the lower bound harmless without changing any already-valid visible interval.
        min = `min((${min}),(${max})-0.000001)`;
      }
    }
    return { min, max };
  };
  const addPoint = (id, record, colour, condition) => {
    pointNumber += 1;
    const object = {
      id, type: 'point', name: `P${pointNumber}`, x: expression(record.x, 0), y: expression(record.y, 0),
      label: { text: record.labelStyle === 1 ? `({${record.x}}, {${record.y}})` : '', math: false },
      open: record.marker === 2, color: COLOURS[colour] ?? '#000000', width: 0.8, dashed: false, visible: true,
      ...(condition ? { visibleIf: condition } : {}),
    };
    objects.push(object);
    points.push(object);
    return object;
  };
  graph.items.forEach((item, index) => {
    const condition = item.condition || undefined;
    if (item.type === 'function') {
      const domain = safeDomain(item.domain);
      objects.push({
        id: `f${index}`, type: 'function', expression: item.expression,
        min: domain.min, max: domain.max,
        color: COLOURS[item.colour] ?? '#000000', width: item.width >= 600 ? 1.4 : 0.8, dashed: false, visible: true, exitArrows: false,
        ...(condition ? { visibleIf: condition } : {}),
      });
    } else if (item.type === 'point') {
      addPoint(`p${index}`, item, item.colour, condition);
    } else if (item.type === 'segment') {
      const from = addPoint(`s${index}a`, item.from, 1, condition);
      const to = addPoint(`s${index}b`, item.to, 1, condition);
      objects.push({ id: `s${index}`, type: 'segment', from: from.id, to: to.id, color: COLOURS[item.colour] ?? '#000000', width: 0.8, dashed: false, visible: true, ...(condition ? { visibleIf: condition } : {}) });
    }
  });
  // Text labels ("A") sit next to a point in ExamView; Math Graph labels points, so attach each
  // text to the point its position expression refers to.
  for (const item of graph.items.filter((entry) => entry.type === 'text')) {
    const target = points.find((point) => typeof point.x === 'string' && item.x.startsWith(point.x) && typeof point.y === 'string' && item.y.startsWith(point.y))
      ?? points.find((point) => String(point.x) === item.x.replace(/[-+][\d.]+$/, '') && String(point.y) === item.y.replace(/[-+][\d.]+$/, ''));
    if (!target) return { error: `its graph has free text ("${item.text}") that Math Graph can't place` };
    target.label = { ...target.label, text: `${item.text} ${target.label.text}`.trim() };
  }

  return {
    graph: {
      version: 1,
      settings: {
        appearance: 'worksheet', tickLabels: graph.axes.x.showLabels || graph.axes.y.showLabels ? 'all' : 'none',
        xlabelEvery: Math.max(1, graph.axes.x.ticksPerLabel), ylabelEvery: Math.max(1, graph.axes.y.ticksPerLabel),
        samples: 400, angles: 'radians',
        // Test Generator widens the window to keep roots and asymptotes in view and labels them.
        showFeatures: true,
        xmin, xmax, ymin, ymax,
        xtick: graph.axes.x.scale, ytick: graph.axes.y.scale,
        grid: true, equal: false,
        // Math Graph accepts physical dimensions from 2 to 40 cm. Some ExamView answer
        // choices are slightly smaller than 2 cm, so clamp only the rendered canvas size;
        // the decoded coordinate window above still uses the exact native frame.
        width: Math.min(40, Math.max(2, round(frame.width * 2.54))),
        height: Math.min(40, Math.max(2, round(frame.height * 2.54))),
        xlabel: { text: graph.axes.x.label || 'x', math: true }, ylabel: { text: graph.axes.y.label || 'y', math: true },
      },
      objects,
    },
  };
}

const round = (value) => Math.round(value * 1000) / 1000;

/** Width and height of a PNG or JPEG. */
export function imageSize(path) {
  const bytes = readFileSync(path);
  if (bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) && bytes.length >= 24) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  for (let index = 2; index < bytes.length;) {
    if (bytes[index] !== 0xff) return undefined;
    const marker = bytes[index + 1];
    const length = bytes.readUInt16BE(index + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: bytes.readUInt16BE(index + 5), width: bytes.readUInt16BE(index + 7) };
    }
    index += 2 + length;
  }
  return undefined;
}

// Retained for callers outside this repository that used the old name.
export const jpegSize = imageSize;

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/** Decode the 8-bit, non-interlaced PNGs produced by ExamView's native export. */
function pngGray(bytes) {
  if (!bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return undefined;
  let width, height, bitDepth, colorType, interlace;
  const compressed = [], palette = [], transparency = [];
  for (let at = 8; at + 12 <= bytes.length;) {
    const length = bytes.readUInt32BE(at);
    const type = bytes.toString('ascii', at + 4, at + 8);
    const data = bytes.subarray(at + 8, at + 8 + length);
    if (at + 12 + length > bytes.length) return undefined;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'IDAT') compressed.push(data);
    else if (type === 'PLTE') for (let i = 0; i + 2 < data.length; i += 3) palette.push([data[i], data[i + 1], data[i + 2]]);
    else if (type === 'tRNS') transparency.push(...data);
    at += 12 + length;
    if (type === 'IEND') break;
  }
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!width || !height || bitDepth !== 8 || interlace !== 0 || !channels || !compressed.length) return undefined;
  const packed = inflateSync(Buffer.concat(compressed));
  const stride = width * channels;
  if (packed.length !== height * (stride + 1)) return undefined;
  const decoded = Buffer.alloc(height * stride);
  let source = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = packed[source++];
    for (let x = 0; x < stride; x += 1) {
      const value = packed[source++];
      const index = y * stride + x;
      const left = x >= channels ? decoded[index - channels] : 0;
      const up = y ? decoded[index - stride] : 0;
      const upperLeft = y && x >= channels ? decoded[index - stride - channels] : 0;
      const predictor = filter === 0 ? 0
        : filter === 1 ? left
          : filter === 2 ? up
            : filter === 3 ? Math.floor((left + up) / 2)
              : filter === 4 ? paeth(left, up, upperLeft)
                : undefined;
      if (predictor === undefined) return undefined;
      decoded[index] = (value + predictor) & 0xff;
    }
  }
  const pixels = Buffer.alloc(width * height);
  for (let i = 0, out = 0; out < pixels.length; i += channels, out += 1) {
    let r, g, b, alpha = 255;
    if (colorType === 0 || colorType === 4) {
      r = g = b = decoded[i];
      if (colorType === 4) alpha = decoded[i + 1];
    } else if (colorType === 3) {
      [r, g, b] = palette[decoded[i]] ?? [255, 255, 255];
      alpha = transparency[decoded[i]] ?? 255;
    } else {
      r = decoded[i]; g = decoded[i + 1]; b = decoded[i + 2];
      if (colorType === 6) alpha = decoded[i + 3];
    }
    const gray = Math.round((299 * r + 587 * g + 114 * b) / 1000);
    pixels[out] = Math.round((gray * alpha + 255 * (255 - alpha)) / 255);
  }
  return { width, height, pixels };
}

const grayCache = new Map();
function grayPixels(path) {
  if (grayCache.has(path)) return grayCache.get(path);
  const bytes = readFileSync(path);
  const png = pngGray(bytes);
  if (png) {
    if (grayCache.size >= 128) grayCache.clear();
    grayCache.set(path, png);
    return png;
  }
  const size = imageSize(path);
  if (!size) return undefined;
  const raw = spawnSync('magick', [path, '-colorspace', 'gray', '-depth', '8', 'gray:-'], { maxBuffer: 64 * 1024 * 1024 });
  if (raw.status === 0 && raw.stdout.length === size.width * size.height) {
    const result = { ...size, pixels: raw.stdout };
    if (grayCache.size >= 128) grayCache.clear();
    grayCache.set(path, result);
    return result;
  }
  const helper = resolve(dirname(fileURLToPath(import.meta.url)), 'decode-image-gray.mjs');
  const decoded = spawnSync(process.execPath, [helper, path], { maxBuffer: 64 * 1024 * 1024 });
  if (decoded.status !== 0 || decoded.stdout.length < 8) return undefined;
  const width = decoded.stdout.readUInt32BE(0), height = decoded.stdout.readUInt32BE(4);
  const pixels = decoded.stdout.subarray(8);
  const result = width && height && pixels.length === width * height ? { width, height, pixels } : undefined;
  if (result) {
    if (grayCache.size >= 128) grayCache.clear();
    grayCache.set(path, result);
  }
  return result;
}

/**
 * Fraction of the graph's sampled curve and point positions (with the sample values) that land
 * on ink in the picture. Native PNGs are decoded locally; other formats use ImageMagick.
 */
export function matchPicture(graph, values, picturePath, frame) {
  const decoded = grayPixels(picturePath);
  if (!decoded) return undefined;
  const { width: W, height: H, pixels } = decoded;
  const evaluate = (text, x = 0) => {
    if (text === undefined || text === '' || /^[+-]?inf$/i.test(text)) return NaN;
    const js = text
      .replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (token) => (token === 'x' || !values.has(token) ? token : `(${values.get(token)})`))
      .replace(/\^/g, '**')
      .replace(/\b(sqrt|abs|sin|cos|tan|exp)\(/g, 'Math.$1(').replace(/\blog\(/g, 'Math.log10(').replace(/\bln\(/g, 'Math.log(')
      .replace(/\bsec\(/g, '1/Math.cos(').replace(/\bcsc\(/g, '1/Math.sin(').replace(/\bcot\(/g, '1/Math.tan(')
      .replace(/\bpi\b/g, 'Math.PI');
    try { return Number(Function('x', `return (${js});`)(x)); } catch { return NaN; }
  };
  const cx = evaluate(graph.view[0]) || 0;
  const cy = evaluate(graph.view[1]) || 0;
  const hx = (frame.width * graph.axes.x.ticksPerInch * graph.axes.x.scale) / 2;
  const hy = (frame.height * graph.axes.y.ticksPerInch * graph.axes.y.scale) / 2;
  const toX = (x) => ((x - (cx - hx)) / (2 * hx)) * W;
  const toY = (y) => (((cy + hy) - y) / (2 * hy)) * H;
  const axisX = toX(0);
  const axisY = toY(0);
  const inked = (px, py, radius) => {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = Math.round(px) + dx;
        const y = Math.round(py) + dy;
        if (x >= 0 && y >= 0 && x < W && y < H && pixels[y * W + x] < 110) return true;
      }
    }
    return false;
  };
  let hits = 0;
  let total = 0;
  const visible = (condition) => !condition || Boolean(evaluate(condition));
  for (const item of graph.items) {
    if (item.type === 'function' && visible(item.condition)) {
      const lo = evaluate(item.domain.min);
      const hi = evaluate(item.domain.max);
      for (let k = 0; k <= 400; k++) {
        const x = cx - hx + (2 * hx * k) / 400;
        if ((Number.isFinite(lo) && x < lo) || (Number.isFinite(hi) && x > hi)) continue;
        const y = evaluate(item.expression, x);
        const px = toX(x);
        const py = toY(y);
        if (!Number.isFinite(py) || px < 6 || px >= W - 6 || py < 6 || py >= H - 6) continue;
        if (Math.abs(px - axisX) < 5 || Math.abs(py - axisY) < 5) continue;
        total += 1;
        if (inked(px, py, 3)) hits += 1;
      }
    }
    const pointRecords = item.type === 'point' ? [item] : item.type === 'segment' ? [item.from, item.to] : [];
    if (!visible(item.condition)) continue;
    for (const point of pointRecords) {
      const px = toX(evaluate(point.x));
      const py = toY(evaluate(point.y));
      if (!Number.isFinite(px) || !Number.isFinite(py) || px < 6 || px >= W - 6 || py < 6 || py >= H - 6) continue;
      total += 1;
      if (inked(px, py, 4)) hits += 1;
    }
  }
  return total >= 3 ? hits / total : undefined;
}

export { MIN_MATCH };
