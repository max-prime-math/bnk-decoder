import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderNativeHtml, decodeNativeEntities } from '../native-html-to-typst.mjs';
const inventory=JSON.parse(readFileSync('reports/rea-examview/runtime-oracle/chapter01-auto.inventory.json','utf8'));
const materials=[];
function visit(value){if(!value||typeof value!=='object')return;if(typeof value.html==='string')materials.push(value.html);for(const child of Object.values(value))if(typeof child==='object')visit(child);}
visit(inventory);
let images=0;
for(const html of materials){const result=renderNativeHtml(html,{image(src,attrs){assert.ok(src.startsWith('ppg/examview/'));assert.match(attrs.width,/^\d+$/);assert.match(attrs.height,/^\d+$/);images++;return '#image("fixture.png")';}});assert.deepEqual(result.errors,[],html);}
assert.ok(materials.length>300);assert.ok(images>300);
assert.equal(decodeNativeEntities('&amp;gt;'),'&gt;','entities decode exactly one level');
assert.equal(decodeNativeEntities('&#x1F600; &nbsp; &#8211;'),'😀 \u00a0 –');
assert.equal(renderNativeHtml('<span style="font-family:\'Symbol\'">&#179; &#206;</span>').typst,'≥ ∈');
assert.equal(renderNativeHtml('<b><i>x</i></b><sub>2</sub><sup>3</sup><u>u</u>').typst,'#strong[#emph[x];];#sub[2];#super[3];#underline[u];');
assert.equal(renderNativeHtml('a #[x] $y$ *b* _u_ @z').typst,'a \\#\\[x\\] \\$y\\$ \\*b\\* \\_u\\_ \\@z');
assert.ok(renderNativeHtml('<script>alert(1)</script>').errors.some(e=>e.includes('unsupported HTML tag')));
assert.ok(renderNativeHtml('<i class="unknown">x</i>').errors.length);
assert.ok(renderNativeHtml('&bogus; &#xZZ; &#55296;').errors.length===3);
assert.ok(renderNativeHtml('<span style="font-family:Other">x</span>').errors.length);
assert.ok(renderNativeHtml('<img src="x" width="NaN">',{image:()=>''}).errors.length);
assert.ok(renderNativeHtml('<b><i>x</b></i>').errors.length);
const table=renderNativeHtml('<table border="1"><tr><td rowspan="2">a</td><th colspan="2">b</th></tr><tr><td>c</td><td>d</td></tr></table>');
assert.deepEqual(table.errors,[]);assert.ok(table.typst.includes('columns: 3'));assert.ok(table.typst.includes('x: 0, y: 0, colspan: 1, rowspan: 2'));assert.ok(table.typst.includes('x: 1, y: 1'));
assert.ok(renderNativeHtml('<table><tr><td rowspan="3">a</td></tr></table>').errors.length);
console.log(`Native HTML renderer passed ${materials.length} native materials/${images} image references, Symbol glyphs, one-level entities, escaping, formatting, table spans, and fail-closed markup checks.`);
