import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./resolvers/index";
import { typeDefs } from "./schema/index";
import { CustomApolloContext } from "../handler";
import mongoose from "mongoose";
import { APIGatewayEvent } from "aws-lambda";
import { TokenUserObject } from "./resolvers/user";
import { getCurrentUser } from "./init/getCurrentUser";

const GRAPHQL_STAGE = process.env.STAGE || "prod";

export interface ResolverContext {
  mongooseConnection: mongoose.Connection;
  currentUser: TokenUserObject | null;
}

interface ApolloContextParams {
  context: CustomApolloContext;
  event: APIGatewayEvent;
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    endpoint: `/${GRAPHQL_STAGE}/graphql`,
  },
  context: async ({ context, event }: ApolloContextParams) => {
    const { mongooseConnection } = context;
    const auth = event.headers.Authorization;

    const currentUser = await getCurrentUser(auth, mongooseConnection);

    const returnedContext: ResolverContext = {
      mongooseConnection,
      currentUser,
    };

    return returnedContext;
  },
});
