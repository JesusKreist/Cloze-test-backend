import { authorResolver } from "./author";
import { bookResolver } from "./book";
import { customResolverMap } from "./custom";
import { uploadResolver } from "./s3upload";
import { userResolver } from "./user";

export const resolvers = [
  customResolverMap,
  authorResolver,
  bookResolver,
  userResolver,
  uploadResolver,
];
