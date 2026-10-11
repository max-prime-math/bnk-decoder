// Pure bridge from audited native export JSON to PQP. Rendering failures omit the
// entire source item; successful framing alone never establishes full fidelity.
import { createHash } from 'node:crypto';
import { renderNativeHtml } from './native-html-to-typst.mjs';
import { pqpRecordType } from './pqp-record-type.mjs';
const rich = text => ({ format: 'typst', text });
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const escape = text => text.replace(/[\\#\[\]$*_`<>@]/g, '\\$&');
const walk = node => [node, ...(node.children ?? []).flatMap(walk)];
const nativeTypes = {
  'Multiple Choice': ['multiple-choice', 'bimodal', 'yes-no'], 'Multiple Answer': ['multiple-response'],
  'Multiple Response': ['multiple-response'], 'True/False': ['true-false'],
  'True False': ['true-false'], 'Yes/No': ['yes-no'],
  'Fill in the Blank': ['completion'], Matching: ['matching'],
  Essay: ['short-answer', 'problem', 'bimodal'], 'Short Answer': ['short-answer', 'problem', 'bimodal'],
};
const metadata = record => ({ number: record.number, type: record.type, typeCode: record.typeCode, narrativeId: record.narrativeId, groupId: record.groupId, answerCode: record.answerCode, choiceCount: record.choiceCount, metadata: record.metadata, prefix: record.prefix, range: [record.offset, record.end], algorithmBase64: record.algorithmBytes?.length ? Buffer.from(record.algorithmBytes).toString('base64') : undefined });

export function convertNativeExport({ inventory, sourceName, sourceSha256, bank, rtf, rtfImage, nativeFontGlyph, pairedNativeEvidence = false }) {
  if (!inventory || !Array.isArray(inventory.items) || !bank || !Array.isArray(bank.records)) throw new Error('native inventory and structural source bank are required');
  if (!/^[a-f0-9]{64}$/i.test(sourceSha256 ?? '')) throw new Error('source SHA256 is required');
  const packageId = `bnk-${sourceSha256.toLowerCase().slice(0, 12)}`;
  const questions = [], assets = [], diagnostics = [], omitted = [], assetMap = new Map();
  const sourceAssets = new Map((inventory.assets ?? []).map(a => [a.entry, a]));
  const promptImageOwners = new Map(), aliasedPromptItems = new Set();
  for (let index = 0; index < inventory.items.length; index++) {
    for (const material of inventory.items[index].question ?? []) {
      renderNativeHtml(material.html, { image(src) {
        let path;
        try { path = decodeURIComponent(src.split(/[?#]/, 1)[0]).replaceAll('\\', '/'); } catch { return ''; }
        if (/^(?:mc|pr|sa|tf|yn|mr)\d+-\d+\.jpe?g$/i.test(path.split('/').at(-1))) {
          const owners = promptImageOwners.get(path) ?? new Set(); owners.add(index); promptImageOwners.set(path, owners);
        }
        return '';
      } });
    }
  }
  for (const [path, owners] of promptImageOwners) if (owners.size > 1) {
    for (const index of owners) aliasedPromptItems.add(index);
    diagnostics.push({ level: 'warning', code: 'NATIVE_PROMPT_IMAGE_ALIAS', message: `Native generated image ${path} is reused by distinct question prompts (${[...owners].map(n => inventory.items[n].sourceId).join(', ')}); overwritten native image content cannot be reconciled safely.` });
  }
  let cursor = 0, convertedRecords = 0, alignmentLost = false;
  const sourceIds = new Set();
  const warn = (code, message) => diagnostics.push({ level: 'warning', code, message });
  for (let index = 0; index < inventory.items.length; index++) {
    const item = inventory.items[index], problems = [], staged = new Map(), used = new Set();
    const itemType = nativeTypes[item.type], isMatching = item.type === 'Matching';
    const sourceStart = cursor;
    if (aliasedPromptItems.has(index)) problems.push('native generated prompt image is aliased across distinct question items');
    if (!item.sourceId || sourceIds.has(item.sourceId)) problems.push('native source item identifier is missing or duplicated');
    sourceIds.add(item.sourceId);
    const consume = isMatching ? item.responses?.length ?? 0 : 1;
    const records = bank.records.slice(cursor, cursor + consume);
    if (alignmentLost) problems.push('source alignment lost after an earlier type/count mismatch');
    if (!itemType || consume < 1 || records.length !== consume || records.some(r => !itemType.includes(r.type))) {
      problems.push(`native ${item.type} does not match the next ${consume} structural source record(s)`); alignmentLost = true;
    }
    if (isMatching && records.length && (new Set(records.map(r => r.groupId)).size !== 1 || records[0].groupId === undefined)) {
      problems.push('native matching stems do not map to one structural matching group'); alignmentLost = true;
    }
    const points = Number(item.metadata?.qmd_absolutescore_max);
    if (!Number.isFinite(points) || points < 0) problems.push('native item point value is missing or invalid');
    cursor += consume;
    function stageImage(bytes, mimeType, name, attrs = {}, extra = {}) {
      const hash = digest(bytes), filename = `${hash.slice(0, 20)}.${mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : 'bin'}`;
      const asset = assetMap.get(hash) ?? staged.get(hash) ?? { id: `${packageId}-image-${hash.slice(0, 20)}`, kind: 'image', filename, mimeType, storage: { mode: 'inline-base64', base64: Buffer.from(bytes).toString('base64') }, source: { originalPath: name }, extensions: { examview: extra } };
      staged.set(hash, asset); used.add(asset.id);
      const width = attrs.widthTwips !== undefined ? Number(attrs.widthTwips) / 15 : Number(attrs.width), height = attrs.heightTwips !== undefined ? Number(attrs.heightTwips) / 15 : Number(attrs.height);
      if (!(width > 0) || !(height > 0)) { problems.push(`native image dimensions are missing or invalid: ${name}`); return ''; }
      const baseline = attrs.baselineShiftPoints !== undefined ? `${Number(attrs.baselineShiftPoints)}pt` : attrs.align === 'middle' ? '50% - 0.25em' : attrs.align === 'top' ? '100% - 0.8em' : '0pt';
      return `#box(baseline: ${baseline}, image("/imgs/${asset.filename.replace(/\.[^.]+$/, '')}", width: ${(width / 96).toFixed(6)}in, height: ${(height / 96).toFixed(6)}in));`;
    }
    function image(src, attrs) {
      let path;
      try { path = decodeURIComponent(src.split(/[?#]/, 1)[0]).replaceAll('\\', '/').replace(/^\/+/, ''); } catch { problems.push(`invalid native image URL ${src}`); return ''; }
      const asset = sourceAssets.get(path);
      if (!asset?.base64) { problems.push(`native image bytes unavailable: ${src}`); return ''; }
      const bytes = Buffer.from(asset.base64, 'base64');
      if (!bytes.length || asset.sha256 && digest(bytes) !== asset.sha256.toLowerCase()) { problems.push(`native image digest mismatch: ${src}`); return ''; }
      const mime = /\.jpe?g$/i.test(path) ? 'image/jpeg' : /\.png$/i.test(path) ? 'image/png' : undefined;
      if (!mime) { problems.push(`unsupported native image format: ${src}`); return ''; }
      return stageImage(bytes, mime, path, attrs, { pixelWidth: asset.pixelWidth, pixelHeight: asset.pixelHeight, html: attrs, ...(asset.rtfRepair ? { rtfRepair: asset.rtfRepair } : {}) });
    }
    function render(materials, label) {
      return (materials ?? []).map(material => {
        const result = renderNativeHtml(material.html, { image, ...(nativeFontGlyph ? { fontText(face, text, attrs) {
          if ([...text].length !== 1) throw new Error(`native font fallback requires one verified source glyph: ${face}`);
          const glyph = nativeFontGlyph(face, text.codePointAt(0), attrs, records);
          if (!glyph?.bytes || !glyph.receipt) throw new Error(`native font glyph unavailable: ${face}`);
          const receipt = glyph.receipt;
          if (receipt.fontSubstituted) warn('NATIVE_FONT_SUBSTITUTION', `Native Windows substituted ${receipt.requestedFace} with ${receipt.selectedFace} for ${receipt.sourceCodePointHex}. The installed native glyph is preserved as an image; the missing original font's intended glyph is unknown.`);
          return stageImage(glyph.bytes, 'image/png', `native-font-${face}-${text.codePointAt(0)}`, { width: receipt.widthPixels, height: receipt.heightPixels, baselineShiftPoints: receipt.baselineFromBottomPixels * 72 / receipt.dpi }, { nativeFontGlyph: receipt });
        } } : {}) });
        problems.push(...result.errors.map(e => `${label}: ${e}`)); return result.typst;
      }).join('\n\n');
    }
    function equalities() {
      const result = [];
      for (const condition of item.correctConditions ?? []) {
        const vars = walk(condition.tree).filter(n => n.name === 'varequal');
        const unknown = walk(condition.tree).filter(n => ['conditionvar', 'and', 'or', 'not', 'varequal', 'other', 'respcondition', 'setvar', 'displayfeedback'].includes(n.name) === false);
        if (unknown.length || walk(condition.tree).some(n => n.name === 'not')) problems.push('unsupported native correct-answer condition');
        result.push(...vars.map(n => ({ responseId: n.attributes.respident, value: n.text, case: n.attributes.case })));
      }
      return result;
    }
    let stem = render(item.question, 'question'), choices, answer, solution, kind;
    if (!stem.trim()) problems.push('native question prompt is empty');
    const equal = records[0]?.type === 'multiple-response' ? [] : equalities();
    if (isMatching) {
      kind = 'matching';
      const right = (item.matchingChoices ?? []).map((m, n) => render(m, `matching choice ${n + 1}`));
      if (!right.length) problems.push('native matching choices are missing');
      const lines = [], mappings = [];
      for (let n = 0; n < (item.responses ?? []).length; n++) {
        const response = item.responses[n], id = response.attributes.ident;
        const correct = equal.filter(e => e.responseId === id);
        if (correct.length !== 1) { problems.push(`matching stem ${id} has ${correct.length} correct answers`); continue; }
        const rightIndex = response.labels.findIndex(l => l.attributes.ident === correct[0].value);
        if (rightIndex < 0 || rightIndex >= right.length || response.labels.length !== right.length) { problems.push(`matching stem ${id} has an invalid choice mapping`); continue; }
        const prompt = render(response.parentMaterials, `matching stem ${n + 1}`);
        if (!prompt.trim()) problems.push(`matching stem ${id} is empty`);
        lines.push(`${n + 1}. ${prompt}`); mappings.push(`${n + 1}. ${String.fromCharCode(65 + rightIndex)}`);
      }
      for (const e of equal) if (!(item.responses ?? []).some(r => r.attributes.ident === e.responseId)) warn('NATIVE_ORPHAN_MATCHING_CONDITION', `${item.sourceId}: ignored native answer condition ${e.responseId}=${e.value}, which refers to no presented matching stem.`);
      if (mappings.length !== consume) problems.push('not every matching stem has a verified answer');
      stem += `\n\n${right.map((s, n) => `${String.fromCharCode(65 + n)}. ${s}`).join('\n\n')}\n\n${lines.join('\n\n')}`;
      answer = { type: 'text', value: mappings.join('\n') };
    } else if (itemType?.some(t => ['multiple-choice', 'multiple-response', 'true-false', 'yes-no'].includes(t))) {
      kind = records[0]?.type === 'multiple-response' ? 'multiple_response' : 'mcq';
      const responses = item.responses ?? [];
      if (responses.length !== 1) problems.push('choice question must contain exactly one native response');
      const response = responses[0];
      choices = (response?.labels ?? []).map((label, n) => ({ id: String.fromCharCode(97 + n), body: rich(render(label.materials, `choice ${n + 1}`)) }));
      if (choices.length < 2) problems.push('choice question has fewer than two choices');
      const correct = equal.filter(e => e.responseId === response?.attributes.ident);
      let ids = correct.map(e => response.labels.findIndex(l => l.attributes.ident === e.value));
      if (records[0]?.type === 'multiple-response') {
        // ExamView's own Multiple Answer QTI writer emits zero-based answer_N
        // conditions alongside one-based presented label identifiers. Interpret
        // that native form only when both source bitmask and paired RTF agree.
        const conditions = item.correctConditions ?? [];
        const variable = conditions.length === 1 ? conditions[0].tree.children?.find(n => n.name === 'conditionvar') : undefined;
        const conjunction = variable?.children?.length === 1 && variable.children[0].name === 'and' ? variable.children[0] : undefined;
        const terms = conjunction?.children ?? [], selections = new Map();
        for (const term of terms) {
          const negative = term.name === 'not';
          const node = negative && term.children?.length === 1 ? term.children[0] : term;
          const match = node?.name === 'varequal' && /^answer_(\d+)$/.exec(node.text);
          const choiceIndex = match ? Number(match[1]) : -1;
          if (!match || node.attributes?.respident !== response?.attributes.ident || choiceIndex < 0 || choiceIndex >= choices.length || selections.has(choiceIndex)) problems.push('unsupported native multiple-answer conjunction');
          else selections.set(choiceIndex, !negative);
        }
        if (selections.size !== choices.length) problems.push('native multiple-answer condition does not specify every choice');
        ids = [...selections].filter(([, selected]) => selected).map(([n]) => n).sort((a, b) => a - b);
        const mask = ids.reduce((bits, n) => bits | 1n << BigInt(n), 0n);
        if (mask !== BigInt(records[0].answerCode >>> 0)) problems.push('native multiple-answer mask conflicts with structural source answer');
        const rtfAnswers = pairedNativeEvidence ? (rtf?.questions ?? []).filter(q => q.answerOrdinal === sourceStart + 1 && q.hasAnswerMarker) : [];
        const key = rtfAnswers.length === 1 ? rtfAnswers[0].answer.trim() : '';
        const expectedKey = ids.map(n => String.fromCharCode(65 + n)).join(', ');
        if (!/^[A-Z](?:,\s*[A-Z])*$/.test(key) || key.replace(/\s/g, '') !== expectedKey.replace(/\s/g, '')) problems.push('paired native RTF multiple-answer key is unavailable or conflicts with native/source choices');
        if (!problems.length) warn('NATIVE_MULTIPLE_ANSWER_INDEXING', `${item.sourceId}: reconciled zero-based native QTI condition indexes with the source bitmask and paired native RTF answer key.`);
      }
      if (!ids.length || ids.some(n => n < 0) || new Set(ids).size !== ids.length) problems.push('native correct choice mapping is missing, repeated or invalid');
      if (records[0]?.type !== 'multiple-response' && ids.length !== 1) problems.push('single-choice question has multiple correct answers');
      if (['yes-no', 'true-false'].includes(records[0]?.type)) {
        const yesNo = records[0].type === 'yes-no';
        const labels = (response?.labels ?? []).map(label => (label.materials ?? []).map(m => m.html).join('').trim().toLowerCase());
        const expectedLabels = yesNo ? ['no', 'yes'] : ['false', 'true'];
        if (labels.length !== 2 || [...labels].sort().some((label, n) => label !== expectedLabels[n])) problems.push('native boolean choices do not contain both verified truth labels');
        if (![0, 1].includes(records[0].answerCode)) problems.push('structural boolean answer code is invalid');
        const rtfAnswers = pairedNativeEvidence ? (rtf?.questions ?? []).filter(q => q.answerOrdinal === sourceStart + 1 && q.hasAnswerMarker) : [];
        const key = rtfAnswers.length === 1 ? /^([TFYN])(?:\s|$)/i.exec(rtfAnswers[0].answer.trim())?.[1].toUpperCase() ?? '' : '';
        const expectedKey = yesNo ? records[0].answerCode === 0 ? 'Y' : 'N' : records[0].answerCode === 0 ? 'T' : 'F';
        if (key !== expectedKey) problems.push('paired native RTF boolean key is unavailable or conflicts with native/source choices');
        const truth = expectedKey === 'Y' ? 'yes' : expectedKey === 'N' ? 'no' : expectedKey === 'T' ? 'true' : 'false';
        const truthIndex = labels.indexOf(truth);
        if (!yesNo && key === expectedKey && truthIndex >= 0 && ids.length === 1) {
          if (ids[0] !== truthIndex) warn('NATIVE_TRUE_FALSE_CONDITION_CONFLICT', `${item.sourceId}: native QTI label identifiers conflict with their displayed truth labels; selected ${truth} using the agreeing source answer code and paired native RTF key.`);
          ids = [truthIndex];
        } else if (ids[0] !== truthIndex) problems.push('native boolean correct choice conflicts with structural source answer');
      }
      answer = { type: 'choice', value: ids.map(n => choices[n]?.id).join(', ') };
      const nativeRationale = (item.feedback ?? []).filter(f => f.attributes.ident === 'correct').flatMap(f => f.materials ?? []);
      if (nativeRationale.some(m => m.html.trim())) solution = render(nativeRationale, 'correct-answer rationale');
    } else if (itemType?.includes('completion')) {
      kind = 'frq';
      const correct = equal.filter(e => (item.responses ?? []).some(r => r.attributes.ident === e.responseId));
      if (correct.length && correct.every(e => e.value?.trim())) {
        answer = { type: 'text', value: [...new Set(correct.map(e => e.value))].join(' OR ') };
        solution = escape(answer.value);
      }
      else if (!pairedNativeEvidence) problems.push('missing native fill-blank answer; paired native RTF evidence has not been verified');
      else {
        const candidates = (rtf?.questions ?? []).filter(q => q.answerOrdinal === sourceStart + 1);
        if (candidates.length !== 1 || !candidates[0].hasAnswerMarker || !candidates[0].answer?.trim()) problems.push('paired RTF fill-blank answer is unavailable or ambiguous');
        else {
          const raw = candidates[0].answer;
          solution = raw.split(/(\[IMAGE:\d+\])/g).map(part => {
            const match = /^\[IMAGE:(\d+)\]$/.exec(part);
            if (!match) return escape(part);
            if (!rtfImage) { problems.push('RTF answer image resolver is missing'); return ''; }
            try {
              const picture = rtfImage(Number(match[1]));
              if (picture?.typst && picture.asset) { staged.set(picture.asset.id, picture.asset); used.add(picture.asset.id); return `${picture.typst.replace(/;$/, '')};`; }
              const bytes = picture?.bytes ?? (picture?.base64 ? Buffer.from(picture.base64, 'base64') : undefined);
              if (!bytes) throw new Error('RTF picture bytes unavailable');
              return stageImage(bytes, picture.mimeType, `native-rtf-picture-${match[1]}`, { width: picture.width, height: picture.height, widthTwips: picture.widthTwips, heightTwips: picture.heightTwips, baselineShiftPoints: picture.baselineShiftPoints }, { nativeRtfIndex: Number(match[1]), widthTwips: picture.widthTwips, heightTwips: picture.heightTwips, baselineShiftPoints: picture.baselineShiftPoints, originalWmfBase64: picture.originalWmfBase64 ?? picture.rawWmfBase64 ?? (picture.originalBytes ? Buffer.from(picture.originalBytes).toString('base64') : undefined) });
            } catch (error) { problems.push(error.message); return ''; }
          }).join('');
          answer = { type: 'text', value: solution };
        }
      }
    } else if (itemType?.some(t => ['short-answer', 'problem'].includes(t))) {
      kind = 'frq';
      const nativeSolutions = (item.feedback ?? []).filter(f => f.attributes.ident === 'solution');
      if (nativeSolutions.length !== 1) problems.push('native written-response solution is missing or ambiguous');
      const nativeAnswer = render(nativeSolutions[0]?.materials, 'solution');
      if (!nativeAnswer.trim()) problems.push('native written-response solution is empty');
      const rationale = render((item.feedback ?? []).filter(f => f.attributes.ident === 'correct').flatMap(f => f.materials ?? []), 'written-response rationale');
      solution = [nativeAnswer, rationale].filter(text => text.trim()).join('\n\n');
      answer = { type: 'text', value: nativeAnswer };
    }
    if (problems.length) {
      omitted.push({ sourceId: item.sourceId, ordinal: index + 1, sourceRecords: records.map(r => r.number), reasons: [...new Set(problems)] });
      warn('NATIVE_QUESTION_LEFT_OUT', `${item.sourceId}: ${[...new Set(problems)].join('; ')}`); continue;
    }
    for (const [key, asset] of staged) if (!assetMap.has(key)) { assetMap.set(key, asset); assets.push(asset); }
    convertedRecords += records.length;
    questions.push({ id: `${packageId}-native-${index + 1}`, kind, content: { stem: rich(stem), ...(choices ? { choices } : {}), ...(solution ? { solution: rich(solution) } : {}) }, answer, scoring: { points }, classification: { questionType: pqpRecordType(records[0]?.type), tags: ['examview', 'native-export'] }, ...(used.size ? { assets: [...used] } : {}), provenance: { sourceApp: 'bnk-decoder', sourceSystem: 'ExamView', sourceLabel: sourceName, sourceQuestionNumber: records.map(r => r.number).join(', '), originFiles: [sourceName], confidence: 'high' }, extensions: { examview: { sourceRecords: records.map(metadata), nativeSourceId: item.sourceId, nativeExportOrdinal: index + 1, nativeExport: item, rtfAnswer: itemType?.includes('completion') && rtf ? rtf.questions?.find(q => q.answerOrdinal === sourceStart + 1) : undefined } } });
  }
  if (cursor !== bank.records.length) warn('NATIVE_SOURCE_RECORD_COUNT_MISMATCH', `Native items consumed ${cursor} source positions; structural bank declares ${bank.records.length}.`);
  const counts = { sourceRecords: bank.records.length, nativeItems: inventory.items.length, convertedRecords, questions: questions.length, omittedRecords: bank.records.length - convertedRecords, assets: assets.length };
  const status = convertedRecords === bank.records.length && omitted.length === 0 && !alignmentLost ? 'complete' : 'partial';
  const pqp = { format: 'portable-question-package', version: '1.0', producer: { app: 'bnk-decoder', appVersion: '0.1.0', pipeline: 'examview-native-export' }, source: { kind: 'bnk', label: sourceName, sourceSystem: 'ExamView', bankTitle: bank.title, sectionTitle: bank.sectionTitle, originFiles: [sourceName] }, questions, assets, diagnostics, extensions: { nativeConversion: { status, counts, omittedQuestions: omitted, sourceSha256: sourceSha256.toLowerCase(), pairedNativeEvidence, limitations: ['Native rendered samples; randomized algorithm generation is not reproduced.', 'Successful conversion does not establish pixel parity or consuming-application import validation.'] }, examview: { bankId: bank.bankId, narratives: bank.narratives, matchingGroups: bank.groups, opaqueTrailerBase64: bank.trailingBytes?.length ? Buffer.from(bank.trailingBytes).toString('base64') : undefined } } };
  pqp.producer.exportedAt = new Date().toISOString();
  return { pqp, diagnostics, counts };
}
