// Compare the independent graph renderer with ExamView's own drawings of the same graphs.
//
// ExamView's RTF export embeds every graph as an EMF metafile recorded at 96 dpi. This script
// pairs BNK graph objects with those pictures (document order + exact twip size), replays both
// drawings into 1-bit ink masks, and reports per-graph recall/precision (1 px tolerance) and
// tick/label text agreement. Usage:
//   node --experimental-strip-types scripts/research/compare-graphs.mjs [export-dir ...] [--show N] [--json out.json]
import fs from 'node:fs';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { readAlgorithmBlockAt } from '../../packages/bnk-core/src/algorithms.ts';
import { renderGraph } from '../../packages/bnk-core/src/graph-render.ts';
import { rtfPictures } from './rtf-pictures.mjs';
import { emfPrimitives } from './emf-records.mjs';

const ROOT = 'reports/rea-examview';
const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const show = option('--show'), jsonOut = option('--json'), only = option('--only');
const dirs = args.length ? args : fs.readdirSync(ROOT).filter((d) => /^native-(chapter|family)/.test(d) && fs.existsSync(path.join(ROOT, d, 'bank.rtf'))).map((d) => path.join(ROOT, d));

function loadExport(dir) {
  const work = fs.readdirSync(dir).find((d) => d.startsWith('export-work'));
  const bnk = fs.readdirSync(path.join(dir, work)).find((f) => f.toLowerCase().endsWith('.bnk'));
  const payload = inflateSync(fs.readFileSync(path.join(dir, work, bnk)).subarray(16));
  return { payload, bank: readQuestionRecords(payload), pics: rtfPictures(path.join(dir, 'bank.rtf')) };
}

function variablesFor(payload, bank, record) {
  const map = new Map();
  const add = (entries) => { for (const e of entries ?? []) if (e.kind === 'variable' && e.name) map.set(e.name, e.valueType === 'number' ? e.value : e.display ?? e.rawDisplay); };
  const prefixed = (bytes) => { const p = new Uint8Array(bytes.length + 4); new DataView(p.buffer).setInt32(0, p.length, true); p.set(bytes, 4); return readAlgorithmBlockAt(p, 0); };
  const narrative = bank.narratives.find((n) => n.number === record.narrativeId);
  if (narrative) add(prefixed(narrative.algorithmBytes));
  const group = record.groupId !== undefined ? bank.groups.find((g) => g.number === record.groupId) : undefined;
  if (group) add(prefixed(group.algorithmBytes));
  add(readAlgorithmBlockAt(payload, ...record.prefix.algorithm));
  return map;
}

function pairs(bank, pics) {
  const out = [];
  let cursor = 0;
  for (const record of bank.records) for (const block of record.blocks) for (const object of block.objects) {
    if (object.kind !== 'graph') continue;
    let k = cursor;
    while (k < pics.length && !(Math.abs(pics[k].wgoal - object.widthTwips) <= 2 && Math.abs(pics[k].hgoal - object.heightTwips) <= 2)) k++;
    if (k < pics.length) { out.push({ record, object, pic: pics[k] }); cursor = k + 1; } else out.push({ record, object });
  }
  return out;
}

