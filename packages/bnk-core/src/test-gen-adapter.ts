import type { DecodedQuestion, DecodeResult } from './index';
import type { Question } from '@bnk-decoder/question-model';

/**
 * Convert BNK decoder output to test-generator Question format
 * Adapts DecodedQuestions to be compatible with test-generator's app
 */
export function toTestGeneratorQuestions(result: DecodeResult): Question[] {
  return result.questions.map((q, idx) => toTestGeneratorQuestion(q, idx));
}

export function toTestGeneratorQuestion(q: DecodedQuestion, index: number): Question {
  const question: Question = {
    id: q.id,
    body: q.body.text,
    choices: q.choices?.reduce(
      (acc, choice) => {
        acc[choice.id] = choice.body.text;
        return acc;
      },
      {} as Record<string, string>,
    ),
    points: 1,
    tags: [],
    createdAt: Date.now(),
  };

  if (q.answer?.value) {
    question.answer = q.answer.value;
  }

  if (q.solution?.text) {
    question.solution = q.solution.text;
  }

  if (q.type !== 'unknown') {
    question.questionType = q.type;
  }

  if (q.assets.length > 0) {
    question.images = q.assets;
  }

  return question;
}
