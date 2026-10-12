import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inflateSync } from 'node:zlib';
import { normalizeNativeGraphObject, readNativeGraphObject } from '../../packages/bnk-core/src/graphs.ts';
const inventory = JSON.parse(fs.readFileSync('reports/rea-examview/graph-object-inventory.json', 'utf8'));
const cached = new Map(), types = {}, failures = [];
let parsed = 0, pictures = 0;
for (const sample of inventory.samples.filter(s => s.kind === 0 && s.subtype === 9)) {
  if (!cached.has(sample.file)) cached.set(sample.file, inflateSync(fs.readFileSync(sample.file).subarray(16)));
  const p = cached.get(sample.file), body = p.subarray(sample.body, sample.body + sample.length);
  try {
    const graph = readNativeGraphObject(body); parsed++;
    const normalized = normalizeNativeGraphObject(graph, {
      width: (sample.width + 1) / 1440,
      height: (sample.height + 1) / 1440,
    });
    assert.deepEqual(normalized.view, graph.viewExpressions);
    assert.equal(normalized.items.length, graph.items.length);
    assert.equal(normalized.axes.x.label, graph.axes[0].label);
    assert.equal(normalized.axes.y.label, graph.axes[1].label);
    for (const item of graph.items) { types[item.code] = (types[item.code] ?? 0) + 1; if (item.pictureBytes) pictures++; }
    assert.deepEqual(graph.raw, body);
  } catch (error) { failures.push({ file: sample.file, number: sample.number, error: error.message }); }
}
assert.equal(parsed, 2883);
assert.equal(failures.length, 0);
assert.ok(pictures > 0);
const fixture = inventory.samples.find(s => s.kind === 0 && s.subtype === 9);
const original = cached.get(fixture.file).subarray(fixture.body, fixture.body + fixture.length);
const bad = Buffer.from(original);bad.writeInt32LE(-1, 0x85c);
assert.throws(() => readNativeGraphObject(bad), /invalid graph item count/);
assert.throws(() => readNativeGraphObject(original.subarray(0, 0x997)), /header truncated/);
const report = { parsed, pictures, types, failures, fidelity: 'Exact native framing and byte retention; no visual fidelity claim.' };
fs.writeFileSync('reports/rea-examview/native-graph-framing.json', JSON.stringify(report, null, 2));
console.log(report);
