import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename } from 'node:path';
import init, { TypstCompilerBuilder } from '@myriaddreamin/typst-ts-web-compiler';
import { unzipSync } from 'fflate';
import { renderNativeHtml } from '../native-html-to-typst.mjs';
const require=createRequire(import.meta.url);
await init({module_or_path:readFileSync(require.resolve('@myriaddreamin/typst-ts-web-compiler/wasm'))});
const builder=new TypstCompilerBuilder();builder.set_dummy_access_model();
for(const font of ['arial.ttf','arialbd.ttf','ariali.ttf','arialbi.ttf','times.ttf','timesbd.ttf','timesi.ttf','timesbi.ttf','DejaVuMathTeXGyre.ttf'])await builder.add_raw_font(readFileSync(`C:/Windows/Fonts/${font}`));
const compiler=await builder.build();
const prefix='#set text(font: "Arial", size: 10pt)\n#set math.equation(numbering: none)\n#set page(width: 8.5in, height: 11in, margin: 0.6in)\n';
const out='reports/rea-examview/runtime-oracle/typst-compile';mkdirSync(out,{recursive:true});
function compileDocument(source,name,metadata){
 writeFileSync(`${out}/${name}.typ`,source);compiler.add_source(`/${name}.typ`,source);
 const world=compiler.snapshot(undefined,`/${name}.typ`);const result=world.compile(0,3);const artifact=result.hasError?{}:world.get_artifact(1,3);
 const report={compiler:'@myriaddreamin/typst-ts-web-compiler 0.7.0-rc2',...metadata,hasError:result.hasError,diagnostics:result.diagnostics??[],pdfBytes:artifact.result?.length??0};writeFileSync(`${out}/${name}.diagnostics.json`,JSON.stringify(report,null,2));
 if(artifact.result)writeFileSync(`${out}/${name}.pdf`,artifact.result);world.free();console.log(JSON.stringify({...report,diagnostics:report.diagnostics.slice(0,15),totalDiagnostics:report.diagnostics.length},null,2));assert.equal(result.hasError,false,`${name} Typst compilation failed`);assert.ok(artifact.result?.length>1000);return report;
}
if(process.argv[2]&&process.argv[2]!=='--inventory'){
 const path=process.argv[2],pqp=JSON.parse(readFileSync(path,'utf8')),texts=[];
 for(const asset of Array.isArray(pqp.assets)?pqp.assets:Object.values(pqp.assets??{})){assert.equal(asset.storage.mode,'inline-base64');const bytes=Buffer.from(asset.storage.base64,'base64');compiler.map_shadow(`/imgs/${asset.filename.replace(/\.[^.]+$/,'')}`,bytes);compiler.map_shadow(`/imgs/${asset.filename}`,bytes);}
 function collect(v){if(!v||typeof v!=='object')return;if(v.format==='typst'&&typeof v.text==='string')texts.push(v.text);else for(const child of Object.values(v))if(typeof child==='object')collect(child);}
 for(const q of pqp.questions){collect(q.content);for(const presentation of q.extensions?.examview?.bimodalPresentations??[])collect(presentation.content);}
 const name=`${basename(path).replace(/\.pqp\.json$/i,'').replace(/\.json$/i,'').replace(/[^A-Za-z0-9._-]+/g,'-')}-pqp`;
 const requested=process.argv.indexOf('--batch-size'),batchSize=requested>=0?Number(process.argv[requested+1]):400;
 assert.ok(Number.isInteger(batchSize)&&batchSize>0,'batch size must be a positive integer');
 if(texts.length<=batchSize)compileDocument(prefix+texts.join('\n\n#pagebreak()\n\n'),name,{source:path,questions:pqp.questions.length,materials:texts.length,assets:pqp.assets.length});
 else{
  const batches=[];for(let at=0;at<texts.length;at+=batchSize)batches.push(compileDocument(prefix+texts.slice(at,at+batchSize).join('\n\n#pagebreak()\n\n'),`${name}-batch-${String(batches.length+1).padStart(3,'0')}`,{source:path,firstMaterial:at+1,materials:Math.min(batchSize,texts.length-at),assets:pqp.assets.length}));
  const report={source:path,questions:pqp.questions.length,materials:texts.length,assets:pqp.assets.length,hasError:false,diagnostics:[],pdfBytes:batches.reduce((n,b)=>n+b.pdfBytes,0),batches};writeFileSync(`${out}/${name}.diagnostics.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({source:path,batches:batches.length,materials:texts.length,hasError:false}));
 }
 compiler.free();process.exit(0);
}
const inventoryPath=process.argv[2]==='--inventory'?process.argv[3]:'reports/rea-examview/runtime-oracle/chapter01-auto.inventory.json';
const archivePath=process.argv[2]==='--inventory'?process.argv[4]:'reports/rea-examview/runtime-oracle/chapter01-auto.zip';
const outputName=process.argv[2]==='--inventory'?(process.argv[5]??'native-inventory-html').replace(/[^A-Za-z0-9._-]+/g,'-'):'native-html';
const inventory=JSON.parse(readFileSync(inventoryPath,'utf8'));
const archive=unzipSync(readFileSync(archivePath));
const htmls=[];function visit(v){if(!v||typeof v!=='object')return;if(typeof v.html==='string')htmls.push(v.html);for(const child of Object.values(v))if(typeof child==='object')visit(child);}visit(inventory);
const images=new Set();const blocks=htmls.map((html,i)=>{const rendered=renderNativeHtml(html,{image(src,attrs){assert.ok(archive[src],`missing actual JPEG ${src}`);const virtual=`/assets/${src.split('/').at(-1)}`;compiler.map_shadow(virtual,archive[src]);images.add(src);return `#image(${JSON.stringify(virtual)}, width: ${Math.min(Number(attrs.width)*0.75,440)}pt)`;}});assert.deepEqual(rendered.errors,[],`material ${i}`);return rendered.typst;});
const formatting=renderNativeHtml('<p><b>Bold <i>italic</i></b>, <u>underlined</u>, x<sub>2</sub>, y<sup>3</sup>, # $ [ ] _ *.</p><span style="color:#ff0000">Red</span><br><span style="font-family:\'Symbol\'">&#179; &#206;</span><table border="1" cellpadding="4"><tr><td rowspan="2" align="center" valign="middle">A</td><th colspan="2">B</th></tr><tr><td>C</td><td>D</td></tr></table>');assert.deepEqual(formatting.errors,[]);blocks.push(formatting.typst);
compileDocument(prefix+blocks.join('\n\n#pagebreak()\n\n'),outputName,{inventory:inventoryPath,archive:archivePath,materials:htmls.length,uniqueImages:images.size});compiler.free();
