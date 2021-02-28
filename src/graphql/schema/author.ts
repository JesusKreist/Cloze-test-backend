import { gql } from "apollo-server-lambda";

export const author = gql`
  extend type Query {
    getAuthor(id: ID!): Author
    getAllAuthors: [Author!]
  }

  extend type Mutation {
    addAuthor(
      name: String!
      dateOfBirth: DateTime
      street: String!
      city: String!
      country: String!
    ): Author!
  }

  type Address {
    street: String!
    city: String!
    country: String!
  }

  type Author {
    id: ID!
    name: String!
    dateOfBirth: DateTime
    address: Address
    booksWritten: [Book]!
  }
`;
