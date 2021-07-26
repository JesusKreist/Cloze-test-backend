import { ApolloError, UserInputError } from "apollo-server-lambda";
import { Quiz } from "../../database/models/quiz";
import {
  allClozeTests,
  AnswerGrading,
  SplitWord,
  UserAnswer,
} from "../../quiz";
import { logger } from "../../utils/logger";
import { ResolverContext } from "../server";
import { QuizModel } from "../../database/models/quiz";

export const quizResolver = {
  Mutation: {
    checkAnswer: (
      _root: any,
      {
        answer,
        testRank,
        testId,
      }: { answer: string; testRank: string; testId: string }
    ): string => {
      const solvedQuiz = allClozeTests.find(
        (quiz) => quiz.id === testId && quiz.rank === testRank
      );

      if (!solvedQuiz) {
        throw new ApolloError("Quiz could not be found");
      }

      try {
        JSON.parse(answer);
      } catch (error) {
        throw new UserInputError(
          "An error occured while parsing the user answer!",
          { ...error }
        );
      }

      const userAnswer = JSON.parse(answer) as UserAnswer[];
      let markedSolution = [] as AnswerGrading[];

      userAnswer.forEach((answer) => {
        const quizQuestion = solvedQuiz[
          answer.question.toString()
        ] as SplitWord;

        if (quizQuestion) {
          const answerGrading: AnswerGrading = {
            question: answer.question,
            isCorrect: quizQuestion.choices.includes(answer.choice),
            correctAnswer: quizQuestion.choices[0] ?? "null",
            completeWord: quizQuestion.completeWord,
            userAnswer: answer.choice,
          };

          markedSolution = [...markedSolution, answerGrading];
        }
      });

      return JSON.stringify(markedSolution);
    },
    addOneQuiz: async (
      _root: any,
      { text, title, rank }: Quiz,
      { mongooseConnection }: ResolverContext
    ) => {
      // todo protect this route with admin administration
      const QuizModelConnection = QuizModel(mongooseConnection);

      const newQuiz = {
        text,
        title,
        rank,
      };

      try {
        const newlyCreatedQuiz = await QuizModelConnection.create(newQuiz);
        return newlyCreatedQuiz;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: newQuiz });
      }
    },
  },
  Query: {
    getOneClozeTest: (
      _root: any,
      { testRank, testId }: { testRank: string; testId: string }
    ): string => {
      const foundQuiz = allClozeTests.find(
        (quiz) => quiz.id === testId && quiz.rank === testRank
      );

      if (!foundQuiz) {
        throw new ApolloError("Quiz could not be found");
      }

      return JSON.stringify(foundQuiz);
    },
    getAllClozeTests: (): string => {
      logger.info("Getting all clozetests");
      return JSON.stringify(allClozeTests);
    },
  },
};
