import { customResolverMap } from "./custom";
import { prototypeResolver } from "./prototype";
import { quizResolver } from "./quiz";
import { uploadResolver } from "./s3upload";
import { userResolver } from "./user";

export const resolvers = [
  customResolverMap,
  userResolver,
  uploadResolver,
  quizResolver,
  prototypeResolver,
];
