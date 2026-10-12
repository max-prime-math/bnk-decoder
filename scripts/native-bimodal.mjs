// Alternate native presentations may reorder IDs. Match their prompts and exact
// native image bytes; source numbers are usable only after this alignment.
import { createHash } from 'node:crypto';
import { decodeNativeEntities } from './native-html-to-typst.mjs';
const digest=b=>createHash('sha256').update(b).digest('hex');
const types={ 'Multiple Choice':['multiple-choice','bimodal','yes-no'],'Multiple Answer':['multiple-response'],'Multiple Response':['multiple-response'],'True/False':['true-false'],'True False':['true-false'],'Yes/No':['yes-no'],'Fill in the Blank':['completion'],Matching:['matching'],Essay:['short-answer','problem','bimodal'],'Short Answer':['short-answer','problem','bimodal'] };
function fail(message){throw new Error(`Bimodal alignment: ${message}`);}
/** Repair native Blackboard's reused generated-image filenames from its paired RTF.
 * Each association is local to the same export, before cross-export alignment. */
export function repairBimodalInventory(inventory,{rtf,rtfImage,rationaleReferenceInventory}){
 const output=structuredClone(inventory),added=[],repairs=[];let cursor=0;
 const generated=src=>/^mc\d+-\d+\.jpe?g$/i.test(src.split('/').at(-1));
 function references(materials){const refs=[];for(const material of materials??[])renderScan(material.html,src=>{if(generated(src))refs.push(src);});return refs;}
 function renderScan(html,visit){for(const match of html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)){const src=/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(match[0]);if(!src)fail('generated image has no src');visit(decodeNativeEntities(src[1]??src[2]??src[3],[]));}}
 // RTF may omit rationale: require an independent nonaliased native export.
 function preserveRationale(materials,item){
  if(!rationaleReferenceInventory)fail(item.sourceId+' rationale absent from paired RTF requires independent native evidence');
  const key=nativePromptFingerprint(item,{...output,assets:[...(output.assets??[]),...added]}),matches=rationaleReferenceInventory.items.filter(i=>nativePromptFingerprint(i,rationaleReferenceInventory)===key);
  if(matches.length!==1)fail(item.sourceId+' rationale reference prompt is missing or ambiguous');
  const reference=matches[0],referenceMaterials=(reference.feedback??[]).filter(f=>f.attributes.ident==='correct').flatMap(f=>f.materials??[]);
  if(nativePromptFingerprint({question:materials},output)!==nativePromptFingerprint({question:referenceMaterials},rationaleReferenceInventory))fail(item.sourceId+' rationale differs from independent native feedback');
  const sizes=blocks=>blocks.flatMap(m=>[...m.html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map(tag=>['width','height'].map(name=>Number(new RegExp('\\b'+name+'\\s*=\\s*["\']?(\\d+)','i').exec(tag[0])?.[1]))));
  if(JSON.stringify(sizes(materials))!==JSON.stringify(sizes(referenceMaterials)))fail(item.sourceId+' rationale dimensions differ from independent native feedback');
  const refs=references(referenceMaterials);
  for(const src of refs){
   const asset=rationaleReferenceInventory.assets.find(a=>a.entry===src);
   for(const other of rationaleReferenceInventory.items)if(other!==reference&&(other.materials??[]).some(m=>references([m]).includes(src)))fail(item.sourceId+' independent rationale filename is aliased');
   for(const material of referenceMaterials)for(const tag of material.html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)){
    if(!tag[0].includes(src))continue;const dimension=name=>Number(new RegExp('\\b'+name+'\\s*=\\s*["\']?(\\d+)','i').exec(tag[0])?.[1]);
    if(!asset||asset.pixelWidth!==dimension('width')||asset.pixelHeight!==dimension('height'))fail(item.sourceId+' independent rationale image dimensions disagree');
   }
   repairs.push({sourceId:item.sourceId,preservation:'paired RTF omits rationale; independently matched native feedback bytes',referenceSourceId:reference.sourceId,referenceEntry:src,sha256:asset.sha256});
  }
 }
 function replace(materials,indexes,label,item){const refs=references(materials);if(refs.length!==indexes.length)fail(`${item.sourceId} ${label} generated image count ${refs.length} differs from paired RTF ${indexes.length}`);let at=0;
  for(const material of materials??[])material.html=material.html.replace(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi,tag=>{const src=/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);if(!src)return tag;const original=decodeNativeEntities(src[1]??src[2]??src[3],[]);if(!generated(original))return tag;const index=indexes[at++],picture=rtfImage?.(index);if(!picture?.bytes||picture.mimeType!=='image/png')fail(`paired RTF PNG unavailable ${index}`);const bytes=Buffer.from(picture.bytes);if(bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')fail(`invalid paired RTF PNG ${index}`);const sha256=digest(bytes),entry=`rtf-repair/${item.ordinal}-${label}-${index}-${sha256.slice(0,16)}.png`,repair={originalEntry:original,rtfPictureIndex:index,originalWmfBase64:picture.originalWmfBase64,widthTwips:picture.widthTwips,heightTwips:picture.heightTwips,baselineShiftPoints:picture.baselineShiftPoints,rasterization:picture.rasterization};added.push({entry,sha256,byteLength:bytes.length,base64:bytes.toString('base64'),pixelWidth:bytes.readUInt32BE(16),pixelHeight:bytes.readUInt32BE(20),rtfRepair:repair});repairs.push({sourceId:item.sourceId,...repair,entry});return tag.replace(src[0],`src="${entry}"`);});
 }
 for(const item of output.items??[]){const count=item.type==='Matching'?item.responses?.length??0:1,ordinal=cursor+1;cursor+=count;
  if(!['Multiple Choice','Essay','Short Answer'].includes(item.type))continue;
  const promptRefs=references(item.question),feedback=ident=>(item.feedback??[]).filter(f=>f.attributes.ident===ident).flatMap(f=>f.materials??[]),solution=feedback('solution'),correct=feedback('correct'),incorrect=feedback('incorrect'),isEssay=['Essay','Short Answer'].includes(item.type),solutionRefs=isEssay?references(solution):[],correctRefs=isEssay?references(correct):[],incorrectRefs=isEssay?references(incorrect):[];
  if(!promptRefs.length&&!solutionRefs.length&&!correctRefs.length&&!incorrectRefs.length)continue;
  const candidates=(rtf?.questions??[]).filter(q=>q.answerOrdinal===ordinal);if(candidates.length!==1||!candidates[0].hasAnswerMarker)fail(`paired RTF question unavailable at source position ${ordinal}`);const q=candidates[0],answerAt=q.text.indexOf('ANS:\t');let prompt=q.text.slice(0,answerAt);
  if(item.type==='Multiple Choice'){const markers=[...prompt.matchAll(/(?:^|[\n\t])([A-Z])(?:\.)?\t/gi)],count=item.responses?.[0]?.labels?.length,labels=markers.map(m=>m[1].toUpperCase()).sort();if(!Number.isInteger(count)||count<1||markers[0]?.[1]?.toUpperCase()!=='A'||labels.length!==count||labels.some((letter,n)=>letter!==String.fromCharCode(65+n)))fail(`ambiguous paired RTF choice boundary ${item.sourceId}`);prompt=prompt.slice(0,markers[0].index);}
  const ids=text=>[...text.matchAll(/\[IMAGE:(\d+)\]/g)].map(m=>Number(m[1]));
  // Narrative images have their own na* entries and precede generated prompt images.
  const promptPictures=ids(prompt),nonGenerated=[];let generatedSeen=false;for(const material of item.question??[])renderScan(material.html,src=>{if(generated(src))generatedSeen=true;else{if(generatedSeen||!/^nar?\d+-\d+\.jpe?g$/i.test(src.split('/').at(-1)))fail(`${item.sourceId} non-generated prompt image order is unsupported`);nonGenerated.push(src);}});
  // RTF prints a shared narrative once, before its numbered questions; Blackboard
  // repeats it in each prompt. Its nar* assets are not generated mc* aliases.
  const narrativePrefix=promptPictures.length===promptRefs.length?0:nonGenerated.length;
  if(promptPictures.length!==promptRefs.length+narrativePrefix)fail(`${item.sourceId} prompt image association is ambiguous`);
  replace(item.question,promptPictures.slice(narrativePrefix),'prompt',item);
  if(isEssay&&(solutionRefs.length||correctRefs.length||incorrectRefs.length)){const answerPictures=ids(q.answer);if(incorrectRefs.length&&(incorrectRefs.length!==correctRefs.length||JSON.stringify(incorrectRefs)!==JSON.stringify(correctRefs)))fail(`${item.sourceId} incorrect-feedback images are not the same native rationale`);const omittedRationale=correctRefs.length>0&&answerPictures.length===solutionRefs.length;if(answerPictures.length!==solutionRefs.length+correctRefs.length&&!omittedRationale)fail(`${item.sourceId} RTF answer images do not match solution then rationale`);if(omittedRationale)preserveRationale(correct,item);replace(solution,answerPictures.slice(0,solutionRefs.length),'solution',item);if(!omittedRationale){replace(correct,answerPictures.slice(solutionRefs.length),'correct',item);if(incorrectRefs.length)replace(incorrect,answerPictures.slice(solutionRefs.length),'incorrect',item);}}
 }
 output.assets=[...(output.assets??[]),...added];output.rtfRepairs=repairs;return output;
}
function assets(inventory){const result=new Map();for(const asset of inventory.assets??[]){if(result.has(asset.entry))fail(`duplicate image path ${asset.entry}`);if(typeof asset.base64!=='string')fail(`image bytes unavailable ${asset.entry}`);const bytes=Buffer.from(asset.base64,'base64'),hash=digest(bytes);if(asset.sha256?.toLowerCase()!==hash||asset.byteLength!==bytes.length)fail(`image digest/length mismatch ${asset.entry}`);result.set(asset.entry,hash);}return result;}
/** Stable across native item IDs and image filenames; images remain ordered. */
export function nativePromptFingerprint(item,inventory){
 const images=assets(inventory),errors=[];const chunks=[];
 for(const material of item.question??[]){if(typeof material.html!=='string')fail('prompt has no decoded HTML');let cursor=0;const html=material.html;
  while(cursor<html.length){if(html.startsWith('<!--',cursor)){const end=html.indexOf('-->',cursor+4);if(end<0)fail('unterminated HTML comment');cursor=end+3;continue;}
   if(html[cursor]!=='<'){const end=html.indexOf('<',cursor);chunks.push(decodeNativeEntities(html.slice(cursor,end<0?html.length:end),errors));cursor=end<0?html.length:end;continue;}
   const tag=/^<\s*(\/?)\s*([a-z][a-z0-9]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/i.exec(html.slice(cursor));if(!tag)fail('malformed prompt HTML');cursor+=tag[0].length;const name=tag[2].toLowerCase();
   if(['br','p','div','td','th','tr','table'].includes(name))chunks.push(' ');
   if(name==='img'&&!tag[1]){let rest=tag[3].trim().replace(/\/$/,'').trim(),src;const seen=new Set();while(rest){const a=/^([a-z_:][a-z0-9_:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))\s*/i.exec(rest);if(!a)fail('malformed image attributes');const key=a[1].toLowerCase();if(seen.has(key))fail(`duplicate image attribute ${key}`);seen.add(key);if(key==='src')src=decodeNativeEntities(a[2]??a[3]??a[4],errors);rest=rest.slice(a[0].length);}const hash=images.get(src);if(!hash)fail(`referenced image missing ${src}`);chunks.push(` ⟦image:${hash}⟧ `);}
  }
  chunks.push(' ');
 }
 if(errors.length)fail(errors.join('; '));const normalized=chunks.join('').normalize('NFC').replace(/\s+/gu,' ').trim();if(!normalized)fail('empty native prompt');return digest(Buffer.from(normalized,'utf8'));
}
function groups(inventory,bank){let cursor=0;const result=[];for(const item of inventory.items??[]){const count=item.type==='Matching'?item.responses?.length??0:1,records=bank.records.slice(cursor,cursor+count);if(count<1||records.length!==count||records.some(r=>!types[item.type]?.includes(r.type)))fail(`primary ${item.type} cannot consume source positions ${cursor+1}–${cursor+count}`);if(item.type==='Matching'&&(records.some(r=>r.groupId!==records[0].groupId)||records[0].groupId===undefined))fail('primary matching records are not one group');result.push({item,records});cursor+=count;}if(cursor!==bank.records.length)fail(`primary export covers ${cursor}/${bank.records.length} source records`);return result;}
/** Return a bank with records in alternate native item order. Never mutate input. */
export function alignBimodalBank(primaryInventory,alternateInventory,bank){
 if(!Array.isArray(bank?.records)||!Array.isArray(primaryInventory?.items)||!Array.isArray(alternateInventory?.items))fail('bank and native item arrays are required');
 const primary=groups(primaryInventory,bank),byFingerprint=new Map();
 for(const group of primary){const key=nativePromptFingerprint(group.item,primaryInventory);const matches=byFingerprint.get(key)??[];matches.push(group);byFingerprint.set(key,matches);}
 if(alternateInventory.items.length!==primary.length)fail('alternate native item count differs');
 const records=[],seen=new Set();
 for(const item of alternateInventory.items){const key=nativePromptFingerprint(item,alternateInventory),matches=byFingerprint.get(key)??[];if(matches.length!==1)fail(`${matches.length?'ambiguous':'missing'} prompt fingerprint for ${item.sourceId??'alternate item'}`);const match=matches[0];if(seen.has(match))fail(`repeated alternate prompt ${item.sourceId??''}`);if(match.records.some(r=>!types[item.type]?.includes(r.type)))fail(`alternate ${item.type} incompatible with matched source type`);if(item.type==='Matching'&&item.responses?.length!==match.records.length)fail('alternate matching stem count differs');seen.add(match);records.push(...match.records);}
 if(seen.size!==primary.length)fail('alternate source coverage incomplete');
 return{...bank,records};
}
function sourceNumber(question){const records=question.extensions?.examview?.sourceRecords;if(records?.length!==1)return undefined;return records[0].number;}
/** Attach only verified original type-4 variants; merge embedded assets by ID. */
export function attachBimodalPresentations(pqp,alternates,bank){
 const numbers=new Set(bank.records.filter(r=>r.typeCode===4&&r.type==='bimodal').map(r=>r.number));
 const variants=new Map(),assetMap=new Map((pqp.assets??[]).map(a=>[a.id,a]));const modes=new Set();
 for(const alternate of alternates??[]){if(!['multiple-choice','short-answer'].includes(alternate.mode)||modes.has(alternate.mode))fail('alternate presentation mode is missing, invalid or duplicated');modes.add(alternate.mode);const alt=alternate.pqp;
  if(!alt||alt.extensions?.nativeConversion?.status!=='complete'||alt.extensions.nativeConversion.counts.sourceRecords!==bank.records.length)fail(`alternate ${alternate.mode} conversion is incomplete`);
  if(alt.extensions.nativeConversion.sourceSha256!==pqp.extensions?.nativeConversion?.sourceSha256)fail('alternate source bank digest differs');
  const byNumber=new Map();for(const q of alt.questions??[]){const number=sourceNumber(q);if(!numbers.has(number))continue;if(byNumber.has(number))fail(`duplicate converted bimodal source ${number}`);if(q.kind!==(alternate.mode==='multiple-choice'?'mcq':'frq'))fail(`converted bimodal ${number} has wrong presentation kind`);byNumber.set(number,q);}
  for(const number of numbers){const q=byNumber.get(number);if(!q)fail(`missing converted bimodal source ${number}`);const used=new Set(q.assets??[]);for(const id of used){const asset=(alt.assets??[]).find(a=>a.id===id);if(!asset)fail(`alternate question asset missing ${id}`);const previous=assetMap.get(id);if(previous&&(previous.mimeType!==asset.mimeType||previous.storage?.base64!==asset.storage?.base64||previous.filename!==asset.filename))fail(`conflicting alternate asset ${id}`);assetMap.set(id,previous??asset);}
   const list=variants.get(number)??[];list.push({mode:alternate.mode,kind:q.kind,content:q.content,answer:q.answer,scoring:q.scoring,...(q.assets?.length?{assets:[...q.assets]}:{}),nativeSourceId:q.extensions.examview.nativeSourceId,nativeExportOrdinal:q.extensions.examview.nativeExportOrdinal,nativeExport:q.extensions.examview.nativeExport,rtfRepairs:(alt.extensions.nativeConversion.rtfRepairs??[]).filter(evidence=>evidence.sourceId===q.extensions.examview.nativeSourceId)});variants.set(number,list);
  }
 }
 if(numbers.size&&(modes.size!==2||!modes.has('multiple-choice')||!modes.has('short-answer')))fail('both bimodal presentation modes are required');
 const questions=pqp.questions.map(q=>{const number=sourceNumber(q);if(!numbers.has(number))return q;const presentations=variants.get(number)??[];if(presentations.length!==modes.size)fail(`primary bimodal ${number} alternate coverage incomplete`);return{...q,extensions:{...q.extensions,examview:{...q.extensions.examview,bimodalPresentations:presentations}}};});
 for(const number of numbers)if(!questions.some(q=>sourceNumber(q)===number))fail(`primary converted bimodal source missing ${number}`);
 const merged=[...assetMap.values()],coverage={sourceBimodalRecords:numbers.size,modes:[...modes],attachedPresentations:[...variants.values()].reduce((n,list)=>n+list.length,0)};
 return{...pqp,questions,assets:merged,extensions:{...pqp.extensions,nativeConversion:{...pqp.extensions.nativeConversion,counts:{...pqp.extensions.nativeConversion.counts,assets:merged.length},bimodalCoverage:coverage}}};
}
