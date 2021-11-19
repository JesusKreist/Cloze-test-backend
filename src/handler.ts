import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { getConnection } from "./graphql/init/getConnection";
import { apolloServer, authServer } from "./graphql/servers";
import mongoose from "mongoose";

export interface CustomApolloContext extends Context {
  mongooseConnection: mongoose.Connection;
  currentUser: any;
}

export const graphqlHandler = (
  event: APIGatewayEvent,
  context: CustomApolloContext,
  callback: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  (async () => {
    if (Object.keys(event.headers).includes("Content-Type")) {
      event.headers["content-type"] = event.headers["Content-Type"];
    }
    const databaseConnection = await getConnection();

    const apolloHandlerContext: CustomApolloContext = {
      ...context,
      mongooseConnection: databaseConnection,
    };

    apolloServer.createHandler({
      cors: {
        origin: "*",
        credentials: true,
      },
    })(event, apolloHandlerContext, callback);
  })();
};

export const authenticationHandler = (
  event: APIGatewayEvent,
  context: CustomApolloContext,
  callback: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  (async () => {
    if (Object.keys(event.headers).includes("Content-Type")) {
      event.headers["content-type"] = event.headers["Content-Type"];
    }
    const databaseConnection = await getConnection();

    const apolloHandlerContext: CustomApolloContext = {
      ...context,
      mongooseConnection: databaseConnection,
    };

    authServer.createHandler({
      cors: {
        origin: "*",
        credentials: true,
      },
    })(event, apolloHandlerContext, callback);
  })();
};
