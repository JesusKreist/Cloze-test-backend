import { ApolloError } from "apollo-server-lambda";
import config from "../../utils/config";
import mongoose from "mongoose";

// mongoose.set("debug", true);

export const getConnection = async (): Promise<mongoose.Connection> => {
  let cachedDatabaseConnection: mongoose.Connection | null = null;

  if (cachedDatabaseConnection === null) {
    console.debug("Trying to connect to database");
    console.debug({ databaseUrl: config.MONGODB_URI });

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
      console.info("Successfully connected to database");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Could not connect to database", { ...error });
        throw new ApolloError("Could not connect to database", error.message);
      }
    }
  } else {
    console.info("Using cached database instance");
  }

  return cachedDatabaseConnection as mongoose.Connection;
};
