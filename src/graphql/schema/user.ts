import { gql } from "apollo-server-lambda";

export const user = gql`
  extend type Query {
    checkUser: User
  }

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      fullName: String!
      emailAddress: EmailAddress!
      dateOfBirth: Date
      photoUrl: String
    ): User
    login(
      username: String
      emailAddress: EmailAddress
      password: String!
    ): Token
    updatePassword(oldPassword: String!, newPassword: String!): User
  }

  type User {
    id: ID!
    fullName: String!
    username: String!
    dateOfBirth: Date
    password: String!
    photoUrl: String
  }

  type Token {
    value: String!
  }
`;
