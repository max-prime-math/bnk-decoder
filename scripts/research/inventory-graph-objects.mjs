// Structural object inventory. Field meanings remain hypotheses pending native traces.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { readGraphObjects } from '../../packages/bnk-core/src/graphs.ts';
const root = process.argv[2] ?? 'ignore/ExamView/Banks';
const output = process.argv[3] ?? 'reports/rea-examview/graph-object-inventory.json';
function* files(path) { for(const e of readdirSync(path,{withFileTypes:true})) { const p=join(path,e.name);if(e.isDirectory()) yield* files(p);else if(/\.bnk$/i.test(p)) yield p; } }
const samples=[], counts={}, failures=[];
for(const file of files(root)) {
  let p, bank;try { p=inflateSync(readFileSync(file).subarray(16));bank=readQuestionRecords(p); }catch(error){failures.push({file,error:error.message});continue;}if(!bank)continue;
  for(const record of [...bank.records,...bank.narratives,...bank.groups]) for(const block of record.blocks){
    const at=block.offset, h=Array.from({length:15},(_,n)=>p.readInt32LE(at+n*4));
    const headers=at+60+h[2]*2+2+h[3]*12+h[4]*168+h[5]*12+h[6]*24+h[7]*66+h[10]*20+h[11]*52;
    let cursor=headers+h[12]*72;
    for(let n=0;n<h[12];n++){
      const o=headers+n*72,length=p.readInt32LE(cursor),body=cursor+4,kind=p.readInt32LE(o+36),subtype=p.readInt32LE(o+40);
      const key=`${kind}:${subtype}`;counts[key]=(counts[key]??0)+1;
      if(kind!==1||![1,6,8].includes(subtype)) {
        const graphs=readGraphObjects(p,body,body+length);
        samples.push({file,number:record.number,block:at,position:p.readInt32LE(o),kind,subtype,body,length,width:p.readInt32LE(o+12),height:p.readInt32LE(o+16),prefix:Array.from({length:Math.min(40,Math.floor(length/4))},(_,i)=>p.readInt32LE(body+i*4)),graphs});
      }cursor=body+length;
    }
  }
}
mkdirSync('reports/rea-examview',{recursive:true});writeFileSync(output,JSON.stringify({evidence:'Count-derived rich text object boundaries; graph fields inherited from prior hypothesis parser, not proven native semantics',counts,failures,samples},null,2));
console.log(JSON.stringify({counts,samples:samples.length,graphObjects:samples.filter(s=>s.graphs.length).length,failures},null,2));
