import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';
import { readQuestionRecords } from '../../packages/bnk-core/src/records.ts';
import { convertNativeExport } from '../native-export-to-pqp.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=readFileSync('ExamView/Banks/Foundations of Math 10/APL-banks/Area.bnk'),bank=readQuestionRecords(inflateSync(source.subarray(16)));
assert.ok(bank);assert.equal(bank.records.length,15);
const bimodal=bank.records.filter(r=>r.typeCode===4);assert.equal(bimodal.length,10);assert.ok(bimodal.every(r=>r.type==='bimodal'));
const receipt=JSON.parse(readFileSync('reports/rea-examview/runtime-oracle/area-dual.zip.receipt.json','utf8'));assert.equal(hash(source),receipt.sourceSha256.toLowerCase());assert.equal(receipt.sourceHashAfter,receipt.sourceSha256);
const nativeForms={};
for(const evidence of receipt.alternateEvidence){assert.equal(evidence.sameLoadedBank,true);assert.equal(evidence.presentationCommand,evidence.mode==='multiple-choice'?30591:30590);const zip=readFileSync(evidence.output);assert.equal(hash(zip),evidence.outputSha256.toLowerCase());const xml=Buffer.from(unzipSync(zip)['00001_questions.dat']).toString('utf8');const rows=[...xml.matchAll(/<item\b[\s\S]*?<\/item>/g)].map(m=>({id:/<bbmd_asi_object_id>([^<]+)<\//.exec(m[0])[1],type:/<bbmd_questiontype>([^<]+)<\//.exec(m[0])[1]}));assert.equal(rows.length,15);nativeForms[evidence.mode]=rows;}
for(const record of bank.records){const id=`question_${record.number}_1`;const mc=nativeForms['multiple-choice'].find(r=>r.id===id),sa=nativeForms['short-answer'].find(r=>r.id===id);assert.ok(mc&&sa);assert.equal(sa.type,'Essay');assert.equal(mc.type,record.type==='bimodal'?'Multiple Choice':'Essay');}
const inventory=JSON.parse(readFileSync('reports/rea-examview/native-family-APL-area.pqp.native-ncQ7z4/inventory.json','utf8'));
const converted=convertNativeExport({inventory,bank,sourceName:'Area.bnk',sourceSha256:hash(source)});assert.equal(converted.counts.convertedRecords,5);assert.equal(converted.counts.questions,5);assert.equal(converted.pqp.extensions.nativeConversion.status,'partial');assert.ok(converted.diagnostics.some(d=>d.code==='NATIVE_PROMPT_IMAGE_ALIAS'),'Native short-answer image overwrite must fail closed before paired RTF repair');assert.ok(converted.pqp.questions.every(q=>q.content.solution?.text));
const pcBytes=readFileSync('ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk'),pcBank=readQuestionRecords(inflateSync(pcBytes.subarray(16)));assert.equal(pcBank.records[40].typeCode,4);assert.equal(pcBank.records[40].type,'bimodal');
const pcInventory=JSON.parse(readFileSync('reports/rea-examview/native-family-PC11.pqp.native-XB5qDn/inventory.json','utf8'));
const complete=convertNativeExport({inventory:pcInventory,bank:pcBank,sourceName:'Chapter 01.bnk',sourceSha256:hash(pcBytes)});assert.equal(complete.counts.convertedRecords,81);assert.equal(complete.counts.questions,77);assert.equal(complete.pqp.extensions.nativeConversion.status,'complete');
// A real type-2 multiple-choice record remains strict: accepting native Essay is
// an explicit bimodal rule, never a generic relaxation of ordinal alignment.
const strictBytes=readFileSync('ExamView/Banks/Pre-Calculus 12/Chapter 01.bnk'),strictBank=readQuestionRecords(inflateSync(strictBytes.subarray(16)));assert.equal(strictBank.records[8].typeCode,2);const corrupted=JSON.parse(readFileSync('reports/rea-examview/runtime-oracle/chapter01-auto.inventory.json','utf8'));assert.equal(corrupted.items[8].sourceId,'question_9_1');corrupted.items[8].type='Essay';const rejected=convertNativeExport({inventory:corrupted,bank:strictBank,sourceName:'Chapter 01.bnk',sourceSha256:hash(strictBytes)});assert.equal(rejected.counts.questions,8);assert.ok(!rejected.pqp.questions.some(q=>q.extensions.examview.sourceRecords.some(r=>r.number===9)));assert.ok(rejected.diagnostics.some(d=>d.message.includes('does not match')));
console.log('Bimodal regression passed: source type 4, same-bank native commands 30591/30590, both native presentations, unrepaired Area image overwrite rejected, 81/81 PC11 current records, and strict type-2 mismatch rejection.');
