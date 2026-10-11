import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderNativeHtml } from '../native-html-to-typst.mjs';
const data=JSON.parse(readFileSync('reports/rea-examview/native-chapter11.pqp.native-jkhH90/inventory.json','utf8'));
const materials=[];function visit(v){if(!v||typeof v!=='object')return;if(typeof v.html==='string'&&v.html.includes('Euclid Symbol'))materials.push(v.html);for(const child of Object.values(v))if(typeof child==='object')visit(child);}visit(data);
const calls=[];
for(const html of materials){const rendered=renderNativeHtml(html,{image:()=> '#image("fixture.jpg");',fontText(font,text,attrs){calls.push({font,text,attrs});return '#image("native-glyph.png");';}});assert.deepEqual(rendered.errors,[]);assert.ok(rendered.typst.includes('#image("native-glyph.png");'));}
assert.ok(calls.length>=2);assert.ok(calls.every(c=>c.font==='Euclid Symbol'&&c.text==='\u00a5'&&c.attrs.style==="font-family:'Euclid Symbol'"));
assert.ok(renderNativeHtml('<span style="font-family:\'Euclid Symbol\'">&#165;</span>').errors.length,'missing glyph resolver must fail closed');
let called=false;const guarded={fontText(){called=true;return '#image("native-glyph.png");';}};
assert.ok(renderNativeHtml('<span style="font-family:\'Euclid Symbol\'"><b>&#165;</b></span>',guarded).errors.length);assert.equal(called,false,'formatting ambiguity must never be silently rasterized');
assert.ok(renderNativeHtml('<span style="font-family:\'Euclid Symbol\'">&#165;</span>',{fontText:()=>''}).errors.length);
assert.ok(renderNativeHtml('<span style="font-family:\'Euclid Symbol\'">&#165;</span>',{fontText:()=>{throw new Error('native rasterization failed');}}).errors.some(e=>e.includes('native rasterization failed')));
const external=renderNativeHtml('<span style="font-family:\'Euclid Symbol\'">&#165;</span>',{fontText:()=>({typst:'#image("native-glyph.png");',errors:['unverified selected face']})});assert.deepEqual(external.errors,['unverified selected face']);
const styled=renderNativeHtml('<span style="font-family:\'Euclid Symbol\';color:#ff0000;font-size:12pt">&#165;</span>',{fontText:(font,text,attrs)=>{assert.ok(attrs.style.includes('color:#ff0000'));return '#image("native-glyph.png");';}});assert.deepEqual(styled.errors,[]);assert.ok(styled.typst.includes('size: 12pt'));assert.ok(styled.typst.includes('fill: rgb("#ff0000")'));
renderNativeHtml('<span style="font-family:\'Symbol\'">&#179;</span>',{fontText:()=>{throw new Error('known fonts must not use fallback');}});
console.log(`Native font fallback passed ${materials.length} real Chapter 11 materials/${calls.length} original U+00A5 glyph requests, formatting guards, resolver failures, and styles.`);
