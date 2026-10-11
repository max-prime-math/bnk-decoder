import fs from 'node:fs';
import { unzlibSync } from 'fflate';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { cleanDisplay } from '../../packages/bnk-core/src/algorithms.ts';
const root = 'ignore/ExamView/Banks/Pre-Calculus 12';
const output = { files: [], counts: { records: 0, equationSlots: 0, inlineSlots: 0, equations: 0 }, unresolved: [], examples: [] };
for (const file of fs.readdirSync(root).filter(f=>/\.bnk$/i.test(f))) {
 const p = unzlibSync(fs.readFileSync(`${root}/${file}`).subarray(16)), v=new DataView(p.buffer,p.byteOffset,p.byteLength), bank=readQuestionRecords(p);
 if(!bank){output.files.push({file,structural:false});continue;}
 output.files.push({file,records:bank.records.length});
 for(const r of bank.records){
  output.counts.records++;
  const entries = new Map();
  let a=r.prefix.algorithm[0]+4,ae=r.prefix.algorithm[1];
  while(a<ae){
   if(a+40>ae)throw Error('entry truncated');
   const nl=v.getInt32(a,true),rl=v.getInt32(a+4,true),dl=v.getInt32(a+8,true);
   const name=Buffer.from(p.slice(a+40,a+40+nl*2)).toString('utf16le');
   const dp=a+40+(nl+1)*2+(rl+1)*2;
   const rawDisplay=Buffer.from(p.slice(dp,dp+dl*2)).toString('utf16le');
   entries.set(name,{name,rawDisplay,display:cleanDisplay(rawDisplay),value:v.getFloat64(a+32,true)});
   a=dp+(dl+1)*2;
  }
  for(const b of r.blocks){
   const h=Array.from({length:15},(_,i)=>v.getInt32(b.offset+i*4,true));
   let oh=b.offset+60+h[2]*2+2+h[3]*12+h[4]*168+h[5]*12+h[6]*24+h[7]*66+h[10]*20+h[11]*52;
   let c=oh+h[12]*72;
   for(let i=0;i<h[12];i++){
    const kind=v.getInt32(oh+i*72+36,true),subtype=v.getInt32(oh+i*72+40,true),length=v.getInt32(c,true),body=c+4,end=body+length;
    if(kind===1&&subtype===6){
     output.counts.inlineSlots++;
     let z=body;while(z+2<=end&&v.getUint16(z,true)!==0)z+=2;
     const name=Buffer.from(p.slice(body,z)).toString('utf16le'),entry=entries.get(name);
     const valid=length===88&&z+2<=end&&p.slice(z,end).every(x=>x===0)&&entry?.display!==undefined;
     if(!valid)output.unresolved.push({file,q:r.number,kind:'inline',name,length,entry});
     if(output.examples.length<12)output.examples.push({file,q:r.number,kind:'inline',name,length,entry,range:[body,end]});
    }
    if(kind===1&&subtype===8){
     output.counts.equations++;
     let cur=body+44;
     const line=(depth)=>{if(depth>32)throw Error('depth');while(cur<end){const t=p[cur++];if(t===0)return;if(t===9){cur+=12;continue;}if(t===1){const n=v.getInt32(cur+4,true);cur+=20;for(let s=0;s<n;s++){if(s)cur+=4;line(depth+1);}continue;}if(t===11){cur+=4;line(depth+1);continue;}if(t===10){let z=cur;while(z+2<=end&&v.getUint16(z,true)!==0)z+=2;const name=Buffer.from(p.slice(cur,z)).toString('utf16le'),entry=entries.get(name);output.counts.equationSlots++;if(!entry||entry.display===undefined)output.unresolved.push({file,q:r.number,kind:'equation',name,entry});if(output.examples.length<12)output.examples.push({file,q:r.number,kind:'equation',name,entry,range:[cur-1,z+2],hex:Buffer.from(p.slice(cur-1,z+2)).toString('hex')});cur=z+2;continue;}if(t<32&&![5,6,7,8,13].includes(t))throw Error(`control${t}`);}throw Error('unterminated');};
     try{line(0);}catch(error){output.unresolved.push({file,q:r.number,kind:'token-grammar',error:error.message});}
    }
    c=end;
   }
  }
 }
}
fs.mkdirSync('reports/rea-examview', { recursive: true });
fs.writeFileSync('reports/rea-examview/slot-grammar-evidence.json',JSON.stringify(output,null,2));
console.log(JSON.stringify({counts:output.counts,unresolved:output.unresolved.length,examples:output.examples.slice(0,3)},null,2));