// --- rasterization ------------------------------------------------------------------------------
class Mask {
  constructor(w, h) { this.w = w; this.h = h; this.bits = new Uint8Array(w * h); }
  set(x, y) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.bits[y * this.w + x] = 1; }
  get(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h && this.bits[y * this.w + x] === 1; }
  line(a, b) {
    let [x0, y0] = a.map(Math.round), [x1, y1] = b.map(Math.round);
    if (Math.abs(x0) > 1e5 || Math.abs(y0) > 1e5 || Math.abs(x1) > 1e5 || Math.abs(y1) > 1e5) {
      // clamp far points to keep loops bounded
      const c = (v) => Math.max(-2000, Math.min(2000, v)); [x0, y0, x1, y1] = [c(x0), c(y0), c(x1), c(y1)];
    }
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) { this.set(x0, y0); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
  }
  poly(pts) { for (let i = 1; i < pts.length; i++) this.line(pts[i - 1], pts[i]); }
  bezier(pts) {
    let prev = pts[0];
    for (let i = 1; i + 2 < pts.length; i += 3) {
      const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
      for (let s = 1; s <= 8; s++) {
        const t = s / 8, m = 1 - t;
        const q = [0, 1].map((j) => m * m * m * p0[j] + 3 * m * m * t * p1[j] + 3 * m * t * t * p2[j] + t * t * t * p3[j]);
        this.line(prev, q); prev = q;
      }
    }
  }
  fill(x, y, w, h) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j); }
  ellipse([l, t, r, b]) {
    const cx = (l + r - 1) / 2, cy = (t + b - 1) / 2, rx = (r - l - 1) / 2, ry = (b - t - 1) / 2;
    const n = Math.max(16, Math.ceil(2 * Math.PI * Math.max(rx, ry)));
    const pts = Array.from({ length: n + 1 }, (_, k) => [cx + rx * Math.cos((2 * Math.PI * k) / n), cy + ry * Math.sin((2 * Math.PI * k) / n)]);
    this.poly(pts);
  }
  count() { let n = 0; for (const b of this.bits) n += b; return n; }
}

function emfMask(e, w, h) {
  const m = new Mask(w, h), texts = [];
  for (const x of e.prims) {
    switch (x.t) {
      case 'line': case 'polyline16': case 'polylineto16': m.poly(x.pts); break;
      case 'polybezier16': m.bezier(x.pts); break;
      case 'polygon16': m.poly([...x.pts, x.pts[0]]); break;
      case 'polypolyline16': for (const p of x.polys) m.poly(p); break;
      case 'polypolygon16': for (const p of x.polys) m.poly([...p, p[0]]); break;
      case 'rectangle': { const [l, t, r, b] = x.box; if (x.pen?.stock === 8) m.fill(l, t, Math.max(1, r - l - 1), Math.max(1, b - t - 1)); else m.poly([[l, t], [r - 1, t], [r - 1, b - 1], [l, b - 1], [l, t]]); break; }
      case 'blt': { const [bx, by, bw, bh] = x.box; m.fill(bx, by, bw, bh); break; }
      case 'ellipse': m.ellipse(x.box); break;
      case 'text': texts.push({ text: x.text, x: x.at[0], y: x.at[1], align: x.align }); break;
    }
  }
  return { mask: m, texts };
}

function ourMask(g) {
  const m = new Mask(g.width, g.height), texts = [];
  const [cl, ct, cr, cb] = g.clip;
  for (const p of g.prims) {
    const target = p.clipped ? clipMask(m, cl, ct, cr, cb) : m;
    switch (p.t) {
      case 'path': (p.bezier ? target.bezier(p.pts) : target.poly(p.pts)); if (p.width > 1) { const q = p.pts.map(([x, y]) => [x + 1, y + 1]); p.bezier ? target.bezier(q) : target.poly(q); } break;
      case 'rect': target.fill(p.x, p.y, p.w, p.h); break;
      case 'ellipse': target.ellipse(p.box); break;
      case 'dotted': target.line([p.x1, p.y1], [p.x2, p.y2]); break;
      case 'text': texts.push({ text: p.text, x: p.x, y: p.y, align: p.align }); break;
    }
  }
  return { mask: m, texts };
}
function clipMask(m, l, t, r, b) {
  return new Proxy(m, { get(target, prop) { if (prop === 'set') return (x, y) => { x = Math.round(x); y = Math.round(y); if (x >= l && x < r && y >= t && y < b) target.set(x, y); }; const v = target[prop]; return typeof v === 'function' ? v.bind(new Proxy(target, this)) : v; } });
}

