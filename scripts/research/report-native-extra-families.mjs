import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { createHash } from 'node:crypto';
const paths=process.argv.slice(2);
const packages=paths.length?paths:['reports/rea-examview/native-family-MMS9.pqp.json','reports/rea-examview/native-family-APL-area-complete.pqp.json','reports/rea-examview/native-family-PC11-complete.pqp.json'];
const report={scope:'Fresh native tests of one non-prior-skills Math Makes Sense 9 unit, one algorithm-heavy Foundations APL Area bank, and publisher Pre-Calculus 11 Chapter 01. Counts and actual compiler checks; not complete-family or pixel-parity claims.',families:[]};
for(const path of packages){const p=JSON.parse(readFileSync(path,'utf8')),receipt=p.extensions.nativeEvidence.receipt,hash=createHash('sha256').update(readFileSync(receipt.source)).digest('hex');assert.equal(hash,receipt.sourceSha256.toLowerCase());assert.equal(hash,receipt.sourceHashAfter.toLowerCase());assert.equal(hash,p.extensions.examviewSource.sha256);assert.equal(receipt.sameLoadedBank,true);
 const name=basename(path).replace(/\.pqp\.json$/i,'').replace(/[^A-Za-z0-9._-]+/g,'-');const compilePath=`reports/rea-examview/runtime-oracle/typst-compile/${name}-pqp.diagnostics.json`;
 report.families.push({source:receipt.source,pqp:path,evidence:p.extensions.nativeEvidence.directory,status:p.extensions.nativeConversion.status,counts:p.extensions.nativeConversion.counts,sourceSha256:hash,unchangedSource:true,sameLoadedBank:true,omitted:p.extensions.nativeConversion.omittedQuestions,diagnostics:p.diagnostics,typstCompile:existsSync(compilePath)?JSON.parse(readFileSync(compilePath,'utf8')):null});
}
writeFileSync('reports/rea-examview/native-extra-family-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.families.map(f=>({pqp:f.pqp,status:f.status,counts:f.counts,unchangedSource:f.unchangedSource,compilerErrors:f.typstCompile?.diagnostics.length??'not compiled'})),null,2));
