import { gql } from "apollo-server-lambda";

export const s3Upload = gql`
  type SignedUrlObject {
    signedUrl: String!
    fileName: String!
    fileType: String!
  }

  extend type Mutation {
    getSignedUrl(fileExtension: String!): SignedUrlObject
  }
`;
