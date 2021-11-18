import { gql } from "apollo-server-lambda";

export const prototype = gql`
  extend type Query {
    displayTestString: String!
  }
`;
