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
    throw new UserInputError(error.message, { invalidQuizId: quizId });
  }
};

export const getAllClozeTests = (mongooseConnection: mongoose.Connection) => {
  const QuizDatabase = QuizModel(mongooseConnection);

  try {
    return QuizDatabase.find({});
  } catch (error) {
    throw new UserInputError(error.message);
  }
};
