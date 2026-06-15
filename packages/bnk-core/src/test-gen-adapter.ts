import type { DecodedQuestion, DecodeResult } from './index';
import type { Class, Question, Section, Unit } from '@bnk-decoder/question-model';

export interface TestGeneratorCurriculumOptions {
  className?: string;
  classId?: string;
  unitName?: string;
  unitId?: string;
  sectionName?: string;
  sectionId?: string;
}

interface ResolvedCurriculum {
  className?: string;
  classId?: string;
  unitName?: string;
  unitId?: string;
  sectionName?: string;
  sectionId?: string;
}

/**
 * Convert BNK decoder output to test-generator Question format
 * Adapts DecodedQuestions to be compatible with test-generator's app
 */
export function toTestGeneratorQuestions(
  result: DecodeResult,
  curriculum: TestGeneratorCurriculumOptions = {},
): Question[] {
  return result.questions.map((q, idx) => toTestGeneratorQuestion(q, idx, curriculum));
}

export function toTestGeneratorCustomClasses(
  result: DecodeResult,
  curriculum: TestGeneratorCurriculumOptions = {},
): Class[] {
  const classes = new Map<string, Class>();

  for (const question of result.questions) {
    const resolved = resolveQuestionCurriculum(question, curriculum);
    if (!resolved.classId || !resolved.className) continue;

    let cls = classes.get(resolved.classId);
    if (!cls) {
      cls = {
        id: resolved.classId,
        name: resolved.className,
        units: [],
      };
      classes.set(cls.id, cls);
    }

    if (!resolved.unitId || !resolved.unitName) continue;
    const unit = ensureUnit(cls, {
      id: resolved.unitId,
      name: resolved.unitName,
      sections: [],
    });

    if (!resolved.sectionId || !resolved.sectionName) continue;
    ensureSection(unit, {
      id: resolved.sectionId,
      name: resolved.sectionName,
    });
  }

  return [...classes.values()];
}

export function toTestGeneratorQuestion(
  q: DecodedQuestion,
  index: number,
  curriculum: TestGeneratorCurriculumOptions = {},
): Question {
  const resolved = resolveQuestionCurriculum(q, curriculum);
  const isMatching = q.type === 'matching' && (q.items?.length ?? 0) > 0;
  const question: Question = {
    id: q.id,
    narrative: q.narrative ? toTestGeneratorTypstText(q.narrative.text) : undefined,
    body: toTestGeneratorTypstText(isMatching ? matchingQuestionBody(q) : q.body.text),
    parts: !isMatching && q.parts ? toQuestionParts(q.parts) : undefined,
    algorithmModel: q.algorithmModel,
    algorithmEvaluation: q.algorithmEvaluation,
    graphModel: q.graphModel,
    graphTypst: q.graphTypst?.text,
    decodeDiagnostics: q.decodeDiagnostics,
    choices: !isMatching ? q.choices?.reduce(
      (acc, choice) => {
        acc[choice.id] = toTestGeneratorTypstText(choice.body.text);
        return acc;
      },
      {} as Record<string, string>,
    ) : undefined,
    points: 1,
    tags: testGeneratorTags(q, resolved),
    createdAt: Date.now(),
  };

  if (!isMatching && q.answer?.value) {
    question.answer = q.answer.value;
  }

  if (isMatching && q.answerKey?.length) {
    question.solution = toTestGeneratorTypstText(matchingSolutionText(q));
  } else if (q.solution?.text) {
    question.solution = toTestGeneratorTypstText(q.solution.text);
  }

  if (q.type !== 'unknown') {
    question.questionType = q.type;
  }

  if (resolved.className) {
    question.className = resolved.className;
  }

  if (resolved.classId) {
    question.classId = resolved.classId;
  }

  if (resolved.unitName) {
    question.unitName = resolved.unitName;
  }

  if (resolved.unitId) {
    question.unitId = resolved.unitId;
  }

  if (resolved.sectionName) {
    question.sectionName = resolved.sectionName;
  }

  if (resolved.sectionId) {
    question.sectionId = resolved.sectionId;
  }

  if (q.assets.length > 0) {
    question.images = q.assets;
  }

  return question;
}

