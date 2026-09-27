// Write a folder of PQP files as a Test Generator workspace bank (banks/<name>/ in a workspace
// root), using test-generator's own importer and repository writer so the result loads exactly
// like a bank the app saved. Refuses to overwrite an existing folder.
//
//   node --experimental-strip-types scripts/export-testgen-bank.mts <pqp-dir> <out-dir> "<bank name>" [id-prefix]
//
// TEST_GENERATOR_DIR points at a test-generator checkout (default ../test-generator).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [pqpDir, outDir, bankName, idPrefix = ''] = process.argv.slice(2);
if (!pqpDir || !outDir || !bankName) {
  console.error('Usage: node --experimental-strip-types scripts/export-testgen-bank.mts <pqp-dir> <out-dir> "<bank name>" [id-prefix]');
  process.exit(1);
}
if (existsSync(outDir)) throw new Error(`${outDir} already exists; choose a new folder`);

const tg = resolve(process.env.TEST_GENERATOR_DIR ?? '../test-generator');
const load = (path: string) => import(pathToFileURL(join(tg, path)).href);
const { parseBulkImportJson } = await load('src/lib/bulk-import.ts');
const { importDraft, questionData } = await load('src/lib/editor/editor-model.ts');
const { exportAppDataToRepoEntries } = await load('src/git/repoDataModel.ts');

interface Section { id: string; name: string }
interface Unit { id: string; name: string; sections: Section[] }
interface Class { id: string; name: string; units: Unit[] }

const classes = new Map<string, Class>();
const questions: Record<string, unknown>[] = [];
const images = new Map<string, { name: string; ext: string; bytes: Uint8Array; mime: string; size: number }>();
const createdAt = Date.now();
const MIME: Record<string, string> = { svg: 'image/svg+xml', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };

for (const file of readdirSync(pqpDir).filter((name) => name.endsWith('.pqp.json')).sort()) {
  const raw = readFileSync(join(pqpDir, file), 'utf8');
  const pkg = JSON.parse(raw);
  const parsed = parseBulkImportJson(raw);
  if (!parsed || parsed.error) throw new Error(`${file}: ${parsed?.error ?? 'not a PQP file'}`);
  parsed.questions.forEach((draft: unknown, index: number) => {
    const source = pkg.questions[index];
    const c = source.classification ?? {};
    questions.push({ ...questionData(importDraft(draft)), id: `${idPrefix}${source.id}`, createdAt: createdAt + questions.length });
    // Curriculum comes from the package's own classification.
    if (!c.classId) return;
    let cls = classes.get(c.classId);
    if (!cls) classes.set(c.classId, cls = { id: c.classId, name: c.className ?? c.classId, units: [] });
    if (!c.unitId) return;
    let unit = cls.units.find((item) => item.id === c.unitId);
    if (!unit) cls.units.push(unit = { id: c.unitId, name: c.unitName ?? c.unitId, sections: [] });
    if (c.sectionId && !unit.sections.some((item) => item.id === c.sectionId)) unit.sections.push({ id: c.sectionId, name: c.sectionName ?? c.sectionId });
  });
  for (const asset of pkg.assets ?? []) {
    const ext = asset.filename.split('.').pop().toLowerCase();
    const name = asset.filename.slice(0, -(ext.length + 1));
    const bytes = new Uint8Array(readFileSync(resolve(pqpDir, asset.storage.path)));
    images.set(name, { name, ext, bytes, mime: MIME[ext] ?? 'application/octet-stream', size: bytes.byteLength });
  }
}

const entries = exportAppDataToRepoEntries(
  { questions, customClasses: [...classes.values()], savedTests: [], images: [...images.values()], narratives: [] },
  { appVersion: JSON.parse(readFileSync(join(tg, 'package.json'), 'utf8')).version },
);
for (const entry of entries) {
  const path = join(outDir, entry.path);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, entry.content);
}
writeFileSync(join(outDir, 'bank-name.json'), JSON.stringify({ name: bankName }));
console.log(`${questions.length} questions, ${images.size} images, ${classes.size} class(es) -> ${outDir}`);
console.log('In Test Generator: Reload workspace (the bank appears in the bank switcher).');
