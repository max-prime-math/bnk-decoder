#!/usr/bin/env node
// Structural BNK conversion only. No PDF, OCR, curriculum guesses, or string-scan fallback.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { unzlibSync } from 'fflate';
import { lastRecordFailure, readQuestionRecords } from '../packages/bnk-core/src/records.ts';
import { renderMatchingGroup, renderRecordQuestion } from '../packages/bnk-core/src/record-questions.ts';
import { dibToPng, pictureWidthInches, renderBlock } from '../packages/bnk-core/src/record-typst.ts';
import { readAlgorithmBlockAt } from '../packages/bnk-core/src/algorithms.ts';
import { pqpRecordType } from './pqp-record-type.mjs';

const rich = (text) => ({ format: 'typst', text });
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const equationReferences = (nodes) => nodes.flatMap((node) => node.type === 'variable' ? [{ name: node.name, range: node.range }] : node.type === 'template' ? node.slots.flatMap(equationReferences) : node.type === 'geometry' ? equationReferences(node.name) : []);

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length < 1 || args.length > 2) {
    console[args.includes('--help') ? 'log' : 'error']('Usage: npm run pqp:bnk -- <bank.bnk> [new-output.pqp.json | output-directory]\nDefault: a new <bank>.pqp.json beside the input. Existing output files are never overwritten. Partial conversions exit with status 2.');
    return args.includes('--help') ? 0 : 1;
  }
  const input = resolve(args[0]);
  const stem = basename(input, extname(input));
  let output = args[1] ? resolve(args[1]) : join(dirname(input), `${stem}.pqp.json`);
  if ((existsSync(output) && statSync(output).isDirectory()) || (args[1] && !/\.json$/i.test(output))) output = join(output, `${stem}.pqp.json`);
  if (output === input || existsSync(output)) throw new Error(`Output already exists: ${output}. Choose a new file.`);
  const bytes = readFileSync(input);
  if (!/^\x1aFSCBNK#W#06#/.test(bytes.subarray(0, 16).toString('latin1'))) throw new Error('Unsupported BNK header: structural conversion currently requires ExamView v06.');
  const payload = unzlibSync(bytes.subarray(16));
  const bank = readQuestionRecords(payload);
  if (!bank || !bank.records.length) throw new Error(`No complete structural question layout: ${lastRecordFailure || 'no question records'}. No output written.`);
  const packageId = `bnk-${hash(bytes).slice(0, 12)}`;
  const questions = [], assets = [], diagnostics = [], omitted = [];
  diagnostics.push(...bank.diagnostics);
  const assetsByHash = new Map();
  let convertedRecords = 0;
  const metadata = (record) => ({ questionNumber: record.number, narrativeId: record.narrativeId, matchingGroupId: record.groupId, typeCode: record.typeCode, type: record.type, answerCode: record.answerCode, choiceCount: record.choiceCount, recordOffset: record.offset, recordEnd: record.end, metadata: record.metadata, prefix: record.prefix, variableReferences: record.blocks.flatMap((block) => block.objects.flatMap((object) => object.kind === 'variable' ? [{ context: 'text', name: object.name, range: object.range, rawFlags: object.rawFlags }] : object.kind === 'equation' ? equationReferences(object.nodes).map((reference) => ({ context: 'equation', ...reference })) : [])), algorithm: record.algorithmBytes?.length ? { encoding: 'base64', bytes: Buffer.from(record.algorithmBytes).toString('base64'), status: 'preserved-not-executed', range: record.prefix?.algorithm } : undefined });
  const rawAlgorithmEntries = (bytes) => {
    const prefixed = new Uint8Array(bytes.length + 4);
    new DataView(prefixed.buffer).setInt32(0, prefixed.length, true);
    prefixed.set(bytes, 4);
    return readAlgorithmBlockAt(prefixed, 0);
  };
  function convert(records, render, kind, id, extra = {}) {
    const staged = new Map(), used = new Set(), problems = [];
    const variables = new Map();
    const algorithmEntries = [];
    const narratives = [...new Set(records.map((record) => record.narrativeId).filter((id) => id !== -1))].map((id) => {
      const narrative = bank.narratives.find((item) => item.number === id);
      if (!narrative) problems.push(`missing shared narrative ${id}`);
      return narrative;
    }).filter(Boolean);
    if (narratives.length > 1) problems.push('matching records reference different shared narratives');
    function addEntries(entries, label) {
      if (entries === undefined) problems.push(`${label}: invalid structural algorithm block`);
      else {
        algorithmEntries.push({ source: label, entries });
        for (const entry of entries) if (entry.kind === 'variable') {
          const previous = variables.get(entry.name);
          if (previous && (previous.display !== entry.display || previous.valueType !== entry.valueType)) problems.push(`conflicting stored variable ${entry.name} across source scopes`);
          variables.set(entry.name, entry);
        }
      }
    }
    for (const narrative of narratives) addEntries(rawAlgorithmEntries(narrative.algorithmBytes), `narrative ${narrative.number}`);
    if (extra.matchingGroup !== undefined) {
      const group = bank.groups.find((item) => item.number === extra.matchingGroup);
      addEntries(rawAlgorithmEntries(group.algorithmBytes), `matching group ${group.number}`);
    }
    for (const record of records) addEntries(readAlgorithmBlockAt(payload, ...record.prefix.algorithm), `question ${record.number}`);
    let rendered;
    try {
      const options = { variables, picture(object) {
        try {
          const png = dibToPng(object.dib), digest = hash(png);
          const asset = assetsByHash.get(digest) ?? staged.get(digest) ?? {
            id: `${packageId}-image-${digest.slice(0, 16)}`, kind: 'image', filename: `${digest.slice(0, 16)}.png`, mimeType: 'image/png',
            storage: { mode: 'inline-base64', base64: Buffer.from(png).toString('base64') },
            source: { originalPath: `${basename(input)}#question-${records[0].number}` },
            extensions: { examview: { widthTwips: object.widthTwips, heightTwips: object.heightTwips } },
          };
          staged.set(digest, asset); used.add(asset.id);
          return `#box(image("/imgs/${asset.filename.replace(/\.png$/, '')}", width: ${pictureWidthInches(object).toFixed(2)}in))`;
        } catch (error) { problems.push(`picture: ${error.message}`); return ''; }
      } };
      rendered = render(options);
      problems.push(...rendered.problems);
      const sharedPrompts = narratives.flatMap((narrative) => narrative.blocks.map((block) => {
        const shared = renderBlock(block, options);
        problems.push(...shared.errors.map((error) => `narrative ${narrative.number}: ${error}`));
        if (/[�-\u0000-\u0008\u000b\u000c\u000e-\u001f]|not decoded|\[embedded|\[\[slot\]\]/i.test(shared.typst)) problems.push(`narrative ${narrative.number}: garbled or placeholder text`);
        return shared.typst;
      }));
      if (sharedPrompts.length) rendered.stem = [...sharedPrompts, rendered.stem].join('\n\n');
    } catch (error) { problems.push(`rendering failed: ${error.message}`); }
    if (problems.length) {
      for (const record of records) {
        const reasons = [...new Set(problems)];
        omitted.push({ ...metadata(record), reasons });
        diagnostics.push({ level: 'warning', code: 'QUESTION_LEFT_OUT', message: `ExamView question ${record.number} (${record.type}) omitted: ${reasons.join('; ')}` });
      }
      return;
    }
    for (const [digest, asset] of staged) if (!assetsByHash.has(digest)) { assetsByHash.set(digest, asset); assets.push(asset); }
    convertedRecords += records.length;
    for (const record of records) if (record.algorithmBytes?.length) diagnostics.push({ level: 'info', code: 'ALGORITHM_NOT_EVALUATED', message: `ExamView question ${record.number}: algorithm bytes preserved; randomized variants are not evaluated.` });
    questions.push({
      id: `${packageId}-${id}`, kind,
      content: { stem: rich(rendered.stem), ...(rendered.choices ? { choices: rendered.choices.map((choice) => ({ id: choice.id, body: rich(choice.text) })) } : {}), ...(rendered.solution ? { solution: rich(rendered.solution) } : {}) },
      ...(rendered.answer ? { answer: { type: kind === 'matching' ? 'text' : 'choice', value: rendered.answer } } : {}),
      scoring: { points: kind === 'matching' ? rendered.items : 1 },
      classification: { questionType: pqpRecordType(records[0].type), tags: ['examview'] },
      ...(used.size ? { assets: [...used] } : {}),
      provenance: { sourceApp: 'bnk-decoder', sourceSystem: 'ExamView', sourceLabel: basename(input), sourceQuestionNumber: records.map((record) => record.number).join(', '), confidence: 'high', originFiles: [basename(input)] },
      extensions: { examview: { ...metadata(records[0]), ...(records.length > 1 ? { records: records.map(metadata) } : {}), storedAlgorithmEntries: algorithmEntries.filter((item) => item.entries.length), ...extra }, decodeDiagnostics: [{ level: 'info', code: 'BNK_RECORD_DECODED', message: 'Decoded from structural ExamView records using stored algorithm display samples. Algorithm expressions are not executed; point value defaults to 1.' }] },
    });
  }
  for (const record of bank.records) if (record.type !== 'matching') convert([record], (options) => renderRecordQuestion(record, options), record.type === 'multiple-response' ? 'multiple_response' : ['multiple-choice', 'bimodal', 'true-false', 'yes-no'].includes(record.type) ? 'mcq' : 'frq', `q${record.number}`);
  const matching = bank.records.filter((record) => record.type === 'matching');
  if (matching.length) {
    const groupsByNumber = new Map(bank.groups.map((group) => [group.number, group]));
    const itemsByGroup = new Map();
    for (const record of matching) {
      if (!groupsByNumber.has(record.groupId)) convert([record], () => ({ problems: [`missing matching group ${record.groupId}`] }), 'matching', `q${record.number}`);
      else { const items = itemsByGroup.get(record.groupId) ?? []; items.push(record); itemsByGroup.set(record.groupId, items); }
    }
    for (const [number, items] of itemsByGroup) {
      const group = groupsByNumber.get(number);
      convert(items, (options) => renderMatchingGroup(group, items, options), 'matching', `m${number}`, { matchingGroup: number, groupOffset: group.offset });
    }
  }
  const counts = { sourceRecords: bank.records.length, convertedRecords, questions: questions.length, omittedRecords: omitted.length, assets: assets.length };
  const status = omitted.length ? 'partial' : 'complete';
  const pqp = {
    format: 'portable-question-package', version: '1.0',
    producer: { app: 'bnk-decoder', appVersion: '0.1.0', pipeline: 'bnk-structural-single-file', exportedAt: new Date().toISOString() },
    source: { kind: 'bnk', label: basename(input), sourceSystem: 'ExamView', bankTitle: bank.title, sectionTitle: bank.sectionTitle, originFiles: [basename(input)] },
    questions, assets, diagnostics,
    extensions: { bnk: { bankId: bank.bankId, sourceSha256: hash(bytes), status, counts, omittedQuestions: omitted, ...(bank.trailingBytes.length ? { opaqueTrailer: { range: bank.trailingRange, base64: Buffer.from(bank.trailingBytes).toString('base64') } } : {}), narratives: bank.narratives.map((item) => ({ number: item.number, name: item.name, description: item.description, range: [item.offset, item.end], rawRecordBase64: Buffer.from(payload.subarray(item.offset, item.end)).toString('base64') })), matchingGroups: bank.groups.map((item) => ({ number: item.number, range: [item.offset, item.end], rawAlgorithmBase64: Buffer.from(item.algorithmBytes).toString('base64') })), algorithms: 'Stored display samples substituted where resolvable; raw bytes preserved; evaluation and randomized variants unavailable.' } },
  };
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(pqp, null, 2)}\n`, { flag: 'wx' });
  console.log(`${status}: ${convertedRecords}/${bank.records.length} source records converted to ${questions.length} PQP questions; ${omitted.length} omitted; ${assets.length} embedded images.\n${output}`);
  for (const diagnostic of diagnostics) if (diagnostic.level !== 'info') console.error(diagnostic.message);
  return omitted.length ? 2 : 0;
}
try { process.exitCode = main(); }
catch (error) { console.error(`BNK conversion failed: ${error.message}`); process.exitCode = 1; }
