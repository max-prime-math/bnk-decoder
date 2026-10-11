import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { parseEquation, equationToTypst } from '../../packages/bnk-core/src/equations.ts';
import { readAlgorithmBlockAt, cleanDisplay } from '../../packages/bnk-core/src/algorithms.ts';
import { renderBlock } from '../../packages/bnk-core/src/record-typst.ts';

// Actual equation bytes from publisher bank Rationals_multiply-divide Q10. Native
// FUN_004bc520's token 0x0b occupies five bytes. In this fixture it denotes a
// unary minus in a numerator; reading a nested line swallowed the denominator.
const payload=inflateSync(readFileSync('ignore/ExamView/Banks/Foundations of Math 10/APL-banks/Rationals_multiply-divide.bnk').subarray(16));
const bank=readQuestionRecords(payload);
assert.ok(bank);
const equation=bank.records.find(r=>r.number===10).blocks.flatMap(b=>b.objects).find(o=>o.kind==='equation' && o.range[0]===44339);
assert.ok(equation);
const parsed=parseEquation(payload,...equation.range);
assert.deepEqual(parsed.errors,[]);
const variables=new Map(Array.from({length:6},(_,i)=>[`n${i+1}`,{display:String(i+1),valueType:'number'}]));
const rendered=equationToTypst(parsed.nodes,variables);
assert.deepEqual(rendered.errors,[]);
assert.equal(rendered.math,'frac(-, 2) × frac(3, 4) = frac(5, 6)');
// Truncated symbol data must fail rather than consuming outside its byte range.
assert.ok(parseEquation(Uint8Array.from([11,2,0]),0,3).errors.length);
const publisher=inflateSync(readFileSync('ignore/ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk').subarray(16));
const q35=readQuestionRecords(publisher).records.find(r=>r.number===35);
const entries=new Map(readAlgorithmBlockAt(publisher,...q35.prefix.algorithm).map(e=>[e.name,e]));
assert.equal(entries.get('ans_constant').rawDisplay,'\u0001\uf0814');
assert.equal(entries.get('ans_constant').display,'+ 4');
assert.equal(entries.get('ans_constant').mathDisplay,'+ 4');
assert.equal(entries.get('ans_m').mathDisplay,'frac(4, 5)');
assert.equal(cleanDisplay('\u0001\uf080270/2'),undefined,'structured radicals must never become a plain 270/2 expression');
assert.equal(equationToTypst([{type:'variable',name:'ans_m',range:[0,0]},{type:'char',code:120,style:-11},{type:'variable',name:'ans_constant',range:[0,0]}],entries).math,'frac(4, 5) x + 4');
const matrixPayload=inflateSync(readFileSync('ignore/ExamView/Banks/Foundations of Math 10/Chapter 03/MMS10_3.6.bnk').subarray(16));
const matrix=parseEquation(matrixPayload,287420,288188);
assert.deepEqual(matrix.errors,[]);
const template=matrix.nodes.find(n=>n.type==='template' && n.kind===8);
assert.equal(template.slots.length,12);
assert.equal(template.extra.length,160);
assert.equal(template.slotMetadata.length,12);
assert.ok(equationToTypst(matrix.nodes).errors.includes('unsupported equation template 8.0'));
const radicalPayload=inflateSync(readFileSync('ignore/ExamView/Banks/Foundations of Math 10/Chapter 04/MMS10_4.3.bnk').subarray(16));
const radicalRecord=readQuestionRecords(radicalPayload).records.find(r=>r.number===1);
const radicalEntries=new Map(readAlgorithmBlockAt(radicalPayload,...radicalRecord.prefix.algorithm).map(e=>[e.name,e]));
assert.equal(radicalEntries.get('n4').rawDisplay,'\u0001\uf0806/3');
assert.equal(radicalEntries.get('n4').display,undefined);
assert.equal(radicalEntries.get('n4').displayError,'unsupported encoded math display marker U+F080');
const rejected=radicalRecord.blocks.map(block=>renderBlock(block,{variables:radicalEntries,picture:()=>''})).find(e=>e.errors.some(error=>error.includes('n4')));
assert.ok(rejected,'actual inline square-root variable must report an error instead of publishing corrupted math');
assert.ok(!rejected.typst.includes('6/3'),'radical must not be substituted as ordinary fraction text');
const rejectedMath=equationToTypst([{type:'variable',name:'n4',range:[0,0]}],radicalEntries);
assert.ok(rejectedMath.errors.some(error=>error.includes('U+F080')));
console.log('Equation grammar fixtures passed: native unary-minus grammar, matrix header/cells, truncation rejection, and native Q35 fraction/sign rendering.');
