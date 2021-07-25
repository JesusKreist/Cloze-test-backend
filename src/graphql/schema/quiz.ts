import { gql } from "apollo-server-lambda";

export const quiz = gql`
  extend type Query {
    getOneClozeTest(testRank: String!, testId: String!): String
    getAllClozeTests: String
  }

  extend type Mutation {
    checkAnswer(answer: String, testRank: String!, testId: String!): String!
  }
`;
