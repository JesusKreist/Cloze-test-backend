// import { createQuiz, ProcessedWord } from "./createQuiz";
import mongoose from "mongoose";
import { QuizModel } from "../database/models/quiz";
import { ProcessedWord } from "./createQuiz";

export interface ServerAnswer {
  indexOfWord: number;
  isCorrect: boolean;
  correctAnswer: string;
  fullWord: string;
  userAnswer: string;
}

export interface UserAnswer {
  indexOfWord: number;
  answer: string;
}

export interface UserAnswerRequest {
  userAnswers: UserAnswer[];
  quizId: string;
}

const findCurrentSolvedWord = (
  solvedQuiz: ProcessedWord[],
  userAnswer: UserAnswer
) => {
  return solvedQuiz.find((word) => word.indexOfWord === userAnswer.indexOfWord);
};

export interface UserAnswerRequestParams {
  quizId: string;
  userAnswers: UserAnswer[];
}

// const createAnswerObjectFromCreatedQuiz = (solvedQuiz: Quiz) =>
//   solvedQuiz.createdQuiz.reduce(
//     (startingArray, currentArray) => ({
//       ...startingArray,
//       [currentArray.indexOfWord]: currentArray.answers[0],
//     }),
//     {}
//   );

export const gradeUserAnswer = async (
  { quizId, userAnswers }: UserAnswerRequestParams,
  mongooseConnection: mongoose.Connection
) => {
  // do mongoose find logic here, throw error if not found
  const QuizDatabase = QuizModel(mongooseConnection);
  console.log(`quizId`, quizId);
  console.log("userAnswers :>> ", userAnswers);

  const solvedQuiz = await QuizDatabase.findById(quizId);
  if (!solvedQuiz) {
    throw new Error(`Could not find quiz with id ${quizId}`);
  }

  const gradedUserAnswers = userAnswers.map((userAnswer) => {
    const matchingSplitWord = findCurrentSolvedWord(
      solvedQuiz.createdQuiz,
      userAnswer
    );
    if (!matchingSplitWord) {
      console.log(userAnswer);
      throw new Error("Couldn't find a matching solved word in quiz");
    }

    return {
      indexOfWord: matchingSplitWord.indexOfWord,
      isCorrect: matchingSplitWord.answers.includes(userAnswer.answer),
      correctAnswer: matchingSplitWord.answers[0],
      fullWord: matchingSplitWord.fullWord,
      userAnswer: userAnswer.answer,
    };
  });

  return gradedUserAnswers;
};
