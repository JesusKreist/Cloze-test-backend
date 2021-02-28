import { ApolloError } from "apollo-server-lambda";
import { logger } from "../../utils/logger";
import config from "../../utils/config";
import mongoose from "mongoose";

mongoose.set("debug", true);
let cachedDatabaseConnection: mongoose.Connection | null = null;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (cachedDatabaseConnection === null) {
    logger.debug("Trying to connect to database", {
      databaseUrl: config.MONGODB_URI,
    });
    try {
      cachedDatabaseConnection = await mongoose.createConnection(
        config.MONGODB_URI,
        {
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        }
      );
      logger.info("Successfully connected to database");
    } catch (error) {
      logger.error("Could not connect to database", { ...error });
      throw new ApolloError("Could not connect to database", error);
    }
  } else {
    logger.info("Using cached database instance");
  }
  return cachedDatabaseConnection;
};
