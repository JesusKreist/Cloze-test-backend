import { gql } from "apollo-server-lambda";

export const customScalars = gql`
  scalar URL
  scalar Date
  scalar EmailAddress
`;
