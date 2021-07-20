import { advancedQuiz } from "./advanced";
import { basicQuiz } from "./basic";
import { intermediateQuiz } from "./intermediate";

export interface WholeWord {
  [x: string]: string;
  type: string;
  word: string;
  returnedWordBegin: string;
  returnedWordEnd: string;
}

export interface SplitWord {
  [x: string]: string | string[] | number;
  type: string;
  choices: string[];
  word: string;
  completeWord: string;
  returnedWordBegin: string;
  returnedWordEnd: string;
  replacedWordLength: number;
}

export interface AnswerGrading {
  question: string;
  isCorrect: boolean;
  correctAnswer: string;
  completeWord: string;
  userAnswer: string;
}

export interface QuizQuestion {
  [index: string]: SplitWord | WholeWord | string | number;
}

export interface UserAnswer {
  choice: string;
  question: string;
}

export const allClozeTests = [
  ...advancedQuiz,
  ...basicQuiz,
  ...intermediateQuiz,
];
