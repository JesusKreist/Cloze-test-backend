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
      imageUrl: String
      isSocial: Boolean
    ): User
    login(usernameOrEmail: String!, password: String!): Token
    updatePassword(oldPassword: String!, newPassword: String!): User
  }

  type User {
    id: ID!
    fullName: String!
    username: String!
    dateOfBirth: Date
    password: String!
    imageUrl: String
  }

  type Token {
    value: String!
  }
`;
