import { gql } from "apollo-server-lambda";

export const quiz = gql`
  extend type Query {
    getOneClozeTest(testRank: String!, testId: String!): String
    getAllClozeTests: String
  }

  extend type Mutation {
    checkAnswer(answer: String, testRank: String!, testId: String!): String!
    addOneQuiz(rank: String!, title: String!, text: String!): Quiz!
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
`;
