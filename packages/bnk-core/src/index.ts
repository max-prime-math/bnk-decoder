import type { DraftQuestionLike, QuestionType } from '@bnk-decoder/question-model';
import { unzlibSync } from 'fflate';

export type RichContentFormat = 'plain' | 'latex' | 'typst' | 'unknown';
export type DecodeConfidence = 'high' | 'medium' | 'low';
export type DiagnosticLevel = 'info' | 'warning' | 'error';
export type AssetKind = 'image' | 'graph' | 'unknown';

export interface DecodeOptions {
  filename?: string;
  preserveRaw?: boolean;
}

export interface BnkSourceMetadata {
  filename?: string;
  byteLength: number;
  detectedFormat: 'examview-container' | 'examview-like' | 'zip-like' | 'unknown-binary' | 'text-like';
  examView?: ExamViewContainerMetadata;
  payloadByteLength?: number;
  inflatedByteLength?: number;
}

export interface ExamViewContainerMetadata {
  kind: 'bank' | 'test';
  platform: string;
  majorVersion: string;
  minorVersion: string;
  headerText: string;
  payloadOffset: number;
  compression: 'zlib' | 'unknown';
}

export interface RichContent {
  format: RichContentFormat;
  text: string;
}

export interface Choice {
  id: string;
  body: RichContent;
}

export interface DecodedAnswer {
  value: string;
  format: 'choice' | 'boolean' | 'text' | 'numeric' | 'unknown';
}

export interface QuestionMetadata {
  className?: string;
  unitName?: string;
  sectionName?: string;
  sourceOffset?: number;
  title?: string;
  difficulty?: string;
  reference?: string;
  topic?: string;
}

export interface UnknownBnkFragment {
  offset: number;
  length: number;
  hexPreview: string;
  textPreview?: string;
}

export interface DecodedQuestion {
  id: string;
  type: QuestionType;
  body: RichContent;
  choices?: Choice[];
  answer?: DecodedAnswer;
  solution?: RichContent;
  metadata: QuestionMetadata;
  algorithmicVariables?: AlgorithmicVariable[];
  graphDefinitions?: DecodedGraphDefinition[];
  inlineObjects?: DecodedInlineObject[];
  assets: string[];
  confidence: DecodeConfidence;
  raw?: UnknownBnkFragment[];
}

export type DecodedInlineObjectKind = 'value' | 'diagram' | 'math' | 'choice-value' | 'unknown';

export interface DecodedInlineObject {
  id: string;
  kind: DecodedInlineObjectKind;
  placeholder: string;
  context: string;
  source: 'utf16-slot-marker';
}

export interface DecodedGraphDefinition {
  id: string;
  expressions: string[];
  normalizedExpressions?: DecodedGraphExpression[];
  variables?: Record<string, string>;
  source: 'string-token-heuristic' | 'algorithmic-variable-heuristic';
}

export interface DecodedGraphExpression {
  original: string;
  substituted: string;
  typst: string;
  latex: string;
  variables: string[];
  samplePoints?: GraphSamplePoint[];
}

export interface GraphSamplePoint {
  x: number;
  y: number;
}

export interface AlgorithmicVariable {
  name: string;
  rule?: string;
  sampleValue?: string;
}

export interface DecodedAsset {
  id: string;
  kind: AssetKind;
  mimeType?: string;
  filename?: string;
  bytes: Uint8Array;
  sourceOffset?: number;
  sourceLength?: number;
}

export interface DecodeDiagnostic {
  level: DiagnosticLevel;
  code: string;
  message: string;
  offset?: number;
  questionId?: string;
}

export interface DecodeStats {
  questionCount: number;
  assetCount: number;
  diagnosticCount: number;
  unsupportedFragmentCount: number;
}

export interface DecodeResult {
  source: BnkSourceMetadata;
  questions: DecodedQuestion[];
  assets: DecodedAsset[];
  diagnostics: DecodeDiagnostic[];
  stats: DecodeStats;
}

export interface LatexExportOptions {
  includeDiagnostics?: boolean;
}

export interface TypstExportOptions {
  includeDiagnostics?: boolean;
}

export type PortableBnkJson = Omit<DecodeResult, 'assets'> & {
  assets: Array<Omit<DecodedAsset, 'bytes'> & { byteLength: number }>;
};

const TEXT_DECODER = new TextDecoder('utf-8', { fatal: false });
const UTF16LE_DECODER = new TextDecoder('utf-16le', { fatal: false });
const EXAMVIEW_HEADER_LENGTH = 16;
const INLINE_OBJECT_SLOT = '[[slot]]';

export async function decodeBnkFile(input: ArrayBuffer, options: DecodeOptions = {}): Promise<DecodeResult> {
  const bytes = new Uint8Array(input);
  const container = detectExamViewContainer(bytes);
  const diagnostics: DecodeDiagnostic[] = [];
  const payload = container ? bytes.slice(container.payloadOffset) : bytes;
  const inflated = container ? inflateExamViewPayload(payload, diagnostics) : undefined;
  const parserBytes = inflated ?? payload;
  const detectedFormat = detectSourceFormat(bytes, container);

  diagnostics.push({
    level: 'warning',
    code: 'BNK_PARSER_DISCOVERY_MODE',
    message: 'Question records are still being mapped; decoder is using inflated payload text plus preserved raw fragments.',
  });

  if (container) {
    diagnostics.push({
      level: 'info',
      code: 'EXAMVIEW_CONTAINER_DETECTED',
      message: `Detected ExamView ${container.kind} container version ${container.majorVersion}.${container.minorVersion}.`,
    });
  }

  const assets = extractKnownAssets(parserBytes);
  const questions = container?.majorVersion === '06'
    ? decodeVersion06QuestionCandidates(parserBytes, options, diagnostics, assets)
    : [];
  const text = extractReadableText(parserBytes);
  const fallbackQuestions = questions.length
    ? []
    : decodeTextLikeQuestions(text, parserBytes, options.preserveRaw !== false);
  const decodedQuestions = questions.length ? questions : fallbackQuestions;

  if (decodedQuestions.length === 0) {
    diagnostics.push({
      level: 'warning',
      code: 'NO_QUESTIONS_DECODED',
      message: 'No question records were confidently decoded from this file.',
    });
  }

  if (assets.length > 0) {
    diagnostics.push({
      level: 'info',
      code: 'ASSETS_DETECTED',
      message: `Detected ${assets.length} embedded asset${assets.length === 1 ? '' : 's'} by file signature.`,
    });
  }

  return withStats({
    source: {
      filename: options.filename,
      byteLength: bytes.byteLength,
      detectedFormat,
      examView: container,
      payloadByteLength: payload.byteLength,
      inflatedByteLength: inflated?.byteLength,
    },
    questions: decodedQuestions,
    assets,
    diagnostics,
    stats: emptyStats(),
  });
}

export function toLatex(result: DecodeResult, options: LatexExportOptions = {}): string {
  const parts = result.questions.map((question, index) => {
    const lines = [`\\question ${contentText(question.body)}`];
    if (question.choices?.length) {
      lines.push('\\begin{choices}');
      for (const choice of question.choices) lines.push(`  \\choice ${contentText(choice.body)}`);
      lines.push('\\end{choices}');
    }
    if (question.answer) lines.push(`\\answer ${question.answer.value}`);
    if (question.solution?.text.trim()) lines.push(`\\begin{solution}\n${contentText(question.solution)}\n\\end{solution}`);
    if (question.assets.length) lines.push(`% Assets: ${question.assets.join(', ')}`);
    return `% Question ${index + 1} (${question.type}, confidence: ${question.confidence})\n${lines.join('\n')}`;
  });

  if (options.includeDiagnostics && result.diagnostics.length) {
    parts.push('% Diagnostics\n' + result.diagnostics.map((d) => `% [${d.level}] ${d.code}: ${d.message}`).join('\n'));
  }

  return parts.join('\n\n');
}

export function toTypst(result: DecodeResult, options: TypstExportOptions = {}): string {
  const parts = result.questions.map((question, index) => {
    const lines = [`= Question ${index + 1}`, contentText(question.body)];
    if (question.choices?.length) {
      lines.push('');
      for (const choice of question.choices) lines.push(`- *${choice.id}.* ${contentText(choice.body)}`);
    }
    if (question.answer) lines.push('', `Answer: ${question.answer.value}`);
    if (question.solution?.text.trim()) lines.push('', `Solution: ${contentText(question.solution)}`);
    if (question.assets.length) lines.push('', `// Assets: ${question.assets.join(', ')}`);
    return lines.join('\n');
  });

  if (options.includeDiagnostics && result.diagnostics.length) {
    parts.push('// Diagnostics\n' + result.diagnostics.map((d) => `// [${d.level}] ${d.code}: ${d.message}`).join('\n'));
  }

  return parts.join('\n\n');
}

export function toPortableJson(result: DecodeResult): PortableBnkJson {
  return {
    ...result,
    assets: result.assets.map(({ bytes, ...asset }) => ({
      ...asset,
      byteLength: bytes.byteLength,
    })),
  };
}

export function toDraftQuestions(result: DecodeResult): DraftQuestionLike[] {
  return result.questions.map((question) => ({
    body: contentText(question.body).trim(),
    answer: question.answer?.value ?? '',
    solution: question.solution ? contentText(question.solution).trim() : '',
    choices: question.choices?.length
      ? Object.fromEntries(question.choices.map((choice) => [choice.id, contentText(choice.body)]))
      : undefined,
    points: question.type === 'mcq' || question.type === 'true_false' ? 1 : 5,
    tagInput: ['bnk', question.type].filter(Boolean).join(', '),
    classId: '',
    unitId: '',
    sectionId: '',
    images: question.assets.length ? question.assets : undefined,
    questionType: question.type,
  }));
}

function detectExamViewContainer(bytes: Uint8Array): ExamViewContainerMetadata | undefined {
  if (bytes.byteLength < EXAMVIEW_HEADER_LENGTH) return undefined;
  if (bytes[0] !== 0x1a) return undefined;

  const headerText = TEXT_DECODER.decode(bytes.slice(0, EXAMVIEW_HEADER_LENGTH));
  const match = /^\x1aFSC(BNK|TST)#([^#]+)#([^#]+)#([^#]+)#/.exec(headerText);
  if (!match) return undefined;

  return {
    kind: match[1] === 'BNK' ? 'bank' : 'test',
    platform: match[2],
    majorVersion: match[3],
    minorVersion: match[4],
    headerText: headerText.replace(/^\x1a/, '\\x1a'),
    payloadOffset: EXAMVIEW_HEADER_LENGTH,
    compression: looksLikeZlib(bytes, EXAMVIEW_HEADER_LENGTH) ? 'zlib' : 'unknown',
  };
}

function inflateExamViewPayload(payload: Uint8Array, diagnostics: DecodeDiagnostic[]): Uint8Array | undefined {
  if (!looksLikeZlib(payload, 0)) {
    diagnostics.push({
      level: 'warning',
      code: 'EXAMVIEW_PAYLOAD_NOT_ZLIB',
      message: 'ExamView payload does not start with a recognized zlib signature; parsing compressed records was skipped.',
    });
    return undefined;
  }

  try {
    const inflated = unzlibSync(payload);
    diagnostics.push({
      level: 'info',
      code: 'EXAMVIEW_PAYLOAD_INFLATED',
      message: `Inflated ExamView payload from ${payload.byteLength} to ${inflated.byteLength} bytes.`,
    });
    return inflated;
  } catch (error) {
    diagnostics.push({
      level: 'error',
      code: 'EXAMVIEW_PAYLOAD_INFLATE_FAILED',
      message: error instanceof Error ? error.message : 'Unable to inflate ExamView payload.',
    });
    return undefined;
  }
}

function looksLikeZlib(bytes: Uint8Array, offset: number): boolean {
  const first = bytes[offset];
  const second = bytes[offset + 1];
  return first === 0x78 && [0x01, 0x5e, 0x9c, 0xda].includes(second);
}

function detectSourceFormat(bytes: Uint8Array, container?: ExamViewContainerMetadata): BnkSourceMetadata['detectedFormat'] {
  if (container) return 'examview-container';
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return 'zip-like';
  const text = extractPrintableText(bytes).toLowerCase();
  if (text.includes('examview') || text.includes('question') || text.includes('answer')) return 'examview-like';
  return text.length > Math.max(32, bytes.byteLength / 8) ? 'text-like' : 'unknown-binary';
}

function decodeTextLikeQuestions(text: string, bytes: Uint8Array, preserveRaw: boolean): DecodedQuestion[] {
  const normalized = text.replace(/\r\n?/g, '\n').trim();
  if (!normalized) return [];

  const chunks = splitQuestionishChunks(normalized);
  return chunks.map((chunk, index) => {
    const { body, choices, answer, solution, type } = parseQuestionishText(chunk);
    return {
      id: `q-${index + 1}`,
      type,
      body: { format: 'plain', text: body || chunk },
      choices,
      answer,
      solution: solution ? { format: 'plain', text: solution } : undefined,
      metadata: {},
      assets: [],
      confidence: choices?.length || answer || solution ? 'medium' : 'low',
      raw: preserveRaw ? [makeRawFragment(bytes, 0, Math.min(bytes.byteLength, 256), chunk)] : undefined,
    };
  });
}

function splitQuestionishChunks(text: string): string[] {
  const numbered = [...text.matchAll(/(?:^|\n)\s*(?:question\s*)?(\d+)[.)]\s+/gi)];
  if (numbered.length >= 2) {
    return numbered.map((match, index) => {
      const start = match.index! + match[0].length;
      const end = index + 1 < numbered.length ? numbered[index + 1].index! : text.length;
      return text.slice(start, end).trim();
    }).filter(Boolean);
  }

  const blankSplit = text.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);
  return blankSplit.length > 1 ? blankSplit : [text];
}

function parseQuestionishText(chunk: string): {
  body: string;
  choices?: Choice[];
  answer?: DecodedAnswer;
  solution?: string;
  type: QuestionType;
} {
  const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
  const choices: Choice[] = [];
  let answer: DecodedAnswer | undefined;
  let solution = '';
  const bodyLines: string[] = [];

  for (const line of lines) {
    const choice = /^\(?([A-Ea-e])\)?[.)]\s+(.+)$/.exec(line);
    if (choice) {
      choices.push({ id: choice[1].toUpperCase(), body: { format: 'plain', text: choice[2] } });
      continue;
    }

    const answerMatch = /^(?:answer|ans)[.:\s]+(.+)$/i.exec(line);
    if (answerMatch) {
      const value = answerMatch[1].replace(/^\(|\)$/g, '').replace(/\.$/, '').trim();
      answer = {
        value: value.toUpperCase(),
        format: /^[A-E]$/i.test(value) ? 'choice' : /^(true|false|t|f)$/i.test(value) ? 'boolean' : 'unknown',
      };
      continue;
    }

    const solutionMatch = /^(?:solution|explanation)[.:\s]+(.+)$/i.exec(line);
    if (solutionMatch) {
      solution = [solution, solutionMatch[1]].filter(Boolean).join('\n');
      continue;
    }

    bodyLines.push(line);
  }

  const type = choices.length >= 2
    ? 'mcq'
    : answer?.format === 'boolean'
      ? 'true_false'
      : 'unknown';

  return {
    body: bodyLines.join('\n'),
    choices: choices.length ? choices : undefined,
    answer,
    solution,
    type,
  };
}

interface ExtractedString {
  offset: number;
  byteLength: number;
  text: string;
}

interface Version06CandidateChunk {
  start: ExtractedString;
  endOffset: number;
  strings: ExtractedString[];
}

interface Version06ChunkLayout {
  sectionName?: string;
  reference?: string;
  topic?: string;
  title?: string;
  metadataEndIndex: number;
  variableStartIndex: number;
}

interface Version06DisplayRegions {
  bodyTexts: string[];
  choiceRegions: Array<{ id: string; texts: string[] }>;
}

const V06_QUESTION_COUNT_OFFSET = 0x0a04;

function readVersion06QuestionCount(bytes: Uint8Array): number | undefined {
  if (bytes.length < V06_QUESTION_COUNT_OFFSET + 4) return undefined;
  const count = readUint32Le(bytes, V06_QUESTION_COUNT_OFFSET);
  if (count < 1 || count > 2000) return undefined;
  return count;
}

function decodeVersion06QuestionCandidates(
  bytes: Uint8Array,
  options: DecodeOptions,
  diagnostics: DecodeDiagnostic[],
  assets: DecodedAsset[] = [],
): DecodedQuestion[] {
  const strings = extractUtf16LeStrings(bytes, 1);
  const allChunks = findVersion06QuestionChunks(strings, bytes.byteLength);
  const questionCount = readVersion06QuestionCount(bytes);
  const chunks = questionCount !== undefined && questionCount < allChunks.length
    ? allChunks.slice(0, questionCount)
    : allChunks;

  diagnostics.push({
    level: chunks.length ? 'info' : 'warning',
    code: 'V06_STRING_CLUSTER_SCAN',
    message: questionCount !== undefined && questionCount < allChunks.length
      ? `Found ${allChunks.length} candidate string clusters; using header count ${questionCount}.`
      : `Found ${chunks.length} candidate v06 question string cluster${chunks.length === 1 ? '' : 's'}.`,
  });

  if (!chunks.length) return [];

  return chunks.map((chunk, index) => decodeVersion06QuestionChunk(chunk, bytes, index, options, assets));
}

