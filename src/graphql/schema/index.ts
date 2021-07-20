import { gql } from "apollo-server-lambda";
import { customScalars } from "./custom";
import { user } from "./user";
import { s3Upload } from "./s3upload";
import { quiz } from "./quiz";

const defaultSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [defaultSchema, customScalars, user, s3Upload, quiz];
