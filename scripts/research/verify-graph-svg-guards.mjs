// Incomplete independent graphs must never enter a PQP as an apparently complete asset.
import assert from 'node:assert/strict';
import { graphToSvg } from '../../packages/bnk-core/src/graph-render.ts';

const graph = { width: 96, height: 96, prims: [], clip: [0, 0, 96, 96], errors: [], warnings: [] };
assert.match(graphToSvg(graph, 1, 1), /viewBox="0 0 96 96"/);
for (const field of ['errors', 'warnings']) {
  const incomplete = { ...graph, [field]: ['unverified drawing'] };
  assert.throws(() => graphToSvg(incomplete, 1, 1), /incomplete or approximate/);
  assert.match(graphToSvg(incomplete, 1, 1, { allowPartialPreview: true }), /<svg/);
}
assert.throws(() => graphToSvg(graph, NaN, 1), /dimensions/);
assert.throws(() => graphToSvg({ ...graph, prims: [{ t: 'region', polys: [], shading: 99, colour: '#000000' }] }, 1, 1), /Unsupported graph shading/);
console.log('Graph SVG completeness, preview opt-in, dimension and shading guards passed.');
