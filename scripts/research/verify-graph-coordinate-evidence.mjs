// Regression for the non-centred zero-bound plot inset, observed in an ExamView-generated EMF.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { renderGraph } from '../../packages/bnk-core/src/graph-render.ts';
import { rtfPictures } from './rtf-pictures.mjs';
import { emfPrimitives } from './emf-records.mjs';

const root = 'reports/rea-examview';
const dirname = fs.readdirSync(root).find((name) =>
  name.startsWith('native-family-MW12.pqp.native-') && fs.existsSync(path.join(root, name, 'bank.rtf')),
);
assert(dirname, 'native MW12 evidence directory is required');
const dir = path.join(root, dirname);
const work = fs.readdirSync(dir).find((name) => name.startsWith('export-work'));
assert(work, 'native MW12 evidence has no export-work directory');
const bankFile = fs.readdirSync(path.join(dir, work)).find((name) => name.toLowerCase().endsWith('.bnk'));
assert(bankFile, 'native MW12 evidence has no isolated BNK');
const payload = inflateSync(fs.readFileSync(path.join(dir, work, bankFile)).subarray(16));
const bank = readQuestionRecords(payload);
const pictures = rtfPictures(path.join(dir, 'bank.rtf'));

const pairs = [];
let cursor = 0;
for (const record of bank.records) for (const block of record.blocks) for (const object of block.objects) {
  if (object.kind !== 'graph') continue;
  let index = cursor;
  while (index < pictures.length && !(
    Math.abs(pictures[index].wgoal - object.widthTwips) <= 2
    && Math.abs(pictures[index].hgoal - object.heightTwips) <= 2
  )) index++;
  assert(index < pictures.length, `native graph image missing for record ${record.number}`);
  pairs.push({ record, object, picture: pictures[index] });
  cursor = index + 1;
}

const pair = pairs[5];
assert.equal(pair.record.number, 4);
assert.deepEqual([pair.object.widthTwips, pair.object.heightTwips], [3599, 3599]);
assert.deepEqual(pair.object.graph.viewExpressions, ['0', '0', '0', '0']);
const nativeTexts = emfPrimitives(pair.picture.bytes).prims.filter((p) => p.t === 'text');
const nativeOne = nativeTexts.find((p) => p.text === '1');
assert.deepEqual(nativeOne?.at, [69, 209]);

const rendered = renderGraph(pair.object.graph, pair.object.widthTwips, pair.object.heightTwips, { variables: new Map() });
assert(!rendered.errors.some((message) => message.startsWith('graph view:')), rendered.errors.join('; '));
const renderedOne = rendered.prims.find((p) => p.t === 'text' && p.text === '1');
assert(renderedOne && renderedOne.t === 'text');
assert.deepEqual([renderedOne.x, renderedOne.y], nativeOne.at);

console.log(JSON.stringify({
  evidenceId: 'runtime-mw12-r4-zero-bounds',
  source: path.join(dir, 'bank.rtf'),
  record: pair.record.number,
  dimensionsTwips: [pair.object.widthTwips, pair.object.heightTwips],
  viewExpressions: pair.object.graph.viewExpressions,
  nativeTickOne: nativeOne.at,
  renderedTickOne: [renderedOne.x, renderedOne.y],
}, null, 2));
