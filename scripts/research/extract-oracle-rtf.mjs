import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname,join} from 'node:path';
const file=resolve(process.argv[2]); const out=dirname(file); const raw=readFileSync(file,'latin1');
const assets=[];let text='';let pos=0;
const re=/\{\\pict\b/g;let m;
while((m=re.exec(raw))){let depth=0,end=m.index;for(;end<raw.length;end++){if(raw[end]==='{')depth++;if(raw[end]==='}'&&!--depth) {end++;break;}}
 const group=raw.slice(m.index,end);const hex=group.replace(/^\{\\pict\s*(?:\\[a-z]+-?\d*\s*)+/,'').replace(/\}$/,'').replace(/\s/g,'');
 const n=assets.length+1;const name=`image-${String(n).padStart(4,'0')}.wmf`;const bytes=Buffer.from(hex,'hex'); mkdirSync(join(out,'assets'),{recursive:true});writeFileSync(join(out,'assets',name),bytes);assets.push({index:n,name,byteLength:bytes.length,rtfOffset:m.index,sha256:createHash('sha256').update(bytes).digest('hex'),controls:group.slice(0,group.indexOf('\n'))});text+=raw.slice(pos,m.index)+` [IMAGE:${n}] `;pos=end;re.lastIndex=end;
}
text+=raw.slice(pos);text=text.replace(/\\'(\w{2})/g,(_,h)=>String.fromCharCode(parseInt(h,16))).replace(/\\(par|line)\b\s?/g,'\n').replace(/\\tab\b\s?/g,'\t').replace(/\\[a-z]+-?\d*\s?/g,'').replace(/[{}]/g,'').replace(/\n[ \t]*\n/g,'\n');
writeFileSync(join(out,'chapter01.txt'),text);writeFileSync(join(out,'assets.json'),JSON.stringify({source:file,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),assets},null,2));console.log({assets:assets.length});
