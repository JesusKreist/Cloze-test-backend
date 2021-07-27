import { gql } from "apollo-server-lambda";

export const quiz = gql`
  extend type Query {
    getOneClozeTest(testRank: String!, testId: String!): String
    getAllClozeTests: String
  }

  extend type Mutation {
    checkAnswer(answer: String, testRank: String!, testId: String!): String!
    addOneQuiz(rank: String!, title: String!, text: String!): Quiz!
    checkUserAnswers(
      quizId: String!
      userAnswers: [UserAnswer]
    ): [ServerAnswer]!
  }

  type ProcessedWord {
    wordType: String!
    returnedWord: String!
    lineLength: Int!
    indexOfWord: Int!
    punctuation: String
    fullWord: String!
    answers: [String]!
    hasPunctuation: Boolean!
  }

  type Quiz {
    id: ID!
    title: String!
    rank: String!
    text: String!
    createdQuiz: [ProcessedWord]!
  }

  type ServerAnswer {
    indexOfWord: Int!
    isCorrect: Boolean!
    correctAnswer: String!
    fullWord: String!
    userAnswer: String!
  }

  input UserAnswer {
    indexOfWord: Int!
    answer: String!
  }
`;
