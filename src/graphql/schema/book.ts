import { gql } from "apollo-server-lambda";

export const book = gql`
  extend type Query {
    getAllBooks: [Book]!
    getOneBook(bookTitle: String!): Book
  }

  extend type Mutation {
    addOneBook(
      title: String!
      genres: [String!]
      publicationDate: Date
      ISBN: ISBN
    ): Book!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    genres: [String]!
    publicationDate: Date
    ISBN: ISBN
  }
`;
