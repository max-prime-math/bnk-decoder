// Turn a structurally read question record (records.ts) into question content: Typst stem,
// choices, answer and written answer, with every reason it can't be trusted listed in
// `problems`. A question with problems should not ship.

import { findChoiceTable, renderBlock, renderRange, type RenderOptions, type RenderedContent } from './record-typst.ts';
import type { QuestionRecord, RecordQuestionType } from './records.ts';

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
  const [first, second] = record.blocks;

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
  } else if (record.type === 'multiple-choice') {
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
