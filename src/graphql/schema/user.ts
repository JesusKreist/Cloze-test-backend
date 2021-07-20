import { gql } from "apollo-server-lambda";

export const user = gql`
  extend type Query {
    checkUser: User
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      firstName: String!
      lastName: String!
      dateOfBirth: Date
    ): User
    login(username: String!, password: String!): Token
    updatePassword(oldPassword: String!, newPassword: String!): User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    dateOfBirth: Date
    password: String!
  }

  type Token {
    value: String!
  }
`;
