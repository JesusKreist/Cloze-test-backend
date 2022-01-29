import { UserInputError } from "apollo-server-lambda";
import { Quiz } from "../../database/models/quiz";
import { ResolverContext } from "../servers";
import { QuizModel } from "../../database/models/quiz";
import {
  gradeUserAnswer,
  UserAnswerRequest,
} from "../../quiz/gradeUserAnswers";
import { getAllClozeTests, getOneClozeTest } from "../../quiz/getClozeTest";
import { createQuiz } from "../../quiz/createQuiz";

export const quizResolver = {
  Mutation: {
    addOneQuiz: async (
      _root: any,
      { text, title }: Quiz,
      { mongooseConnection }: ResolverContext
    ) => {
      // todo protect this route with admin administration
      const QuizModelConnection = QuizModel(mongooseConnection);
      const createdQuiz = createQuiz(text);

      const newQuiz = { text, title, createdQuiz };
      try {
        const newlyCreatedQuiz = await QuizModelConnection.create(newQuiz);
        return newlyCreatedQuiz;
      } catch (error) {
        if (error instanceof Error) {
          throw new UserInputError(error.message, { invalidArgs: newQuiz });
        } else {
          throw new Error("An error occured when creating a quiz.");
        }
      }
    },
    checkUserAnswers: async (
      _root: any,
      { quizId, userAnswers }: UserAnswerRequest,
      { mongooseConnection }: ResolverContext
    ) => {
      return gradeUserAnswer({ quizId, userAnswers }, mongooseConnection);
    },
  },
  Query: {
    getOneClozeTest: (
      _root: any,
      { quizId }: { quizId: string },
      { mongooseConnection }: ResolverContext
    ) => {
      return getOneClozeTest(quizId, mongooseConnection);
    },
    getAllClozeTests: (
      _root: any,
      _args: any,
      { mongooseConnection }: ResolverContext
    ) => {
      return getAllClozeTests(mongooseConnection);
    },
  },
};
