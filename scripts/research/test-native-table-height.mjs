import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import init, { TypstCompilerBuilder } from '@myriaddreamin/typst-ts-web-compiler';
import initRenderer, { TypstRenderer } from '@myriaddreamin/typst-ts-renderer';
import { renderNativeHtml } from '../native-html-to-typst.mjs';
const require=createRequire(import.meta.url);
const root='reports/rea-examview',rowHeights={},inventories=[];
for(const directory of readdirSync(root,{withFileTypes:true})){if(!directory.isDirectory()||!/^native-chapter\d+.*native-/.test(directory.name))continue;const file=join(root,directory.name,'inventory.json');if(!existsSync(file))continue;inventories.push(file);function visit(value){if(!value||typeof value!=='object')return;if(value.html)for(const match of value.html.matchAll(/<tr\b[^>]*\bheight="([^"]+)"/gi))rowHeights[match[1]]=(rowHeights[match[1]]??0)+1;for(const child of Object.values(value))if(typeof child==='object')visit(child);}visit(JSON.parse(readFileSync(file,'utf8')));}
const html='<table border="1" cellpadding="0"><tr height="0"><td>First visible line<br>Second visible line</td></tr><tr><td>Following row must not overlap.</td></tr></table>';
const zero=renderNativeHtml(html),auto=renderNativeHtml(html.replace(' height="0"',''));assert.deepEqual(zero.errors,[]);assert.deepEqual(auto.errors,[]);
await init({module_or_path:readFileSync(require.resolve('@myriaddreamin/typst-ts-web-compiler/wasm'))});
const builder=new TypstCompilerBuilder();builder.set_dummy_access_model();for(const font of ['arial.ttf','arialbd.ttf'])await builder.add_raw_font(readFileSync(`C:/Windows/Fonts/${font}`));const compiler=await builder.build();
const source=`#set text(font: "Arial", size: 12pt)\n#set page(width: 6in, height: 3in, margin: 0.25in)\n#let actual = [${zero.typst}]\n#let reference = [${auto.typst}]\n#context {\n let a = measure(actual)\n let b = measure(reference)\n [#metadata((same: a.height == b.height, actualPt: a.height / 1pt, referencePt: b.height / 1pt)) <height-check>]\n}\n#strong[HTML row height=0, natural content:]\n#actual\n`;
compiler.add_source('/height.typ',source);const world=compiler.snapshot(undefined,'/height.typ');const result=world.compile(0,3);assert.equal(result.hasError,false,JSON.stringify(result.diagnostics));const measured=JSON.parse(world.query(0,'<height-check>','value'))[0];assert.equal(measured.same,true);assert.ok(measured.actualPt>25,'three visible lines must retain nonzero natural height');
const out=join(root,'runtime-oracle/typst-compile');mkdirSync(out,{recursive:true});writeFileSync(join(out,'table-height.typ'),source);writeFileSync(join(out,'table-height.pdf'),world.get_artifact(1,3).result);
await initRenderer({module_or_path:readFileSync(require.resolve('@myriaddreamin/typst-ts-renderer/wasm'))});const renderer=new TypstRenderer();const session=renderer.session_from_artifact(world.get_artifact(0,3).result,'vector');writeFileSync(join(out,'table-height.svg'),renderer.svg_data(session));session.free();renderer.free();
const report={inventories:inventories.length,rowHeights,diagnostics:result.diagnostics??[],measured,reference:'https://www.w3.org/TR/CSS22/tables.html#height-layout'};writeFileSync(join(out,'table-height.diagnostics.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));world.free();compiler.free();

