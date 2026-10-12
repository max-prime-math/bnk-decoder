// Minimal EMF reader: records plus decoded drawing primitives for comparison.
const T = {
  1: 'HEADER', 2: 'POLYBEZIER', 3: 'POLYGON', 4: 'POLYLINE', 9: 'SETWINDOWEXTEX', 10: 'SETWINDOWORGEX', 11: 'SETVIEWPORTEXTEX', 12: 'SETVIEWPORTORGEX',
  14: 'EOF', 17: 'SETMAPMODE', 18: 'SETBKMODE', 19: 'SETPOLYFILLMODE', 20: 'SETROP2', 21: 'SETSTRETCHBLTMODE', 22: 'SETTEXTALIGN', 24: 'SETTEXTCOLOR',
  25: 'SETBKCOLOR', 27: 'MOVETOEX', 29: 'EXCLUDECLIPRECT', 30: 'INTERSECTCLIPRECT', 33: 'SAVEDC', 34: 'RESTOREDC', 35: 'SETWORLDTRANSFORM',
  36: 'MODIFYWORLDTRANSFORM', 37: 'SELECTOBJECT', 38: 'CREATEPEN', 39: 'CREATEBRUSHINDIRECT', 40: 'DELETEOBJECT', 42: 'ELLIPSE', 43: 'RECTANGLE',
  45: 'ARC', 46: 'CHORD', 47: 'PIE', 48: 'SELECTPALETTE', 49: 'CREATEPALETTE', 54: 'LINETO', 55: 'ARCTO', 59: 'BEGINPATH', 60: 'ENDPATH',
  61: 'CLOSEFIGURE', 62: 'FILLPATH', 63: 'STROKEANDFILLPATH', 64: 'STROKEPATH', 67: 'SELECTCLIPPATH', 70: 'GDICOMMENT', 71: 'FILLRGN',
  75: 'EXTSELECTCLIPRGN', 76: 'BITBLT', 77: 'STRETCHBLT', 80: 'SETDIBITSTODEVICE', 81: 'STRETCHDIBITS', 82: 'EXTCREATEFONTINDIRECTW',
  83: 'EXTTEXTOUTA', 84: 'EXTTEXTOUTW', 85: 'POLYBEZIER16', 86: 'POLYGON16', 87: 'POLYLINE16', 88: 'POLYBEZIERTO16', 89: 'POLYLINETO16',
  90: 'POLYPOLYLINE16', 91: 'POLYPOLYGON16', 93: 'CREATEMONOBRUSH', 94: 'CREATEDIBPATTERNBRUSHPT', 95: 'EXTCREATEPEN', 98: 'SETICMMODE',
};
export function emfRecords(buf) {
  const out = [];
  let p = 0;
  while (p + 8 <= buf.length) {
    const type = buf.readUInt32LE(p), size = buf.readUInt32LE(p + 4);
    out.push({ type, name: T[type] ?? `T${type}`, data: buf.subarray(p + 8, p + size) });
    if (type === 14 || size < 8) break;
    p += size;
  }
  return out;
}
const i32 = (d, o) => d.readInt32LE(o), u32 = (d, o) => d.readUInt32LE(o), i16 = (d, o) => d.readInt16LE(o);
const colour = (c) => '#' + [c & 255, (c >> 8) & 255, (c >> 16) & 255].map((v) => v.toString(16).padStart(2, '0')).join('');
/** Replay drawing state into primitives: lines, polylines, polygons, ellipses, text. */
export function emfPrimitives(buf) {
  const recs = emfRecords(buf);
  const objects = new Map();
  const st = { pen: null, brush: null, font: null, textColor: '#000000', align: 0, cur: [0, 0] };
  const prims = [];
  let header;
  for (const r of recs) {
    const d = r.data;
    switch (r.name) {
      case 'HEADER': header = { bounds: [0, 4, 8, 12].map((o) => i32(d, o)), frame: [16, 20, 24, 28].map((o) => i32(d, o)), device: [i32(d, 64), i32(d, 68)], mm: [i32(d, 72), i32(d, 76)] }; break;
      case 'CREATEPEN': objects.set(u32(d, 0), { kind: 'pen', style: u32(d, 4), width: i32(d, 8), colour: colour(u32(d, 16)) }); break;
      case 'EXTCREATEPEN': objects.set(u32(d, 0), { kind: 'pen', style: u32(d, 20), width: u32(d, 24), colour: colour(u32(d, 32)), brushStyle: u32(d, 28) }); break;
      case 'CREATEBRUSHINDIRECT': objects.set(u32(d, 0), { kind: 'brush', style: u32(d, 4), colour: colour(u32(d, 8)), hatch: u32(d, 12) }); break;
      case 'EXTCREATEFONTINDIRECTW': {
        const face = d.subarray(4 + 28, 4 + 28 + 64).toString('utf16le').replace(/\0.*$/s, '');
        objects.set(u32(d, 0), { kind: 'font', height: i32(d, 4), weight: i32(d, 20), italic: d[24], escapement: i32(d, 12), face });
        break;
      }
      case 'SELECTOBJECT': {
        const h = u32(d, 0);
        if (h & 0x80000000) { const stock = h & 0x7fffffff; if (stock === 5 || stock === 8) st.pen = { stock }; else if (stock <= 4) st.brush = { stock }; else st.font = { stock }; break; }
        const o = objects.get(h); if (o) st[o.kind] = o; break;
      }
      case 'SETTEXTCOLOR': st.textColor = colour(u32(d, 0)); break;
      case 'SETTEXTALIGN': st.align = u32(d, 0); break;
      case 'MOVETOEX': st.cur = [i32(d, 0), i32(d, 4)]; break;
      case 'LINETO': { const to = [i32(d, 0), i32(d, 4)]; prims.push({ t: 'line', pts: [st.cur, to], pen: st.pen }); st.cur = to; break; }
      case 'POLYLINE16': case 'POLYGON16': case 'POLYBEZIER16': case 'POLYLINETO16': case 'POLYBEZIERTO16': {
        const n = u32(d, 16); const pts = []; for (let k = 0; k < n; k++) pts.push([i16(d, 20 + k * 4), i16(d, 22 + k * 4)]);
        prims.push({ t: r.name.toLowerCase(), pts, pen: st.pen, brush: r.name === 'POLYGON16' ? st.brush : undefined }); break;
      }
      case 'POLYPOLYLINE16': case 'POLYPOLYGON16': {
        const nPolys = u32(d, 16), total = u32(d, 20); let o = 24 + nPolys * 4; const polys = [];
        for (let k = 0; k < nPolys; k++) { const c = u32(d, 24 + k * 4); const pts = []; for (let j = 0; j < c; j++, o += 4) pts.push([i16(d, o), i16(d, o + 2)]); polys.push(pts); }
        void total; prims.push({ t: r.name.toLowerCase(), polys, pen: st.pen, brush: st.brush }); break;
      }
      case 'ELLIPSE': case 'RECTANGLE': prims.push({ t: r.name.toLowerCase(), box: [0, 4, 8, 12].map((o) => i32(d, o)), pen: st.pen, brush: st.brush }); break;
      case 'EXTTEXTOUTW': {
        const x = i32(d, 28), y = i32(d, 32), n = u32(d, 36), offStr = u32(d, 40);
        const text = r.data.subarray(offStr - 8, offStr - 8 + n * 2).toString('utf16le');
        prims.push({ t: 'text', at: [x, y], text, font: st.font, colour: st.textColor, align: st.align }); break;
      }
      case 'STRETCHDIBITS': case 'BITBLT': case 'STRETCHBLT': case 'SETDIBITSTODEVICE': prims.push({ t: 'blt', rec: r.name, box: [i32(d, 16), i32(d, 20), i32(d, 24), i32(d, 28)], rop: u32(d, 32).toString(16), brush: st.brush }); break;
      default: break;
    }
  }
  return { header, prims, counts: recs.reduce((m, r) => ((m[r.name] = (m[r.name] ?? 0) + 1), m), {}) };
}
