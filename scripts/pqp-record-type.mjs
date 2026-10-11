// Canonical QuestionType values differ from the native record-reader labels.
const types = { 'multiple-choice': 'mcq', 'multiple-response': 'multiple_response', 'true-false': 'true_false', 'yes-no': 'mcq', completion: 'completion', matching: 'matching', 'short-answer': 'short_answer', problem: 'problem', unknown: 'unknown' };
export const pqpRecordType = type => type === 'bimodal' ? 'bimodal' : types[type] ?? 'unknown';