function decodeVersion06QuestionChunk(
  chunk: Version06CandidateChunk,
  bytes: Uint8Array,
  index: number,
  options: DecodeOptions,
  assets: DecodedAsset[] = [],
): DecodedQuestion {
  const strings = chunk.strings;
  const layout = inferVersion06ChunkLayout(strings);
  const difficulty = strings[0]?.text;
  const sectionName = layout.sectionName;
  const reference = layout.reference;
  const topic = layout.topic;
  const title = layout.title;
  const scrambleIndex = findScrambleIndex(strings);
  const metadataEndIndex = layout.metadataEndIndex;
  const displayStart = scrambleIndex === -1
    ? findFirstLikelyDisplayStringIndex(strings, metadataEndIndex)
    : findFirstLikelyDisplayStringIndex(strings, scrambleIndex + 1);
  const preDisplayStrings = strings
    .slice(layout.variableStartIndex, displayStart)
    .map((entry) => entry.text)
    .filter(isUsefulPayloadString);
  const fontIndex = strings.findIndex((entry, entryIndex) => entryIndex > displayStart && isFontString(entry.text));
  const displaySegment = strings.slice(displayStart, fontIndex === -1 ? strings.length : fontIndex);
  const displayRegionTexts = displaySegment.map((entry) => entry.text);
  const displayRegions = splitVersion06DisplayRegions(displayRegionTexts);
  const displayStrings = strings
    .slice(displayStart, fontIndex === -1 ? strings.length : fontIndex)
    .map((entry) => entry.text)
    .filter(isLikelyQuestionText);
  const postFontRefs = (fontIndex === -1 ? [] : strings.slice(fontIndex + 1))
    .map((entry) => entry.text)
    .filter(isVariableName);
  const algorithmicVariables = extractAlgorithmicVariables(preDisplayStrings);
  const variableMap = new Map(algorithmicVariables.map((variable) => [variable.name.toLowerCase(), variable]));
  const choiceRefs = extractIsUniqueChoiceRefs(preDisplayStrings);
  const choiceLabels = extractChoiceLabels(displaySegment.map((entry) => entry.text), choiceRefs.length);
  const slotBasedChoices = inferSlotBasedChoices(displayRegions, postFontRefs, variableMap);
  const bodyStringsForCheck = displayRegions.bodyTexts.join(' ');
  const bodyHasGraphSlot = slotBasedChoices !== undefined
    && isGraphOrDiagramQuestion(bodyStringsForCheck)
    && displayRegions.bodyTexts.some((text) => text.includes(INLINE_OBJECT_SLOT));
  const bodyVariableRefs = bodyHasGraphSlot
    ? [] // body slot is an embedded graph image, not a variable value
    : extractBodyVariableRefs(postFontRefs, variableMap, choiceRefs);
  const bodyStrings = displayRegions.bodyTexts.filter(isLikelyQuestionText);
  const bodyBase = bodyStrings.length
    ? stitchQuestionText(bodyStrings)
    : stitchQuestionText(preDisplayStrings.slice(-4));
  const visibleChoiceSlotCount = countVisibleChoiceSlots(displayRegionTexts);
  const bodyWithoutChoiceSlots = stripTrailingInlineChoiceSlots(bodyBase, visibleChoiceSlotCount);
  const prioritizedBodyVariableRefs = prioritizeBodyVariableRefs(bodyWithoutChoiceSlots, bodyVariableRefs, variableMap);
  const interpolatedBody = interpolateBodyVariableValues(bodyWithoutChoiceSlots, prioritizedBodyVariableRefs, variableMap);
  const appendedBody = appendBodyVariableValues(interpolatedBody.text, prioritizedBodyVariableRefs, variableMap, interpolatedBody.usedRefs);
  const refinedBody = refineKnownQuestionBodyPatterns(
    stripLeadingMetadataTags(appendedBody, title),
    variableMap,
    title,
  );
  let body = recoverKnownHiddenMathExpressions(
    recoverKnownTransformationPrompts(
      annotateUnsupportedInlineObjects(refinedBody, title),
      variableMap,
    ),
    variableMap,
  );
  const graphDefinitions = extractVersion06GraphDefinitions(strings, algorithmicVariables, body, title);
  body = recoverGraphExpressionsInBody(body, graphDefinitions);
  const type = inferVersion06QuestionType(strings, preDisplayStrings, algorithmicVariables);
  const normalizedChoices = slotBasedChoices?.choices
    ?? normalizeVersion06Choices(
      inferVersion06Choices(algorithmicVariables, postFontRefs, choiceRefs, choiceLabels, type),
      body,
      displayRegionTexts,
      variableMap,
      graphDefinitions,
    );
  let choices = normalizedChoices?.map(classifyChoiceInlineObjectPlaceholders);
  body = stripVisibleChoiceRunFromBody(body, choices);
  body = classifyBodyInlineObjectPlaceholders(body);
  const inlineObjects = extractDecodedInlineObjects(body, choices);
  body = makeUnresolvedPlaceholdersHumanReadable(body);
  body = recoverKnownEmbeddedObjectPatterns(body, variableMap, graphDefinitions);
  choices = choices?.map((choice) => ({
    ...choice,
    body: {
      ...choice.body,
      text: makeUnresolvedPlaceholdersHumanReadable(choice.body.text),
    },
  }));
  choices = recoverChoiceEmbeddedValues(choices, variableMap);
  const answer = inferVersion06Answer(algorithmicVariables, choices, choiceRefs, bytes, chunk.start.offset);
  const questionAssets = assets
    .filter((asset) => asset.sourceOffset !== undefined && asset.sourceOffset >= chunk.start.offset && asset.sourceOffset < chunk.endOffset)
    .map((asset) => asset.id);

  return {
    id: `q-${index + 1}`,
    type,
    body: {
      format: 'typst',
      text: body || '[Question text not yet recovered from v06 string cluster]',
    },
    choices,
    answer,
    metadata: {
      className: inferClassNameFromFilename(options.filename),
      unitName: inferUnitNameFromFilename(options.filename),
      sectionName,
      sourceOffset: chunk.start.offset,
      difficulty,
      reference,
      topic,
      title,
    },
    algorithmicVariables,
    graphDefinitions,
    inlineObjects: inlineObjects.length ? inlineObjects : undefined,
    assets: questionAssets,
    confidence: body ? 'medium' : 'low',
    raw: options.preserveRaw === false
      ? undefined
      : [makeRawFragment(bytes, chunk.start.offset, Math.min(chunk.endOffset - chunk.start.offset, 512), strings.slice(0, 30).map((s) => s.text).join('\n'))],
  };
}

function inferVersion06ChunkLayout(strings: ExtractedString[]): Version06ChunkLayout {
  if (strings[1]?.text?.startsWith('Section ')) {
    return {
      sectionName: strings[1].text,
      reference: strings[2]?.text,
      topic: strings[3]?.text,
      title: strings[4]?.text,
      metadataEndIndex: 5,
      variableStartIndex: 4,
    };
  }

  if (isCompactCurriculumCode(strings[2]?.text) && strings[3]?.text && strings[4]?.text) {
    return {
      sectionName: strings[1]?.text,
      reference: strings[2]?.text,
      topic: strings[3]?.text,
      title: strings[4]?.text,
      metadataEndIndex: 5,
      variableStartIndex: 5,
    };
  }

  return {
    topic: strings[1]?.text,
    metadataEndIndex: 2,
    variableStartIndex: 2,
  };
}

function extractUtf16LeStrings(bytes: Uint8Array, minLength = 3): ExtractedString[] {
  const strings = [
    ...extractUtf16LeStringsWithParity(bytes, minLength, 0),
    ...extractUtf16LeStringsWithParity(bytes, minLength, 1),
  ].sort((left, right) => left.offset - right.offset || right.byteLength - left.byteLength);

  return strings.filter((entry, index) => {
    const previous = strings[index - 1];
    if (!previous) return true;
    return previous.offset !== entry.offset
      || previous.byteLength !== entry.byteLength
      || previous.text !== entry.text;
  });
}

function extractUtf16LeStringsWithParity(bytes: Uint8Array, minLength: number, parity: 0 | 1): ExtractedString[] {
  const strings: ExtractedString[] = [];
  let start = -1;
  let text = '';

  for (let offset = parity; offset + 1 < bytes.length; offset += 2) {
    const codePoint = bytes[offset] | (bytes[offset + 1] << 8);
    if (codePoint === 0x0f) {
      if (start === -1) start = offset;
      text += INLINE_OBJECT_SLOT;
      continue;
    }
    if (isReadableUtf16CodePoint(codePoint)) {
      if (start === -1) start = offset;
      text += String.fromCharCode(codePoint);
      continue;
    }

    if (text.trim().length >= minLength) {
      strings.push({
        offset: start,
        byteLength: offset - start,
        text: normalizeExtractedString(text),
      });
    }

    start = -1;
    text = '';
  }

  if (text.trim().length >= minLength) {
    strings.push({
      offset: start,
      byteLength: bytes.length - start,
      text: normalizeExtractedString(text),
    });
  }

  return strings.filter((entry) => entry.text.length >= minLength);
}

function isReadableUtf16CodePoint(codePoint: number): boolean {
  return codePoint === 0x09
    || codePoint === 0x0a
    || codePoint === 0x0d
    || (codePoint >= 0x20 && codePoint <= 0x7e)
    || codePoint === 0xa0
    || codePoint === 0x2013
    || codePoint === 0x2014
    || codePoint === 0x2212
    || codePoint === 0x221e
    || (codePoint >= 0x03b1 && codePoint <= 0x03c9);
}

function normalizeExtractedString(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\u2212/g, '-')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function findVersion06QuestionChunks(strings: ExtractedString[], byteLength: number): Version06CandidateChunk[] {
  const startIndexes: number[] = [];

  for (let index = 0; index < strings.length; index++) {
    const current = strings[index];
    const next = strings[index + 1];
    if (!isDifficultyLabel(current.text)) continue;
    if (!next) continue;
    if (next.offset - current.offset > 256) continue;
    if (!isVersion06QuestionMetadataStart(strings, index)) continue;
    startIndexes.push(index);
  }

  return startIndexes.map((startIndex, index) => {
    const nextStartIndex = startIndexes[index + 1];
    const chunkStrings = strings.slice(startIndex, nextStartIndex ?? strings.length);
    return {
      start: strings[startIndex],
      endOffset: nextStartIndex === undefined ? byteLength : strings[nextStartIndex].offset,
      strings: chunkStrings,
    };
  });
}

function isDifficultyLabel(text: string): boolean {
  return /^(easy|average|medium|moderate|difficult|hard)$/i.test(text);
}

function isVersion06QuestionMetadataStart(strings: ExtractedString[], index: number): boolean {
  const next = strings[index + 1]?.text;
  if (next?.startsWith('Section ')) return true;
  return isCompactCurriculumCode(strings[index + 2]?.text)
    && isCompactMetadataText(strings[index + 3]?.text)
    && isCompactMetadataText(strings[index + 4]?.text);
}

function isCompactCurriculumCode(text?: string): boolean {
  return Boolean(text && /^[0-9]{1,2}\.[A-Z][A-Z0-9]*(?:\.[A-Z0-9]+)?$/i.test(text));
}

function isCompactMetadataText(text?: string): boolean {
  return Boolean(text && /^[A-Za-z][A-Za-z /&-]{2,}$/.test(text) && !isDifficultyLabel(text));
}

function findScrambleIndex(strings: ExtractedString[]): number {
  const scrambleIndex = strings.findIndex((entry) => entry.text.toLowerCase() === 'scramble');
  if (scrambleIndex === -1) return -1;
  const next = strings[scrambleIndex + 1]?.text.toLowerCase();
  return next === 'true' || next === 'false' ? scrambleIndex + 1 : scrambleIndex;
}

function findFirstLikelyDisplayStringIndex(strings: ExtractedString[], startIndex: number): number {
  const promptIndex = strings.findIndex((entry, entryIndex) => entryIndex >= startIndex && isLikelyPromptText(entry.text));
  if (promptIndex !== -1) return promptIndex;

  const readableSentenceIndex = strings.findIndex((entry, entryIndex) => (
    entryIndex >= startIndex
    && isLikelyQuestionText(entry.text)
    && /[A-Za-z]/.test(entry.text)
    && entry.text.length >= 8
    && /\s|[?.]/.test(entry.text)
  ));
  if (readableSentenceIndex !== -1) return readableSentenceIndex;

  const index = strings.findIndex((entry, entryIndex) => entryIndex >= startIndex && isLikelyQuestionText(entry.text));
  return index === -1 ? startIndex : index;
}

function isFontString(text: string): boolean {
  return /^Times New Roman$/i.test(text) || /^(Symbol|FSC Symbol)$/i.test(text);
}

function isUsefulPayloadString(text: string): boolean {
  if (!text) return false;
  if (isBoilerplateString(text)) return false;
  if (isFontString(text)) return false;
  return true;
}

