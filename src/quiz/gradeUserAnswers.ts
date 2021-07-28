import { ApolloError } from "apollo-server-lambda";
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

export interface UserAnswerRequestParams {
  quizId: string;
  userAnswers: UserAnswer[];
}

const findCurrentSolvedWord = (
  solvedQuiz: ProcessedWord[],
  userAnswer: UserAnswer
) => {
  return solvedQuiz.find((word) => word.indexOfWord === userAnswer.indexOfWord);
};

export const gradeUserAnswer = async (
  { quizId, userAnswers }: UserAnswerRequestParams,
  mongooseConnection: mongoose.Connection
) => {
  const QuizDatabase = QuizModel(mongooseConnection);
  const solvedQuiz = await QuizDatabase.findById(quizId);
  if (!solvedQuiz) {
    throw new Error(`Could not find quiz with id ${quizId}`);
  }

  const wordsSolvedByUser: { [x: number]: boolean } = {};
  const gradedUserAnswers = userAnswers.map((userAnswer) => {
    const matchingSplitWord = findCurrentSolvedWord(
      solvedQuiz.createdQuiz,
      userAnswer
    );

    if (!matchingSplitWord) {
      console.log(userAnswer);
      throw new ApolloError("Couldn't find a matching solved word in quiz");
    }
    wordsSolvedByUser[userAnswer.indexOfWord] = true;

    return {
      indexOfWord: matchingSplitWord.indexOfWord,
      isCorrect: matchingSplitWord.answers.includes(userAnswer.answer),
      correctAnswer: matchingSplitWord.answers[0],
      fullWord: matchingSplitWord.fullWord,
      userAnswer: userAnswer.answer,
    };
  });

  const gradedWordsNotSolved = solvedQuiz.createdQuiz
    .filter((processedWord) => {
      const indexOfProcessedWord = processedWord.indexOfWord;
      if (
        !wordsSolvedByUser[indexOfProcessedWord] &&
        processedWord.wordType === "split"
      ) {
        return true;
      }

      return false;
    })
    .map((processedWord) => {
      return {
        indexOfWord: processedWord.indexOfWord,
        isCorrect: false,
        correctAnswer: processedWord.answers[0],
        fullWord: processedWord.fullWord,
        userAnswer: "userDidNotAnswer",
      };
    });

  return [...gradedUserAnswers, ...gradedWordsNotSolved];
};