function near(m, x, y, tol = 1) { for (let j = -tol; j <= tol; j++) for (let i = -tol; i <= tol; i++) if (m.get(x + i, y + j)) return true; return false; }
function score(a, b) {
  let hit = 0, total = 0;
  for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) if (a.get(x, y)) { total++; if (near(b, x, y)) hit++; }
  return total ? hit / total : 1;
}
function textScore(ref, ours) {
  const used = new Set(); let matched = 0;
  const missing = [];
  for (const t of ref) {
    const k = ours.findIndex((o, i) => !used.has(i) && o.text === t.text && Math.abs(o.x - t.x) <= 2 && Math.abs(o.y - t.y) <= 2);
    if (k >= 0) { used.add(k); matched++; } else missing.push(t);
  }
  const extra = ours.filter((_, i) => !used.has(i));
  return { matched, ref: ref.length, ours: ours.length, missing, extra };
}

const results = [];
for (const dir of dirs) {
  const { payload, bank, pics } = loadExport(dir);
  pairs(bank, pics).forEach(({ record, object, pic }, index) => {
    const id = `${path.basename(dir).replace(/\.pqp\.native.*$/, '')}#${index}`;
    if (only && id !== only) return;
    if (!pic) { results.push({ id, record: record.number, status: 'unpaired' }); return; }
    const g = renderGraph(object.graph, object.widthTwips, object.heightTwips, { variables: variablesFor(payload, bank, record) });
    const ref = emfMask(emfPrimitives(pic.bytes), g.width, g.height);
    const ours = ourMask(g);
    const recall = score(ref.mask, ours.mask), precision = score(ours.mask, ref.mask);
    const text = textScore(ref.texts, ours.texts);
    results.push({ id, record: record.number, codes: object.graph.items.map((i) => i.code), recall, precision, text: { matched: text.matched, ref: text.ref, ours: text.ours }, errors: g.errors, warnings: g.warnings, missing: text.missing.slice(0, 6), extra: text.extra.slice(0, 6) });
  });
}
const done = results.filter((r) => r.status !== 'unpaired' && !r.errors.length);
const exact = done.filter((r) => r.recall >= 0.98 && r.precision >= 0.98 && r.text.matched === r.text.ref && r.text.ours === r.text.ref);
const mean = (k) => done.reduce((s, r) => s + r[k], 0) / Math.max(1, done.length);
console.log(`graphs ${results.length}; rendered ${done.length}; with errors ${results.filter((r) => r.errors?.length).length}; unpaired ${results.filter((r) => r.status === 'unpaired').length}`);
console.log(`mean ink recall ${mean('recall').toFixed(3)}, precision ${mean('precision').toFixed(3)}; text ${done.reduce((s, r) => s + r.text.matched, 0)}/${done.reduce((s, r) => s + r.text.ref, 0)} matched (${done.reduce((s, r) => s + r.text.ours, 0)} drawn); relaxed mask threshold ${exact.length}`);
console.log('Research metric only: size-based pairing is not identity verification; masks omit colour, dash patterns, region fills and glyph shapes; EMF replay omits viewport transforms, clipping and saved drawing state. Threshold counts do not establish visual parity.');
const errorCounts = {};
for (const r of results) for (const e of r.errors ?? []) { const k = e.replace(/graph item \d+ /, '').replace(/"[^"]*"/g, '"…"'); errorCounts[k] = (errorCounts[k] ?? 0) + 1; }
console.log('errors:', Object.entries(errorCounts).sort((a, b) => b[1] - a[1]).slice(0, 15));
const worst = [...done].sort((a, b) => (a.recall + a.precision + a.text.matched / Math.max(1, a.text.ref)) - (b.recall + b.precision + b.text.matched / Math.max(1, b.text.ref))).slice(0, Number(show ?? 12));
for (const r of worst) console.log(r.id, `r${r.record}`, JSON.stringify(r.codes), `recall ${r.recall.toFixed(2)} precision ${r.precision.toFixed(2)} text ${r.text.matched}/${r.text.ref} (${r.text.ours})`, r.missing.length ? 'missing ' + JSON.stringify(r.missing.slice(0, 3)) : '', r.extra.length ? 'extra ' + JSON.stringify(r.extra.slice(0, 3)) : '');
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2));
