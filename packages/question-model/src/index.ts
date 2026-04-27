export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'matching'
  | 'fill_blank'
  | 'short_answer'
  | 'essay'
  | 'numeric'
  | 'unknown';

export interface Section {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  sections: Section[];
}

export interface Class {
  id: string;
  name: string;
  units: Unit[];
}

export interface Question {
  id: string;
  body: string;
  answer?: string;
  solution?: string;
  choices?: Record<string, string>;
  points: number;
  tags: string[];
  images?: string[];
  questionType?: QuestionType;
  classId?: string;
  unitId?: string;
  sectionId?: string;
  createdAt: number;
}

/** A question being staged for import before it becomes a full Question. */
export interface DraftQuestion {
  body: string;
  answer: string;
  solution: string;
  choices?: Record<string, string>;
  points: number;
  tagInput: string;
  classId: string;
  unitId: string;
  sectionId: string;
  images?: string[];
  questionType?: QuestionType;
}

export type DraftQuestionLike = DraftQuestion;

export interface ChoiceOverride {
  choices: Record<string, string>;
  solution: string;
}

export interface TestConfig {
  title: string;
  subtitle: string;
  showDate: boolean;
  date: string;
  instructions: string;
  selectedIds: string[];
  showPoints: boolean;
  pointsBold: boolean;
  answerSpace: number;
  answerSpaceOverrides: Record<string, number>;
  choiceOverrides: Record<string, ChoiceOverride>;
  fontSize: number;
  paper: string;
  marginIn: number;
  showAnswerKey: boolean;
  mcqFirst: boolean;
  mcqFullSolutions: boolean;
  customPreamble?: string;
}

export function defaultTestConfig(): TestConfig {
  return {
    title: 'Grade 10 Advanced Math',
    subtitle: '',
    showDate: false,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    instructions: 'Answer each question to the best of your ability.  You may not use a calculator.',
    selectedIds: [],
    showPoints: true,
    pointsBold: false,
    answerSpace: 4,
    answerSpaceOverrides: {},
    choiceOverrides: {},
    fontSize: 11,
    paper: 'us-letter',
    marginIn: 0.5,
    showAnswerKey: false,
    mcqFirst: true,
    mcqFullSolutions: false,
  };
}
