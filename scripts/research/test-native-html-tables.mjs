import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderNativeHtml } from '../native-html-to-typst.mjs';
const fixtures=['reports/rea-examview/native-chapter03.pqp.native-TKoD3d/inventory.json','reports/rea-examview/native-chapter07.pqp.native-6EJ9vg/inventory.json','reports/rea-examview/native-chapter06.pqp.native-yElE2j/inventory.json'];
let count=0,gray=0,zero=0;
for(const file of fixtures){const data=JSON.parse(readFileSync(file,'utf8'));function visit(v){if(!v||typeof v!=='object')return;if(typeof v.html==='string'){count++;const r=renderNativeHtml(v.html,{image:()=> '#image("fixture.jpg");'});assert.deepEqual(r.errors,[],v.html);if(v.html.includes('bgcolor=')){gray++;assert.ok(r.typst.includes('fill: rgb('));}if(v.html.includes('width="0%"')){zero++;assert.ok(r.typst.includes('0%'));assert.ok(r.typst.includes('stroke: none)[]'));}}for(const child of Object.values(v))if(typeof child==='object')visit(child);}visit(data);}
assert.ok(gray>10);assert.ok(zero>0);
assert.deepEqual(renderNativeHtml('<span style="font-family:\'Wingdings\'"><br></span>').errors,[]);
assert.ok(renderNativeHtml('<span style="font-family:\'Wingdings\'">x</span>').errors.length);
assert.ok(renderNativeHtml('<span style="font-family:\'Wingdings\'"><i>x</i></span>').errors.length);
const ragged=renderNativeHtml('<table><tr><td>a</td><td>b</td></tr><tr><td>c</td></tr></table>');assert.deepEqual(ragged.errors,[]);assert.ok(ragged.typst.includes('table.cell(x: 1, y: 1, stroke: none)[]'));
assert.ok(renderNativeHtml('<table><tr><td bgcolor="#INVALID">x</td></tr></table>').errors.length);
const minimumZero=renderNativeHtml('<table><tr height="0"><td>Visible content must retain natural height.</td></tr></table>');assert.deepEqual(minimumZero.errors,[]);assert.ok(minimumZero.typst.includes('rows: (auto,)'));assert.ok(!minimumZero.typst.includes('rows: (0pt'));
assert.ok(renderNativeHtml('<table><tr height="15"><td>Visible</td></tr></table>').errors.some(e=>e.includes('minimum row height')),'positive HTML minimum heights cannot become fixed clipping rows');
console.log(`Native tables passed ${count} actual HTML materials, ${gray} colored-table materials, zero-width logical columns, ragged rows, and empty-font handling.`);
