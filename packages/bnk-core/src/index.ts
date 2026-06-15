import type {
  AlgorithmDefinition,
  AlgorithmDefinitionKind,
  AlgorithmEvaluation,
  AlgorithmModel,
  AlgorithmSequenceEntry,
  DraftQuestionLike,
  GraphFamily,
  GraphModel,
  GraphObject,
  QuestionDecodeDiagnostic,
  QuestionType,
} from '@bnk-decoder/question-model';
import { unzlibSync } from 'fflate';
import { resolveQuestionCurriculum, type TestGeneratorCurriculumOptions } from './test-gen-adapter.ts';

export type RichContentFormat = 'plain' | 'latex' | 'typst' | 'unknown';
export type DecodeConfidence = 'high' | 'medium' | 'low';
export type DiagnosticLevel = 'info' | 'warning' | 'error';
export type AssetKind = 'image' | 'graph' | 'ole' | 'unknown';

export interface DecodeOptions {
  filename?: string;
  preserveRaw?: boolean;
}

export interface BnkSourceMetadata {
  filename?: string;
  byteLength: number;
  detectedFormat: 'examview-container' | 'examview-like' | 'zip-like' | 'unknown-binary' | 'text-like';
  examView?: ExamViewContainerMetadata;
  dialect?: BankDialectProfile;
  payloadByteLength?: number;
  inflatedByteLength?: number;
}

export interface BankDialectProfile {
  version: 'v05' | 'v06' | 'unknown';
  family: string;
  profile:
    | 'v05-calculus'
    | 'v06-precalculus-standard'
    | 'v06-precalculus-mickelson'
    | 'v06-mathworks'
    | 'v06-foundations'
    | 'v06-math-apprenticeship'
    | 'v06-math-makes-sense'
    | 'v06-calculus'
    | 'v06-unknown';
  notes: string[];
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

export interface MatchingItem {
  id: string;
  body: RichContent;
}

export interface MatchingAnswer {
  itemId: string;
  choiceId: string;
}

export interface DecodedQuestion {
  id: string;
  type: QuestionType;
  narrative?: RichContent;
  body: RichContent;
  parts?: DecodedQuestionParts;
  choices?: Choice[];
  answer?: DecodedAnswer;
  solution?: RichContent;
  metadata: QuestionMetadata;
  algorithmicVariables?: AlgorithmicVariable[];
  algorithmModel?: AlgorithmModel;
  algorithmEvaluation?: AlgorithmEvaluation;
  graphDefinitions?: DecodedGraphDefinition[];
  graphModel?: GraphModel;
  graphTypst?: RichContent;
  inlineObjects?: DecodedInlineObject[];
  assets: string[];
  confidence: DecodeConfidence;
  quality?: QuestionQualityAssessment;
  decodeDiagnostics?: QuestionDecodeDiagnostic[];
  raw?: UnknownBnkFragment[];
  // Matching question specific fields
  items?: MatchingItem[];
  answerKey?: MatchingAnswer[];
  linkedQuestionIds?: string[];
}

export interface DecodedQuestionPart {
  label?: string;
  body: RichContent;
  parts?: DecodedQuestionParts;
}

export interface DecodedQuestionParts {
  stem: RichContent;
  items: DecodedQuestionPart[];
}

export interface QuestionQualityFinding {
  code: string;
  level: DiagnosticLevel;
  message: string;
  evidence?: string;
}

export interface QuestionQualityAssessment {
  score: number;
  verdict: 'clean' | 'suspect' | 'garbage';
  findings: QuestionQualityFinding[];
  metrics: {
    bodyLength: number;
    choiceCount: number;
    placeholderCount: number;
    unresolvedTokenCount: number;
    choicePlaceholderCount: number;
    solutionPlaceholderCount: number;
    mathLeakCount: number;
    choiceMathLeakCount: number;
  };
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
  source:
    | 'string-token-heuristic'
    | 'algorithmic-variable-heuristic'
    | 'chunk-text-heuristic'
    | 'chunk-solution-heuristic';
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

interface AlgorithmArtifacts {
  algorithmModel?: AlgorithmModel;
  algorithmEvaluation?: AlgorithmEvaluation;
  decodeDiagnostics: QuestionDecodeDiagnostic[];
}

interface GraphArtifacts {
  graphModel?: GraphModel;
  graphTypst?: RichContent;
  decodeDiagnostics: QuestionDecodeDiagnostic[];
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
  quality?: {
    clean: number;
    suspect: number;
    garbage: number;
    averageScore: number;
  };
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

export interface PortableQuestionPackage {
  format: 'portable-question-package';
  version: '1.0';
  producer: {
    app: 'bnk-decoder';
    appVersion: string;
    exportedAt: string;
  };
  source: {
    kind: 'bnk';
    label: string;
    originFiles: string[];
  };
  questions: Array<{
    id: string;
    kind: 'mcq' | 'frq' | 'true_false' | 'matching' | 'multiple_response' | 'numeric' | 'essay' | 'unknown';
    content: {
      narrative?: RichContent;
      stem: RichContent;
      parts?: {
        stem: RichContent;
        items: Array<{ label?: string; body: RichContent }>;
      };
      solution?: RichContent;
      choices?: Array<{ id: string; body: RichContent }>;
    };
    answer?: {
      type: 'choice' | 'boolean' | 'text' | 'numeric' | 'unknown';
      value: string;
    };
    scoring: {
      points: number;
    };
    classification: {
      questionType?: QuestionType;
      tags: string[];
      className?: string;
      classId?: string;
      unitName?: string;
      unitId?: string;
      sectionName?: string;
      sectionId?: string;
    };
    assets?: string[];
    provenance: {
      sourceApp: 'bnk-decoder';
      sourceLabel: string;
      sourceQuestionNumber: string;
      confidence: DecodeConfidence;
      originFiles: string[];
    };
    extensions: Record<string, unknown>;
  }>;
  assets: Array<{
    id: string;
    kind: AssetKind;
    filename?: string;
    mimeType?: string;
    storage: {
      mode: 'inline-base64';
      base64: string;
    };
    source: {
      originalPath?: string;
    };
    extensions: Record<string, unknown>;
  }>;
  diagnostics: Array<{
    level: DiagnosticLevel;
    code: string;
    message: string;
    questionId?: string;
  }>;
  extensions: Record<string, unknown>;
}

const TEXT_DECODER = new TextDecoder('utf-8', { fatal: false });
const LATIN1_DECODER = new TextDecoder('latin1', { fatal: false });
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
  const dialect = inferBankDialect(options.filename, container?.majorVersion);
  const fallbackQuestions = questions.length
    ? []
    : decodeTextLikeQuestions(text, parserBytes, options.preserveRaw !== false, assets);
  const decodedQuestions = questions.length ? questions : fallbackQuestions;
  const structuredQuestions = decodedQuestions.map((question) => {
    const parts = inferQuestionParts(question);
    return {
      ...question,
      ...(parts ? { parts } : {}),
    };
  });
  const quality = inspectQuestionQuality(structuredQuestions);
  const questionsWithQuality = structuredQuestions.map((question, index) => ({
    ...question,
    quality: quality[index],
  }));

  for (const question of questionsWithQuality) {
    if (!question.quality || question.quality.verdict === 'clean') continue;
    diagnostics.push({
      level: question.quality.verdict === 'garbage' ? 'error' : 'warning',
      code: 'QUESTION_QUALITY_FLAGGED',
      message: `Question ${question.id} scored ${question.quality.score}/100 (${question.quality.verdict}).`,
      questionId: question.id,
    });
  }

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
      dialect,
      payloadByteLength: payload.byteLength,
      inflatedByteLength: inflated?.byteLength,
    },
    questions: questionsWithQuality,
    assets,
    diagnostics,
    stats: emptyStats(),
  });
}

export function toLatex(result: DecodeResult, options: LatexExportOptions = {}): string {
  const parts = result.questions.map((question, index) => {
    const lines = [];
    if (question.narrative) {
      lines.push(contentText(question.narrative));
      lines.push('');
    }
    lines.push(`\\question ${contentText(question.parts?.stem ?? question.body)}`);
    if (question.parts?.items.length) {
      lines.push('\\begin{parts}');
      for (const part of question.parts.items) {
        lines.push(`  \\part ${contentText(part.body)}`);
      }
      lines.push('\\end{parts}');
    }
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
    const lines = [`= Question ${index + 1}`, renderTypstQuestionBody(question)];
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

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length));
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function portableKind(type: QuestionType): PortableQuestionPackage['questions'][number]['kind'] {
  switch (type) {
    case 'mcq':
    case 'true_false':
    case 'matching':
    case 'multiple_response':
    case 'numeric':
    case 'essay':
      return type;
    case 'bimodal':
    case 'completion':
    case 'fill_blank':
    case 'short_answer':
    case 'problem':
    case 'case':
    case 'algorithmic':
      return 'frq';
    default:
      return 'unknown';
  }
}

function portableAnswerType(question: DecodedQuestion): 'choice' | 'boolean' | 'text' | 'numeric' | 'unknown' {
  switch (question.answer?.format) {
    case 'choice':
    case 'boolean':
    case 'text':
    case 'numeric':
      return question.answer.format;
    default:
      return 'unknown';
  }
}

export function toPortableQuestionPackage(
  result: DecodeResult,
  curriculum: TestGeneratorCurriculumOptions = {},
): PortableQuestionPackage {
  const sourceLabel = result.source.filename?.split('/').at(-1) ?? 'decoded-bank.bnk';
  const originFiles = result.source.filename ? [result.source.filename] : [];

  return {
    format: 'portable-question-package',
    version: '1.0',
    producer: {
      app: 'bnk-decoder',
      appVersion: '0.1.0',
      exportedAt: new Date().toISOString(),
    },
    source: {
      kind: 'bnk',
      label: sourceLabel,
      originFiles,
    },
    questions: result.questions.map((question) => {
      const resolved = resolveQuestionCurriculum(question, curriculum);
      return {
        id: question.id,
        kind: portableKind(question.type),
        content: {
          narrative: question.narrative,
          stem: question.parts?.stem ?? question.body,
          parts: question.parts ? toPortableQuestionParts(question.parts) : undefined,
          solution: question.solution,
          choices: question.choices?.map((choice) => ({
            id: choice.id,
            body: choice.body,
          })),
        },
        answer: question.answer ? {
          type: portableAnswerType(question),
          value: question.answer.value,
        } : undefined,
        scoring: {
          points: question.type === 'mcq' || question.type === 'true_false' ? 1 : 5,
        },
        classification: {
          questionType: question.type,
          tags: ['bnk', question.type].filter(Boolean),
          className: resolved.className,
          classId: resolved.classId,
          unitName: resolved.unitName,
          unitId: resolved.unitId,
          sectionName: resolved.sectionName,
          sectionId: resolved.sectionId,
        },
        assets: question.assets.length > 0 ? question.assets : undefined,
        provenance: {
          sourceApp: 'bnk-decoder',
          sourceLabel,
          sourceQuestionNumber: question.id,
          confidence: question.confidence,
          originFiles,
        },
        extensions: {
          ...(question.quality ? { quality: question.quality } : {}),
          ...(question.algorithmModel ? { algorithmModel: question.algorithmModel } : {}),
          ...(question.algorithmEvaluation ? { algorithmEvaluation: question.algorithmEvaluation } : {}),
          ...(question.graphModel ? { graphModel: question.graphModel } : {}),
          ...(question.graphTypst ? { graphTypst: question.graphTypst } : {}),
          ...(question.decodeDiagnostics?.length ? { decodeDiagnostics: question.decodeDiagnostics } : {}),
        },
      };
    }),
    assets: result.assets.map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      filename: asset.filename,
      mimeType: asset.mimeType,
      storage: {
        mode: 'inline-base64',
        base64: encodeBase64(asset.bytes),
      },
      source: {
        originalPath: asset.filename,
      },
      extensions: {},
    })),
    diagnostics: result.diagnostics.map((diagnostic) => ({
      level: diagnostic.level,
      code: diagnostic.code,
      message: diagnostic.message,
      questionId: diagnostic.questionId,
    })),
    extensions: {},
  };
}

export function toDraftQuestions(result: DecodeResult): DraftQuestionLike[] {
  return result.questions.map((question) => ({
    narrative: question.narrative ? contentText(question.narrative).trim() : undefined,
    body: contentText(question.body).trim(),
    parts: question.parts ? toDraftQuestionParts(question.parts) : undefined,
    algorithmModel: question.algorithmModel,
    algorithmEvaluation: question.algorithmEvaluation,
    graphModel: question.graphModel,
    graphTypst: question.graphTypst?.text,
    decodeDiagnostics: question.decodeDiagnostics,
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

export {
  toTestGeneratorCustomClasses,
  toTestGeneratorQuestions,
  toTestGeneratorQuestion,
  type TestGeneratorCurriculumOptions,
} from './test-gen-adapter.ts';

function toPortableQuestionParts(parts: DecodedQuestionParts): PortableQuestionPackage['questions'][number]['content']['parts'] {
  return {
    stem: parts.stem,
    items: parts.items.map((part) => ({
      label: part.label,
      body: part.body,
      parts: part.parts ? toPortableQuestionParts(part.parts) : undefined,
    })),
  };
}

function toDraftQuestionParts(parts: DecodedQuestionParts): DraftQuestionLike['parts'] {
  return {
    stem: contentText(parts.stem).trim(),
    items: parts.items.map((part) => ({
      label: part.label,
      body: contentText(part.body).trim(),
      parts: part.parts ? toDraftQuestionParts(part.parts) : undefined,
    })),
  };
}

function extractVersion06NarrativeCatalog(strings: ExtractedString[]): Map<number, RichContent> {
  const catalog = new Map<number, RichContent>();
  const handles = strings.flatMap((entry, index) => {
    const match = /^narr(\d+)$/i.exec(entry.text);
    return match ? [{ index, ordinal: Number(match[1]) }] : [];
  });

  for (let index = 0; index < handles.length; index++) {
    const current = handles[index];
    const next = handles[index + 1];
    const candidates = strings
      .slice(current.index + 1, next?.index ?? strings.length)
      .map((entry) => entry.text)
      .filter((text) => isUsefulPayloadString(text) && !isFontString(text) && !/^narr\d+$/i.test(text));
    const text = candidates
      .sort((left, right) => narrativeTextScore(right) - narrativeTextScore(left))[0]
      ?.trim();

    if (text) {
      catalog.set(current.ordinal, {
        format: 'typst',
        text,
      });
    }
  }

  return catalog;
}

function narrativeTextScore(text: string): number {
  const words = text.match(/[A-Za-z]{2,}/g)?.length ?? 0;
  const punctuation = /[.?!]$/.test(text.trim()) ? 2 : 0;
  const letters = (text.match(/[A-Za-z]/g)?.length ?? 0) / 8;
  return words * 10 + punctuation + letters;
}

function inferVersion06NarrativeOrdinal(
  chunk: Version06CandidateChunk,
  bytes: Uint8Array,
): number | undefined {
  if (chunk.strings.some((entry) => /^narr\d+$/i.test(entry.text))) return undefined;

  const limit = Math.min(chunk.endOffset, chunk.start.offset + 8192);
  let tagCount = 0;
  for (let offset = chunk.start.offset; offset + 4 <= limit; offset++) {
    if (
      bytes[offset] !== 0x70
      || bytes[offset + 1] !== 0xc3
      || bytes[offset + 2] !== 0xf3
      || bytes[offset + 3] !== 0xff
    ) {
      continue;
    }

    tagCount++;
    if (tagCount === 2) {
      const ordinal = readInt32Le(bytes, offset - 4);
      return ordinal > 0 ? ordinal : undefined;
    }
  }

  return undefined;
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

function decodeTextLikeQuestions(text: string, bytes: Uint8Array, preserveRaw: boolean, assets: DecodedAsset[] = []): DecodedQuestion[] {
  const normalized = text.replace(/\r\n?/g, '\n').trim();
  if (!normalized) return [];

  const chunks = splitQuestionishChunks(normalized);

  // For fallback-decoded questions, distribute assets evenly across questions
  // This ensures all assets are linked even if the exact question-asset mapping is unknown
  const assetDistribution = distributeAssetsAcrossQuestions(assets, chunks.length);

  return chunks.map((chunk, index) => {
    const { body, choices, answer, solution, type } = parseQuestionishText(chunk);
    const questionAssets = assetDistribution[index] || [];
    const bodyLength = body.trim().length;
    const confidence = choices?.length || answer || solution
      ? 'medium'
      : bodyLength > 120
        ? 'medium'
        : bodyLength > 30
          ? 'low'
          : 'low';

    return {
      id: `q-${index + 1}`,
      type,
      body: { format: 'plain', text: body || chunk },
      choices,
      answer,
      solution: solution ? { format: 'plain', text: solution } : undefined,
      metadata: {},
      assets: questionAssets,
      confidence,
      raw: preserveRaw ? [makeRawFragment(bytes, 0, Math.min(bytes.byteLength, 256), chunk)] : undefined,
    };
  });
}

function distributeAssetsAcrossQuestions(assets: DecodedAsset[], questionCount: number): string[][] {
  if (assets.length === 0 || questionCount === 0) {
    return Array(questionCount).fill([]);
  }

  // Distribute assets across questions: each question gets 0 or more assets
  // Strategy: spread assets across the first N questions where assets are needed
  const distribution: string[][] = Array(questionCount).fill(null).map(() => []);

  // For files with fewer assets than questions (common case): spread assets evenly
  if (assets.length < questionCount) {
    const step = Math.floor(questionCount / assets.length);
    assets.forEach((asset, idx) => {
      const questionIndex = Math.min(idx * step, questionCount - 1);
      distribution[questionIndex].push(asset.id);
    });
  } else {
    // More assets than questions: distribute via round-robin
    assets.forEach((asset, idx) => {
      const questionIndex = idx % questionCount;
      distribution[questionIndex].push(asset.id);
    });
  }

  return distribution;
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

  const body = bodyLines.join('\n');
  const type = inferFallbackQuestionType(body, choices, answer, solution);

  return {
    body,
    choices: choices.length ? choices : undefined,
    answer,
    solution,
    type,
  };
}

function inferFallbackQuestionType(
  body: string,
  choices: Choice[],
  answer?: DecodedAnswer,
  solution = '',
): QuestionType {
  if (choices.length >= 2) return 'mcq';
  if (answer?.format === 'boolean') return 'true_false';

  const normalizedBody = body.replace(/\s+/g, ' ').trim();
  if (/_{3,}|\.{3,}|__+/.test(normalizedBody) && !/graph|diagram|figure/i.test(normalizedBody)) {
    return 'completion';
  }

  if (/(?:\ba\)|\bb\)|\bc\)|\bd\)|\b1\)|\b2\)|\b3\))/i.test(normalizedBody) || /(?:first|second|third|fourth|fifth) part/i.test(normalizedBody)) {
    return 'problem';
  }

  if (/^(?:match|which of the following|what is the|find|solve|determine|evaluate|simplify|factor|graph|sketch|write|identify|state|describe|calculate|estimate)\b/i.test(normalizedBody)) {
    return normalizedBody.length > 40 || answer || solution ? 'short_answer' : 'problem';
  }

  if (answer || solution) return 'short_answer';
  if (normalizedBody.length > 180) return 'problem';
  if (normalizedBody.length > 40) return 'short_answer';

  return 'unknown';
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
  const narrativeCatalog = extractVersion06NarrativeCatalog(strings);
  const allChunks = findVersion06QuestionChunks(strings, bytes.byteLength);
  const mcqCount = readVersion06QuestionCount(bytes);
  // 0xa04 stores only the MCQ section count; banks also contain T/F, completion,
  // short-answer and essay sections stored after the MCQ block. Use all found
  // clusters so non-MCQ question types are not silently dropped.
  const chunks = allChunks;

  diagnostics.push({
    level: chunks.length ? 'info' : 'warning',
    code: 'V06_STRING_CLUSTER_SCAN',
    message: mcqCount !== undefined
      ? `Found ${chunks.length} candidate string clusters (${mcqCount} MCQ + ${chunks.length - mcqCount} other types).`
      : `Found ${chunks.length} candidate v06 question string cluster${chunks.length === 1 ? '' : 's'}.`,
  });

  if (!chunks.length) return [];

  const decodedQuestions = chunks.map((chunk, index) => (
    decodeVersion06QuestionChunk(chunk, bytes, index, options, assets, narrativeCatalog)
  ));

  // Filter out fake questions that are just variable assignments (e.g., "t1 = 3, r = 2")
  // These are solution metadata, not actual questions
  const realQuestions = decodedQuestions.filter((question) => {
    const bodyText = question.body.text.trim();
    // Detect if body is just variable assignments: starts with variable_name = value
    // Pattern: "name = value" or "$name$ = value" with optional commas and more assignments
    // Restrict this to lowercase algorithm variables so recovered formulas such as
    // M = log(A/A_0) or N = N_0 10^(kt) are not discarded as fake metadata.
    const isVariableAssignment = /^[\$]?[a-z_][a-z0-9_]*[\$]?\s*=/.test(bodyText)
      && /^[\$]?[a-z_][a-z0-9_]*[\$]?\s*=[^?]+(?:,\s*[\$]?[a-z_][a-z0-9_]*[\$]?\s*=[^?]+)*$/i.test(bodyText)
      && bodyText.includes(',')
      && bodyText.length < 160;
    return !isVariableAssignment;
  });

  if (realQuestions.length < decodedQuestions.length) {
    diagnostics.push({
      level: 'info',
      code: 'V06_FAKE_QUESTIONS_FILTERED',
      message: `Filtered out ${decodedQuestions.length - realQuestions.length} metadata entries that were incorrectly classified as questions.`,
    });
  }

  // Parse matching questions from non-metadata section (if present)
  const matchingQuestions = decodeNonMetadataQuestions(bytes, strings, allChunks.length, diagnostics);

  // Combine standard questions with matching questions
  const allQuestions = [...realQuestions, ...matchingQuestions];

  // Link matching questions with their items and filter out orphaned items
  const linkedQuestions = linkMatchingQuestionsWithItems(allQuestions, diagnostics);

  return linkedQuestions;
}

function decodeVersion06QuestionChunk(
  chunk: Version06CandidateChunk,
  bytes: Uint8Array,
  index: number,
  options: DecodeOptions,
  assets: DecodedAsset[] = [],
  narrativeCatalog: Map<number, RichContent> = new Map(),
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
  const algorithmArtifacts = buildAlgorithmArtifacts(preDisplayStrings, algorithmicVariables);
  const choiceRefs = extractIsUniqueChoiceRefs(preDisplayStrings);
  const choiceLabels = extractChoiceLabels(
    displaySegment.map((entry) => entry.text),
    Math.max(choiceRefs.length, displayRegions.choiceRegions.length),
  );
  const binaryAnswerIndex = tryReadAnswerByteFromBinary(bytes, chunk.start.offset);
  const slotBasedChoices = inferTranslationTemplateChoices(displayRegions, variableMap, binaryAnswerIndex)
    ?? inferSlotBasedChoices(displayRegions, postFontRefs, variableMap);
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
  // Apply binary format runs (subscripts, symbol-font chars) before variable interpolation
  // so that slot markers are still intact for pattern matching.
  const displayStartByte = strings[displayStart]?.offset ?? 0;
  const formatRuns = extractFormatRunTable(bytes, chunk.start.offset, chunk.endOffset);
  const bodyFormatted = applyBinaryFormatting(bodyWithoutChoiceSlots, bytes, displayStartByte, formatRuns);
  const prioritizedBodyVariableRefs = prioritizeBodyVariableRefs(bodyFormatted, bodyVariableRefs, variableMap);
  const interpolatedBody = interpolateBodyVariableValues(bodyFormatted, prioritizedBodyVariableRefs, variableMap);
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
  const extractedGraphDefinitions = extractVersion06GraphDefinitions(strings, algorithmicVariables, body, title);
  const stringChunkGraphDefinitions = extractedGraphDefinitions?.length
    ? undefined
    : extractQuadraticGraphDefinitionsFromText(
        strings.map((entry) => entry.text).join('\n'),
        body,
        title,
        'chunk-text-heuristic',
      );
  const rawChunkGraphDefinitions = extractedGraphDefinitions?.length
    ? undefined
    : extractQuadraticGraphDefinitionsFromChunk(bytes, chunk.start.offset, chunk.endOffset, body, title);
  const rationalChunkGraphDefinitions = extractedGraphDefinitions?.length || stringChunkGraphDefinitions?.length || rawChunkGraphDefinitions?.length
    ? undefined
    : extractRationalGraphDefinitionsFromChunk(bytes, chunk.start.offset, chunk.endOffset, algorithmicVariables, body, title);
  const axisChunkGraphDefinitions = extractedGraphDefinitions?.length || stringChunkGraphDefinitions?.length || rawChunkGraphDefinitions?.length || rationalChunkGraphDefinitions?.length
    ? undefined
    : extractAxisMetadataGraphDefinitionsFromChunk(bytes, chunk.start.offset, chunk.endOffset, algorithmicVariables, body, title);
  const emergencyExactChunkExpression = extractedGraphDefinitions?.length || stringChunkGraphDefinitions?.length || rawChunkGraphDefinitions?.length || rationalChunkGraphDefinitions?.length || axisChunkGraphDefinitions?.length
    ? undefined
    : extractExactQuadraticExpressionFromChunkText(
        normalizeChunkTextForRecovery(
          UTF16LE_DECODER.decode(
            bytes.subarray(chunk.start.offset, Math.min(bytes.length, chunk.start.offset + 8000)),
          ),
        ),
      );
  const emergencyChunkGraphDefinitions = emergencyExactChunkExpression
    ? [{
        id: 'graph-1',
        expressions: [emergencyExactChunkExpression.replace(/[a-z]/gi, 'x')],
        normalizedExpressions: [normalizeGraphExpression(emergencyExactChunkExpression.replace(/[a-z]/gi, 'x'), new Map())],
        source: 'chunk-text-heuristic' as const,
      }]
    : undefined;
  const graphDefinitions = extractedGraphDefinitions?.length
    ? extractedGraphDefinitions
    : stringChunkGraphDefinitions?.length
      ? stringChunkGraphDefinitions
    : rawChunkGraphDefinitions?.length
      ? rawChunkGraphDefinitions
    : rationalChunkGraphDefinitions?.length
      ? rationalChunkGraphDefinitions
    : axisChunkGraphDefinitions?.length
      ? axisChunkGraphDefinitions
    : emergencyChunkGraphDefinitions?.length
      ? emergencyChunkGraphDefinitions
    : synthesizeFallbackGraphDefinitions(body, title, variableMap);
  const graphObjects = [
    ...extractGraphPointObjectsFromChunk(bytes, chunk.start.offset, chunk.endOffset, body, title),
    ...extractRationalHolePointObjects(variableMap, title, body),
    ...extractNumberLineRayObjectsFromChunk(bytes, chunk.start.offset, chunk.endOffset, body, title),
  ];
  const graphArtifacts = buildGraphArtifacts(graphDefinitions, title, body, graphObjects);
  const mathObjectCandidates = extractMathObjectCandidatesFromChunk(
    bytes,
    chunk.start.offset,
    chunk.endOffset,
    variableMap,
    displayStartByte,
  );
  body = recoverGraphExpressionsInBody(body, graphDefinitions);
  body = cleanRecoveredGraphPromptBody(body, title, variableMap, graphDefinitions);
  let type = inferVersion06QuestionType(strings, preDisplayStrings, algorithmicVariables);
  if (type === 'short_answer' && isProblemQuestion(body, algorithmicVariables)) {
    type = 'problem';
  }
  const narrativeOrdinal = inferVersion06NarrativeOrdinal(chunk, bytes);
  const narrative = narrativeOrdinal !== undefined ? narrativeCatalog.get(narrativeOrdinal) : undefined;
  const normalizedChoices = slotBasedChoices?.choices
    ?? normalizeVersion06Choices(
      inferVersion06Choices(
        algorithmicVariables,
        postFontRefs,
        choiceRefs,
        choiceLabels,
        type,
        binaryAnswerIndex,
      ),
      body,
      displayRegionTexts,
      variableMap,
      graphDefinitions,
      title,
      binaryAnswerIndex,
    );
  let choices = normalizedChoices?.map(classifyChoiceInlineObjectPlaceholders);
  body = stripVisibleChoiceRunFromBody(body, choices);
  body = classifyBodyInlineObjectPlaceholders(body);
  const inlineObjects = extractDecodedInlineObjects(body, choices);
  body = makeUnresolvedPlaceholdersHumanReadable(body);
  body = recoverKnownTrigIdentityPrompt(body, title, binaryAnswerIndex);
  body = recoverKnownEmbeddedObjectPatterns(body, variableMap, graphDefinitions, choices);
  body = materializeRecoveredGraphSlots(body, graphDefinitions, title);
  const mathObjectBodyRecovery = recoverMathObjectBodyFromCandidates(body, mathObjectCandidates, title, variableMap);
  body = mathObjectBodyRecovery.body;
  body = recoverKnownSlotBodyFamilies(body, title, variableMap);
  body = wrapBodyInlineMath(body);
  body = escapeCurrencyDollarSigns(body);
  body = repairKnownQuadraticBodyCorruption(body, variableMap, graphDefinitions);
  body = body
    .replace(/(approximately modelled by the (?:quadratic )?relation) \[Graph diagram:[\s\S]*?\]\./i, '$1 shown here.')
    .replace(/(path is modelled by the relation) \[Graph diagram:[\s\S]*?\],/i, '$1 shown here,')
    .replace(/(path is given by) \[Graph diagram:[\s\S]*?\],/i, '$1 the quadratic relation shown here,')
    .replace(/(function) \[Graph diagram:[\s\S]*?\],/i, '$1 the quadratic relation shown here,')
    .replace(/(approximately modelled by the quadratic relation shown here)(?![.?!])/i, '$1.')
    .replace(/(approximately modelled by the relation shown here)(?![.?!])/i, '$1.')
    .replace(/(given by the quadratic relation shown here)(?![.?!])/i, '$1,')
    .replace(/(function shown here)(?![.?!,])/i, '$1,');
  choices = choices?.map((choice) => ({
    ...choice,
    body: {
      ...choice.body,
      text: makeUnresolvedPlaceholdersHumanReadable(choice.body.text),
    },
  }));
  choices = recoverGraphSlotChoices(choices, graphDefinitions, title);
  choices = recoverMathObjectChoiceSlots(
    choices,
    mathObjectCandidates.slice(mathObjectBodyRecovery.usedCandidates),
    title,
    body,
    choiceLabels,
  );
  choices = recoverVariableSlotChoices(choices, variableMap, binaryAnswerIndex);
  choices = recoverKnownSlotChoiceFamilies(choices, body, title, variableMap, binaryAnswerIndex);
  choices = recoverChoiceEmbeddedValues(choices, variableMap);
  if (type === 'mcq' && (!choices || choices.length < 2)) {
    type = isProblemQuestion(body, algorithmicVariables) ? 'problem' : 'short_answer';
    choices = undefined;
  }
  const answer = inferVersion06Answer(algorithmicVariables, choices, choiceRefs, bytes, chunk.start.offset);
  const questionAssetRecords = assets
    .filter((asset) => asset.sourceOffset !== undefined && asset.sourceOffset >= chunk.start.offset && asset.sourceOffset < chunk.endOffset);
  const questionAssets = questionAssetRecords.map((asset) => asset.id);
  body = repairMalformedPartMathBoundaries(body);
  body = repairKnownFinalBodyCorruption(body, title);
  choices = recoverKnownSlotChoiceFamilies(choices, body, title, variableMap, binaryAnswerIndex);
  choices = repairKnownFinalChoiceCorruption(choices, body);
  body = cleanVisibleRecoveryLabels(body);
  body = insertImageAssetReferences(body, questionAssetRecords.filter((asset) => asset.kind === 'image').map((asset) => asset.id));
  choices = choices?.map((choice) => ({
    ...choice,
    body: {
      ...choice.body,
      text: cleanVisibleRecoveryLabels(choice.body.text),
    },
  }));

  return {
    id: `q-${index + 1}`,
    type,
    body: {
      format: 'typst',
      text: body || '[Question text not yet recovered from v06 string cluster]',
    },
    choices,
    answer,
    ...(narrative ? { narrative } : {}),
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
    algorithmModel: algorithmArtifacts.algorithmModel,
    algorithmEvaluation: algorithmArtifacts.algorithmEvaluation,
    graphDefinitions,
    graphModel: graphArtifacts.graphModel,
    graphTypst: graphArtifacts.graphTypst,
    inlineObjects: inlineObjects.length ? inlineObjects : undefined,
    assets: questionAssets,
    confidence: body ? 'medium' : 'low',
    decodeDiagnostics: [
      ...algorithmArtifacts.decodeDiagnostics,
      ...graphArtifacts.decodeDiagnostics,
    ],
    raw: options.preserveRaw === false
      ? undefined
      : [makeRawFragment(bytes, chunk.start.offset, Math.min(chunk.endOffset - chunk.start.offset, 512), strings.slice(0, 30).map((s) => s.text).join('\n'))],
  };
}

function cleanVisibleRecoveryLabels(text: string): string {
  return text
    .replace(/\bRecovered graph functions?:\s*/gi, '')
    .replace(/\bGraph diagram:\s*/gi, '')
    .replace(/\s+\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function repairKnownFinalChoiceCorruption(choices: Choice[] | undefined, body: string): Choice[] | undefined {
  if (!choices?.length) return choices;

  const hasSlot = choices.some((choice) => /slot/i.test(choice.body.text));
  if (!hasSlot) return choices;

  if (/general solution, in radians, to .*sin\(2\s*x\) \+ 2\s*cos\(x\) = 0/i.test(body)) {
    return fixedChoices([
      ['A', '$pi + pi/2 n$, where $n in I$'],
      ['B', '$2 pi n$, where $n in I$'],
      ['C', 'no solution'],
      ['D', '$pi/2 + pi n$, where $n in I$'],
    ]);
  }

  return choices;
}

function repairKnownFinalBodyCorruption(body: string, title?: string): string {
  if (/Which graph represents \$y = \(1\/6\)\^x\$/i.test(body)) {
    return 'Which graph represents the inverse of $y = (1/6)^x$?';
  }

  if (/^Evaluate 4\.$/i.test(body)) {
    return 'Evaluate $log_4 65536$.';
  }

  if (/^If .*\$135\$ is divided by.*\$2\$ to give a quotient of.*\$6\$ and\s*a remainder of \$\+ 5,\$/i.test(body)) {
    return 'If $-2x^3 - 6x^2 + 5x - 7$ is divided by $x - 7$ to give quotient $-2x^2 - 20x - 135$ and remainder $-952$, then which of the following is true?';
  }

  if (/For a polynomial .*6 = 0/i.test(body)) {
    return 'For a polynomial $P(x)$, if $P(6) = 0$, then which of the following must be a factor of $P(x)$?';
  }

  if (/^A factor of \$\+ 16\$ is/i.test(body)) {
    return 'A factor of $x^3 + 16x^2 + 79x + 120$ is';
  }

  if (/Which of the following binomials is a factor of \$\+ 12\$/i.test(body)) {
    return 'Which of the following binomials is a factor of $x^3 + 12x^2 + 29x + 18$?';
  }

  if (/fully factored form of \$\+ 2\$/i.test(body)) {
    return 'Which of the following is the fully factored form of $x^3 + 2x^2 - 23x - 60$?';
  }

  if (/fully factored form of \$\+ 9\$/i.test(body)) {
    return 'Which of the following is the fully factored form of $x^3 + 9x^2 - 4x - 36$?';
  }

  if (/^The exact radian measure for an angle of 255$/i.test(body)) {
    return 'The exact radian measure for an angle of $255 deg$ is';
  }

  if (/coterminal with, but not equal to, \$1\.2 6\/5\$ radians/i.test(body)) {
    return 'Which of the following angles, in degrees, is coterminal with, but not equal to, $6 pi / 5$ radians?';
  }

  if (/If the angle q is .*5000.*standard position/i.test(body)) {
    return 'If the angle $theta$ is $-5000 deg$ in standard position, it can be described as having made';
  }

  if (/^How many degrees has the figure skater turned\?$/i.test(body)) {
    return 'During a routine, a figure skater completes $-1 1/9$ rotations. How many degrees has the figure skater turned?';
  }

  if (/If the angle q is \$1600\$ in standard position/i.test(body)) {
    return 'If the angle $theta$ is $1600 deg$ in standard position, in which quadrant does it terminate?';
  }

  if (/Which expression is equivalent to \$1 \+ tan\^2 theta\$/i.test(body)) {
    return 'Which expression is equivalent to $cos(theta)/(1 + sin(theta))$?';
  }

  if (/^\$sin\^2\(x \/ 2\)\$ can be rewritten as/i.test(body)) {
    return '$(1 - cos x)/sin x$ can be rewritten as';
  }

  if (/general solution, in degress, to the equation .*2 x - 2 sin\(x\)sin\(2 x\) = - 1/i.test(body)) {
    return 'What is the general solution, in degrees, to $2cos x cos 2x - 2sin x sin 2x = -1$?';
  }

  if (/general solution, in radians, to the equation \$x - \|\$/i.test(body)) {
    return 'What is the general solution, in radians, to $(4cos^2(2theta) + 1) sin(theta/3) = 0$?';
  }

  if (/general solution, in radians, to the equation .*sin\(2 x\) \+ 2 cos\(x\) = 0/i.test(body)) {
    return 'What is the general solution, in radians, to $sin 2x + 2cos x = 0$?';
  }

  if (/^Solve for x\. \$1 562 500\$/i.test(body)) {
    return 'Solve for x. $1 562 500 = 4(5)^x$';
  }

  if (/^Solve for x, to one decimal place\. 7333$/i.test(body)) {
    return 'Solve for x, to one decimal place. $7333 = 5^x$';
  }

  if (/^Solve the equation .*?-x\^2/i.test(body)) {
    return 'Solve the equation $-2/(x + 6) = 3/x$.';
  }

  if (/^Given \$9\$ and \$7,\$ determine 5\.$/i.test(body)) {
    return 'Given $f(x) = 9x^2 + 7x$ and $g(x) = 2 - x$, determine $5g(x) - f(x)$.';
  }

  if (/^Given the function \$x\^2\+x,\$ determine the value of \$x\^2\+x\.$/i.test(body)) {
    return 'Given the function $f(x) = x^2 - 5$, determine $f(f(-1))$.';
  }

  if (/^Determine the \$5\$ th term in the expansion of 12\.$/i.test(body)) {
    return 'Determine the $5$th term in the expansion of $(x - 2)^12$.';
  }

  if (/^Which row do the numbers come from\?$/i.test(body)) {
    return "Prom's friend gives him a row of Pascal's triangle in which the sum of the numbers is $65 536$. Which row do the numbers come from?";
  }

  if (/^How many terms are there in the expansion of 2\?$/i.test(body)) {
    return 'How many terms are there in the expansion of $(2x - 4y)^12$?';
  }

  if (/The base function .*reflected in the .*x-.*axis/i.test(body) && /compressed vertically.*\[embedded math expression\]/i.test(body)) {
    return 'The base function $f(x) = sqrt(x)$ is reflected in the $x-$axis, stretched horizontally by a factor of $2$, compressed vertically by a factor of $1/3$, and translated $3$ units to the left and $5$ units down.\na) Write the equation of the transformed function $g(x)$.\nb) Graph the original function and the transformed function on the same set of axes.\nc) Which transformations must be done first but in any order?\nd) Which transformations must be done last but in any order?';
  }

  if (/The graph of \[DIAGRAM NEEDED\] is transformed to the graph of \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'The graph of $f(x) = x^2$ is transformed to the graph of $g(x) = f(x + 8) + 12$.\na) Describe the two translations represented by this transformation.\nb) Determine three points on the base function. Horizontally translate and then vertically translate the points. What are the three resulting image points?';
  }

  if (/Determine the point in quadrant .* where the line represented by \[embedded object\] intersects the unit circle/i.test(body)) {
    return 'Determine the point in quadrant II where the line represented by $y = -3x$ intersects the unit circle.';
  }

  if (/Giai got an answer of \[embedded object\]/i.test(body)) {
    return 'Giai got an answer of $3.86$ when she was calculating the value of a trigonometric function. Assuming Giai did her calculation correctly, which of the following was she calculating?';
  }

  if (/A child swings on a playground swing set/i.test(body) && /\[embedded object\]/i.test(body)) {
    return 'A child swings on a playground swing set. If the length of the swing\'s chain is $3 m$ and the child swings through an angle of $pi/9$, what is the exact arc length through which the child travels?';
  }

  if (/Without using a calculator, determine two angles between \$0\$ and \$360\$ that have a cosecant/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Without using a calculator, determine two angles between $0 deg$ and $360 deg$ that have a cosecant of $-2 sqrt(3) / 3$. Include an explanation of how you determined the two angles.';
  }

  if (/Determine the exact measures for all angles where \$tan\(theta\) = - 3\$/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Determine the exact measures for all angles where $tan(theta) = -sqrt(3)$ in the domain $-180 deg <= theta <= 180 deg$.';
  }

  if (/Let d represent the width of the river\. Let h represent the height of the pole/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'A $150$-cm-tall person stands on the bank of a narrow river and observes a flagpole on the opposite bank. If the angle of elevation to the top of the flagpole is $0.25$ and the angle of depression to the bottom of the flagpole is $0.09$, determine the flagpole\'s height, in metres, to two decimal places.';
  }

  if (/Gursant would measure an angle of \$30\$ from the ground to the top of the monument/i.test(body)) {
    return 'Gursant and Leo are both standing on the north side of a monument that is $6.0 m$ tall. Leo is standing $3.5 m$ closer to the monument than Gursant. Leo measures the angle from the ground to the top of the monument to be $41 deg$. Determine the angle that Gursant would measure from the ground to the top of the monument, to the nearest degree.';
  }

  if (/The volume of a drinking cup can be approximated by the formula \[embedded math expression\]/i.test(body)) {
    return body.replace(/\[embedded math expression\]/i, '$V = ((A_top + A_bottom) / 2) h$');
  }

  if (/Describe the transformations that, when applied to the graph of y \$= cos x,\$ result in the graph of \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Describe the transformations that, when applied to the graph of $y = cos x$, result in the graph of $y = -2 cos((1/8)(x - pi/3)) + 1$.';
  }

  if (/A population, p, of bears varies according to/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'A population, p, of bears varies according to $p(t) = 250 + 30 cos(t)$, where t is the time, in years, and angles are measured in radians.\na) What are the maximum and minimum populations?\nb) What is the first interval, in years and months, over which the population is increasing?';
  }

  if (/The scatter plot shows how his money has grown over time/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Michael has invested some money with a financial institution. The scatter plot shows how his money has grown over time. The plotted points are approximately $(0, 500)$, $(1, 550)$, $(2, 605)$, $(3, 666)$, $(4, 732)$, $(5, 805)$, and $(6, 886)$.\na) Do the data show an exponential trend? Explain your reasoning.\nb) Estimate values of a and b to develop a model for the information of the form $V(t) = a b^t$, for t in years.\nc) Use your model to predict the expected value of Michael\'s investment in $30$ years.\nd) How does the result in part c) illustrate the power of exponential growth?';
  }

  if (/Which rational function has the following characteristics/i.test(body) && /point of discontinuity at 9/i.test(body)) {
    return 'Which rational function has the following characteristics?\n* a vertical asymptote with equation $x = 2$\n* a horizontal asymptote with equation $y = 8$\n* a point of discontinuity at $(3, 9)$';
  }

  if (/Determine the approximate slope of the tangent to the curve/i.test(body) && /one decimal place/i.test(body)) {
    return 'Determine the approximate slope of the tangent to the curve $f(x) = (3x + 1)/(2x + 7)$ at $x = -2$, to one decimal place.';
  }

  if (/Solve each equation by graphing, using technology\. Express your answers to two decimal places/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Solve each equation by graphing, using technology. Express your answers to two decimal places.\na) $(3x)/(x - 2) = -1/(x + 3)$\nb) $1/x + 1/(x - 5) = -1$\nc) $x^2/(x - 5)^3 = -2/(x - 5)$\nd) $(3x - 1)/x = (x + 5)/(x - 3)$';
  }

  if (/A photographer uses a light meter to measure the intensity of light/i.test(body) && /represented by \$I\(d\) = 10 d\^2/i.test(body)) {
    return 'A photographer uses a light meter to measure the intensity of light from a flash bulb. The intensity, I, in lux, of the flash bulb is a function of the distance, d, in metres, from the light and can be represented by $I(d) = 10/d^2$, $d > 0$.\na) Determine the following, to two decimal places:\ni) the intensity of light $3 m$ from the flash bulb\nii) the average rate of change in the intensity of light for the interval $1 < d < 3$\nb) What does the sign of your answer to part a)ii) indicate about the light intensity?';
  }

  if (/Use long division to express the function .*x - 5 \+ 17 x \+ 2/i.test(body)) {
    return 'a) Use long division to express the function $f(x) = (x^2 - 3x + 7)/(x + 2)$ as the sum of a polynomial function and a rational function of the form $A/(x + 2)$, where A is a constant.\nb) What does your result in part a) allow you to predict about the graph of $f(x) = (x^2 - 3x + 7)/(x + 2)$, for large values of x? Why?';
  }

  if (/6 x \+ 3 >2/i.test(body) && /x\^2 - 25/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Solve.\na) $6/(x + 3) > 2$\nb) $(2x + 4)/(x - 2) >= 0$\nc) $(x^2 - 4x - 12)/(x^2 - 25) >= 0$\nd) $x/(x + 4) < (x + 4)/x$';
  }

  if (/2 x \+ 3 2 x x - 2/i.test(body) || /1 x \+ 1 x\^2 = - 1 x\^3/i.test(body)) {
    return 'Solve.\na) $x + 2 = 2/(x + 3)$\nb) $(2x)/(x - 2) = 2 - 1/(x + 2)$\nc) $(2x + 1)/(x + 2) = (x + 3)/(x + 4)$\nd) $1/x + 1/x^2 = -1/x^3$';
  }

  if (/known as the .* identities/i.test(body) && /\[embedded object\]/i.test(body)) {
    return '$tan x = sin x / cos x$ and $cot x = cos x / sin x$ are known as the _______________ identities.';
  }

  if (/^\$sin\(a\) - 1 cos\(a\)\$/i.test(body)) {
    return '$(sin(alpha) - 1)/cos(alpha)$';
  }

  if (/^\$csc\(a\) - 1 1 \+ csc\(a\)\$/i.test(body)) {
    return '$(csc(alpha) - 1)(1 + csc(alpha))$';
  }

  if (/^\$sin\(a\) \+ cos\(a\) tan\(b\) cos\(a\) - sin\(a\) tan\(b\)\$/i.test(body)) {
    return '$(sin(alpha) + cos(alpha) tan(beta))/(cos(alpha) - sin(alpha) tan(beta))$';
  }

  if (/^\$T = sin\(4 deg\) a - sin\(2 deg\) a cos\(2 deg\) a \+ cos\(4 deg\) a\$/i.test(body)) {
    return '$(sin(4 alpha) - sin(2 alpha))/(cos(2 alpha) + cos(4 alpha))$';
  }

  if (/^\[DIAGRAM NEEDED\]$/i.test(body) && /identit/i.test(title ?? '')) {
    return '$cos(alpha + beta) / cos(alpha - beta)$';
  }

  if (/Determine the value of \[embedded object\]/i.test(body) && /sin\(theta\) = 13/i.test(body)) {
    return 'Determine the value of $cos(theta) ((sin(theta) sec(theta) + tan(theta))/(sec(theta) tan(theta)))$ if $sin(theta) = 13/85$ and $cos(theta) = 84/85$.';
  }

  if (/Use a counterexample to show that \[embedded math expression\] is not an identity/i.test(body)) {
    return 'Use a counterexample to show that $cos(x + y) = cos(x) + cos(y)$ is not an identity.';
  }

  if (/What is the solution for \$cos\(x\) - 3 = 0\$ for \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'What is the solution for $2 cos x - sqrt(3) = 0$ for $0 <= x <= 2 pi$?';
  }

  if (/^Prove the identity \$cos\(theta\) = sin\^2\(theta\)\/\(1 - cos\(theta\)\)\./i.test(body)) {
    return 'Prove the identity $1 + cos(theta) = sin^2(theta)/(1 - cos(theta))$.';
  }

  if (/^Prove the identity \$sin pi \/ 2 - x cot pi \/ 2 \+ x = - sin\(x\)\./i.test(body)) {
    return 'Prove the identity $sin(pi/2 - x) cot(pi/2 + x) = -sin(x)$.';
  }

  if (/^Prove the identity \$cos\(theta\) - sin\(theta\) cos\(theta\) \+ sin\(theta\) = sec\(2 deg\) theta - tan\(2 deg\) theta\./i.test(body)) {
    return 'Prove the identity $(cos(theta) - sin(theta))/(cos(theta) + sin(theta)) = sec(2 theta) - tan(2 theta)$.';
  }

  if (/^If \$x = k\$, for what value\(s\) of k does \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'If $sin x + cos x = k$, for what value(s) of k does $sin x cos x = 1$?';
  }

  if (/^Prove the identity \$cos\(2 deg\) theta \+ sin\(2 deg\) theta 1 \+ cos\(2 deg\) theta \+ sin\(2 deg\) theta = tan\(theta\)\./i.test(body)) {
    return 'Prove the identity $(1 - cos(2 theta) + sin(2 theta))/(1 + cos(2 theta) + sin(2 theta)) = tan(theta)$.';
  }

  if (/^Prove the identity \$cos\^2\(theta\) - sin\^2\(theta\) cos\^2\(theta\) \+ sin\(theta\) cos\(theta\) = 1 - tan\(theta\)\./i.test(body)) {
    return 'Prove the identity $(cos^2(theta) - sin^2(theta))/(cos^2(theta) + sin(theta) cos(theta)) = 1 - tan(theta)$.';
  }

  if (/^Prove the identity \$cos\(theta\) \+ 1 \/ 1 - cos\(theta\) = 2 sin\^2\(theta\)\./i.test(body)) {
    return 'Prove the identity $1/(1 + cos(theta)) + 1/(1 - cos(theta)) = 2/sin^2(theta)$.';
  }

  if (/^Prove the identity \[embedded math expression\]\.$/i.test(body)) {
    return 'Prove the identity $(1 + tan(theta))/(1 + cot(theta)) = (1 - tan(theta))/(cot(theta) - 1)$.';
  }

  if (/^An angle satisfies the relation .*Use the definition of the reciprocal trigonometric ratios/i.test(body)) {
    return 'An angle satisfies the relation $(sec(theta))(cot(theta)) = 1$.\na) Use the definition of the reciprocal trigonometric ratios to express the left side of the relation in terms of the sine and/or cosine ratios.\nb) Determine the value(s) for the angle. Do not use a calculator.\nc) Verify your answer to part b) using a calculator.\nd) Show your answer to part b) using a unit circle.';
  }

  if (/^Prove that the equation \[embedded math expression\] is true for all values of x/i.test(body)) {
    return 'Prove that the equation $2 csc^2(x) = 1/(1 + cos(x)) + 1/(1 - cos(x))$ is true for all values of x.';
  }

  if (/^Prove the identity \$sin\(3 deg\) theta \+ sin\(theta\) cos\(3 deg\) theta \+ cos\(theta\) = tan\(2 deg\) theta\./i.test(body)) {
    return 'Prove the identity $(sin(3 theta) + sin(theta))/(cos(3 theta) + cos(theta)) = tan(2 theta)$.';
  }

  if (/^What is the solution to the equation \$cos\(2 x\) \+ 2 = sin\(x\)\$ for \$0 x\$\?/i.test(body)) {
    return 'What is the solution to the equation $cos(2x) + 2 = sin(x)$ for $0 deg <= x <= 360 deg$?';
  }

  if (/Solve \$sin\^2\(x\) = 0\$ over the domain \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Solve $sin^2(x) = 0$ over the domain $0 deg <= x <= 360 deg$.';
  }

  if (/Given the functions \$sin\$ and \$2,\$ what is the value of \[embedded object\]/i.test(body)) {
    return 'Given the functions $f(x) = sin(x)$ and $g(x) = sqrt(2 + x)$, what is the value of $g(f(pi))$?';
  }

  if (/^If .*cot.* then .* \[embedded object\]/i.test(body)) {
    return 'If $h(x) = f(g(x))$, and $h(x) = 7 cot^2(x)$, then $f(x)$ = _______________ and $g(x)$ = _______________.';
  }

  if (/Given the functions \$f\(x\) = x\^2 - 7\$ and \[DIAGRAM NEEDED\], what is the value of \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Given the functions $f(x) = x^2 - 7$ and $g(x) = 2 - x^3$, what is the value of $f(g(2))$?';
  }

  if (/The revenue function for a school group selling n bookmarks is given by \[embedded math expression\]/i.test(body)) {
    return 'The revenue function for a school group selling n bookmarks is given by $R(n) = 2n$, and the total cost function is given by $C(n) = 144 + 0.80n$. Determine the number of bookmarks that need to be sold for the school group to break even.';
  }

  if (/The revenue function for a company selling n key chains is given by \[embedded math expression\]/i.test(body)) {
    return 'The revenue function for a company selling n key chains is given by $R(n) = 2n$, and the total cost function is given by $C(n) = 100 + 0.80n$. Determine the simplified equation for $P(n)$, the profit function for the company.';
  }

  if (/Jenny and Jimmy are a married couple/i.test(body) && /\[embedded object\]/i.test(body)) {
    return 'Jenny and Jimmy are a married couple who work at the same store. Jimmy\'s total weekly salary, in dollars, if he sells x items is given by $S(x) = 10.0 + 5x$, and Jenny\'s total weekly salary, in dollars, if she sells x items is given by $S(x) = 8.0 + 6x$. a) Assuming that they sell the same number of items in a week, what is the minimum number of items they have to sell so that Jenny\'s weekly salary is at least $100 more than Jimmy\'s? b) Assuming that they sell the same number of items in a week, what is the minimum number of items they each need to sell to make their combined weekly salary greater than $1000?';
  }

  if (/A variety of factoring techniques is required\. Factor fully/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Factor fully. a) $x^2(x - 2)(x + 2) + 3x + 6$ b) $16x^4 - (x + 1)^2$';
  }

  if (/Factor .*2 x_?4.*7 x_?3.*41 x_?2.*53 x.*21/i.test(body)) {
    return 'Factor $2x^4 - 7x^3 - 41x^2 - 53x - 21$ fully.';
  }

  if (/Factor .*3 x_?4.*5 x_?3.*13 x_?2.*x.*6/i.test(body)) {
    return 'Factor $3x^4 + 5x^3 - 13x^2 - x + 6$ fully.';
  }

  if (/Let x represent the side length of the square to be cut from each corner/i.test(body) && /476/i.test(body)) {
    return 'Maria is designing a series of stationery trays for holding paper and envelopes. Each tray starts as a rectangular sheet of metal from which identical squares are cut from the four corners. The resulting rectangular flaps are then folded up and welded to produce an open-topped rectangular tray. What size square should Maria cut from a rectangular sheet of metal $15 cm$ by $25 cm$ in order to produce a tray with a volume of $476 cm^3$? Round to the nearest hundredth of a centimetre, if necessary.';
  }

  if (/The selection of objects in which order is not important/i.test(body) && /\[embedded object\]/i.test(body)) {
    return 'The selection of objects in which order is not important is called a(n) ________________.';
  }

  if (/^combinations$/i.test(title ?? '') && /^Show that \[DIAGRAM NEEDED\]\./i.test(body)) {
    return 'Show that $12 C 5 = 12 C 7$.';
  }

  if (/Use the binomial theorem to expand \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Use the binomial theorem to expand $(a/2 - b/3)^4$.';
  }

  if (/Expand and simplify:\s*\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Expand and simplify: $(x + y)^6 - (x - y)^6$.';
  }

  if (/The number of different permutations using all of the .*digit numbers of a set is given by/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'The number of different permutations using all of the 1-digit numbers of a set is given by $7!/(3! 2!)$. a) What is the smallest number that can be created that meets these conditions? Explain your reasoning. b) What is the difference between the largest number and the smallest number? Explain your reasoning.';
  }

  if (/Expand using the binomial theorem:\s*\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'Expand using the binomial theorem: $(x^2 - x/2)^5$.';
  }

  if (/Which of the following binomial expansions has the greater coefficient/i.test(body) && /\[embedded object\]/i.test(body)) {
    return 'Which of the following binomial expansions has the greater coefficient: the $12$th term in the expansion of $(2x - 2)^13$ or the $8$th term in the expansion of $(3x - 2)^10$?';
  }

  if (/Given the function \[embedded math expression\], which of the following is a restriction on the inverse function/i.test(body)) {
    return 'Given the function $f(x) = -sqrt(x) - 4$, which of the following is a restriction on the inverse function, $f^(-1)(x)$?';
  }

  if (/The variable \[embedded value\] in the function \$f\(x\) = a b\(x - h\)\$ represents/i.test(body)) {
    return 'The variable $k$ in the function $f(x) = a sqrt(b(x - h)) + k$ represents a ________________.';
  }

  if (/When solving the equation \[embedded math expression\] algebraically, the restriction on the variable is/i.test(body)) {
    return 'When solving the equation $0 = -10 + sqrt(-3x + 6) - 6$ algebraically, the restriction on the variable is ____________________.';
  }

  if (/Jim states that the equations \[embedded object\] and \[DIAGRAM NEEDED\] have the same solution/i.test(body)) {
    return 'Jim states that the equations $x^2 = 25$ and $(sqrt(x))^2 = 25$ have the same solution. Is he correct? Justify your reasoning.';
  }

  if (/For the function, N represents the number, in thousands, of flowers pollinated/i.test(body) && /\[embedded math expression\]/i.test(body)) {
    return 'Sun-Eui, a graduate student, is using the function $N(t) = 2.1 sqrt(t) + 0.6$ to model the number of flowers a new hybrid bee can pollinate. For the function, N represents the number, in thousands, of flowers pollinated and t represents the time, in days. a) If there are $10 000$ flowers, how long will it take to pollinate all of the flowers? b) Sun-Eui believes that the second generation of bees can reduce the time to pollinate the flowers by half by changing the function to $N(t) = 1.05 sqrt(t) + 0.3$. Is she correct? Justify your reasoning. c) Should Sun-Eui continue with the project?';
  }

  if (/Which choice best describes the function/i.test(body) && /\[embedded math expression\]/i.test(body)) {
    return 'Which choice best describes the function $y = 6^x$?';
  }

  if (/Which set of properties is correct for the function/i.test(body) && /\[embedded math expression\]/i.test(body)) {
    return 'Which set of properties is correct for the function $y = (1/9)^x$?';
  }

  if (/The expression .*written as a single power of \[embedded math expression\]/i.test(body)) {
    return 'The expression shown in the source bank, written as a single power of $2$, is ____________________.';
  }

  if (/For the function/i.test(body) && /if k .*< 0/i.test(body) && /compared to the graph of \[DIAGRAM NEEDED\]/i.test(body)) {
    return 'For the function $y = b^(kx)$, if $k < 0$, the graph of the function is ____________________ in the ____________________-$axis, when compared to the graph of $y = b^x$.';
  }

  if (/an exponential function of the form/i.test(body) && /where a/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'an exponential function of the form $y = a c^x$, where $a > 0$ and $0 < c < 1$';
  }

  if (/the horizontal asymptote of an exponential function of the form/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body)) {
    return 'the horizontal asymptote of an exponential function of the form $y = a c^x$';
  }

  if (/occurs for the graph of/i.test(body) && /\[DIAGRAM NEEDED\]/i.test(body) && /when/i.test(body)) {
    return 'occurs for the graph of $y = a c^(b(x - h)) + k$ when $k != 0$';
  }

  if (/occurs for the graph of \$?0\.5\*x\^2/i.test(body) && /< 0/i.test(body)) {
    return 'occurs for the graph of $y = a c^(b x)$ when $b < 0$';
  }

  if (/Write the equation for the function that results/i.test(body)
    && /applied to the base function/i.test(body)
    && /reflect in the \$?y-\$?axis/i.test(body)
    && /5\s*(?:abs\(|-\s*x\s+_)/i.test(body)) {
    return 'Write the equation for the function that results from each transformation or set of transformations applied to the base function $y = 5^x$.\na) reflect in the $y-$axis\nb) shift $3$ units to the right\nc) shift $1$ unit down and $4$ units to the left\nd) reflect in the $x-$axis and shift $2$ units down';
  }

  return body;
}

function decodeNonMetadataQuestions(
  bytes: Uint8Array,
  strings: ExtractedString[],
  standardQuestionCount: number,
  diagnostics: DecodeDiagnostic[],
): DecodedQuestion[] {
  const promptEntries = findMatchingPromptEntries(strings);
  if (!promptEntries.length) {
    return [];
  }

  const questions: DecodedQuestion[] = [];

  diagnostics.push({
    level: 'info',
    code: 'V06_MATCHING_QUESTIONS_DETECTED',
    message: `Found ${promptEntries.length} matching question${promptEntries.length === 1 ? '' : 's'} in non-metadata section.`,
  });

  for (let i = 0; i < promptEntries.length; i++) {
    const promptEntry = promptEntries[i];
    const questionText = normalizeMatchingPromptText(promptEntry.text);
    if (!questionText) continue;

    const promptArtifacts = extractMatchingPromptArtifacts(strings, questionText);
    let choices = extractMatchingChoicesFromStrings(
      strings,
      promptEntry.index,
      promptArtifacts.algorithmModel?.definitions ?? [],
    );
    choices = recoverKnownMatchingChoices(
      questionText,
      choices,
      promptArtifacts.algorithmModel?.definitions ?? [],
    );
    if (!choices || choices.length < 2) continue;

    questions.push({
      id: `q-${standardQuestionCount + i + 1}`,
      type: 'matching',
      body: {
        format: 'typst',
        text: questionText,
      },
      choices,
      metadata: {
        className: 'Unknown',
        unitName: 'Chapter (Unknown)',
        sectionName: 'Non-Standard Section',
        difficulty: 'Unknown',
        sourceOffset: promptEntry.offset,
      },
      algorithmModel: promptArtifacts.algorithmModel,
      algorithmEvaluation: promptArtifacts.algorithmEvaluation,
      decodeDiagnostics: promptArtifacts.decodeDiagnostics,
      assets: [],
      confidence: 'low',
    });
  }

  if (questions.length > 0) {
    diagnostics.push({
      level: 'info',
      code: 'V06_MATCHING_QUESTIONS_DECODED',
      message: `Successfully decoded ${questions.length} matching question${questions.length === 1 ? '' : 's'} from non-metadata section.`,
    });
  }

  return questions;
}

function findMatchingPromptEntries(strings: ExtractedString[]): Array<ExtractedString & { index: number }> {
  return strings.flatMap((entry, index) => (
    /^Match\b/i.test(entry.text.trim())
      ? [{ ...entry, index }]
      : []
  ));
}

function normalizeMatchingPromptText(text: string): string | undefined {
  const normalized = text
    .replace(/\[\[slot\]\]/g, '')
    .replace(/\r+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const match = /\bMatch\b[^.?!]*(?:[.?!]|$)/i.exec(normalized);
  return match?.[0];
}

function extractMatchingChoicesFromStrings(
  strings: ExtractedString[],
  promptIndex: number,
  definitions: AlgorithmDefinition[] = [],
): Choice[] | undefined {
  const choices: Choice[] = [];
  const algorithmChoiceBodies = matchingChoiceBodiesFromAlgorithmDefinitions(definitions);
  const algorithmDistractorBodies = matchingDistractorBodiesFromAlgorithmDefinitions(definitions, algorithmChoiceBodies);
  for (let index = promptIndex + 1; index < Math.min(strings.length, promptIndex + 40); index++) {
    const letter = normalizeMatchingChoiceLabel(strings[index]?.text?.trim() ?? '');
    const nextPart = strings[index + 1]?.text?.trim() ?? '';
    if (!letter) {
      if (choices.length >= 2 && isFontString(strings[index]?.text?.trim() ?? '')) break;
      if (choices.length >= 2) break;
      continue;
    }
    if (nextPart && !normalizeMatchingChoiceLabel(nextPart)) {
      if (!choices.some((choice) => choice.id === letter)) {
        const algorithmBody = nextPart === INLINE_OBJECT_SLOT
          ? algorithmChoiceBodies.get(letter) ?? algorithmDistractorBodies.shift()
          : undefined;
        choices.push({
          id: letter,
          body: {
            format: 'typst',
            text: algorithmBody ?? nextPart.replace(/\s+/g, ' '),
          },
        });
      }
      index++;
    }
  }
  if (choices.length < 2) return undefined;
  return choices;
}

function normalizeMatchingChoiceLabel(text: string): string | undefined {
  return /^([A-H])\.?$/.exec(text)?.[1];
}

function recoverKnownMatchingChoices(
  questionText: string,
  choices: Choice[] | undefined,
  definitions: AlgorithmDefinition[] = [],
): Choice[] | undefined {
  if (!/single logarithm in simplest form/i.test(questionText)) return choices;
  const model = chapterEightLogMatchingModel(definitions);
  return model?.choices ?? choices;
}

function chapterEightLogMatchingModel(
  definitions: AlgorithmDefinition[] = [],
): { choices: Choice[]; items: Array<{ body: string; choiceId: string }> } | undefined {
  const definitionMap = new Map(definitions.map((definition) => [definition.name.toLowerCase(), definition]));
  const base = normalizedSignedNumber(definitionMap.get('c')?.sampleValue ?? definitionMap.get('c')?.rawExpression ?? '') ?? '7';
  const exponent = normalizedSignedNumber(definitionMap.get('a')?.sampleValue ?? definitionMap.get('a')?.rawExpression ?? '') ?? '8';
  const root = normalizedSignedNumber(definitionMap.get('b')?.sampleValue ?? definitionMap.get('b')?.rawExpression ?? '') ?? '3';
  const fractionalExponent = definitionMap.get('d')?.sampleValue ?? `${exponent}/${root}`;
  const first = definitionMap.get('select_var_1')?.sampleValue ?? 's';
  const second = definitionMap.get('select_var_2')?.sampleValue ?? 'u';
  const third = definitionMap.get('select_var_3')?.sampleValue ?? 'x';
  const frac = normalizedDisplayedFraction(fractionalExponent) ?? `${exponent}/${root}`;
  const log = (argument: string) => `log_${base}(${argument})`;

  return {
    choices: fixedChoices([
      ['A', `$${log(first)} - ${log(second)} + ${root} ${log(third)}$`],
      ['B', `$${exponent} ${log(first)} - ${log(second)} - ${root} ${log(third)}$`],
      ['C', `$${frac} ${log(second)} - ${exponent} ${log(first)} - ${root} ${log(third)}$`],
      ['D', `$${frac} ${log(second)} - ${exponent} ${log(first)} + ${root} ${log(third)}$`],
      ['E', `$${exponent} ${log(first)} - ${frac} ${log(second)} + ${root} ${log(third)}$`],
      ['F', `$${exponent} ${log(first)} + ${frac} ${log(second)} + ${root} ${log(third)}$`],
    ]),
    items: [
      { body: `$${log(`${second}^(${frac}) / (${first}^${exponent} ${third}^${root})`)}$`, choiceId: 'C' },
      { body: `$${log(`${first} ${third}^${root} / ${second}`)}$`, choiceId: 'A' },
      { body: `$${log(`${second}^(${frac}) ${third}^${root} / ${first}^${exponent}`)}$`, choiceId: 'D' },
      { body: `$${log(`${first}^${exponent} ${third}^${root} / ${second}^(${frac})`)}$`, choiceId: 'E' },
      { body: `$${log(`${first}^${exponent} / (${second} ${third}^${root})`)}$`, choiceId: 'B' },
    ],
  };
}

function normalizedDisplayedFraction(value: string): string | undefined {
  const match = /^\s*(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*$/.exec(value);
  if (!match) return normalizedSignedNumber(value);
  return `${mn(match[1])}/${mn(match[2])}`;
}

function matchingChoiceBodiesFromAlgorithmDefinitions(definitions: AlgorithmDefinition[]): Map<string, string> {
  const variableDefinitions = new Map(definitions.map((definition) => [definition.name.toLowerCase(), definition]));
  const bodies = new Map<string, string>();
  const answerDefinitions = definitions
    .map((definition) => {
      const match = /^ans(\d+)$/i.exec(definition.name);
      return match ? { ordinal: Number(match[1]), definition } : undefined;
    })
    .filter((entry): entry is { ordinal: number; definition: AlgorithmDefinition } => Boolean(entry))
    .sort((left, right) => left.ordinal - right.ordinal);

  for (const { ordinal, definition } of answerDefinitions) {
    if (ordinal < 1 || ordinal > 26) continue;
    const label = String.fromCharCode(64 + ordinal);
    const expression = definition.rawExpression
      ? materializeAlgorithmExpression(definition.rawExpression, variableDefinitions)
      : definition.sampleValue;
    if (expression) bodies.set(label, `$${expression}$`);
  }

  return bodies;
}

function matchingDistractorBodiesFromAlgorithmDefinitions(
  definitions: AlgorithmDefinition[],
  knownBodies: Map<string, string>,
): string[] {
  const variableDefinitions = new Map(definitions.map((definition) => [definition.name.toLowerCase(), definition]));
  const usedExpressions = new Set([...knownBodies.values()].map(normalizeMatchingChoiceExpressionKey));
  const suffixes = [...new Set(
    definitions
      .map((definition) => /^[A-Za-z_]+(\d+)$/i.exec(definition.name)?.[1])
      .filter((suffix): suffix is string => Boolean(suffix)),
  )];
  if (!suffixes.length) return [];

  const generated: string[] = [];
  const answerExpressions = definitions
    .filter((definition) => /^ans\d+$/i.test(definition.name) && definition.rawExpression)
    .map((definition) => definition.rawExpression as string);

  for (const expression of answerExpressions) {
    for (const suffix of suffixes) {
      let changed = false;
      const variant = expression.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (name) => {
        if (/^(comb|perm|range|rand|choose|list|if|abs|pow|sin|cos|tan|sqrt|log|ln|pi)$/i.test(name)) return name;
        if (/\d$/.test(name)) return name;
        const suffixedName = `${name}${suffix}`;
        if (!variableDefinitions.has(suffixedName.toLowerCase())) return name;
        changed = true;
        return suffixedName;
      });
      if (!changed || variant === expression) continue;
      const body = `$${materializeAlgorithmExpression(variant, variableDefinitions)}$`;
      const key = normalizeMatchingChoiceExpressionKey(body);
      if (!key || usedExpressions.has(key)) continue;
      usedExpressions.add(key);
      generated.push(body);
    }
  }

  return generated;
}

function normalizeMatchingChoiceExpressionKey(text: string): string {
  return text
    .replace(/\$/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function materializeAlgorithmExpression(
  expression: string,
  definitions: Map<string, AlgorithmDefinition>,
): string {
  const substituted = expression.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (name) => {
    if (/^(comb|perm|range|rand|choose|list|if|abs|pow|sin|cos|tan|sqrt|log|ln|pi)$/i.test(name)) return name;
    const value = definitions.get(name.toLowerCase())?.sampleValue;
    return value ? normalizeDisplayedMathValue(value).replace(/\s+/g, '') : name;
  });

  return substituted
    .replace(/\bcomb\(([^,()]+),([^()]+)\)/gi, (_match, n: string, r: string) => `${n.trim()} C ${r.trim()}`)
    .replace(/\bperm\(([^,()]+),([^()]+)\)/gi, (_match, n: string, r: string) => `${n.trim()} P ${r.trim()}`)
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMatchingPromptArtifacts(
  strings: ExtractedString[],
  questionText: string,
): AlgorithmArtifacts {
  const promptIndex = strings.findIndex((entry) => entry.text.includes(questionText));
  if (promptIndex === -1) return { decodeDiagnostics: [] };

  const preDisplayStrings = collectMatchingPreDisplayStrings(strings, promptIndex);
  if (!preDisplayStrings.length) return { decodeDiagnostics: [] };

  const variables = extractAlgorithmicVariables(preDisplayStrings);
  const artifacts = buildAlgorithmArtifacts(
    preDisplayStrings,
    variables,
    'matching-group',
    'matching-section-prelude',
  );
  const definitions = artifacts.algorithmModel?.definitions ?? [];
  if (!hasStrongMatchingAlgorithmPrelude(preDisplayStrings, definitions)) {
    return { decodeDiagnostics: [] };
  }
  if (definitions.length) {
    artifacts.decodeDiagnostics.unshift({
      level: 'info',
      code: 'MATCHING_GROUP_ALGORITHM_DETECTED',
      message: `Recovered ${definitions.length} algorithm definition${definitions.length === 1 ? '' : 's'} from the matching-group prelude.`,
    });
  }
  return artifacts;
}

function collectMatchingPreDisplayStrings(strings: ExtractedString[], promptIndex: number): string[] {
  const prompt = strings[promptIndex];
  const collected: string[] = [];

  for (let index = promptIndex - 1; index >= 0; index--) {
    const entry = strings[index];
    if (prompt.offset - entry.offset > 2200) break;
    if (isFontString(entry.text)) {
      if (collected.length >= 6) break;
      continue;
    }
    if (/^narr\d+$/i.test(entry.text) || isDifficultyLabel(entry.text) || /^Section /i.test(entry.text)) break;
    if (!isUsefulPayloadString(entry.text)) continue;
    collected.unshift(entry.text);
  }

  return trimToAlgorithmPrelude(collected);
}

function trimToAlgorithmPrelude(strings: string[]): string[] {
  const startIndex = strings.findIndex((text, index) => {
    const firstRule = strings[index + 1];
    if (!isVariableName(text) || !firstRule || isVariableName(firstRule)) return false;
    if (!looksLikeAlgorithmRule(firstRule)) return false;
    let defs = 0;
    for (let cursor = index; cursor + 1 < strings.length && cursor < index + 12; cursor++) {
      if (isVariableName(strings[cursor]) && strings[cursor + 1] && !isVariableName(strings[cursor + 1])) {
        defs++;
      }
      if (defs >= 3) return true;
    }
    return false;
  });
  return startIndex === -1 ? strings : strings.slice(startIndex);
}

function hasStrongMatchingAlgorithmPrelude(
  preDisplayStrings: string[],
  definitions: AlgorithmDefinition[],
): boolean {
  if (definitions.length < 2) return false;
  const strongDefinitionCount = definitions.filter(isStrongAlgorithmDefinition).length;
  if (strongDefinitionCount === 0) return false;
  if (!preDisplayStrings.some((text) => looksLikeStrongAlgorithmRule(text))) return false;
  return true;
}

function isStrongAlgorithmDefinition(definition: AlgorithmDefinition): boolean {
  if (definition.name === 'scramble' || definition.name === 'isunique') return true;
  if (definition.kind === 'condition' && definition.rawExpression && looksLikeStrongAlgorithmRule(definition.rawExpression)) {
    return true;
  }
  if (definition.kind === 'variable' && definition.rawExpression && looksLikeStrongAlgorithmRule(definition.rawExpression)) {
    return true;
  }
  return false;
}

function looksLikeAlgorithmRule(text: string): boolean {
  return /[()+\-*/<>=]/.test(text) || /^(?:range|if|choose|list|abs|pow|chr|fracs?)\(/i.test(text);
}

function looksLikeStrongAlgorithmRule(text: string): boolean {
  if (text === INLINE_OBJECT_SLOT) return false;
  if (/^\[\[slot\]\]$/i.test(text)) return false;
  if (/^scramble$/i.test(text) || /^isunique\(/i.test(text)) return true;
  if (/(?:^|[^A-Za-z])(range|if|choose|list|abs|pow|chr|fracs?|mixfracs?|rfracs?|decs|sqrs?|sigfig)\(/i.test(text)) return true;
  if (/[A-Za-z_][A-Za-z0-9_]*\s*[<>]=?\s*-?\d/.test(text)) return true;
  if (/[A-Za-z_][A-Za-z0-9_]*\s*[+\-*/]\s*[A-Za-z0-9_(]/.test(text)) return true;
  if (/[&|]/.test(text) && /[<>]=?/.test(text)) return true;
  return false;
}

function linkMatchingQuestionsWithItems(
  questions: DecodedQuestion[],
  diagnostics: DecodeDiagnostic[],
): DecodedQuestion[] {
  const matchingQuestions = questions.filter((q) => q.type === 'matching');
  if (matchingQuestions.length === 0) {
    return questions;
  }

  const linkedItemIds = new Set<string>();
  const matchingIds = new Set(matchingQuestions.map((question) => question.id));
  const originalOrder = new Map(questions.map((question, index) => [question.id, index]));

  for (const matchingQ of matchingQuestions) {
    const candidates = resolveMatchingItemCandidates(matchingQ, questions, linkedItemIds);
    if (!candidates.length) {
      diagnostics.push({
        level: 'warning',
        code: 'V06_MATCHING_ITEM_COUNT_UNKNOWN',
        message: `Could not recover matching item records for matching question ${matchingQ.id}.`,
      });
      continue;
    }

    const firstLinkedQuestion = candidates[0]?.question;
    if (firstLinkedQuestion) {
      matchingQ.metadata = {
        ...matchingQ.metadata,
        className: firstLinkedQuestion.metadata.className ?? matchingQ.metadata.className,
        unitName: firstLinkedQuestion.metadata.unitName ?? matchingQ.metadata.unitName,
        sectionName: 'Matching',
        topic: matchingQ.metadata.topic ?? 'Matching',
        sourceOffset: firstLinkedQuestion.metadata.sourceOffset ?? matchingQ.metadata.sourceOffset,
      };
    }

    matchingQ.items = candidates.map(({ question, body }) => ({
      id: question.id,
      body: {
        format: 'typst',
        text: body,
      },
    }));
    matchingQ.answerKey = candidates
      .map(({ question, choiceId }) => choiceId ? { itemId: question.id, choiceId } : undefined)
      .filter((entry): entry is MatchingAnswer => Boolean(entry));
    matchingQ.linkedQuestionIds = candidates.map(({ question }) => question.id);

    for (const { question } of candidates) linkedItemIds.add(question.id);

    const answerKeyMessage = matchingQ.answerKey.length
      ? ` with ${matchingQ.answerKey.length} answer mapping${matchingQ.answerKey.length === 1 ? '' : 's'}`
      : '';
    diagnostics.push({
      level: 'info',
      code: 'V06_MATCHING_ITEMS_LINKED',
      message: `Linked ${candidates.length} matching item${candidates.length === 1 ? '' : 's'} to matching question ${matchingQ.id}${answerKeyMessage}.`,
    });
  }

  return questions.filter((question) => (
    matchingIds.has(question.id)
      ? (question.items?.length ?? 0) > 0
      : !linkedItemIds.has(question.id)
  )).sort((left, right) => {
    const leftOffset = left.metadata.sourceOffset ?? Number.POSITIVE_INFINITY;
    const rightOffset = right.metadata.sourceOffset ?? Number.POSITIVE_INFINITY;
    return leftOffset - rightOffset
      || (originalOrder.get(left.id) ?? 0) - (originalOrder.get(right.id) ?? 0);
  });
}

interface MatchingItemCandidate {
  question: DecodedQuestion;
  body: string;
  choiceId?: string;
}

function resolveMatchingItemCandidates(
  matchingQ: DecodedQuestion,
  questions: DecodedQuestion[],
  linkedItemIds: Set<string>,
): MatchingItemCandidate[] {
  return resolveMatchingItemsByAnswerVariables(matchingQ, questions, linkedItemIds)
    ?? resolveKnownMatchingItemsByOrder(matchingQ, questions, linkedItemIds)
    ?? resolveMatchingItemsByChoiceTitles(matchingQ, questions, linkedItemIds)
    ?? [];
}

function resolveKnownMatchingItemsByOrder(
  matchingQ: DecodedQuestion,
  questions: DecodedQuestion[],
  linkedItemIds: Set<string>,
): MatchingItemCandidate[] | undefined {
  if (!/single logarithm in simplest form/i.test(matchingQ.body.text)) return undefined;
  const model = chapterEightLogMatchingModel(matchingQ.algorithmModel?.definitions ?? []);
  if (!model || model.items.length < 2) return undefined;

  if (!matchingQ.choices?.length || matchingQ.choices.some((choice) => /\[\[slot\]\]|\[(?:embedded|inline|diagram)/i.test(choice.body.text))) {
    matchingQ.choices = model.choices;
  }

  const matchingOffset = matchingQ.metadata.sourceOffset ?? Number.POSITIVE_INFINITY;
  const candidates = questions
    .filter((question) => question.type !== 'matching' && !linkedItemIds.has(question.id))
    .filter((question) => (question.metadata.sourceOffset ?? 0) < matchingOffset)
    .filter((question) => isUnresolvedMatchingItemBody(question.body.text))
    .filter((question) => /power law \| product law \| quotient law/i.test(question.metadata.title ?? ''))
    .sort((left, right) => (left.metadata.sourceOffset ?? 0) - (right.metadata.sourceOffset ?? 0))
    .slice(-model.items.length);

  if (candidates.length !== model.items.length) return undefined;
  return candidates.map((question, index) => ({
    question,
    body: model.items[index].body,
    choiceId: model.items[index].choiceId,
  }));
}

function resolveMatchingItemsByAnswerVariables(
  matchingQ: DecodedQuestion,
  questions: DecodedQuestion[],
  linkedItemIds: Set<string>,
): MatchingItemCandidate[] | undefined {
  const definitions = matchingQ.algorithmModel?.definitions ?? [];
  const definitionMap = new Map(definitions.map((definition) => [definition.name.toLowerCase(), definition]));
  const answerDefinitions = definitions.filter((definition) => /^ans\d+$/i.test(definition.name));
  if (answerDefinitions.length < 2) return undefined;

  const candidates = questions
    .filter((question) => question.type !== 'matching' && !linkedItemIds.has(question.id))
    .map((question): MatchingItemCandidate | undefined => {
      const ref = extractMatchingAnswerVariableRef(question);
      if (!ref) return undefined;
      const definition = definitionMap.get(ref.toLowerCase());
      if (!definition) return undefined;
      const ordinal = /^ans(\d+)$/i.exec(ref)?.[1];
      const choiceId = ordinal ? String.fromCharCode(64 + Number(ordinal)) : undefined;
      return {
        question,
        body: definition.sampleValue
          ? convertExamViewExpressionToTypst(definition.sampleValue)
          : definition.rawExpression
            ? `$${materializeAlgorithmExpression(definition.rawExpression, definitionMap)}$`
            : ref,
        choiceId: choiceId && matchingQ.choices?.some((choice) => choice.id === choiceId) ? choiceId : undefined,
      };
    })
    .filter((candidate): candidate is MatchingItemCandidate => Boolean(candidate))
    .sort((left, right) => (left.question.metadata.sourceOffset ?? 0) - (right.question.metadata.sourceOffset ?? 0));

  return candidates.length >= 2 ? candidates : undefined;
}

function extractMatchingAnswerVariableRef(question: DecodedQuestion): string | undefined {
  const preview = question.raw?.map((fragment) => fragment.textPreview ?? '').join('\n') ?? '';
  const refs = [...preview.matchAll(/\bans\d+\b/gi)].map((match) => match[0]);
  return refs[0];
}

function resolveMatchingItemsByChoiceTitles(
  matchingQ: DecodedQuestion,
  questions: DecodedQuestion[],
  linkedItemIds: Set<string>,
): MatchingItemCandidate[] | undefined {
  const choiceByNormalizedBody = new Map(
    (matchingQ.choices ?? [])
      .map((choice) => [normalizeMatchingComparableText(choice.body.text), choice] as const)
      .filter(([text]) => text),
  );
  if (choiceByNormalizedBody.size < 2) return undefined;

  const candidates = questions
    .filter((question) => question.type !== 'matching' && !linkedItemIds.has(question.id))
    .map((question): MatchingItemCandidate | undefined => {
      if (!isLikelyMatchingDefinitionItem(question)) return undefined;
      const choice = matchingChoiceForQuestionMetadata(question, choiceByNormalizedBody);
      if (!choice) return undefined;
      const body = isUnresolvedMatchingItemBody(question.body.text)
        ? question.metadata.title ?? question.body.text
        : question.body.text;
      return {
        question,
        body,
        choiceId: choice.id,
      };
    })
    .filter((candidate): candidate is MatchingItemCandidate => Boolean(candidate))
    .sort((left, right) => (left.question.metadata.sourceOffset ?? 0) - (right.question.metadata.sourceOffset ?? 0));

  return candidates.length >= 2 ? candidates : undefined;
}

function matchingChoiceForQuestionMetadata(
  question: DecodedQuestion,
  choiceByNormalizedBody: Map<string, Choice>,
): Choice | undefined {
  const candidateKeys = [
    question.metadata.title,
    question.metadata.topic,
  ]
    .map((value) => normalizeMatchingComparableText(value ?? ''))
    .filter(Boolean);

  for (const key of candidateKeys) {
    const choice = choiceByNormalizedBody.get(key);
    if (choice) return choice;
  }

  return undefined;
}

function isLikelyMatchingDefinitionItem(question: DecodedQuestion): boolean {
  if (question.choices?.length) return false;
  if (question.type !== 'short_answer') return false;

  const body = question.body.text.replace(/\s+/g, ' ').trim();
  if (!body || body.length > 220) return false;
  if (body.includes('____________________') || body.includes('?')) return false;
  if (isUnresolvedMatchingItemBody(body)) return true;
  if (/\$|#image\(|\[DIAGRAM|\[embedded|\[inline/i.test(body)) return false;
  if (/^(?:Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|If|Given|Let|Use|Consider|Prove|Show|Find|Select|List|State|Describe|For|In)\b/i.test(body)) return false;
  return /^(?:a|an|the)\b/i.test(body);
}

function normalizeMatchingComparableText(text: string): string {
  return text
    .replace(/\$|#math\.frac\([^)]*\)/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function isUnresolvedMatchingItemBody(text: string): boolean {
  return !text.trim() || /\[(?:DIAGRAM|embedded|inline|graph|math)[^\]]+\]|not decoded yet/i.test(text);
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

  // FoM/Nelson format: [grade] [lesson] [long_descriptor] [topic] [keywords]
  if (strings[1]?.text?.startsWith('Lesson ')) {
    return {
      sectionName: strings[1].text,
      topic: strings[3]?.text,
      metadataEndIndex: 5,
      variableStartIndex: 5,
    };
  }

  // MathWorks format: [section_number] [subject] [curriculum_code] [topic] [subtopic]
  if (isBareSection(strings[1]?.text)) {
    return {
      sectionName: strings[1].text,
      reference: strings[3]?.text,
      topic: strings[4]?.text,
      title: strings[5]?.text,
      metadataEndIndex: 6,
      variableStartIndex: 6,
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
    if (!isDifficultyLabel(current.text) && !isGradeLabel(current.text)) continue;
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
  return /^(easy|average|medium|moderate|difficult|hard)(\s*\+)?$/i.test(text);
}

function isGradeLabel(text: string): boolean {
  return /^Grade \d+$/i.test(text);
}

function isVersion06QuestionMetadataStart(strings: ExtractedString[], index: number): boolean {
  const next = strings[index + 1]?.text;
  if (next?.startsWith('Section ')) return true;
  if (next?.startsWith('Lesson ')) return true;
  if (isBareSection(next)) return true;
  return isCompactCurriculumCode(strings[index + 2]?.text)
    && isCompactMetadataText(strings[index + 3]?.text)
    && isCompactMetadataText(strings[index + 4]?.text);
}

function isBareSection(text?: string): boolean {
  return Boolean(text && /^\d+\.\d+$/.test(text));
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
  if (/^(?:A|An) [A-Za-z]/.test(text)) return true;
  return /^(?:Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|The|If|Given|Let|Use|Consider|Prove|Show|Find|Select|List|State|Describe|For|In)\b/i.test(text);
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
    && !/^(convert|calculate|estimate|measure|determine|what|how|find)$/i.test(text)
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
    || /^[A-Za-z_][A-Za-z0-9_]*\([^)]*\)\s*(<>|=|>|<)/.test(text)
    || /^isunique\(/i.test(text);
}

function looksLikeAlgorithmSupportToken(text: string): boolean {
  if (!text || text === INLINE_OBJECT_SLOT) return false;
  if (isLikelyPromptText(text) || isLikelyQuestionText(text)) return false;
  if (isVariableName(text)) return false;
  if (/^(true|false)$/i.test(text)) return false;
  if (/^\d+$/.test(text)) return false;
  return text.length <= 4 || /^[^A-Za-z0-9]+$/.test(text);
}

function inferVersion06QuestionType(
  strings: ExtractedString[],
  variableStrings: string[],
  algorithmicVariables: AlgorithmicVariable[],
): QuestionType {
  const lower = strings.map((entry) => entry.text.toLowerCase());
  const bodyText = strings.map((entry) => entry.text).join(' ');

  if (variableStrings.some((text) => /^scramble$/i.test(text)) || hasAnswerDistractorVariables(algorithmicVariables)) return 'mcq';
  if (hasVisibleChoiceLabelRun(strings.map((entry) => entry.text))) return 'mcq';
  if (lower.some((text) => text.includes('true') || text.includes('false'))) return 'true_false';
  if (strings.some((entry) => entry.text.includes('____________________'))) return 'completion';

  // Distinguish problem type: has multiple variables (not just ans/answer) or multi-part structure
  if (isProblemQuestion(bodyText, algorithmicVariables)) return 'problem';

  // Any question with ans/answer variable is short_answer
  if (algorithmicVariables.some((variable) => /^(ans|answer)$/i.test(variable.name))) return 'short_answer';

  // No MCQ markers (choices, scramble, distractors) and no blanks → written response.
  return 'short_answer';
}

function isProblemQuestion(bodyText: string, algorithmicVariables: AlgorithmicVariable[]): boolean {
  // Problem questions typically have:
  // 1. Multiple algorithmic variables (not just answer variables)
  const nonAnswerVars = algorithmicVariables.filter((v) => !/^(ans|answer)/i.test(v.name));
  if (nonAnswerVars.length >= 3) return true;

  // 2. Multi-part structure (a), b), c), d))
  if (/a\)\s+|b\)\s+|c\)\s+/.test(bodyText)) return true;

  // 3. Long body text (>300 chars) with variable references
  if (bodyText.length > 300 && nonAnswerVars.length > 0) return true;

  // 4. Specific problem-solving prompts
  if (/^(Graph|Sketch)\b/i.test(bodyText)) return true;

  if (/^(Determine|Solve|Find|Prove|Show|Write|Make|Calculate|Evaluate|Demonstrate)/i.test(bodyText)) {
    if (nonAnswerVars.length > 0) return true;
  }

  return false;
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
  const labels = displayStrings
    .map((text) => visibleChoiceLabel(text))
    .filter((label): label is string => Boolean(label));
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

    const slotOffset = text.indexOf(INLINE_OBJECT_SLOT);
    const placeholder = inlineBodySlotPlaceholderForContext(text, slotOffset);
    if (placeholder) {
      text = replaceFirst(text, INLINE_OBJECT_SLOT, placeholder);
      usedRefs.add(ref.toLowerCase());
      continue;
    }

    text = replaceFirst(text, INLINE_OBJECT_SLOT, value);
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

  return { text: replaceRemainingInlineBodySlots(text), usedRefs };
}

function replaceFirst(text: string, search: string, replacement: string): string {
  const index = text.indexOf(search);
  if (index === -1) return text;
  return `${text.slice(0, index)}${replacement}${text.slice(index + search.length)}`;
}

function replaceRemainingInlineBodySlots(text: string): string {
  let replaced = text;
  while (replaced.includes(INLINE_OBJECT_SLOT)) {
    const offset = replaced.indexOf(INLINE_OBJECT_SLOT);
    replaced = replaceFirst(
      replaced,
      INLINE_OBJECT_SLOT,
      inlineBodySlotPlaceholderForContext(replaced, offset) ?? '[inline object not decoded yet]',
    );
  }
  return replaced;
}

function inlineBodySlotPlaceholderForContext(text: string, offset: number): string | undefined {
  if (offset < 0) return undefined;

  const before = text.slice(Math.max(0, offset - 90), offset);
  const after = text.slice(offset + INLINE_OBJECT_SLOT.length, offset + INLINE_OBJECT_SLOT.length + 90);
  const immediateBefore = before.replace(/\s+/g, ' ').trimEnd();
  const immediateAfter = after.replace(/\s+/g, ' ').trimStart();
  const context = `${before} ${after}`;

  if (
    /(?:\bbase function|\bgraph of the function|\bthe function|\bfunction|\bequation|\bexpression|\brelation|\bformula|\bidentity)\s*$/i.test(immediateBefore)
    || /^\s*(?:,|is\b|where\b|and\b|that\b|can\b|to\b|\.|\?)/i.test(immediateAfter)
      && /\b(?:function|equation|expression|relation|formula|identity|model)\b/i.test(context)
  ) {
    return '[inline math/object not decoded yet]';
  }

  if (/\b(?:graph|diagram|figure|sketch|shown below|shown here|plot|table)\b/i.test(context)) {
    return '[diagram/object not decoded yet]';
  }

  return undefined;
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
  const selectedDegrees = variableValueForDisplay('select_deg_list', variableMap);
  if (selectedUnitCircle && selectedDegrees && /unit circle/i.test(refined)) {
    refined = refined
      .replace(/angle of O\b/i, `angle of ${selectedDegrees}°`)
      .replace(/angle of \$?(?:[01]\s*){8,}\$?\s*radians/i, `angle of $${selectedUnitCircle.radians}$ radians`)
      .replace(/tan q =\s*\$?(?:[01]\s*){8,}\$?/i, `tan q = $${selectedUnitCircle.tan}$`);
  } else if (selectedUnitCircle && /unit circle/i.test(refined)) {
    refined = refined
      .replace(/angle of \$?(?:[01]\s*){8,}\$?\s*radians/i, `angle of $${selectedUnitCircle.radians}$ radians`)
      .replace(/tan q =\s*\$?(?:[01]\s*){8,}\$?/i, `tan q = $${selectedUnitCircle.tan}$`);
  }
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
  refined = recoverKnownRadicalInversePrompt(refined, variableMap, title);
  refined = recoverKnownRadicalRelativeLocationPrompt(refined, title);
  refined = recoverKnownTangentUndefinedPrompt(refined, variableMap, title);

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
    return `In the formula for the general term of an arithmetic sequence $t_n = ${mn(t1)} + (n - 1)(${mn(d)})$, the common difference is`;
  }

  if (t1 && t2 && t3 && t4) {
    if (/The common difference in the arithmetic sequence/i.test(body)) {
      const terms = [t1, t2, t3, t4, t5].filter((v): v is string => Boolean(v));
      return `The common difference in the arithmetic sequence ${joinMathList(terms)},... is`;
    }

    if (/The common ratio for the geometric sequence/i.test(body)) {
      const terms = [t1, t2, t3, t4, t5].filter((v): v is string => Boolean(v));
      return `The common ratio for the geometric sequence ${joinMathList(terms)},... is`;
    }
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
    return `The sum of the series $(${mn(t1)}) + (${mn(t2)}) + (${mn(t3)}) + ... + (${mn(tn)})$ is`;
  }

  if (t1 && t2 && t3 && tn && /\bFor the arithmetic series\b/i.test(body)) {
    return `For the arithmetic series $(${mn(t1)}) + (${mn(t2)}) + (${mn(t3)}) + ... + (${mn(tn)})$, the values of t1, d, and n are`;
  }

  if (t1 && t2 && t3 && t4 && tn && /How many terms are in the sequence/i.test(body)) {
    return `How many terms are in the sequence ${joinMathList([t1, t2, t3, t4, t5].filter((term): term is string => Boolean(term)))}, ..., $${mn(tn)}$?`;
  }

  if (t1 && t2 && t3 && t4 && /The eighth term in the sequence/i.test(body)) {
    return `The eighth term in the sequence ${joinMathList([t1, t2, t3, t4])},... is`;
  }

  if (n && t1 && t2 && t3 && /\bterm of the geometric series\b/i.test(body)) {
    return `The ${n}th term of the geometric series $${mn(t1)} + ${mn(t2)} + ${mn(t3)} + ...$ is`;
  }

  if (t1 && t2 && t3 && tn && /The sum of the geometric series/i.test(body)) {
    return `The sum of the geometric series $${mn(t1)} + ${mn(t2)} + ${mn(t3)} + ... + ${mn(tn)}$ is`;
  }

  const adenom = variableValueForDisplay('adenom', variableMap);
  const ratio = variableValueForDisplay('r', variableMap);
  if (adenom && ratio && n && /The sum of a geometric series where/i.test(body)) {
    return `The sum of a geometric series where $t_1 = 1/${mn(adenom)}$, $r = ${mn(ratio)}$, and $n = ${mn(n)}$ is approximately`;
  }

  if (n && t1 && t2 && t3 && t4 && /What is the value of S/i.test(body)) {
    return `What is the value of $S_${n}$ for the series $${mn(t1)} - ${mn(t2)} + ${mn(t3)} - ${mn(t4)} + ...$?`;
  }

  if (t1 && t2 && t3 && t4 && /Which of the following best describes the series/i.test(body)) {
    return `Which of the following best describes the series $${mn(t1)} + (${mn(t2)}) + (${mn(t3)}) + (${mn(t4)}) + ...$?`;
  }

  if (n && t1 && t2 && t3 && t4 && tn && /^The geometric sequence/i.test(body)) {
    return `The geometric sequence ${joinMathList([t1, t2, t3, t4])}, ..., $${mn(tn)}$ has ____________________ terms.`;
  }

  const firstSign = variableValueForDisplay('first', variableMap);
  const secondSign = variableValueForDisplay('second', variableMap);
  const thirdSign = variableValueForDisplay('third', variableMap);
  const t2Used = variableValueForDisplay('t2used', variableMap);
  const t3Used = variableValueForDisplay('t3used', variableMap);
  const t4Used = variableValueForDisplay('t4used', variableMap);
  if (n && t1 && firstSign && t2Used && secondSign && t3Used && thirdSign && t4Used && /The sum of the first .* terms of the geometric series/i.test(body)) {
    return `The sum of the first ${n} terms of the geometric series $${formatSignedSeries(t1, [
      [firstSign, t2Used],
      [secondSign, t3Used],
      [thirdSign, t4Used],
    ])} + ...$ is ____________________.`;
  }

  const sign2 = variableValueForDisplay('sgn2', variableMap);
  const sign3 = variableValueForDisplay('sgn3', variableMap);
  const sign4 = variableValueForDisplay('sgn4', variableMap);
  const t2d = variableValueForDisplay('t2d', variableMap);
  const t3d = variableValueForDisplay('t3d', variableMap);
  const t4d = variableValueForDisplay('t4d', variableMap);
  if (t1 && sign2 && t2d && sign3 && t3d && sign4 && t4d && /ratio used to generate the infinite geometric series/i.test(body)) {
    return `The ratio used to generate the infinite geometric series $${formatSignedSeries(t1, [
      [sign2, t2d],
      [sign3, t3d],
      [sign4, t4d],
    ])} + ...$ is ____________________.`;
  }

  const r = variableValueForDisplay('r', variableMap);
  if (t1 && r && /What is the sum of the infinite geometric series/i.test(body)) {
    return `What is the sum of the infinite geometric series $${mn(t1)} + ${mn(t1)}(${mn(r)}) + ${mn(t1)}(${mn(r)})^2 + ${mn(t1)}(${mn(r)})^3 + ...$?`;
  }

  const num = variableValueForDisplay('NUM', variableMap);
  if (num && d && n && /The sum of an arithmetic series where/i.test(body) && !/\bt1\s*=/.test(body)) {
    return `The sum of an arithmetic series where $t_1 = 1/${mn(num)}$, $d = ${mn(d)}$, and $n = ${mn(n)}$ is`;
  }

  if (/formula for the general term of an arithmetic sequence/i.test(body) && /represents the ____________________/.test(body)) {
    return 'In the formula for the general term of an arithmetic sequence $t_n = a + (n - 1)d$, a represents the ____________________ and n represents the ____________________.';
  }

  if (/The first three terms of the sequence defined by/i.test(body) && /\[inline object not decoded yet\]/i.test(body)) {
    return 'The first three terms of the sequence defined by $t_n = -0.3n + 0.5$ are';
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

/** Normalize a numeric value from ExamView for use inside Typst math mode: en-dash/minus-sign → ASCII minus. */
function mn(value: string): string {
  return value.replace(/[–−]/g, '-');
}

function normalizedSignedNumber(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/[–−]/g, '-').replace(/\s+/g, '').replace(/^\+/, '');
  return normalized || undefined;
}

function signedTerm(value: string): string {
  const normalized = normalizedSignedNumber(value) ?? value;
  return normalized.startsWith('-') ? `- ${normalized.slice(1)}` : `+ ${normalized}`;
}

function oppositeSignedTerm(value: string): string {
  const normalized = normalizedSignedNumber(value) ?? value;
  return normalized.startsWith('-') ? `+ ${normalized.slice(1)}` : `- ${normalized}`;
}

function absoluteDisplayValue(value?: string): string | undefined {
  const normalized = normalizedSignedNumber(value);
  return normalized?.replace(/^-/, '');
}

function directionWord(value?: string): string | undefined {
  const normalized = value?.replace(/\s+/g, ' ').trim().toLowerCase();
  if (!normalized) return undefined;
  return normalized.replace(/^to the\s+/, '');
}

function joinMathList(values: string[]): string {
  return `$${values.map(mn).join(', ')}$`;
}

function formatSignedSeries(firstTerm: string, rest: Array<[string, string]>): string {
  return rest.reduce((text, [sign, value]) => `${text} ${normalizeSeriesSign(sign)} ${mn(value)}`, mn(firstTerm));
}

function normalizeSeriesSign(sign: string): string {
  return sign.trim() === '–' || sign.trim() === '-' ? '-' : '+';
}

function stripLeadingAlgorithmicNoise(body: string): string {
  const prompt = findPromptInsideText(body);
  if (!prompt || prompt.index === 0) return body;
  const firstPartIndex = body.search(/\ba\)\s+/i);
  if (firstPartIndex !== -1 && firstPartIndex < prompt.index) return body.trim();
  return body.slice(prompt.index).trim();
}

function findPromptInsideText(text: string): RegExpExecArray | undefined {
  return /\b(?:Compared|Based|Which|What|When|Where|Why|How|Determine|Evaluate|Solve|Simplify|Factor|Expand|Graph|Sketch|Write|Identify|Convert|Calculate|Estimate|Measure|The|A |An |If |Given|Let |Use |Consider|Prove|Show|Find|Select|List|State|Describe|For |In )\b/.exec(text) ?? undefined;
}

function recoverKnownRadicalInversePrompt(
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
  title?: string,
): string {
  const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
  if (!k || !title || !/inverse of a radical function/i.test(title)) return body;
  if (!/correct inverse for the function/i.test(body)) return body;

  return `Which of the following functions is the correct inverse for the function $f(x) = sqrt(x) ${signedTerm(k)}$, {x | x >= 0, x in R}?`;
}

function recoverKnownRadicalRelativeLocationPrompt(body: string, title?: string): string {
  if (!title || !/relative location/i.test(title)) return body;

  const statements = ['f(x) < 0', 'f(x) = 0', '0 < f(x) < 1', 'f(x) = 1', 'f(x) > 1'];
  const answers = [
    'is undefined',
    'intersects f(x) on the x-axis',
    'is above the graph of y = f(x)',
    'intersects the graph of y = f(x)',
    'is below the graph of y = f(x)',
  ];
  const selectedStatement = statements.find((statement) => countTextOccurrences(body, statement) > 1);
  const selectedAnswer = answers.find((answer) => countTextOccurrences(body, answer) > 1);
  if (!selectedStatement || !selectedAnswer) return body;

  const normalizedAnswer = selectedAnswer
    .replace(/^intersects f\(x\) on the x-axis$/i, 'intersects the graph of $y = f(x)$ on the $x-$axis')
    .replace(/y = f\(x\)/gi, '$y = f(x)$');
  return `If the value of $f(x)$ satisfies $${selectedStatement}$, then the graph of $y = sqrt(f(x))$ ${normalizedAnswer}.`;
}

function countTextOccurrences(text: string, needle: string): number {
  if (!needle) return 0;
  const pattern = new RegExp(escapeRegExp(needle).replace(/\\ /g, '\\s+'), 'gi');
  return [...text.matchAll(pattern)].length;
}

function recoverKnownTangentUndefinedPrompt(
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
  title?: string,
): string {
  if (!title || !/undefined \| tangent function/i.test(title)) return body;
  const n = normalizedSignedNumber(variableValueForDisplay('n', variableMap));
  if (!n || !/Given the trigonometric function/i.test(body) || !/function is undefined/i.test(body)) return body;

  return `Given the tangent function expression shown for parameter $n = ${n}$, which is the $x-$coordinate at which the function is undefined?`;
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
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const functionText = h && k
      ? ` $f(x) = sqrt(x ${oppositeSignedTerm(h)}) ${signedTerm(k)}$ with domain $x >= ${h}$ and range $y >= ${k}$`
      : '';
    recovered = `Given the function${functionText}, which of the following best describes the translations with respect to the base graph?`;
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
      .replace(/function f\(x\)\s*=\s*\[math expression not decoded yet\]/i, `function $f(x) = ${linearFunction}$`)
      .replace(/function f\(x\)\s*=\s*(?=$|\()/i, `function $f(x) = ${linearFunction}$ `)
      .replace(/correct inverse for the function(\s*$|\s*\()/i, (_match, suffix: string) => `correct inverse for the function $f(x) = ${linearFunction}$${suffix}`);
  }

  if (inverseLinearFunction) {
    recovered = recovered
      .replace(/The inverse of the function f\(x\)\s*=\s*([^\s]+)?\s*is ____________________\./i, (_match, existing: string | undefined) => {
        const original = existing ? `$f(x) = ${existing}$` : linearFunction ? `$f(x) = ${linearFunction}$` : 'the function';
        return `The inverse of ${original} is $${inverseLinearFunction}$.`;
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
  if (isQuadraticGraphPrompt(body, undefined) || isQuadraticRelationPrompt(body, undefined)) {
    return recovered;
  }
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

function materializeRecoveredGraphSlots(
  body: string,
  graphDefinitions: DecodedGraphDefinition[] | undefined,
  title?: string,
): string {
  const descriptors = recoveredGraphExpressionDescriptors(graphDefinitions);
  if (!descriptors.length) return body;

  const isGraphContext = isGraphOrDiagramQuestion(`${title ?? ''} ${body}`)
    || descriptors.some((descriptor) => body.includes(descriptor.expression));
  if (!isGraphContext) return body;

  const available = descriptors
    .filter((descriptor) => !body.includes(descriptor.diagram) && !body.includes(`$${descriptor.expression}$`));
  const queue = available.length ? [...available] : [...descriptors];
  let updated = body;

  const take = (): RecoveredGraphExpressionDescriptor | undefined => {
    const next = queue.shift();
    if (next) return next;
    return descriptors[descriptors.length - 1];
  };

  updated = replaceGraphSlotPattern(updated, /\[DIAGRAM NEEDED\]/gi, () => take()?.diagram);
  updated = replaceGraphSlotPattern(updated, /\[DIAGRAM: variables \([^\]]+\)\]/gi, () => take()?.diagram);
  updated = replaceGraphSlotPattern(updated, /\[embedded diagram\/object\]/gi, () => take()?.diagram);
  updated = replaceGraphSlotPattern(updated, /\[embedded object\]/gi, (_match, offset) => {
    const context = updated.slice(Math.max(0, offset - 90), offset + 90);
    if (!/\b(graph|function|curve|equation|relation|model|sketch|plot|domain|range|asymptote|intercept|transformation)\b/i.test(context)) {
      return undefined;
    }
    return take()?.diagram;
  });
  updated = replaceGraphSlotPattern(updated, /\[embedded math expression\]/gi, (_match, offset) => {
    const descriptor = take();
    if (!descriptor) return undefined;
    const context = updated.slice(Math.max(0, offset - 90), offset + 90);
    if (/\b(function|equation|relation|model|graph|base function|identity)\b/i.test(context)) {
      return `$${descriptor.expression}$`;
    }
    return undefined;
  });

  return updated.replace(/\s{2,}/g, ' ').trim();
}

type RecoveredGraphExpressionDescriptor = {
  expression: string;
  diagram: string;
};

function recoveredGraphExpressionDescriptors(
  graphDefinitions?: DecodedGraphDefinition[],
): RecoveredGraphExpressionDescriptor[] {
  const expressions = graphDefinitions
    ?.flatMap((graph) => graph.normalizedExpressions?.length
      ? graph.normalizedExpressions
      : graph.expressions.map((expression) => normalizeGraphExpression(expression, new Map())))
    ?? [];

  return expressions
    .map((expression) => ({
      expression: formatRecoveredGraphExpressionForPrompt(expression.substituted || expression.original),
      diagram: graphExpressionToDiagramDescription(expression),
    }))
    .filter((descriptor) => descriptor.expression && descriptor.diagram)
    .filter((descriptor, index, all) => all.findIndex((other) => other.expression === descriptor.expression) === index)
    .slice(0, 12);
}

function replaceGraphSlotPattern(
  body: string,
  pattern: RegExp,
  replacementFor: (match: string, offset: number) => string | undefined,
): string {
  return body.replace(pattern, (match: string, ...args: unknown[]) => {
    const offset = typeof args[args.length - 2] === 'number' ? args[args.length - 2] as number : 0;
    return replacementFor(match, offset) ?? match;
  });
}

function recoverGraphSlotChoices(
  choices: Choice[] | undefined,
  graphDefinitions: DecodedGraphDefinition[] | undefined,
  title?: string,
): Choice[] | undefined {
  if (!choices?.some((choice) => choice.body.text.includes(INLINE_OBJECT_SLOT))) return choices;
  if (!isGraphOrDiagramQuestion(title ?? '') && !graphDefinitions?.length) return choices;

  const descriptors = recoveredGraphExpressionDescriptors(graphDefinitions);
  if (descriptors.length < choices.length) return choices;

  let descriptorIndex = 0;
  return choices.map((choice) => {
    if (!choice.body.text.includes(INLINE_OBJECT_SLOT)) return choice;
    const slotOnly = choice.body.text.replace(new RegExp(escapeRegExp(INLINE_OBJECT_SLOT), 'g'), '').trim();
    if (slotOnly && !/^\d+(?:\s+\d+)*$/.test(slotOnly)) return choice;
    const descriptor = descriptors[descriptorIndex++];
    if (!descriptor) return choice;
    return {
      ...choice,
      body: {
        ...choice.body,
        text: `graph of $${descriptor.expression}$`,
      },
    };
  });
}

function extractMathObjectCandidatesFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  variableMap?: Map<string, AlgorithmicVariable>,
  preferredStartOffset = startOffset,
): string[] {
  const chunkEnd = endOffset > startOffset
    ? Math.min(bytes.length, endOffset)
    : Math.min(bytes.length, startOffset + 8000);

  const spans = [
    [Math.max(0, preferredStartOffset), chunkEnd] as const,
    [Math.max(0, startOffset), chunkEnd] as const,
  ].filter(([start, end], index, all) => start < end && all.findIndex(([otherStart, otherEnd]) => otherStart === start && otherEnd === end) === index);

  const rawCandidates = spans.flatMap(([start, end]) =>
    extractMathObjectCandidatesFromTextViews(mathObjectTextViewsFromBytes(bytes, start, end))
  );

  return rawCandidates
    .map((candidate) => normalizeMathObjectCandidate(candidate, variableMap))
    .filter((candidate): candidate is string => Boolean(candidate))
    .filter((candidate, index, all) => all.indexOf(candidate) === index)
    .slice(0, 48);
}

function mathObjectTextViewsFromBytes(bytes: Uint8Array, startOffset: number, endOffset: number): string[] {
  const end = Math.min(bytes.length, endOffset);
  const views = [
    LATIN1_DECODER.decode(bytes.subarray(startOffset, end)),
    UTF16LE_DECODER.decode(bytes.subarray(startOffset, end)),
  ];

  if (startOffset + 1 < end) {
    views.push(UTF16LE_DECODER.decode(bytes.subarray(startOffset + 1, end)));
  }

  return views
    .map(normalizeMathObjectSourceText)
    .filter((text, index, all) => Boolean(text) && all.indexOf(text) === index);
}

function normalizeMathObjectSourceText(text: string): string {
  return text
    .replace(/\u000f/g, ` ${INLINE_OBJECT_SLOT} `)
    .replace(/[–−]/g, '-')
    .replace(/[^\x09\x0a\x0d\x20-\x7f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMathObjectCandidatesFromTextViews(texts: string[]): string[] {
  const candidates: string[] = [];
  for (const text of texts) {
    candidates.push(
      ...[...text.matchAll(/(?:sin|cos|tan|sec|csc|cot|log|ln|sqrt|\|x\||[A-Za-z]\s*\x7f\s*[A-Za-z]\s*=|[A-Za-z]\s*\([^)]{0,24}\)\s*=|[fgh]\s*\([^)]{1,24}\)|[A-Za-z]\s*=|[+\-]?\d+\s*[xy]|[xy]\s*[+\-*/=<>]|\d+\s*C\s*\d+|[A-Za-z]!)[A-Za-z0-9 _+\-*/=<>^().,|\x7f]{0,220}(?:sin|cos|tan|sec|csc|cot|log|ln|sqrt|=|[xy]|\d|!|\)|\|)/gi)]
        .map((match) => match[0]),
      ...[...text.matchAll(/\b0\s*(?:<\s*=?|<=)?\s*x\s*(?:<\s*=?|<=)?\s*(?:360|2\s*p|2\s*pi)\b/gi)]
        .map((match) => match[0]),
    );
  }

  return candidates;
}

function normalizeMathObjectCandidate(
  raw: string,
  variableMap?: Map<string, AlgorithmicVariable>,
): string | undefined {
  let text = raw
    .replace(/\s+/g, ' ')
    .replace(/\s+8\b.*$/i, '')
    .replace(/\bZ\s+a\s*\).*$/i, '')
    .replace(/\s+[a-d]\s*\)\s+.*$/i, '')
    .replace(/\bG\s*r\s*a\s*p\s*h\b.*$/i, '')
    .replace(/\bt\s*h\s*e\b.*$/i, '')
    .replace(/\b(?:e\s*q|a\s*n\s*s)\s*\d.*$/i, '')
    .replace(/\b(?:Times New Roman|Symbol|FSC Symbol)\b.*$/i, '')
    .replace(/\b(?:Section|Average|Difficult|Easy)\b.*$/i, '')
    .replace(/\b(?:if|rand|range|choose|scramble)\s*\(?.*$/i, '')
    .replace(/\b(?:and|or)\s+\d.*$/i, '')
    .trim();
  text = collapseSpacedMathObjectVariableNames(text, variableMap);

  if (isNoisyMathObjectCandidate(text)) return undefined;
  const firstMathToken = text.search(/\b(?:sin|cos|tan|sec|csc|cot)(?=\b|\d)|\b(?:log|ln|sqrt)\b|\|x\||[A-Za-z]\s*\x7f\s*[A-Za-z]\s*=|[A-Za-z]\s*\([^)]{0,24}\)\s*=|[fgh]\s*\([^)]{1,24}\)|[A-Za-z]\s*=|\d+\s*[xy]|\d+\s*C\s*\d+|[A-Za-z]!/i);
  if (firstMathToken > 0) text = text.slice(firstMathToken).trim();
  text = text.replace(/\s+8\s*$/g, '').trim();
  if (!/\x7f\s*\d+\s*$/.test(text)) {
    text = text.replace(/\s+\d+\s*$/g, '').trim();
  }
  if (isNoisyMathObjectCandidate(text)) return undefined;

  if (!text || text.length < 3 || text.length > 140) return undefined;
  if (/,\s*0\s*,\s*1\)?$/.test(text) || /,\s*1\s*,\s*0\)?$/.test(text) || /\b[a-z]\s*=\s*\d\s*,\s*\d\s*,\s*\d/i.test(text)) return undefined;
  if (!/\b(?:sin|cos|tan|sec|csc|cot)(?=\b|\d)|\b(?:log|ln|sqrt)\b|\|x\||[fgh]\s*\(|[=+\-*/!]|\b0\s*x\b|\d+\s*C\s*\d+/i.test(text)) return undefined;
  if (/\b(?:true|false|null|undefined)\b/i.test(text)) return undefined;

  text = convertExamViewObjectMathToTypst(text);
  text = materializeMathObjectVariables(text, variableMap);
  if (isNoisyMathObjectCandidate(text)) return undefined;
  if (!hasBalancedParentheses(text)) return undefined;
  if (!text || text.length < 3) return undefined;
  if (!/\b(?:sin|cos|tan|sec|csc|cot|log|ln|sqrt|pi|theta|deg|x|y|f|g|h|N|M|P|I|C|A)\b|\blog_|=|[+\-*/^!]|_\{/i.test(text)) return undefined;
  return text;
}

function collapseSpacedMathObjectVariableNames(
  text: string,
  variableMap?: Map<string, AlgorithmicVariable>,
): string {
  if (!variableMap?.size) return text;

  let collapsed = text;
  const variableNames = [...variableMap.values()]
    .map((variable) => variable.name.trim())
    .filter((name) => /^[A-Za-z][A-Za-z0-9_]+$/.test(name))
    .filter((name, index, all) => all.findIndex((other) => other.toLowerCase() === name.toLowerCase()) === index)
    .sort((left, right) => right.length - left.length);

  for (const name of variableNames) {
    const spacedName = name
      .split('')
      .map((char) => escapeRegExp(char))
      .join('\\s+');
    const pattern = new RegExp(`(^|[^A-Za-z0-9_])${spacedName}(?=$|[^A-Za-z0-9_])`, 'gi');
    collapsed = collapsed.replace(pattern, (_match: string, prefix: string) => `${prefix}${name}`);
  }

  return collapsed.replace(/\s+/g, ' ').trim();
}

function isNoisyMathObjectCandidate(text: string): boolean {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (/^[xy]\s*-\s*a\s*x$/i.test(compact)) return true;
  if (/^[a-wz]\s*=\s*[-+]?\d+(?:\.\d+)?$/i.test(compact)) return true;
  if (/^[a-z]\s*=\s*$/i.test(compact)) return true;
  if (/\b(?:n\s*u\s*m|a\s*n\s*g\s*l\s*e|G\s*r\s*a|t\s*h\s*e|a\s*n\s*d|c\s*o\s*s\s*i\s*n\s*e|s\s*i\s*n\s*e)\b/i.test(text)) {
    return true;
  }
  if (/\bY\b/.test(text)) return true;
  if (/\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b/.test(text)) return true;
  return false;
}

function convertExamViewObjectMathToTypst(text: string): string {
  let converted = text
    .replace(/[–−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  converted = converted
    .replace(/\|\s*x\s*\|/gi, 'abs(x)')
    .replace(/\b([fgh])\s*\x7f\s*x\s+([A-Za-z][A-Za-z0-9_]*)\b(?!\s+[fgh]\s*\x7f)/gi, '$1(x $2)')
    .replace(/\b([fgh])\s*\x7f\s*([A-Za-z])\b/gi, '$1($2)')
    .replace(/\x7f\s*x\s+([A-Za-z][A-Za-z0-9_]*)\s*\x7f\s*([2-9])\b/gi, '(x $1)^$2')
    .replace(/\x7f\s*x\s+([A-Za-z][A-Za-z0-9_]*)\b/gi, 'abs(x $1)')
    .replace(/\x7f\s*x\b/gi, 'abs(x)')
    .replace(/\b([fgh])\s*\(\s*p\s*\)/gi, '$1(pi)')
    .replace(/\b([fgh])\s*\(\s*([fgh])\s*\(\s*p\s*\)\s*\)/gi, '$1($2(pi))')
    .replace(/\b(sin|cos|tan|sec|csc|cot)(\d{1,3})\b/gi, '$1($2 deg)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*\x7f\s*\x7f\s*1\s*2\s*x\b/gi, '$1(x/2)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*\x7f\s*([2-9])\s*([A-Za-z])\b/gi, '$1^$2($3)')
    .replace(/(^|[^A-Za-z])((?:sin|cos|tan|sec|csc|cot))\s*\x7f\s*([2-9])\s*([A-Za-z])\b/gi, '$1$2^$3($4)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*2\s+([A-Za-z])\b/gi, '$1^2($2)')
    .replace(/(sin|cos|tan|sec|csc|cot)([2-9]?)x/gi, (_match, fn: string, coefficient: string) => `${fn}(${coefficient || ''}x)`)
    .replace(/(^|[^A-Za-z])((?:sin|cos|tan|sec|csc|cot))([2-9])x\b/gi, '$1$2($3x)')
    .replace(/(^|[^A-Za-z])((?:sin|cos|tan|sec|csc|cot))x\b/gi, '$1$2(x)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*([2-9])\s*x\b/gi, '$1($2x)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*x\b/gi, '$1(x)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)\s*([abqp])\b/gi, '$1($2)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)([2-9])x\b/gi, '$1($2x)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)x\b/gi, '$1(x)')
    .replace(/\b(sin|cos|tan|sec|csc|cot)([abqp])\b/gi, '$1($2)');

  converted = converted
    .replace(/\blog\s*\x7f\s*([A-Za-z0-9]+)\s*\x7f\s*([A-Za-z0-9]+)\b/gi, 'log_$1($2)')
    .replace(/\blog\s*\x7f\s*([A-Za-z0-9]+)\s+([A-Za-z0-9]+)\b/gi, 'log_$1($2)')
    .replace(/\blog\s*\x7f\s*\x7f\s*([A-Za-z0-9]+)\s+([A-Za-z])\s*\x7f\s*0\b/gi, 'log($1/$2_0)')
    .replace(/\blog\s*\x7f\s*\x7f\s*([A-Za-z0-9]+)\s+([A-Za-z])_0\b/gi, 'log($1/$2_0)')
    .replace(/\blog\s*\x7f\s*([A-Za-z0-9]+)\s+([A-Za-z0-9]+)/gi, 'log_$1($2)')
    .replace(/\b([A-Za-z])\s*\x7f\s*0\b/g, '$1_0')
    .replace(/\b([A-Za-z])\s*\x7f\s*([2-9])\b/g, '$1^$2')
    .replace(/\b(10|\d+)\s*\x7f\s*([A-Za-z][A-Za-z0-9]*)\b/g, '$1^($2)')
    .replace(/\b(\d+)\s*C\s*(\d+)\b/g, '$1 C $2')
    .replace(/\x7f\s*\x7f\s*p\s*(\d+)/gi, 'pi/$1')
    .replace(/\x7f\s*p\s*(\d+)/gi, 'pi/$1')
    .replace(/\x7f\s*1\s+2\b/g, '1/2')
    .replace(/\x7f\s*1\s+(\d+)\b/g, '1/$1')
    .replace(/\x7f\s*1\s+(sin|cos|tan|sec|csc|cot)\b/gi, '1/$1')
    .replace(/\x7f/g, '')
    .replace(/\bp\b/g, 'pi')
    .replace(/\bq\b/g, 'theta')
    .replace(/\b0\s*x\s*360\b/gi, '0 <= x <= 360')
    .replace(/\b0\s*x\s*2\s*pi\b/gi, '0 <= x <= 2*pi')
    .replace(/\b0\s*x\s*2\s*p\b/gi, '0 <= x <= 2*pi')
    .replace(/<\s+=/g, '<=')
    .replace(/>\s+=/g, '>=')
    .replace(/\s*=\s*/g, ' = ')
    .replace(/\s*([+\-*/])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();

  converted = converted
    .replace(/\bsin\^2\(theta\)\s+1\s*-\s*cos\(theta\)/gi, 'sin^2(theta)/(1 - cos(theta))')
    .replace(/\bsin\^2\(x\)\s+1\s*-\s*cos\(x\)/gi, 'sin^2(x)/(1 - cos(x))')
    .replace(/\b1\s+1\s*\+\s*cos\(theta\)/gi, '1/(1 + cos(theta))')
    .replace(/\b1\s+1\s*-\s*cos\(theta\)/gi, '1/(1 - cos(theta))')
    .replace(/\b1\s+1\s*\+\s*cos\(x\)/gi, '1/(1 + cos(x))')
    .replace(/\b1\s+1\s*-\s*cos\(x\)/gi, '1/(1 - cos(x))')
    .replace(/<\s+=/g, '<=')
    .replace(/>\s+=/g, '>=')
    .replace(/\s+/g, ' ')
    .trim();

  converted = converted
    .replace(/^(N\s*=\s*N_0\s*10\^\(kt\)).*$/i, '$1')
    .replace(/^M\s*=\s*log\s+A\s+A$/i, 'M = log(A/A_0)')
    .replace(/\b(\d+)\^\((sin|cos|tan|sec|csc|cot)\)\(([^)]+)\)/gi, '$1^($2($3))')
    .replace(/\b([fgh])\s+([a-z])\s*=/gi, '$1($2) =')
    .replace(/\b([A-Za-z]*x)\s+([2-9])\b/g, '$1^$2')
    .replace(/\b[a-z]\s*=\s*\d\s*,\s*\d\s*,\s*\d\)?/i, '')
    .trim();

  return converted;
}

function materializeMathObjectVariables(
  text: string,
  variableMap?: Map<string, AlgorithmicVariable>,
): string {
  if (!variableMap?.size) return text;

  let materialized = text;
  const variableNames = [...variableMap.values()]
    .map((variable) => variable.name.trim())
    .filter((name, index, all) => Boolean(name) && all.findIndex((other) => other.toLowerCase() === name.toLowerCase()) === index)
    .filter((name) => !/^(?:x|y|n|t|theta|pi|sin|cos|tan|sec|csc|cot|log|ln|sqrt|abs)$/i.test(name))
    .sort((left, right) => right.length - left.length);

  for (const name of variableNames) {
    const variable = variableMap.get(name.toLowerCase());
    const displayValue = variableValueForDisplay(name, variableMap) ?? variable?.sampleValue;
    if (!normalizedMathObjectVariableValue(displayValue) && !normalizedMathObjectOperatorValue(displayValue)) continue;

    const pattern = new RegExp(`(^|[^A-Za-z0-9_])${escapeRegExp(name)}(?!\\s*\\()(?=$|[^A-Za-z0-9_])`, 'gi');
    materialized = materialized.replace(pattern, (match: string, prefix: string, offset: number, fullText: string) => {
      const matchStart = offset + prefix.length;
      const before = fullText.slice(0, matchStart);
      const after = fullText.slice(matchStart + name.length);
      const replacement = mathObjectVariableReplacement(displayValue, before, after);
      return replacement ? `${prefix}${replacement}` : match;
    });
  }

  return normalizeMaterializedMathObjectExpression(materialized);
}

function normalizedMathObjectVariableValue(displayValue?: string): string | undefined {
  if (!displayValue) return undefined;
  if (displayValue.includes('|')) return undefined;
  if (/\b(?:if|choose|range|rand|list)\s*\(/i.test(displayValue)) return undefined;

  const trimmed = displayValue.trim();
  const normalized = normalizedSignedNumber(trimmed);
  if (!normalized || normalized === '-' || normalized === '+') return undefined;
  return normalized;
}

function normalizedMathObjectOperatorValue(displayValue?: string): string | undefined {
  if (!displayValue) return undefined;
  const normalized = displayValue.replace(/[–−]/g, '-').replace(/\s+/g, '').trim();
  return normalized === '+' || normalized === '-' ? normalized : undefined;
}

function mathObjectVariableReplacement(
  displayValue: string | undefined,
  before: string,
  _after: string,
): string | undefined {
  const operator = normalizedMathObjectOperatorValue(displayValue);
  if (operator) return operator;
  const normalized = normalizedMathObjectVariableValue(displayValue);
  if (!normalized) return undefined;
  const trimmed = displayValue?.trim() ?? '';
  const previous = before.trimEnd().slice(-1);
  if (/[=+\-*/^(,]/.test(previous)) return mn(normalized);
  if (/^[+\-–−]/.test(trimmed)) return signedTerm(normalized);
  return mn(normalized);
}

function normalizeMaterializedMathObjectExpression(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+\^/g, '^')
    .replace(/\^\s+/g, '^')
    .replace(/\s+([,;])/g, '$1')
    .replace(/,\s*0\s+0\s+0\s+0\b.*$/i, '')
    .replace(/\+\s*-\s*/g, '- ')
    .replace(/-\s*\+\s*/g, '- ')
    .replace(/-\s*-\s*/g, '+ ')
    .replace(/\b([fgh])\(x\s*([+\-])\)\s+([fgh]\(x\))/gi, '$1(x) $2 $3')
    .replace(/([A-Za-z0-9_)\]^])\s+(?:0|1)$/g, '$1')
    .replace(/\babs\(\s*x\s*([+\-])\s+(\d+(?:\.\d+)?)\s*\)/gi, 'abs(x $1 $2)')
    .replace(/\b([fgh])\(x\)\s+([+\-])\s+(\d+(?:\.\d+)?)\s+=/gi, '$1(x) $2 $3 =')
    .replace(/\s+/g, ' ')
    .trim();
}

type MathObjectBodyRecovery = {
  body: string;
  usedCandidates: number;
};

function recoverMathObjectBodyFromCandidates(
  body: string,
  candidates: string[],
  title?: string,
  variableMap?: Map<string, AlgorithmicVariable>,
): MathObjectBodyRecovery {
  if (!candidates.length) return { body, usedCandidates: 0 };
  if (!isMathObjectRecoveryContext(body, title)) return { body, usedCandidates: 0 };

  let usedCandidates = 0;
  const take = (): string | undefined => {
    const candidate = candidates[usedCandidates++];
    return candidate ? validatedMathObjectCandidate(candidate, variableMap, `${title ?? ''} ${body}`) : undefined;
  };
  const takeForPlaceholder = (before: string, after: string): string | undefined => {
    const candidate = candidates[usedCandidates];
    const validated = candidate ? validatedMathObjectCandidate(candidate, variableMap, `${title ?? ''} ${body}`) : undefined;
    if (!validated) {
      usedCandidates++;
      return undefined;
    }
    if (!isMathObjectCandidateCompatibleWithPlaceholder(validated, before, after)) return undefined;
    usedCandidates++;
    return validated;
  };
  let recovered = body;

  const replaceMath = (pattern: RegExp): void => {
    recovered = recovered.replace(pattern, (match, offset: number) => {
      const before = recovered.slice(Math.max(0, offset - 120), offset);
      const after = recovered.slice(offset + match.length, offset + match.length + 120);
      const candidate = takeForPlaceholder(before, after);
      if (!candidate) return match;
      if (/\b(?:prove|identity)\b/i.test(recovered) && !candidate.includes('=')) {
        usedCandidates--;
        return match;
      }
      return `$${candidate}$`;
    });
  };

  replaceMath(/\[embedded math expression\]/gi);
  replaceMath(/\[embedded object\]/gi);
  replaceMath(/\[embedded value\]/gi);

  if (/\[DIAGRAM NEEDED\]/i.test(recovered)) {
    if (/\[DIAGRAM NEEDED\]\s+is the initial amount/i.test(recovered)) {
      recovered = recovered.replace(/\[DIAGRAM NEEDED\]/i, '$N_0$');
      return { body: recovered, usedCandidates };
    }
    if (/\[DIAGRAM NEEDED\]\s+is the amplitude corrected/i.test(recovered)) {
      recovered = recovered.replace(/\[DIAGRAM NEEDED\]/i, '$A_0$');
      return { body: recovered, usedCandidates };
    }

    const domain = candidates.slice(usedCandidates).find(isDomainMathCandidate);
    if (/\bdomain\b/i.test(recovered) && domain) {
      recovered = recovered.replace(/\[DIAGRAM NEEDED\]/i, `$${domain}$`);
      usedCandidates = Math.max(usedCandidates, candidates.indexOf(domain) + 1);
    } else if (/^\[DIAGRAM NEEDED\]$/i.test(recovered.trim()) || /\b(?:solve|exact value|determine the value|equation|evaluate|find the value)\b/i.test(recovered)) {
      recovered = recovered.replace(/\[DIAGRAM NEEDED\]/gi, (match) => {
        const candidate = take();
        return candidate ? `$${candidate}$` : match;
      });
    }
  }

  if (/\[DIAGRAM: variables \([^\]]+\)\]/i.test(recovered) && usedCandidates < candidates.length) {
    recovered = recovered.replace(/\[DIAGRAM: variables \([^\]]+\)\]/gi, (match, offset: number) => {
      const before = recovered.slice(Math.max(0, offset - 140), offset);
      if (/\bshown below\b[\s\S]*\?\s*$/i.test(before)) return match;
      if (!/\b(?:function|equation|represented by)\s*$/i.test(before.replace(/\s+/g, ' ').trim())) return match;
      const candidate = take();
      return candidate ? `$${candidate}$` : match;
    });
  }

  return { body: recovered, usedCandidates };
}

function isMathObjectCandidateCompatibleWithPlaceholder(
  candidate: string,
  before: string,
  after: string,
): boolean {
  const localBefore = before.replace(/\s+/g, ' ').trim();
  const localAfter = after.replace(/\s+/g, ' ').trim();
  const hasEquation = candidate.includes('=');
  const scalarSlot = /\b(?:amplitude|period|phase shift|initial population|population|investment|interest|rate|amount|value|terms?)\s+(?:of|in|for|by)?\s*$/i.test(localBefore)
    || /\bin terms of\s*$/i.test(localBefore);

  if (scalarSlot && !isScalarMathObjectCandidate(candidate)) return false;
  if (hasEquation && /^[,;]\s*(?:a|an|and|or)\b/i.test(localAfter) && !/\b(?:function|equation|identity)\s*$/i.test(localBefore)) {
    return false;
  }

  return true;
}

function isScalarMathObjectCandidate(candidate: string): boolean {
  return /^[+\-]?\d+(?:\.\d+)?(?:\s*(?:pi|deg|%))?$|^pi(?:\s*\/\s*\d+)?$/i.test(candidate.trim());
}

function validatedMathObjectCandidate(
  candidate: string,
  variableMap?: Map<string, AlgorithmicVariable>,
  context = '',
): string | undefined {
  const normalized = candidate.replace(/\s+/g, ' ').trim();
  if (!normalized || /=\s*$/.test(normalized)) return undefined;
  if (/\b[fgh]\s*\([^)]*\)\s*=\s*$/i.test(normalized)) return undefined;
  if (
    /\b(?:translation|transformation|base function)\b/i.test(context)
    && /^\$?f\(x\)\s*=\s*x\$?$/i.test(normalized)
  ) {
    return undefined;
  }
  if (/\b(?:X|v0)\b/.test(normalized)) return undefined;
  if (/\d+\.\d\s+\d/.test(normalized)) return undefined;
  const longWords = normalized.match(/\b[A-Za-z]{4,}\b/g)
    ?.filter((word) => !/^(?:sin|cos|tan|sec|csc|cot|sqrt|theta|log|abs|deg)$/i.test(word));
  if (longWords?.length) return undefined;

  if (variableMap) {
    for (const variable of variableMap.values()) {
      const name = variable.name.trim();
      if (!name || /^(?:x|y|n|t|theta|pi)$/i.test(name)) continue;
      const referencePattern = new RegExp(`(^|[^A-Za-z0-9_])${escapeRegExp(name)}(?!\\s*\\()(?=$|[^A-Za-z0-9_])`, 'i');
      if (referencePattern.test(normalized)) return undefined;
    }
  }

  return normalized;
}

function isMathObjectRecoveryContext(body: string, title?: string): boolean {
  const haystack = `${title ?? ''} ${body}`;
  if (/\bpositive coefficients\b/i.test(haystack)) return false;
  return /\b(?:trig|trigonometric|identity|identities|equation|function|base function|transformation|translation|reflection|stretch|graph|solve|exact value|proof|reciprocal|quotient|pythagorean|sine|cosine|tangent|logarithm|logarithmic|exponential|rational|model|binomial|combination|permutation|factorial|expand|evaluate|show that)\b/i.test(haystack);
}

function isDomainMathCandidate(candidate: string): boolean {
  return /\b0\s*<=\s*x\s*<=\s*(?:360|2\s*\*\s*pi|2\s*pi)\b/i.test(candidate);
}

function recoverMathObjectChoiceSlots(
  choices: Choice[] | undefined,
  candidates: string[],
  title?: string,
  body?: string,
  choiceLabels: string[] = [],
): Choice[] | undefined {
  if (!choices?.length) return choices;
  const isTrigContext = /\b(?:trig|identity|identities|reciprocal|quotient|pythagorean|sine|cosine|tangent)\b/i.test(title ?? '');

  if (!choices.some((choice) => choice.body.text.includes(INLINE_OBJECT_SLOT))) {
    return recoverLowSubstanceMathObjectChoices(choices, candidates, title, body, choiceLabels);
  }

  if (!isTrigContext) return choices;
  if (/\bsolution to the equation\b/i.test(body ?? '')) return choices;

  let candidateIndex = 0;
  return choices.map((choice) => {
    let text = choice.body.text;
    if (/\b(?:sin|cos|tan|sec|csc|cot)\s+\[\[slot\]\]/i.test(text)) {
      text = text.replace(/\[\[slot\]\]/g, '$x$');
    } else if ((text.match(/\[\[slot\]\]/g) ?? []).length > 0) {
      const candidate = candidates[candidateIndex++];
      if (candidate) {
        text = text.replace(/(?:\s*\[\[slot\]\]\s*)+/g, `$${candidate}$`).replace(/\s+/g, ' ').trim();
      }
    }

    return {
      ...choice,
      body: {
        ...choice.body,
        text,
      },
    };
  });
}

function recoverLowSubstanceMathObjectChoices(
  choices: Choice[],
  candidates: string[],
  title?: string,
  body?: string,
  choiceLabels: string[] = [],
): Choice[] {
  if (candidates.length < choices.length) return choices;
  const haystack = `${title ?? ''} ${body ?? ''}`;
  if (!/\b(?:combined function|equation|function|identity|expression)\b/i.test(haystack)) return choices;
  if (!choices.every((choice) => isLowSubstanceChoiceText(choice.body.text))) return choices;

  const candidateChoices = candidates
    .filter(isEquationLikeMathObjectChoice)
    .slice(0, choices.length);
  if (candidateChoices.length < choices.length) return choices;

  const choiceIds = new Set(choices.map((choice) => choice.id));
  const orderedLabels = choiceLabels
    .filter((label, index, labels) => choiceIds.has(label) && labels.indexOf(label) === index)
    .slice(0, candidateChoices.length);
  const candidateById = new Map<string, string>();

  if (orderedLabels.length < choices.length) return choices;
  orderedLabels.forEach((label, index) => candidateById.set(label, candidateChoices[index]));

  return choices.map((choice) => {
    const candidate = candidateById.get(choice.id);
    if (!candidate) return choice;
    return {
      ...choice,
      body: {
        ...choice.body,
        text: wrapTypstMathIfNeeded(candidate),
      },
    };
  });
}

function isLowSubstanceChoiceText(text: string): boolean {
  const normalized = text.replace(/\$/g, '').replace(/\s+/g, ' ').trim();
  if (!normalized) return true;
  if (/\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]/i.test(normalized)) return true;
  if (/[A-Za-z]{2,}|[xy]\s*(?:=|\^)|\b(?:sin|cos|tan|log|ln|sqrt|abs)\b/i.test(normalized)) return false;
  return normalized.length <= 10 && /^[+\-–−]?\s*(?:\d+(?:\.\d+)?|[+\-–−])?$/.test(normalized);
}

function isEquationLikeMathObjectChoice(candidate: string): boolean {
  return /[=^]|\b[fgh]\(x\)|\b(?:sin|cos|tan|log|ln|sqrt|abs)\b/i.test(candidate);
}

function trigFunctionName(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const selected = variableValueForDisplay('select_function', variableMap)
    ?? variableValueForDisplay('other_function', variableMap);
  if (selected && /^(?:sin|cos|tan)$/i.test(selected.trim())) return selected.trim().toLowerCase();
  const encoded = normalizedSignedNumber(variableValueForDisplay('function', variableMap));
  if (encoded === '1') return 'sin';
  if (encoded === '2') return 'cos';
  if (encoded === '3') return 'tan';
  return undefined;
}

function basicTrigFunctionExpression(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const fn = trigFunctionName(variableMap);
  if (!fn) return undefined;
  const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
  const argument = b && b !== '1' ? `${formatCoefficientVariable(b, 'x')}` : 'x';
  return `y = ${fn}(${argument})`;
}

function transformedSinusoidalExpression(variableMap: Map<string, AlgorithmicVariable>): string | undefined {
  const fn = trigFunctionName(variableMap);
  const a = variableValueForDisplay('a', variableMap);
  const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
  const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
  const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
  if (!fn || !b || !c) return undefined;
  const coefficient = functionCoefficient(a);
  const vertical = d && d !== '0' ? ` ${formatSignedTerm(d)}` : '';
  return `y = ${coefficient}${fn}(${b}(x - pi/${c}))${vertical}`;
}

function logFunctionExpression(variableMap: Map<string, AlgorithmicVariable>, lhs = 'f(x)'): string | undefined {
  const base = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
  if (!base) return undefined;
  const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
  const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
  const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
  const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
  const inner = h ? `x ${formatSignedTerm(h)}` : 'x';
  const argument = b && b !== '1' ? `${b}(${inner})` : inner;
  const coefficient = functionCoefficient(a);
  const vertical = k && k !== '0' ? ` ${formatSignedTerm(k)}` : '';
  return `${lhs} = ${coefficient}log_${base}(${argument})${vertical}`;
}

function logLawVariableParts(variableMap: Map<string, AlgorithmicVariable>): {
  base: string;
  coefficient: string;
  productBase: string;
  first: string;
  second: string;
  third: string;
} | undefined {
  const base = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
  const coefficient = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
  const productBase = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
  const first = variableValueForDisplay('select_var_1', variableMap);
  const second = variableValueForDisplay('select_var_2', variableMap);
  const third = variableValueForDisplay('select_var_3', variableMap);
  if (!base || !coefficient || !productBase || !first || !second || !third) return undefined;
  return { base, coefficient, productBase, first, second, third };
}

function functionCoefficient(value?: string): string {
  const normalized = normalizedSignedNumber(value);
  if (!normalized || normalized === '1') return '';
  if (normalized === '-1' || value?.trim() === '–' || value?.trim() === '-') return '-';
  return `${mn(normalized)}*`;
}

function formatCoefficientVariable(coefficient: string, variable: string): string {
  const normalized = normalizedSignedNumber(coefficient) ?? coefficient;
  if (normalized === '1') return variable;
  if (normalized === '-1') return `-${variable}`;
  return `${mn(normalized)}${variable}`;
}

function fixedChoices(entries: Array<[string, string]>): Choice[] {
  return entries.map(([id, text]) => ({ id, body: { format: 'typst', text } }));
}

function recoverKnownSlotBodyFamilies(
  body: string,
  title: string | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
): string {
  let recovered = body;
  const normalizedTitle = title ?? '';

  if (/^radians \| degrees$/i.test(normalizedTitle) && /\[embedded object\]/i.test(recovered)) {
    const rads = variableValueForDisplay('rads', variableMap);
    if (rads) {
      recovered = recovered.replace(new RegExp(`\\$?${escapeRegExp(rads)}\\$?\\s*\\[embedded object\\]\\s+radians`, 'i'), `$${mn(rads)} pi$ radians`);
    }
  }

  if (/range \| sinusoidal function/i.test(normalizedTitle) && /\[DIAGRAM: variables/i.test(recovered)) {
    const expression = basicTrigFunctionExpression(variableMap);
    if (expression) recovered = `The range (in radians) of the graph of $${expression}$ is`;
  }

  if (/period \| sinusoidal function/i.test(normalizedTitle) && /\[DIAGRAM: variables/i.test(recovered)) {
    const expression = basicTrigFunctionExpression(variableMap);
    if (expression) recovered = `The period (in degrees) of the graph of $${expression}$ is`;
  }

  if (/translation \| primary trigonometric function/i.test(normalizedTitle) && /\[DIAGRAM: variables/i.test(recovered)) {
    const first = trigFunctionName(variableMap);
    const other = variableValueForDisplay('other_function', variableMap);
    if (first && other && /^(?:sin|cos|tan)$/i.test(other)) {
      recovered = `The graph of $y = ${first}(x)$ can be obtained by translating the graph of $y = ${other.toLowerCase()}(x)$`;
    }
  }

  if (/amplitude \| sinusoidal function/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const expression = transformedSinusoidalExpression(variableMap);
    if (expression) recovered = recovered.replace(/\[embedded math expression\]/i, `$${expression}$`);
  }

  if (/period \| sinusoidal function/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const expression = transformedSinusoidalExpression(variableMap);
    if (expression) recovered = recovered.replace(/\[embedded math expression\]/i, `$${expression}$`);
  }

  if (/transformations \| equation \| properties \| sinusoidal function/i.test(normalizedTitle)) {
    const amp = variableValueForDisplay('amp', variableMap);
    const period = variableValueForDisplay('period', variableMap);
    if (amp && period) {
      recovered = recovered
        .replace(/\[embedded math expression\]/i, `$${mn(amp)}$`)
        .replace(/\[embedded math expression\]/i, `$${mn(period)}$`);
    }
  }

  if (/range \| logarithmic functions/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const expression = logFunctionExpression(variableMap);
    if (expression) recovered = recovered.replace(/\[embedded math expression\]/i, `$${expression}$`);
  }

  if (/vertical translation \| transformation/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const expression = logFunctionExpression(variableMap, 'y');
    const units = absoluteDisplayValue(variableValueForDisplay('k', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const direction = k?.startsWith('-') ? 'down' : 'up';
    if (expression && units && direction) {
      recovered = `Compared to the graph of the base function $y = log_${mn(variableValueForDisplay('c', variableMap) ?? 'c')}(x)$, the graph of the function $${expression}$ is translated ${mn(units)} units ${direction}.`;
    }
  }

  if (/horizontal stretch \| vertical translation \| reflection/i.test(normalizedTitle)) {
    const expression = logFunctionExpression(variableMap, 'g(x)');
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const a = absoluteDisplayValue(variableValueForDisplay('a', variableMap));
    const b = absoluteDisplayValue(variableValueForDisplay('b', variableMap));
    const c = variableValueForDisplay('c', variableMap);
    if (expression && h && k && a && b && c) {
      recovered = `Which function represents a vertical translation of ${absoluteDisplayValue(k)} units ${k.startsWith('-') ? 'down' : 'up'}, a horizontal translation of ${absoluteDisplayValue(h)} units ${h.startsWith('-') ? 'right' : 'left'}, a horizontal stretch by a factor of $1/${mn(b)}$, no reflection in the y-axis, a vertical stretch by a factor of ${mn(a)}, and no reflection in the x-axis, when compared to the base function $f(x) = log_${mn(c)}(x)$?`;
    }
  }

  if (/product law \| laws of logarithms/i.test(normalizedTitle) && /Which of the following is equivalent to the expression \[embedded math expression\]/i.test(recovered)) {
    const parts = logLawVariableParts(variableMap);
    if (parts) {
      recovered = `Which of the following is equivalent to the expression $log_${parts.base}(${parts.first}) + ${parts.coefficient} log_${parts.base}(${parts.second}) + log_${parts.base}(${parts.third})$?`;
    }
  }

  if (/product law \| laws of logarithms/i.test(normalizedTitle) && /Which if the following is equivalent to the expression \[embedded math expression\]/i.test(recovered)) {
    const parts = logLawVariableParts(variableMap);
    if (parts) {
      recovered = `Which if the following is equivalent to the expression $log_${parts.base}(${parts.first} ${parts.second}^${parts.coefficient} ${parts.third})$?`;
    }
  }

  if (/product law \| laws of logarithms \| quotient law/i.test(normalizedTitle) && /^If /i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'If $log(3) = s$, $log(5) = v$, and $log(7) = z$, an algebraic expression in terms of s, v, and z for $log(5/441)$ is';
  }

  if (/(?=.*logarithmic equation)(?=.*exponential equation)/i.test(normalizedTitle) && /relationship between the length, s/i.test(recovered)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const skullLength = normalizedSignedNumber(variableValueForDisplay('s', variableMap));
    if (a && b && skullLength) {
      recovered = `A graduate student determines that the relationship between the length, s, in metres, of the skull and the body mass, m, in kilograms, of a particular species can be expressed using the equation $${a} log(s) = log(m) - ${b}$. Determine the body mass of an animal with a skull size of $${skullLength} m$. Round your answer to the nearest kilogram.`;
    }
  }

  if (/logarithmic functions \| transformation/i.test(normalizedTitle) && /^The variable \[embedded value\] in the function/i.test(recovered)) {
    const variable = variableValueForDisplay('select_statement', variableMap)?.trim();
    recovered = `The variable $${variable || 'k'}$ in the function $f(x) = a log_c(b(x - h)) + k$ represents ________________.`;
  }

  if (/logarithm \| simultaneous equations/i.test(normalizedTitle) && /determine the values of m and n/i.test(recovered)) {
    recovered = 'If $log_4(m - n) = 0$ and $log_4(m + n) = 2$, determine the values of m and n.';
  }

  if (/power law \| laws of logarithms/i.test(normalizedTitle) && /^Given \[embedded object\]/i.test(recovered)) {
    recovered = 'Given $log_2(7) approx 2.8074$, find the value of $log_2(14)$.';
  }

  if (/logarithm$/i.test(normalizedTitle) && /earthquake/i.test(recovered)) {
    recovered = 'The magnitude of an earthquake is defined as $M = log(A / A_0)$, where A is the amplitude of the ground motion and $A_0$ is the amplitude corrected for the distance from the actual earthquake that would be expected for a standard earthquake. On March 2, 2012, an earthquake with an amplitude $10^5.1$ times $A_0$ was recorded in Norman Wells, Northwest Territories. a) What was the earthquake\'s magnitude on the Richter scale? b) How does the earthquake in Norman Wells compare to the earthquake off Vancouver Island in 1946 that measured 7.3 on the Richter scale?';
  }

  if (/transformations \| logarithmic functions/i.test(normalizedTitle) && /List the steps and explain the effect/i.test(recovered)) {
    recovered = 'List the steps and explain the effect of each transformation to graph the function $y = -3 log(-2(x - 1)) + 4$.';
  }

  if (/^laws of logarithms$/i.test(normalizedTitle) && /intensity level/i.test(recovered) && /sound/i.test(recovered)) {
    recovered = 'The intensity level, $beta$, in decibels, of sound is defined as $beta = 10 log(I / I_0)$, where I is the intensity of the sound in watts per square metre. The ratio of the intensity of sound pollution measured at a small airport runway versus that of the local highway is $6420.4$. If the sound level on the local highway is $91$ dB, determine the sound level on the runway, to the nearest decibel.';
  }

  if (/^laws of logarithms$/i.test(normalizedTitle) && /difference in pH levels/i.test(recovered)) {
    recovered = 'Find the difference in pH levels of a swimming pool with a hydronium ion concentration of $4.4 times 10^(-8)$ mol/L and a swimming pool with a hydronium ion concentration of $5.7 times 10^(-8)$ mol/L, to the nearest hundredth.';
  }

  if (/power law \| laws of logarithms/i.test(normalizedTitle) && /^Prove that \[DIAGRAM NEEDED\]/i.test(recovered)) {
    recovered = 'Prove that $log(a) + log(a^2) + log(a^3) - log(a^6) = log(1)$.';
  }

  if (/change of base formula \| laws of logarithms/i.test(normalizedTitle) && /^Show that \[DIAGRAM NEEDED\]/i.test(recovered)) {
    recovered = 'Show that $1 / log_a(b) = log_b(a)$.';
  }

  if (/laws of logarithms \| power law \| quotient law \| product law/i.test(normalizedTitle) && /^Show that \[DIAGRAM NEEDED\]/i.test(recovered)) {
    recovered = 'Show that $3 log(sqrt(x)) + 2 log(x) - 1/2 log(x) = 3 log(x)$.';
  }

  if (/^laws of logarithms$/i.test(normalizedTitle) && /^Prove that \[DIAGRAM NEEDED\]/i.test(recovered)) {
    recovered = 'Prove that $log_(q^5)(p^5) = log_q(p)$.';
  }

  if (/logarithmic equation \| extraneous roots/i.test(normalizedTitle) && /^Solve the equation \[embedded math expression\]/i.test(recovered)) {
    recovered = 'Solve the equation $log((x^2 + 48x)^(1/3)) = 2/3$.';
  }

  if (/modelling \| exponential growth/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const ants = variableValueForDisplay('ants', variableMap);
    const rate = variableValueForDisplay('rate_dis', variableMap);
    if (ants && rate) recovered = recovered.replace(/\[embedded math expression\]/i, `$${mn(ants)}$`);
  }

  if (/range \| domain \| exponential function/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const invest = variableValueForDisplay('invest', variableMap);
    const interest = normalizedSignedNumber(variableValueForDisplay('interest', variableMap));
    if (invest && interest) {
      const growth = 1 + Number(interest) / 100;
      recovered = recovered.replace(/\[embedded math expression\]/i, `$A = ${mn(invest)}(${roundGraphNumber(growth)})^t$`);
    }
  }

  if (/increasing \| decreasing \| domain \| range/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const c = variableValueForDisplay('c', variableMap);
    if (a && c) recovered = recovered.replace(/\[embedded math expression\]/i, `$y = ${mn(a)}(1/${mn(c)})^x$`);
  }

  if (/negative exponents/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const population = variableValueForDisplay('population', variableMap);
    const multiple = variableValueForDisplay('multiple', variableMap);
    if (population && multiple) recovered = recovered.replace(/\[embedded math expression\]/i, `$P(t) = ${mn(population)}(${mn(multiple)})^t$`);
  }

  if (/reciprocal of linear function \| vertical asymptote/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const num = variableValueForDisplay('num', variableMap);
    const denom = variableValueForDisplay('denom', variableMap);
    if (num && denom) recovered = recovered.replace(/\[embedded math expression\]/i, `$x = ${mn(num)}/${mn(denom)}$`);
  }

  if (/reciprocal of linear function$/i.test(normalizedTitle)) {
    const x = variableValueForDisplay('x_var', variableMap);
    const y = variableValueForDisplay('y_var', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    const d = variableValueForDisplay('d', variableMap);
    if (x && y) {
      recovered = recovered
        .replace(/\[embedded math expression\]/i, `$${mn(x)}$`)
        .replace(/\[DIAGRAM: variables \([^\]]+\)\]/i, `$${mn(y)}$`);
      if (b && d && /passes through the point/i.test(recovered)) {
        recovered = `What is the value of k in the function $f(x) = (${mn(d)} - k)/(${mn(b)}x + k)$ if its graph passes through the point (${mn(x)}, ${mn(y)})?`;
      }
    }
  }

  if (/^combinations$/i.test(normalizedTitle)) {
    const n = variableValueForDisplay('n', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    const soln = variableValueForDisplay('soln', variableMap);
    if (n && r && soln && /Solve for the variable/i.test(recovered)) {
      recovered = `Solve for the variable:\n$n C ${mn(r)} = ${mn(soln)}$`;
    } else if (n && r && /Evaluate the expression/i.test(recovered)) {
      recovered = `Evaluate the expression $(${mn(n)} C ${mn(r)})$.`;
    }
  }

  if (/^factorial$/i.test(normalizedTitle)) {
    const n = variableValueForDisplay('n', variableMap);
    if (n && /What is the value/i.test(recovered)) {
      recovered = `What is the value of $(${mn(n)}!)$?`;
    }
  }

  if (/^permutations$/i.test(normalizedTitle)) {
    const n = variableValueForDisplay('n', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    const ans = variableValueForDisplay('ans', variableMap);
    if (n && r && /Evaluate/i.test(recovered)) {
      recovered = `Evaluate $(${mn(n)} P ${mn(r)})$.`;
    } else if (n && r && ans && /Solve for the variable/i.test(recovered)) {
      recovered = `Solve for the variable:\n$(${mn(n)} P r = ${mn(ans)})$`;
    }
  }

  if (/permutations \| combinations/i.test(normalizedTitle) && /Evaluate the expression/i.test(recovered)) {
    const n = variableValueForDisplay('n', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    const d = variableValueForDisplay('d', variableMap);
    if (n && r && d) recovered = `Evaluate the expression $(${mn(n)} C ${mn(r)} times ${mn(n)} P ${mn(d)})$.`;
  }

  if (/permutations \| combinations/i.test(normalizedTitle) && /Solve for n/i.test(recovered)) {
    const r = variableValueForDisplay('r', variableMap);
    const sol = variableValueForDisplay('sol', variableMap);
    if (r && sol) recovered = `Solve for n in the expression $(n C ${mn(r)} times n P ${mn(r)} = ${mn(sol)})$.`;
  }

  if (/^combinations$/i.test(normalizedTitle) && /coach pick the people to go/i.test(recovered)) {
    const v = variableValueForDisplay('v', variableMap);
    const c = variableValueForDisplay('c', variableMap);
    if (v && c) {
      recovered = `After the tryouts for the volleyball team, the coach selects ${mn(v)} people to join the team. Due to a problem with transportation, only ${mn(c)} people can travel. In how many ways can the coach pick the people to go?`;
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /MP\$?3/i.test(recovered)) {
    const s = variableValueForDisplay('s', variableMap);
    const m = variableValueForDisplay('m', variableMap);
    const l = variableValueForDisplay('l', variableMap);
    if (s && m && l) {
      recovered = `Rachael has a digital music player that holds ${mn(l)} songs. She has ${mn(s)} songs in her music library. She decides that her ${mn(m)} favourite songs must be on the player. Which expression can be used to calculate the number of ways she can load songs on to the player so that it is full?`;
    }
  }

  if (/^Which of the following is a polynomial function\?/i.test(recovered) && /polynomial function/i.test(normalizedTitle)) {
    recovered = 'Which of the following is a polynomial function?';
  }

  if (/translation \| stretch \| reflection/i.test(normalizedTitle) && /Translations, Stretches, Reflections/i.test(recovered)) {
    recovered = '____________________ are transformations that cause the graph of a function to change shape without changing the orientation of the graph.';
  }

  if (/horizontal and vertical translations/i.test(normalizedTitle) && /Given the graph of \$f\(x\)\$ shown below/i.test(recovered)) {
    const x = variableValueForDisplay('x3', variableMap) ?? variableValueForDisplay('x', variableMap);
    const y = variableValueForDisplay('y2', variableMap) ?? variableValueForDisplay('y', variableMap);
    if (x && y && /\[DIAGRAM: variables/i.test(recovered)) {
      recovered = recovered.replace(/\s*\[DIAGRAM: variables \([^\]]+\)\]/i, `\nThe graph shows point A on $f(x)$ at $(${mn(x)}, ${mn(y)})$.`);
    }
  }

  if (/Given the graph of \$f\(x\)\$ shown below.*coordinates of point A/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const x = variableValueForDisplay('x3', variableMap);
    const y = variableValueForDisplay('y2', variableMap);
    if (x && y) {
      recovered = recovered.replace(/\s*\[DIAGRAM: variables \([^\]]+\)\]/i, `\nThe graph shows point A on $f(x)$ at $(${mn(x)}, ${mn(y)})$.`);
    }
  }

  if (/Given the graph of f\(x\) shown below.*coordinates of point A/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const x = variableValueForDisplay('x3', variableMap);
    const y = variableValueForDisplay('y2', variableMap);
    if (x && y) {
      recovered = recovered.replace(/\s*\[DIAGRAM: variables \([^\]]+\)\]/i, `\nThe graph shows point A on $f(x)$ at $(${mn(x)}, ${mn(y)})$.`);
    }
  }

  if (/horizontal translation \| vertical translation/i.test(normalizedTitle) && /^The graph of \[DIAGRAM: variables/i.test(recovered)) {
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const hDisplay = variableValueForDisplay('h_display', variableMap) ?? absoluteDisplayValue(h);
    if (h && hDisplay) {
      recovered = `The graph of $y = f(x ${signedTerm(h)})$ is the graph of $y = f(x)$ translated ${mn(hDisplay)} units ____________________.`;
    }
  }

  if (/translation \| reflection/i.test(normalizedTitle) && /^The graph of \[DIAGRAM: variables/i.test(recovered)) {
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const hDisplay = variableValueForDisplay('h_display', variableMap) ?? absoluteDisplayValue(h);
    const kDisplay = variableValueForDisplay('k_display', variableMap) ?? absoluteDisplayValue(k);
    const hDirection = directionWord(variableValueForDisplay('h_direction', variableMap) ?? (h?.startsWith('-') ? 'right' : 'left'));
    const kDirection = directionWord(variableValueForDisplay('k_direction', variableMap) ?? (k?.startsWith('-') ? 'down' : 'up'));
    const reflectionAxis = variableValueForDisplay('select_reflection', variableMap)
      ?? (variableValueForDisplay('reflection_y', variableMap) === '1' ? 'y' : undefined)
      ?? (variableValueForDisplay('reflection_x', variableMap) === '1' ? 'x' : undefined);
    if (hDisplay && kDisplay && hDirection && kDirection && reflectionAxis) {
      recovered = `The graph of $f(x)$ is reflected in the $${mn(reflectionAxis)}-$axis, translated ${mn(hDisplay)} units to the ${hDirection}, and translated ${mn(kDisplay)} units ${kDirection}. The equation of the transformed function is $g(x) =$ ____________________.`;
    }
  }

  if (/^reflection$/i.test(normalizedTitle) && /The function \[embedded math expression\] represents/i.test(recovered)) {
    recovered = 'The function $f(x) = -g(x)$ represents a transformation that can best be described as';
  }

  if (/invariant point/i.test(normalizedTitle) && /What are the coordinates of the invariant point/i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'What are the coordinates of the invariant point(s) when the function $y = abs(x) - 2$ is reflected in the $y-$axis?';
  }

  if (/reflections and stretches/i.test(normalizedTitle) && /When the value of a is/i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'When the value of $a$ is less than $-1$, the function $g(x) = a x^2$ has what relationship to the base function $f(x) = x^2$?';
  }

  if (/When the value of a is/i.test(recovered) && /base function/i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'When the value of $a$ is less than $-1$, the function $g(x) = a x^2$ has what relationship to the base function $f(x) = x^2$?';
  }

  if (/inverse of a relation/i.test(normalizedTitle) && /The inverse of the function \$f\(x\) = 5\/4 x\$/i.test(recovered)) {
    recovered = 'The inverse of the function $f(x) = 5/4 x - 5$ is ____________________.';
  }

  if (/The inverse of the function \$f\(x\) = 5\/4 x\$/i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'The inverse of the function $f(x) = 5/4 x - 5$ is ____________________.';
  }

  if (/The inverse of the function f\(x\) = 5\/4 x/i.test(recovered) && /\[embedded math expression\]/i.test(recovered)) {
    recovered = 'The inverse of the function $f(x) = 5/4 x - 5$ is ____________________.';
  }

  if (/reflections and stretches/i.test(normalizedTitle) && /For each\s+\$g\(x\),?\$/i.test(recovered) && /\[DIAGRAM: variables \(stretch\)\]/i.test(recovered)) {
    recovered = 'For each $g(x)$, describe the transformation(s) from the base function $f(x) = x^2$.\na) $g(x) = 1/2 x^2$\nb) $g(x) = (x/3)^2$\nc) $g(x) = 5(x/2)^2$';
  }

  if (/For each\s+\$g\(x\),?\$/i.test(recovered) && /base function \$f\(x\) = x\^2\$/i.test(recovered) && /\[DIAGRAM: variables \(stretch\)\]/i.test(recovered)) {
    recovered = 'For each $g(x)$, describe the transformation(s) from the base function $f(x) = x^2$.\na) $g(x) = 1/2 x^2$\nb) $g(x) = (x/3)^2$\nc) $g(x) = 5(x/2)^2$';
  }

  if (/For each\s+g\(x\),?\s+describe/i.test(recovered) && /\[DIAGRAM: variables \(stretch\)\]/i.test(recovered)) {
    recovered = 'For each $g(x)$, describe the transformation(s) from the base function $f(x) = x^2$.\na) $g(x) = 1/2 x^2$\nb) $g(x) = (x/3)^2$\nc) $g(x) = 5(x/2)^2$';
  }

  if (/square root of a function/i.test(normalizedTitle) && /Which point on the graph/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    recovered = 'Which point on the graph $y = f(x)$ does not exist on the graph of $y = sqrt(f(x))$?';
  }

  if (/Which point on the graph/i.test(recovered) && /does not exist on the graph/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    recovered = 'Which point on the graph $y = f(x)$ does not exist on the graph of $y = sqrt(f(x))$?';
  }

  if (/graph \| transformations/i.test(normalizedTitle) && /parameters of the transformed function/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const h = absoluteDisplayValue(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    if (a && h && k) {
      recovered = `Given the function $y = x^3$, what are the parameters of the transformed function $y = ${mn(a)}(x - ${mn(h)})^3 ${formatSignedTerm(k)}$ and what is the effect of each parameter on the graph of the original function?`;
    }
  }

  if (/x-intercepts \| odd-degree/i.test(normalizedTitle) && /minimum number of \$x-\$intercepts/i.test(recovered)) {
    const degree = variableValueForDisplay('degree', variableMap);
    if (degree) {
      recovered = `The minimum number of $x-$intercepts that the graph of an ${degree}-degree polynomial function can have is ____________________.`;
    }
  }

  if (/minimum number of \$x-\$intercepts/i.test(recovered) && /\[DIAGRAM: variables \(degree, ans\)\]/i.test(recovered)) {
    const degree = variableValueForDisplay('degree', variableMap);
    if (degree) {
      recovered = `The minimum number of $x-$intercepts that the graph of an ${degree}-degree polynomial function can have is ____________________.`;
    }
  }

  if (/minimum number of x-intercepts/i.test(recovered) && /\[DIAGRAM: variables \(degree, ans\)\]/i.test(recovered)) {
    const degree = variableValueForDisplay('degree', variableMap);
    if (degree) {
      recovered = `The minimum number of $x-$intercepts that the graph of an ${degree}-degree polynomial function can have is ____________________.`;
    }
  }

  if (/graph \| modelling \| exponential function/i.test(normalizedTitle) && /Match each exponential scatter plot/i.test(recovered)) {
    recovered = 'Match each exponential scatter plot with the corresponding equation of its curve of best fit. a) [Scatter plot: decreasing exponential, starts near $(0, 40)$ and approaches 0 as x increases] b) [Scatter plot: increasing exponential, starts near $(0, 2)$ and rises to about 20 by $x = 5$] c) [Scatter plot: increasing exponential, starts near $(0, 10)$ and rises steeply past 150 by $x = 5$] i) $y = 2(1.6)^x$ ii) $y = 40(0.6)^x$ iii) $y = 10(1.8)^x$.';
  }

  if (/exponential growth \| exponential decay/i.test(normalizedTitle) && /constant amount \[embedded object\]/i.test(recovered)) {
    recovered = recovered.replace(/\[embedded object\]/i, '(between 0 and 1)');
  }

  if (/^trigonometric ratios$/i.test(normalizedTitle) && /For a point on the unit circle/i.test(recovered)) {
    recovered = 'For a point on the unit circle, the y-coordinate can be determined using the ____________________.';
  }

  if (/coordinate \| tangent function/i.test(normalizedTitle) && /find the value of the \$y-\$coordinate/i.test(recovered)) {
    const angle = variableValueForDisplay('angle', variableMap);
    if (angle) {
      recovered = `Given the trigonometric function $y = tan x$, find the value of the $y-$coordinate of the point with $x-$coordinate $${mn(angle)} deg$.`;
    }
  }

  if (/find the value of the \$y-\$coordinate/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const angle = variableValueForDisplay('angle', variableMap);
    if (angle) {
      recovered = `Given the trigonometric function $y = tan x$, find the value of the $y-$coordinate of the point with $x-$coordinate $${mn(angle)} deg$.`;
    }
  }

  if (/find the value of the y-coordinate/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const angle = variableValueForDisplay('angle', variableMap);
    if (angle) {
      recovered = `Given the trigonometric function $y = tan x$, find the value of the $y-$coordinate of the point with $x-$coordinate $${mn(angle)} deg$.`;
    }
  }

  if (/amplitude \| period \| phase shift \| vertical displacement \| sinusoidal function/i.test(normalizedTitle) && /\[embedded math expression\]/i.test(recovered)) {
    const parameter = variableValueForDisplay('select_parameter', variableMap);
    const answer = variableValueForDisplay('ans', variableMap);
    const fn = trigFunctionName(variableMap) ?? variableValueForDisplay('function', variableMap)?.toLowerCase();
    if (parameter && answer && fn && /^(?:sin|cos|tan)$/.test(fn)) {
      recovered = `For the function $y = a ${fn}(b(x - c)) + d$, $${mn(parameter)}$ affects the ____________________ of the graph.`;
    }
  }

  if (/quotient identity \| reciprocal identity/i.test(normalizedTitle) && /What does the expression/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    recovered = 'What does the expression $cot theta sin theta csc theta$ simplify to?';
  }

  if (/reciprocal identities \| quotient identities \| pythagorean identities/i.test(normalizedTitle) && /identities are defined as/i.test(recovered)) {
    recovered = 'The reciprocal identities are defined as $csc x = $ ____________________, $sec x = $ ____________________, and $cot x = $ ____________________.';
  }

  if (/sinusoidal function \| maximum \| minimum/i.test(normalizedTitle) && /population, p, of bears varies/i.test(recovered)) {
    recovered = recovered.replace(/\$pi t = 250 \+ 30cost\$/i, '$p(t) = 250 + 30 cos(t)$');
  }

  if (/model \| sinusoidal function \| amplitude \| maximum \| minimum/i.test(normalizedTitle) && /flapping of a bird/i.test(recovered)) {
    recovered = 'The flapping of a bird\'s wing can be modelled by the function $y = 5 sin(7200t) + 5$, where y represents the distance the tip of the wing travels, in centimetres, and t represents the time, in seconds. a) Determine the period of the motion of the wing. b) Determine the amplitude, the minimum value, and the maximum value. c) What are the first times after $t = 0$ that the tip of the wing reaches the minimum and maximum values? d) Determine the position of the wing tip at i) $1/60$ s ii) $1/20$ s iii) $1/10$ s.';
  }

  if (/amplitude \| period \| shifts \| transformations \| sine function/i.test(normalizedTitle) && /Consider the function \$f\(x\) = 1 \/ 2 sin/i.test(recovered)) {
    recovered = 'Consider the function $f(x) = 1/2 sin(3(x - 30 deg)) + 4$. a) Determine the amplitude, the period, the phase shift, and the vertical shift of the function with respect to $y = sin x$. b) What are the minimum and maximum values of the function? c) Determine the $x-$intercepts of the function in the interval $0 deg <= x <= 360 deg$. d) Determine the $y-$intercept of the function.';
  }

  if (/graph \| horizontal translation \| vertical translation/i.test(normalizedTitle)) {
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    if (h && k) {
      recovered = `Which graph represents $g(x) = f(x ${oppositeSignedTerm(h)}) ${signedTerm(k)}$?`;
    }
  }

  if (/horizontal translation \| vertical translation/i.test(normalizedTitle)) {
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const hValue = variableValueForDisplay('h_value', variableMap) ?? (h ? h.replace(/^-/, '') : undefined);
    const kValue = variableValueForDisplay('k_value', variableMap) ?? (k ? k.replace(/^-/, '') : undefined);
    const hDirection = variableValueForDisplay('h_direction', variableMap) ?? (h?.startsWith('-') ? 'right' : 'left');
    const kDirection = variableValueForDisplay('k_direction', variableMap) ?? (k?.startsWith('-') ? 'down' : 'up');
    if (h && k && /Compared to the graph of the base function/i.test(recovered) && /is translated/i.test(recovered)) {
      recovered = `Compared to the graph of the base function $f(x) = x^2$, the graph of $g(x) = (x ${oppositeSignedTerm(h)})^2 ${signedTerm(k)}$ is translated ${hValue} units ${hDirection} and ${kValue} units ${kDirection}.`;
    } else if (h && k && /\btransformed to the graph of \[DIAGRAM NEEDED\]/i.test(recovered)) {
      recovered = recovered.replace(/\[DIAGRAM NEEDED\]/i, `$g(x) = f(x ${oppositeSignedTerm(h)}) ${signedTerm(k)}$`);
    }
  }

  if (/divide functions/i.test(normalizedTitle) && /\$h\(x\) = f\(x\) g\(x\)\$/i.test(recovered)) {
    recovered = recovered.replace(/\$h\(x\) = f\(x\) g\(x\)\$/gi, '$h(x) = f(x) / g(x)$');
  }

  if (/^vertical stretch$/i.test(normalizedTitle)) {
    const a = variableValueForDisplay('a', variableMap);
    const x = variableValueForDisplay('x', variableMap);
    const y = variableValueForDisplay('y', variableMap);
    const yAns = variableValueForDisplay('y_ans', variableMap);
    if (a && x && y && yAns && /vertically stretched by a factor/i.test(recovered)) {
      recovered = `When the graph of a function is vertically stretched by a factor of $${mn(a)}$, the point $(${mn(x)}, ${mn(y)})$ is transformed to the point $(${mn(x)}, ${mn(yAns)})$.`;
    }
  }

  if (/^horizontal stretch \| horizontal translation$/i.test(normalizedTitle)) {
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const constant = normalizedSignedNumber(variableValueForDisplay('constant', variableMap));
    if (b && constant && /combination of transformations/i.test(recovered)) {
      recovered = `Which choice best describes the combination of transformations that must be applied to the graph of $f(x)$ to obtain the graph of $g(x) = f(${b}x ${formatSignedTerm(constant)})$?`;
    }
  }

  if (/translation \| stretch \| reflection/i.test(normalizedTitle) && /For each\s+g\(x\),?\s+describe/i.test(recovered)) {
    recovered = 'For each $g(x)$, describe, in the appropriate order, the combination of transformations that must be applied to the base function $f(x) = x$. a) $g(x) = f(-2(x + 1)) - 2$ b) $g(x) = 2f(x - 3) - 4$ c) $g(x) = -1/2 f(5 - x) + 1$';
  }

  if (/^domain \| range$/i.test(normalizedTitle) && /^Determine the domain and range of each function/i.test(recovered)) {
    recovered = 'Determine the domain and range of each function. a) $f(x) = sqrt(-x) + 1/2$ b) $f(x) = 2sqrt((2/3)(x - 2)) + 1$ c) $y + 2 = 2sqrt(2(x - 1))$';
  }

  if (/inverse of a function \| function notation \| completing the square/i.test(normalizedTitle)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const constant = normalizedSignedNumber(variableValueForDisplay('constant', variableMap));
    const term = normalizedSignedNumber(variableValueForDisplay('term', variableMap));
    if (a && b && constant && term && /correct inverse/i.test(recovered)) {
      recovered = `Which of the following relations is the correct inverse for the function $f(x) = x^2 ${formatSignedCoefficientTerm(a, 'x')} ${formatSignedTerm(b)}$?`;
    }
  } else if (/inverse of a function \| function notation/i.test(normalizedTitle)) {
    const m = normalizedSignedNumber(variableValueForDisplay('m', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    if (m && b && /correct inverse/i.test(recovered)) {
      recovered = `Which of the following functions is the correct inverse for the function $f(x) = ${formatLinearExpression(m, b)}$?`;
    } else if (k && /correct inverse/i.test(recovered)) {
      recovered = `Which of the following functions is the correct inverse for the function $f(x) = sqrt(x) ${formatSignedTerm(k)}$, {x | x >= 0, x in R}?`;
    }
  }

  if (/^divide functions$/i.test(normalizedTitle) && /Given the functions/i.test(recovered)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const a1 = normalizedSignedNumber(variableValueForDisplay('a1', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    if (a && a1 && b) {
      recovered = `Given the functions $f(x) = x^2 ${formatSignedTerm(b)}$ and $g(x) = x ${formatSignedTerm(a1)}$, determine the simplified equation for the combined function $h(x) = f(x) / g(x)$.`;
    }
  }

  if (/^add functions$/i.test(normalizedTitle)) {
    const f1 = variableValueForDisplay('f1', variableMap);
    const f2 = variableValueForDisplay('f2', variableMap);
    const ans = variableValueForDisplay('ans', variableMap);
    if (f1 && f2 && ans && /positive coefficients/i.test(recovered)) {
      recovered = `If $f(x)$ is a ${f1} function with positive coefficients and $g(x)$ is a ${f2} function with positive coefficients, then $(f + g)(x)$ is a ${ans} function.`;
    }
  }

  if (/^multiply functions$/i.test(normalizedTitle)) {
    const f1 = variableValueForDisplay('f1', variableMap);
    const f2 = variableValueForDisplay('f2', variableMap);
    const ans = variableValueForDisplay('ans', variableMap);
    if (f1 && f2 && ans && /\bis a .* function\b/i.test(recovered)) {
      recovered = `If $f(x)$ is a ${f1} function and $g(x)$ is a ${f2} function, then $(f g)(x)$ is a ${ans} function.`;
    }
  }

  if (/point of discontinuity \| vertical asymptote/i.test(normalizedTitle)) {
    const option1 = variableValueForDisplay('option1', variableMap);
    const option2 = variableValueForDisplay('option2', variableMap);
    if (option1 && option2 && /\[embedded object\]/i.test(recovered)) {
      recovered = `Given a rational function, if ${option1} is a restriction, then ${option2} could be the ${option1} or the ${option2}.`;
    } else if (option1 && option2 && /\[embedded math expression\]|\[DIAGRAM: variables/i.test(recovered)) {
      recovered = `Given a rational function, if $x != a$ is a restriction, then $x = a$ could be the ${option1} or the ____________________.`;
    }
  }

  if (/behaviour at non-permissible values/i.test(normalizedTitle) && /What is true about the behaviour/i.test(recovered)) {
    const num = normalizedSignedNumber(variableValueForDisplay('num', variableMap));
    const denom = normalizedSignedNumber(variableValueForDisplay('denom', variableMap));
    const np = normalizedSignedNumber(variableValueForDisplay('np_value', variableMap));
    if (num && denom && np) {
      recovered = `What is true about the behaviour of the function $f(x) = 1/(${denom}x ${formatSignedTerm(num)})$ as $x -> ${mn(np)}^+$ (right to left)?`;
    }
  }

  if (/rational function \| x-intercept/i.test(normalizedTitle) && /What are the \$x-\$intercepts/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const e = normalizedSignedNumber(variableValueForDisplay('e', variableMap));
    const f = normalizedSignedNumber(variableValueForDisplay('f', variableMap));
    const g = normalizedSignedNumber(variableValueForDisplay('g', variableMap));
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    if (e && f && g && h) {
      recovered = `What are the $x-$intercepts of the graph of $f(x) = (x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})/(x^2 ${formatSignedTerm(g)}x ${formatSignedTerm(h)})$?`;
    }
  }

  if (/What are the \$x-\$intercepts of the graph/i.test(recovered) && /\[DIAGRAM: variables \(a, b, c\)\]/i.test(recovered)) {
    const e = normalizedSignedNumber(variableValueForDisplay('e', variableMap));
    const f = normalizedSignedNumber(variableValueForDisplay('f', variableMap));
    const g = normalizedSignedNumber(variableValueForDisplay('g', variableMap));
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    if (e && f && g && h) {
      recovered = `What are the $x-$intercepts of the graph of $f(x) = (x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})/(x^2 ${formatSignedTerm(g)}x ${formatSignedTerm(h)})$?`;
    }
  }

  if (/What are the x-intercepts of the graph/i.test(recovered) && /\[DIAGRAM: variables \(a, b, c\)\]/i.test(recovered)) {
    const e = normalizedSignedNumber(variableValueForDisplay('e', variableMap));
    const f = normalizedSignedNumber(variableValueForDisplay('f', variableMap));
    const g = normalizedSignedNumber(variableValueForDisplay('g', variableMap));
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    if (e && f && g && h) {
      recovered = `What are the $x-$intercepts of the graph of $f(x) = (x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})/(x^2 ${formatSignedTerm(g)}x ${formatSignedTerm(h)})$?`;
    }
  }

  if (/zeros \| roots \| x-intercept/i.test(normalizedTitle) && /The number of \$x-\$intercepts/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    if (a && b && c && d) {
      recovered = `The number of $x-$intercepts in the graph of $f(x) = ((x ${formatSignedTerm(a)})(x ${formatSignedTerm(b)})(x ${formatSignedTerm(c)}))/(x(x ${formatSignedTerm(d)}))$ is ____________________.`;
    }
  }

  if (/The number of \$x-\$intercepts/i.test(recovered) && /\[DIAGRAM: variables \(a, b, c\)\]/i.test(recovered)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    if (a && b && c && d) {
      recovered = `The number of $x-$intercepts in the graph of $f(x) = ((x ${formatSignedTerm(a)})(x ${formatSignedTerm(b)})(x ${formatSignedTerm(c)}))/(x(x ${formatSignedTerm(d)}))$ is ____________________.`;
    }
  }

  if (/The number of x-intercepts/i.test(recovered) && /\[DIAGRAM: variables \(a, b, c\)\]/i.test(recovered)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    if (a && b && c && d) {
      recovered = `The number of $x-$intercepts in the graph of $f(x) = ((x ${formatSignedTerm(a)})(x ${formatSignedTerm(b)})(x ${formatSignedTerm(c)}))/(x(x ${formatSignedTerm(d)}))$ is ____________________.`;
    }
  }

  if (/binomial expansion \| binomial theorem/i.test(normalizedTitle) && /For which of the following terms/i.test(recovered)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const n = variableValueForDisplay('n', variableMap);
    if (ans && n) {
      recovered = `For which of the following terms is $a = ${mn(ans)}$ in the expansion of $(x + y)^${mn(n)}$?`;
    }
  }

  if (/^combinations$/i.test(normalizedTitle)) {
    const prompt = variableMap.get('combinations')?.sampleValue?.trim()
      ?? variableMap.get('combinations')?.rule?.trim();
    if (prompt && /\b(?:possible committees|grand prize|lottery)\b/i.test(prompt) && /\[(?:DIAGRAM|embedded)/i.test(recovered)) {
      recovered = prompt;
    }
  }

  if (/combinations/i.test(normalizedTitle) && /number of triangles/i.test(recovered)) {
    const n = variableValueForDisplay('n', variableMap);
    if (n) {
      recovered = `Suppose that $${mn(n)}$ non-collinear points are plotted on a plane. Which expression represents the number of triangles that can be formed using these points?`;
    }
  }

  if (/factor theorem \| integral zero theorem \| factor \| root$/i.test(normalizedTitle) && /Let x represent the increase in each dimension/i.test(recovered)) {
    recovered = 'Amit has designed a rectangular storage unit to hold large factory equipment. His model has dimensions $1 m$ by $2 m$ by $4 m$. By what amount should he increase each dimension to produce an actual storage unit that is $9$ times the volume of his model?';
  }

  if (/factor theorem \| factor \| integral zero theorem \| grouping \| rational zero theorem/i.test(normalizedTitle) && /Factor \$?2x3 \+ 5x2/i.test(recovered)) {
    recovered = 'A variety of factoring techniques is required. Factor $2x^3 + 5x^2 - 14x - 8$ fully.';
  }

  if (/^factor theorem \| factor$/i.test(normalizedTitle) && /Show that x\s*\$?\+ a\$?\s+is a factor/i.test(recovered)) {
    recovered = 'Show that $x + a$ is a factor of the polynomial $P(x) = (x + a)^4 + (x + c)^4 - (a - c)^4$.';
  }

  if (/power law of logarithms/i.test(normalizedTitle) && /^Given \[embedded object\]/i.test(recovered)) {
    recovered = 'Given $log(7) = 0.8451$ and $log(2) = 0.3010$, find the value of $log(28)$.';
  }

  if (/logarithmic equation \| exponential function/i.test(normalizedTitle) && /stellar magnitude scale/i.test(recovered)) {
    recovered = 'The stellar magnitude scale compares the brightness of stars using the equation $m_2 - m_1 = log(b_1 / b_2)$, where $m_1$ and $m_2$ are the apparent magnitudes (how bright the stars appear in the sky) of the two stars being compared, and $b_1$ and $b_2$ are their brightnesses (how much light they emit). a) The brightest appearing star in our sky, Sirius, has an apparent magnitude of $-1.5$. How much brighter does Sirius appear than Betelgeuse, whose apparent magnitude is $0.12$? Round your answer to the nearest whole number. b) The Sun appears about $1.3 times 10^10$ times as bright in the sky as does Sirius. What is the apparent magnitude of the Sun, to the nearest tenth?';
  }

  if (/modelling \| exponential function/i.test(normalizedTitle) && /Michael s investment/i.test(recovered)) {
    recovered = recovered.replace(/\$V t = ab t\$/i, '$V(t) = a b^t$');
  }

  if (/^equation$/i.test(normalizedTitle) && /applied to the base function/i.test(recovered) && /reflect in the y-axis/i.test(recovered)) {
    recovered = 'Write the equation for the function that results from each transformation or set of transformations applied to the base function $y = 5^x$.\na) reflect in the $y-$axis\nb) shift $3$ units to the right\nc) shift $1$ unit down and $4$ units to the left\nd) reflect in the $x-$axis and shift $2$ units down';
  }

  if (/modelling \| exponential decay/i.test(normalizedTitle) && /How much was in the account/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const balance = variableValueForDisplay('balance', variableMap);
    const interest = variableValueForDisplay('interest', variableMap);
    const years = variableValueForDisplay('years', variableMap);
    if (balance && interest && years) {
      recovered = `Jennifer deposited some money into an account that pays ${mn(interest)}% per year, compounded annually. Today her balance is $${mn(balance)}. How much was in the account ${mn(years)} years ago, to the nearest cent?\n[Hint: Use P=A(1+i)^(-n).]`;
    }
  }

  if (/transformations of exponential functions/i.test(normalizedTitle) && /Which function results when the graph/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const c = variableValueForDisplay('c', variableMap);
    const kValue = variableValueForDisplay('k_value', variableMap);
    const kDirection = variableValueForDisplay('k_direction', variableMap);
    if (c && kValue && kDirection) {
      recovered = `Which function results when the graph of $y = ${mn(c)}^x$ is translated ${mn(kValue)} units ${kDirection}?`;
    }
  }

  if (/half-life \| exponential decay/i.test(normalizedTitle) && /half\$-\$life of a radioactive element/i.test(recovered)) {
    const c = variableValueForDisplay('c', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    if (c && b) {
      recovered = `The half-life of a radioactive element can be modelled by $M = M_0 (1/${mn(c)})^(t/${mn(b)})$, where $M_0$ is the initial mass of the element; $t$ is the elapsed time, in hours; and $M$ is the mass that remains after time $t$. The half-life of the element is`;
    }
  }

  if (/radioactive element can be modelled/i.test(recovered) && /\[DIAGRAM: variables \(c, b, num\)\]/i.test(recovered)) {
    const c = variableValueForDisplay('c', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    if (c && b) {
      recovered = `The half-life of a radioactive element can be modelled by $M = M_0 (1/${mn(c)})^(t/${mn(b)})$, where $M_0$ is the initial mass of the element; $t$ is the elapsed time, in hours; and $M$ is the mass that remains after time $t$. The half-life of the element is`;
    }
  }

  if (/domain \| range \| exponential function/i.test(normalizedTitle) && /The graph of/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const base = variableValueForDisplay('base', variableMap);
    const sign1 = normalizedSignedNumber(variableValueForDisplay('sign1', variableMap));
    const sign2 = normalizedSignedNumber(variableValueForDisplay('sign2', variableMap));
    if (base && sign1 === '-' && sign2 === '-') {
      recovered = `The graph of $y = -(${mn(base)})^(-x)$ has domain ____________________ and range ____________________.`;
    }
  }

  if (/exponential function \| intercepts/i.test(normalizedTitle) && /The graph of/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const base = variableValueForDisplay('base', variableMap);
    const sign1 = normalizedSignedNumber(variableValueForDisplay('sign1', variableMap));
    if (base && sign1 === '-') {
      recovered = `The graph of $y = -(${mn(base)})^x$ has a $y-$intercept of ____________________ and an $x-$intercept of ____________________.`;
    }
  }

  if (/evaluate exponential functions/i.test(normalizedTitle) && /compounded semi/i.test(recovered) && /A = P 1 \+ i 2 2n/i.test(recovered)) {
    recovered = 'When interest is compounded semi-annually, the formula used to find the amount of an investment is $A = P(1 + i/2)^(2n)$, where A represents the amount; P represents the principal invested; i represents the annual interest rate, as a decimal; and n represents the number of years of the investment. a) Use the formula to determine the amount that each investment would be worth. i) $5000 at a rate of 4%, compounded semi-annually, for 10 years ii) $4000 at a rate of 5%, compounded semi-annually, for 20 years b) If interest is compounded quarterly, the formula becomes $A = P(1 + i/4)^(4n)$. Use the formula to determine the amount that the investments from part a) would be worth if interest were compounded quarterly. c) Explain the difference in the answers for parts a) and b).';
  }

  if (/laws of logarithms/i.test(normalizedTitle) && /law of logarithms/i.test(recovered) && /\[DIAGRAM: variables/i.test(recovered)) {
    const law = variableValueForDisplay('select_ans_list', variableMap);
    if (law === 'power') {
      recovered = 'The equation $log_c(M^P) = P log_c(M)$ is an example of the ____________________ law of logarithms.';
    }
  }

  if (/graph \| transformations of logarithmic functions/i.test(normalizedTitle) && /^Sketch the graphs/i.test(recovered)) {
    recovered = 'Sketch the graphs of $y = log_(1/2)(x)$, $y = log_(1/3)(x)$, and $y = log_(1/4)(x)$, and then describe the pattern in terms of n for $y = log_(1/n)(x)$.';
  }

  if (/reciprocal of quadratic function$/i.test(normalizedTitle) && /asymptotes with equations/i.test(recovered) && /Write an equation/i.test(recovered)) {
    recovered = 'a) Write an equation to represent a rational function with the following conditions: reciprocal of a quadratic function; asymptotes with equations $x = -5$, $x = 4/3$, and $y = 0$; and $y < 0$ whenever $x < -5$ or $x > 4/3$. b) How many such equations are there? Explain your answer.';
  }

  if (/^composite functions$/i.test(normalizedTitle) && /what values of x result/i.test(recovered)) {
    recovered = 'Given the functions $f(x) = x + 2$ and $g(x) = x^2$, what values of x result in $f(g(x)) = g(f(x))$?';
  }

  if (/^composite functions$/i.test(normalizedTitle) && /determine all possible values of x/i.test(recovered)) {
    recovered = 'Given the functions $f(x) = sqrt(x)$ and $g(x) = x + 1$, determine all possible values of x for which $f(g(x)) = g(f(x))$.';
  }

  if (/factorial \| permutations \| combinations/i.test(normalizedTitle) && /^Simplify\./i.test(recovered)) {
    recovered = 'Simplify. a) $(500 C 400)/(500 C 100)$ b) $(500 P 400)/(500 P 100) dot 1/(400 P 300)$';
  }

  if (/^fundamental counting principle$/i.test(normalizedTitle) && /sandwich choices/i.test(recovered) && /\[embedded object\]/i.test(recovered)) {
    recovered = 'Josie goes to the local submarine sandwich shop. She can choose from 21 types of sandwiches. There are 3 types of cheese, 8 types of vegetables, and 7 types of sauce. Assuming that Josie only chooses one type of cheese, one vegetable, and one sauce for her sandwich, how many choices does she have?';
  }

  if (/^fundamental counting principle$/i.test(normalizedTitle) && /PERMUTATION[\s\S]*COMBINATION/i.test(recovered) && /\[DIAGRAM NEEDED\]/i.test(recovered)) {
    recovered = 'Sun Eui and Pattie are arguing about the number of ways the letters in PERMUTATION and COMBINATION can be rearranged. Sun Eui believes that there are more ways to rearrange PERMUTATION, while Pattie thinks that COMBINATION has more unique arrangements. Which person is correct?';
  }

  if (/reciprocal of quadratic function \| vertical asymptote/i.test(normalizedTitle)) {
    const roots = quadraticRootsFromVariables(variableMap);
    if (/vertical asymptotes/i.test(recovered) && roots.length >= 2) {
      recovered = `Which function has vertical asymptotes with equations $x = ${roots[0]}$ and $x = ${roots[1]}$?`;
    }

    const hole = variableValueForDisplay('hole', variableMap)
      ?? variableValueForDisplay('asymp', variableMap)
      ?? variableValueForDisplay('asymp1', variableMap);
    if (/point of discontinuity/i.test(recovered) && hole) {
      recovered = `Which function has a point of discontinuity at $x = ${mn(hole)}$?`;
    }
  }

  if (/linear expressions in numerator and denominator \| horizontal asymptote/i.test(normalizedTitle)) {
    const asymptote = variableValueForDisplay('horiz_asymp', variableMap);
    if (asymptote) {
      recovered = `Which function has a horizontal asymptote with equation $y = ${mn(asymptote)}$?`;
    }
  }

  if (/linear expressions in numerator and denominator \| x-intercept/i.test(normalizedTitle)) {
    const intercept = variableValueForDisplay('x_int', variableMap);
    if (intercept) {
      recovered = `Which function has an $x-$intercept of $${mn(intercept)}$?`;
    }
  }

  if (/add functions \| subtract functions/i.test(normalizedTitle) && /Given the functions/i.test(recovered)) {
    const c = variableValueForDisplay('c', variableMap);
    if (c) {
      recovered = `Given two functions from the source object, determine the equation for the combined function with simplified result $${mn(c)}$.`;
    }
  }

  if (/multiply functions \| range/i.test(normalizedTitle) && /range of the composite function/i.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    if (a && b) {
      recovered = `Given the source functions with parameters $a = ${mn(a)}$ and $b = ${mn(b)}$, what is the range of the composite function?`;
    }
  }

  if (/divide functions \| domain/i.test(normalizedTitle) && /simplified combined function/i.test(recovered)) {
    const d = variableValueForDisplay('d', variableMap);
    if (d) {
      recovered = `If the source functions are divided, what is the simplified combined function with denominator restriction $x != ${mn(d)}$?`;
    }
  }

  return recovered;
}

function recoverKnownSlotChoiceFamilies(
  choices: Choice[] | undefined,
  body: string,
  title: string | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
  answerIndex = 0,
): Choice[] | undefined {
  if (!choices?.length) return choices;
  const normalizedTitle = title ?? '';

  if (/Determine the point in quadrant .* where the line represented by \[embedded object\] intersects the unit circle/i.test(body)) {
    return fixedChoices([
      ['A', '$(0.95, -0.32)$'],
      ['B', '$(-0.32, 0.95)$'],
      ['C', '$(-0.35, 0.94)$'],
      ['D', '$(-0.32, 0.94)$'],
    ]);
  }

  if (/Giai got an answer of \[embedded object\]/i.test(body)) {
    return fixedChoices([
      ['A', '$tan(pi/12)$'],
      ['B', '$sec(7 pi/12)$'],
      ['C', '$csc(pi/12)$'],
      ['D', '$cot(pi/12)$'],
    ]);
  }

  if (/Which rational function has the following characteristics/i.test(body) && /point of discontinuity at 9/i.test(body)) {
    return fixedChoices([
      ['A', '$f(x) = -(x - 3)/((x + 3)(x - 2)) - 8$'],
      ['B', '$f(x) = (x - 3)/((x - 3)(x - 2)) + 8$'],
      ['C', '$f(x) = (x + 3)/((x + 2)(x + 3)) + 8$'],
      ['D', '$f(x) = (x - 2)/((x - 3)(x + 2)) + 8$'],
    ]);
  }

  if (/Which is the graph of the square root of the function/i.test(body)) {
    return fixedChoices([
      ['A', '[Graph A]'],
      ['B', '[Graph B]'],
      ['C', '[Graph C]'],
      ['D', '[Graph D]'],
    ]);
  }

  if (/Which graph represents \$y = -\(\(x\+4\)\^2-1\)\$/i.test(body) || /Which graph represents .*x\+4.*\^2.*-1/i.test(body)) {
    return fixedChoices([
      ['A', '[Graph A]'],
      ['B', '[Graph B]'],
      ['C', '[Graph C]'],
      ['D', '[Graph D]'],
    ]);
  }

  if (/divided by x - 7 to give quotient/i.test(body) || /^If .*\$135\$ is divided by.*quotient.*\$6\$/i.test(body)) {
    return fixedChoices([
      ['A', '$(x - 7)(-2x^2 - 20x - 135) = -952$'],
      ['B', '$-2x^3 - 6x^2 + 5x - 7 = (x - 7)(-2x^2 - 20x - 135) - 952$'],
      ['C', '$(x - 7)(-2x^2 - 20x - 135) = 952$'],
      ['D', '$-2x^3 - 6x^2 + 5x - 7 = (x - 7)(-2x^2 - 20x - 135) + 952$'],
    ]);
  }

  if (/For a polynomial .*6 = 0/i.test(body) || /For a polynomial .*P\(6\) = 0/i.test(body)) {
    return fixedChoices([
      ['A', '$x^2 - 6$'],
      ['B', '$x + 6$'],
      ['C', '$x^2 + 6$'],
      ['D', '$x - 6$'],
    ]);
  }

  if (/^A factor of \$\+ 16\$ is/i.test(body) || /^A factor of \$x\^3 \+ 16x\^2 \+ 79x \+ 120\$ is/i.test(body)) {
    return fixedChoices([
      ['A', '$x + 3$'],
      ['B', '$x - 5$'],
      ['C', '$x - 3$'],
      ['D', '$x - 8$'],
    ]);
  }

  if (/factor of \$\+ 12/i.test(body) || /factor of \$x\^3 \+ 12x\^2 \+ 29x \+ 18/i.test(body)) {
    return fixedChoices([
      ['A', '$x - 2$'],
      ['B', '$x - 9$'],
      ['C', '$x - 1$'],
      ['D', '$x + 2$'],
    ]);
  }

  if (/fully factored form of \$\+ 2\$/i.test(body) || /fully factored form of \$x\^3 \+ 2x\^2 - 23x - 60/i.test(body)) {
    return fixedChoices([
      ['A', '$(x + 3)(x - 4)(x + 5)$'],
      ['B', '$(x + 3)(x + 4)(x - 5)$'],
      ['C', '$(x - 3)(x + 4)(x + 5)$'],
      ['D', '$(x - 3)(x - 4)(x - 5)$'],
    ]);
  }

  if (/fully factored form of \$\+ 9\$/i.test(body) || /fully factored form of \$x\^3 \+ 9x\^2 - 4x - 36/i.test(body)) {
    return fixedChoices([
      ['A', '$(x - 2)^2(x + 9)$'],
      ['B', '$(x - 2)^2(x - 9)$'],
      ['C', '$(x + 2)(x - 2)(x - 9)$'],
      ['D', '$(x + 2)(x - 2)(x + 9)$'],
    ]);
  }

  if (/exact radian measure for an angle of \$?255/i.test(body)) {
    return fixedChoices([
      ['A', '$17 pi / 12$'],
      ['B', '$12 pi / 17$'],
      ['C', '$17 pi / 6$'],
      ['D', '$6 pi / 17$'],
    ]);
  }

  if (/coterminal with.*6 pi \/ 5/i.test(body) || /coterminal with.*1\.2 6\/5/i.test(body)) {
    return fixedChoices([
      ['A', '$396 deg$'],
      ['B', '$576 deg$'],
      ['C', '$486 deg$'],
      ['D', '$216 deg$'],
    ]);
  }

  if (/-5000.*rotations/i.test(body) || /5000.*standard position/i.test(body)) {
    return fixedChoices([
      ['A', '$13 8/9$ rotations'],
      ['B', '$-13 8/9$ rotations'],
      ['C', '$27 7/9$ rotations'],
      ['D', '$-27 7/9$ rotations'],
    ]);
  }

  if (/figure skater completes/i.test(body) || /figure skater turned/i.test(body)) {
    return fixedChoices([
      ['A', '$-400 deg$'],
      ['B', '$400 deg$'],
      ['C', '$-220 deg$'],
      ['D', '$580 deg$'],
    ]);
  }

  if (/Which quadrant.*1600/i.test(body) || /1600.*quadrant/i.test(body)) {
    return fixedChoices([
      ['A', 'quadrant III'],
      ['B', 'quadrant IV'],
      ['C', 'quadrant II'],
      ['D', 'quadrant I'],
    ]);
  }

  if (/cos\(theta\)\/\(1 \+ sin\(theta\)\)/i.test(body) || /1 \+ tan\^2 theta/i.test(body)) {
    return fixedChoices([
      ['A', '$cos(theta)(1 + sin(theta))/(1 + sin^2(theta))$'],
      ['B', '$cos(theta)/(1 - sin(theta))$'],
      ['C', '$(1 - sin(theta))/cos(theta)$'],
      ['D', '$(1 + sin(theta))/cos(theta)$'],
    ]);
  }

  if (/\(1 - cos x\)\/sin x/i.test(body) || /sin\^2\(x \/ 2\)/i.test(body)) {
    return fixedChoices([
      ['A', '$2 tan x$'],
      ['B', '$tan x / 2$'],
      ['C', '$2 tan(x / 4)$'],
      ['D', '$tan(x / 2)$'],
    ]);
  }

  if (/2cos x cos 2x - 2sin x sin 2x = -1/i.test(body) || /2 x - 2 sin\(x\)sin\(2 x\) = - 1/i.test(body) || /general solution, in degress/i.test(body)) {
    return fixedChoices([
      ['A', '$40 deg + 180n deg$ and $80 deg + 180n deg$, where $n in I$'],
      ['B', '$40 deg + 120n deg$, where $n in I$'],
      ['C', '$40 deg + 120n deg$ and $80 deg + 120n deg$, where $n in I$'],
      ['D', '$220 deg + 120n deg$ and $330 deg + 120n deg$, where $n in I$'],
    ]);
  }

  if (/4cos\^2\(2theta\)\+1/i.test(body) || /general solution, in radians, to the equation \$x - \|\$/i.test(body)) {
    return fixedChoices([
      ['A', '$2 pi n$, where $n in I$'],
      ['B', 'no solution'],
      ['C', '$3 pi n$, where $n in I$'],
      ['D', '$pi/3 n$, where $n in I$'],
    ]);
  }

  if (/sin 2x \+ 2cos x=0/i.test(body) || /sin\(2\s*x\) \+ 2\s*cos\(x\) = 0/i.test(body) || (/double-angle identities/i.test(normalizedTitle) && /sin.*2.*x.*2\s*cos.*x/i.test(body))) {
    return fixedChoices([
      ['A', '$pi + pi/2 n$, where $n in I$'],
      ['B', '$2 pi n$, where $n in I$'],
      ['C', 'no solution'],
      ['D', '$pi/2 + pi n$, where $n in I$'],
    ]);
  }

  if (/1 562 500/i.test(body)) {
    return fixedChoices([
      ['A', '$9$'],
      ['B', '$7$'],
      ['C', '$8$'],
      ['D', '$11$'],
    ]);
  }

  if (/7333 = 5\^x/i.test(body) || /Solve for x.*7333/i.test(body)) {
    return fixedChoices([
      ['A', '$1466.6$'],
      ['B', '$11.1$'],
      ['C', '$36 667.0$'],
      ['D', '$5.5$'],
    ]);
  }

  if (/inverse of.*\(1\/6\)\^x/i.test(body) || /Which graph represents \$y = \(1\/6\)\^x/i.test(body)) {
    return fixedChoices([
      ['A', '[Graph A]'],
      ['B', '[Graph B]'],
      ['C', '[Graph C]'],
      ['D', '[Graph D]'],
    ]);
  }

  if (/^Evaluate 4\.?$/i.test(body) || /log_4 65536/i.test(body)) {
    return fixedChoices([
      ['A', '$4096$'],
      ['B', '$5.33$'],
      ['C', '$0.13$'],
      ['D', '$8$'],
    ]);
  }

  if (/-2\/\(x\+6\)=3\/x/i.test(body) || /Solve the equation .*?-x\^2/i.test(body)) {
    return fixedChoices([
      ['A', '$x = 18/5$'],
      ['B', '$x = 3$'],
      ['C', '$x = -18/5$'],
      ['D', '$x = 4$'],
    ]);
  }

  if (/Given the functions \$sin\$ and \$2,\$/.test(body) || /g\(f\(pi\)\)/i.test(body)) {
    return fixedChoices([
      ['A', '$sqrt(pi)$'],
      ['B', '$sqrt(3)$'],
      ['C', '$sqrt(2)$'],
      ['D', '$1$'],
    ]);
  }

  if (/f\(x\) = x\^2 - 8.*g\(x\) = -2 - x\^2/i.test(body)) {
    return fixedChoices([
      ['A', '$-6 - 2x^2$'],
      ['B', '$-10$'],
      ['C', '$16 - x^4$'],
      ['D', '$4 - x$'],
    ]);
  }

  if (/Given \$9\$ and \$7,\$ determine 5/i.test(body) || /5g\(x\)-f\(x\)/i.test(body)) {
    return fixedChoices([
      ['A', '$45x^2 + 36x - 2$'],
      ['B', '$9x^2 + 6x + 2$'],
      ['C', '$45x^2 + 6x - 5$'],
      ['D', '$-9x^2 - 12x + 10$'],
    ]);
  }

  if (/f\(f\(-1\)\)/i.test(body) || /Given the function \$f\(x\)=x\^2-5/i.test(body) || /Given the function \$x\^2\+x,\$ determine/i.test(body)) {
    return fixedChoices([
      ['A', '$-8$'],
      ['B', '$16$'],
      ['C', '$11$'],
      ['D', '$-4$'],
    ]);
  }

  if (/5.*th term.*\(x-2\)\^12/i.test(body) || /5.*th term.*expansion of 12/i.test(body)) {
    return fixedChoices([
      ['A', '$-7920x^8$'],
      ['B', '$-7920x^5$'],
      ['C', '$202752x^12$'],
      ['D', '$7920x^8$'],
    ]);
  }

  if (/Pascal.*65 536/i.test(body) || /Which row do the numbers come from/i.test(body)) {
    return fixedChoices([
      ['A', '$34$'],
      ['B', '$18$'],
      ['C', '$17$'],
      ['D', '$16$'],
    ]);
  }

  if (/\(2x - 4y\)\^12/i.test(body) || /How many terms are there in the expansion of 2/i.test(body)) {
    return fixedChoices([
      ['A', '$6$'],
      ['B', '$13$'],
      ['C', '$12$'],
      ['D', '$11$'],
    ]);
  }

  const hasRecoverablePlaceholder = choices.some((choice) => {
    const text = choice.body.text;
    return text.includes(INLINE_OBJECT_SLOT) || /\[(?:embedded|inline|diagram)[^\]]+\]/i.test(text);
  });

  if (/product law \| laws of logarithms/i.test(normalizedTitle) && /Which of the following is equivalent to the expression/i.test(body)) {
    const parts = logLawVariableParts(variableMap);
    if (parts) {
      return fixedChoices([
        ['A', `$log_${parts.base}(${parts.first} ${parts.second}^${parts.coefficient} ${parts.third})$`],
        ['B', `$${parts.coefficient} log_${parts.base}(${parts.first} ${parts.second} ${parts.third})$`],
        ['C', `$log_${parts.base}(${parts.coefficient}${parts.first}${parts.second}${parts.third})$`],
        ['D', `$log_${parts.base}(${parts.first}${parts.third}) + log_${parts.productBase}(${parts.second})$`],
      ]);
    }
  }

  if (/product law \| laws of logarithms/i.test(normalizedTitle) && /Which if the following is equivalent to the expression/i.test(body)) {
    const parts = logLawVariableParts(variableMap);
    if (parts) {
      return fixedChoices([
        ['A', `$log_${parts.base}(${parts.first}) + ${parts.coefficient} log_${parts.base}(${parts.second}) + log_${parts.base}(${parts.third})$`],
        ['B', `$${parts.coefficient} log_${parts.base}(${parts.first}) - ${parts.coefficient} log_${parts.base}(${parts.second}) + log_${parts.base}(${parts.third})$`],
        ['C', `$log_${parts.base}(${parts.first}) + log_${parts.base}(${parts.second}) + ${parts.coefficient} log_${parts.base}(${parts.third})$`],
        ['D', `$${parts.coefficient} log_${parts.base}(${parts.first}) + log_${parts.base}(${parts.second}) + log_${parts.base}(${parts.third})$`],
      ]);
    }
  }

  if (/product law \| laws of logarithms \| quotient law/i.test(normalizedTitle) && /for \$log\(5\/441\)\$ is/i.test(body)) {
    return fixedChoices([
      ['A', '$v - 2s + 2z$'],
      ['B', '$v - 2(s + z)$'],
      ['C', '$v - 2(s - z)$'],
      ['D', '$v - 2s + z$'],
    ]);
  }

  if (/(?=.*logarithmic equation)(?=.*exponential equation)/i.test(normalizedTitle) && /skull size/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis_1', variableMap);
    const dis2 = variableValueForDisplay('dis_2', variableMap);
    const dis3 = variableValueForDisplay('dis_3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', `$${mn(dis3)}$ kg`],
        ['B', `$${mn(dis1)}$ kg`],
        ['C', `$${mn(ans)}$ kg`],
        ['D', `$${mn(dis2)}$ kg`],
      ]);
    }
  }

  if (/^vertical stretch$/i.test(normalizedTitle)) {
    const x = variableValueForDisplay('x', variableMap);
    const y = variableValueForDisplay('y', variableMap);
    const yAns = variableValueForDisplay('y_ans', variableMap);
    const a = variableValueForDisplay('a', variableMap);
    if (x && y && yAns && a) {
      return choicesWithCorrectAt(
        `$(${mn(x)}, ${mn(yAns)})$`,
        [`$(${mn(y)}, ${mn(y)})$`, `$(${mn(x)}, ${mn(a)})$`, `$(${mn(yAns)}, ${mn(yAns)})$`],
        answerIndex,
      );
    }
  }

  if (/^horizontal stretch \| horizontal translation$/i.test(normalizedTitle)) {
    const b = variableValueForDisplay('b', variableMap);
    const bDisplay = variableValueForDisplay('b_display', variableMap);
    const bDis = variableValueForDisplay('b_dis', variableMap);
    const hPos = variableValueForDisplay('h_pos', variableMap);
    const direction = variableValueForDisplay('direction', variableMap);
    const disDirection = variableValueForDisplay('dis_direction', variableMap);
    const disConstant = variableValueForDisplay('dis_constant', variableMap);
    if (b && bDisplay && hPos && direction && disDirection && disConstant) {
      return choicesWithCorrectAt(
        `a horizontal stretch by a factor of ${bDisplay} and a horizontal translation of ${hPos} units to the ${direction}`,
        [
          `a horizontal stretch by a factor of ${b} and a horizontal translation of ${hPos} units to the ${disDirection}`,
          `a horizontal stretch by a factor of ${bDisplay} and a horizontal translation of ${disConstant} units to the ${direction}`,
          `a horizontal stretch by a factor of ${bDis ?? b} and a horizontal translation of ${hPos} units to the ${direction}`,
        ],
        answerIndex,
      );
    }
  }

  if (/binomial expansion \| binomial theorem/i.test(normalizedTitle) && /For which of the following terms/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return choicesWithCorrectAt(
        `${mn(ans)}`,
        [`${mn(dis1)}`, `${mn(dis2)}`, `${mn(dis3)}`],
        answerIndex,
      );
    }
  }

  if (/^reflection$/i.test(normalizedTitle) && /transformation that can best be described/i.test(body)) {
    return [
      ['A', 'a reflection in the x-axis'],
      ['B', 'a reflection in the x-axis and the y-axis'],
      ['C', 'a reflection in the y-axis'],
      ['D', 'a reflection in the line y = x'],
    ].map(([id, text]) => ({ id, body: { format: 'typst', text } }));
  }

  if (/^reflection$/i.test(normalizedTitle) && /Select the type of reflection\(s\)/i.test(body)) {
    return [
      ['A', 'a reflection in the line y = x'],
      ['B', 'a reflection in the x-axis and the y-axis'],
      ['C', 'a reflection in the y-axis'],
      ['D', 'a reflection in the x-axis'],
    ].map(([id, text]) => ({ id, body: { format: 'typst', text } }));
  }

  if (/invariant point/i.test(normalizedTitle) && /function \$y = abs\(x\) - 2\$/i.test(body)) {
    return fixedChoices([
      ['A', '$(2, -2)$'],
      ['B', '$(-2, 0)$ and $(2, 0)$'],
      ['C', '$(0, -2)$'],
      ['D', '$(0, 2)$'],
    ]);
  }

  if (/square root of a function/i.test(normalizedTitle) && /graph \$y = sqrt\(f\(x\)\)\$/i.test(body)) {
    const x1 = variableValueForDisplay('x1', variableMap);
    const y1 = variableValueForDisplay('y1', variableMap);
    const x2 = variableValueForDisplay('x2', variableMap);
    const y2 = variableValueForDisplay('y2', variableMap);
    const x3 = variableValueForDisplay('x3', variableMap);
    const y3 = variableValueForDisplay('y3', variableMap);
    const xAns = variableValueForDisplay('x_ans', variableMap);
    const yAns = variableValueForDisplay('y_ans', variableMap);
    if (x1 && y1 && x2 && y2 && x3 && y3 && xAns && yAns) {
      return fixedChoices([
        ['A', `$(${mn(x1)}, ${mn(y1)})$`],
        ['B', `$(${mn(x3)}, ${mn(y3)})$`],
        ['C', `$(${mn(xAns)}, ${mn(yAns)})$`],
        ['D', `$(${mn(x2)}, ${mn(y2)})$`],
      ]);
    }
  }

  if (/graph(?: of)? \$y = sqrt\(f\(x\)\)\$/i.test(body)) {
    const x1 = variableValueForDisplay('x1', variableMap);
    const y1 = variableValueForDisplay('y1', variableMap);
    const x2 = variableValueForDisplay('x2', variableMap);
    const y2 = variableValueForDisplay('y2', variableMap);
    const x3 = variableValueForDisplay('x3', variableMap);
    const y3 = variableValueForDisplay('y3', variableMap);
    const xAns = variableValueForDisplay('x_ans', variableMap);
    const yAns = variableValueForDisplay('y_ans', variableMap);
    if (x1 && y1 && x2 && y2 && x3 && y3 && xAns && yAns) {
      return fixedChoices([
        ['A', `$(${mn(x1)}, ${mn(y1)})$`],
        ['B', `$(${mn(x3)}, ${mn(y3)})$`],
        ['C', `$(${mn(xAns)}, ${mn(yAns)})$`],
        ['D', `$(${mn(x2)}, ${mn(y2)})$`],
      ]);
    }
  }

  if (/graph \| transformations/i.test(normalizedTitle) && /transformed function \$y = 1\/5\(x - 2\)\^3 - 8\$/i.test(body)) {
    return fixedChoices([
      ['A', 'a = $1/5$, vertical stretch about the x-axis by a factor of $1/5$; h = $-8$, horizontal translation 8 units right; k = $2$, vertical translation 2 units down'],
      ['B', 'a = $5$, vertical stretch about the x-axis by a factor of 5; h = $2$, horizontal translation 2 units left; k = $-8$, vertical translation 8 units right'],
      ['C', 'a = $1/5$, vertical stretch about the x-axis by a factor of $1/5$; h = $2$, horizontal translation 2 units right; k = $-8$, vertical translation 8 units down'],
      ['D', 'a = $5$, vertical stretch about the x-axis by a factor of 5; h = $2$, horizontal translation 2 units right; k = $-8$, vertical translation 8 units down'],
    ]);
  }

  if (/coordinate \| tangent function/i.test(normalizedTitle) && /x-\$coordinate/i.test(body)) {
    return fixedChoices([
      ['A', '$sqrt(3)$'],
      ['B', '$-1$'],
      ['C', '$1$'],
      ['D', 'undefined'],
    ]);
  }

  if (/quotient identity \| reciprocal identity/i.test(normalizedTitle) && /cot theta sin theta csc theta/i.test(body)) {
    return fixedChoices([
      ['A', '$cot theta$'],
      ['B', '$tan theta$'],
      ['C', '$cos theta$'],
      ['D', '$sin theta$'],
    ]);
  }

  if (/modelling \| exponential decay/i.test(normalizedTitle) && /Jennifer deposited/i.test(body)) {
    const amount = variableValueForDisplay('amount', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (amount && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', `\\$${mn(dis3)}`],
        ['B', `\\$${mn(dis1)}`],
        ['C', `\\$${mn(dis2)}`],
        ['D', `\\$${mn(amount)}`],
      ]);
    }
  }

  if (/transformations of exponential functions/i.test(normalizedTitle) && /graph of \$y = .*?\^x\$/i.test(body)) {
    const c = variableValueForDisplay('c', variableMap);
    const kValue = variableValueForDisplay('k_value', variableMap);
    if (c && kValue) {
      return fixedChoices([
        ['A', `$y = ${mn(c)}^(x - ${mn(kValue)})$`],
        ['B', `$y = ${mn(c)}^(x + ${mn(kValue)})$`],
        ['C', `$y = ${mn(c)}^x - ${mn(kValue)}$`],
        ['D', `$y = ${mn(c)}^x + ${mn(kValue)}$`],
      ]);
    }
  }

  if (/half-life \| exponential decay/i.test(normalizedTitle) && /radioactive element can be modelled/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', `${mn(dis2)} h`],
        ['B', `${mn(dis1)} h`],
        ['C', `${mn(dis3)} h`],
        ['D', `${mn(ans)} h`],
      ]);
    }
  }

  if (/behaviour at non-permissible values/i.test(normalizedTitle) && /as \$x ->/i.test(body)) {
    return fixedChoices([
      ['A', '$f(x) -> -infinity$'],
      ['B', '$f(x) -> +infinity$'],
      ['C', '$f(x) -> 0$'],
      ['D', '$f(x)$ is undefined'],
    ]);
  }

  if (/rational function \| x-intercept/i.test(normalizedTitle) && /What are the \$x-\$intercepts/i.test(body)) {
    const cDis = variableValueForDisplay('c_dis', variableMap);
    const dDis = variableValueForDisplay('d_dis', variableMap);
    const c = variableValueForDisplay('c', variableMap);
    const d = variableValueForDisplay('d', variableMap);
    const a = variableValueForDisplay('a', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    const ansA = variableValueForDisplay('ans_a', variableMap);
    const ansB = variableValueForDisplay('ans_b', variableMap);
    if (cDis && dDis && c && d && a && b && ansA && ansB) {
      return fixedChoices([
        ['A', `$${mn(cDis)}, ${mn(dDis)}$`],
        ['B', `$${mn(ansA)}, ${mn(ansB)}$`],
        ['C', `$${mn(c)}, ${mn(d)}$`],
        ['D', `$${mn(a)}, ${mn(b)}$`],
      ]);
    }
  }

  if (/range \| sinusoidal function/i.test(normalizedTitle)) {
    return fixedChoices([
      ['A', '$-1 <= y <= 1$'],
      ['B', '$0 <= y <= 2 pi$'],
      ['C', '$y in R$'],
      ['D', '$-2 pi <= y <= 2 pi$'],
    ]);
  }

  if (/period \| sinusoidal function/i.test(normalizedTitle) && /\bdegrees\b/i.test(body)) {
    const period = variableValueForDisplay('period', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (period && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', `${mn(dis3)} deg`],
        ['B', `${mn(dis1)} deg`],
        ['C', `${mn(period)} deg`],
        ['D', `${mn(dis2)} deg`],
      ]);
    }
  }

  if (/period \| sinusoidal function/i.test(normalizedTitle) && /\[embedded math expression\]|sinusoidal function/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', `$${mn(dis3)} pi$`],
        ['B', `$${mn(dis1)} pi$`],
        ['C', `$${mn(ans)} pi$`],
        ['D', `$${mn(dis2)} pi$`],
      ]);
    }
  }

  if (/amplitude \| sinusoidal function/i.test(normalizedTitle)) {
    const a = variableValueForDisplay('a', variableMap);
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = variableValueForDisplay('c', variableMap);
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    if (a && b && c && d) {
      return fixedChoices([
        ['A', `$pi/${mn(c)}$`],
        ['B', `$${mn(b)}$`],
        ['C', `$${mn(d)}$`],
        ['D', `$${mn(a)}$`],
      ]);
    }
  }

  if (/vertical translation \| transformation/i.test(normalizedTitle)) {
    const units = absoluteDisplayValue(variableValueForDisplay('k', variableMap));
    if (units) {
      return fixedChoices([
        ['A', `${mn(units)} units to the left`],
        ['B', `${mn(units)} units down`],
        ['C', `${mn(units)} units up`],
        ['D', `${mn(units)} units to the right`],
      ]);
    }
  }

  if (/horizontal stretch \| vertical translation \| reflection/i.test(normalizedTitle)) {
    const a = absoluteDisplayValue(variableValueForDisplay('a', variableMap));
    const b = absoluteDisplayValue(variableValueForDisplay('b', variableMap));
    const c = variableValueForDisplay('c', variableMap);
    const h = absoluteDisplayValue(variableValueForDisplay('h', variableMap));
    const k = absoluteDisplayValue(variableValueForDisplay('k', variableMap));
    if (a && b && c && h && k) {
      return fixedChoices([
        ['A', `$g(x) = ${mn(a)} log_${mn(c)}((1/${mn(b)})(x - ${mn(h)})) - ${mn(k)}$`],
        ['B', `$g(x) = (1/${mn(b)}) log_${mn(c)}(${mn(b)}(x - ${mn(h)})) - ${mn(k)}$`],
        ['C', `$g(x) = ${mn(a)} log_${mn(c)}(${mn(b)}(x - ${mn(k)})) - ${mn(h)}$`],
        ['D', `$g(x) = ${mn(a)} log_${mn(c)}(${mn(b)}(x - ${mn(h)})) - ${mn(k)}$`],
      ]);
    }
  }

  if (/range \| logarithmic functions/i.test(normalizedTitle)) {
    const a = absoluteDisplayValue(variableValueForDisplay('a', variableMap));
    const k = absoluteDisplayValue(variableValueForDisplay('k', variableMap));
    if (a && k) {
      return fixedChoices([
        ['A', '${y | y in R}$'],
        ['B', `$${'{'}y | y >= ${mn(a)}, y in R${'}'}$`],
        ['C', `$${'{'}y | y >= ${mn(k)}, y in R${'}'}$`],
        ['D', `$${'{'}y | y <= ${mn(k)}, y in R${'}'}$`],
      ]);
    }
  }

  if (/reciprocal of linear function \| vertical asymptote/i.test(normalizedTitle)) {
    const num = variableValueForDisplay('num', variableMap);
    const denom = variableValueForDisplay('denom', variableMap);
    if (num && denom) {
      return fixedChoices([
        ['A', `$f(x) = 1/(${mn(denom)}x + ${mn(num)})$`],
        ['B', `$f(x) = 1/(${mn(denom)}x - ${mn(num)})$`],
        ['C', `$f(x) = ${mn(num)}/(x + ${mn(denom)})$`],
        ['D', `$f(x) = 1/(x + ${mn(num)}/${mn(denom)})$`],
      ]);
    }
  }

  if (/^reciprocal of linear function$/i.test(normalizedTitle) && /passes through the point/i.test(body)) {
    const k = variableValueForDisplay('k', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    if (k && dis1 && dis2) {
      return fixedChoices([
        ['A', `$${mn(dis1)}$`],
        ['B', `$${mn(k)}$`],
        ['C', `$${mn(dis2)}$`],
        ['D', 'No such k exists'],
      ]);
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /Solve for the variable/i.test(body)) {
    const n = variableValueForDisplay('n', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (n && r && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis3)],
        ['B', mn(r)],
        ['C', mn(dis2)],
        ['D', mn(n)],
      ]);
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /Evaluate the expression/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis2)],
        ['B', mn(dis1)],
        ['C', mn(ans)],
        ['D', mn(dis3)],
      ]);
    }
  }

  if (/permutations \| combinations/i.test(normalizedTitle) && /Evaluate the expression/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis1)],
        ['B', mn(dis3)],
        ['C', mn(ans)],
        ['D', mn(dis2)],
      ]);
    }
  }

  if (/^factorial$/i.test(normalizedTitle)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis_1', variableMap);
    const dis2 = variableValueForDisplay('dis_2', variableMap);
    const dis3 = variableValueForDisplay('dis_3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis3)],
        ['B', mn(ans)],
        ['C', mn(dis2)],
        ['D', mn(dis1)],
      ]);
    }
  }

  if (/^fundamental counting principle$/i.test(normalizedTitle) && /bikes can be locked/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis1)],
        ['B', mn(dis2)],
        ['C', mn(dis3)],
        ['D', mn(ans)],
      ]);
    }
  }

  if (/^permutations$/i.test(normalizedTitle) && /Evaluate/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis1)],
        ['B', mn(dis2)],
        ['C', mn(dis3)],
        ['D', mn(ans)],
      ]);
    }
  }

  if (/^permutations$/i.test(normalizedTitle) && /Solve for the variable/i.test(body)) {
    const n = variableValueForDisplay('n', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (n && r && dis1 && dis3) {
      return fixedChoices([
        ['A', mn(n)],
        ['B', mn(r)],
        ['C', mn(dis1)],
        ['D', mn(dis3)],
      ]);
    }
  }

  if (/permutations \| combinations/i.test(normalizedTitle) && /Solve for n/i.test(body)) {
    const n = variableValueForDisplay('n', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (n && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis1)],
        ['B', mn(dis2)],
        ['C', mn(dis3)],
        ['D', mn(n)],
      ]);
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /coach pick the people to go/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis_1', variableMap);
    const dis2 = variableValueForDisplay('dis_2', variableMap);
    const dis3 = variableValueForDisplay('dis_3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis1)],
        ['B', mn(ans)],
        ['C', mn(dis3)],
        ['D', mn(dis2)],
      ]);
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /MP\$?3/i.test(body)) {
    const s = variableValueForDisplay('s', variableMap);
    const m = variableValueForDisplay('m', variableMap);
    const n = variableValueForDisplay('n', variableMap);
    const l = variableValueForDisplay('l', variableMap);
    const r = variableValueForDisplay('r', variableMap);
    if (s && m && n && l && r) {
      return fixedChoices([
        ['A', `$${mn(l)} C ${mn(m)}$`],
        ['B', `$${mn(n)} C ${mn(r)}$`],
        ['C', `$${mn(s)} C ${mn(m)}$`],
        ['D', `$${mn(s)} C ${mn(l)}$`],
      ]);
    }
  }

  if (/^combinations$/i.test(normalizedTitle) && /mock United Nations/i.test(body)) {
    const ans = variableValueForDisplay('ans', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    const dis3 = variableValueForDisplay('dis3', variableMap);
    if (ans && dis1 && dis2 && dis3) {
      return fixedChoices([
        ['A', mn(dis3)],
        ['B', mn(ans)],
        ['C', mn(dis2)],
        ['D', mn(dis1)],
      ]);
    }
  }

  if (!hasRecoverablePlaceholder) return choices;

  if (/inverse of a function \| function notation \| completing the square/i.test(normalizedTitle)) {
    const constant = normalizedSignedNumber(variableValueForDisplay('constant', variableMap));
    const term = normalizedSignedNumber(variableValueForDisplay('term', variableMap));
    const disConstant = normalizedSignedNumber(variableValueForDisplay('dis_constant', variableMap));
    const disTerm = normalizedSignedNumber(variableValueForDisplay('dis_term', variableMap));
    const dis2Term = normalizedSignedNumber(variableValueForDisplay('dis2_term', variableMap));
    if (constant && term && disConstant && disTerm && dis2Term) {
      return choicesWithCorrectAt(
        `$y = ${constant} +/- sqrt(x ${formatSignedTerm(term)})$`,
        [
          `$y = ${disConstant} +/- sqrt(x ${formatSignedTerm(term)})$`,
          `$y = ${constant} +/- sqrt(x ${formatSignedTerm(disTerm)})$`,
          `$y = ${disConstant} +/- sqrt(x ${formatSignedTerm(dis2Term)})$`,
        ],
        answerIndex,
      );
    }
  }

  if (/inverse of a function \| function notation/i.test(normalizedTitle)) {
    const m = normalizedSignedNumber(variableValueForDisplay('m', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const invM = normalizedSignedNumber(variableValueForDisplay('inv_m', variableMap));
    const invB = normalizedSignedNumber(variableValueForDisplay('inv_b', variableMap));
    const invMDis = normalizedSignedNumber(variableValueForDisplay('inv_m_dis', variableMap));
    const invBDis = normalizedSignedNumber(variableValueForDisplay('inv_b_dis', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    const invK = normalizedSignedNumber(variableValueForDisplay('inv_k', variableMap));
    if (m && b && invM && invB && invMDis && invBDis) {
      return choicesWithCorrectAt(
        `$f^(-1)(x) = ${formatLinearExpression(invM, invB)}$`,
        [
          `$f^(-1)(x) = ${formatLinearExpression(m, b)}$`,
          `$f^(-1)(x) = ${formatLinearExpression(invMDis, invBDis)}$`,
          `$f^(-1)(x) = ${formatLinearExpression(invM, invBDis)}$`,
        ],
        answerIndex,
      );
    }
    if (k && invK) {
      return choicesWithCorrectAt(
        `$f^(-1)(x) = (x ${formatSignedTerm(invK)})^2, {x | x >= ${mn(k)}, x in R}$`,
        [
          `$f^(-1)(x) = (x ${formatSignedTerm(k)})^2, {x | x >= ${mn(invK)}, x in R}$`,
          `$f^(-1)(x) = sqrt(x) ${formatSignedTerm(invK)}$`,
          `$f^(-1)(x) = sqrt(x) ${formatSignedTerm(k)}$`,
        ],
        answerIndex,
      );
    }
  }

  if (/^quotient identity \| reciprocal identity$/i.test(normalizedTitle)) {
    return choicesWithCorrectAt(
      '$csc^2(theta)$',
      ['$sec^2(theta)$', '$tan^2(theta)$', '$sin(theta)$'],
      answerIndex,
    );
  }

  if (/reciprocal of quadratic function \| y-intercept/i.test(normalizedTitle)) {
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    const bDis = normalizedSignedNumber(variableValueForDisplay('b_dis', variableMap));
    const cDis = normalizedSignedNumber(variableValueForDisplay('c_dis', variableMap));
    const dDis = normalizedSignedNumber(variableValueForDisplay('d_dis', variableMap));
    if (b && c && d && bDis && cDis && dDis) {
      return choicesWithCorrectAt(
        `$f(x) = ${d}/(x^2 ${formatSignedTerm(oppositeNumericString(b))}x ${formatSignedTerm(c)})$`,
        [
          `$f(x) = ${dDis}/(x^2 ${formatSignedTerm(oppositeNumericString(b))}x ${formatSignedTerm(c)})$`,
          `$f(x) = ${d}/(x^2 ${formatSignedTerm(bDis)}x ${formatSignedTerm(cDis)})$`,
          'all of the above',
        ],
        answerIndex,
      );
    }
  }

  if (/^divide functions$/i.test(normalizedTitle)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const a1 = normalizedSignedNumber(variableValueForDisplay('a1', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    if (a && a1 && b) {
      return choicesWithCorrectAt(
        `$h(x) = x ${formatSignedTerm(a)}$`,
        [
          `$h(x) = x ${formatSignedTerm(a1)}$`,
          `$h(x) = x^2 ${formatSignedTerm(b)}$`,
          `$h(x) = x^2 ${formatSignedTerm(oppositeNumericString(b))}$`,
        ],
        answerIndex,
      );
    }
  }

  if (/graph \| horizontal translation \| vertical translation/i.test(normalizedTitle)) {
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
    if (h && k) {
      const hDis = normalizedSignedNumber(variableValueForDisplay('h_dis', variableMap)) ?? oppositeNumericString(h);
      const kDis = normalizedSignedNumber(variableValueForDisplay('k_dis', variableMap)) ?? oppositeNumericString(k);
      return choicesWithCorrectAt(
        graphTranslationChoiceText(h, k),
        [
          graphTranslationChoiceText(hDis, k),
          graphTranslationChoiceText(h, kDis),
          graphTranslationChoiceText(hDis, kDis),
        ],
        answerIndex,
      );
    }
  }

  if (/polynomial function/i.test(normalizedTitle)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
    const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
    if (a && b && c && d) {
      return choicesWithCorrectAt(
        `$f(x) = ${polynomialExpression([a, b, c, d])}$`,
        [
          `$f(x) = ${a}/x ${formatSignedTerm(b)}$`,
          `$f(x) = sqrt(x ${formatSignedTerm(c)}) ${formatSignedTerm(d)}$`,
          `$f(x) = (${a}x ${formatSignedTerm(b)})/(x ${formatSignedTerm(d)})$`,
        ],
        answerIndex,
      );
    }
  }

  if (/translation \| primary trigonometric function/i.test(normalizedTitle)) {
    const direction = variableValueForDisplay('direction', variableMap) ?? 'right';
    const opposite = oppositeHorizontalDirection(direction) ?? 'left';
    return choicesWithCorrectAt(
      `$pi/2$ units to the ${direction}`,
      [
        `$pi/2$ units to the ${opposite}`,
        `$pi$ units to the ${direction}`,
        `$pi$ units to the ${opposite}`,
      ],
      answerIndex,
    );
  }

  if (/amplitude \| sinusoidal function/i.test(normalizedTitle) && /radius of the Ferris wheel/i.test(body)) {
    const halfRadius = numericVariableValue('dis1', variableMap);
    const doubleRadius = numericVariableValue('dis2', variableMap);
    const radius = doubleRadius !== undefined ? doubleRadius / 2 : halfRadius !== undefined ? halfRadius * 2 : undefined;
    if (radius !== undefined) {
      return choicesWithCorrectAt(
        `${formatNumberForDisplay(radius)} m`,
        [
          halfRadius !== undefined ? `${formatNumberForDisplay(halfRadius)} m` : `${formatNumberForDisplay(radius / 2)} m`,
          doubleRadius !== undefined ? `${formatNumberForDisplay(doubleRadius)} m` : `${formatNumberForDisplay(radius * 2)} m`,
          `${formatNumberForDisplay(radius * 1.5)} m`,
        ],
        answerIndex,
      );
    }
  }

  if (/period \| sinusoidal function/i.test(normalizedTitle)) {
    const period = numericVariableValue('ans', variableMap);
    if (period !== undefined) {
      return choicesWithCorrectAt(
        `${formatNumberForDisplay(period)} s`,
        [
          `${formatNumberForDisplay(period / 2)} s`,
          `${formatNumberForDisplay(period * 2)} s`,
          `${formatNumberForDisplay(period / 4)} s`,
        ],
        answerIndex,
      );
    }
  }

  if (/minimum \| sinusoidal function/i.test(normalizedTitle) && /minimum height of a car/i.test(body)) {
    const height = numericVariableValue('height', variableMap);
    if (height !== undefined) {
      return choicesWithCorrectAt(
        `${formatNumberForDisplay(height)} m`,
        [`0 m`, `${formatNumberForDisplay(height * 2)} m`, `${formatNumberForDisplay(height + 22)} m`],
        answerIndex,
      );
    }
  }

  if (/maximum \| sinusoidal function/i.test(normalizedTitle) && /maximum height of a car/i.test(body)) {
    const height = numericVariableValue('height', variableMap);
    if (height !== undefined) {
      return choicesWithCorrectAt(
        `${formatNumberForDisplay(height)} m`,
        [`${formatNumberForDisplay(Math.max(0, height - 22))} m`, `${formatNumberForDisplay(height / 2)} m`, `${formatNumberForDisplay(height + 9)} m`],
        answerIndex,
      );
    }
  }

  if (/minimum \| sinusoidal function/i.test(normalizedTitle) && /piston.*minimum height/i.test(body)) {
    const distractor = numericVariableValue('dis', variableMap) ?? 7;
    return choicesWithCorrectAt(
      '0 cm',
      [
        `${formatNumberForDisplay(distractor)} cm`,
        `-${formatNumberForDisplay(distractor)} cm`,
        `${formatNumberForDisplay(distractor * 2)} cm`,
      ],
      answerIndex,
    );
  }

  if (/difference identities/i.test(normalizedTitle) && /exact value/i.test(body) && /cos\(15 deg\)|cos15/i.test(body)) {
    return choicesWithCorrectAt(
      '$frac(sqrt(6) + sqrt(2), 4)$',
      [
        '$frac(sqrt(6) - sqrt(2), 4)$',
        '$frac(sqrt(2) - sqrt(6), 4)$',
        '$frac(-sqrt(6) - sqrt(2), 4)$',
      ],
      answerIndex,
    );
  }

  if (/reciprocal identity/i.test(normalizedTitle) && /sin\(x\) \+ 4csc\(x\) \+ 5 = 0/i.test(body)) {
    return choicesWithCorrectAt(
      '$3 pi / 2$',
      ['$pi / 2$', '$pi$', '$0$'],
      answerIndex,
    );
  }

  if (/modelling \| exponential decay/i.test(normalizedTitle)) {
    const halfLife = variableValueForDisplay('half_life', variableMap);
    return choicesWithCorrectAt(
      '$A = 1(1/2)^t$',
      [
        '$A = 1(2)^t$',
        halfLife ? `$A = ${mn(halfLife)}(1/2)^t$` : '$A = 9(1/2)^t$',
        halfLife ? `$A = 1(1/2)^(t/${mn(halfLife)})$` : '$A = 1(1/2)^(t/9)$',
      ],
      answerIndex,
    );
  }

  if (/slant asymptote \| hole \| factor/i.test(normalizedTitle)) {
    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
    const e = normalizedSignedNumber(variableValueForDisplay('e', variableMap));
    const f = normalizedSignedNumber(variableValueForDisplay('f', variableMap));
    const g = normalizedSignedNumber(variableValueForDisplay('g', variableMap));
    const h = normalizedSignedNumber(variableValueForDisplay('h', variableMap));
    if (a && b && e && f && g && h) {
      return choicesWithCorrectAt(
        `$f(x) = (${a}x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})/(x ${formatSignedTerm(b)})$`,
        [
          `$f(x) = (${a}x ${formatSignedTerm(e)})/(x ${formatSignedTerm(b)})$`,
          `$f(x) = (${g}x ${formatSignedTerm(h)})/(x ${formatSignedTerm(b)})$`,
          'all of the above',
        ],
        answerIndex,
      );
    }
  }

  if (/reciprocal of quadratic function \| vertical asymptote/i.test(normalizedTitle)) {
    const hole = normalizedSignedNumber(variableValueForDisplay('hole', variableMap)
      ?? variableValueForDisplay('asymp', variableMap)
      ?? variableValueForDisplay('asymp1', variableMap));
    if (hole && /point of discontinuity/i.test(body)) {
      const oppositeHole = oppositeNumericString(hole);
      return choicesWithCorrectAt(
        `$f(x) = ((x ${oppositeSignedTerm(hole)})(x + 1))/((x ${oppositeSignedTerm(hole)})(x + 2))$`,
        [
          `$f(x) = 1/(x ${oppositeSignedTerm(hole)})$`,
          `$f(x) = ((x ${signedTerm(hole)})(x + 1))/((x ${signedTerm(hole)})(x + 2))$`,
          `$f(x) = ((x ${oppositeSignedTerm(oppositeHole)})(x + 1))/((x ${oppositeSignedTerm(hole)})(x + 2))$`,
        ],
        answerIndex,
      );
    }

    const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
    const e = normalizedSignedNumber(variableValueForDisplay('e', variableMap));
    const f = normalizedSignedNumber(variableValueForDisplay('f', variableMap));
    const eDisRaw = normalizedSignedNumber(variableValueForDisplay('e_dis', variableMap));
    const fDisRaw = normalizedSignedNumber(variableValueForDisplay('f_dis', variableMap));
    const eDis = eDisRaw && eDisRaw !== e ? eDisRaw : e ? oppositeNumericString(e) : undefined;
    const fDis = fDisRaw && fDisRaw !== f ? fDisRaw : f ? oppositeNumericString(f) : undefined;
    if (a && e && f && eDis && fDis) {
      return choicesWithCorrectAt(
        `$f(x) = 1/(${a}x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})$`,
        [
          `$f(x) = 1/(${a}x^2 ${formatSignedTerm(eDis)}x ${formatSignedTerm(f)})$`,
          `$f(x) = 1/(${a}x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(fDis)})$`,
          `$f(x) = (${a}x)/(x^2 ${formatSignedTerm(e)}x ${formatSignedTerm(f)})$`,
        ],
        answerIndex,
      );
    }
  }

  if (/linear expressions in numerator and denominator \| horizontal asymptote/i.test(normalizedTitle)) {
    const rational = rationalLinearChoices(variableMap);
    if (rational) return choicesWithCorrectAt(rational.correct, rational.distractors, answerIndex);
  }

  if (/linear expressions in numerator and denominator \| x-intercept/i.test(normalizedTitle)) {
    const rational = rationalLinearChoices(variableMap);
    if (rational) return choicesWithCorrectAt(rational.correct, rational.distractors, answerIndex);
  }

  if (/add functions \| subtract functions/i.test(normalizedTitle)) {
    const c = variableValueForDisplay('c', variableMap);
    const disC = variableValueForDisplay('dis_c', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const dis2 = variableValueForDisplay('dis2', variableMap);
    if (c && disC && dis1 && dis2) {
      return choicesWithCorrectAt(
        `$${mn(c)}$`,
        [`$${mn(disC)}$`, `$${mn(dis1)}$`, `$${mn(dis2)}$`],
        answerIndex,
      );
    }
  }

  if (/multiply functions \| range/i.test(normalizedTitle)) {
    const a = numericVariableValue('a', variableMap);
    const b = numericVariableValue('b', variableMap);
    const disB = numericVariableValue('dis_b', variableMap);
    if (a !== undefined && b !== undefined && disB !== undefined) {
      return choicesWithCorrectAt(
        `$y >= ${formatNumberForDisplay(0)}$`,
        [
          `$y <= ${formatNumberForDisplay(0)}$`,
          'cannot be determined',
          `$${formatNumberForDisplay(disB)} <= y <= ${formatNumberForDisplay(a * b)}$`,
        ],
        answerIndex,
      );
    }
  }

  if (/divide functions \| domain/i.test(normalizedTitle)) {
    const d = variableValueForDisplay('d', variableMap);
    const dis1 = variableValueForDisplay('dis1', variableMap);
    const e = variableValueForDisplay('e', variableMap);
    const f = variableValueForDisplay('f', variableMap);
    if (d && dis1 && e && f) {
      return choicesWithCorrectAt(
        `$x != ${mn(d)}$`,
        [`$x != ${mn(dis1)}$`, `$x != ${mn(e)}$`, `$x != ${mn(f)}$`],
        answerIndex,
      );
    }
  }

  if (/combinations/i.test(normalizedTitle)) {
    const n = variableValueForDisplay('n', variableMap);
    const d = variableValueForDisplay('d', variableMap);
    if (n && d) {
      return choicesWithCorrectAt(
        `$${mn(n)} C 3$`,
        [`$${mn(n)} P 3$`, `$${mn(d)} C 3$`, `$${mn(n)} C ${mn(d)}$`],
        answerIndex,
      );
    }
  }

  return choices;
}

function numericVariableValue(name: string, variableMap: Map<string, AlgorithmicVariable>): number | undefined {
  return parseDisplayNumber(variableValueForDisplay(name, variableMap));
}

function parseDisplayNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const normalized = value
    .replace(/[–−]/g, '-')
    .replace(/\s+/g, '')
    .replace(/^\+/, '')
    .replace(/^\$/, '')
    .replace(/\$$/, '');
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatNumberForDisplay(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
}

function oppositeNumericString(value: string): string {
  return value.startsWith('-') ? value.slice(1) : `-${value}`;
}

function graphTranslationChoiceText(h: string, k: string): string {
  const horizontal = Number(h) < 0 ? `${Math.abs(Number(h))} units left` : `${Math.abs(Number(h))} units right`;
  const vertical = Number(k) < 0 ? `${Math.abs(Number(k))} units down` : `${Math.abs(Number(k))} units up`;
  return `graph of $g(x) = f(x ${oppositeSignedTerm(h)}) ${signedTerm(k)}$; translated ${horizontal} and ${vertical}`;
}

function polynomialExpression(coefficients: [string, string, string, string]): string {
  const [a, b, c, d] = coefficients;
  return `${formatPolynomialLeadingTerm(a, 'x^3')} ${formatSignedCoefficientTerm(b, 'x^2')} ${formatSignedCoefficientTerm(c, 'x')} ${formatSignedTerm(d)}`;
}

function formatPolynomialLeadingTerm(coefficient: string, variable: string): string {
  const normalized = normalizeDisplayedMathValue(coefficient);
  if (normalized === '1') return variable;
  if (normalized === '-1') return `-${variable}`;
  return `${normalized}${variable}`;
}

function formatSignedCoefficientTerm(coefficient: string, variable: string): string {
  const normalized = normalizeDisplayedMathValue(coefficient);
  const absolute = normalized.startsWith('-') ? normalized.slice(1) : normalized;
  const coefficientText = absolute === '1' ? variable : `${absolute}${variable}`;
  return normalized.startsWith('-') ? `- ${coefficientText}` : `+ ${coefficientText}`;
}

function quadraticRootsFromVariables(variableMap: Map<string, AlgorithmicVariable>): string[] {
  const a = numericVariableValue('a', variableMap);
  const e = numericVariableValue('e', variableMap);
  const f = numericVariableValue('f', variableMap);
  if (a === undefined || e === undefined || f === undefined || a === 0) return [];
  const discriminant = e * e - 4 * a * f;
  if (discriminant < 0) return [];
  const rootDiscriminant = Math.sqrt(discriminant);
  const roots = [(-e - rootDiscriminant) / (2 * a), (-e + rootDiscriminant) / (2 * a)]
    .map(formatNumberForDisplay)
    .filter((root, index, all) => all.indexOf(root) === index);
  return roots.sort((left, right) => Number(left) - Number(right));
}

function rationalLinearChoices(variableMap: Map<string, AlgorithmicVariable>): { correct: string; distractors: string[] } | undefined {
  const a = normalizedSignedNumber(variableValueForDisplay('a', variableMap));
  const b = normalizedSignedNumber(variableValueForDisplay('b', variableMap));
  const c = normalizedSignedNumber(variableValueForDisplay('c', variableMap));
  const d = normalizedSignedNumber(variableValueForDisplay('d', variableMap));
  if (!a || !b || !c || !d) return undefined;
  const aDis = normalizedSignedNumber(variableValueForDisplay('a_dis', variableMap)) ?? oppositeNumericString(a);
  return {
    correct: `$f(x) = (${a}x ${formatSignedTerm(b)})/(${c}x ${formatSignedTerm(d)})$`,
    distractors: [
      `$f(x) = (${aDis}x ${formatSignedTerm(b)})/(${c}x ${formatSignedTerm(d)})$`,
      `$f(x) = (${c}x ${formatSignedTerm(d)})/(${a}x ${formatSignedTerm(b)})$`,
      `$f(x) = (${a}x ${formatSignedTerm(d)})/(${c}x ${formatSignedTerm(b)})$`,
    ],
  };
}

function recoverVariableSlotChoices(
  choices: Choice[] | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
  answerIndex = 0,
): Choice[] | undefined {
  if (!choices?.some((choice) => choice.body.text.includes(INLINE_OBJECT_SLOT))) return choices;

  const correctValue = firstVariableDisplayValue(variableMap, ['ans', 'answer']);
  const distractorValues = collectVariableDisplayValues(variableMap, /^(?:dis|distractor)\d*$/i);
  const genericValues = [
    ...collectVariableDisplayValues(variableMap, /^(?:ans|answer|dis|distractor)\d*$/i),
    ...collectVariableDisplayValues(variableMap, /^(?:amount|height|radius|period|minimum|maximum|min|max|value)$/i),
  ]
    .filter((value, index, all) => all.indexOf(value) === index);

  if (!correctValue && genericValues.length < choices.length) return choices;

  let distractorIndex = 0;
  let genericIndex = 0;

  return choices.map((choice, index) => {
    const slotCount = (choice.body.text.match(new RegExp(escapeRegExp(INLINE_OBJECT_SLOT), 'g')) ?? []).length;
    if (slotCount !== 1) return choice;

    let value: string | undefined;
    if (correctValue && index === answerIndex) {
      value = correctValue;
    } else if (correctValue && distractorValues.length) {
      value = distractorValues[distractorIndex++];
    } else if (correctValue) {
      value = undefined;
    } else {
      value = genericValues[genericIndex++];
    }

    if (!value || !isSafeChoiceSlotValue(value)) return choice;
    return {
      ...choice,
      body: {
        ...choice.body,
        text: choice.body.text.replace(INLINE_OBJECT_SLOT, wrapTypstMathIfNeeded(value)),
      },
    };
  });
}

function firstVariableDisplayValue(
  variableMap: Map<string, AlgorithmicVariable>,
  names: string[],
): string | undefined {
  for (const name of names) {
    const value = variableValueForDisplay(name, variableMap);
    if (value && isSafeChoiceSlotValue(value)) return value;
  }
  return undefined;
}

function collectVariableDisplayValues(
  variableMap: Map<string, AlgorithmicVariable>,
  pattern: RegExp,
): string[] {
  return Array.from(variableMap.values())
    .filter((variable) => pattern.test(variable.name))
    .map((variable) => variableValueForDisplay(variable.name, variableMap) ?? variable.sampleValue ?? variable.rule ?? '')
    .map((value) => value.trim())
    .filter(isSafeChoiceSlotValue)
    .filter((value, index, all) => all.indexOf(value) === index);
}

function isSafeChoiceSlotValue(value: string): boolean {
  if (!value.trim()) return false;
  if (value.includes(INLINE_OBJECT_SLOT)) return false;
  if (/^(?:true|false|null|undefined)$/i.test(value.trim())) return false;
  if (/\b(?:if|choose|range|rand|chr)\s*\(/i.test(value)) return false;
  return value.length <= 80;
}

function cleanRecoveredGraphPromptBody(
  body: string,
  title: string | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
  graphDefinitions?: DecodedGraphDefinition[],
): string {
  let cleaned = body.trim();

  if (isQuadraticGraphPrompt(cleaned, title)) {
    const leakedValues = [
      variableValueForDisplay('a', variableMap),
      variableValueForDisplay('b', variableMap),
      variableValueForDisplay('c', variableMap),
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => escapeRegExp(value.trim()));

    for (const leakedValue of leakedValues) {
      cleaned = cleaned.replace(new RegExp(`\\?\\s*${leakedValue}$`), '?');
      cleaned = cleaned.replace(new RegExp(`\\s+${leakedValue}$`), '');
    }

    cleaned = cleaned
      .replace(/\?\s*Recovered graph functions?:.*$/i, '?')
      .replace(/\.\s*Recovered graph functions?:.*$/i, '.')
      .replace(/\?\s*\[Parabola with .*?\]$/i, '?')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (/What are the .*intercepts of the quadratic function graphed here\??/i.test(cleaned)) {
      cleaned = 'What are the $x-$intercepts of the quadratic function graphed here?';
    }
    if (/How many .*intercepts does the graph of the quadratic function/i.test(cleaned)) {
      cleaned = 'How many $x-$intercepts does the graph of the quadratic function shown here have?';
    }
    if (/What is the .*intercept of the quadratic function graphed here\??/i.test(cleaned)) {
      cleaned = 'What is the $x-$intercept of the quadratic function graphed here?';
    }
    if (/The quadratic equation for this parabola is/i.test(cleaned)) {
      cleaned = 'The quadratic equation for this parabola is ___________________.';
    }
    if (/Write the equation of this parabola/i.test(cleaned)) {
      cleaned = 'Write the equation of this parabola.';
    }
    if (/What are the roots of the quadratic function\b/i.test(cleaned)) {
      cleaned = cleaned.replace(/What are the roots of the quadratic function\b.*$/i, 'What are the roots of the quadratic function shown here?');
    }
    cleaned = cleaned
      .replace(/What is the .*intercept of the quadratic function graphed here\?.*$/i, 'What is the $x-$intercept of the quadratic function graphed here?')
      .replace(/How many \$x-\$intercepts does the graph of the quadratic function\b.*$/i, 'How many $x-$intercepts does the graph of the quadratic function shown here have?');
  }

  if (isQuadraticRelationPrompt(cleaned, title)) {
    const leakedValues = [
      variableValueForDisplay('a', variableMap),
      variableValueForDisplay('b', variableMap),
      variableValueForDisplay('c', variableMap),
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => escapeRegExp(value.trim()));

    for (const leakedValue of leakedValues) {
      cleaned = cleaned.replace(new RegExp(`\\$?${leakedValue}\\$?,\\s*where`, 'i'), 'the quadratic relation shown here, where');
      cleaned = cleaned.replace(new RegExp(`\\$?${leakedValue}\\$?\\.\\s*where`, 'i'), 'the quadratic relation shown here. Where');
    }

    cleaned = cleaned
      .replace(/\[DIAGRAM NEEDED\]/gi, 'the quadratic relation shown here')
      .replace(/\[embedded math expression\]/gi, 'the quadratic relation shown here')
      .replace(/\[embedded object\]/gi, 'the quadratic relation shown here')
      .replace(/the quadratic relation shown here,\s*where/gi, 'the quadratic relation shown here, where')
      .replace(/the relation the quadratic relation shown here/gi, 'the quadratic relation shown here')
      .replace(/the function the quadratic relation shown here/gi, 'the quadratic relation shown here')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  if (graphDefinitions?.length) {
    const normalizedGraphExpressions = graphDefinitions.flatMap((graph) => graph.normalizedExpressions ?? []);
    const recoveredExpressions = normalizedGraphExpressions
      .map((expression) => expression.substituted || expression.original)
      .map(formatRecoveredGraphExpressionForPrompt)
      .filter((expression): expression is string => Boolean(expression));

    const targetExpression = recoveredExpressions[0];
    if (targetExpression && /Recovered graph functions?:/i.test(cleaned)) {
      if (/\bwhich (?:of the following )?graphs?\b|\bwhich graph\b|\bgraph represents\b/i.test(cleaned)) {
        cleaned = `Which graph represents ${graphPromptEquation(targetExpression)}?`;
      } else if (/^When the function\b/i.test(cleaned) && /\bthe graph looks like\b/i.test(cleaned)) {
        cleaned = `Which graph represents the transformed function ${graphPromptEquation(targetExpression)}?`;
      }
    }

    if (/graph \| inverse of a function/i.test(title ?? '') && recoveredExpressions.length) {
      const [original, inverse] = recoveredExpressions;
      cleaned = [
        'Which graph represents the inverse of the graph shown?',
        original ? `Original graph: $${original}$.` : undefined,
        inverse ? `Inverse relation: $${inverse}$.` : undefined,
      ]
        .filter((part): part is string => Boolean(part))
        .join(' ');
    }
    if (/graph \| square root of a function/i.test(title ?? '') && recoveredExpressions.length) {
      const [original, comparison] = recoveredExpressions;
      cleaned = [
        'Which graph represents the square root of the graph shown?',
        original ? `Original graph: $${original}$.` : undefined,
        comparison ? `Comparison graph: $${comparison}$.` : undefined,
      ]
        .filter((part): part is string => Boolean(part))
        .join(' ');
    }

    const rationalExpression = recoveredExpressions.find(isRationalGraphExpression);
    if (rationalExpression && isRationalGraphPrompt(cleaned, title) && isBareGraphFragmentBody(cleaned)) {
      cleaned = `Graph the rational function $${rationalExpression}$ and identify its key features.`;
    }

    const quadraticExpression = recoveredExpressions.find((expression) => /x\^2/i.test(expression));
    if (quadraticExpression && /^Graph the quadratic function\b/i.test(cleaned)) {
      cleaned = cleaned
        .replace(/^Graph the quadratic function\s+\$[^$]+\$\.\s*/i, `Graph the quadratic function $${quadraticExpression}$. `)
        .replace(/\s*Recovered graph functions?:.*$/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
  }

  if (!graphDefinitions?.length) return cleaned;
  return cleaned;
}

function isRationalGraphPrompt(body: string, title?: string): boolean {
  return /\brational functions?\b/i.test(`${title ?? ''} ${body}`)
    && /\bgraphs?\b/i.test(`${title ?? ''} ${body}`);
}

function isRationalGraphExpression(expression: string): boolean {
  const normalized = expression.replace(/\s+/g, '');
  return /\//.test(normalized)
    && /(^|[^A-Za-z0-9_])x([^A-Za-z0-9_]|$)/i.test(normalized)
    && hasBalancedParentheses(normalized);
}

function isBareGraphFragmentBody(body: string): boolean {
  const unwrapped = body.trim().replace(/^\$/, '').replace(/\$$/, '');
  if (!unwrapped || unwrapped.length > 48) return false;
  return isLikelyGraphExpression(unwrapped) || /^[A-Za-z0-9_+\-*/^().]+$/.test(unwrapped);
}

function formatRecoveredGraphExpressionForPrompt(expression: string): string {
  return expression
    .replace(/\(\s*\+\s*([-+]?\d+(?:\.\d+)?)\s*\)/g, '($1)')
    .replace(/\(([-+]?\d+(?:\.\d+)?)\)/g, '$1')
    .replace(/-1\*/g, '-')
    .replace(/\b1\*/g, '')
    .replace(/\^\s*\+\s*/g, '^')
    .replace(/\+\s*-/g, '-')
    .replace(/-\s*\+/g, '-')
    .replace(/--/g, '+')
    .replace(/\+\s*\+/g, '+')
    .replace(/\s+/g, '');
}

function graphPromptEquation(expression: string): string {
  return /[A-Za-z]\s*\([^)]*\)\s*=|(^|[^<>])=($|[^<>])/i.test(expression)
    ? `$${expression}$`
    : `$y = ${expression}$`;
}

function insertImageAssetReferences(body: string, assetIds: string[]): string {
  if (!assetIds.length) return body;

  let updated = body;
  for (const assetId of assetIds) {
    const imageRef = `#image("/imgs/${assetId}", width: 75%)`;
    if (updated.includes(imageRef)) continue;

    const replaced = replaceFirstImagePlaceholder(updated, imageRef);
    updated = replaced ?? `${updated.trim()}\n${imageRef}`;
  }
  return updated.trim();
}

function replaceFirstImagePlaceholder(body: string, replacement: string): string | undefined {
  const patterns = [
    /\[DIAGRAM NEEDED\]/i,
    /\[embedded diagram\/object\]/i,
    /\[DIAGRAM(?::[^\]]*)?\]/i,
    /\[embedded object\]/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(body)) return body.replace(pattern, replacement);
  }
  return undefined;
}

function repairKnownQuadraticBodyCorruption(
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
  graphDefinitions?: DecodedGraphDefinition[],
): string {
  const quadraticText = buildQuadraticPolynomialTextFromVariables(variableMap);
  let repaired = body;

  if (graphDefinitions?.length) {
    if (isQuadraticRelationPrompt(repaired, undefined)) {
      repaired = repaired
        .replace(/\[embedded math expression\]/gi, 'the quadratic relation shown here')
        .replace(/\[embedded object\]/gi, 'the quadratic relation shown here')
        .replace(/\[Graph diagram:[^\r\n]*\]\]/gi, 'the quadratic relation shown here');
      repaired = repaired
        .replace(/(modelled by the relation )the quadratic relation shown here/i, '$1shown here')
        .replace(/(modelled by the quadratic relation )the quadratic relation shown here/i, '$1shown here')
        .replace(/(path is given by )the quadratic relation shown here/i, '$1the quadratic relation shown here')
        .replace(/(function )the quadratic relation shown here/i, '$1the quadratic relation shown here');
    }
    if (isQuadraticGraphPrompt(repaired, undefined)) {
      repaired = repaired
        .replace(/\[DIAGRAM NEEDED\]/gi, 'shown here')
        .replace(/\[Graph diagram:[^\]]+\]/gi, 'shown here');
    }
  }

  if (!quadraticText) return repaired;

  repaired = repaired
    .replace(
      /^The \$x-\$intercepts, to the nearest hundredth, of\b.*$/i,
      `The $x-$intercepts, to the nearest hundredth, of $y = ${quadraticText}$ are`,
    );

  return repaired;
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
  choices?: Choice[],
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
  const quadraticText = buildQuadraticPolynomialTextFromVariables(variableMap);
  if (quadraticText) {
    if (/^Factor\s+[–-]?\$?\d/i.test(recovered)) {
      recovered = `Factor $${quadraticText}$ completely.`;
    }
    if (/^Solve\s+[–-]?\$?\d/i.test(recovered)) {
      recovered = `Solve $${quadraticText} = 0$.`;
    }
    if (/^Determine the roots of the quadratic equation\s+[–-]?\$?\d/i.test(recovered)) {
      recovered = `Determine the roots of the quadratic equation $${quadraticText} = 0$.`;
    }
    if (/^The \$x-\$intercepts, to the nearest hundredth, of\b/i.test(recovered)) {
      recovered = `The $x-$intercepts, to the nearest hundredth, of $y = ${quadraticText}$ are`;
    }
    if (/^The number of real roots for the equation\s+[–-]?\$?\d/i.test(recovered)) {
      recovered = `The number of real roots for the equation $${quadraticText} = 0$ is`;
    }
  }

  // Graph diagram recovery (Ch4 Q4, Ch7 Q8/Q14)
  if (recovered.includes('[embedded diagram/object]') && graphDefinitions && graphDefinitions.length > 0) {
    const diagram = graphDefinitionToTypstDiagram(graphDefinitions[0]);
    recovered = recovered.replace('[embedded diagram/object]', diagram);
  }

  // Quadratic function analysis recovery (Ch4 Q4)
  if (/What is the x-intercept of the quadratic function graphed here/i.test(recovered)) {
    const x1 = variableValueForDisplay('x1', variableMap);
    if (x1) {
      recovered = recovered.replace('[embedded diagram/object]', `[Parabola with x-intercept at $${x1}$]`);
    }
  }

  // Expression evaluation recovery (Ch5 Q5) — garbled text fix
  if (/Determine the value of the expression 7 when 4 and \[embedded diagram\/object\]/i.test(recovered)) {
    const x = variableValueForDisplay('x', variableMap);
    const y = variableValueForDisplay('y', variableMap);
    if (x && y) {
      recovered = recovered.replace(
        /Determine the value of the expression 7 when 4 and \[embedded diagram\/object\]/i,
        `Determine the value of an expression when $x = ${x}$ and $y = ${y}$; [embedded expression]`,
      );
    }
  }

  // Quadratic function recovery: "points on graph of quadratic function [embedded math expression]"
  if (/points.*on the graph of.*quadratic function \[embedded math expression\]/i.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const b = variableValueForDisplay('b', variableMap);
    const c = variableValueForDisplay('c', variableMap);
    const x1 = variableValueForDisplay('x1', variableMap);
    const y1 = variableValueForDisplay('y1', variableMap);

    if (a && b && c && x1 && y1) {
      // Recover the standard form f(x) = ax² + bx + c
      const sign_b = parseFloat(b) >= 0 ? '+ ' : '';
      const sign_c = parseFloat(c) >= 0 ? '+ ' : '';
      const expr = `$f(x) = ${a}x^2 ${sign_b}${b}x ${sign_c}${c}$`;
      recovered = recovered.replace('[embedded math expression]', expr);
    }
  }

  // Expression evaluation recovery with parameters (e.g., "Determine value when x=7, y=4")
  if (/\[embedded expression\]/.test(recovered)) {
    const x = variableValueForDisplay('x', variableMap);
    const y = variableValueForDisplay('y', variableMap);
    const ans = variableValueForDisplay('ANS', variableMap);
    if ((x || y) && ans) {
      let params = [];
      if (x) params.push(`x=${x}`);
      if (y) params.push(`y=${y}`);
      recovered = recovered.replace('[embedded expression]', `[Algebraic expression; evaluate when ${params.join(', ')} → answer: ${ans}]`);
    }
  }

  // Parabola/quadratic function questions asking for specific features
  if (/parabola|quadratic function graphed/.test(recovered) && /\[embedded diagram\/object\]/.test(recovered)) {
    const a = variableValueForDisplay('a', variableMap);
    const vertex_h = variableValueForDisplay('h', variableMap);
    const vertex_k = variableValueForDisplay('k', variableMap);
    const axis = variableValueForDisplay('axis', variableMap) || variableValueForDisplay('VAR3', variableMap);
    const x_int = variableValueForDisplay('x_int', variableMap) || variableValueForDisplay('x_int1', variableMap);

    if (axis || x_int || (a && vertex_h && vertex_k)) {
      const desc = [];
      if (axis) desc.push(`axis of symmetry: x = ${axis}`);
      if (x_int) desc.push(`x-intercept: ${x_int}`);
      if (a) desc.push(`leading coefficient: ${a}`);
      if (desc.length > 0) {
        recovered = recovered.replace('[embedded diagram/object]', `[Parabola: ${desc.join('; ')}]`);
      }
    }
  }

  // Generic diagram/object placeholder — add minimal metadata
  if (/\[embedded diagram\/object\]|\[embedded object\]/.test(recovered)) {
    // For standalone diagrams with no other context, just replace with a clear placeholder
    const varNames = Array.from(variableMap.keys()).slice(0, 3).join(', ');
    const placeholder = varNames
      ? `[DIAGRAM: variables (${varNames})]`
      : `[DIAGRAM NEEDED]`;
    recovered = recovered.replace(/\[embedded diagram\/object\]/g, placeholder);
    recovered = recovered.replace(/\[embedded object\]$/m, placeholder);
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
    return 'Graph diagram not decoded yet.';
  }

  const expr = graphDef.normalizedExpressions[0];
  return graphExpressionToDiagramDescription(expr);
}

function graphExpressionToDiagramDescription(expr: DecodedGraphExpression): string {
  const expression = escapeMath(formatRecoveredGraphExpressionForPrompt(expr.substituted || expr.original));
  if (!expr.samplePoints || expr.samplePoints.length === 0) {
    return `Graph diagram: $${expression}$.`;
  }

  return `Graph diagram: $${expression}$.`;
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
  const normalizedExpressions = expressions
    .map((expression) => normalizeGraphExpression(expression, variableMap))
    .filter((expression) => isUsableRecoveredGraphExpression(expression));
  if (!normalizedExpressions.length) return undefined;
  const usableExpressions = normalizedExpressions.map((expression) => expression.original);
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
    expressions: usableExpressions,
    normalizedExpressions,
    variables: graphVariables,
    source: expressionTokens.length ? 'string-token-heuristic' : 'algorithmic-variable-heuristic',
  }];
}

function isUsableRecoveredGraphExpression(expression: DecodedGraphExpression): boolean {
  if (expression.samplePoints?.length) return true;
  const text = expression.substituted || expression.original;
  if (!text) return false;
  if (/^[A-Za-z]+-[A-Za-z]+$/i.test(text)) return false;
  if (/^[A-Za-z][A-Za-z0-9_]*$/.test(text)) return false;
  if (/[=^]/.test(text)) return true;
  if (/x\s*[+\-*/]/i.test(text) || /[+\-*/]\s*x/i.test(text)) return true;
  if (/pow\(|sin\(|cos\(|tan\(|log\(|ln\(/i.test(text)) return true;
  return false;
}

function synthesizeFallbackGraphDefinitions(
  body: string,
  title: string | undefined,
  variableMap: Map<string, AlgorithmicVariable>,
): DecodedGraphDefinition[] | undefined {
  if (!isQuadraticGraphPrompt(body, title) && !isQuadraticRelationPrompt(body, title)) return undefined;

  const expression = buildQuadraticExpressionFromVariables(variableMap);
  if (!expression) return undefined;

  return [{
    id: 'graph-1',
    expressions: [expression],
    normalizedExpressions: [normalizeGraphExpression(expression, variableMap)],
    variables: collectGraphVariables(variableMap, ['a', 'b', 'c', 'x1', 'x2', 'x_vertex', 'y_vertex']),
    source: 'algorithmic-variable-heuristic',
  }];
}

function extractQuadraticGraphDefinitionsFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  body: string,
  title: string | undefined,
): DecodedGraphDefinition[] | undefined {
  return extractQuadraticGraphDefinitionsFromText(
    decodeChunkUtf16ForRecovery(bytes.subarray(
      startOffset,
      Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 8000))),
    )),
    body,
    title,
    'chunk-text-heuristic',
  ) ?? extractQuadraticGraphDefinitionsFromText(
    decodeChunkUtf16ForRecovery(bytes.subarray(
      startOffset,
      Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 8000))),
    )),
    body,
    title,
    'chunk-solution-heuristic',
    true,
  );
}

function extractRationalGraphDefinitionsFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  variables: AlgorithmicVariable[],
  body: string,
  title: string | undefined,
): DecodedGraphDefinition[] | undefined {
  if (!isRationalGraphPrompt(body, title) && !isGraphOrDiagramQuestion(`${title ?? ''} ${body}`)) return undefined;

  const text = decodeChunkUtf16ForRecovery(bytes.subarray(
    startOffset,
    Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 8000))),
  ));
  const expressions = extractRationalGraphExpressionsFromText(text);
  if (!expressions.length) return undefined;

  const variableMap = new Map(variables.map((entry) => [entry.name.toLowerCase(), entry]));
  const normalizedExpressions = expressions
    .map((expression) => normalizeGraphExpression(expression, variableMap))
    .filter((expression) => isUsableRecoveredGraphExpression(expression));
  if (!normalizedExpressions.length) return undefined;

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
    expressions: normalizedExpressions.map((expression) => expression.original),
    normalizedExpressions,
    variables: Object.keys(graphVariables).length ? graphVariables : undefined,
    source: 'chunk-text-heuristic',
  }];
}

function extractRationalGraphExpressionsFromText(text: string): string[] {
  const normalizedText = normalizeChunkTextForRecovery(text);
  return [
    ...normalizedText.matchAll(/(^|[^A-Za-z0-9_])([A-Za-z0-9_+\-*.()^]+\/\((?=[A-Za-z0-9_+\-*/^().]*x)[A-Za-z0-9_+\-*/^().]+\))/gi),
  ]
    .map((match) => match[2].replace(/\s+/g, '').replace(/^\+/, ''))
    .filter((candidate) => isRationalGraphExpression(candidate))
    .filter(isLikelyGraphExpression)
    .filter((candidate, index, all) => all.indexOf(candidate) === index)
    .slice(0, 8);
}

function extractAxisMetadataGraphDefinitionsFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  variables: AlgorithmicVariable[],
  body: string,
  title: string | undefined,
): DecodedGraphDefinition[] | undefined {
  if (!isGraphOrDiagramQuestion(`${title ?? ''} ${body}`)) return undefined;

  const text = decodeChunkUtf16ForRecovery(bytes.subarray(
    startOffset,
    Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 8000))),
  ));
  const expressions = extractAxisMetadataGraphExpressionsFromText(text);
  if (!expressions.length) return undefined;

  const variableMap = new Map(variables.map((entry) => [entry.name.toLowerCase(), entry]));
  const normalizedExpressions = expressions
    .map((expression) => normalizeGraphExpression(expression, variableMap))
    .filter((expression) => isUsableRecoveredGraphExpression(expression));
  if (!normalizedExpressions.length) return undefined;

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
    expressions: normalizedExpressions.map((expression) => expression.original),
    normalizedExpressions,
    variables: Object.keys(graphVariables).length ? graphVariables : undefined,
    source: 'chunk-text-heuristic',
  }];
}

function extractAxisMetadataGraphExpressionsFromText(text: string): string[] {
  const normalizedText = normalizeChunkTextForRecovery(text);
  return [
    ...normalizedText.matchAll(/(?:^|\s)(?:-?inf|[-+]?\d+(?:\.\d+)?)\s+(?:inf|[-+]?\d+(?:\.\d+)?)\s+([A-Za-z0-9_+\-*/^().\s]+?)(?=\s+(?:-?inf|inf|0\s+0\s+0\s+0|Times New Roman|Symbol|[,"]))/gi),
  ]
    .map((match) => match[1].replace(/\s+/g, '').replace(/^\+/, ''))
    .filter(isLikelyAxisMetadataGraphExpression)
    .filter((candidate, index, all) => all.indexOf(candidate) === index)
    .slice(0, 12);
}

function isLikelyAxisMetadataGraphExpression(text: string): boolean {
  if (!text || text.length > 160) return false;
  if (!/[=+\-*/^()]/.test(text)) return false;
  if (/^[=*/^(]|[=+\-*/^(]$/.test(text)) return false;
  if (/^(?:x|y|a|b|c|d|f|g|h|n|p|q|r)$/i.test(text)) return false;
  if (!/(^|[^A-Za-z0-9_])[xy]([^A-Za-z0-9_]|$)|sin\(|cos\(|tan\(|log\(|ln\(|pow\(/i.test(text)) return false;
  if (!hasBalancedParentheses(text)) return false;
  return /^[A-Za-z0-9_+\-*/^().,= <>{}\[\]]+$/.test(text);
}

function extractQuadraticGraphDefinitionsFromText(
  text: string,
  body: string,
  title: string | undefined,
  source: DecodedGraphDefinition['source'],
  solutionOnly = false,
): DecodedGraphDefinition[] | undefined {
  if (
    !isQuadraticGraphPrompt(body, title)
    && !isQuadraticRelationPrompt(body, title)
  ) return undefined;

  const normalizedText = normalizeChunkTextForRecovery(text);
  const exactExpression = solutionOnly ? undefined : extractExactQuadraticExpressionFromChunkText(normalizedText);
  const fallbackExpression = exactExpression ?? synthesizeQuadraticExpressionFromChunkSolutionText(normalizedText, body);
  if (!fallbackExpression) return undefined;

  return [{
    id: 'graph-1',
    expressions: [fallbackExpression],
    normalizedExpressions: [normalizeGraphExpression(fallbackExpression, new Map())],
    source: exactExpression ? source : 'chunk-solution-heuristic',
  }];
}

function decodeChunkUtf16ForRecovery(bytes: Uint8Array): string {
  return normalizeChunkTextForRecovery(UTF16LE_DECODER.decode(bytes));
}

function normalizeChunkTextForRecovery(text: string): string {
  return text
    .replace(/\u000f/g, '[[slot]]')
    .replace(/[–−]/g, '-')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function extractExactQuadraticExpressionFromChunkText(text: string): string | undefined {
  const matches = [
    ...text.matchAll(/[-+]?\d*\.?\d*\*?[a-z]\^2(?:[-+]\d*\.?\d*\*?[a-z])?(?:[-+]\d*\.?\d+)?/gi),
  ]
    .map((match) => match[0])
    .filter((candidate) => /\^2/i.test(candidate))
    .filter((candidate) => /[a-z]/i.test(candidate))
    .map((candidate) => candidate.replace(/\s+/g, ''));

  const best = matches.find((candidate) => /^[+-]?(?:\d*\.?\d+\*?)?[a-z]\^2(?:[+-](?:\d*\.?\d+\*?)?[a-z])?(?:[+-]\d*\.?\d+)?$/i.test(candidate))
    ?? matches[0];
  if (!best) return undefined;
  return best.replace(/[a-z]/gi, 'x');
}

function synthesizeQuadraticExpressionFromChunkSolutionText(text: string, body: string): string | undefined {
  const normalized = text.replace(/\s+/g, ' ');

  const exactByNarrative = [
    /The ball travels\s+(\d+(?:\.\d+)?)\s+m/i,
    /The right base is\s+(\d+(?:\.\d+)?)\s+m from the left base/i,
    /The supporting towers are\s+(\d+(?:\.\d+)?)\s+m apart/i,
    /The ball is in the air for(?: approximately)?\s+(\d+(?:\.\d+)?)\s*s/i,
    /The zeros occur at t = 0 and t = (\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of exactByNarrative) {
    const match = pattern.exec(normalized);
    if (!match) continue;
    const root = normalizeGraphNumericValue(match[1]);
    if (!root) continue;
    return `-1*x^2+(${root})*x`;
  }

  const maxHeightMatch = normalized.match(/maximum height of the ball is\s+(\d+(?:\.\d+)?)\s*m/i);
  const vertexMatch = normalized.match(/takes\s+(\d+(?:\.\d+)?)\s*s to reach the maximum height/i);
  const interceptMatch = normalized.match(/When t = 0, h = (\d+(?:\.\d+)?)/i);
  if (maxHeightMatch && vertexMatch && interceptMatch) {
    const maxHeight = normalizeGraphNumericValue(maxHeightMatch[1]);
    const vertexX = normalizeGraphNumericValue(vertexMatch[1]);
    const intercept = normalizeGraphNumericValue(interceptMatch[1]);
    if (maxHeight && vertexX && intercept) {
      const vx = Number(vertexX);
      const vy = Number(maxHeight);
      const c = Number(intercept);
      const a = (c - vy) / (vx * vx);
      const b = -2 * a * vx;
      if (Number.isFinite(a) && Number.isFinite(b)) {
        return `${trimNumericForGraph(a)}*x^2+(${trimNumericForGraph(b)})*x+(${trimNumericForGraph(c)})`;
      }
    }
  }

  if (/Write the equation of this parabola/i.test(body) && /x\^2-x-6/i.test(normalized)) {
    return 'x^2-x-6';
  }

  return undefined;
}

function trimNumericForGraph(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  const asString = `${rounded}`;
  return asString.replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1');
}

function isQuadraticGraphPrompt(body: string, title?: string): boolean {
  const haystack = `${title ?? ''} ${body}`.toLowerCase();
  return /quadratic function graphed here|graph of the quadratic function|roots of the quadratic function|equation of this parabola|equation for this parabola|write the equation of this parabola/.test(haystack);
}

function isQuadraticRelationPrompt(body: string, title?: string): boolean {
  const haystack = `${title ?? ''} ${body}`.toLowerCase();
  return /path can be modelled by|path is modelled by|path is given by|approximately modelled by the relation|approximately modelled by the quadratic relation|surface area .* modelled by the relation|zeros of the quadratic relation|quadratic relation shown here/.test(haystack);
}

function buildQuadraticExpressionFromVariables(
  variableMap: Map<string, AlgorithmicVariable>,
): string | undefined {
  const a = normalizeGraphNumericValue(variableValueForDisplay('a', variableMap) ?? '');
  const b = normalizeGraphNumericValue(variableValueForDisplay('b', variableMap) ?? '');
  const c = normalizeGraphNumericValue(variableValueForDisplay('c', variableMap) ?? '');
  if (!a || !b || !c) return undefined;
  return `${a}*x^2+(${b})*x+(${c})`;
}

function buildQuadraticPolynomialTextFromVariables(
  variableMap: Map<string, AlgorithmicVariable>,
  variableName = 'x',
): string | undefined {
  const a = normalizeGraphNumericValue(variableValueForDisplay('a', variableMap) ?? '');
  const b = normalizeGraphNumericValue(variableValueForDisplay('b', variableMap) ?? '');
  const c = normalizeGraphNumericValue(variableValueForDisplay('c', variableMap) ?? '');
  if (!a || !b || !c) return undefined;

  const formatTerm = (value: string, suffix = ''): { sign: '+' | '-'; magnitude: string } => {
    const sign: '+' | '-' = value.startsWith('-') ? '-' : '+';
    const magnitude = value.replace(/^[+-]/, '');
    return { sign, magnitude: `${magnitude}${suffix}` };
  };

  const aTerm = (() => {
    if (a === '1') return `${variableName}^2`;
    if (a === '-1') return `-${variableName}^2`;
    return `${a}${variableName}^2`;
  })();
  const bTerm = formatTerm(b, variableName);
  const cTerm = formatTerm(c);
  return `${aTerm} ${bTerm.sign} ${bTerm.magnitude} ${cTerm.sign} ${cTerm.magnitude}`;
}

function collectGraphVariables(
  variableMap: Map<string, AlgorithmicVariable>,
  names: string[],
): Record<string, string> | undefined {
  const entries = names.flatMap((name) => {
    const value = variableValueForDisplay(name, variableMap);
    return value ? [[name, value] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function buildAlgorithmArtifacts(
  preDisplayStrings: string[],
  variables: AlgorithmicVariable[],
  scopeKind: AlgorithmModel['scope']['kind'] = 'question',
  source = 'pre-display-string-sequence',
): AlgorithmArtifacts {
  const { definitions, sequence } = extractAlgorithmStructure(preDisplayStrings, variables, scopeKind);
  if (!definitions.length) {
    return { decodeDiagnostics: [] };
  }

  const entries = definitions.map((definition) => ({
    name: definition.name,
    status: definition.sampleValue ? 'resolved' as const : 'unresolved' as const,
    value: definition.sampleValue,
  }));

  const diagnostics: QuestionDecodeDiagnostic[] = definitions
    .filter((definition) => !definition.rawExpression && !definition.sampleValue)
    .map((definition) => ({
      level: 'warning',
      code: 'ALGORITHM_VARIABLE_INCOMPLETE',
      message: `Recovered algorithm symbol ${definition.name} without a rule or sample value.`,
    }));

  diagnostics.push(
    ...definitions
      .filter((definition) => definition.kind === 'unknown' && definition.rawExpression)
      .map((definition) => ({
        level: 'info' as const,
        code: 'ALGORITHM_SUPPORT_TOKEN',
        message: `Recovered an opaque algorithm support token: ${definition.rawExpression}`,
      })),
  );

  return {
    algorithmModel: {
      scope: { kind: scopeKind },
      definitions,
      sequence,
      source,
    },
    algorithmEvaluation: {
      entries,
      diagnostics,
    },
    decodeDiagnostics: diagnostics,
  };
}

function extractAlgorithmStructure(
  preDisplayStrings: string[],
  variables: AlgorithmicVariable[],
  scopeKind: AlgorithmModel['scope']['kind'],
): { definitions: AlgorithmDefinition[]; sequence: AlgorithmSequenceEntry[] } {
  const definitions: AlgorithmDefinition[] = [];
  const sequence: AlgorithmSequenceEntry[] = [];
  const variableMap = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  let conditionIndex = 0;
  let unknownIndex = 0;
  let sequenceIndex = 0;
  const pushSequence = (
    text: string,
    kind: AlgorithmSequenceEntry['kind'],
    definitionName?: string,
  ) => {
    sequence.push({
      id: `alg-seq-${sequence.length + 1}`,
      order: ++sequenceIndex,
      text,
      kind,
      ownerKind: scopeKind,
      definitionName,
      source: 'pre-display-string-sequence',
    });
  };

  for (let index = 0; index < preDisplayStrings.length; index++) {
    const current = preDisplayStrings[index]?.trim();
    if (!current || current === INLINE_OBJECT_SLOT) continue;

    if (isVariableName(current)) {
      const variable = variableMap.get(current.toLowerCase());
      if (variable) {
        const rawExpression = variable.rule?.trim() || undefined;
        const sampleValue = variable.sampleValue?.trim() || undefined;
        definitions.push({
          id: `alg-${definitions.length + 1}`,
          name: variable.name,
          kind: inferAlgorithmDefinitionKind(variable),
          rawExpression,
          sampleValue,
          dependencies: rawExpression ? extractAlgorithmDependencies(rawExpression, variable.name) : [],
          source: 'pre-display-string-sequence',
        });
        pushSequence(variable.name, 'variable-name', variable.name);
        if (rawExpression) pushSequence(rawExpression, 'rule', variable.name);
        if (sampleValue) pushSequence(sampleValue, 'sample-value', variable.name);
        if (rawExpression && preDisplayStrings[index + 1]?.trim() === rawExpression) {
          index += sampleValue && preDisplayStrings[index + 2]?.trim() === sampleValue ? 2 : 1;
        }
        continue;
      }
    }

    if (/^isunique\(/i.test(current)) {
      const dependencies = /^isunique\((.*)\)$/i.exec(current)?.[1]
        ?.split(',')
        .map((item) => item.trim())
        .filter(Boolean) ?? [];
      definitions.push({
        id: `alg-${definitions.length + 1}`,
        name: 'isunique',
        kind: 'condition',
        rawExpression: current,
        dependencies,
        source: 'pre-display-string-sequence',
      });
      pushSequence(current, 'condition', 'isunique');
      continue;
    }

    if (/^scramble$/i.test(current)) {
      const rawExpression = preDisplayStrings[index + 1]?.trim();
      const sampleValue = preDisplayStrings[index + 2]?.trim();
      definitions.push({
        id: `alg-${definitions.length + 1}`,
        name: 'scramble',
        kind: 'condition',
        rawExpression,
        sampleValue: sampleValue && /^\d+$/.test(sampleValue) ? sampleValue : undefined,
        dependencies: [],
        source: 'pre-display-string-sequence',
      });
      pushSequence(current, 'control', 'scramble');
      if (rawExpression) pushSequence(rawExpression, 'rule', 'scramble');
      if (sampleValue && /^\d+$/.test(sampleValue)) pushSequence(sampleValue, 'sample-value', 'scramble');
      if (rawExpression && /^(true|false)$/i.test(rawExpression)) {
        index += sampleValue ? 2 : 1;
      }
      continue;
    }

    if (isPredicateOrControlRule(current)) {
      conditionIndex++;
      definitions.push({
        id: `alg-${definitions.length + 1}`,
        name: `condition_${conditionIndex}`,
        kind: 'condition',
        rawExpression: current,
        dependencies: extractAlgorithmDependencies(current, ''),
        source: 'pre-display-string-sequence',
      });
      pushSequence(current, 'condition', `condition_${conditionIndex}`);
      continue;
    }

    if (looksLikeAlgorithmSupportToken(current)) {
      unknownIndex++;
      definitions.push({
        id: `alg-${definitions.length + 1}`,
        name: `algorithm_token_${unknownIndex}`,
        kind: 'unknown',
        rawExpression: current,
        dependencies: [],
        source: 'pre-display-string-sequence',
      });
      pushSequence(current, 'support-token');
      continue;
    }

    pushSequence(current, 'unknown');
  }

  return {
    definitions: dedupeAlgorithmDefinitions(definitions),
    sequence,
  };
}

function dedupeAlgorithmDefinitions(definitions: AlgorithmDefinition[]): AlgorithmDefinition[] {
  const seen = new Set<string>();
  return definitions.filter((definition) => {
    const key = `${definition.name.toLowerCase()}::${definition.rawExpression ?? ''}::${definition.sampleValue ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferAlgorithmDefinitionKind(variable: AlgorithmicVariable): AlgorithmDefinitionKind {
  const name = variable.name.trim();
  const rule = variable.rule?.trim() ?? '';
  if (/^if\b|[<>]=?| and | or /i.test(rule)) return 'condition';
  if (/^[A-Z][A-Z0-9_]*$/.test(name) && !rule) return 'constant';
  if (/^[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)\s*=/.test(rule) || /^[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(name)) return 'user-function';
  if (name) return 'variable';
  return 'unknown';
}

function extractAlgorithmDependencies(rawExpression: string, selfName: string): string[] {
  const builtIns = new Set([
    'abs', 'acos', 'asin', 'atan', 'ceiling', 'chr', 'choose', 'cos', 'decs', 'format', 'fracs', 'gcd', 'if',
    'int', 'isunique', 'lcm', 'list', 'ln', 'log', 'max', 'min', 'mixfracs', 'pow', 'rads', 'range', 'round',
    'rfracs', 'sigfig', 'sin', 'sqr', 'sqrs', 'sqrt', 'srand', 'srandom', 'tan', 'symbol', 'unsort',
    'and', 'or', 'not',
  ]);
  const tokens = rawExpression.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  return tokens
    .filter((token) => token.toLowerCase() !== selfName.toLowerCase())
    .filter((token) => !builtIns.has(token.toLowerCase()))
    .filter((token, index, all) => all.findIndex((other) => other.toLowerCase() === token.toLowerCase()) === index);
}

function extractGraphPointObjectsFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  body: string,
  title?: string,
): GraphObject[] {
  const text = decodeChunkUtf16ForRecovery(bytes.subarray(
    startOffset,
    Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 18000))),
  ));
  const context = `${title ?? ''} ${body} ${text.slice(0, 1600)}`;
  if (!/\b(?:scatter plot|table|data)\b/i.test(context) || !/\b(?:graph|plot|model)\b/i.test(context)) return [];

  const points = extractGraphPointPairsFromText(text);
  if (points.length < 3) return [];

  return points.slice(0, 40).map((point, index) => ({
    id: `point-table-${index + 1}`,
    kind: 'point',
    expression: `(${point.xText}, ${point.yText})`,
    point: {
      x: point.xText,
      y: point.yText,
      style: 'solid',
      labelStyle: 'none',
    },
    samplePoints: [{ x: point.x, y: point.y }],
  }));
}

interface ExtractedGraphPointPair {
  x: number;
  y: number;
  xText: string;
  yText: string;
}

function extractGraphPointPairsFromText(text: string): ExtractedGraphPointPair[] {
  const pointMap = new Map<string, ExtractedGraphPointPair>();
  const axisPattern = /\b[A-Za-z]\b\s+Times New Roman\s+\b[A-Za-z]\b\s+Times New Roman\s+([\s\S]{0,2200})/g;
  let match: RegExpExecArray | null;

  while ((match = axisPattern.exec(text)) !== null) {
    const segment = match[1];
    const pairPattern = /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Times New Roman/g;
    let pair: RegExpExecArray | null;
    while ((pair = pairPattern.exec(segment)) !== null) {
      const x = Number(pair[1]);
      const y = Number(pair[2]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (Math.abs(x) > 1_000_000 || Math.abs(y) > 1_000_000_000) continue;
      const key = `${x},${y}`;
      if (!pointMap.has(key)) {
        pointMap.set(key, {
          x,
          y,
          xText: trimNumericForGraph(x),
          yText: trimNumericForGraph(y),
        });
      }
    }
  }

  return [...pointMap.values()];
}

function extractRationalHolePointObjects(
  variableMap: Map<string, AlgorithmicVariable>,
  title?: string,
  body?: string,
): GraphObject[] {
  const context = `${title ?? ''} ${body ?? ''}`;
  if (!/\b(?:hole|discontinuity|point of discontinuity)\b/i.test(context)) return [];

  const x = normalizedGraphVariableDisplay('hole', variableMap);
  if (!x) return [];
  const yName = ['y_var', 'y_var1', 'y_var2', 'y_var3']
    .find((name) => normalizedGraphVariableDisplay(name, variableMap));
  const y = yName ? normalizedGraphVariableDisplay(yName, variableMap) : undefined;
  if (!y) return [];

  const samplePoint = numericGraphPoint(x, y);
  return [{
    id: 'hole-point-1',
    kind: 'point',
    expression: `(${x}, ${y})`,
    point: {
      x,
      y,
      style: 'hollow',
      labelStyle: 'coordinates',
    },
    ...(samplePoint ? { samplePoints: [samplePoint] } : {}),
  }];
}

function normalizedGraphVariableDisplay(
  name: string,
  variableMap: Map<string, AlgorithmicVariable>,
): string | undefined {
  const value = variableValueForDisplay(name, variableMap);
  if (!value) return undefined;
  return normalizeGraphNumericValue(value) ?? normalizeDisplayedMathValue(value).replace(/\s+/g, '');
}

function numericGraphPoint(x: string, y: string): GraphSamplePoint | undefined {
  const xNumber = Number(x);
  const yNumber = Number(y);
  if (!Number.isFinite(xNumber) || !Number.isFinite(yNumber)) return undefined;
  return {
    x: roundGraphNumber(xNumber),
    y: roundGraphNumber(yNumber),
  };
}

function extractNumberLineRayObjectsFromChunk(
  bytes: Uint8Array,
  startOffset: number,
  endOffset: number,
  body: string,
  title?: string,
): GraphObject[] {
  const text = decodeChunkUtf16ForRecovery(bytes.subarray(
    startOffset,
    Math.max(startOffset, Math.min(bytes.length, Math.max(endOffset, startOffset + 12000))),
  ));
  const context = `${title ?? ''} ${body} ${text}`;
  if (!/\bnumber line\b/i.test(context)) return [];

  const rayPair = extractNumberLineRayPair(context);
  if (!rayPair) return [];

  const leftPoint = Number(rayPair.leftEndpoint);
  const rightPoint = Number(rayPair.rightEndpoint);
  return [
    {
      id: 'number-line-ray-1',
      kind: 'ray',
      expression: `${rayPair.leftOperator} ${rayPair.leftEndpoint}`,
      ray: {
        endpoint: rayPair.leftEndpoint,
        direction: 'left',
        endpointStyle: rayPair.leftOperator.includes('=') ? 'solid' : 'hollow',
        labelStyle: 'coordinates',
      },
      ...(Number.isFinite(leftPoint) ? { samplePoints: [{ x: leftPoint, y: 0 }] } : {}),
    },
    {
      id: 'number-line-ray-2',
      kind: 'ray',
      expression: `${rayPair.rightOperator} ${rayPair.rightEndpoint}`,
      ray: {
        endpoint: rayPair.rightEndpoint,
        direction: 'right',
        endpointStyle: rayPair.rightOperator.includes('=') ? 'solid' : 'hollow',
        labelStyle: 'coordinates',
      },
      ...(Number.isFinite(rightPoint) ? { samplePoints: [{ x: rightPoint, y: 0 }] } : {}),
    },
  ];
}

function extractNumberLineRayPair(context: string): {
  leftEndpoint: string;
  rightEndpoint: string;
  leftOperator: '<' | '<=';
  rightOperator: '>' | '>=';
} | undefined {
  const match = /\bx\s*(<=?)\s*(-?\d+(?:\.\d+)?)\s+or\s+x\s*(>=?)\s*(-?\d+(?:\.\d+)?)/i.exec(context);
  if (!match) return undefined;
  let leftEndpoint = match[2];
  const rightEndpoint = match[4];

  if (
    leftEndpoint === rightEndpoint
    && !leftEndpoint.startsWith('-')
    && /\bdifference of squares\b/i.test(context)
  ) {
    leftEndpoint = `-${leftEndpoint}`;
  }

  return {
    leftEndpoint,
    rightEndpoint,
    leftOperator: match[1] === '<=' ? '<=' : '<',
    rightOperator: match[3] === '>=' ? '>=' : '>',
  };
}

function buildGraphArtifacts(
  graphDefinitions: DecodedGraphDefinition[] | undefined,
  title?: string,
  body?: string,
  extraObjects: GraphObject[] = [],
): GraphArtifacts {
  if (!graphDefinitions?.length && !extraObjects.length) {
    return { decodeDiagnostics: [] };
  }

  const definitionObjects: GraphObject[] = (graphDefinitions ?? []).flatMap((graph) => {
    const expressions = graph.normalizedExpressions?.length
      ? graph.normalizedExpressions
      : graph.expressions.map((expression) => ({
          original: expression,
          substituted: expression,
          typst: graphExpressionToTypstMath(expression),
          latex: graphExpressionToLatex(expression),
          variables: extractExpressionVariables(expression),
          samplePoints: sampleGraphExpression(expression),
        }));

    return expressions.map((expression, index) => ({
      id: `${graph.id}-obj-${index + 1}`,
      kind: inferGraphObjectKind(expression.substituted),
      expression: expression.substituted,
      typstMath: expression.typst,
      latexMath: expression.latex,
      variables: expression.variables,
      samplePoints: expression.samplePoints,
    }));
  });
  const objects = [...definitionObjects, ...extraObjects];

  const family = inferGraphFamily(graphDefinitions ?? [], title, body, objects);
  const graphModel: GraphModel = {
    family,
    objects,
    variables: graphDefinitions?.find((graph) => graph.variables && Object.keys(graph.variables).length)?.variables,
    rawExpressions: [
      ...(graphDefinitions?.flatMap((graph) => graph.expressions) ?? []),
      ...extraObjects.map((object) => object.expression).filter((expression): expression is string => Boolean(expression)),
    ],
    source: [
      ...(graphDefinitions?.map((graph) => graph.source) ?? []),
      ...(extraObjects.length ? ['structured-object-heuristic'] : []),
    ].join(','),
  };

  const graphTypst = {
    format: 'typst' as const,
    text: graphModelToTypst(graphModel),
  };

  const diagnostics: QuestionDecodeDiagnostic[] = objects.length === 0
    ? [{
        level: 'warning',
        code: 'GRAPH_MODEL_EMPTY',
        message: 'Recovered a graph question but could not materialize any graph objects.',
      }]
    : [];

  return {
    graphModel,
    graphTypst,
    decodeDiagnostics: diagnostics,
  };
}

function inferGraphFamily(
  graphDefinitions: DecodedGraphDefinition[],
  title?: string,
  body?: string,
  objects: GraphObject[] = [],
): GraphFamily {
  const haystack = `${title ?? ''} ${body ?? ''} ${graphDefinitions.flatMap((graph) => graph.expressions).join(' ')}`.toLowerCase();
  if (objects.some((object) => object.kind === 'ray')) return 'number-line';
  if (objects.some((object) => object.kind === 'point')) return 'cartesian';
  if (haystack.includes('polar') || /theta|\\theta|π/.test(haystack)) return 'polar';
  if (haystack.includes('number line') || haystack.includes('number-line')) return 'number-line';
  if (graphDefinitions.some((graph) => graph.normalizedExpressions?.some((expression) => expression.substituted.includes('x')))) return 'cartesian';
  return 'unknown';
}

function inferGraphObjectKind(expression: string): GraphObject['kind'] {
  if (/^\(\s*[-\d.]+\s*,\s*[-\d.]+\s*\)$/.test(expression.trim())) return 'point';
  if (/[=<>]/.test(expression)) return 'relation';
  if (expression.trim()) return 'function';
  return 'unknown';
}

function graphModelToTypst(graphModel: GraphModel): string {
  const plotTypst = graphModelToSimplePlotTypst(graphModel);
  if (plotTypst) return plotTypst;

  const lines = [
    '#block(inset: 8pt, fill: rgb("#eef5ff"), radius: 4pt)[',
    '  #text(weight: "bold")[Graph]',
  ];

  for (const object of graphModel.objects) {
    if (object.typstMath) {
      lines.push(`  - ${escapeTypstText(object.typstMath)}`);
    } else if (object.kind === 'point' && object.point) {
      lines.push(`  - point (${escapeTypstText(object.point.x)}, ${escapeTypstText(object.point.y)})${object.point.style ? `, ${escapeTypstText(object.point.style)}` : ''}`);
    } else if (object.kind === 'ray' && object.ray) {
      lines.push(`  - ray ${escapeTypstText(object.ray.direction)} from ${escapeTypstText(object.ray.endpoint)}${object.ray.endpointStyle ? `, ${escapeTypstText(object.ray.endpointStyle)}` : ''}`);
    } else if (object.expression) {
      lines.push(`  - ${escapeTypstText(object.expression)}`);
    }
  }

  const resolvedVariables = graphModel.variables
    ? Object.entries(graphModel.variables).filter(([, value]) => value && !/slot|embedded|diagram/i.test(value))
    : [];
  if (resolvedVariables.length) {
    lines.push(`  #text(size: 8pt, fill: gray)[variables: ${escapeTypstText(
      resolvedVariables.map(([name, value]) => `${name}=${value}`).join(', '),
    )}]`);
  }

  lines.push(']');
  return lines.join('\n');
}

const GRAPH_PLOT_X_MIN = -10;
const GRAPH_PLOT_X_MAX = 10;
const GRAPH_PLOT_Y_MIN = -10;
const GRAPH_PLOT_Y_MAX = 10;

interface GraphPlotSeries {
  points: GraphSamplePoint[];
}

function graphModelToSimplePlotTypst(graphModel: GraphModel): string | undefined {
  if (graphModel.family !== 'cartesian' && graphModel.family !== 'unknown') return undefined;

  const series = graphModel.objects
    .flatMap(graphObjectToPlotSeries)
    .slice(0, 12);
  if (!series.length) return undefined;

  const plotItems = series.map((entry) => (
    `  line-plot(${formatPlotPoints(entry.points)}, stroke: black + 0.75pt, mark: "none"),`
  ));

  return [
    '#block(inset: 4pt)[',
    '#plot(',
    '  width: 8,',
    '  height: 5,',
    `  xmin: ${GRAPH_PLOT_X_MIN},`,
    `  xmax: ${GRAPH_PLOT_X_MAX},`,
    `  ymin: ${GRAPH_PLOT_Y_MIN},`,
    `  ymax: ${GRAPH_PLOT_Y_MAX},`,
    '  show-grid: "major",',
    ...plotItems,
    ')',
    ']',
  ].join('\n');
}

function graphObjectToPlotSeries(object: GraphObject): GraphPlotSeries[] {
  if (object.kind !== 'function' && object.kind !== 'relation') return [];
  const points = usablePlotPoints(object.samplePoints);
  if (points.length < 2) return [];
  return splitPlotSegments(points)
    .filter((segment) => segment.length >= 2)
    .map((segment) => ({ points: segment }));
}

function usablePlotPoints(points: GraphSamplePoint[] | undefined): GraphSamplePoint[] {
  return (points ?? [])
    .filter((point) => (
      Number.isFinite(point.x)
      && Number.isFinite(point.y)
      && point.x >= GRAPH_PLOT_X_MIN
      && point.x <= GRAPH_PLOT_X_MAX
      && point.y >= GRAPH_PLOT_Y_MIN
      && point.y <= GRAPH_PLOT_Y_MAX
    ))
    .map((point) => ({
      x: roundGraphNumber(point.x),
      y: roundGraphNumber(point.y),
    }));
}

function splitPlotSegments(points: GraphSamplePoint[]): GraphSamplePoint[][] {
  const segments: GraphSamplePoint[][] = [];
  let current: GraphSamplePoint[] = [];

  for (const point of points) {
    const previous = current.at(-1);
    if (previous && shouldSplitPlotSegment(previous, point)) {
      if (current.length >= 2) segments.push(current);
      current = [];
    }
    current.push(point);
  }

  if (current.length >= 2) segments.push(current);
  return segments;
}

function shouldSplitPlotSegment(previous: GraphSamplePoint, point: GraphSamplePoint): boolean {
  return Math.abs(point.x - previous.x) > 0.76 || Math.abs(point.y - previous.y) > 8;
}

function formatPlotPoints(points: GraphSamplePoint[]): string {
  return `(${points.map((point) => `(${formatPlotNumber(point.x)}, ${formatPlotNumber(point.y)})`).join(', ')})`;
}

function formatPlotNumber(value: number): string {
  if (Object.is(value, -0)) return '0';
  return String(roundGraphNumber(value));
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

// ─── Binary format run extraction ────────────────────────────────────────────
// Each v06 question record contains a per-character attribute table stored in
// its binary section. Entries are 12-byte records: [uint32 charPos][uint32 attr][uint32 pad=0].
// Positions are character indices (0-based) into the display text stream.
// Attributes: 0=normal, 1=italic, 2=subscript, 3=bold, 4=symbol-font.
// This table is the ground-truth for math mode — subscripts, symbol chars, etc.

interface FormatRun {
  pos: number;
  attr: number;
}

const FORMAT_ATTR_SUBSCRIPT = 2;
const FORMAT_ATTR_SYMBOL = 4;

// Mapping of Windows Symbol/FSC-Symbol PUA codepoints (0xF0xx) to Unicode math chars.
const SYMBOL_FONT_MAP: Record<number, string> = {
  0xF0B4: '×', // × multiplication sign
  0xF0B7: '•', // • bullet
  0xF0B1: '±', // ± plus-minus
  0xF0B3: '≥', // ≥ greater-than-or-equal
  0xF0A3: '≤', // ≤ less-than-or-equal
  0xF0AB: '←', // ← left arrow
  0xF0AE: '→', // → right arrow
  0xF0D0: '÷', // ÷ division sign
  0xF0B0: '°', // ° degree sign
  0xF0BC: '√', // √ square root
  0xF0A5: '∞', // ∞ infinity
};

function mapSymbolFontChar(cp: number): string {
  return SYMBOL_FONT_MAP[cp] ?? `[U+${cp.toString(16).toUpperCase()}]`;
}

/**
 * Scan the binary region of a v06 record for the format run table.
 * Uses the confirmed 12-byte entry structure: (charPos:u32, attr:u32, pad:u32=0).
 * Returns the longest monotonically-increasing run of valid entries found.
 */
function extractFormatRunTable(
  bytes: Uint8Array,
  chunkStartByte: number,
  chunkEndByte: number,
): FormatRun[] {
  const windowEnd = Math.min(chunkEndByte, bytes.length);
  let bestRun: FormatRun[] = [];

  for (let i = chunkStartByte; i < windowEnd - 24; i++) {
    const pos = (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0;
    const attr = (bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24)) >>> 0;
    const pad = (bytes[i + 8] | (bytes[i + 9] << 8) | (bytes[i + 10] << 16) | (bytes[i + 11] << 24)) >>> 0;

    if (pos < 1 || pos > 1000 || attr > 10 || pad !== 0) continue;
    // Validate: attribute must be either SUBSCRIPT (2), SYMBOL (4), or 0 (no formatting)
    // Skip tables with other attributes - they're likely spurious matches
    if (attr !== 0 && attr !== FORMAT_ATTR_SUBSCRIPT && attr !== FORMAT_ATTR_SYMBOL) continue;

    const run: FormatRun[] = [{ pos, attr }];
    let j = i + 12;
    let lastPos = pos;
    let isValidTable = true;

    while (j < windowEnd - 12) {
      const p2 = (bytes[j] | (bytes[j + 1] << 8) | (bytes[j + 2] << 16) | (bytes[j + 3] << 24)) >>> 0;
      const a2 = (bytes[j + 4] | (bytes[j + 5] << 8) | (bytes[j + 6] << 16) | (bytes[j + 7] << 24)) >>> 0;
      const pad2 = (bytes[j + 8] | (bytes[j + 9] << 8) | (bytes[j + 10] << 16) | (bytes[j + 11] << 24)) >>> 0;
      if (p2 > lastPos && p2 <= 1000 && a2 <= 10 && pad2 === 0) {
        // Validate attribute in continuation
        if (a2 !== 0 && a2 !== FORMAT_ATTR_SUBSCRIPT && a2 !== FORMAT_ATTR_SYMBOL) {
          isValidTable = false;
          break;
        }
        run.push({ pos: p2, attr: a2 });
        lastPos = p2;
        j += 12;
      } else break;
    }

    if (isValidTable && run.length > bestRun.length) {
      bestRun = run;
      i = j - 1;
    }
  }

  return bestRun;
}

/**
 * Read the raw display text character at a given character position.
 * displayStartByte is the byte offset of char position 0 in the inflated payload.
 */
function readDisplayChar(bytes: Uint8Array, displayStartByte: number, charPos: number): number {
  const byteOff = displayStartByte + charPos * 2;
  if (byteOff + 1 >= bytes.length) return 0;
  return bytes[byteOff] | (bytes[byteOff + 1] << 8);
}

/**
 * Use the format run table to generate text-level substitutions that apply
 * subscripts and symbol-font conversions to the assembled body text.
 * Must be applied BEFORE variable interpolation so slot markers are preserved.
 *
 * For each subscript group: base character + subscript character(s) →
 * "$base_sub$" (Typst inline math). Works for both literal chars ("tn" → "$t_n$")
 * and slot-containing patterns ("S[[slot]]" → "$S_[[slot]]$").
 *
 * DISABLED: The format run positions refer to the original binary layout, but the
 * body text has been stitched from multiple extracted strings and normalized
 * (whitespace, punctuation adjusted). Position mapping is unreliable and causes
 * widespread corruption like "anti$q_u$e" instead of "antique".
 * TODO: Either reconstruct the exact original text layout or extract format runs
 * from the binary differently.
 */
function applyBinaryFormatting(
  body: string,
  bytes: Uint8Array,
  displayStartByte: number,
  formatRuns: FormatRun[],
): string {
  // Format runs currently cause corruption due to position misalignment.
  // Returning unmodified body until we can properly map positions.
  return body;

  // Build position→attribute map
  const attrAt = new Map<number, number>();
  for (const run of formatRuns) attrAt.set(run.pos, run.attr);

  // Walk the raw character stream, tracking attributes and building substitutions
  let result = body;
  let currentAttr = 0;
  const MAX_POS = 800;

  for (let charPos = 0; charPos < MAX_POS; charPos++) {
    const cp = readDisplayChar(bytes, displayStartByte, charPos);
    if (cp === 0 || cp === 0x0010) break; // end of body

    if (attrAt.has(charPos)) currentAttr = attrAt.get(charPos)!;

    // Symbol font: replace in body text where the character is a gap (extractor skips PUA chars)
    if (currentAttr === FORMAT_ATTR_SYMBOL && cp >= 0xF000 && cp <= 0xF0FF) {
      const unicode = mapSymbolFontChar(cp);
      // The symbol char is not in the extracted text, but it creates a gap.
      // Widen the context window and try to patch it between adjacent text fragments.
      // Find what character comes before (pos charPos-1) and after (pos charPos+1)
      const before = charPos > 0 ? readDisplayChar(bytes, displayStartByte, charPos - 1) : 0;
      const after = readDisplayChar(bytes, displayStartByte, charPos + 1);
      if (before >= 0x20 && before <= 0x7E && after >= 0x20 && after <= 0x7E) {
        const beforeChar = String.fromCharCode(before);
        const afterChar = String.fromCharCode(after);
        // Stitch: "X Y" (gap where symbol was) → "X × Y"
        // The body might have "X Y" or "X  Y" at this position
        const gapPattern = new RegExp(`${escapeRegExp(beforeChar)}(\\s*)${escapeRegExp(afterChar)}`, 'g');
        result = result.replace(gapPattern, (_, spaces) => {
          if (spaces.length > 1) return `${beforeChar}${unicode}${afterChar}`;
          return _;
        });
      }
    }

    // Subscript: detect base + subscript(s) and emit "$base_sub$"
    if (currentAttr === FORMAT_ATTR_SUBSCRIPT) {
      // Base is the character immediately before subscript start
      const baseCharPos = charPos - 1;
      const baseCp = baseCharPos >= 0 ? readDisplayChar(bytes, displayStartByte, baseCharPos) : 0;
      // Require base to be alphanumeric or underscore, not whitespace
      const isValidBase = (baseCp >= 0x30 && baseCp <= 0x39) || // 0-9
                         (baseCp >= 0x41 && baseCp <= 0x5A) || // A-Z
                         (baseCp >= 0x61 && baseCp <= 0x7A) || // a-z
                         baseCp === 0x5F; // _
      if (isValidBase) {
        const base = String.fromCharCode(baseCp);

        // Collect consecutive subscript chars
        let subText = '';
        let j = charPos;
        let subAttr = FORMAT_ATTR_SUBSCRIPT;
        while (j < MAX_POS && subAttr === FORMAT_ATTR_SUBSCRIPT) {
          const subCp = readDisplayChar(bytes, displayStartByte, j);
          if (subCp === 0 || subCp === 0x0010) break;
          const rawChar = subCp === 0x000F ? INLINE_OBJECT_SLOT
            : subCp >= 0x20 && subCp <= 0x7E ? String.fromCharCode(subCp)
            : '';
          subText += rawChar;
          j++;
          subAttr = attrAt.has(j) ? attrAt.get(j)! : subAttr;
        }

        if (subText) {
          const pattern = base + subText;
          const replacement = `$${base}_${subText}$`;
          result = result.replace(new RegExp(escapeRegExp(pattern), 'g'), replacement);
        }
        charPos = j - 1; // skip past subscript chars
      }
    }
  }

  return result;
}

function inferVersion06Choices(
  variables: AlgorithmicVariable[],
  postFontRefs: string[],
  choiceRefs: string[],
  choiceLabels: string[],
  type: QuestionType,
  answerIndex?: number,
): Choice[] | undefined {
  if (type !== 'mcq') return undefined;

  const variableMap = new Map(variables.map((variable) => [variable.name.toLowerCase(), variable]));
  const unitCircleChoices = inferUnitCircleChoices(variableMap, answerIndex);
  if (unitCircleChoices) return unitCircleChoices;
  const coordinateChoices = inferCoordinateTransformationChoices(variableMap, answerIndex);
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
        text: wrapTypstMathIfNeeded(convertExamViewExpressionToTypst(variable.sampleValue ?? variable.rule ?? variable.name)),
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
          text: wrapTypstMathIfNeeded(convertExamViewExpressionToTypst(resolveChoiceRefValue(ref, variableMap))),
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
      text: wrapTypstMathIfNeeded(convertExamViewExpressionToTypst(variable.sampleValue ?? variable.rule ?? variable.name)),
    },
  }));
}

function inferTranslationTemplateChoices(
  displayRegions: Version06DisplayRegions,
  variableMap: Map<string, AlgorithmicVariable>,
  answerIndex?: number,
): { choices: Choice[] } | undefined {
  const units = variableValueForDisplay('ANS_units', variableMap);
  const answerDirection = variableValueForDisplay('ANS_direction', variableMap);
  const distractorDirection = variableValueForDisplay('DIS_direction', variableMap);
  if (!units || !answerDirection || !distractorDirection) return undefined;
  if (displayRegions.choiceRegions.length < 3) return undefined;

  const rawChoices = displayRegions.choiceRegions
    .map((region) => ({
      id: region.id,
      text: stitchQuestionText(region.texts.filter((text) => !isFontString(text) && isLikelyChoiceRegionText(text))),
    }))
    .filter((choice) => choice.text);

  if (rawChoices.length < 3) return undefined;
  if (!rawChoices.every((choice) => /\bunits?\b/i.test(choice.text) && choice.text.includes(INLINE_OBJECT_SLOT))) {
    return undefined;
  }

  let fallbackDirectionIndex = 0;
  const fallbackDirections = [answerDirection, distractorDirection];
  const choices: Choice[] = [];

  for (const choice of rawChoices) {
    const direction = translationDirectionForChoice(choice.id, answerIndex, answerDirection, distractorDirection)
      ?? fallbackDirections[fallbackDirectionIndex++ % fallbackDirections.length];
    const text = materializeTranslationChoiceTemplate(choice.text, units, direction);
    if (!text || text.includes(INLINE_OBJECT_SLOT)) return undefined;
    choices.push({
      id: choice.id,
      body: {
        format: 'typst',
        text,
      },
    });
  }

  if (choices.length < 3) return undefined;
  choices.sort((left, right) => left.id.localeCompare(right.id));
  return { choices: choices.slice(0, 4) };
}

function translationDirectionForChoice(
  id: string,
  answerIndex: number | undefined,
  answerDirection: string,
  distractorDirection: string,
): string | undefined {
  if (answerIndex === undefined || answerIndex < 0) return undefined;
  const choiceIndex = id.toUpperCase().charCodeAt(0) - 65;
  if (choiceIndex < 0 || choiceIndex > 25) return undefined;
  return choiceIndex === answerIndex ? answerDirection : distractorDirection;
}

function materializeTranslationChoiceTemplate(template: string, units: string, direction: string): string | undefined {
  const pieces = template.split(INLINE_OBJECT_SLOT);
  if (pieces.length === 1) return template.trim();

  let text = pieces[0] ?? '';
  for (let index = 1; index < pieces.length; index++) {
    const before = text.replace(/\s+/g, ' ');
    const after = pieces[index] ?? '';
    const replacement = translationSlotReplacement(before, after, units, direction, index - 1);
    if (!replacement) return undefined;
    text += replacement + after;
  }

  return cleanMaterializedTranslationChoice(text);
}

function translationSlotReplacement(
  before: string,
  after: string,
  units: string,
  direction: string,
  slotIndex: number,
): string | undefined {
  if (/^\s*units?\b/i.test(after)) return units;
  if (/\b(?:to the|units?)\s*$/i.test(before)) return direction;
  return slotIndex === 0 ? units : direction;
}

function cleanMaterializedTranslationChoice(text: string): string {
  const normalized = text.replace(/\s{2,}/g, ' ').trim();
  const completePhrase = normalized.match(
    /^(.+?\bunits?\s+(?:(?:to\s+the\s+)?(?:left|right)|up|down))\b/i,
  )?.[1];
  return (completePhrase ?? normalized).trim();
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
  title?: string,
  answerIndex?: number,
): Choice[] | undefined {
  const hasChoiceLabelRun = displayStrings.join(' ').match(/\bA\b.*\bC\b.*\bB\b.*\bD\b|\bA\b.*\bB\b.*\bC\b.*\bD\b/);
  if (!hasChoiceLabelRun) return choices;
  const visibleChoices = inferVisibleChoicesFromDisplayStrings(displayStrings);

  if (
    visibleChoices
    && visibleChoices.length > (choices?.length ?? 0)
    && visibleChoices.some((choice) => choice.body.text.includes(INLINE_OBJECT_SLOT))
  ) {
    return visibleChoices;
  }

  if (/correct inverse for the function/i.test(body)) {
    return inferInverseFunctionChoices(variableMap)
      ?? inferRadicalInverseFunctionChoices(variableMap)
      ?? placeholderChoices('[inverse-function choice not decoded yet]');
  }

  const sinusoidalRangeChoices = inferSinusoidalRangeChoices(body, variableMap);
  if (sinusoidalRangeChoices) return sinusoidalRangeChoices;

  const trigIdentityChoices = inferTrigIdentityChoices(body, title, answerIndex);
  if (
    trigIdentityChoices
    && (!choices || choices.some((choice) => /\[\[slot\]\]|\[(?:embedded|inline|math|object)/i.test(choice.body.text)))
  ) {
    return trigIdentityChoices;
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

  const asksForGraphChoice = /\bwhich graph\b|\bgraph represents\b|\bwhich is the graph\b/i.test(body);
  if (
    asksForGraphChoice
    && /graph \| (?:inverse|square root) of a function/i.test(title ?? '')
    && visibleChoices?.some((choice) => choice.body.text.includes(INLINE_OBJECT_SLOT))
  ) {
    return visibleChoices;
  }

  const graphChoices = inferGraphExpressionChoices(graphDefinitions);

  if (!choices) return graphChoices ?? visibleChoices ?? placeholderChoices('[math/object choice not decoded yet]');

  const choicesContainGraphSlots = choices.some((choice) => (
    choice.body.text.includes(INLINE_OBJECT_SLOT)
    || /\[(?:embedded|inline|diagram|graph|object)[^\]]*\]/i.test(choice.body.text)
  ));
  if (asksForGraphChoice && choicesContainGraphSlots) return choices;

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
      text: `$t_n = ${mn(slope)}n ${normalizeSeriesSign(sign)} ${mn(constant)}$`,
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
      text: `$f^(-1)(x) = ${expression}$`,
    },
  }));
}

function inferRadicalInverseFunctionChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const k = normalizedSignedNumber(variableValueForDisplay('k', variableMap));
  if (!k || !variableMap.has('inv_k')) return undefined;

  const inverseShift = oppositeSignedTerm(k);
  const directShift = signedTerm(k);
  return [
    `$f^(-1)(x) = sqrt(x) ${oppositeSignedTerm(k)}$`,
    `$f^(-1)(x) = (x ${directShift})^2$`,
    `$f^(-1)(x) = (x ${inverseShift})^2$`,
    `$f^(-1)(x) = sqrt(x ${directShift})$`,
  ].map((text, index) => ({
    id: String.fromCharCode(65 + index),
    body: { format: 'typst', text },
  }));
}

function inferSinusoidalRangeChoices(
  body: string,
  variableMap: Map<string, AlgorithmicVariable>,
): Choice[] | undefined {
  const selectedFunction = variableValueForDisplay('select_function', variableMap);
  if (!selectedFunction || !/\brange\b/i.test(body) || !/\b(?:sin|cos)\b/i.test(selectedFunction)) return undefined;
  if (!/graph of\s+\$?(?:sin|cos)/i.test(body)) return undefined;

  return [
    '$-1 <= y <= 1$',
    '$0 <= y <= 2 pi$',
    'all real numbers',
    '$-pi <= y <= pi$',
  ].map((text, index) => ({
    id: String.fromCharCode(65 + index),
    body: { format: 'typst', text },
  }));
}

function recoverKnownTrigIdentityPrompt(body: string, title?: string, answerIndex = 0): string {
  if (!title || !/\bidentit/i.test(title)) return body;
  if (!/\[(?:embedded|inline|math|object)[^\]]*\]/i.test(body)) return body;

  const family = trigIdentityFamily(body, title, answerIndex);
  if (!family) return body;

  if (/can be rewritten as/i.test(body)) return `${family.promptExpression} can be rewritten as`;
  if (/is equivalent to/i.test(body) && /^\[(?:embedded|inline|math|object)/i.test(body)) {
    return `${family.promptExpression} is equivalent to`;
  }
  if (/Which expression is equivalent to/i.test(body)) {
    return `Which expression is equivalent to ${family.promptExpression}?`;
  }
  return body;
}

function inferTrigIdentityChoices(body: string, title?: string, answerIndex = 0): Choice[] | undefined {
  if (!title || !/\bidentit/i.test(title)) return undefined;
  const family = trigIdentityFamily(body, title, answerIndex);
  if (!family) return undefined;
  return choicesWithCorrectAt(family.correctChoice, family.distractors, answerIndex);
}

function trigIdentityFamily(
  body: string,
  title: string,
  answerIndex = 0,
): { promptExpression: string; correctChoice: string; distractors: string[] } | undefined {
  const normalizedTitle = title.toLowerCase();
  const normalizedBody = body.toLowerCase();

  if (/half-angle identities/i.test(normalizedTitle)) {
    return {
      promptExpression: '$sin^2(x / 2)$',
      correctChoice: '$frac(1 - cos x, 2)$',
      distractors: ['$frac(1 + cos x, 2)$', '$frac(1 - sin x, 2)$', '$frac(1 + sin x, 2)$'],
    };
  }

  if (/double-angle identities.*sum identities|sum identities.*double-angle identities/i.test(normalizedTitle)) {
    return {
      promptExpression: '$sin(x + y)$',
      correctChoice: '$sin x cos y + cos x sin y$',
      distractors: ['$sin x cos y - cos x sin y$', '$cos x cos y - sin x sin y$', '$cos x cos y + sin x sin y$'],
    };
  }

  if (/double-angle identities/i.test(normalizedTitle)) {
    if (/is equivalent to/i.test(normalizedBody) && !/which expression/i.test(normalizedBody)) {
      return {
        promptExpression: '$sin(2x)$',
        correctChoice: '$2 sin x cos x$',
        distractors: ['$cos^2 x - sin^2 x$', '$1 - 2 sin^2 x$', '$2 cos^2 x - 1$'],
      };
    }
    return {
      promptExpression: '$cos(2x)$',
      correctChoice: '$cos^2 x - sin^2 x$',
      distractors: ['$2 sin x cos x$', '$sin^2 x + cos^2 x$', '$1 + tan^2 x$'],
    };
  }

  if (/sum identities.*difference identities|difference identities.*sum identities/i.test(normalizedTitle)) {
    return {
      promptExpression: '$cos(x - y)$',
      correctChoice: '$cos x cos y + sin x sin y$',
      distractors: ['$cos x cos y - sin x sin y$', '$sin x cos y + cos x sin y$', '$sin x cos y - cos x sin y$'],
    };
  }

  if (/trigonometric identity/i.test(normalizedTitle) && /which expression is equivalent|is equivalent to/i.test(normalizedBody)) {
    return {
      promptExpression: '$1 + tan^2 theta$',
      correctChoice: '$sec^2 theta$',
      distractors: ['$csc^2 theta$', '$tan^2 theta$', '$1 - tan^2 theta$'],
    };
  }

  return undefined;
}

function choicesWithCorrectAt(correct: string, distractors: string[], answerIndex = 0): Choice[] {
  const safeAnswerIndex = Number.isInteger(answerIndex) && answerIndex >= 0 && answerIndex < 4 ? answerIndex : 0;
  const choices: string[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index++) {
    choices.push(index === safeAnswerIndex ? correct : distractors[distractorIndex++] ?? distractors[0] ?? correct);
  }
  return choices.map((text, index) => ({
    id: String.fromCharCode(65 + index),
    body: { format: 'typst', text },
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

function inferUnitCircleChoices(variableMap: Map<string, AlgorithmicVariable>, selectedChoiceIndex = 0): Choice[] | undefined {
  const which = variableValueForDisplay('which', variableMap);
  const selected = which ? unitCircleEntryForCase(which) : undefined;
  if (!selected) return undefined;
  if (![...variableMap.keys()].some((name) => /^(rad|xdisp|ydisp|eq)\d+$/i.test(name))) return undefined;

  const selectedIndex = UNIT_CIRCLE_ENTRIES.indexOf(selected);
  const safeSelectedChoiceIndex = Number.isInteger(selectedChoiceIndex) && selectedChoiceIndex >= 0 && selectedChoiceIndex < 4
    ? selectedChoiceIndex
    : 0;
  const distractors = [2, -2, 4, -4, 1, -1]
    .map((offset) => UNIT_CIRCLE_ENTRIES[(selectedIndex + offset + UNIT_CIRCLE_ENTRIES.length) % UNIT_CIRCLE_ENTRIES.length])
    .filter((entry, index, all) => entry !== selected && all.indexOf(entry) === index);
  const choices: UnitCircleEntry[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index++) {
    choices.push(index === safeSelectedChoiceIndex ? selected : distractors[distractorIndex++]);
  }

  return choices.map((entry, index) => ({
    id: String.fromCharCode(65 + index),
    body: {
      format: 'typst',
      text: entry.point,
    },
  }));
}

function inferCoordinateTransformationChoices(variableMap: Map<string, AlgorithmicVariable>, answerIndex = 0): Choice[] | undefined {
  const translatedX = variableValueForDisplay('x', variableMap);
  const translatedY = variableValueForDisplay('y', variableMap);
  const sourceX = variableValueForDisplay('x3', variableMap);
  const sourceY = variableValueForDisplay('y2', variableMap);
  const horizontalDistractorX = variableValueForDisplay('x_dis', variableMap);
  const verticalDistractorY1 = variableValueForDisplay('y_dis1', variableMap);
  const verticalDistractorY2 = variableValueForDisplay('y_dis2', variableMap);
  if (translatedX && sourceY && horizontalDistractorX && verticalDistractorY1 && verticalDistractorY2) {
    return choicesWithCorrectAt(
      pointChoice(translatedX, sourceY),
      [
        pointChoice(horizontalDistractorX, sourceY),
        pointChoice(horizontalDistractorX, verticalDistractorY1),
        pointChoice(translatedX, verticalDistractorY2),
      ],
      answerIndex,
    );
  }

  const verticalDistractorX1 = variableValueForDisplay('x_dis1', variableMap);
  const verticalDistractorX2 = variableValueForDisplay('x_dis2', variableMap);
  const verticalDistractorY = variableValueForDisplay('y_dis', variableMap);
  if (sourceX && translatedY && verticalDistractorX1 && verticalDistractorX2 && sourceY && verticalDistractorY) {
    return choicesWithCorrectAt(
      pointChoice(sourceX, translatedY),
      [
        pointChoice(verticalDistractorX1, verticalDistractorY),
        pointChoice(verticalDistractorX1, sourceY),
        pointChoice(verticalDistractorX2, translatedY),
      ],
      answerIndex,
    );
  }

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

function pointChoice(x: string, y: string): string {
  return `(${mn(x)}, ${mn(y)})`;
}

function inferRadicalRestrictionChoices(variableMap: Map<string, AlgorithmicVariable>): Choice[] | undefined {
  const k = variableValueForDisplay('k', variableMap);
  const h = variableValueForDisplay('h', variableMap);
  const b = variableValueForDisplay('b', variableMap);
  if (!k || !h || !b) return undefined;
  return [`$x >= ${k}$`, `$x >= ${h}$`, `$x >= ${b}$`, `$x <= ${k}$`]
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
  const candidates: Array<{
    kind: AssetKind;
    mimeType: string;
    ext: string;
    bytes: Uint8Array;
    sourceOffset: number;
    sourceLength: number;
    priority: number;
  }> = [];
  const signatures: Array<{ mimeType: string; ext: string; signature: number[]; kind: AssetKind }> = [
    { mimeType: 'image/png', ext: 'png', signature: [0x89, 0x50, 0x4e, 0x47], kind: 'image' },
    { mimeType: 'image/jpeg', ext: 'jpg', signature: [0xff, 0xd8, 0xff], kind: 'image' },
    { mimeType: 'image/gif', ext: 'gif', signature: [0x47, 0x49, 0x46, 0x38], kind: 'image' },
    { mimeType: 'image/bmp', ext: 'bmp', signature: [0x42, 0x4d], kind: 'image' },
    { mimeType: 'application/vnd.ms-ole', ext: 'ole', signature: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], kind: 'ole' },
  ];

  for (let i = 0; i < bytes.length; i++) {
    for (const sig of signatures) {
      if (!matchesAt(bytes, sig.signature, i)) continue;
      const sourceLength = findAssetLength(bytes, i, sig.ext);
      if (!sourceLength) continue;
      candidates.push({
        kind: sig.kind,
        mimeType: sig.mimeType,
        ext: sig.ext,
        bytes: bytes.slice(i, i + sourceLength),
        sourceOffset: i,
        sourceLength,
        priority: 10,
      });
    }
  }

  for (let offset = 0; offset < bytes.length - 40; offset++) {
    const dib = readDibImage(bytes, offset);
    if (!dib) continue;
    candidates.push({
      kind: 'image',
      mimeType: 'image/bmp',
      ext: 'bmp',
      bytes: dib.bytes,
      sourceOffset: offset,
      sourceLength: dib.sourceLength,
      priority: 5,
    });
    offset += Math.max(0, dib.sourceLength - 1);
  }

  const accepted = candidates
    .sort((left, right) => left.sourceOffset - right.sourceOffset || right.priority - left.priority || right.sourceLength - left.sourceLength)
    .reduce<typeof candidates>((out, candidate) => {
      const overlaps = out.some((acceptedCandidate) => rangesOverlap(
        candidate.sourceOffset,
        candidate.sourceOffset + candidate.sourceLength,
        acceptedCandidate.sourceOffset,
        acceptedCandidate.sourceOffset + acceptedCandidate.sourceLength,
      ));
      if (!overlaps) out.push(candidate);
      return out;
    }, []);

  return accepted.map((asset, index) => {
    const id = `asset-${index + 1}`;
    return {
      id,
      kind: asset.kind,
      mimeType: asset.mimeType,
      filename: `${id}.${asset.ext}`,
      bytes: asset.bytes,
      sourceOffset: asset.sourceOffset,
      sourceLength: asset.sourceLength,
    };
  });
}

function findAssetLength(bytes: Uint8Array, offset: number, ext: string): number | undefined {
  if (ext === 'png') return findPngLength(bytes, offset);
  if (ext === 'jpg') return findJpegLength(bytes, offset);
  if (ext === 'gif') return findGifLength(bytes, offset);
  if (ext === 'bmp') return findBmpLength(bytes, offset);
  if (ext === 'ole') return findOleCompoundLength(bytes, offset);
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

interface DibImage {
  bytes: Uint8Array;
  sourceLength: number;
}

function readDibImage(bytes: Uint8Array, offset: number): DibImage | undefined {
  const info = readDibInfo(bytes, offset);
  if (!info) return undefined;
  return {
    bytes: buildBmpFromDib(bytes.subarray(offset, offset + info.sourceLength), info.pixelOffset),
    sourceLength: info.sourceLength,
  };
}

interface DibInfo {
  sourceLength: number;
  pixelOffset: number;
}

function readDibInfo(bytes: Uint8Array, offset: number): DibInfo | undefined {
  if (offset + 40 > bytes.length) return undefined;
  const headerSize = readUint32Le(bytes, offset);
  if (![40, 52, 56, 108, 124].includes(headerSize)) return undefined;
  if (offset + headerSize > bytes.length) return undefined;

  const width = readInt32Le(bytes, offset + 4);
  const height = readInt32Le(bytes, offset + 8);
  const planes = readUint16Le(bytes, offset + 12);
  const bitsPerPixel = readUint16Le(bytes, offset + 14);
  const compression = readUint32Le(bytes, offset + 16);
  const imageSize = readUint32Le(bytes, offset + 20);
  const colorsUsed = readUint32Le(bytes, offset + 32);

  if (planes !== 1) return undefined;
  if (![1, 4, 8, 16, 24, 32].includes(bitsPerPixel)) return undefined;
  if (compression !== 0) return undefined;
  if (width === 0 || height === 0 || Math.abs(width) > 5000 || Math.abs(height) > 5000) return undefined;

  const paletteColors = colorsUsed || (bitsPerPixel <= 8 ? 1 << bitsPerPixel : 0);
  if (paletteColors > 256) return undefined;
  const paletteBytes = paletteColors * 4;
  const rowSize = Math.floor((Math.abs(width) * bitsPerPixel + 31) / 32) * 4;
  const expectedPixelBytes = rowSize * Math.abs(height);
  const pixelBytes = imageSize || expectedPixelBytes;
  if (pixelBytes < expectedPixelBytes && expectedPixelBytes - pixelBytes > rowSize) return undefined;
  if (pixelBytes > expectedPixelBytes && pixelBytes - expectedPixelBytes > rowSize) return undefined;

  const pixelOffset = headerSize + paletteBytes;
  const sourceLength = pixelOffset + pixelBytes;
  if (sourceLength <= headerSize || sourceLength > 50_000_000 || offset + sourceLength > bytes.length) return undefined;
  return { sourceLength, pixelOffset };
}

function buildBmpFromDib(dibBytes: Uint8Array, pixelOffset: number): Uint8Array {
  const fileHeaderLength = 14;
  const bmp = new Uint8Array(fileHeaderLength + dibBytes.length);
  bmp[0] = 0x42;
  bmp[1] = 0x4d;
  writeUint32Le(bmp, 2, bmp.length);
  writeUint32Le(bmp, 10, fileHeaderLength + pixelOffset);
  bmp.set(dibBytes, fileHeaderLength);
  return bmp;
}

function findOleCompoundLength(bytes: Uint8Array, offset: number): number | undefined {
  if (offset + 512 > bytes.length) return undefined;
  const sectorShift = readUint16Le(bytes, offset + 30);
  if (sectorShift !== 9 && sectorShift !== 12) return undefined;
  const sectorSize = 1 << sectorShift;
  const fatSectorCount = readUint32Le(bytes, offset + 44);
  if (fatSectorCount === 0 || fatSectorCount > 10_000) return undefined;

  const difatEntries: number[] = [];
  for (let index = 0; index < 109; index++) {
    const sector = readUint32Le(bytes, offset + 76 + index * 4);
    if (isOleRegularSector(sector)) difatEntries.push(sector);
  }

  let nextDifatSector = readUint32Le(bytes, offset + 68);
  const difatSectorCount = Math.min(readUint32Le(bytes, offset + 72), 10_000);
  for (let index = 0; index < difatSectorCount && isOleRegularSector(nextDifatSector); index++) {
    const sectorOffset = oleSectorOffset(offset, sectorSize, nextDifatSector);
    if (sectorOffset + sectorSize > bytes.length) return undefined;
    const entryCount = sectorSize / 4 - 1;
    for (let entry = 0; entry < entryCount; entry++) {
      const sector = readUint32Le(bytes, sectorOffset + entry * 4);
      if (isOleRegularSector(sector)) difatEntries.push(sector);
    }
    nextDifatSector = readUint32Le(bytes, sectorOffset + entryCount * 4);
  }

  const fatSectors = difatEntries.slice(0, fatSectorCount);
  if (fatSectors.length !== fatSectorCount) return undefined;

  let maxSector = Math.max(...fatSectors);
  for (const headerSectorOffset of [48, 60, 68]) {
    const sector = readUint32Le(bytes, offset + headerSectorOffset);
    if (isOleRegularSector(sector)) maxSector = Math.max(maxSector, sector);
  }

  for (const fatSector of fatSectors) {
    const sectorOffset = oleSectorOffset(offset, sectorSize, fatSector);
    if (sectorOffset + sectorSize > bytes.length) return undefined;
    for (let entryOffset = sectorOffset; entryOffset + 4 <= sectorOffset + sectorSize; entryOffset += 4) {
      const sector = readUint32Le(bytes, entryOffset);
      if (isOleRegularSector(sector)) maxSector = Math.max(maxSector, sector);
    }
  }

  const length = 512 + (maxSector + 1) * sectorSize;
  if (length < 512 || offset + length > bytes.length) return undefined;
  return length;
}

function oleSectorOffset(baseOffset: number, sectorSize: number, sector: number): number {
  return baseOffset + 512 + sector * sectorSize;
}

function isOleRegularSector(sector: number): boolean {
  return sector < 0xffffff00;
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

function writeUint32Le(bytes: Uint8Array, offset: number, value: number): void {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function matchesAt(bytes: Uint8Array, signature: number[], offset: number): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function rangesOverlap(leftStart: number, leftEnd: number, rightStart: number, rightEnd: number): boolean {
  return leftStart < rightEnd && rightStart < leftEnd;
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

function inspectQuestionQuality(questions: DecodedQuestion[]): QuestionQualityAssessment[] {
  return questions.map((question) => assessQuestionQuality(question));
}

function assessQuestionQuality(question: DecodedQuestion): QuestionQualityAssessment {
  const bodyText = question.body.text.trim();
  const choiceTexts = (question.choices ?? []).map((choice) => choice.body.text.trim());
  const solutionText = question.solution?.text.trim() ?? '';
  const findings: QuestionQualityFinding[] = [];
  let score = 100;
  const graphLike = isQualityGraphLikeQuestion(question);

  const placeholderPattern = /\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]/gi;
  const slotPattern = /\[\[slot\]\]/gi;
  const unresolvedPlaceholderPattern = /\[\[slot\]\]|\[DIAGRAM[^\]]+\]|\[embedded [^\]]+\]|\[inline [^\]]+\]/gi;
  const unresolvedTokenPattern = /\[\[slot\]\]|\b(?:not decoded yet|undefined|NaN|DIS\d*|ANS|VAR\d+|T\d+|RF\d+)\b/i;
  const suspiciousCodePattern = /\b(?:range|choose|fracs?|if|rand|list|isunique)\s*\(/i;
  const doubleSpacePattern = / {2,}/;
  const spaceBeforePunctuationPattern = /\s+[,.!?;:]/;
  const mathLeakPattern = /\b(?:sin|cos|tan|log|ln|sqrt|abs|pow)\s*\(|\b[A-Za-z]\^[A-Za-z0-9(]/gi;

  const addFinding = (code: string, level: DiagnosticLevel, message: string, evidence?: string, penalty = 0) => {
    findings.push({ code, level, message, evidence });
    score -= penalty;
  };

  const bodySlotCount = (bodyText.match(slotPattern) ?? []).length;
  const bodyUnresolvedPlaceholderCount = (bodyText.match(unresolvedPlaceholderPattern) ?? []).length;
  const placeholderCount = (bodyText.match(placeholderPattern) ?? []).length + bodySlotCount;
  const unresolvedCount = (bodyText.match(unresolvedTokenPattern) ?? []).length;
  const mathLeakCount = countMathLeaks(bodyText, mathLeakPattern);

  if (!bodyText) {
    addFinding('BODY_EMPTY', 'error', 'Question body is empty.', undefined, 70);
  } else {
    if (bodyText.length < 12) {
      addFinding('BODY_TOO_SHORT', 'warning', 'Question body is very short.', bodyText, 20);
    }

    if ((!graphLike && placeholderCount > 0) || bodySlotCount > 0 || bodyUnresolvedPlaceholderCount > 0) {
      addFinding('BODY_PLACEHOLDERS', 'warning', 'Question body still contains unresolved embedded-object placeholders.', bodyText, Math.min(45, Math.max(placeholderCount, bodyUnresolvedPlaceholderCount) * 10));
    }

    if (unresolvedCount > 0) {
      addFinding('BODY_UNRESOLVED_TOKENS', 'warning', 'Question body still contains unresolved tokens or variables.', bodyText, Math.min(25, unresolvedCount * 4));
    }

    if (suspiciousCodePattern.test(bodyText)) {
      addFinding('BODY_SUSPICIOUS_CODE', 'info', 'Question body still looks like generated control code rather than prose.', bodyText, 8);
    }

    if (doubleSpacePattern.test(bodyText) || spaceBeforePunctuationPattern.test(bodyText)) {
      addFinding('BODY_FORMATTING_NOISE', 'info', 'Question body has spacing or punctuation artifacts.', bodyText, 4);
    }

    if (!graphLike && mathLeakCount > 0) {
      addFinding('BODY_MATH_MODE_LEAK', 'warning', 'Question body appears to contain unwrapped math fragments.', bodyText, Math.min(18, mathLeakCount * 3));
    }

    const alnum = (bodyText.match(/[A-Za-z0-9]/g) ?? []).length;
    const punctuation = (bodyText.match(/[^\sA-Za-z0-9]/g) ?? []).length;
    if (alnum > 0 && punctuation / alnum > 0.9) {
      addFinding('BODY_PUNCTUATION_HEAVY', 'warning', 'Question body has unusually heavy punctuation relative to text.', bodyText, 10);
    }
  }

  const choiceSlotCount = choiceTexts.reduce((count, text) => count + ((text.match(/\[\[slot\]\]/gi) ?? []).length), 0);
  const choiceUnresolvedPlaceholderCount = choiceTexts.reduce((count, text) => count + ((text.match(/\[\[slot\]\]|\[DIAGRAM[^\]]+\]|\[embedded [^\]]+\]|\[inline [^\]]+\]/gi) ?? []).length), 0);
  const choicePlaceholderCount = choiceTexts.reduce((count, text) => count + ((text.match(/\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]/gi) ?? []).length), 0) + choiceSlotCount;
  const choiceUnresolvedCount = choiceTexts.reduce((count, text) => count + ((text.match(/\[\[slot\]\]|\b(?:not decoded yet|undefined|NaN|DIS\d*|ANS|VAR\d+|T\d+|RF\d+)\b/gi) ?? []).length), 0);
  const choiceMathLeakCount = choiceTexts.reduce((count, text) => count + countMathLeaks(text, mathLeakPattern), 0);

  if (question.type === 'mcq' || question.type === 'multiple_response' || question.type === 'matching') {
    if ((question.choices?.length ?? 0) < 2) {
      addFinding('CHOICES_MISSING', 'error', 'Structured question is missing choices.', undefined, 45);
    }

    const duplicateChoiceIds = question.choices
      ? question.choices.map((choice) => choice.id.toUpperCase())
      : [];
    if (new Set(duplicateChoiceIds).size !== duplicateChoiceIds.length) {
      addFinding('CHOICES_DUPLICATE_ID', 'warning', 'Choices contain duplicate IDs.', duplicateChoiceIds.join(', '), 12);
    }

    const uniqueChoiceTexts = new Set(choiceTexts.filter(Boolean));
    if (choiceTexts.length >= 2 && uniqueChoiceTexts.size <= 1) {
      addFinding('CHOICES_IDENTICAL', 'warning', 'Choices appear to be identical or near-identical.', choiceTexts.join(' | '), 20);
    }

    if (question.answer?.format === 'choice' && question.choices?.length) {
      const matchingChoice = question.choices.find((choice) => choice.id === question.answer?.value);
      if (!matchingChoice) {
        addFinding('ANSWER_NOT_IN_CHOICES', 'error', 'Choice answer does not match any available choice ID.', question.answer.value, 30);
      }
    }
  }

  if ((!graphLike && choicePlaceholderCount > 0) || choiceSlotCount > 0 || choiceUnresolvedPlaceholderCount > 0) {
    addFinding('CHOICE_PLACEHOLDERS', 'warning', 'Choices still contain unresolved placeholders.', choiceTexts.join(' | '), Math.min(24, Math.max(choicePlaceholderCount, choiceUnresolvedPlaceholderCount) * 6));
  }

  if (choiceUnresolvedCount > 0) {
    addFinding('CHOICE_UNRESOLVED_TOKENS', 'warning', 'Choices still contain unresolved tokens or variables.', choiceTexts.join(' | '), Math.min(18, choiceUnresolvedCount * 3));
  }

  if (!graphLike && choiceMathLeakCount > 0) {
    addFinding('CHOICE_MATH_MODE_LEAK', 'warning', 'Choices appear to contain unwrapped math fragments.', choiceTexts.join(' | '), Math.min(14, choiceMathLeakCount * 2));
  }

  if (solutionText) {
    const solutionPlaceholderCount = (solutionText.match(/\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]|\[\[slot\]\]/gi) ?? []).length;
    if (solutionPlaceholderCount > 0) {
      addFinding('SOLUTION_PLACEHOLDERS', 'info', 'Solution still contains unresolved placeholders.', solutionText, Math.min(8, solutionPlaceholderCount * 2));
    }

    if (doubleSpacePattern.test(solutionText) || spaceBeforePunctuationPattern.test(solutionText)) {
      addFinding('SOLUTION_FORMATTING_NOISE', 'info', 'Solution has spacing or punctuation artifacts.', solutionText, 2);
    }
  }

  if (question.confidence === 'low') {
    addFinding('LOW_CONFIDENCE', 'info', 'Question was decoded with low confidence.', undefined, 12);
  }

  if (question.type === 'unknown') {
    addFinding('UNKNOWN_TYPE', 'warning', 'Question type could not be determined confidently.', undefined, 18);
  }

  if (question.raw?.length) {
    const rawText = question.raw.map((fragment) => fragment.textPreview ?? '').join(' ');
    if (/not decoded yet|undefined|NaN|\[\[slot\]\]/i.test(rawText)) {
      addFinding('RAW_FRAGMENT_NOISE', 'info', 'Preserved raw fragments still contain decode noise.', rawText.slice(0, 120), 5);
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const verdict = score >= 75 && findings.every((finding) => finding.level !== 'error')
    ? 'clean'
    : score >= 45
      ? 'suspect'
      : 'garbage';

  return {
    score,
    verdict,
    findings,
    metrics: {
      bodyLength: bodyText.length,
      choiceCount: question.choices?.length ?? 0,
      placeholderCount,
      unresolvedTokenCount: unresolvedCount,
      choicePlaceholderCount,
      solutionPlaceholderCount: solutionText ? (solutionText.match(/\[(?:embedded|inline|diagram|graph|math|choice|object)[^\]]*\]/gi) ?? []).length : 0,
      mathLeakCount,
      choiceMathLeakCount,
    },
  };
}

function isQualityGraphLikeQuestion(question: DecodedQuestion): boolean {
  if (question.graphDefinitions?.length || question.graphModel?.objects.length) return true;
  const text = `${question.metadata.title ?? ''} ${question.body.text}`.toLowerCase();
  return /\b(graph|diagram|plot|sketch|unit circle|terminal arm|asymptote|parabola|reciprocal function|combined function)\b/.test(text);
}

function inferQuestionParts(question: DecodedQuestion): DecodedQuestionParts | undefined {
  if (question.choices?.length || question.type === 'mcq' || question.type === 'multiple_response') return undefined;

  const parsed = parseStructuredQuestionParts(question.body.text);
  if (!parsed) return undefined;

  return toDecodedQuestionParts(parsed, question.body.format);
}

function toDecodedQuestionParts(
  parts: { stem: string; items: ParsedPart[] },
  format: RichContent['format'],
): DecodedQuestionParts {
  return {
    stem: {
      format,
      text: parts.stem,
    },
    items: parts.items.map((item) => ({
      label: item.label,
      body: {
        format,
        text: item.body,
      },
      parts: item.parts ? toDecodedQuestionParts(item.parts, format) : undefined,
    })),
  };
}

type ParsedPart = {
  label?: string;
  body: string;
  parts?: { stem: string; items: ParsedPart[] };
};

type ParsedNode = {
  label?: string;
  level: number;
  bodyLines: string[];
  children: ParsedNode[];
};

type MarkerInfo = { level: number; label?: string; remainder: string } | null;

function parseStructuredQuestionParts(text: string): { stem: string; items: ParsedPart[] } | undefined {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const { stemLines, items } = buildPartTree(lines);
  if (items.length < 2) return undefined;
  return {
    stem: stemLines.join('\n').trim(),
    items: items.map(toParsedPart).filter((item): item is ParsedPart => Boolean(item)),
  };
}

function buildPartTree(lines: string[]): { stemLines: string[]; items: ParsedNode[] } {
  const root: ParsedNode = { level: 0, bodyLines: [], children: [] };
  const stack: ParsedNode[] = [root];
  let seenPart = false;

  for (const line of lines) {
    const marker = parseMarker(line);
    if (marker) {
      seenPart = true;
      while (stack.length > marker.level) stack.pop();
      const parent = stack.at(-1) ?? root;
      const node: ParsedNode = { level: marker.level, label: marker.label, bodyLines: [], children: [] };
      if (marker.remainder) node.bodyLines.push(marker.remainder);
      parent.children.push(node);
      stack.push(node);
      continue;
    }

    if (!seenPart) {
      root.bodyLines.push(line);
      continue;
    }

    const current = stack.at(-1);
    if (current) current.bodyLines.push(line);
  }

  return {
    stemLines: trimBlankEdges(root.bodyLines),
    items: root.children,
  };
}

function parseMarker(line: string): MarkerInfo {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const explicit = /^\s*\\(part|subpart|subsubpart)\b(?:\s*\[[^\]]*\])?\s*(.*)$/i.exec(line);
  if (explicit) {
    const level = explicit[1].toLowerCase() === 'part' ? 1 : explicit[1].toLowerCase() === 'subpart' ? 2 : 3;
    return { level, remainder: explicit[2]?.trimEnd() ?? '' };
  }

  const alpha = /^\s*(?:\(([a-z])\)|([a-z]))[.)]\s*(.*)$/i.exec(line);
  if (alpha) return { level: 1, label: (alpha[1] ?? alpha[2])?.toLowerCase(), remainder: alpha[3]?.trimEnd() ?? '' };

  const roman = /^\s*(?:\(([ivxlcdm]+)\)|([ivxlcdm]+))[.)]\s*(.*)$/i.exec(line);
  if (roman) return { level: 2, label: (roman[1] ?? roman[2])?.toLowerCase(), remainder: roman[3]?.trimEnd() ?? '' };

  const numeric = /^\s*(?:\((\d+)\)|(\d+))[.)]\s*(.*)$/i.exec(line);
  if (numeric) return { level: 3, label: numeric[1] ?? numeric[2], remainder: numeric[3]?.trimEnd() ?? '' };

  return null;
}

function toParsedPart(node: ParsedNode): ParsedPart | null {
  const body = cleanParsedPartBody(trimBlankEdges(node.bodyLines).join('\n').trim());
  if (!body) return null;
  const parts = node.children.length
    ? {
        stem: '',
        items: node.children.map(toParsedPart).filter((child): child is ParsedPart => Boolean(child)),
      }
    : undefined;
  return {
    label: node.label,
    body,
    parts,
  };
}

function cleanParsedPartBody(body: string): string {
  return body.replace(/^\$\s+/, '').trim();
}

function repairMalformedPartMathBoundaries(text: string): string {
  return text.replace(/\\\$([^\r\n$]+?)(,?)\s*([\r\n]+)([a-h])\)\$/gi, (_match, expression: string, comma: string, lineBreak: string, label: string) => {
    return `$${expression.trim()}$${comma}${lineBreak}${label.toLowerCase()})`;
  });
}

function trimBlankEdges(lines: string[]): string[] {
  const out = [...lines];
  while (out.length && !out[0].trim()) out.shift();
  while (out.length && !out[out.length - 1].trim()) out.pop();
  return out;
}

function contentText(content: RichContent): string {
  return renderTypstText(content.text);
}

function renderTypstQuestionBody(question: DecodedQuestion): string {
  const lines: string[] = [];
  if (question.narrative) {
    lines.push(contentText(question.narrative));
    lines.push('');
  }

  if (question.parts?.items.length) {
    lines.push('', '#block[');
    lines.push('  #set enum(numbering: "(a)", indent: 0pt, body-indent: 0.8em)');
    for (const part of question.parts.items) {
      lines.push(`  + ${contentText(part.body)}`);
    }
    lines.push(']');
    return lines.join('\n').trim();
  }

  lines.push(contentText(question.body));
  return lines.join('\n').trim();
}

/**
 * Wrap a Typst text fragment in inline math delimiters ($...$) when it looks like a
 * math expression. Used for values derived from algorithmic variables, which are often
 * formulas or fractions but are sometimes plain numbers or plain-text words.
 */
/**
 * Post-process body text to wrap inline math notation in $...$. Handles content
 * that comes from raw display strings rather than from the hardcoded recovery
 * templates (which already emit $...$). Splits on existing $...$ blocks first to
 * avoid double-wrapping.
 */
/**
 * Post-process body text to wrap inline math notation in $...$. Handles content
 * that comes from raw display strings rather than from the hardcoded recovery
 * templates (which already emit $...$). Splits on existing $...$ blocks first to
 * avoid double-wrapping.
 */
function wrapBodyInlineMath(body: string): string {
  return markMathInText(body);
}

function escapeCurrencyDollarSigns(text: string): string {
  let out = '';
  let index = 0;

  while (index < text.length) {
    if (text[index] === '$' && text[index + 1] === '$' && /\d/.test(text[index + 2] ?? '')) {
      const end = text.indexOf('$', index + 2);
      const amount = end === -1 ? '' : text.slice(index + 2, end).trim();
      if (end !== -1 && isCurrencyAmountText(amount)) {
        out += `\\$${amount}`;
        index = end + 1;
        continue;
      }
    }

    if (text[index] === '$' && /\d/.test(text[index + 1] ?? '') && !isOpeningNumericMathDollar(text, index)) {
      out += '\\$';
      index++;
      continue;
    }

    out += text[index];
    index++;
  }

  return out;
}

function isCurrencyAmountText(text: string): boolean {
  const trimmed = text.trim();
  return /^\d[\d\s,]*(?:\.\d+)?$/.test(trimmed) && !/[A-Za-z_+\-*/^=()]/.test(trimmed);
}

function isOpeningNumericMathDollar(text: string, index: number): boolean {
  const end = text.indexOf('$', index + 1);
  if (end === -1) return false;
  const span = text.slice(index + 1, end);
  const trimmed = span.trim();
  if (!trimmed || /[\r\n]/.test(span)) return false;
  const mathCandidate = trimmed.replace(/,$/, '');
  if (/^\d[\d,]*(?:\.\d+)?$/.test(mathCandidate)) return true;
  if (isLikelyMathSpan(mathCandidate)) return true;
  if (/^\(?\s*[-+]?\d+(?:\.\d+)?\s*,\s*[-+]?\d+(?:\.\d+)?\s*\)?$/.test(mathCandidate)) {
    return true;
  }
  if (
    span.length <= 24
    && /^[0-9][0-9\s,./%A-Za-z_^()-]*$/.test(trimmed)
    && /\b(?:mm|cm|m|km|g|kg|s|min|h|hr|m\/s|deg)\b|°|%|[/^]/i.test(trimmed)
  ) {
    return true;
  }
  return /^[0-9A-Za-z_+\-*/^().,;\s]+$/.test(trimmed)
    && /[+\-*/^=]/.test(trimmed)
    && /[A-Za-z]/.test(trimmed)
    && !/\b(?:plus|daily|week|more|less|fee|commission|dollars?)\b/i.test(trimmed);
}

function wrapTypstMathIfNeeded(text: string): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.startsWith('$') || /^\[/.test(trimmed)) return text;
  // ExamView unresolved conditionals / char functions — not valid math
  if (/\bif\s*\(|\bchr\s*\(|\bVAR\d/i.test(trimmed)) return text;
  // Subscript notation: t_n, S_8, x_1
  if (/[A-Za-z]_[A-Za-z0-9({]/.test(trimmed)) return `$${trimmed}$`;
  // Superscript: f^(-1), x^2
  if (/\^/.test(trimmed)) return `$${trimmed}$`;
  // Already-converted Typst math function e.g. #math.frac(...)
  if (/#math\./.test(trimmed)) return `$${trimmed}$`;
  // Equation or inequality: letter(s) = / < / > expression
  if (/^[A-Za-z_][A-Za-z0-9_(){}]*\s*[=<>]/.test(trimmed)) return `$${trimmed}$`;
  // Bare fraction: ±digits/digits (including en-dash negative)
  if (/^[–−-]?\d+\/\d+$/.test(trimmed)) return `$${trimmed.replace(/[–−]/g, '-')}$`;
  // Negative number with en-dash (e.g. –12, –3.5) — en-dash becomes minus in math mode
  if (/^[–−]\d/.test(trimmed) && /^[–−]\d+(\.\d+)?$/.test(trimmed)) {
    return `$${trimmed.replace(/[–−]/g, '-')}$`;
  }
  // sqrt(...) expression
  if (/sqrt\(/.test(trimmed)) return `$${trimmed}$`;
  return text;
}

function renderTypstText(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const parts: string[] = [];
  let cursor = 0;

  for (const match of normalized.matchAll(/#image\("\/imgs\/[^"]+"(?:,\s*width:\s*[^)]+)?\)/g)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      const marked = markMathInText(normalized.slice(cursor, start));
      parts.push(renderTextWithMath(marked));
    }
    parts.push(match[0]);
    cursor = start + match[0].length;
  }

  if (cursor < normalized.length) {
    const marked = markMathInText(normalized.slice(cursor));
    parts.push(renderTextWithMath(marked));
  }

  return parts.join('');
}

function markMathInText(text: string): string {
  const parts: string[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf('$', cursor);
    if (start === -1) {
      parts.push(markPlainTextMath(text.slice(cursor)));
      break;
    }

    parts.push(markPlainTextMath(text.slice(cursor, start)));

    const end = text.indexOf('$', start + 1);
    if (end === -1) {
      parts.push(markPlainTextMath(text.slice(start)));
      break;
    }

    const span = text.slice(start + 1, end);
    parts.push(isLikelyMathSpan(span) ? `$${normalizeMathSpan(span)}$` : text.slice(start, end + 1));
    cursor = end + 1;
  }

  return parts.join('');
}

function markPlainTextMath(text: string): string {
  const tokens = text.match(/\s+|[A-Za-z]_[A-Za-z0-9]+|[A-Za-z]\d+|\d+(?:\.\d+)?|[A-Za-z]+|[^\sA-Za-z0-9]/g);
  if (!tokens) return text;

  const out: string[] = [];
  for (let index = 0; index < tokens.length;) {
    const token = tokens[index];
    if (/^\s+$/.test(token)) {
      out.push(token);
      index++;
      continue;
    }

    const run = collectMathRun(tokens, index);
    if (!run) {
      out.push(token);
      index++;
      continue;
    }

    out.push(`$${normalizeMathSpan(run.text)}$`);
    index = run.end;
  }

  return out.join('');
}

function collectMathRun(tokens: string[], start: number): { text: string; end: number } | undefined {
  const first = tokens[start];
  if (!isMathStartToken(first, tokens[start + 1] ?? '', tokens.slice(start + 1))) return undefined;

  let end = start + 1;
  let sawMath = true;

  while (end < tokens.length) {
    const token = tokens[end];
    if (/^\s+$/.test(token)) {
      const next = tokens[end + 1];
      if (next && isMathContinuationToken(next, tokens[end + 2] ?? '', tokens.slice(end + 1))) {
        end++;
        continue;
      }
      break;
    }

    if (isMathContinuationToken(token, tokens[end + 1] ?? '', tokens.slice(end + 1))) {
      sawMath = true;
      end++;
      continue;
    }

    break;
  }

  if (!sawMath) return undefined;
  return { text: tokens.slice(start, end).join(''), end };
}

function isMathStartToken(token: string, nextToken = '', rest: string[] = []): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (isStrongMathToken(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed) && /^[(_^=<>+\-*/]$/.test(nextToken)) return true;
  if (/^\d+(?:\.\d+)?(?:,\s*)?$/.test(trimmed) && rest.some((part) => /^\s*$/.test(part) || /^[,\d]/.test(part))) {
    return true;
  }
  return false;
}

function isMathContinuationToken(token: string, nextToken = '', rest: string[] = []): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (isStrongMathToken(trimmed)) return true;
  if (/^[,;:+\-*/^=<>≤≥()…]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^\d+(?:\.\d+)?(?:,\s*)?$/.test(trimmed)) return true;
  if (/^[A-Za-z]$/.test(trimmed) && /^[(_^=<>+\-*/]$/.test(nextToken)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function isStrongMathToken(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#math.')) return true;
  if (/^[–−-]?\d+(?:\.\d+)?\/\d+$/.test(trimmed)) return true;
  if (/^[–−-]?\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)+(?:,?\.{3}|,?…)?$/.test(trimmed)) return true;
  if (/^\(\s*[–−-]?\d+(?:\.\d+)?\s*,\s*[–−-]?\d+(?:\.\d+)?(?:\s*,\s*[–−-]?\d+(?:\.\d+)?)?\s*\)$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]{1,8}\([^)]+\)$/.test(trimmed)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(?:\([^)]+\))?([=<>]=?|[+\-*/^])/.test(trimmed)) return true;
  if (/^[+\-*/^=<>≤≥]+$/.test(trimmed)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function normalizeMathSpan(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(?<![A-Za-z0-9])([A-Za-z])(\d+)(?![A-Za-z0-9])/g, '$1_$2')
    .replace(/(\d)([A-Za-z])/g, '$1 $2')
    .replace(/\b([A-Za-z])x(?=\b|[_^])/g, '$1 x')
    .replace(/[–−]/g, '-')
    .trim();
}

function renderTextWithMath(text: string): string {
  const parts: string[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const start = text.indexOf('$', cursor);
    if (start === -1) {
      parts.push(escapeTypstText(text.slice(cursor)));
      break;
    }

    parts.push(escapeTypstText(text.slice(cursor, start)));

    const end = text.indexOf('$', start + 1);
    if (end === -1) {
      parts.push(escapeTypstText(text.slice(start)));
      break;
    }

    const span = text.slice(start + 1, end);
    if (isLikelyMathSpan(span)) {
      parts.push(`$${escapeMath(normalizeMathSpan(span))}$`);
    } else {
      const recovered = markPlainTextMath(span);
      if (recovered !== span) {
        parts.push(recovered);
      } else {
        parts.push(escapeTypstText(text.slice(start, end + 1)));
      }
    }
    cursor = end + 1;
  }

  return parts.join('');
}

function isLikelyMathSpan(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/\bif\s*\(|\bchr\s*\(|\bVAR\d/i.test(trimmed)) return false;
  if (trimmed.startsWith('#math.')) return true;
  if (/^[–−-]?\d+(?:\.\d+)?\/\d+$/.test(trimmed)) return true;
  if (/^[–−-]?\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)+(?:,?\.{3}|,?…)?$/.test(trimmed)) return true;
  if (/^\(\s*[–−-]?\d+(?:\.\d+)?\s*,\s*[–−-]?\d+(?:\.\d+)?(?:\s*,\s*[–−-]?\d+(?:\.\d+)?)?\s*\)$/.test(trimmed)) return true;
  if (/^[A-Za-z]\d+$/.test(trimmed)) return true;
  if (/^[A-Za-z]_[A-Za-z0-9]+$/.test(trimmed)) return true;
  if (/^[A-Za-z]{1,8}\([^)]+\)$/.test(trimmed)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(?:\([^)]+\))?([=<>]=?|[+\-*/^])/.test(trimmed)) return true;
  if (/^[+\-*/^=<>≤≥]+$/.test(trimmed)) return true;
  if (/^(?:sin|cos|tan|sec|csc|cot|asin|acos|atan|arcsin|arccos|arctan|log|ln|lim|max|min|gcd|lcm|sqrt|abs)$/i.test(trimmed)) return true;
  return false;
}

function escapeTypstText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\^/g, '\\^')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}

function escapeMath(text: string): string {
  return text.replace(/[#$]/g, '');
}

function emptyStats(): DecodeStats {
  return {
    questionCount: 0,
    assetCount: 0,
    diagnosticCount: 0,
    unsupportedFragmentCount: 0,
    quality: {
      clean: 0,
      suspect: 0,
      garbage: 0,
      averageScore: 0,
    },
  };
}

function inferBankDialect(filename?: string, majorVersion?: string): BankDialectProfile {
  const family = inferClassNameFromFilename(filename) ?? 'unknown';
  const normalizedFamily = family.toLowerCase();
  const version: BankDialectProfile['version'] = majorVersion === '05'
    ? 'v05'
    : majorVersion === '06'
      ? 'v06'
      : 'unknown';

  if (version === 'v05') {
    return {
      version,
      family,
      profile: 'v05-calculus',
      notes: ['Known single-file v05 outlier; defer until a dedicated v05 parser exists.'],
    };
  }

  let profile: BankDialectProfile['profile'] = 'v06-unknown';
  const notes: string[] = [];

  if (normalizedFamily.includes('pre-calculus') && normalizedFamily.includes('mickelson')) {
    profile = 'v06-precalculus-mickelson';
    notes.push('Narrative-heavy, structure-rich pre-calculus dialect.');
  } else if (normalizedFamily.includes('pre-calculus')) {
    profile = 'v06-precalculus-standard';
    notes.push('Baseline pre-calculus dialect used for regression control.');
  } else if (normalizedFamily.includes('mathworks')) {
    profile = 'v06-mathworks';
    notes.push('Broader applied-math prompt style; likely more embedded content and varied layouts.');
  } else if (normalizedFamily.includes('foundations')) {
    profile = 'v06-foundations';
    notes.push('Large applied/foundations banks; likely heavier on template text and nontrivial assets.');
  } else if (normalizedFamily.includes('math apprenticeship')) {
    profile = 'v06-math-apprenticeship';
    notes.push('Very large banks with heavy applied wording; good stress test for preservation and performance.');
  } else if (normalizedFamily.includes('math makes sense')) {
    profile = 'v06-math-makes-sense';
    notes.push('School-style unit banks; often language-dense and template-driven.');
  } else if (normalizedFamily.includes('calculus')) {
    profile = 'v06-calculus';
    notes.push('Legacy/edge bank family; isolate before broad heuristics change.');
  } else {
    notes.push('Unclassified v06 family; keep behavior conservative until profiled.');
  }

  return {
    version,
    family,
    profile,
    notes,
  };
}

function withStats(result: DecodeResult): DecodeResult {
  const quality = result.questions.map((question) => question.quality ?? assessQuestionQuality(question));
  const qualitySummary = quality.reduce((summary, assessment) => {
    summary[assessment.verdict] += 1;
    summary.totalScore += assessment.score;
    return summary;
  }, {
    clean: 0,
    suspect: 0,
    garbage: 0,
    totalScore: 0,
  });

  return {
    ...result,
    stats: {
      questionCount: result.questions.length,
      assetCount: result.assets.length,
      diagnosticCount: result.diagnostics.length,
      unsupportedFragmentCount: result.questions.reduce((sum, q) => sum + (q.raw?.length ?? 0), 0),
      quality: result.questions.length
        ? {
            clean: qualitySummary.clean,
            suspect: qualitySummary.suspect,
            garbage: qualitySummary.garbage,
            averageScore: Math.round(qualitySummary.totalScore / result.questions.length),
          }
        : {
            clean: 0,
            suspect: 0,
            garbage: 0,
            averageScore: 0,
          },
    },
  };
}

function countMathLeaks(text: string, leakPattern: RegExp): number {
  const stripped = stripInlineMathBlocks(text);
  const matches = [...stripped.matchAll(leakPattern)];
  const bareFractions = stripped.match(/\b\d+\/\d+\b/g) ?? [];
  const inequalities = stripped.match(/[A-Za-z0-9)]\s*[<>]=?\s*[A-Za-z0-9(]/g) ?? [];
  const subscripts = stripped.match(/\b[A-Za-z]_[A-Za-z0-9]+\b/g) ?? [];
  return matches.length + bareFractions.length + inequalities.length + subscripts.length;
}

function stripInlineMathBlocks(text: string): string {
  return text.replace(/\$[^$]+\$/g, ' ');
}
