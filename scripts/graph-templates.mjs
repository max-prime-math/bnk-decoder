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
      objects.push({
        id: `f${index}`, type: 'function', expression: item.expression,
        min: expression(item.domain.min, null), max: expression(item.domain.max, null),
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
        width: round(frame.width * 2.54), height: round(frame.height * 2.54),
        xlabel: { text: graph.axes.x.label || 'x', math: true }, ylabel: { text: graph.axes.y.label || 'y', math: true },
      },
      objects,
    },
  };
}

const round = (value) => Math.round(value * 1000) / 1000;

/** Width and height of a JPEG from its SOF marker. */
export function jpegSize(path) {
  const bytes = readFileSync(path);
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

/**
 * Fraction of the graph's sampled curve and point positions (with the sample values) that land
 * on ink in the picture. Needs ImageMagick; returns undefined when it can't measure.
 */
export function matchPicture(graph, values, picturePath, frame) {
  const size = jpegSize(picturePath);
  if (!size) return undefined;
  const raw = spawnSync('magick', [picturePath, '-colorspace', 'gray', '-depth', '8', 'gray:-'], { maxBuffer: 64 * 1024 * 1024 });
  if (raw.status !== 0) return undefined;
  const pixels = raw.stdout;
  const { width: W, height: H } = size;
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
