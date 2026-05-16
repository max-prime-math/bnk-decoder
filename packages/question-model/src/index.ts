export type QuestionType =
  | 'mcq'
  | 'bimodal'
  | 'true_false'
  | 'matching'
  | 'completion'
  | 'fill_blank'
  | 'short_answer'
  | 'problem'
  | 'essay'
  | 'case'
  | 'numeric'
  | 'multiple_response'
  | 'algorithmic'
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
  narrative?: string;
  body: string;
  parts?: QuestionParts;
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
  narrative?: string;
  body: string;
  parts?: QuestionParts;
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

export interface QuestionPart {
  label?: string;
  body: string;
  parts?: QuestionParts;
}

export interface QuestionParts {
  stem: string;
  items: QuestionPart[];
}

export interface ChoiceOverride {
  choices: Record<string, string>;
  solution: string;
}

export interface GraphDefaults {
  gridColor: string;
  axisWeight: number;
  curveWeight: number;
  asymptoteColor: string;
  showGrid: boolean;
  defaultWidth: number;
  defaultHeight: number;
  xStep: number;
  yStep: number;
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
  graphDefaults?: GraphDefaults;
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
    graphDefaults: {
      gridColor: 'silver',
      axisWeight: 2,
      curveWeight: 1.5,
      asymptoteColor: 'red',
      showGrid: true,
      defaultWidth: 6,
      defaultHeight: 6,
      xStep: 1,
      yStep: 1,
    },
  };
}
