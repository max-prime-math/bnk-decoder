// Turn a structurally read question record (records.ts) into question content: Typst stem,
// choices, answer and written answer, with every reason it can't be trusted listed in
// `problems`. A question with problems should not ship.

import { findChoiceTable, renderBlock, renderRange, type RenderOptions, type RenderedContent } from './record-typst.ts';
import type { MatchingGroup, QuestionRecord, RecordQuestionType } from './records.ts';

export interface RecordQuestionContent {
  type: RecordQuestionType;
  stem: string;
  choices?: Array<{ id: string; text: string }>;
  /** Choice letter for true/false, yes/no and multiple choice. */
  answer?: string;
  /** Written answer of short-answer and problem questions, or a choice question's rationale. */
  solution?: string;
  problems: string[];
}

// Two-option types store the answer as 0/1 at record +0x1c.
const OPTION_TYPES: Partial<Record<RecordQuestionType, string[]>> = {
  'true-false': ['True', 'False'],
  'yes-no': ['Yes', 'No'],
};

// Text that must never ship: replacement and private-use characters, raw control codes, and
// the placeholders the string-scan decoder emits.
const GARBLED = /[�-\u0000-\u0008\u000b\u000c\u000e-\u001f]|not decoded|\[embedded|\[\[slot\]\]|\[inline object/i;

export function renderRecordQuestion(record: QuestionRecord, options: RenderOptions): RecordQuestionContent {
  const problems: string[] = [];
  const render = (result: RenderedContent, field: string) => {
    for (const error of result.errors) problems.push(`${field}: ${error}`);
    if (GARBLED.test(result.typst)) problems.push(`${field}: garbled or placeholder text`);
    return result.typst;
  };
  const letter = (index: number) => String.fromCharCode(65 + index);
  const content: RecordQuestionContent = { type: record.type, stem: '', problems };
  const first = record.blocks[record.blockRoles.indexOf('question')];
  const second = record.blocks[record.blockRoles.indexOf('solution')];
  if (!first) {
    problems.push('no question text block');
    return content;
  }

  // Block 0 is the question; block 1, when present, is the written answer (short answer,
  // problem) or the rationale shown with a choice question's key.
  if (record.blocks.length > 2) problems.push(`expected at most 2 text blocks, found ${record.blocks.length}`);
  const rationale = () => (second ? render(renderBlock(second, options), 'rationale') || undefined : undefined);

  const optionLabels = OPTION_TYPES[record.type];
  if (optionLabels) {
    content.stem = render(renderBlock(first, options), 'stem');
    content.choices = optionLabels.map((text, index) => ({ id: letter(index), text }));
    content.solution = rationale();
    if (record.answerCode === 0 || record.answerCode === 1) content.answer = letter(record.answerCode);
    else problems.push(`answer field ${record.answerCode} is not 0 or 1`);
  } else if (record.type === 'multiple-choice' || record.type === 'bimodal') {
    content.solution = rationale();
    const table = findChoiceTable(first);
    if (!table) {
      problems.push('no a./b./c./d. choice table at the end of the question');
      content.stem = render(renderBlock(first, options), 'stem');
    } else {
      const labels = table.choices.map((choice) => choice.label).join('');
      const expected = 'abcdefgh'.slice(0, table.choices.length);
      if (labels !== expected) problems.push(`choice labels ${labels} are not ${expected}`);
      if (record.choiceCount !== table.choices.length) problems.push(`record says ${record.choiceCount} choices, table has ${table.choices.length}`);
      content.stem = render(renderRange(first, 0, table.stemEnd, options), 'stem');
      content.choices = table.choices.map((choice) => ({
        id: choice.label.toUpperCase(),
        text: render(renderRange(first, choice.start, choice.end, options), `choice ${choice.label}`),
      }));
      for (const choice of content.choices) if (!choice.text.trim()) problems.push(`choice ${choice.id} is empty`);
      const bodies = content.choices.map((choice) => choice.text.replace(/\s+/g, ''));
      if (new Set(bodies).size !== bodies.length) problems.push('two choices are identical');
      if (record.answerCode >= 0 && record.answerCode < content.choices.length) content.answer = letter(record.answerCode);
      else problems.push(`answer index ${record.answerCode} is outside the ${content.choices.length} choices`);
    }
  } else if (record.type === 'multiple-response') {
    // Any number of choices can be correct; the answer is a bitmask (bit 0 = a).
    const table = findChoiceTable(first);
    if (!table) {
      problems.push('no a./b./c./d. choice table at the end of the question');
      content.stem = render(renderBlock(first, options), 'stem');
    } else {
      const labels = table.choices.map((choice) => choice.label).join('');
      const expected = 'abcdefgh'.slice(0, table.choices.length);
      if (labels !== expected) problems.push(`choice labels ${labels} are not ${expected}`);
      const stem = render(renderRange(first, 0, table.stemEnd, options), 'stem');
      const choices = table.choices.map((choice) => {
        const text = render(renderRange(first, choice.start, choice.end, options), `choice ${choice.label}`);
        if (!text.trim()) problems.push(`choice ${choice.label} is empty`);
        return { id: choice.label.toUpperCase(), text };
      });
      content.stem = stem;
      content.choices = choices;
      const correct = table.choices.filter((_, index) => record.answerCode & (1 << index)).map((choice) => choice.label);
      if (!correct.length || record.answerCode >> table.choices.length) {
        problems.push(`answer bitmask ${record.answerCode} doesn't select from the ${table.choices.length} choices`);
      }
      const extra = second ? render(renderBlock(second, options), 'rationale') : '';
      content.answer = correct.map(label => label.toUpperCase()).join(', ');
      content.solution = [correct.join(', '), extra].filter(Boolean).join('\n\n');
    }
  } else if (record.type === 'short-answer' || record.type === 'problem') {
    content.stem = render(renderBlock(first, options), 'stem');
    content.solution = second ? render(renderBlock(second, options), 'answer') : '';
    if (!content.solution.trim()) problems.push('no answer text');
  } else {
    problems.push(`question type code ${record.typeCode} (${record.type}) is not supported`);
    content.stem = first ? render(renderBlock(first, options), 'stem') : '';
  }
  if (!content.stem.trim()) problems.push('empty question text');
  content.problems = [...new Set(problems)];
  return content;
}

export interface MatchingContent {
  stem: string;
  /** "1 → C" lines. */
  solution: string;
  /** "1:C; 2:F" for the package's text answer. */
  answer: string;
  items: number;
  problems: string[];
}

/**
 * One matching question from a group (shared prompt and lettered choices) and its matching
 * items, numbered in ExamView question order, with a "1 → C" key.
 */
export function renderMatchingGroup(group: MatchingGroup, items: QuestionRecord[], options: RenderOptions): MatchingContent {
  const problems: string[] = [];
  const render = (result: RenderedContent, field: string) => {
    for (const error of result.errors) problems.push(`${field}: ${error}`);
    if (GARBLED.test(result.typst)) problems.push(`${field}: garbled or placeholder text`);
    return result.typst;
  };
  const block = group.blocks[0];
  if (group.blocks.length !== 1) problems.push(`matching group has ${group.blocks.length} text blocks`);
  const table = block ? findChoiceTable(block) : undefined;
  if (!table) {
    problems.push('matching group has no a./b./c./… choice table');
    return { stem: '', solution: '', answer: '', items: items.length, problems };
  }
  const labels = table.choices.map((choice) => choice.label).join('');
  if (labels !== 'abcdefghij'.slice(0, table.choices.length)) problems.push(`choice labels ${labels} are not in order`);
  if (group.choiceCount !== table.choices.length) problems.push(`group says ${group.choiceCount} choices, table has ${table.choices.length}`);
  const prompt = render(renderRange(block, 0, table.stemEnd, options), 'prompt');
  const choices = table.choices.map((choice) => {
    const text = render(renderRange(block, choice.start, choice.end, options), `choice ${choice.label}`);
    if (!text.trim()) problems.push(`choice ${choice.label} is empty`);
    return `${choice.label.toUpperCase()}. ${text}`;
  });
  const ordered = [...items].sort((a, b) => a.number - b.number);
  if (!ordered.length) problems.push('matching group has no items');
  const lines: string[] = [];
  const key: Array<[number, string]> = [];
  ordered.forEach((item, index) => {
    if (item.blocks.length > 1) problems.push(`item ${index + 1} has an answer block`);
    const text = render(renderBlock(item.blocks[0], options), `item ${index + 1}`);
    if (!text.trim()) problems.push(`item ${index + 1} is empty`);
    lines.push(`${index + 1}. ${text}`);
    if (item.choiceCount >= 0 && item.choiceCount < table.choices.length) key.push([index + 1, String.fromCharCode(65 + item.choiceCount)]);
    else problems.push(`item ${index + 1} matches choice ${item.choiceCount}, outside the ${table.choices.length} choices`);
  });
  return {
    stem: [prompt, ...choices, ...lines].join('\n\n'),
    solution: key.map(([n, letter]) => `${n} → ${letter}`).join('\n\n'),
    answer: key.map(([n, letter]) => `${n}:${letter}`).join('; '),
    items: ordered.length,
    problems: [...new Set(problems)],
  };
}