function ensureUnit(cls: Class, unit: Unit): Unit {
  const existing = cls.units.find((candidate) => candidate.id === unit.id);
  if (existing) return existing;
  cls.units.push(unit);
  return unit;
}

function ensureSection(unit: Unit, section: Section): Section {
  const existing = unit.sections.find((candidate) => candidate.id === section.id);
  if (existing) return existing;
  unit.sections.push(section);
  return section;
}

function toQuestionParts(parts: NonNullable<DecodedQuestion['parts']>): Question['parts'] {
  return {
    stem: toTestGeneratorTypstText(parts.stem.text),
    items: parts.items.map((part) => ({
      label: part.label,
      body: toTestGeneratorTypstText(part.body.text),
      parts: part.parts ? toQuestionParts(part.parts) : undefined,
    })),
  };
}

function matchingQuestionBody(q: DecodedQuestion): string {
  const choiceLines = chunkArray(q.choices ?? [], 2)
    .map((row) => row.map((choice) => `${choice.id}. ${choice.body.text}`).join('    '))
    .join('\n');
  const itemLines = (q.items ?? [])
    .map((item, index) => `${index + 1}. ${item.body.text}`)
    .join('\n');
  return [
    q.body.text,
    choiceLines,
    itemLines,
  ].filter(Boolean).join('\n\n');
}

