import { customResolverMap } from "./custom";
import { prototypeResolver } from "./prototype";
import { userResolver } from "./user";

export const authServerResolvers = [
  customResolverMap,
  userResolver,
  prototypeResolver,
];
