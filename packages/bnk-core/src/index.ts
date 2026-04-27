import type { DraftQuestionLike, QuestionType } from '@bnk-decoder/question-model';

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
  detectedFormat: 'examview-bnk' | 'zip-like' | 'unknown-binary' | 'text-like';
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
  assets: string[];
  confidence: DecodeConfidence;
  raw?: UnknownBnkFragment[];
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

export async function decodeBnkFile(input: ArrayBuffer, options: DecodeOptions = {}): Promise<DecodeResult> {
  const bytes = new Uint8Array(input);
  const detectedFormat = detectSourceFormat(bytes);
  const diagnostics: DecodeDiagnostic[] = [
    {
      level: 'warning',
      code: 'BNK_PARSER_SCAFFOLD',
      message: 'BNK binary reverse engineering is not complete yet; raw text and unsupported fragments are preserved for fixture-driven parser work.',
    },
  ];

  const assets = extractKnownAssets(bytes);
  const text = extractPrintableText(bytes);
  const questions = decodeTextLikeQuestions(text, bytes, options.preserveRaw !== false);

  if (questions.length === 0) {
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
    },
    questions,
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

function detectSourceFormat(bytes: Uint8Array): BnkSourceMetadata['detectedFormat'] {
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return 'zip-like';
  const text = extractPrintableText(bytes).toLowerCase();
  if (text.includes('examview') || text.includes('question') || text.includes('answer')) return 'examview-bnk';
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

function extractPrintableText(bytes: Uint8Array): string {
  const decoded = TEXT_DECODER.decode(bytes);
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
  ];

  for (let i = 0; i < bytes.length; i++) {
    for (const sig of signatures) {
      if (!matchesAt(bytes, sig.signature, i)) continue;
      const id = `asset-${assets.length + 1}`;
      assets.push({
        id,
        kind: sig.kind,
        mimeType: sig.mimeType,
        filename: `${id}.${sig.ext}`,
        bytes: bytes.slice(i),
        sourceOffset: i,
      });
    }
  }

  return assets;
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