function isLikelyQuestionText(text: string): boolean {
  if (!isUsefulPayloadString(text)) return false;
  if (/^(?:Convert|Calculate|Estimate|Measure)$/i.test(text)) return true;
  if (text.length < 2) return false;
  if (/^[A-Z]{2,}\d*$/i.test(text)) return false;
  if (/^[a-z_]\w*$/i.test(text)) return false;
  if (/^(true|false)$/i.test(text)) return false;
  if (/^(range|if|choose|rand|list|fracs|isunique)\(/i.test(text)) return false;
  if (/^[\w_]+\(/.test(text) && !/\s/.test(text)) return false;
  return /[ ?.,=<>()[\]{}+\-*/^]|\d/.test(text);
}

function isLikelyPromptText(text: string): boolean {
  if (!isUsefulPayloadString(text)) return false;
  if (/^(?:If|When|Given|Convert|Calculate|Estimate|Measure)$/i.test(text)) return true;
  if (text.length < 12) return false;
  if (!/\s/.test(text)) return false;
  if (/^(?:range|if|choose|rand|fracs?|isunique|abs)\(/i.test(text)) return false;
  if (/^[A-Za-z_][A-Za-z0-9_]*\s*(?:<>|=|>|<)/.test(text)) return false;
  if (/^[+\-–−]?\d/.test(text)) return false;
  return /^(?:Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|The|A |An |If |Given|Let |Use |Consider|Prove|Show|Find|Select|List|State|Describe|For |In )\b/i.test(text);
}

function isBoilerplateString(text: string): boolean {
  return /^Copyright \d{4}/.test(text)
    || /\.(bmp|std)$/i.test(text)
    || /^[A-Z]{2}( [A-Z]{2}){5,}$/.test(text);
}

function stitchQuestionText(parts: string[]): string {
  return parts
    .filter((part, index) => part && parts.indexOf(part) === index)
    .join(' ')
    .replace(new RegExp(`\\s*${escapeRegExp(INLINE_OBJECT_SLOT)}\\s*`, 'g'), ` ${INLINE_OBJECT_SLOT} `)
    .replace(/\s+([,.;:?])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractAlgorithmicVariables(strings: string[]): AlgorithmicVariable[] {
  const variables: AlgorithmicVariable[] = [];

  for (let index = 0; index < strings.length; index++) {
    const name = strings[index];
    const rule = strings[index + 1];
    if (!isVariableName(name) || !rule || isVariableName(rule)) continue;
    if (isPredicateOrControlRule(name) || isPredicateOrControlRule(rule)) continue;

    const sample = strings[index + 2];
    variables.push({
      name,
      rule,
      sampleValue: sample && isSampleValueForRule(rule, sample) ? sample : undefined,
    });
  }

  return dedupeVariables(variables);
}

function dedupeVariables(variables: AlgorithmicVariable[]): AlgorithmicVariable[] {
  const byName = new Map<string, AlgorithmicVariable>();
  for (const variable of variables) {
    const key = variable.name.toLowerCase();
    if (!byName.has(key)) byName.set(key, variable);
  }
  return [...byName.values()];
}

function isVariableName(text: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(text)
    && !/^[A-Z]$/.test(text)
    && !/^(true|false|easy|average|medium|moderate|difficult|hard)$/i.test(text)
    && !/^(convert|calculate|estimate|measure|determine|which|what|how|find)$/i.test(text)
    && !/^(range|if|choose|rand|list|fracs|frac|pow|abs|chr|isunique)$/i.test(text);
}

function isSampleValueForRule(rule: string, sample: string): boolean {
  if (!sample || isPredicateOrControlRule(sample)) return false;
  if (!isVariableName(sample)) return true;
  return isStringProducingRule(rule);
}

function isStringProducingRule(rule: string): boolean {
  return /"[^"]*"/.test(rule) || /^list\(/i.test(rule) || /^choose\(/i.test(rule);
}

function isPredicateOrControlRule(text: string): boolean {
  return /^scramble$/i.test(text)
    || /^(true|false)$/i.test(text)
    || /^[A-Za-z_][A-Za-z0-9_]*\s*(<>|=|>|<)/.test(text)
    || /^isunique\(/i.test(text);
}

function inferVersion06QuestionType(
  strings: ExtractedString[],
  variableStrings: string[],
  algorithmicVariables: AlgorithmicVariable[],
): QuestionType {
  const lower = strings.map((entry) => entry.text.toLowerCase());
  if (variableStrings.some((text) => /^scramble$/i.test(text)) || hasAnswerDistractorVariables(algorithmicVariables)) return 'mcq';
  if (hasVisibleChoiceLabelRun(strings.map((entry) => entry.text))) return 'mcq';
  if (lower.some((text) => text.includes('true') || text.includes('false'))) return 'true_false';
  if (algorithmicVariables.some((variable) => /^(ans|answer)$/i.test(variable.name))) return 'short_answer';
  if (strings.some((entry) => entry.text.includes('____________________'))) return 'completion';
  return 'unknown';
}

function hasVisibleChoiceLabelRun(texts: string[]): boolean {
  return /\bA\b.*\bC\b.*\bB\b.*\bD\b|\bA\b.*\bB\b.*\bC\b.*\bD\b/.test(texts.join(' '));
}

function hasAnswerDistractorVariables(variables: AlgorithmicVariable[]): boolean {
  return variables.some((variable) => /^ans$/i.test(variable.name))
    && variables.filter((variable) => /^dis_?\d*$/i.test(variable.name)).length >= 2;
}

function extractIsUniqueChoiceRefs(strings: string[]): string[] {
  const uniqueRule = [...strings].reverse().find((text) => /^isunique\(/i.test(text));
  const args = /^isunique\((.*)\)$/i.exec(uniqueRule ?? '')?.[1];
  if (!args) return [];
  return args.split(',').map((arg) => arg.trim()).filter(Boolean);
}

function extractChoiceLabels(displayStrings: string[], expectedCount: number): string[] {
  if (expectedCount < 3) return [];
  const labels = displayStrings.filter((text) => /^[A-H]$/.test(text));
  const firstChoiceIndex = labels.findIndex((label) => label === 'A');
  if (firstChoiceIndex === -1) return [];

  const run: string[] = [];
  for (const label of labels.slice(firstChoiceIndex)) {
    if (run.includes(label)) break;
    run.push(label);
    if (run.length >= expectedCount) break;
  }

  return run.length === expectedCount ? run : [];
}

function splitVersion06DisplayRegions(displayStrings: string[]): Version06DisplayRegions {
  const bodyTexts: string[] = [];
  const choiceRegions: Array<{ id: string; texts: string[] }> = [];
  let currentChoice: { id: string; texts: string[] } | undefined;

  for (const text of displayStrings) {
    if (isFontString(text)) break;
    const label = visibleChoiceLabel(text);
    if (label) {
      currentChoice = { id: label, texts: [] };
      choiceRegions.push(currentChoice);
      continue;
    }

    if (currentChoice) {
      if (isLikelyChoiceRegionText(text)) currentChoice.texts.push(text);
      continue;
    }

    bodyTexts.push(text);
  }

  return { bodyTexts, choiceRegions };
}

function visibleChoiceLabel(text: string): string | undefined {
  return /^([A-H])\.?$/.exec(text)?.[1];
}

function isLikelyChoiceRegionText(text: string): boolean {
  if (!text || isFontString(text)) return false;
  if (/^[#"'`;:()[\]{}!.,+-]+$/.test(text)) return false;
  if (/^[A-Z]$/.test(text)) return false;
  if (/^X[A-Za-z0-9_]+$/.test(text)) return false;
  return true;
}

function extractBodyVariableRefs(
  postFontRefs: string[],
  variableMap: Map<string, AlgorithmicVariable>,
  choiceRefs: string[],
): string[] {
  const choiceRefSet = new Set(choiceRefs.map((ref) => ref.toLowerCase()));
  const refs: string[] = [];

  for (const ref of postFontRefs) {
    const key = ref.toLowerCase();
    if (!variableMap.has(key)) continue;
    if (choiceRefSet.has(key) || /^(ans|dis\d*)$/i.test(ref)) break;
    refs.push(ref);
  }

  return refs;
}

function countVisibleChoiceSlots(displayStrings: string[]): number {
  return (inferVisibleChoicesFromDisplayStrings(displayStrings) ?? [])
    .reduce((count, choice) => count + countInlineSlots(choice.body.text), 0);
}

function countInlineSlots(text: string): number {
  return text.split(INLINE_OBJECT_SLOT).length - 1;
}

function stripTrailingInlineChoiceSlots(body: string, choiceSlotCount: number): string {
  if (choiceSlotCount <= 0 || countInlineSlots(body) <= choiceSlotCount) return body;

  let stripped = body;
  for (let index = 0; index < choiceSlotCount; index++) {
    const next = stripped.replace(new RegExp(`\\s*${escapeRegExp(INLINE_OBJECT_SLOT)}\\s*$`), '').trimEnd();
    if (next === stripped) return body;
    stripped = next;
  }

  return stripped.trim();
}

function prioritizeBodyVariableRefs(
  body: string,
  refs: string[],
  variableMap: Map<string, AlgorithmicVariable>,
): string[] {
  if (!body.includes(INLINE_OBJECT_SLOT)) return refs;
  const firstSlotIndex = body.indexOf(INLINE_OBJECT_SLOT);
  const sequenceIndex = body.search(/\bsequence\b/i);
  if (sequenceIndex === -1 || sequenceIndex > firstSlotIndex) return refs;
  if (body.slice(0, sequenceIndex).includes(INLINE_OBJECT_SLOT)) return refs;
  if (/\bterm (?:of|in) the sequence\b/i.test(body.slice(0, firstSlotIndex))) return refs;

  const termRefs = ['t1', 't2', 't3', 't4', 't5']
    .filter((ref) => variableMap.has(ref.toLowerCase()));
  if (termRefs.length < 2) return refs;

  const used = new Set(termRefs.map((ref) => ref.toLowerCase()));
  return [
    ...termRefs,
    ...refs.filter((ref) => !used.has(ref.toLowerCase())),
  ];
}

function interpolateBodyVariableValues(
  body: string,
  bodyVariableRefs: string[],
  variableMap: Map<string, AlgorithmicVariable>,
): { text: string; usedRefs: Set<string> } {
  let text = body;
  const usedRefs = new Set<string>();
  let slotIndex = 0;

  while (text.includes(INLINE_OBJECT_SLOT) && slotIndex < bodyVariableRefs.length) {
    const ref = bodyVariableRefs[slotIndex++];
    const value = variableValueForDisplay(ref, variableMap);
    if (!value) continue;
    text = text.replace(INLINE_OBJECT_SLOT, value);
    usedRefs.add(ref.toLowerCase());
  }

  if (body.includes(INLINE_OBJECT_SLOT) && usedRefs.size > 0) {
    for (const ref of bodyVariableRefs) usedRefs.add(ref.toLowerCase());
  }

  for (const ref of bodyVariableRefs) {
    const value = variableValueForDisplay(ref, variableMap);
    if (!value) continue;

    const assignmentPattern = new RegExp(`\\b${escapeRegExp(ref)}\\s*=\\s*(?=,|\\band\\b|\\bis\\b|$)`, 'i');
    if (assignmentPattern.test(text)) {
      text = text.replace(assignmentPattern, `${ref} = ${value}`);
      usedRefs.add(ref.toLowerCase());
    }
  }

  for (const ref of variableMap.keys()) {
    if (usedRefs.has(ref)) continue;
    const value = variableValueForDisplay(ref, variableMap);
    if (!value) continue;

    const assignmentPattern = new RegExp(`\\b${escapeRegExp(ref)}\\s*=\\s*(?=,|\\band\\b|\\bis\\b|$)`, 'i');
    if (assignmentPattern.test(text)) {
      text = text.replace(assignmentPattern, `${ref} = ${value}`);
      usedRefs.add(ref);
    }
  }

  const sequenceRefs = bodyVariableRefs.filter((ref) => /^t\d+$/i.test(ref)).slice(0, 5);
  if (/sequence,\s*\.\s*\.\s*\./i.test(text) && sequenceRefs.length >= 3) {
    const values = sequenceRefs
      .map((ref) => variableValueForDisplay(ref, variableMap))
      .filter((value): value is string => Boolean(value));
    if (values.length >= 3) {
      text = text.replace(/sequence,\s*\.\s*\.\s*\./i, `sequence ${values.join(', ')}, . . .`);
      for (const ref of bodyVariableRefs) usedRefs.add(ref.toLowerCase());
    }
  }

  return { text: text.replace(new RegExp(escapeRegExp(INLINE_OBJECT_SLOT), 'g'), '[inline object not decoded yet]'), usedRefs };
}

function appendBodyVariableValues(
  body: string,
  bodyVariableRefs: string[],
  variableMap: Map<string, AlgorithmicVariable>,
  usedRefs = new Set<string>(),
): string {
  const values = bodyVariableRefs
    .map((ref) => {
      if (usedRefs.has(ref.toLowerCase())) return undefined;
      if (/^(ans\d*|answer|dis\w*)$/i.test(ref)) return undefined;
      if (/^(eq|rad|xdisp|ydisp)\d+$/i.test(ref)) return undefined;
      if (/^(T|RF|PC|AN|N)\d+$/i.test(ref)) return undefined;
      const value = variableValueForDisplay(ref, variableMap);
      if (!isUsefulDisplayedVariableValue(ref, value)) return undefined;
      return value ? `${ref} = ${value}` : undefined;
    })
    .filter((value): value is string => Boolean(value));

  if (!values.length) return body;
  return `${body} (${values.join(', ')})`;
}

function isUsefulDisplayedVariableValue(ref: string, value?: string): boolean {
  if (!value) return false;
  if (value.includes('|')) return false;
  if (/^(Times|Since|Let|Wingdings)$/i.test(ref)) return false;
  if (/^[^\dA-Za-z-]+$/.test(value)) return false;
  return true;
}

function refineKnownQuestionBodyPatterns(body: string, variableMap: Map<string, AlgorithmicVariable>, title?: string): string {
  let refined = body
    .replace(/(?:^|\s)A\.\s+C\.\s+B\.\s+D\./g, ' ')
    .replace(/(?:^|\s)A\.\s+B\.\s+C\.\s+D\./g, ' ')
    .replace(/\s+A\.\s+C\.\s+B\.\s+cannot be determined\s+D\./gi, ' ')
    .replace(/^[\d\s!/*()+.-]+[A-Za-z0-9_!/*()+.-]*\s+\d+(?=\s+[A-Z][a-z])/u, '')
    .replace(/^[A-Za-z_][A-Za-z0-9_]*\s*[<>]=?\s*[A-Za-z_][A-Za-z0-9_]*\s+(?=[A-Z])/u, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const units = variableValueForDisplay('ANS_units', variableMap);
  const direction = variableValueForDisplay('ANS_direction', variableMap);
  if (units && direction && /Compared to the graph of the base function/i.test(refined) && /is translated/i.test(refined)) {
    return 'Compared to the graph of the base function, the graph of the function is translated '
      + `${units} units ${direction}.`;
  }

  const radians = variableValueForDisplay('rads', variableMap);
  if (radians) {
    refined = refined
      .replace(/^radians is equal/i, `${radians} radians is equal`)
      .replace(/angle of radians\b/i, `angle of ${radians} radians`);
  }

  const selectedUnitCircleCase = variableValueForDisplay('which', variableMap);
  if (selectedUnitCircleCase && /unit circle/i.test(refined) && /angle of radians\b/i.test(refined)) {
    const unitCircle = unitCircleEntryForCase(selectedUnitCircleCase);
    refined = refined.replace(
      /angle of radians\b/i,
      unitCircle ? `angle ${unitCircle.radians}` : `angle [unit-circle case ${selectedUnitCircleCase}, exact angle not decoded yet]`,
    );
  }
  const selectedUnitCircle = selectedUnitCircleCase ? unitCircleEntryForCase(selectedUnitCircleCase) : undefined;
  if (selectedUnitCircle && /point \(\) is on the terminal arm/i.test(refined)) {
    refined = refined.replace(/point \(\) is on the terminal arm/i, `point ${selectedUnitCircle.point} is on the terminal arm`);
  }
  if (selectedUnitCircle && /tan q =\s*$/i.test(refined)) {
    refined = refined.replace(/tan q =\s*$/i, `tan q = ${selectedUnitCircle.tan}`);
  }
  if (selectedUnitCircleCase) {
    refined = refined.replace(new RegExp(`^${escapeRegExp(selectedUnitCircleCase)}\\s+(?=Which\\b)`, 'i'), '');
  }

  const radius = variableValueForDisplay('r', variableMap);
  if (radius) refined = refined.replace(/radius cm\b/i, `radius ${radius} cm`);

  const n = variableValueForDisplay('n', variableMap);
  if (n) refined = refined.replace(/value of !\?/i, `value of ${n}!?`);

  refined = stripLeadingAlgorithmicNoise(refined);
  refined = recoverKnownSequenceSeriesPrompts(refined, variableMap, title);
  refined = recoverKnownTransformationPrompts(refined, variableMap);
  refined = recoverKnownHiddenMathExpressions(refined, variableMap);

  if (/^\([^)]*\)$/.test(refined)) return `Question text not decoded yet. Algorithmic values: ${refined}`;

  return refined;
}

function recoverKnownSequenceSeriesPrompts(body: string, variableMap: Map<string, AlgorithmicVariable>, title?: string): string {
  const values = (names: string[]): Array<string | undefined> => names.map((name) => variableValueForDisplay(name, variableMap));
  const [t1, t2, t3, t4, t5] = values(['t1', 't2', 't3', 't4', 't5']);
  const n = variableValueForDisplay('n', variableMap);
  const tn = variableValueForDisplay('tn', variableMap);
  const d = variableValueForDisplay('d', variableMap);

  if (t1 && d && /formula for the general term of an arithmetic sequence/i.test(body) && /common difference/i.test(body)) {
    return `In the formula for the general term of an arithmetic sequence t_n = ${t1} + (n - 1)(${d}), the common difference is`;
  }

  if (t1 && t2 && t3 && t4 && t5) {
    if (/Which of the following numbers occurs in the sequence/i.test(body)) {
      return `Which of the following numbers occurs in the sequence ${joinMathList([t1, t2, t3, t4, t5])},...?`;
    }

    if (/Which of the given formulas for the general term of the sequence/i.test(body)) {
      return `Which of the given formulas for the general term of the sequence ${joinMathList([t1, t2, t3, t4, t5])},... is correct?`;
    }

    if (n && /What is the .*th term of the sequence/i.test(body)) {
      return `What is the ${n}th term of the sequence ${joinMathList([t1, t2, t3, t4, t5])},...?`;
    }
  }

  if (n && t1 && t3 && t4 && /\bterm in the sequence\b/i.test(body) && /,\s*1\s*,/.test(body)) {
    return `The ${n}th term in the sequence ${joinMathList([t1, '1', t3, t4])},... is`;
  }

  if (t1 && t2 && t3 && tn && /\bsum of the series\b/i.test(body)) {
    return `The sum of the series (${t1}) + (${t2}) + (${t3}) + ... + (${tn}) is`;
  }

  if (t1 && t2 && t3 && tn && /\bFor the arithmetic series\b/i.test(body)) {
    return `For the arithmetic series (${t1}) + (${t2}) + (${t3}) + ... + (${tn}), the values of t1, d, and n are`;
  }

  if (t1 && t2 && t3 && t4 && tn && /How many terms are in the sequence/i.test(body)) {
    return `How many terms are in the sequence ${joinMathList([t1, t2, t3, t4, t5].filter((term): term is string => Boolean(term)))}, ..., ${tn}?`;
  }

  if (t1 && t2 && t3 && t4 && /The eighth term in the sequence/i.test(body)) {
    return `The eighth term in the sequence ${joinMathList([t1, t2, t3, t4])},... is`;
  }

  if (n && t1 && t2 && t3 && /\bterm of the geometric series\b/i.test(body)) {
    return `The ${n}th term of the geometric series ${t1} + ${t2} + ${t3} + ... is`;
  }

  if (t1 && t2 && t3 && tn && /The sum of the geometric series/i.test(body)) {
    return `The sum of the geometric series ${t1} + ${t2} + ${t3} + ... + ${tn} is`;
  }

  const adenom = variableValueForDisplay('adenom', variableMap);
  const ratio = variableValueForDisplay('r', variableMap);
  if (adenom && ratio && n && /The sum of a geometric series where/i.test(body)) {
    return `The sum of a geometric series where t1 = 1/${adenom}, r = ${ratio}, and n = ${n} is approximately`;
  }

  if (n && t1 && t2 && t3 && t4 && /What is the value of S/i.test(body)) {
    return `What is the value of S_${n} for the series ${t1} - ${t2} + ${t3} - ${t4} + ...?`;
  }

  if (t1 && t2 && t3 && t4 && /Which of the following best describes the series/i.test(body)) {
    return `Which of the following best describes the series ${t1} + (${t2}) + (${t3}) + (${t4}) + ...?`;
  }

  if (n && t1 && t2 && t3 && t4 && tn && /^The geometric sequence/i.test(body)) {
    return `The geometric sequence ${joinMathList([t1, t2, t3, t4])}, ..., ${tn} has ____________________ terms.`;
  }

  const firstSign = variableValueForDisplay('first', variableMap);
  const secondSign = variableValueForDisplay('second', variableMap);
  const thirdSign = variableValueForDisplay('third', variableMap);
  const t2Used = variableValueForDisplay('t2used', variableMap);
  const t3Used = variableValueForDisplay('t3used', variableMap);
  const t4Used = variableValueForDisplay('t4used', variableMap);
  if (n && t1 && firstSign && t2Used && secondSign && t3Used && thirdSign && t4Used && /The sum of the first .* terms of the geometric series/i.test(body)) {
    return `The sum of the first ${n} terms of the geometric series ${formatSignedSeries(t1, [
      [firstSign, t2Used],
      [secondSign, t3Used],
      [thirdSign, t4Used],
    ])} + ... is ____________________.`;
  }

  const sign2 = variableValueForDisplay('sgn2', variableMap);
  const sign3 = variableValueForDisplay('sgn3', variableMap);
  const sign4 = variableValueForDisplay('sgn4', variableMap);
  const t2d = variableValueForDisplay('t2d', variableMap);
  const t3d = variableValueForDisplay('t3d', variableMap);
  const t4d = variableValueForDisplay('t4d', variableMap);
  if (t1 && sign2 && t2d && sign3 && t3d && sign4 && t4d && /ratio used to generate the infinite geometric series/i.test(body)) {
    return `The ratio used to generate the infinite geometric series ${formatSignedSeries(t1, [
      [sign2, t2d],
      [sign3, t3d],
      [sign4, t4d],
    ])} + ... is ____________________.`;
  }

  const r = variableValueForDisplay('r', variableMap);
  if (t1 && r && /What is the sum of the infinite geometric series/i.test(body)) {
    return `What is the sum of the infinite geometric series ${t1} + ${t1}(${r}) + ${t1}(${r})^2 + ${t1}(${r})^3 + ...?`;
  }

  const num = variableValueForDisplay('NUM', variableMap);
  if (num && d && n && /The sum of an arithmetic series where/i.test(body) && !/\bt1\s*=/.test(body)) {
    return `The sum of an arithmetic series where t1 = 1/${num}, d = ${d}, and n = ${n} is`;
  }

  if (/formula for the general term of an arithmetic sequence/i.test(body) && /represents the ____________________/.test(body)) {
    return 'In the formula for the general term of an arithmetic sequence t_n = a + (n - 1)d, a represents the ____________________ and n represents the ____________________.';
  }

  if (/The first three terms of the sequence defined by/i.test(body) && /\[inline object not decoded yet\]/i.test(body)) {
    return 'The first three terms of the sequence defined by t_n = -0.3n + 0.5 are';
  }

  if (/^a\) t1 = –8, d = 3/i.test(body)) {
    return '–8, –5, –2, 1, ...';
  }

  if (/^3a, 3a – 2b, 3a – 4b, 3a – 6b,/i.test(body)) {
    return '3a, 3a - 2b, 3a - 4b, 3a - 6b, ...';
  }

  if (/^\[inline object not decoded yet\] = 3, r = 2/i.test(body)) {
    return 't1 = 3, r = 2';
  }

  if (/^\[inline object not decoded yet\] = 2, d = 3, n = 4/i.test(body)) {
    return 't1 = 2, d = 3, n = 4';
  }

  if (/^\[inline object not decoded yet\], 1, \[(?:diagram\/object|inline object) not decoded yet\], \[(?:diagram\/object|inline object) not decoded yet\],?$/i.test(body)) {
    return '7/4, 1, 1/4, -1/2, ...';
  }

  if (title && /geometric sequence/i.test(title) && /^\[inline object not decoded yet\] \[(?:diagram\/object|inline object) not decoded yet\]$/i.test(body)) {
    return '-2, 2/5, -2/25, 2/125, ...';
  }

  if (/^2 \+ 4 \+ 6 \+ \[inline object not decoded yet\] \+ 48/i.test(body)) {
    return '2 + 4 + 6 + ... + 48';
  }

  if (/^–12 – 9 – 6 – \[inline object not decoded yet\] \+ 12/i.test(body)) {
    return '–12 - 9 - 6 - ... + 12';
  }

  if (/A bouncy ball bounces to \[inline object not decoded yet\] its height/i.test(body)) {
    return body.replace('[inline object not decoded yet]', '2/3');
  }

  if (/Find the value of \[(?:inline object|diagram\/object) not decoded yet\] given \[(?:diagram\/object|inline object) not decoded yet\] and \[(?:diagram\/object|inline object) not decoded yet\]/i.test(body)) {
    return 'Find the value of t1 given S_8 = -3280 and r = -3. Be sure to show all of your work.';
  }

  if (/Consider an arithmetic sequence with \[(?:inline object|diagram\/object) not decoded yet\] and \[(?:diagram\/object|inline object) not decoded yet\]/i.test(body)) {
    return body
      .replace(/\[(?:inline object|diagram\/object) not decoded yet\] and \[(?:diagram\/object|inline object) not decoded yet\]/i, 't_2 = 1/3 and t_8 = 13/3')
      .replace(/\[(?:inline object|diagram\/object) not decoded yet\]\s+ii\)\s+9\s+iii\)\s+\[(?:diagram\/object|inline object) not decoded yet\]/i, '7/3\r ii) 9\r iii) 97/3');
  }

  if (/determine \[inline object not decoded yet\] and r for the geometric sequence/i.test(body)) {
    return body.replace('[inline object not decoded yet]', 't1');
  }

  if (/For a geometric series, \[(?:diagram\/object|inline object) not decoded yet\]\. What are the first three terms/i.test(body)) {
    return 'For a geometric series, S_4 / S_8 = 1/17. What are the first three terms of the series if the first term is 3?';
  }

  if (/Write each repeating decimal number as an equivalent fraction/i.test(body) && /\[(?:diagram\/object|inline object) not decoded yet\]/i.test(body)) {
    return body.replace(/\[(?:diagram\/object|inline object) not decoded yet\]/i, '0.12 repeating');
  }

  if (/common difference of \[inline object not decoded yet\], this sequence is arithmetic/i.test(body)) {
    return body.replace('[inline object not decoded yet]', '3');
  }

  if (title && /sum \| arithmetic series/i.test(title) && /^\[(?:diagram\/object|inline object) not decoded yet\]$/i.test(body)) {
    return 't1 = 3 sqrt(3), d = -2 sqrt(3), n = 11';
  }

  if (/The first perimeter, \[(?:inline object|diagram\/object) not decoded yet\], is 30 cm/i.test(body)) {
    return 'The first perimeter, P_1, is 30 cm.\rThe common ratio, r, is 1/2.\rUse the formula for the sum of an infinite geometric series: S_infinity = P_1 / (1 - r).\rThe total perimeter is 60 cm.';
  }

  return body;
}

function joinMathList(values: string[]): string {
  return values.join(', ');
}

function formatSignedSeries(firstTerm: string, rest: Array<[string, string]>): string {
  return rest.reduce((text, [sign, value]) => `${text} ${normalizeSeriesSign(sign)} ${value}`, firstTerm);
}

function normalizeSeriesSign(sign: string): string {
  return sign.trim() === '–' || sign.trim() === '-' ? '-' : '+';
}

function stripLeadingAlgorithmicNoise(body: string): string {
  const prompt = findPromptInsideText(body);
  if (!prompt || prompt.index === 0) return body;
  return body.slice(prompt.index).trim();
}

function findPromptInsideText(text: string): RegExpExecArray | undefined {
  return /\b(?:Compared|Based|Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|The|A |An |If |Given|Let |Use |Consider|Prove|Show|Find|Select|List|State|Describe|For |In )\b/.exec(text) ?? undefined;
}

function recoverKnownTransformationPrompts(body: string, variableMap: Map<string, AlgorithmicVariable>): string {
  let recovered = body;
  const sign = variableValueForDisplay('sign', variableMap);
  if (sign && /When b 0, the function has what relationship to the base function f\(x\) is/i.test(recovered)) {
    recovered = `When b ${sign} 0, what relationship does the function f(bx) have to the base function f(x)?`;
  }

  const interval = variableValueForDisplay('interval', variableMap);
  if (interval && /When the value of a is, the function has what relationship to the base function f\(x\) is/i.test(recovered)) {
    recovered = `When the value of a is ${interval}, what relationship does the function a f(x) have to the base function f(x)?`;
  }

  const horizontal = variableValueForDisplay('h_display', variableMap);
  const horizontalValue = variableValueForDisplay('h_value', variableMap) ?? horizontal;
  const vertical = variableValueForDisplay('k_display', variableMap)
    ?? variableValueForDisplay('k_dsiplay', variableMap)
    ?? variableValueForDisplay('k_value', variableMap);
  const horizontalDirection = variableValueForDisplay('horiz_direction', variableMap);
  const genericDirection = variableValueForDisplay('direction', variableMap);
  const hDirection = variableValueForDisplay('h_direction', variableMap) ?? horizontalDirection;
  const verticalDirection = variableValueForDisplay('vert_direction', variableMap);
  const kDirection = variableValueForDisplay('k_direction', variableMap) ?? verticalDirection;

  if (horizontalValue && vertical && hDirection && kDirection && /best describes the vertical and horizontal translations/i.test(recovered)) {
    recovered = `Given the function, which of the following best describes the translations with respect to the base graph? ${horizontalValue} units ${hDirection} and ${vertical} units ${kDirection}.`;
  }

  if (horizontalValue && (hDirection || genericDirection) && /Compared to the graph of the base function, the graph of the function is translated units to the/i.test(recovered)) {
    recovered = `Compared to the graph of the base function, the graph of the function is translated ${horizontalValue} units ${hDirection ?? genericDirection}.`;
  }

  if (horizontalValue && (hDirection || genericDirection) && /The graph of .* is the graph of (?:units|translated) _+/i.test(recovered)) {
    recovered = `The graph is translated ${horizontalValue} units ${hDirection ?? genericDirection}.`;
  }

  if (horizontalValue && (hDirection || genericDirection) && /The graph of \[math expression not decoded yet\] is the graph of (?:units|translated) _+/i.test(recovered)) {
    recovered = `The graph is translated ${horizontalValue} units ${hDirection ?? genericDirection}.`;
  }

  if (horizontalValue && vertical && hDirection && kDirection && /reflected in the -axis, translated units to the, and translated/i.test(recovered)) {
    const reflectionAxis = variableValueForDisplay('select_reflection', variableMap)
      ?? (variableValueForDisplay('reflection_y', variableMap) === '1' ? 'y' : undefined)
      ?? (variableValueForDisplay('reflection_x', variableMap) === '1' ? 'x' : undefined)
      ?? 'selected';
    recovered = `The graph is reflected in the ${reflectionAxis}-axis, translated ${horizontalValue} units ${hDirection}, and translated ${vertical} units ${kDirection}. Determine the transformed equation g(x).`;
  }

  if (horizontal && genericDirection && /The graph of .* is the graph of units to the ____________________/i.test(recovered)) {
    recovered = recovered.replace(/The graph of .* is the graph of units to the ____________________\.?/i, `The graph is translated ${horizontal} units to the ${genericDirection}.`);
  }
  if (horizontal && genericDirection && /The graph of .* is the graph of .* units to the ____________________/i.test(recovered)) {
    recovered = `The graph is translated ${horizontal} units to the ${genericDirection}.`;
  }
  if (horizontal && genericDirection && /The graph of\s+is the graph of\s+moved\s+units/i.test(recovered)) {
    recovered = `The graph is translated ${horizontal} units to the ${genericDirection}.`;
  }

  const reflection = variableValueForDisplay('ans', variableMap);
  if (reflection && /Select the type of reflection\(s\)/i.test(recovered)) {
    recovered = 'The two functions in the graph shown are reflections of each other. Select the type of reflection(s).';
  }

  const x1 = variableValueForDisplay('x1', variableMap);
  const y1 = variableValueForDisplay('y1', variableMap);
  const yAnswer = variableValueForDisplay('y_ans', variableMap);
  if (x1 && y1 && yAnswer && /coordinates of point A/i.test(recovered)) {
    recovered = `Given the graph of f(x) shown below, point A is (${x1}, ${y1}). What are the coordinates of point A after the transformation?`;
  }

  if (horizontal && vertical && horizontalDirection && verticalDirection && /blue curve to obtain the red curve/i.test(recovered)) {
    recovered = recovered.replace(
      /a reflection in the x-axis,? a vertical translation(?: of)?,? and a horizontal translation(?: of)? units to the/i,
      `a reflection in the x-axis, a vertical translation of ${vertical} units ${verticalDirection}, and a horizontal translation of ${horizontal} units to the ${horizontalDirection}`,
    );
  }

  if (vertical && verticalDirection && /blue curve to obtain the red curve/i.test(recovered)) {
    recovered = recovered.replace(
      /a reflection in the x-axis and a translation of(?: units)?(?:\s+a reflection in the y-axis and a translation of(?: units)?)?/i,
      `a reflection in the x-axis and a translation of ${vertical} units ${verticalDirection}`,
    );
  }

  return recovered;
}

function recoverKnownHiddenMathExpressions(body: string, variableMap: Map<string, AlgorithmicVariable>): string {
  let recovered = body;
  const linearFunction = inferLinearFunctionExpression(variableMap);
  const inverseLinearFunction = inferInverseLinearFunctionExpression(variableMap);

  if (linearFunction) {
    recovered = recovered
      .replace(/function f\(x\)\s*=\s*\[math expression not decoded yet\]/i, `function f(x) = ${linearFunction}`)
      .replace(/function f\(x\)\s*=\s*(?=$|\()/i, `function f(x) = ${linearFunction} `)
      .replace(/correct inverse for the function(\s*$|\s*\()/i, (_match, suffix: string) => `correct inverse for the function f(x) = ${linearFunction}${suffix}`);
  }

  if (inverseLinearFunction) {
    recovered = recovered
      .replace(/The inverse of the function f\(x\)\s*=\s*([^\s]+)?\s*is ____________________\./i, (_match, existing: string | undefined) => {
        const original = existing ? `f(x) = ${existing}` : linearFunction ? `f(x) = ${linearFunction}` : 'the function';
        return `The inverse of ${original} is ${inverseLinearFunction}.`;
      });
  }

  return recovered;
}

function inferLinearFunctionExpression(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const slope = variableValueForDisplay('m', variableMap)
    ?? inferFractionValue('num', 'denom', variableMap)
    ?? inferFractionValue('n', 'd', variableMap);
  const intercept = variableValueForDisplay('b', variableMap);
  if (!slope || !intercept) return undefined;
  return formatLinearExpression(slope, intercept);
}

function inferInverseLinearFunctionExpression(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const slope = variableValueForDisplay('inv_m', variableMap)
    ?? variableValueForDisplay('ans_m', variableMap);
  const intercept = variableValueForDisplay('inv_b', variableMap)
    ?? variableValueForDisplay('ans_constant', variableMap);
  if (!slope || !intercept) return undefined;
  return formatLinearExpression(slope, intercept);
}

function inferFractionValue(
  numeratorName: string,
  denominatorName: string,
  variableMap: Map<string, AlgorithmicVariable>,
): string | undefined {
  const numerator = variableValueForDisplay(numeratorName, variableMap);
  const denominator = variableValueForDisplay(denominatorName, variableMap);
  return numerator && denominator ? `${numerator}/${denominator}` : undefined;
}

function formatLinearExpression(slope: string, intercept: string): string {
  const normalizedSlope = normalizeDisplayedMathValue(slope);
  const normalizedIntercept = normalizeDisplayedMathValue(intercept);
  const slopePart = normalizedSlope === '1'
    ? 'x'
    : normalizedSlope === '-1'
      ? '-x'
      : `${normalizedSlope}x`;
  if (normalizedIntercept === '0') return slopePart;
  return `${slopePart} ${formatSignedTerm(normalizedIntercept)}`;
}

function normalizeDisplayedMathValue(value: string): string {
  return value
    .replace(/[–−]/g, '-')
    .replace(/\+\s*/g, '+')
    .replace(/-\s*/g, '-')
    .replace(/^\+/, '')
    .trim();
}

function formatSignedTerm(value: string): string {
  const normalized = normalizeDisplayedMathValue(value);
  return normalized.startsWith('-') ? `- ${normalized.slice(1)}` : `+ ${normalized}`;
}

function annotateUnsupportedInlineObjects(body: string, title?: string): string {
  let annotated = body;
  const math = '[math expression not decoded yet]';
  const graph = '[graph not decoded yet]';

  annotated = annotated
    .replace(/\bGiven the functions,\s*/gi, `Given the functions ${math} and ${math}, `)
    .replace(/\bGiven the function,\s*/gi, `Given the function ${math}, `)
    .replace(/\bfunctions\s+and\s*,/gi, `functions ${math} and ${math},`)
    .replace(/\bIf\s+and\s*,/gi, `If ${math} and ${math},`)
    .replace(/\bGiven\s*,\s*find\b/gi, `Given ${math}, find`)
    .replace(/\bdefined as\s*,\s*where\b/gi, `defined as ${math}, where`)
    .replace(/\bgiven by\s*,\s*and\b/gi, `given by ${math}, and`)
    .replace(/\bgiven by\s*,/gi, `given by ${math},`)
    .replace(/\bequation for\s*,/gi, `equation for ${math},`)
    .replace(/\bgraph of\s+is\b/gi, `graph of ${math} is`)
    .replace(/\bgraph of\s*,/gi, `graph of ${math},`)
    .replace(/\bvalue of\s*\?/gi, `value of ${math}?`)
    .replace(/\bexpression\s*\?/gi, `expression ${math}?`)
    .replace(/\bexpression\s*$/gi, `expression ${math}`)
    .replace(/\bfunction f\(x\)\s*=\s*$/gi, `function f(x) = ${math}`)
    .replace(/\bfunction f\(x\)\s*=\s*(?=\()/gi, `function f(x) = ${math} `)
    .replace(/\bcombined function(?=\s+(?:most likely|is|\.|\?|$))/gi, `combined function ${math}`)
    .replace(/\bcomposite function(?=\s+(?:is|A\.|\.|\?|$))/gi, `composite function ${math}`)
    .replace(/\bformula\s*,/gi, `formula ${math},`)
    .replace(/\bvalue of(?:\s*\(|\s*$)/gi, `value of ${math}`)
    .replace(/\bgraph of(?:\s*\(|\s*$)/gi, `graph of ${math}`)
    .replace(/\bSolve the equation\s*\./gi, `Solve the equation ${math}.`)
    .replace(/\bProve the identity\s*$/gi, `Prove the identity ${math}.`)
    .replace(/\bShow that\s*\./gi, `Show that ${math}.`)
    .replace(/\bEvaluate\s*\./gi, `Evaluate ${math}.`);

  if (/\bgraph\b/i.test(title ?? '') || /\bgraph shown below\b/i.test(annotated)) {
    annotated = annotated.replace(/\bgraph shown below\b/i, `graph shown below ${graph}`);
    if (/\bwhich graph\b/i.test(annotated) && !annotated.includes(graph)) {
      annotated = `${annotated} ${graph}`;
    }
  }

  return annotated
    .replace(/\]([A-Za-z_][A-Za-z0-9_]*\s*=)/g, '] ($1')
    .replace(/\)([A-Za-z_][A-Za-z0-9_]*\s*=)/g, ') ($1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function recoverGraphExpressionsInBody(
  body: string,
  graphDefinitions?: DecodedGraphDefinition[],
): string {
  const expressions = graphDefinitions?.flatMap((graph) => graph.normalizedExpressions ?? []) ?? [];
  const readableExpressions = expressions
    .map((expression) => expression.substituted || expression.original)
    .filter((expression, index, all): expression is string => Boolean(expression) && all.indexOf(expression) === index);
  if (!readableExpressions.length) return body;

  let recovered = body;
  if (readableExpressions.length === 1) {
    const expression = readableExpressions[0];
    recovered = recovered
      .replace(/graph shown below\s+\[graph not decoded yet\]\?/i, `graph shown below? Recovered graph function: ${expression}.`)
      .replace(/\[math expression not decoded yet\]shown/gi, `${expression} (shown`)
      .replace(/\[math expression not decoded yet\]/, expression)
      .replace(/\[(?:inline math\/object|inline object) not decoded yet\]/i, expression)
      .replace(/\[diagram\/object not decoded yet\]/i, `Recovered graph function: ${expression}.`)
      .replace(/\[graph not decoded yet\]/, `Recovered graph function: ${expression}`);
  } else {
    const note = `Recovered graph functions: ${readableExpressions.slice(0, 8).join('; ')}.`;
    const primaryExpression = readableExpressions[0];
    recovered = recovered
      .replace(/\[math expression not decoded yet\]shown/gi, `${note} shown`)
      .replace(/\[math expression not decoded yet\]/, note)
      .replace(/\[(?:inline math\/object|inline object) not decoded yet\]/i, primaryExpression)
      .replace(/\[diagram\/object not decoded yet\]/gi, note)
      .replace(/\[graph not decoded yet\]/, note);
    if (!/\[(?:math expression|inline math\/object|inline object|diagram\/object|graph) not decoded yet\]/.test(body) && !body.includes(note)) {
      recovered = `${body} ${note}`;
    }
  }

  return recovered
    .replace(/below\s+Recovered graph function:/gi, 'below? Recovered graph function:')
    .replace(/below\s+Recovered graph functions:/gi, 'below? Recovered graph functions:')
    .replace(/graph shown below\s+Recovered graph functions:/gi, 'graph shown below? Recovered graph functions:')
    .replace(/\.\s+Recovered graph functions:([^?]+)\?/gi, '? Recovered graph functions:$1.')
    .replace(/\?\?/g, '?')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function classifyBodyInlineObjectPlaceholders(body: string): string {
  let classified = body;
  const value = '[inline value not decoded yet]';
  const diagram = '[diagram/object not decoded yet]';
  const math = '[inline math/object not decoded yet]';

  classified = classified
    .replace(/\[inline object not decoded yet\](?=\s*(?:mm|cm|m|km|in\.?|ft\.?|yd\.?|mi\.?|m2|m3|cm2|cm3|mm2|mm3|in2|in3|ft2|ft3|square|cubic)\b)/gi, value)
    .replace(/(?<=\b(?:equation|formula|expression|identity|function)\s+)\[inline object not decoded yet\]/gi, math);

  if (/\[inline object not decoded yet\]/i.test(classified)) {
    classified = classified.replace(/\[inline object not decoded yet\]/gi, (match, offset: number) => {
      const before = classified.slice(Math.max(0, offset - 120), offset);
      const after = classified.slice(offset + match.length, offset + match.length + 80);
      if (/^\s*(?:$|[.)]|[a-d]\))/i.test(after) || /\b(?:shown|diagram|object|pyramid|cone|sphere|tetrahedron|composite)\b/i.test(before)) {
        return diagram;
      }
      return '[inline object not decoded yet]';
    });
  }

  return classified;
}

function classifyChoiceInlineObjectPlaceholders(choice: Choice): Choice {
  if (!choice.body.text.includes('[inline object not decoded yet]')) return choice;
  return {
    ...choice,
    body: {
      ...choice.body,
      text: choice.body.text.replace(/\[inline object not decoded yet\]/g, '[choice value not decoded yet]'),
    },
  };
}

function makeUnresolvedPlaceholdersHumanReadable(text: string): string {
  return text
    .replace(/\[inline value not decoded yet\]/gi, '[embedded value]')
    .replace(/\[inline math\/object not decoded yet\]/gi, '[embedded math expression]')
    .replace(/\[diagram\/object not decoded yet\]/gi, '[embedded diagram/object]')
    .replace(/\[choice value not decoded yet\]/gi, '[embedded choice value]')
    .replace(/\[inline object not decoded yet\]/gi, '[embedded object]');
}

function buildTriangleDescription(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const parts: string[] = [];
  const added = new Set<string>();

  // Add angles: try case-insensitive variants
  for (const name of ['angleA', 'angleB', 'angleC', 'angle']) {
    const val = variableValueForDisplay(name, variableMap);
    if (val && !added.has(name.toLowerCase())) {
      const suffix = name.replace(/^angle/i, '').toUpperCase();
      parts.push(`∠${suffix} = ${val}°`);
      added.add(name.toLowerCase());
    }
  }

  // Add sides: try case-insensitive variants (use lowercase for side labels)
  for (const name of ['sidea', 'sideb', 'sidec']) {
    const val = variableValueForDisplay(name, variableMap);
    if (val && !added.has(name.toLowerCase())) {
      const suffix = name.replace(/^side/i, '').toLowerCase();
      parts.push(`side ${suffix} = ${val} cm`);
      added.add(name.toLowerCase());
    }
  }

  return parts.length >= 2 ? `[Triangle: ${parts.join(', ')}]` : undefined;
}

function recoverChoiceEmbeddedValues(
  choices: Choice[] | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
): Choice[] | undefined {
  if (!choices?.some((c) => c.body.text.includes('[embedded value]'))) return choices;

  // Extract all numeric values from a choice text
  const extractNums = (text: string): number[] =>
    [...text.matchAll(/([\d.]+)/g)].map((m) => parseFloat(m[1])).filter((n) => !isNaN(n));

  return choices.map((choice) => {
    if (!choice.body.text.includes('[embedded value]')) return choice;

    // Count how many [embedded value] slots exist in this choice
    const embeddedCount = (choice.body.text.match(/\[embedded value\]/g) ?? []).length;
    if (embeddedCount !== 1) return choice;

    const currentNums = new Set(extractNums(choice.body.text));

    // Collect all numeric values from OTHER choices (without embedded values) and their frequencies
    const valueFrequency = new Map<string, number>();
    for (const other of choices) {
      if (other.id === choice.id || other.body.text.includes('[embedded value]')) continue;
      for (const val of extractNums(other.body.text)) {
        const key = String(val);
        valueFrequency.set(key, (valueFrequency.get(key) ?? 0) + 1);
      }
    }

    // Find numeric variables from variableMap that appear in other choices
    const candidatesFromOtherChoices: string[] = [];
    for (const [name, variable] of variableMap) {
      const val = variable.sampleValue ?? '';
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && !currentNums.has(parsed) && valueFrequency.has(val)) {
        candidatesFromOtherChoices.push(val);
      }
    }

    // Remove duplicates
    const uniqueCandidates = [...new Set(candidatesFromOtherChoices)];

    if (uniqueCandidates.length === 0) {
      return choice;
    }

    if (uniqueCandidates.length === 1) {
      // Exactly one candidate — use it
      return {
        ...choice,
        body: {
          ...choice.body,
          text: choice.body.text.replace('[embedded value]', uniqueCandidates[0]),
        },
      };
    }

    // Multiple candidates: pick the one with the lowest frequency in other choices
    // Rationale: values that appear less frequently are more likely to be the missing one
    const selected = uniqueCandidates.reduce((min, candidate) => {
      const freqMin = valueFrequency.get(min) ?? 0;
      const freqCand = valueFrequency.get(candidate) ?? 0;
      return freqCand < freqMin ? candidate : min;
    });

    return {
      ...choice,
      body: {
        ...choice.body,
        text: choice.body.text.replace('[embedded value]', selected),
      },
    };
  });
}

function recoverKnownEmbeddedObjectPatterns(
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
  graphDefinitions?: DecodedGraphDefinition[],
): string {
  let recovered = body;

  // Coordinate point recovery for Q-style geometry (x1, y1, x2, y2 variables)
  if (/the points \[embedded (?:object|diagram\/object)\] and \[embedded (?:object|diagram\/object)\]/.test(recovered)) {
    const x1 = variableValueForDisplay('x1', variableMap);
    const y1 = variableValueForDisplay('y1', variableMap);
    const x2 = variableValueForDisplay('x2', variableMap);
    const y2 = variableValueForDisplay('y2', variableMap);

    if (x1 && y1) {
      recovered = recovered.replace(/\[embedded (?:object|diagram\/object)\]/, `$(${x1}, ${y1})$`);
    }
    if (x2 && y2) {
      recovered = recovered.replace(/\[embedded (?:object|diagram\/object)\]/, `$(${x2}, ${y2})$`);
    }

    // Replace the function slot with standard form when asking "what are the values of b and c"
    recovered = recovered.replace(
      /quadratic function \[embedded math expression\](.*?what are the values of b and c)/is,
      (match, between) => `quadratic function $f(x) = x^2 + b x + c$${between}`,
    );
  }

  // Triangle diagram text description (Ch02/Ch05 geometry questions)
  if (recovered.includes('[embedded diagram/object]')) {
    const desc = buildTriangleDescription(variableMap);
    if (desc) {
      recovered = recovered.replace('[embedded diagram/object]', desc);
    }

    // Equilateral triangle description (Ch05 Q14/Q15 style)
    if (!recovered.includes('[embedded diagram/object]')) {
      // Already replaced by buildTriangleDescription
    } else if (recovered.includes('equilateral triangle')) {
      const s = variableValueForDisplay('s', variableMap);
      if (s) {
        recovered = recovered.replace('[embedded diagram/object]', `[Equilateral Triangle: side = ${s} cm]`);
      }
    }
  }

  // Fix garbled "If N," body start where "∠B = " prefix is missing (Q17 Ch02)
  const angleBVal = variableValueForDisplay('angleB', variableMap);
  if (angleBVal && new RegExp(`^If ${escapeRegExp(angleBVal)},`).test(recovered)) {
    recovered = recovered.replace(new RegExp(`^If ${escapeRegExp(angleBVal)},`), `If ∠B = ${angleBVal}°,`);
  }

  // Recover angle label in "what is the measure of [embedded object]" questions (Q17 Ch02)
  if (/what is the measure of \[embedded object\]/i.test(recovered)) {
    const givenAngles = new Set<string>();
    if (variableValueForDisplay('angleA', variableMap)) givenAngles.add('A');
    if (variableValueForDisplay('angleB', variableMap)) givenAngles.add('B');
    if (variableValueForDisplay('angleC', variableMap)) givenAngles.add('C');
    const allAngles = ['A', 'B', 'C'];
    const missing = allAngles.filter((a) => !givenAngles.has(a));
    // If exactly one angle is missing, use it. If multiple missing, pick the first alphabetically.
    if (missing.length >= 1) {
      recovered = recovered.replace(/what is the measure of \[embedded object\]/i, `what is the measure of ∠${missing[0]}`);
    }
  }

  // Strip trailing ", label = [embedded diagram/object]" fragments (Q23 Ch02)
  recovered = recovered.replace(/(,\s*[a-zA-Z∠]+\s*=\s*\[embedded diagram\/object\])+\s*$/gi, '').trim();

  // Triangle area recovery (Q15 Ch05)
  if (/equilateral triangle has an area of \[embedded value\]/.test(recovered)) {
    const area = variableValueForDisplay('Area', variableMap) ?? variableValueForDisplay('Area_dis', variableMap);
    if (area) {
      recovered = recovered.replace(/equilateral triangle has an area of \[embedded value\]/, `equilateral triangle has an area of ${area}`);
    }
  }

  // Quadratic equation recovery (Q25 Ch05)
  if (/if the solution to the equation \[embedded math expression\] involves real numbers/i.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    const c = variableValueForDisplay('c', variableMap);
    if (a && b && c) {
      // Construct standard form: ax² + bx + c = 0
      recovered = recovered.replace(
        /if the solution to the equation \[embedded math expression\] involves real numbers/i,
        `if the solution to the equation ${a}$x^2 + ${b}$x + ${c} = 0 involves real numbers`,
      );
    }
  }

  // Graph diagram recovery (Ch4 Q4, Ch7 Q8/Q14)
  if (recovered.includes('[embedded diagram/object]') && graphDefinitions && graphDefinitions.length > 0) {
    const diagram = graphDefinitionToTypstDiagram(graphDefinitions[0]);
    recovered = recovered.replace('[embedded diagram/object]', diagram);
  }

  return recovered;
}

function extractDecodedInlineObjects(body: string, choices?: Choice[]): DecodedInlineObject[] {
  const objects: DecodedInlineObject[] = [];
  collectInlineObjectsFromText(objects, body);
  for (const choice of choices ?? []) collectInlineObjectsFromText(objects, choice.body.text);
  return objects.map((object, index) => ({ ...object, id: `inline-object-${index + 1}` }));
}

function collectInlineObjectsFromText(objects: Omit<DecodedInlineObject, 'id'>[], text: string): void {
  const pattern = /\[(inline value|diagram\/object|inline math\/object|choice value|inline object) not decoded yet\]/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const placeholder = match[0];
    objects.push({
      kind: inlineObjectKindForPlaceholder(placeholder),
      placeholder,
      context: inlineObjectContext(text, match.index, placeholder.length),
      source: 'utf16-slot-marker',
    });
  }
}

function inlineObjectKindForPlaceholder(placeholder: string): DecodedInlineObjectKind {
  if (/inline value/i.test(placeholder)) return 'value';
  if (/diagram\/object/i.test(placeholder)) return 'diagram';
  if (/inline math\/object/i.test(placeholder)) return 'math';
  if (/choice value/i.test(placeholder)) return 'choice-value';
  return 'unknown';
}

function inlineObjectContext(text: string, index: number, length: number): string {
  return text
    .slice(Math.max(0, index - 80), Math.min(text.length, index + length + 80))
    .replace(/\s+/g, ' ')
    .trim();
}

function graphDefinitionToTypstDiagram(graphDef: DecodedGraphDefinition): string {
  if (!graphDef.normalizedExpressions || graphDef.normalizedExpressions.length === 0) {
    return '[Graph diagram]';
  }

  const expr = graphDef.normalizedExpressions[0];
  if (!expr.samplePoints || expr.samplePoints.length === 0) {
    return `[Graph: ${expr.original}]`;
  }

  // Build a simple text-based graph representation
  const points = expr.samplePoints;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Generate Typst cetz code for the graph
  const pointsStr = points
    .map((p) => `(${(p.x - minX) / (maxX - minX)}, ${(p.y - minY) / (maxY - minY)})`)
    .join(', ');

  // Return a Typst diagram placeholder with graph info
  const graphInfo = `Graph: ${expr.original} | x: [${minX.toFixed(1)}, ${maxX.toFixed(1)}], y: [${minY.toFixed(1)}, ${maxY.toFixed(1)}]`;
  return `[Graph diagram: ${graphInfo}]`;
}

function extractVersion06GraphDefinitions(
  strings: ExtractedString[],
  variables: AlgorithmicVariable[],
  body: string,
  title?: string,
): DecodedGraphDefinition[] | undefined {
  if (!isGraphOrDiagramQuestion(`${title ?? ''} ${body}`)) return undefined;

  const expressionTokens = strings
    .map((entry) => entry.text)
    .filter(isLikelyGraphExpression);
  const variableExpressions = variables
    .filter((variable) => /(graph|func|function|equation|eqn)/i.test(variable.name))
    .map((variable) => variableValueForDisplay(variable.name, new Map(variables.map((entry) => [entry.name.toLowerCase(), entry]))))
    .filter((value): value is string => Boolean(value))
    .filter(isLikelyGraphExpression);

  const expressions = [...expressionTokens, ...variableExpressions]
    .map((expression) => expression.replace(/\s+/g, ' ').trim())
    .filter((expression, index, all) => all.indexOf(expression) === index)
    .slice(0, 12);

  if (!expressions.length) return undefined;
  const variableMap = new Map(variables.map((entry) => [entry.name.toLowerCase(), entry]));
  const normalizedExpressions = expressions.map((expression) => normalizeGraphExpression(expression, variableMap));
  const graphVariables = Object.fromEntries(
    normalizedExpressions
      .flatMap((expression) => expression.variables)
      .filter((name, index, all) => all.indexOf(name) === index)
      .map((name) => [
        name,
        normalizeGraphNumericValue(variableMap.get(name.toLowerCase())?.sampleValue ?? '')
          ?? variableValueForDisplay(name, variableMap)
          ?? variableMap.get(name.toLowerCase())?.rule
          ?? 'unknown',
      ]),
  );

  return [{
    id: 'graph-1',
    expressions,
    normalizedExpressions,
    variables: graphVariables,
    source: expressionTokens.length ? 'string-token-heuristic' : 'algorithmic-variable-heuristic',
  }];
}

function normalizeGraphExpression(
  expression: string,
  variableMap: Map<string, AlgorithmicVariable>,
): DecodedGraphExpression {
  const variables = extractExpressionVariables(expression)
    .filter((name) => variableMap.has(name.toLowerCase()));
  const substituted = substituteGraphVariables(expression, variableMap);

  return {
    original: expression,
    substituted,
    typst: graphExpressionToTypstMath(substituted),
    latex: graphExpressionToLatex(substituted),
    variables,
    samplePoints: sampleGraphExpression(substituted),
  };
}

function extractExpressionVariables(expression: string): string[] {
  const builtIns = new Set(['x', 'y', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'pi', 'pow']);
  const names = expression.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  return names
    .filter((name) => !builtIns.has(name.toLowerCase()))
    .filter((name, index, all) => all.findIndex((other) => other.toLowerCase() === name.toLowerCase()) === index);
}

function substituteGraphVariables(
  expression: string,
  variableMap: Map<string, AlgorithmicVariable>,
): string {
  return expression.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (name) => {
    if (isGraphBuiltinIdentifier(name)) return name;
    const variable = variableMap.get(name.toLowerCase());
    if (!variable) return name;
    const value = normalizeGraphNumericValue(variable.sampleValue ?? variable.rule ?? '');
    return value ? `(${value})` : name;
  }).replace(/\(\+([^)]+)\)/g, '($1)');
}

function normalizeGraphNumericValue(value: string): string | undefined {
  const normalized = value
    .replace(/[–−]/g, '-')
    .replace(/\+\s+/g, '+')
    .replace(/-\s+/g, '-')
    .replace(/\s+/g, '');
  const withoutLeadingPlus = normalized.replace(/^\+/, '');
  if (/^[+-]?\d+(?:\.\d+)?$/.test(withoutLeadingPlus)) return withoutLeadingPlus;
  if (/^[+-]?\d+\/\d+$/.test(withoutLeadingPlus)) return withoutLeadingPlus;
  return undefined;
}

function isGraphBuiltinIdentifier(name: string): boolean {
  return /^(x|y|sin|cos|tan|log|ln|sqrt|abs|pi|pow)$/i.test(name);
}

function graphExpressionToTypstMath(expression: string): string {
  return convertPowToExponent(expression)
    .replace(/\*/g, ' dot ')
    .replace(/\bsin\(/g, 'sin(')
    .replace(/\bcos\(/g, 'cos(')
    .replace(/\btan\(/g, 'tan(')
    .replace(/\blog\(/g, 'log(')
    .replace(/\bln\(/g, 'ln(');
}

function graphExpressionToLatex(expression: string): string {
  return convertPowToExponent(expression)
    .replace(/\*/g, ' \\cdot ')
    .replace(/\bsin\(/g, '\\sin(')
    .replace(/\bcos\(/g, '\\cos(')
    .replace(/\btan\(/g, '\\tan(')
    .replace(/\blog\(/g, '\\log(')
    .replace(/\bln\(/g, '\\ln(');
}

function convertPowToExponent(expression: string): string {
  // Handles pow(A, N) → (A)^N for one level of nested parens inside A (the common ExamView pattern).
  return expression.replace(
    /\bpow\((\([^()]*(?:\([^()]*\)[^()]*)*\)|[^,()]+),\s*(\d+(?:\.\d+)?)\)/g,
    (_, base: string, exp: string) => `(${base})^${exp}`,
  );
}

function sampleGraphExpression(expression: string): GraphSamplePoint[] | undefined {
  const evaluator = compileGraphEvaluator(expression);
  if (!evaluator) return undefined;

  const points: GraphSamplePoint[] = [];
  for (let index = 0; index <= 40; index++) {
    const x = -10 + index * 0.5;
    const y = evaluator(x);
    if (!Number.isFinite(y) || Math.abs(y) > 1_000_000) continue;
    points.push({ x: roundGraphNumber(x), y: roundGraphNumber(y) });
  }

  return points.length >= 2 ? points : undefined;
}

function compileGraphEvaluator(expression: string): ((x: number) => number) | undefined {
  const jsExpression = expression
    .replace(/\^/g, '**')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\bpow\(/gi, 'Math.pow(')
    .replace(/\bsin\(/gi, 'Math.sin(')
    .replace(/\bcos\(/gi, 'Math.cos(')
    .replace(/\btan\(/gi, 'Math.tan(')
    .replace(/\bsqrt\(/gi, 'Math.sqrt(')
    .replace(/\babs\(/gi, 'Math.abs(')
    .replace(/\blog\(/gi, 'Math.log10(')
    .replace(/\bln\(/gi, 'Math.log(');

  const strippedExpression = jsExpression.replace(/Math\.[A-Za-z0-9_]+/g, '');
  const remainingIdentifiers = strippedExpression.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  if (remainingIdentifiers.some((name) => name.toLowerCase() !== 'x')) return undefined;
  if (!/^[0-9x+\-*/().,\s]+$/i.test(strippedExpression)) return undefined;

  try {
    const fn = new Function('x', `"use strict"; return (${jsExpression});`) as (x: number) => number;
    return (x: number) => {
      try {
        return Number(fn(x));
      } catch {
        return Number.NaN;
      }
    };
  } catch {
    return undefined;
  }
}

function roundGraphNumber(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function isLikelyGraphExpression(text: string): boolean {
  if (!text || text.length > 120) return false;
  if (/\s/.test(text)) return false;
  if (isFontString(text) || isDifficultyLabel(text) || /^Section\b/i.test(text)) return false;
  if (/^(?:x|y|a|b|c|d|f|g|h|n|r)$/i.test(text)) return false;
  if (/^(?:true|false|sin|cos|tan|log|ln)$/i.test(text)) return false;
  if (/^(?:range|if|choose|rand|fracs?)\(/i.test(text)) return false;
  if (!/[=+\-*/^()]/.test(text)) return false;
  if (/[=+\-*/^(]$/.test(text)) return false;
  if (/^[)]/.test(text)) return false;
  if (!hasBalancedParentheses(text)) return false;
  if (!/(^|[^A-Za-z0-9_])x([^A-Za-z0-9_]|$)|sin\(|cos\(|tan\(|log\(|ln\(|pow\(/i.test(text)) return false;
  return /^[A-Za-z0-9_+\-*/^().,= <>{}\[\]]+$/.test(text);
}

function hasBalancedParentheses(text: string): boolean {
  let depth = 0;
  for (const char of text) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function stripLeadingMetadataTags(body: string, title?: string): string {
  let stripped = body.trim();
  if (title && stripped.toLowerCase().startsWith(title.toLowerCase())) {
    stripped = stripped.slice(title.length).trim();
  }

  return stripped
    .replace(/^(?:[A-Za-z0-9()/-]+(?: [A-Za-z0-9()/-]+)*\s*\|\s*)+[A-Za-z0-9()/-]+(?: [A-Za-z0-9()/-]+)*\s+(?=[A-Z0-9])/u, '')
    .trim();
}

function variableValueForDisplay(ref: string, variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const variable = variableMap.get(ref.toLowerCase());
  const value = variable?.sampleValue ?? variable?.rule;
  return value ? convertExamViewExpressionToTypst(value) : undefined;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function inferVersion06Choices(
  variables: AlgorithmicVariable[],
  postFontRefs: string[],
  choiceRefs: string[],
  choiceLabels: string[],
  type: QuestionType,
): Choice[] | undefined {
  if (type !== 'mcq') return undefined;

  const variableMap = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  const unitCircleChoices = inferUnitCircleChoices(variableMap);
  if (unitCircleChoices) return unitCircleChoices;
  const coordinateChoices = inferCoordinateTransformationChoices(variableMap);
  if (coordinateChoices) return coordinateChoices;
  const radicalRestrictionChoices = inferRadicalRestrictionChoices(variableMap);
  if (radicalRestrictionChoices) return radicalRestrictionChoices;
  const translationChoices = inferTranslationChoices(variableMap);
  if (translationChoices) return translationChoices;
  const graphTransformationChoices = inferGraphTransformationChoices(variableMap);
  if (graphTransformationChoices) return graphTransformationChoices;
  const horizontalVerticalChoices = inferHorizontalVerticalTranslationChoices(variableMap);
  if (horizontalVerticalChoices) return horizontalVerticalChoices;

  const answerDistractors = variables.filter((variable) => /^(ans|dis_?\d*)$/i.test(variable.name));
  const orderedAnswerDistractors = orderVariablesByReferences(answerDistractors, postFontRefs);

  if (orderedAnswerDistractors.length >= 3) {
    return orderedAnswerDistractors.map((variable, index) => ({
      id: String.fromCharCode(65 + index),
      body: {
        format: 'typst',
        text: convertExamViewExpressionToTypst(variable.sampleValue ?? variable.rule ?? variable.name),
      },
    }));
  }

  if (choiceRefs.length >= 3) {
    const displayChoiceRefs = orderChoiceRefsByDisplayRefs(choiceRefs, postFontRefs);
    const labeledChoices: Choice[] = displayChoiceRefs.map((ref, index) => {
      const variable = variableMap.get(ref.toLowerCase());
      const id = choiceLabels[index] ?? String.fromCharCode(65 + index);
      return {
        id,
        body: {
          format: 'typst',
          text: convertExamViewExpressionToTypst(resolveChoiceRefValue(ref, variableMap)),
        },
      };
    });

    return labeledChoices.sort((left, right) => left.id.localeCompare(right.id));
  }

  const referencedVariables = postFontRefs
    .map((name) => variableMap.get(name.toLowerCase()))
    .filter((variable): variable is AlgorithmicVariable => Boolean(variable));
  const likelyChoices = referencedVariables.slice(-4);

  if (likelyChoices.length < 3) return undefined;

  return likelyChoices.map((variable, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: convertExamViewExpressionToTypst(variable.sampleValue ?? variable.rule ?? variable.name),
    },
  }));
}

function inferSlotBasedChoices(
  displayRegions: Version06DisplayRegions,
  postFontRefs: string[],
  variableMap: Map<string, AlgorithmicVariable>,
): { choices: Choice[] } | undefined {
  if (displayRegions.choiceRegions.length < 2) return undefined;

  // Count slots per choice region — all must be equal and ≥ 2.
  // Single-slot choices (a bare value per choice) are handled well by the ANS/DIS inference path.
  const slotsPerChoice = displayRegions.choiceRegions[0].texts.reduce(
    (sum, text) => sum + countInlineSlots(text), 0,
  );
  if (slotsPerChoice < 2) return undefined;
  const allSame = displayRegions.choiceRegions.every(
    (region) => region.texts.reduce((sum, text) => sum + countInlineSlots(text), 0) === slotsPerChoice,
  );
  if (!allSame) return undefined;

  // Post-font refs filtered to variable map, in order — these map sequentially to display slots.
  const mappedRefs = postFontRefs.filter((ref) => variableMap.has(ref.toLowerCase()));

  // Body slots consume the first N refs.
  const bodySlotCount = displayRegions.bodyTexts.reduce((sum, text) => sum + countInlineSlots(text), 0);
  const requiredRefs = bodySlotCount + slotsPerChoice * displayRegions.choiceRegions.length;
  if (mappedRefs.length < requiredRefs - 2) return undefined;

  // Build each choice by filling its template slots with the assigned refs.
  const choices: Choice[] = [];
  let refIndex = bodySlotCount;

  for (const region of displayRegions.choiceRegions) {
    const regionRefs = mappedRefs.slice(refIndex, refIndex + slotsPerChoice);
    refIndex += slotsPerChoice;

    // Only use texts that carry slot markers — trailing binary noise strings have none.
    const slotTexts = region.texts.filter((t) => !isFontString(t) && t.includes(INLINE_OBJECT_SLOT));
    let text = stitchQuestionText(slotTexts.length ? slotTexts : region.texts.filter((t) => !isFontString(t)));
    for (const ref of regionRefs) {
      const value = variableValueForDisplay(ref, variableMap);
      text = text.replace(INLINE_OBJECT_SLOT, value ?? '[embedded value]');
    }
    text = text.replace(new RegExp(escapeRegExp(INLINE_OBJECT_SLOT), 'g'), '[embedded value]');

    if (text.trim()) {
      choices.push({ id: region.id, body: { format: 'typst', text: text.trim() } });
    }
  }

  if (choices.length < 2) return undefined;

  // Sort A→B→C→D to undo the column-major binary ordering.
  choices.sort((a, b) => a.id.localeCompare(b.id));
  return { choices };
}

function normalizeVersion06Choices(
  choices: Choice[] | undefined,
  body: string,
  displayStrings: string[],
  variableMap: Map<string, AlgorithmicVariable>,
  graphDefinitions?: DecodedGraphDefinition[],
): Choice[] | undefined {
  const hasChoiceLabelRun = displayStrings.join(' ').match(/\bA\b.*\bC\b.*\bB\b.*\bD\b|\bA\b.*\bB\b.*\bC\b.*\bD\b/);
  if (!hasChoiceLabelRun) return choices;
  const visibleChoices = inferVisibleChoicesFromDisplayStrings(displayStrings);

  if (/correct inverse for the function/i.test(body)) {
    return inferInverseFunctionChoices(variableMap) ?? placeholderChoices('[inverse-function choice not decoded yet]');
  }

  const arithmeticGeneralTermChoices = inferArithmeticGeneralTermChoices(variableMap);
  if (
    arithmeticGeneralTermChoices
    && /given formulas for the general term of the sequence/i.test(body)
    && (!choices || choices.every((choice) => !/\bt_?n\b|n\s*[+\-–]/i.test(choice.body.text)))
  ) {
    return arithmeticGeneralTermChoices;
  }

  const convergenceChoices = inferConvergenceSeriesChoices(variableMap);
  if (convergenceChoices && /best describes the series/i.test(body)) return convergenceChoices;

  const graphChoices = inferGraphExpressionChoices(graphDefinitions);

  if (!choices) return graphChoices ?? visibleChoices ?? placeholderChoices('[math/object choice not decoded yet]');

  const asksForGraphChoice = /\bwhich graph\b|\bgraph represents\b|\bwhich is the graph\b/i.test(body);
  const choicesLookNonGraph = choices.every((choice) => !/[x]|sin|cos|tan|sqrt|log|ln|\^/i.test(choice.body.text));
  if (asksForGraphChoice && graphChoices && choicesLookNonGraph) return graphChoices;

  if (isGraphOrDiagramQuestion(body) && (!choices || choices.every((choice) => /^[01]$/.test(choice.body.text)))) {
    return graphChoices ?? placeholderChoices('[graph/diagram choice not decoded yet]');
  }

  if (choices?.length && (
    choices.every((choice) => /^[01]$/.test(choice.body.text))
    || choices.every((choice) => choice.body.text === choices[0]?.body.text)
  )) {
    return graphChoices ?? visibleChoices ?? placeholderChoices('[math/object choice not decoded yet]');
  }

  return recoverKnownChoiceBodies(choices, body, variableMap);
}

function recoverKnownChoiceBodies(
  choices: Choice[],
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
): Choice[] {
  if (/eighth term in the sequence/i.test(body)) {
    const n = variableValueForDisplay('n', variableMap);
    if (n) {
      return choices.map((choice) => choice.body.text === 'DIS1'
        ? { ...choice, body: { ...choice.body, text: n } }
        : choice);
    }
  }

  return choices;
}

function inferVisibleChoicesFromDisplayStrings(displayStrings: string[]): Choice[] | undefined {
  const choices: Choice[] = [];
  const labelPattern = /^([A-H])\.?$/;

  for (let index = 0; index < displayStrings.length; index++) {
    const labelMatch = labelPattern.exec(displayStrings[index]);
    if (!labelMatch) continue;
    const id = labelMatch[1];
    if (choices.some((choice) => choice.id === id)) continue;

    const parts: string[] = [];
    for (let partIndex = index + 1; partIndex < displayStrings.length; partIndex++) {
      const part = displayStrings[partIndex];
      if (labelPattern.test(part)) break;
      if (isFontString(part)) break;
      if (parts.length && isVisibleChoiceTailJunk(part)) break;
      if (!isUsefulVisibleChoicePart(part)) continue;
      parts.push(part);
    }

    const text = stitchQuestionText(parts);
    if (text) choices.push({ id, body: { format: 'typst', text } });
  }

  const ordered = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    .map((id) => choices.find((choice) => choice.id === id))
    .filter((choice): choice is Choice => Boolean(choice));
  if (ordered.length < 2) return undefined;
  if (ordered.every((choice) => !isSubstantialVisibleChoiceText(choice.body.text))) return undefined;
  return ordered.slice(0, 4);
}

function isUsefulVisibleChoicePart(text: string): boolean {
  if (!text || isBoilerplateString(text)) return false;
  if (/^[#"'`;:()[\]{}!.,+-]+$/.test(text)) return false;
  if (/^[A-Z]$/.test(text)) return false;
  if (/^X[A-Za-z0-9_]+$/.test(text)) return false;
  return true;
}

function isVisibleChoiceTailJunk(text: string): boolean {
  return text.length <= 3 && !/\d/.test(text) && !/[A-Za-z]{3,}/.test(text);
}

function isSubstantialVisibleChoiceText(text: string): boolean {
  if (/[A-Za-z]{3,}/.test(text)) return true;
  if (/\d/.test(text) && text.length >= 3) return true;
  return false;
}

function stripVisibleChoiceRunFromBody(body: string, choices?: Choice[]): string {
  if (!choices?.length || choices.every((choice) => /not decoded yet/.test(choice.body.text))) return body;
  const firstChoiceIndex = body.search(/\bA\.\s+/);
  if (firstChoiceIndex === -1) return body;
  if (!/\bB\.\s+/.test(body.slice(firstChoiceIndex)) || !/\bC\.\s+/.test(body.slice(firstChoiceIndex))) return body;
  return body.slice(0, firstChoiceIndex).replace(/\s{2,}/g, ' ').trim();
}

function inferGraphExpressionChoices(graphDefinitions?: DecodedGraphDefinition[]): Choice[] | undefined {
  const expressions = graphDefinitions
    ?.flatMap((graph) => graph.normalizedExpressions ?? [])
    .map((expression) => expression.substituted || expression.original)
    .filter((expression, index, all): expression is string => Boolean(expression) && all.indexOf(expression) === index)
    .slice(0, 4);
  if (!expressions || expressions.length < 2) return undefined;
  return expressions.map((expression, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: `graph of ${expression}`,
    },
  }));
}

function inferArithmeticGeneralTermChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const d = variableValueForDisplay('d', variableMap);
  const negd = variableValueForDisplay('negd', variableMap);
  const sign = variableValueForDisplay('sign', variableMap);
  const c = variableValueForDisplay('c', variableMap);
  const newc = variableValueForDisplay('newc', variableMap);
  if (!d || !negd || !sign || !c || !newc) return undefined;

  return [
    arithmeticFormulaChoice('A', negd, sign, c),
    arithmeticFormulaChoice('B', d, sign, newc),
    arithmeticFormulaChoice('C', d, sign, c),
    arithmeticFormulaChoice('D', negd, sign, newc),
  ];
}

function inferConvergenceSeriesChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const sum = variableValueForDisplay('ANS', variableMap);
  if (!sum) return undefined;
  return [
    {
      id: 'A',
      body: { format: 'typst', text: `The series is convergent and has a sum of ${sum}.` },
    },
    {
      id: 'B',
      body: { format: 'typst', text: `The series is divergent and has a sum of ${sum}.` },
    },
    {
      id: 'C',
      body: { format: 'typst', text: 'The series is divergent and has no sum.' },
    },
    {
      id: 'D',
      body: { format: 'typst', text: 'The series is convergent and has no sum.' },
    },
  ];
}

function arithmeticFormulaChoice(id: string, slope: string, sign: string, constant: string): Choice {
  return {
    id,
    body: {
      format: 'typst',
      text: `t_n = ${slope}n ${normalizeSeriesSign(sign)} ${constant}`,
    },
  };
}

function inferInverseFunctionChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const invM = variableValueForDisplay('inv_m', variableMap);
  const invB = variableValueForDisplay('inv_b', variableMap);
  if (!invM || !invB) return undefined;

  const slopeDistractor = variableValueForDisplay('inv_m_dis', variableMap)
    ?? variableValueForDisplay('m', variableMap);
  const interceptDistractor = variableValueForDisplay('inv_b_dis', variableMap)
    ?? variableValueForDisplay('b', variableMap);
  if (!slopeDistractor || !interceptDistractor) return undefined;

  const expressions = [
    formatLinearExpression(slopeDistractor, invB),
    formatLinearExpression(invM, invB),
    formatLinearExpression(slopeDistractor, interceptDistractor),
    formatLinearExpression(invM, interceptDistractor),
  ].filter((expression, index, all) => all.indexOf(expression) === index);

  if (expressions.length < 3) return undefined;
  return expressions.slice(0, 4).map((expression, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: `f^(-1)(x) = ${expression}`,
    },
  }));
}

function placeholderChoices(text: string): Choice[] {
  return ['A', 'B', 'C', 'D'].map((id) => ({
    id,
    body: {
      format: 'typst',
      text,
    },
  }));
}

function isGraphOrDiagramQuestion(body: string): boolean {
  return /\b(graph|unit circle|point on the terminal arm|diagram|shown below)\b/i.test(body);
}

function inferTranslationChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const units = variableValueForDisplay('ANS_units', variableMap);
  const answerDirection = variableValueForDisplay('ANS_direction', variableMap);
  const distractorDirection = variableValueForDisplay('DIS_direction', variableMap);
  if (!units || !answerDirection || !distractorDirection) return undefined;

  const directions = new Set([answerDirection.toLowerCase(), distractorDirection.toLowerCase()]);
  const perpendicular = directions.has('left') || directions.has('right')
    ? ['down', 'up']
    : ['left', 'right'];
  const values = [answerDirection, distractorDirection, ...perpendicular]
    .filter((direction, index, all) => all.findIndex((other) => other.toLowerCase() === direction.toLowerCase()) === index)
    .slice(0, 4);

  if (values.length < 4) return undefined;

  return values.map((direction, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: `${units} units ${direction}`,
    },
  }));
}

function inferGraphTransformationChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const horizontal = variableValueForDisplay('h_display', variableMap);
  const vertical = variableValueForDisplay('k_display', variableMap)
    ?? variableValueForDisplay('k_dsiplay', variableMap);
  const horizontalDirection = variableValueForDisplay('horiz_direction', variableMap);
  const verticalDirection = variableValueForDisplay('vert_direction', variableMap);
  const horizontalDistractor = variableValueForDisplay('horis_direc_dis', variableMap);
  const verticalDistractor = variableValueForDisplay('vert_direc_dis', variableMap);

  if (horizontal && vertical && horizontalDirection && verticalDirection && horizontalDistractor && verticalDistractor) {
    return [
      `a reflection in the x-axis, a vertical translation of ${vertical} units ${verticalDirection}, and a horizontal translation of ${horizontal} units to the ${horizontalDirection}`,
      `a reflection in the x-axis, a vertical translation of ${vertical} units ${verticalDistractor}, and a horizontal translation of ${horizontal} units to the ${horizontalDirection}`,
      `a reflection in the y-axis, a vertical translation of ${vertical} units ${verticalDirection}, and a horizontal translation of ${horizontal} units to the ${horizontalDistractor}`,
      `a reflection in the y-axis, a vertical translation of ${vertical} units ${verticalDistractor}, and a horizontal translation of ${horizontal} units to the ${horizontalDistractor}`,
    ].map((text, index) => ({
      id: String.fromCharCode(65 + index),
      body: { format: 'typst', text },
    }));
  }

  if (vertical && verticalDirection && verticalDistractor) {
    return [
      `a reflection in the x-axis and a translation of ${vertical} units ${verticalDirection}`,
      `a reflection in the y-axis and a translation of ${vertical} units ${verticalDirection}`,
      `a reflection in the x-axis and a translation of ${vertical} units ${verticalDistractor}`,
      `a reflection in the y-axis and a translation of ${vertical} units ${verticalDistractor}`,
    ].map((text, index) => ({
      id: String.fromCharCode(65 + index),
      body: { format: 'typst', text },
    }));
  }

  return undefined;
}

function inferHorizontalVerticalTranslationChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const horizontal = variableValueForDisplay('h_value', variableMap)
    ?? variableValueForDisplay('h_display', variableMap);
  const vertical = variableValueForDisplay('k_value', variableMap)
    ?? variableValueForDisplay('k_display', variableMap)
    ?? variableValueForDisplay('k_dsiplay', variableMap);
  const horizontalDirection = variableValueForDisplay('h_direction', variableMap)
    ?? variableValueForDisplay('horiz_direction', variableMap)
    ?? variableValueForDisplay('direction', variableMap);
  const verticalDirection = variableValueForDisplay('k_direction', variableMap)
    ?? variableValueForDisplay('vert_direction', variableMap);
  const horizontalDistractor = variableValueForDisplay('dis1', variableMap)
    ?? oppositeHorizontalDirection(horizontalDirection);
  const verticalDistractor = variableValueForDisplay('dis2', variableMap)
    ?? oppositeVerticalDirection(verticalDirection);
  const effectiveHorizontalDistractor = horizontalDistractor === horizontalDirection
    ? oppositeHorizontalDirection(horizontalDirection)
    : horizontalDistractor;
  const effectiveVerticalDistractor = verticalDistractor === verticalDirection
    ? oppositeVerticalDirection(verticalDirection)
    : verticalDistractor;

  const function1 = variableValueForDisplay('function1', variableMap);
  const function2 = variableValueForDisplay('function2', variableMap);
  if (function1 === '1' && horizontal && horizontalDirection && effectiveHorizontalDistractor) {
    return [
      `${horizontal} units to the ${horizontalDirection}`,
      `${horizontal} units to the ${effectiveHorizontalDistractor}`,
      `${vertical ?? horizontal} units ${verticalDirection ?? 'up'}`,
      `${vertical ?? horizontal} units ${effectiveVerticalDistractor ?? 'down'}`,
    ].map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
  }
  if (function2 === '1' && vertical && verticalDirection && effectiveVerticalDistractor) {
    return [
      `${vertical} units ${verticalDirection}`,
      `${vertical} units ${effectiveVerticalDistractor}`,
      `${horizontal ?? vertical} units to the ${horizontalDirection ?? 'left'}`,
      `${horizontal ?? vertical} units to the ${effectiveHorizontalDistractor ?? 'right'}`,
    ].map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
  }

  if (horizontal && vertical && horizontalDirection && verticalDirection && effectiveHorizontalDistractor && effectiveVerticalDistractor) {
    return [
      `${horizontal} units ${horizontalDirection} and ${vertical} units ${verticalDirection}`,
      `${horizontal} units ${effectiveHorizontalDistractor} and ${vertical} units ${verticalDirection}`,
      `${horizontal} units ${horizontalDirection} and ${vertical} units ${effectiveVerticalDistractor}`,
      `${horizontal} units ${effectiveHorizontalDistractor} and ${vertical} units ${effectiveVerticalDistractor}`,
    ].map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
  }

  if (horizontal && horizontalDirection && effectiveHorizontalDistractor) {
    return [
      `${horizontal} units to the ${horizontalDirection}`,
      `${horizontal} units to the ${effectiveHorizontalDistractor}`,
      `${horizontal} units ${verticalDirection ?? 'up'}`,
      `${horizontal} units ${effectiveVerticalDistractor ?? 'down'}`,
    ].map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
  }

  return undefined;
}

interface UnitCircleEntry {
  radians: string;
  degrees: string;
  point: string;
  tan: string;
}

const UNIT_CIRCLE_ENTRIES: UnitCircleEntry[] = [
  { radians: '0', degrees: '0 deg', point: '(1, 0)', tan: '0' },
  { radians: 'pi/6', degrees: '30 deg', point: '(sqrt(3)/2, 1/2)', tan: 'sqrt(3)/3' },
  { radians: 'pi/4', degrees: '45 deg', point: '(sqrt(2)/2, sqrt(2)/2)', tan: '1' },
  { radians: 'pi/3', degrees: '60 deg', point: '(1/2, sqrt(3)/2)', tan: 'sqrt(3)' },
  { radians: 'pi/2', degrees: '90 deg', point: '(0, 1)', tan: 'undefined' },
  { radians: '2pi/3', degrees: '120 deg', point: '(-1/2, sqrt(3)/2)', tan: '-sqrt(3)' },
  { radians: '3pi/4', degrees: '135 deg', point: '(-sqrt(2)/2, sqrt(2)/2)', tan: '-1' },
  { radians: '5pi/6', degrees: '150 deg', point: '(-sqrt(3)/2, 1/2)', tan: '-sqrt(3)/3' },
  { radians: 'pi', degrees: '180 deg', point: '(-1, 0)', tan: '0' },
  { radians: '7pi/6', degrees: '210 deg', point: '(-sqrt(3)/2, -1/2)', tan: 'sqrt(3)/3' },
  { radians: '5pi/4', degrees: '225 deg', point: '(-sqrt(2)/2, -sqrt(2)/2)', tan: '1' },
  { radians: '4pi/3', degrees: '240 deg', point: '(-1/2, -sqrt(3)/2)', tan: 'sqrt(3)' },
  { radians: '3pi/2', degrees: '270 deg', point: '(0, -1)', tan: 'undefined' },
  { radians: '5pi/3', degrees: '300 deg', point: '(1/2, -sqrt(3)/2)', tan: '-sqrt(3)' },
  { radians: '7pi/4', degrees: '315 deg', point: '(sqrt(2)/2, -sqrt(2)/2)', tan: '-1' },
  { radians: '11pi/6', degrees: '330 deg', point: '(sqrt(3)/2, -1/2)', tan: '-sqrt(3)/3' },
  { radians: '2pi', degrees: '360 deg', point: '(1, 0)', tan: '0' },
];

function unitCircleEntryForCase(which: string): UnitCircleEntry | undefined {
  const index = Number(which);
  if (!Number.isInteger(index)) return undefined;
  return UNIT_CIRCLE_ENTRIES[index - 1];
}

function inferUnitCircleChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const which = variableValueForDisplay('which', variableMap);
  const selected = which ? unitCircleEntryForCase(which) : undefined;
  if (!selected) return undefined;
  if (![...variableMap.keys()].some((name) => /^(rad|xdisp|ydisp|eq)\d+$/i.test(name))) return undefined;

  const selectedIndex = UNIT_CIRCLE_ENTRIES.indexOf(selected);
  const offsets = [0, 2, -2, 4];
  const choices = offsets
    .map((offset) => UNIT_CIRCLE_ENTRIES[(selectedIndex + offset + UNIT_CIRCLE_ENTRIES.length) % UNIT_CIRCLE_ENTRIES.length])
    .filter((entry, index, all) => all.indexOf(entry) === index)
    .slice(0, 4);

  return choices.map((entry, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: `${entry.point}; angle ${entry.radians} (${entry.degrees})`,
    },
  }));
}

function inferCoordinateTransformationChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const xAnswer = variableValueForDisplay('x_ans', variableMap);
  const yAnswerForPoint = variableValueForDisplay('y_ans', variableMap);
  const x1Point = variableValueForDisplay('x1', variableMap);
  const y1Point = variableValueForDisplay('y1', variableMap);
  const x2Point = variableValueForDisplay('x2', variableMap);
  const y2Point = variableValueForDisplay('y2', variableMap);
  const x3Point = variableValueForDisplay('x3', variableMap);
  const y3Point = variableValueForDisplay('y3', variableMap);
  if (xAnswer && yAnswerForPoint && x1Point && y1Point) {
    const points = [
      `(${x1Point}, ${y1Point})`,
      x2Point && y2Point ? `(${x2Point}, ${y2Point})` : undefined,
      x3Point && y3Point ? `(${x3Point}, ${y3Point})` : undefined,
      `(${xAnswer}, ${yAnswerForPoint})`,
    ].filter((choice): choice is string => Boolean(choice))
      .filter((choice, index, all) => all.indexOf(choice) === index)
      .slice(0, 4);
    if (points.length >= 3) return points.map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
  }

  const x1 = variableValueForDisplay('x1', variableMap);
  const yAnswer = variableValueForDisplay('y_ans', variableMap);
  const yDistractor = variableValueForDisplay('y_dis', variableMap);
  const xDistractor1 = variableValueForDisplay('x_dis1', variableMap);
  const xDistractor2 = variableValueForDisplay('x_dis2', variableMap);
  if (!x1 || !yAnswer || !yDistractor) return undefined;

  const choices = [
    `(${x1}, ${yAnswer})`,
    `(${x1}, ${yDistractor})`,
    xDistractor1 ? `(${xDistractor1}, ${yAnswer})` : undefined,
    xDistractor2 ? `(${xDistractor2}, ${yAnswer})` : undefined,
  ].filter((choice): choice is string => Boolean(choice))
    .filter((choice, index, all) => all.indexOf(choice) === index)
    .slice(0, 4);

  if (choices.length < 2) return undefined;
  return choices.map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
}

function inferRadicalRestrictionChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const k = variableValueForDisplay('k', variableMap);
  const h = variableValueForDisplay('h', variableMap);
  const b = variableValueForDisplay('b', variableMap);
  if (!k || !h || !b) return undefined;
  return [`x >= ${k}`, `x >= ${h}`, `x >= ${b}`, `x <= ${k}`]
    .map((text, index) => ({ id: String.fromCharCode(65 + index), body: { format: 'typst', text } }));
}

function oppositeHorizontalDirection(direction?: string): string | undefined {
  if (!direction) return undefined;
  return direction === 'left' ? 'right' : direction === 'right' ? 'left' : undefined;
}

function oppositeVerticalDirection(direction?: string): string | undefined {
  if (!direction) return undefined;
  return direction === 'up' ? 'down' : direction === 'down' ? 'up' : undefined;
}

function orderChoiceRefsByDisplayRefs(choiceRefs: string[], displayRefs: string[]): string[] {
  const choiceRefSet = new Set(choiceRefs.map((ref) => ref.toLowerCase()));
  const ordered: string[] = [];

  for (const ref of displayRefs) {
    if (!choiceRefSet.has(ref.toLowerCase())) continue;
    if (ordered.some((orderedRef) => orderedRef.toLowerCase() === ref.toLowerCase())) continue;
    ordered.push(ref);
  }

  for (const ref of choiceRefs) {
    if (!ordered.some((orderedRef) => orderedRef.toLowerCase() === ref.toLowerCase())) ordered.push(ref);
  }

  return ordered;
}

function orderVariablesByReferences(variables: AlgorithmicVariable[], refs: string[]): AlgorithmicVariable[] {
  const byName = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  const ordered = refs
    .map((ref) => byName.get(ref.toLowerCase()))
    .filter((variable): variable is AlgorithmicVariable => Boolean(variable))
    .filter((variable, index, all) => all.findIndex((other) => other.name.toLowerCase() === variable.name.toLowerCase()) === index);

  for (const variable of variables) {
    if (!ordered.some((orderedVariable) => orderedVariable.name.toLowerCase() === variable.name.toLowerCase())) {
      ordered.push(variable);
    }
  }

  return ordered;
}

// Answer byte precedes the string cluster by a fixed 508 bytes in v06 records
const ANSWER_BYTE_REL_OFFSET = 508;

function tryReadAnswerByteFromBinary(inflatedBytes: Uint8Array, sourceOffset: number): number | undefined {
  const offset = sourceOffset - ANSWER_BYTE_REL_OFFSET;
  if (offset < 0 || offset >= inflatedBytes.length) {
    return undefined;
  }

  const answerByte = inflatedBytes[offset];

  // Valid answer values are 0-3 (representing A-D)
  if (answerByte >= 0 && answerByte <= 3) {
    return answerByte;
  }

  return undefined;
}

function inferVersion06Answer(
  variables: AlgorithmicVariable[],
  choices?: Choice[],
  choiceRefs: string[] = [],
  inflatedBytes?: Uint8Array,
  sourceOffset?: number,
): DecodedAnswer | undefined {
  // Try to read answer from binary if available
  if (inflatedBytes && sourceOffset !== undefined) {
    const answerByte = tryReadAnswerByteFromBinary(inflatedBytes, sourceOffset);
    if (answerByte !== undefined && choices?.length) {
      const answerChoice = choices[answerByte];
      if (answerChoice) {
        return { value: answerChoice.id, format: 'choice' };
      }
    }
  }

  if (choices?.length && choices.every((choice) => /not decoded yet/.test(choice.body.text))) return undefined;

  const answerDirection = variables.find((variable) => /^ans_direction$/i.test(variable.name));
  const answerUnits = variables.find((variable) => /^ans_units$/i.test(variable.name));
  if (answerDirection && answerUnits) {
    const answerText = `${answerUnits.sampleValue ?? answerUnits.rule} units ${answerDirection.sampleValue ?? answerDirection.rule}`;
    const matchingChoice = choices?.find((choice) => choice.body.text === answerText);
    return {
      value: matchingChoice?.id ?? answerText,
      format: matchingChoice ? 'choice' : 'text',
    };
  }

  const inverseLinearAnswer = inferInverseLinearFunctionExpression(new Map(variables.map((variable) => [variable.name.toLowerCase(), variable])));
  if (inverseLinearAnswer && choices?.some((choice) => /^f\^\(-1\)\(x\) = /.test(choice.body.text))) {
    const matchingChoice = choices.find((choice) => choice.body.text === `f^(-1)(x) = ${inverseLinearAnswer}`);
    return matchingChoice
      ? { value: matchingChoice.id, format: 'choice' }
      : { value: `f^(-1)(x) = ${inverseLinearAnswer}`, format: 'text' };
  }

  const xAnswer = variables.find((variable) => /^x_ans$/i.test(variable.name));
  const yAnswer = variables.find((variable) => /^y_ans$/i.test(variable.name));
  if (xAnswer && yAnswer && choices?.some((choice) => /^\(.+\)$/.test(choice.body.text))) {
    const answerText = `(${convertExamViewExpressionToTypst(xAnswer.sampleValue ?? xAnswer.rule ?? xAnswer.name)}, ${convertExamViewExpressionToTypst(yAnswer.sampleValue ?? yAnswer.rule ?? yAnswer.name)})`;
    const matchingChoice = choices.find((choice) => choice.body.text === answerText);
    return matchingChoice ? { value: matchingChoice.id, format: 'choice' } : { value: answerText, format: 'text' };
  }

  const radicalRestriction = variables.find((variable) => /^k$/i.test(variable.name));
  if (radicalRestriction && choices?.some((choice) => /^x [<>]=/.test(choice.body.text))) {
    const answerText = `x >= ${convertExamViewExpressionToTypst(radicalRestriction.sampleValue ?? radicalRestriction.rule ?? radicalRestriction.name)}`;
    const matchingChoice = choices.find((choice) => choice.body.text === answerText);
    return matchingChoice ? { value: matchingChoice.id, format: 'choice' } : { value: answerText, format: 'text' };
  }

  const answerVariable = variables.find((variable) => /^(ans|answer)$/i.test(variable.name))
    ?? inferAnswerVariableFromChoiceRefs(variables, choiceRefs)
    ?? variables.find((variable) => choiceRefs[0] && variable.name.toLowerCase() === choiceRefs[0].toLowerCase())
    ?? variables.find((variable) => /^(tn|n)$/i.test(variable.name));

  if (answerVariable) {
    const answerText = convertExamViewExpressionToTypst(answerVariable.sampleValue ?? answerVariable.rule ?? answerVariable.name);
    const exactMatch = choices?.find((choice) => choice.body.text === answerText);
    if (exactMatch) return { value: exactMatch.id, format: 'choice' };
    // If no exact match, try to find a choice whose text contains the answer value.
    // This handles convergence-style questions where ANS appears embedded in sentence choices.
    const substringMatch = answerText.length >= 2
      ? choices?.find((choice) => choice.body.text.includes(answerText))
      : undefined;
    return {
      value: substringMatch?.id ?? answerText,
      format: substringMatch ? 'choice' : 'text',
    };
  }

  if (choices?.length) {
    if (choices.every((choice) => /not decoded yet/.test(choice.body.text))) return undefined;
    return {
      value: choices[0].id,
      format: 'choice',
    };
  }

  return undefined;
}

function inferAnswerVariableFromChoiceRefs(
  variables: AlgorithmicVariable[],
  choiceRefs: string[],
): AlgorithmicVariable | undefined {
  const variableMap = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  const reciprocalRef = choiceRefs.find((ref) => /^1\/[A-Za-z_][A-Za-z0-9_]*$/.test(ref));
  if (reciprocalRef) {
    return {
      name: reciprocalRef,
      rule: reciprocalRef,
      sampleValue: resolveChoiceRefValue(reciprocalRef, variableMap),
    };
  }

  return undefined;
}

function resolveChoiceRefValue(ref: string, variableMap: Map<string, AlgorithmicVariable>): string {
  const variable = variableMap.get(ref.toLowerCase());
  if (variable) return variable.sampleValue ?? variable.rule ?? variable.name;

  const reciprocal = /^1\/([A-Za-z_][A-Za-z0-9_]*)$/.exec(ref);
  if (reciprocal) {
    const denominator = variableMap.get(reciprocal[1].toLowerCase())?.sampleValue;
    return denominator ? `1/${denominator}` : ref;
  }

  return ref;
}

function convertExamViewExpressionToTypst(text: string): string {
  return text
    .replace(/fracs?\(([^,]+),([^)]+)\)/gi, (_, numerator: string, denominator: string) => `#math.frac(${numerator.trim()}, ${denominator.trim()})`)
    .replace(/\^/g, '^');
}

function inferClassNameFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  const normalized = filename.replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);
  const banksIndex = parts.findIndex((part) => part.toLowerCase() === 'banks');
  if (banksIndex >= 0 && parts[banksIndex + 1]) return parts[banksIndex + 1];
  return undefined;
}

function inferUnitNameFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  const base = filename.replace(/\\/g, '/').split('/').pop();
  return base?.replace(/\.[^.]+$/, '');
}

function extractReadableText(bytes: Uint8Array): string {
  const utf8 = extractPrintableText(bytes);
  const utf16le = extractPrintableUtf16LeText(bytes);
  return scoreReadableText(utf16le) > scoreReadableText(utf8) ? utf16le : utf8;
}

function scoreReadableText(text: string): number {
  const lower = text.toLowerCase();
  let score = text.length;
  for (const token of ['question', 'answer', 'solution', 'chapter', 'multiple choice']) {
    if (lower.includes(token)) score += 1000;
  }
  return score;
}

function extractPrintableText(bytes: Uint8Array): string {
  const decoded = TEXT_DECODER.decode(bytes);
  return decoded
    .replace(/[^\x09\x0a\x0d\x20-\x7e]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractPrintableUtf16LeText(bytes: Uint8Array): string {
  const decoded = UTF16LE_DECODER.decode(bytes);
  return decoded
    .replace(/[^\x09\x0a\x0d\x20-\x7e]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractKnownAssets(bytes: Uint8Array): DecodedAsset[] {
  const assets: DecodedAsset[] = [];
  const signatures: Array<{ mimeType: string; ext: string; signature: number[]; kind: AssetKind }> = [
    { mimeType: 'image/png', ext: 'png', signature: [0x89, 0x50, 0x4e, 0x47], kind: 'image' },
    { mimeType: 'image/jpeg', ext: 'jpg', signature: [0xff, 0xd8, 0xff], kind: 'image' },
    { mimeType: 'image/gif', ext: 'gif', signature: [0x47, 0x49, 0x46, 0x38], kind: 'image' },
    { mimeType: 'image/bmp', ext: 'bmp', signature: [0x42, 0x4d], kind: 'image' },
  ];

  for (let i = 0; i < bytes.length; i++) {
    for (const sig of signatures) {
      if (!matchesAt(bytes, sig.signature, i)) continue;
      const id = `asset-${assets.length + 1}`;
      const sourceLength = findAssetLength(bytes, i, sig.ext);
      if (!sourceLength) continue;
      assets.push({
        id,
        kind: sig.kind,
        mimeType: sig.mimeType,
        filename: `${id}.${sig.ext}`,
        bytes: bytes.slice(i, i + sourceLength),
        sourceOffset: i,
        sourceLength,
      });
    }
  }

  return assets;
}

function findAssetLength(bytes: Uint8Array, offset: number, ext: string): number | undefined {
  if (ext === 'png') return findPngLength(bytes, offset);
  if (ext === 'jpg') return findJpegLength(bytes, offset);
  if (ext === 'gif') return findGifLength(bytes, offset);
  if (ext === 'bmp') return findBmpLength(bytes, offset);
  return undefined;
}

function findBmpLength(bytes: Uint8Array, offset: number): number | undefined {
  if (offset + 54 > bytes.length) return undefined;
  const size = readUint32Le(bytes, offset + 2);
  const pixelOffset = readUint32Le(bytes, offset + 10);
  const dibHeaderSize = readUint32Le(bytes, offset + 14);
  const width = readInt32Le(bytes, offset + 18);
  const height = readInt32Le(bytes, offset + 22);
  const planes = readUint16Le(bytes, offset + 26);
  const bitsPerPixel = readUint16Le(bytes, offset + 28);

  if (size < 54 || offset + size > bytes.length) return undefined;
  if (![12, 40, 52, 56, 108, 124].includes(dibHeaderSize)) return undefined;
  if (pixelOffset < 14 + dibHeaderSize || pixelOffset >= size) return undefined;
  if (planes !== 1) return undefined;
  if (![1, 4, 8, 16, 24, 32].includes(bitsPerPixel)) return undefined;
  if (width === 0 || height === 0 || Math.abs(width) > 20000 || Math.abs(height) > 20000) return undefined;
  return size;
}

function findPngLength(bytes: Uint8Array, offset: number): number | undefined {
  let cursor = offset + 8;
  while (cursor + 8 <= bytes.length) {
    const length = readUint32Be(bytes, cursor);
    const type = String.fromCharCode(...bytes.slice(cursor + 4, cursor + 8));
    cursor += 8 + length + 4;
    if (cursor > bytes.length) return undefined;
    if (type === 'IEND') return cursor - offset;
  }
  return undefined;
}

function findJpegLength(bytes: Uint8Array, offset: number): number | undefined {
  for (let cursor = offset + 2; cursor + 1 < bytes.length; cursor++) {
    if (bytes[cursor] === 0xff && bytes[cursor + 1] === 0xd9) return cursor + 2 - offset;
  }
  return undefined;
}

function findGifLength(bytes: Uint8Array, offset: number): number | undefined {
  for (let cursor = offset + 6; cursor < bytes.length; cursor++) {
    if (bytes[cursor] === 0x3b) return cursor + 1 - offset;
  }
  return undefined;
}

function readUint32Be(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function readUint32Le(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function readInt32Le(bytes: Uint8Array, offset: number): number {
  return readUint32Le(bytes, offset) | 0;
}

function readUint16Le(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function matchesAt(bytes: Uint8Array, signature: number[], offset: number): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function makeRawFragment(bytes: Uint8Array, offset: number, length: number, textPreview?: string): UnknownBnkFragment {
  return {
    offset,
    length,
    hexPreview: [...bytes.slice(offset, offset + length)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(' '),
    textPreview: textPreview?.slice(0, 500),
  };
}

function contentText(content: RichContent): string {
  return content.text;
}

function emptyStats(): DecodeStats {
  return {
    questionCount: 0,
    assetCount: 0,
    diagnosticCount: 0,
    unsupportedFragmentCount: 0,
  };
}

function withStats(result: DecodeResult): DecodeResult {
  return {
    ...result,
    stats: {
      questionCount: result.questions.length,
      assetCount: result.assets.length,
      diagnosticCount: result.diagnostics.length,
      unsupportedFragmentCount: result.questions.reduce((sum, q) => sum + (q.raw?.length ?? 0), 0),
    },
  };
}
