import { UserInputError } from "apollo-server-errors";
import mongoose from "mongoose";
import { QuizModel } from "../database/models/quiz";

export const getOneClozeTest = (
  quizId: string,
  mongooseConnection: mongoose.Connection
) => {
  const QuizDatabase = QuizModel(mongooseConnection);

  try {
    return QuizDatabase.findById(quizId);
  } catch (error) {
    if (error instanceof Error) {
      throw new UserInputError(error.message, { invalidQuizId: quizId });
    } else {
      throw new Error("An error occured when finding the quiz.");
    }
  }
};

export const getAllClozeTests = (mongooseConnection: mongoose.Connection) => {
  const QuizDatabase = QuizModel(mongooseConnection);

  try {
    return QuizDatabase.find({});
  } catch (error) {
    if (error instanceof Error) {
      throw new UserInputError(error.message);
    } else {
      throw new Error("An error occured when finding all quizzes.");
    }
  }
};
