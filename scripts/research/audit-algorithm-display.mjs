import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { readAlgorithmBlockAt } from '../../packages/bnk-core/src/algorithms.ts';
const files = dir => readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):e.name.endsWith('.bnk')?[join(dir,e.name)]:[]);
const report={formats:{},fontEscapes:{},markerExamples:{},examples:[]};
for(const file of files('ignore/ExamView/Banks')) {
 let p,bank;try{p=inflateSync(readFileSync(file).subarray(16));bank=readQuestionRecords(p);}catch{continue;}if(!bank)continue;
 for(const record of bank.records)for(const entry of readAlgorithmBlockAt(p,...record.prefix.algorithm)??[]) {
  const key=`${entry.valueType}/${entry.format}`;report.formats[key]=(report.formats[key]??0)+1;
  for(const match of entry.rawDisplay.matchAll(/\u0001(.)/gs)) {const k=match[1].charCodeAt(0).toString(16);report.fontEscapes[k]=(report.fontEscapes[k]??0)+1;report.markerExamples[k]??=[];if(report.markerExamples[k].length<4)report.markerExamples[k].push({file,question:record.number,...entry});}
  if((entry.format===4&&entry.valueType==='string'||entry.display===undefined)&&report.examples.filter(e=>e.key===key).length<20)report.examples.push({file,question:record.number,key,...entry});
 }
}
writeFileSync('reports/rea-examview/algorithm-display-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,markerExamples:Object.keys(report.markerExamples),examples:report.examples.length},null,2));
