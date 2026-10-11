import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,resolve,basename} from 'node:path';
import {spawnSync} from 'node:child_process';
import {readNativeRtf} from './read-native-rtf.mjs';
const output=mkdtempSync(resolve('reports/rea-examview/native-publisher-dual-'));
const reuse=process.argv[2]?JSON.parse(readFileSync(process.argv[2],'utf8')):undefined;
const hash=b=>createHash('sha256').update(b).digest('hex');
const banks=[];const report=()=>writeFileSync(join(output,'summary.json'),JSON.stringify({output,banks,limitations:['Coverage and compilation do not establish pixel parity or importer acceptance.','Missing original fonts retain native Windows substitution diagnostics.','Each bank captures one native randomized snapshot.']},null,2));
console.log('OUTPUT '+output);
for(let chapter=1;chapter<=11;chapter++){
 const label=String(chapter).padStart(2,'0'),input=`ExamView/Banks/Pre-Calculus 12/Chapter ${label}.bnk`,target=join(output,`native-publisher-dual-chapter${label}.pqp.json`),before=hash(readFileSync(input));
 const row={chapter,output:target,sourceSha256:before};banks.push(row);report();console.log(`Starting fresh Chapter ${label}`);
 const previous=reuse?.banks.find(b=>b.chapter===chapter),existing=previous?JSON.parse(readFileSync(previous.output,'utf8')).extensions.nativeEvidence.directory:undefined;
 const conversion=spawnSync(process.execPath,['--experimental-strip-types','--no-warnings','scripts/examview-to-pqp.mjs',input,target,...(existing?['--evidence',existing]:[])],{encoding:'utf8',maxBuffer:20*1024*1024});
 writeFileSync(join(output,`chapter${label}.conversion.log`),conversion.stdout+conversion.stderr);row.exitCode=conversion.status;
 assert.equal(hash(readFileSync(input)),before,'Source bank changed');
 if(conversion.status!==0){row.error=conversion.stdout+conversion.stderr;report();console.log(`Chapter ${label}: native CLI failed; retained log.`);continue;}
 const pqp=JSON.parse(readFileSync(target,'utf8')),native=pqp.extensions.nativeConversion;row.counts=native.counts;row.status=native.status;row.bimodalCoverage=native.bimodalCoverage;row.warnings=pqp.diagnostics.filter(d=>d.level!=='info');
 try{
  const directory=pqp.extensions.nativeEvidence.directory,receipt=pqp.extensions.nativeEvidence.receipt;
  const inventories=readdirSync(directory).filter(n=>/^inventory-.*\.json$/.test(n)).map(n=>JSON.parse(readFileSync(join(directory,n),'utf8').replace(/^\uFEFF/,'')));
  function oracle(zip,rtfPath){const inventory=inventories.find(i=>resolve(i.zip)===resolve(zip));assert.ok(inventory,`Inventory missing for ${zip}`);const rtf=readNativeRtf(readFileSync(rtfPath)),positions=new Map();let cursor=0;for(const item of inventory.items){positions.set(item.ordinal,cursor);cursor+=item.type==='Matching'?item.responses.length:1;}assert.equal(cursor,rtf.questions.length);return{rtf,positions};}
  const primary=oracle(receipt.output,receipt.rtfOutput),alternates=new Map((receipt.alternateEvidence??[]).map(e=>[e.mode,oracle(e.output,e.rtfOutput)]));let checked=0;
  function check(q,ordinal,source){if(q.kind!=='mcq')return;const position=source.positions.get(ordinal);assert.ok(Number.isInteger(position),'Native ordinal missing');const answer=source.rtf.questions[position].answer.trim(),key=/^([A-Z](?:,\s*[A-Z])*)(?=\s|$)/i.exec(answer);assert.ok(key,`Unrecognized native key ${answer.slice(0,60)}`);assert.equal(q.answer.value.toUpperCase().replace(/\s/g,''),key[1].toUpperCase().replace(/\s/g,''));checked++;}
  for(const q of pqp.questions){check(q,q.extensions.examview.nativeExportOrdinal,primary);for(const variant of q.extensions.examview.bimodalPresentations??[])check(variant,variant.nativeExportOrdinal,alternates.get(variant.mode));}
  row.checkedChoiceKeys=checked;
 }catch(error){row.validationError=error.stack;}
 const compile=spawnSync(process.execPath,['--experimental-strip-types','--no-warnings','scripts/research/compile-native-html.mjs',target],{encoding:'utf8',maxBuffer:20*1024*1024});writeFileSync(join(output,`chapter${label}.compile.log`),compile.stdout+compile.stderr);row.typstCompiled=compile.status===0;if(compile.status!==0)row.compileError=compile.stdout+compile.stderr;
 report();console.log(`Chapter ${label}: ${native.counts.convertedRecords}/${native.counts.sourceRecords}; ${native.status}; keys ${row.checkedChoiceKeys??'FAILED'}; compile ${row.typstCompiled}; warnings ${row.warnings.length}`);
}
console.log(JSON.stringify({output,complete:banks.filter(b=>b.status==='complete').length,failures:banks.filter(b=>b.error||b.validationError||b.compileError).map(b=>b.chapter)}));
