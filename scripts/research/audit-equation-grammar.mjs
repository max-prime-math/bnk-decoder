import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { parseEquation, equationToTypst } from '../../packages/bnk-core/src/equations.ts';
const root = process.argv[2] ?? 'ignore/ExamView/Banks';
const files = (dir) => readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(join(dir,e.name)) : e.name.endsWith('.bnk') ? [join(dir,e.name)] : []);
const report = {files:0, equations:0, errors:{}, templates:{}, examples:[]};
for (const file of files(root)) {
  let payload, bank;
  try {payload=inflateSync(readFileSync(file).subarray(16)); bank=readQuestionRecords(payload);} catch {continue;}
  if (!bank) continue;
  report.files++;
  for(const record of bank.records) for(const block of record.blocks) for(const object of block.objects) {
    if(object.kind!=='equation')continue;
    report.equations++;
    const parsed=parseEquation(payload,object.range[0],object.range[1]);
    const visit = nodes => {for(const node of nodes)if(node.type==='template'){const key=`${node.kind}.${node.variant}/${node.slots.length}`;report.templates[key]=(report.templates[key]??0)+1;node.slots.forEach(visit);}else if(node.type==='geometry')visit(node.name);};
    visit(parsed.nodes);
    const rendered=equationToTypst(parsed.nodes);
    const errors=[...parsed.errors,...rendered.errors].filter(e=>!e.startsWith('unresolved stored equation variable'));
    for(const error of errors)report.errors[error]=(report.errors[error]??0)+1;
    if(errors.length&&report.examples.filter(e=>e.errors[0]===errors[0]).length<4)report.examples.push({file,question:record.number,range:object.range,errors,hex:Buffer.from(payload.subarray(object.range[0],object.range[1])).toString('hex')});
  }
}
writeFileSync('reports/rea-examview/equation-grammar-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,examples:report.examples.length},null,2));