function matchingSolutionText(q: DecodedQuestion): string {
  const answerByItem = new Map((q.answerKey ?? []).map((answer) => [answer.itemId, answer.choiceId]));
  return (q.items ?? [])
    .map((item, index) => `${index + 1}. ${answerByItem.get(item.id) ?? ''}`.trim())
    .join('\n');
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function toTestGeneratorTypstText(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const chunks: string[] = [];
  let cursor = 0;

  for (const match of normalized.matchAll(/#image\("\/imgs\/[^"]+"(?:,\s*width:\s*[^)]+)?\)/g)) {
    const start = match.index ?? 0;
    if (start > cursor) chunks.push(normalizeTypstTextSegment(normalized.slice(cursor, start)));
    chunks.push(match[0]);
    cursor = start + match[0].length;
  }

  if (cursor < normalized.length) chunks.push(normalizeTypstTextSegment(normalized.slice(cursor)));
  return chunks.join('');
}

function normalizeTypstTextSegment(text: string): string {
  const escapedDollarSentinel = '\uE000';
  const source = text.replace(/\$\/\$/g, '/').replace(/\\\$/g, escapedDollarSentinel);
  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('$', cursor);
    if (start === -1) {
      chunks.push(escapeLiteralTypstBrackets(source.slice(cursor)));
      break;
    }

    chunks.push(escapeLiteralTypstBrackets(source.slice(cursor, start)));
    const end = source.indexOf('$', start + 1);
    if (end === -1) {
      chunks.push('\\$');
      cursor = start + 1;
      continue;
    }

    const span = source.slice(start + 1, end);
    chunks.push(isLikelyTypstMathSpan(span)
      ? `$${escapeMath(normalizeTypstMathSpan(span))}$`
      : `\\$${escapeLiteralTypstBrackets(span)}\\$`);
    cursor = end + 1;
  }

  return chunks.join('').replaceAll(escapedDollarSentinel, '\\$');
}

function escapeLiteralTypstBrackets(text: string): string {
  return text
    .replace(/(?<!\\)#/g, '\\#')
    .replace(/(?<!\\)\[/g, '\\[')
    .replace(/(?<!\\)\]/g, '\\]')
    .replace(/(?<!\\)\*/g, '\\*')
    .replace(/(?<!\\)_/g, '\\_')
    .replace(/(?<!\\)\^/g, '\\^')
    .replace(/(?<!\\)</g, '\\<')
    .replace(/(?<!\\)>/g, '\\>');
}

function normalizeTypstMathSpan(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(?<![A-Za-z0-9])([A-Za-z])(\d+)(?![A-Za-z0-9])/g, '$1_$2')
    .replace(/\blog(\d+)\b/g, 'log($1)')
    .replace(/\batan\s*\(/g, 'op("atan")(')
    .replace(/\basin\s*\(/g, 'op("asin")(')
    .replace(/\bacos\s*\(/g, 'op("acos")(')
    .replace(/(\d)([A-Za-z])/g, '$1 $2')
    .replace(/\b([A-Za-z])x(?=\b|[_^])/g, '$1 x')
    .replace(/[–−]/g, '-')
    .trim();
}

function escapeMath(text: string): string {
  return text.replace(/[#$]/g, '');
}

function isLikelyTypstMathSpan(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed === '/') return false;
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

export function resolveQuestionCurriculum(
  q: DecodedQuestion,
  curriculum: TestGeneratorCurriculumOptions,
): ResolvedCurriculum {
  const className = firstText(curriculum.className, q.metadata.className);
  const classId = firstText(curriculum.classId) ?? (className ? `bnk-${slugId(className, 'class')}` : undefined);

  const unitSource = firstText(curriculum.unitName, q.metadata.unitName);
  const unitId = firstText(curriculum.unitId)
    ?? curriculumUnitId(curriculum.unitName)
    ?? curriculumUnitId(q.metadata.unitName)
    ?? curriculumUnitId(unitSource)
    ?? (unitSource ? slugId(unitSource, 'unit') : undefined);
  const unitName = unitSource ? curriculumDisplayName(unitSource) : undefined;

  const sectionNameSource = firstText(curriculum.sectionName, q.metadata.topic, q.metadata.sectionName);
  const sectionId = firstText(curriculum.sectionId)
    ?? curriculumSectionId(curriculum.sectionName)
    ?? curriculumSectionId(q.metadata.sectionName)
    ?? curriculumSectionId(sectionNameSource)
    ?? (sectionNameSource ? slugId(sectionNameSource, 'section') : undefined);
  const sectionName = sectionNameSource ? curriculumDisplayName(sectionNameSource) : undefined;

  return {
    className,
    classId,
    unitName,
    unitId,
    sectionName,
    sectionId,
  };
}

function firstText(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return undefined;
}

function normalizeText(value?: string): string | undefined {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  return normalized || undefined;
}

function curriculumUnitId(unitName?: string): string | undefined {
  const match = unitName?.match(/\b(?:chapter|unit)\s*0*(\d+(?:\.\d+)*)\b/i)
    ?? unitName?.match(/^\s*0*(\d+(?:\.\d+)*)(?=\D|$)/);
  return match?.[1];
}

function curriculumSectionId(sectionName?: string): string | undefined {
  const match = sectionName?.match(/\b(?:section|lesson)\s*0*(\d+(?:\.\d+)*)\b/i)
    ?? sectionName?.match(/^\s*0*(\d+(?:\.\d+)*)(?=\D|$)/);
  return match?.[1];
}

function curriculumDisplayName(name: string): string {
  const stripped = name
    .replace(/^(?:chapter|unit|section|lesson)\s*0*\d+(?:\.\d+)*\s*[:.-]?\s*/i, '')
    .trim();
  return stripped || name;
}

function slugId(value: string, fallback: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || fallback;
}

function testGeneratorTags(q: DecodedQuestion, curriculum: ResolvedCurriculum): string[] {
  const tags = [
    'examview',
    curriculum.className,
    curriculum.unitName,
    curriculum.sectionName,
    q.metadata.difficulty ? `difficulty: ${q.metadata.difficulty}` : undefined,
    q.metadata.reference ? `reference: ${q.metadata.reference}` : undefined,
    ...(q.metadata.title?.split('|').map((part) => part.trim()) ?? []),
  ];
  return uniqueTags(tags);
}

function uniqueTags(tags: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const normalized = tag?.replace(/\s+/g, ' ').trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}
