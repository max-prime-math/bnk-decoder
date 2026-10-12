// Extract every \pict from an RTF in document order: { index, kind, wgoal, hgoal, bytes }.
import fs from 'node:fs';
export function rtfPictures(path) {
  const rtf = fs.readFileSync(path, 'latin1');
  const out = [];
  const re = /\{\\pict\s*((?:\\[a-z]+-?\d*\s*)*)([0-9a-fA-F\s]+)\}/g;
  let m;
  while ((m = re.exec(rtf))) {
    const ctl = m[1];
    const num = (k) => Number((new RegExp(`\\\\${k}(-?\\d+)`).exec(ctl) ?? [])[1]);
    const hex = m[2].replace(/\s+/g, '');
    const kind = /wmetafile/.test(ctl) ? 'wmf' : (ctl.match(/\\([a-z]+blip|dibitmap|wbitmap)/) ?? [])[1] ?? 'other';
    out.push({ index: out.length, offset: m.index, kind, wgoal: num('picwgoal'), hgoal: num('pichgoal'), bytes: Buffer.from(hex, 'hex') });
  }
  return out;
}
if (process.argv[1].endsWith('rtf-pictures.mjs') && process.argv[2]) {
  const pics = rtfPictures(process.argv[2]);
  const sizes = {};
  for (const p of pics) sizes[p.kind] = (sizes[p.kind] ?? 0) + 1;
  console.log(pics.length, sizes, pics.filter((p) => p.wgoal > 2000).slice(0, 8).map((p) => [p.index, p.wgoal, p.hgoal, p.bytes.length]));
}
