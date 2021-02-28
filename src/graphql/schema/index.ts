import { gql } from "apollo-server-lambda";
import { book } from "./book";
import { author } from "./author";
import { customScalars } from "./custom";
import { user } from "./user";
import { s3Upload } from "./s3upload";

const defaultSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  defaultSchema,
  customScalars,
  author,
  book,
  user,
  s3Upload,
];
