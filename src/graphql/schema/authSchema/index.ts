import { gql } from "apollo-server-lambda";
import { customScalars } from "./custom";
import { user } from "./user";
import { prototype } from "./prototype";

const defaultSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const authServerTypeDefs = [
  defaultSchema,
  customScalars,
  user,
  prototype,
];
