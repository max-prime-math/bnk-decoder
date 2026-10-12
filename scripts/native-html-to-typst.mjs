// Conservative native ExamView HTML renderer. Unsupported semantics are errors,
// never silently discarded. Image resolution is owned by the importing bridge.
import { SYMBOL_FONT } from '../packages/bnk-core/src/equations.ts';
// Official Adobe Symbol encoding: https://www.unicode.org/Public/MAPPINGS/VENDORS/ADOBE/symbol.txt
// C1 is black-letter I (U+2111). Do not infer a degree symbol from question prose.
const NATIVE_SYMBOL_FONT={...SYMBOL_FONT,0xc1:'ℑ'};
// Verified against the publisher's original Chapter 11 PDF (SHA-256
// bc2248c8f83881687a632291ff692e02c549171029e4b28e4e83190a9cbf5610):
// page 15 uses its embedded symbol font to draw both Euclid Symbol byte A5
// occurrences as infinity. PDF.js preserves those glyphs as U+F0A5. Keep this
// map face-specific because legacy symbol fonts assign different meanings to
// the same byte values.
const VERIFIED_LEGACY_FONT={
 'Euclid Symbol':new Map([[0xa5,'∞']]),
};
const ENTITIES={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0',ndash:'–',mdash:'—',deg:'°',times:'×',divide:'÷',minus:'−',le:'≤',ge:'≥',ne:'≠',pi:'π',theta:'θ',infin:'∞',hellip:'…',lsquo:'‘',rsquo:'’',ldquo:'“',rdquo:'”'};
export function decodeNativeEntities(text,errors=[]) {
 return text.replace(/&([^;\s]+);/g,(all,name)=>{
  if(name[0]==='#'){if(!/^#(?:x[0-9a-f]+|[0-9]+)$/i.test(name)){errors.push(`invalid HTML character reference ${all}`);return '';}const n=name[1]?.toLowerCase()==='x'?Number.parseInt(name.slice(2),16):Number(name.slice(1));if(n<=0||n>0x10ffff||n>=0xd800&&n<=0xdfff){errors.push(`invalid HTML character reference ${all}`);return '';}return String.fromCodePoint(n);}
  if(ENTITIES[name]!==undefined)return ENTITIES[name];errors.push(`unsupported HTML entity ${all}`);return '';
 });
}
const quote=s=>JSON.stringify(s);
const escape=s=>s.replace(/[\\#\[\]$*_`<>@]/g,'\\$&');
const tags=new Set(['b','strong','i','em','u','sub','sup','p','div','br','img','span','table','thead','tbody','tfoot','tr','td','th']);
const allowedAttrs={img:['src','width','height','align','alt','border'],span:['style'],p:['align','style'],div:['align','style'],table:['border','cellpadding','cellspacing','width','align','style'],tr:['valign','height','style'],td:['rowspan','colspan','align','valign','width','style','bgcolor'],th:['rowspan','colspan','align','valign','width','style','bgcolor']};
const voids=new Set(['img','br']);
function parse(html,errors){
 const root={tag:'root',attrs:{},children:[]},stack=[root];let p=0;
 while(p<html.length){
  if(html.startsWith('<!--',p)){const end=html.indexOf('-->',p+4);if(end<0){errors.push('unterminated HTML comment');break;}p=end+3;continue;}
  if(html[p]!=='<'){const end=html.indexOf('<',p);stack.at(-1).children.push({text:decodeNativeEntities(html.slice(p,end<0?html.length:end),errors)});p=end<0?html.length:end;continue;}
  const match=/^<\s*(\/?)\s*([a-z][a-z0-9]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/i.exec(html.slice(p));
  if(!match){errors.push(`invalid HTML markup at ${p}`);break;}p+=match[0].length;const tag=match[2].toLowerCase();
  if(!tags.has(tag))errors.push(`unsupported HTML tag ${tag}`);
  if(match[1]){if(match[3].trim())errors.push(`attributes on closing HTML tag ${tag}`);if(stack.at(-1).tag!==tag){errors.push(`mismatched closing HTML tag ${tag}`);continue;}stack.pop();continue;}
  const attrs={};let rest=match[3].trim().replace(/\/$/,'').trim();
  while(rest){const a=/^([a-z_:][a-z0-9_:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))\s*/i.exec(rest);if(!a){errors.push(`invalid attributes on HTML tag ${tag}`);break;}const key=a[1].toLowerCase();if(Object.hasOwn(attrs,key))errors.push(`duplicate HTML attribute ${tag}.${key}`);attrs[key]=decodeNativeEntities(a[2]??a[3]??a[4],errors);if(!(allowedAttrs[tag]??[]).includes(key))errors.push(`unsupported HTML attribute ${tag}.${key}`);rest=rest.slice(a[0].length);}
  const node={tag,attrs,children:[]};stack.at(-1).children.push(node);if(!voids.has(tag)){stack.push(node);if(stack.length>100){errors.push('HTML nesting exceeds 100');break;}}
 }
 if(stack.length>1)errors.push(`unclosed HTML tag ${stack.at(-1).tag}`);return root;
}
export function renderNativeHtml(html,{image,fontText}={}){
 const errors=[];if(typeof html!=='string')return{typst:'',errors:['HTML content must be a string']};const root=parse(html,errors);
 function children(n,symbol=false){return n.children.map(c=>render(c,symbol)).join('');}
 function style(n,symbol=false,renderedFont=false){
  const wrappers=[];let useSymbol=symbol,align;
  for(const part of (n.attrs.style??'').split(';').filter(s=>s.trim())){const colon=part.indexOf(':');if(colon<0){errors.push('invalid native HTML style');continue;}const key=part.slice(0,colon).trim().toLowerCase(),value=part.slice(colon+1).trim();
   if(key==='font-family'&&/^(['"]?)Symbol\1$/i.test(value))useSymbol=true;
   else if(key==='font-family'&&/^(['"]?)(?:Times|Times New Roman)\1$/i.test(value)){useSymbol=false;wrappers.push(s=>`#text(font: "Times New Roman")[${s}];`);}
   else if(key==='font-family'&&(renderedFont||!hasTextGlyph(n))){} // Native font pixels or a span without glyphs.
   else if(key==='font-size'&&/^\d+(?:\.\d+)?pt$/i.test(value)&&Number.parseFloat(value)>0&&Number.parseFloat(value)<300)wrappers.push(s=>`#text(size: ${Number.parseFloat(value)}pt)[${s}];`);
   else if(key==='color'&&/^#[0-9a-f]{6}$/i.test(value))wrappers.push(s=>`#text(fill: rgb(${quote(value)}))[${s}];`);
   else if(key==='text-align'&&['left','center','right','justify'].includes(value)&&['p','div','td','th','tr'].includes(n.tag))align=value;
   else if(key==='border'&&value==='none'&&['tr','td','th','table'].includes(n.tag)){}
   else errors.push(`unsupported native HTML style ${key}: ${value}`);
  }
  return{symbol:useSymbol,align,wrap(content){for(const wrap of wrappers)content=wrap(content);return content;}};
 }
 function render(n,symbol=false){
  if(n.text!==undefined){let text=n.text.replace(/[\t\r\n ]+/g,' ');if(symbol)text=[...text].map(c=>{const code=c.codePointAt(0);if(code===0xa0)return c;const mapped=NATIVE_SYMBOL_FONT[code];if(mapped===undefined){errors.push(`unmapped native Symbol glyph U+${code.toString(16).toUpperCase()}`);return '';}return mapped;}).join('');return escape(text);}
  const a=n.attrs;let content;
  if(n.tag==='span'){
   const families=(a.style??'').split(';').map(part=>/^\s*font-family\s*:\s*(.+?)\s*$/i.exec(part)).filter(Boolean);
   const family=families.length===1?families[0][1]:undefined;
   const unknown=family&&!/^(['"]?)(?:Symbol|Times|Times New Roman)\1$/i.test(family);
   if(unknown&&hasTextGlyph(n)&&typeof fontText==='function'&&n.children.every(c=>c.text!==undefined)){
    const name=/^(?:'([^']+)'|"([^"]+)"|([A-Za-z][A-Za-z0-9 -]*))$/.exec(family);
    if(!name){errors.push('unsupported native font family syntax');return '';}
    const fontName=name[1]??name[2]??name[3],text=n.children.map(c=>c.text).join('').replace(/[\t\r\n ]+/g,' ');
    let rendered;
    try{const result=fontText(fontName,text,{...a});if(typeof result==='string')rendered=result;else if(result&&typeof result.typst==='string'){rendered=result.typst;errors.push(...(result.errors??[]));}else errors.push(`invalid native font resolver result: ${fontName}`);}catch(e){errors.push(`native font resolver failed: ${fontName}: ${e.message}`);}
    if(!rendered?.trim()){errors.push(`native font resolver produced no glyph content: ${fontName}`);return '';}
    return style(n,symbol,true).wrap(rendered);
   }
   if(unknown&&hasTextGlyph(n)&&n.children.every(c=>c.text!==undefined)){
    const name=/^(?:'([^']+)'|"([^"]+)"|([A-Za-z][A-Za-z0-9 -]*))$/.exec(family);
    const fontName=name?.[1]??name?.[2]??name?.[3],fontMap=VERIFIED_LEGACY_FONT[fontName];
    const text=n.children.map(c=>c.text).join('').replace(/[\t\r\n ]+/g,' ');
    if(fontMap&&[...text].every(c=>fontMap.has(c.codePointAt(0)))){
     return style(n,symbol,true).wrap(escape([...text].map(c=>fontMap.get(c.codePointAt(0))).join('')));
    }
   }
   const s=style(n,symbol);return s.wrap(children(n,s.symbol));
  }
  if(n.tag==='img'){
   if(!a.src){errors.push('native image has no src');return '';}
   for(const key of ['width','height'])if(a[key]!==undefined&&!/^[1-9]\d{0,5}$/.test(a[key]))errors.push(`invalid native image ${key}`);
   if(a.align&&!['top','middle','bottom','left','right'].includes(a.align))errors.push(`unsupported native image align ${a.align}`);
   if(a.border!==undefined&&a.border!=='0')errors.push('unsupported native image border');
   if(typeof image!=='function'){errors.push(`native image resolver missing: ${a.src}`);return '';}
   try{const result=image(a.src,{...a});if(typeof result==='string')return result;if(result&&typeof result.typst==='string'){errors.push(...(result.errors??[]));return result.typst;}errors.push(`invalid native image resolver result: ${a.src}`);}catch(e){errors.push(`native image resolver failed: ${a.src}: ${e.message}`);}return '';
  }
  if(n.tag==='table')return table(n,symbol);
  content=['p','div'].includes(n.tag)?'':children(n,symbol);
  switch(n.tag){case'root':return content;case'b':case'strong':return `#strong[${content}];`;case'i':case'em':return `#emph[${content}];`;case'u':return `#underline[${content}];`;case'sub':return `#sub[${content}];`;case'sup':return `#super[${content}];`;case'br':return '#linebreak();\n';case'p':case'div':{const s=style(n,symbol),alignment=s.align??a.align;content=s.wrap(children(n,s.symbol));if(alignment&&!['left','center','right','justify'].includes(alignment))errors.push(`unsupported native paragraph alignment ${alignment}`);return `\n\n${alignment&&alignment!=='left'?alignment==='justify'?`#par(justify: true)[${content}];`:`#align(${alignment})[${content}];`:content}\n\n`;}
   case'tr':case'td':case'th':case'thead':case'tbody':case'tfoot':errors.push(`native ${n.tag} outside table`);return content;
   default:return content;
  }
 }
 function table(n,symbol){
  const rows=[];for(const c of n.children){if(c.text!==undefined){if(c.text.trim())errors.push('text directly inside native table');}else if(c.tag==='tr')rows.push(c);else if(['thead','tbody','tfoot'].includes(c.tag)){for(const r of c.children)if(r.tag==='tr')rows.push(r);else if(r.text?.trim()||r.tag)errors.push('invalid native table section child');}else errors.push(`invalid native table child ${c.tag}`);}
  if(!rows.length){errors.push('native table has no rows');return '';}
  const occupied=[],cells=[],columnWidths=[],rowHeights=[];let cols=0;const tableStyle=style(n,symbol);
  rows.forEach((r,y)=>{const rowStyle=style(r,tableStyle.symbol);if(r.attrs.valign&&!['top','middle','bottom'].includes(r.attrs.valign))errors.push('unsupported native table row vertical alignment');if(r.attrs.height!==undefined){if(/^\d{1,5}$/.test(r.attrs.height)){if(Number(r.attrs.height)===0)rowHeights[y]='auto';else errors.push(`unsupported native table minimum row height ${r.attrs.height}`);}else errors.push('invalid native table row height');}let x=0;for(const c of r.children){if(c.text!==undefined){if(c.text.trim())errors.push('text directly inside native table row');continue;}if(!['td','th'].includes(c.tag)){errors.push(`invalid native table cell ${c.tag}`);continue;}
   while(occupied[y]?.[x])x++;let rs=Number(c.attrs.rowspan??1),cs=Number(c.attrs.colspan??1);if(!Number.isInteger(rs)||!Number.isInteger(cs)||rs<1||cs<1||rs>100||cs>100||y+rs>rows.length){errors.push('invalid native table cell span');rs=cs=1;}
   for(let dy=0;dy<rs;dy++)for(let dx=0;dx<cs;dx++){occupied[y+dy]??=[];if(occupied[y+dy][x+dx])errors.push('overlapping native table cells');occupied[y+dy][x+dx]=true;}
   if(c.attrs.width){if(cs!==1)errors.push('unsupported native spanned cell width');else {const length=htmlLength(c.attrs.width,true);if(!length)errors.push('invalid native table cell width');else if(columnWidths[x]&&columnWidths[x]!==length)errors.push('conflicting native table column widths');else columnWidths[x]=length;}}
   const cellStyle=style(c,rowStyle.symbol),alignment=cellStyle.align??c.attrs.align??rowStyle.align,valign=c.attrs.valign??r.attrs.valign;if(valign&&!['top','middle','bottom'].includes(valign))errors.push('unsupported native table vertical alignment');if(alignment&&!['left','center','right'].includes(alignment))errors.push('unsupported native table cell alignment');
   const strokeNone=/border\s*:\s*none(?:;|$)/i.test(`${r.attrs.style??''};${c.attrs.style??''}`);
   if(c.attrs.bgcolor&&!/^#[0-9a-f]{6}$/i.test(c.attrs.bgcolor))errors.push('invalid native table cell background color');
   const params=[`x: ${x}`,`y: ${y}`,`colspan: ${cs}`,`rowspan: ${rs}`,...(strokeNone?['stroke: none']:[]),...(/^#[0-9a-f]{6}$/i.test(c.attrs.bgcolor??'')?[`fill: rgb(${quote(c.attrs.bgcolor)})`]:[]),...(alignment?[`align: ${alignment}${valign?` + ${valign==='middle'?'horizon':valign}`:''}`]:valign?[`align: ${valign==='middle'?'horizon':valign}`]:[])];let text=cellStyle.wrap(children(c,cellStyle.symbol));text=rowStyle.wrap(text);if(c.tag==='th')text=`#strong[${text}];`;cells.push(`table.cell(${params.join(', ')})[${text}]`);x+=cs;cols=Math.max(cols,x);
  }});
  // HTML permits rows with fewer cells than the table grid. Retain each source
  // coordinate and represent the absent cells as blank, borderless content.
  for(let y=0;y<rows.length;y++)for(let x=0;x<cols;x++)if(!occupied[y]?.[x])cells.push(`table.cell(x: ${x}, y: ${y}, stroke: none)[]`);
  const a=n.attrs;if(a.cellspacing!==undefined&&a.cellspacing!=='0')errors.push('unsupported native table cellspacing');const width=a.width?htmlLength(a.width):undefined;if(a.width&&!width)errors.push('invalid native table width');if(a.align&&!['left','center','right'].includes(a.align))errors.push('unsupported native table alignment');
  const padding=a.cellpadding===undefined?'5pt':/^\d{1,3}$/.test(a.cellpadding)?`${Number(a.cellpadding)*0.75}pt`:(errors.push('invalid native table padding'),'5pt');
  const border=a.border===undefined?'none':/^\d{1,2}$/.test(a.border)?a.border==='0'?'none':`${Number(a.border)*0.75}pt`:(errors.push('invalid native table border'),'none');
  let rendered=`#table(columns: ${columnWidths.length||width?`(${Array.from({length:cols},(_,i)=>columnWidths[i]??(width?'1fr':'auto')).join(', ')},)`:cols}${rowHeights.length?`, rows: (${Array.from({length:rows.length},(_,i)=>rowHeights[i]??'auto').join(', ')},)`:''}, inset: ${padding}, stroke: ${/border\s*:\s*none(?:;|$)/i.test(a.style??'')?'none':border},\n${cells.join(',\n')});`;
  if(width)rendered=`#block(width: ${width})[${rendered}];`;rendered=tableStyle.wrap(rendered);if(a.align&&a.align!=='left')rendered=`#align(${a.align})[${rendered}];`;return `\n${rendered}\n`;
 }
 function htmlLength(value,allowZero=false){if(/^\d+(?:\.\d+)?%$/.test(value)&&Number.parseFloat(value)>=(allowZero?0:Number.EPSILON)&&Number.parseFloat(value)<=100)return `${Number.parseFloat(value)}%`;if(/^\d{1,5}$/.test(value)&&Number(value)>=(allowZero?0:1))return `${Number(value)*0.75}pt`;return undefined;}
 function hasTextGlyph(n){return n.children.some(c=>c.text!==undefined?c.text.trim().length>0:hasTextGlyph(c));}
 const typst=render(root).trim();return{typst,errors:[...new Set(errors)]};
}
