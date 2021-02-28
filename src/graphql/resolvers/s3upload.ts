import { AWSS3Uploader } from "../../aws/awsuploader";

const s3Uploader = new AWSS3Uploader();

export const uploadResolver = {
  Mutation: {
    getSignedUrl: async (
      _root: any,
      { fileExtension }: { fileExtension: string }
    ) => {
      return s3Uploader.getSignedUrl(fileExtension);
    },
  },
};
