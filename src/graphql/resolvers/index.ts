import { prototypeResolver } from "./prototype";
import { quizResolver } from "./quiz";
import { uploadResolver } from "./s3upload";

export const resolvers = [uploadResolver, quizResolver, prototypeResolver];
