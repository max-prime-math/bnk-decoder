import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {repairBimodalInventory,nativePromptFingerprint,alignBimodalBank,attachBimodalPresentations} from '../native-bimodal.mjs';
import {readNativeRtf} from './read-native-rtf.mjs';
import {inflateSync} from 'node:zlib';
import {readQuestionRecords} from '../../packages/bnk-core/src/records.ts';
const base='reports/rea-examview/runtime-oracle/';
const load=name=>JSON.parse(readFileSync(base+'bimodal-alignment-fixtures/'+name+'.json','utf8'));
const sa=load('area-sa'),mc=load('area-mc');
// The native ZIP reuses its last triangle for the first rectangle. Paired RTF
// contains the rectangle in both modes, with exactly equal native GDI pixels.
const rtfSa=readNativeRtf(readFileSync(base+'area-dual.bimodal-sa.rtf'));
const rtfMc=readNativeRtf(readFileSync(base+'area-dual.bimodal-mc.rtf'));
const repair=(inventory,rtf,mode)=>repairBimodalInventory({...inventory,items:[inventory.items[0]]},{rtf,rtfImage:index=>({bytes:readFileSync(base+`area-render-compare/${mode}-q1-image${index}.png`),mimeType:'image/png',originalWmfBase64:rtf.pictures[index-1].bytes.toString('base64')})});
assert.notEqual(nativePromptFingerprint(sa.items[0],sa),nativePromptFingerprint(mc.items[0],mc));
const restoredSa=repair(sa,rtfSa,'sa'),restoredMc=repair(mc,rtfMc,'mc');
assert.equal(nativePromptFingerprint(restoredSa.items[0],restoredSa),nativePromptFingerprint(restoredMc.items[0],restoredMc));
assert.equal(restoredSa.assets.at(-1).pixelWidth,restoredMc.assets.at(-1).pixelWidth);
assert.ok(restoredSa.assets.at(-1).rtfRepair.originalWmfBase64);
assert.equal(sa.items[0].question[0].html.includes('rtf-repair'),false,'repair must not mutate source evidence');
assert.throws(()=>repairBimodalInventory({...sa,items:[sa.items[0]]},{rtf:rtfSa,rtfImage:()=>undefined}),/PNG unavailable/);
const missing=structuredClone(rtfSa);missing.questions[0].text=missing.questions[0].text.replace('[IMAGE:1]','');
assert.throws(()=>repairBimodalInventory({...sa,items:[sa.items[0]]},{rtf:missing}),/association is ambiguous/);
const bank={records:[{number:1,type:'bimodal',typeCode:4}]};
assert.equal(alignBimodalBank(restoredSa,restoredMc,bank).records[0],bank.records[0]);
assert.throws(()=>attachBimodalPresentations({questions:[]},[],bank),/both bimodal/);
const pcPrimary=load('pc11-primary'),pcMc=load('pc11-mc');
const pcBank=readQuestionRecords(inflateSync(readFileSync('ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk').subarray(16)));
const reordered=alignBimodalBank(pcPrimary,pcMc,pcBank);
assert.equal(reordered.records[29].number,41,'native forced-MC ID30 is source41, established by prompt/image identity');
assert.equal(pcBank.records[29].number,30,'source bank remains unchanged');
const ambiguous=structuredClone(pcMc);ambiguous.items[0].question=ambiguous.items[1].question;
assert.throws(()=>alignBimodalBank(pcPrimary,ambiguous,pcBank),/repeated alternate prompt/);
const gqDir=base+'gq-upgraded-dual-bridge-evidence/',gq=JSON.parse(readFileSync(gqDir+'inventory-1791680102471-1365530ef9e208.json','utf8'));
const gqRtf=readNativeRtf(readFileSync(base+'gq-upgraded-dual.bimodal-sa.rtf'));
const itemIndex=gq.items.findIndex(i=>i.sourceId==='question_42_1'),item=gq.items[itemIndex];
const sourcePosition=gq.items.slice(0,itemIndex).reduce((n,i)=>n+(i.type==='Matching'?i.responses.length:1),0);
const frames=readdirSync(gqDir).filter(n=>n.startsWith('rtf-pictures-'));
const fixed=repairBimodalInventory({...gq,items:[item]},{rtf:{...gqRtf,questions:[{...gqRtf.questions[sourcePosition],answerOrdinal:1}]},rtfImage:index=>{
 const picture=gqRtf.pictures[index-1],directory=frames.find(d=>existsSync(gqDir+d+'/'+index+'.png')&&existsSync(gqDir+d+'/'+index+'.wmf')&&readFileSync(gqDir+d+'/'+index+'.wmf').equals(picture.bytes));assert.ok(directory,'Exact paired RTF frame evidence');return{bytes:readFileSync(gqDir+directory+'/'+index+'.png'),mimeType:'image/png',originalWmfBase64:picture.bytes.toString('base64')};
}});
for(const ident of ['solution','correct','incorrect'])assert.equal(fixed.items[0].feedback.find(f=>f.attributes.ident===ident).materials.filter(m=>m.html.includes('rtf-repair')).length>0,true,`Native ${ident} graphic repaired`);
console.log('Paired native Area rectangle recovered; exact cross-mode pixels, evidence retained, count/missing-image/missing-mode guards passed.');

