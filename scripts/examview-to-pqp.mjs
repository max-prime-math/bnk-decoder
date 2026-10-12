#!/usr/bin/env node
// Windows native rendering bridge. Source bank is copied; all native evidence is retained.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { readQuestionRecords } from '../packages/bnk-core/src/records.ts';
import { readNativeRtf } from './research/read-native-rtf.mjs';
import { convertNativeExport } from './native-export-to-pqp.mjs';
import { alignBimodalBank, attachBimodalPresentations, repairBimodalInventory } from './native-bimodal.mjs';

const hash = b => createHash('sha256').update(b).digest('hex');
const repository = fileURLToPath(new URL('..', import.meta.url));
function powershell(script, args) {
  const command = ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', resolve(repository, script), ...args];
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.toLowerCase() === 'psmodulepath') delete env[key];
  const options = { env, encoding: 'utf8', timeout: 300000, maxBuffer: 10 * 1024 * 1024 };
  let result = spawnSync('pwsh.exe', command, options);
  if (result.error?.code === 'ENOENT') result = spawnSync('powershell.exe', command, options);
  if (result.error || result.status !== 0) throw new Error(`${basename(script)}: ${result.error?.message || result.stderr || result.stdout}`);
  return result.stdout;
}
function nodeScript(script, args, acceptedStatuses = [0]) {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', resolve(repository, script), ...args], {
    cwd: repository,
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || !acceptedStatuses.includes(result.status)) {
    throw new Error(`${basename(script)}: ${result.error?.message || result.stderr || result.stdout || `exit ${result.status}`}`);
  }
  return result.stdout;
}
function main() {
  const args = process.argv.slice(2);
  const evidenceAt = args.indexOf('--evidence');
  let existingEvidence;
  if (evidenceAt >= 0) {
    if (!args[evidenceAt + 1]) throw new Error('--evidence requires an existing native evidence directory.');
    existingEvidence = resolve(args[evidenceAt + 1]); args.splice(evidenceAt, 2);
  }
  if (args.includes('--help') || args.length < 1 || args.length > 2) {
    console.log('Usage: npm run pqp:examview -- <bank.bnk> [new-output.pqp.json] [--evidence existing-native-directory]\nUses the local Windows ExamView installation to render math and graphs. Retains native evidence alongside the new PQP; never overwrites existing output. --evidence reuses a hash-verified paired export.');
    return args.includes('--help') ? 0 : 1;
  }
  if (process.platform !== 'win32') throw new Error('The native ExamView bridge requires Windows.');
  const input = resolve(args[0]), output = resolve(args[1] || join(dirname(input), `${basename(input, extname(input))}.pqp.json`));
  if (output === input || existsSync(output)) throw new Error(`Output already exists: ${output}. Choose a new file.`);
  const source = readFileSync(input), digest = hash(source);
  const sourceHeader = source.subarray(0, 16).toString('latin1');
  const legacy = /^\x1aFSCBNK#W#05#/.test(sourceHeader);
  if (!legacy && !/^\x1aFSCBNK#W#06#/.test(sourceHeader)) throw new Error('Native reconciliation supports ExamView v05 and v06 banks.');
  let bank = legacy ? undefined : readQuestionRecords(inflateSync(source.subarray(16)));
  if (!legacy && !bank) throw new Error('Source record structure could not be reconciled; no export started.');
  mkdirSync(dirname(output), { recursive: true });
  const work = existingEvidence || mkdtempSync(join(dirname(output), `${basename(output, '.json')}.native-`));
  console.log(`Native evidence: ${work}\n${existingEvidence ? 'Validating the retained native export…' : 'Exporting the bank with ExamView…'}`);
  const zip = join(work, 'bank.zip'), rtfPath = join(work, 'bank.rtf');
  const hasBimodal = legacy || bank.records.some(record => record.type === 'bimodal');
  if (!existingEvidence) powershell('scripts/examview-export.ps1', ['-Bank', input, '-Output', zip, '-RtfOutput', rtfPath, ...(hasBimodal ? ['-CaptureBimodalPresentations'] : []), ...(legacy ? ['-UpgradedBankOutput', join(work, 'bank-upgraded.bnk')] : [])]);
  const receipt = JSON.parse(readFileSync(`${zip}.receipt.json`, 'utf8').replace(/^\uFEFF/, ''));
  if (receipt.sameLoadedBank !== true) throw new Error('Native export receipt does not verify a synchronized pair.');
  if (receipt.sourceSha256.toLowerCase() !== digest || receipt.sourceHashAfter.toLowerCase() !== digest || hash(readFileSync(input)) !== digest) throw new Error('Source hash validation failed.');
  if (receipt.outputSha256.toLowerCase() !== hash(readFileSync(zip)) || receipt.rtfSha256?.toLowerCase() !== hash(readFileSync(rtfPath))) throw new Error('Paired native evidence hash validation failed.');
  if (legacy) {
    const upgraded = receipt.upgradedBank;
    if (!upgraded?.path || !/^[a-f0-9]{64}$/i.test(upgraded.sha256 ?? '') || upgraded.sameLoadedBank !== true || upgraded.savedBeforePrimaryExport !== true || upgraded.saveAsCommand !== 30503) throw new Error('Legacy bank requires a verified native Save As upgrade.');
    const bytes = readFileSync(upgraded.path);
    if (hash(bytes) !== upgraded.sha256.toLowerCase() || !/^\x1aFSCBNK#W#06#/.test(bytes.subarray(0, 16).toString('latin1'))) throw new Error('Native legacy upgrade digest or header is invalid.');
    bank = readQuestionRecords(inflateSync(bytes.subarray(16)));
    if (!bank) throw new Error('Native legacy upgrade record structure could not be reconciled.');
  }
  function convertPair(zip, rtfPath, sourceBank = bank, rationaleReferenceInventory) {
  const inventoryPath = join(work, `inventory-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  powershell('scripts/blackboard-to-json.ps1', ['-ZipPath', zip, '-OutputPath', inventoryPath, '-IncludeAssetData']);
  let inventory = JSON.parse(readFileSync(inventoryPath, 'utf8').replace(/^\uFEFF/, ''));
  const rtf = readNativeRtf(readFileSync(rtfPath));
  const pictureDirectory = mkdtempSync(join(work, 'rtf-pictures-'));
  for (const picture of rtf.pictures) writeFileSync(join(pictureDirectory, `${picture.index}.wmf`), picture.bytes, { flag: 'wx' });
  const rasterResult = JSON.parse(powershell('scripts/rasterize-native-wmf.ps1', ['-Directory', pictureDirectory]) || '[]');
  const rasterReceipts = new Map((Array.isArray(rasterResult) ? rasterResult : [rasterResult]).map(receipt => [Number(basename(receipt.wmf, '.wmf')), receipt]));
  const rtfImage = index => {
    const picture = rtf.pictures[index - 1];
    if (!picture || !existsSync(join(pictureDirectory, `${index}.png`))) throw new Error(`Native answer image ${index} is missing.`);
    const rasterization = rasterReceipts.get(index);
    if (!rasterization || rasterization.sourceSha256 !== hash(picture.bytes)) throw new Error(`Native metafile raster receipt mismatch for image ${index}.`);
    return { bytes: readFileSync(join(pictureDirectory, `${index}.png`)), mimeType: 'image/png', widthTwips: picture.metadata.picwgoal, heightTwips: picture.metadata.pichgoal, baselineShiftPoints: picture.metadata.baselineShiftPoints, originalWmfBase64: picture.bytes.toString('base64'), rasterization };
  };
  inventory = repairBimodalInventory(inventory, { rtf, rtfImage, rationaleReferenceInventory });
  if (typeof sourceBank === 'function') sourceBank = sourceBank(inventory, { rtf, rtfImage });
  const glyphCache = new Map();
  const result = convertNativeExport({ inventory, sourceName: basename(input), sourceSha256: digest, bank: sourceBank, rtf, pairedNativeEvidence: true, nativeFontGlyph(face, codePoint, attrs, records) {
    const linked = [...records, ...bank.narratives.filter(n => records.some(r => r.narrativeId === n.number)), ...bank.groups.filter(g => records.some(r => r.groupId === g.number))];
    const richBlocks = linked.flatMap(record => record.blocks);
    const candidates = richBlocks.flatMap(block => block.runs.flatMap(run => {
      if (run.style.face !== face) return [];
      const text = block.text.slice(run.start, run.end);
      const nativeCodePoint = text.includes(String.fromCodePoint(codePoint)) ? codePoint : codePoint < 256 && ((run.style.fontFlags >>> 8) & 255) === 2 && text.includes(String.fromCodePoint(0xf000 + codePoint)) ? 0xf000 + codePoint : undefined;
      return nativeCodePoint === undefined ? [] : [{ style: run.style, nativeCodePoint }];
    }));
    const matches = [...new Map(candidates.map(candidate => [JSON.stringify(candidate), candidate])).values()];
    if (matches.length !== 1 || matches[0].style.fontFlags === undefined || matches[0].style.weight === undefined) throw new Error(`Original native font attributes are missing or ambiguous: ${face} U+${codePoint.toString(16)}.`);
    const { style, nativeCodePoint } = matches[0], key = hash(Buffer.from(JSON.stringify({ face, nativeCodePoint, style })));
    if (glyphCache.has(key)) return glyphCache.get(key);
    const glyphPath = join(pictureDirectory, `font-${key}.png`);
    if (/color\s*:/i.test(attrs.style ?? '') && !/color\s*:\s*(?:#000000|black)(?:;|$)/i.test(attrs.style)) throw new Error('Native font glyph ink color is unsupported.');
    powershell('scripts/render-native-font-glyph.ps1', ['-Face', face, '-CodePoint', String(nativeCodePoint), '-Charset', String((style.fontFlags >>> 8) & 255), '-PitchFamily', String(style.fontFlags & 255), '-SizePoints', String(style.size), '-Weight', String(style.weight), '-ItalicFlag', style.italic ? '1' : '0', '-UnderlineFlag', style.underline ? '1' : '0', '-Output', glyphPath]);
    const glyph = { bytes: readFileSync(glyphPath), receipt: JSON.parse(readFileSync(`${glyphPath}.json`, 'utf8').replace(/^\uFEFF/, '')) };
    if (hash(glyph.bytes) !== glyph.receipt.sha256.toLowerCase()) throw new Error('Native font glyph digest mismatch.');
    glyph.receipt.htmlExportCodePoint = codePoint;
    glyphCache.set(key, glyph); return glyph;
  }, rtfImage });
  result.pqp.extensions.nativeConversion.rtfRepairs = (inventory.rtfRepairs ?? []).map(({ originalWmfBase64, ...evidence }) => evidence);
  return { result, inventory, rtf, rtfImage };
  }
  const primary = convertPair(zip, rtfPath);
  let pqp = primary.result.pqp;
  if (bank.records.some(record => record.type === 'bimodal')) {
    const alternates = [], modes = new Set();
    let rationaleReference = primary.inventory;
    try {
      for (const evidence of receipt.alternateEvidence ?? []) {
        if (!['multiple-choice', 'short-answer'].includes(evidence.mode) || modes.has(evidence.mode)) throw new Error('Bimodal presentation mode is invalid or duplicated.');
        modes.add(evidence.mode);
        if (evidence.sameLoadedBank !== true || evidence.presentationCommand !== (evidence.mode === 'multiple-choice' ? 30591 : 30590)) throw new Error('Bimodal receipt does not verify the native presentation command and loaded bank.');
        if (hash(readFileSync(evidence.output)) !== evidence.outputSha256?.toLowerCase() || hash(readFileSync(evidence.rtfOutput)) !== evidence.rtfSha256?.toLowerCase()) throw new Error('Bimodal native evidence digest mismatch.');
        const alternate = convertPair(evidence.output, evidence.rtfOutput, inventory => alignBimodalBank(primary.inventory, inventory, bank), rationaleReference);
        if (evidence.mode === 'multiple-choice') rationaleReference = alternate.inventory;
        alternates.push({ mode: evidence.mode, pqp: alternate.result.pqp });
      }
      pqp = attachBimodalPresentations(pqp, alternates, bank);
    } catch (error) {
      pqp.extensions.nativeConversion.status = 'partial';
      pqp.extensions.nativeConversion.bimodalCoverage = { sourceRecords: bank.records.filter(record => record.type === 'bimodal').length, status: 'partial', reason: error.message };
      pqp.diagnostics.push({ level: 'warning', code: 'BIMODAL_PRESENTATION_INCOMPLETE', message: error.message });
    }
  }
  pqp.extensions ??= {};
  pqp.extensions.nativeEvidence = { directory: work, receipt, rtfSha256: hash(readFileSync(rtfPath)), zipSha256: hash(readFileSync(zip)), algorithmEvaluation: 'ExamView may evaluate variables on load; this package captures one native snapshot.' };
  pqp.extensions.examviewSource = { sha256: digest, originalBnkBase64: source.toString('base64'), preservation: 'Original bank retained exactly for unimplemented fields and future decoding.' };
  if (legacy) pqp.extensions.examviewSource.nativeUpgrade = { ...receipt.upgradedBank, recordRangeBasis: 'Source record ranges refer to the verified native v06 upgrade, not the original v05 serialization.' };
  // Native Blackboard export rasterizes equations. For algorithmic questions, conservatively
  // substitute only whole fields decoded from the exact same structural BNK record, then attach
  // algorithms only when every displayed value has an unambiguous TestGen slot and every rule is
  // supported. Failed or ambiguous questions remain faithful native snapshots with diagnostics.
  try {
    const algorithmBank = legacy ? receipt.upgradedBank.path : input;
    const algorithmWork = mkdtempSync(join(work, 'algorithm-pqp-'));
    const nativeBase = join(work, `native-before-algorithms-${Date.now()}.pqp.json`);
    const structural = join(work, `structural-for-algorithms-${Date.now()}.pqp.json`);
    const algorithmOutput = join(algorithmWork, `${basename(algorithmBank, extname(algorithmBank))}.pqp.json`);
    writeFileSync(nativeBase, `${JSON.stringify(pqp, null, 2)}\n`, { flag: 'wx' });
    nodeScript('scripts/bnk-to-pqp.mjs', [algorithmBank, structural], [0, 2]);
    nodeScript('scripts/hybridize-native-algorithm-text.mjs', [nativeBase, structural, algorithmOutput]);
    nodeScript('scripts/attach-algorithms.mjs', [algorithmWork, dirname(algorithmBank)]);
    pqp = JSON.parse(readFileSync(algorithmOutput, 'utf8'));
    const attached = pqp.questions.filter(question => question.extensions?.algorithmModel).length;
    const staticQuestions = pqp.questions.filter(question => question.extensions?.examview?.algorithm?.status === 'static').length;
    pqp.extensions.nativeConversion.algorithmCoverage = {
      status: staticQuestions ? 'partial' : 'complete',
      attached,
      static: staticQuestions,
      method: 'exact source-record structural text plus conservative TestGen slots',
    };
    pqp.extensions.nativeConversion.limitations = (pqp.extensions.nativeConversion.limitations ?? [])
      .filter(item => item !== 'Native rendered samples; randomized algorithm generation is not reproduced.')
      .concat(staticQuestions
        ? [`${staticQuestions} algorithmic question(s) remain fixed native snapshots; see ALGORITHM_STATIC diagnostics.`]
        : []);
  } catch (error) {
    pqp.diagnostics.push({ level: 'warning', code: 'ALGORITHM_ATTACHMENT_SKIPPED', message: error.message });
    pqp.extensions.nativeConversion.algorithmCoverage = { status: 'skipped', attached: 0, reason: error.message };
  }
  writeFileSync(output, `${JSON.stringify(pqp, null, 2)}\n`, { flag: 'wx' });
  const failed = pqp.extensions.nativeConversion?.status === 'partial' || pqp.diagnostics?.some(d => d.level === 'error' || d.code === 'QUESTION_LEFT_OUT');
  const counts = pqp.extensions.nativeConversion?.counts;
  console.log(`${failed ? 'Partial' : 'Converted'}: ${counts?.convertedRecords}/${counts?.sourceRecords} source records; ${pqp.questions.length} PQP questions, ${pqp.assets.length} assets.\n${output}`);
  for (const diagnostic of pqp.diagnostics ?? []) if ((failed && diagnostic.level !== 'info') || diagnostic.code === 'NATIVE_FONT_SUBSTITUTION') console.error(diagnostic.message);
  return failed ? 2 : 0;
}
try { process.exitCode = main(); }
catch (error) { console.error(`Native BNK conversion failed: ${error.message}`); process.exitCode = 1; }
