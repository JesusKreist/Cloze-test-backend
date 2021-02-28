import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import config from "../utils/config";
import { ApolloError } from "apollo-server-lambda";
import { logger } from "../utils/logger";

export class AWSS3Uploader {
  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  getSignedUrl = (fileExtension: string) => {
    const randomFileName = `${uuid()}.${fileExtension}`;
    const uploadParams = {
      Bucket: config.AWS_BUCKET_NAME,
      Key: randomFileName,
    };

    try {
      return {
        signedUrl: this.s3.getSignedUrl("putObject", uploadParams),
        fileName: randomFileName,
        fileType: fileExtension,
      };
    } catch (error) {
      logger.error("An error occured while getting a signed url.", {
        ...error,
      });
      throw new ApolloError("Couldn't get the signed url.");
    }
  };
}
