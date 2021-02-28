import { IAuthor } from "../../database/models/author";
import { ResolverContext } from "../server";
import { AuthorModel } from "../../database/models/author";
import { logger } from "../../utils/logger";
import { ApolloError, AuthenticationError } from "apollo-server-lambda";

export const authorResolver = {
  Query: {
    getAuthor: async (
      _root: any,
      { id }: { id: string },
      { mongooseConnection }: ResolverContext
    ) => {
      const Author = AuthorModel(mongooseConnection);

      return Author.findById(id);
    },
    getAllAuthors: async (
      _root: any,
      _args: any,
      { mongooseConnection }: ResolverContext
    ) => {
      const Author = AuthorModel(mongooseConnection);

      return Author.find({});
    },
  },
  Mutation: {
    addAuthor: async (
      _root: any,
      {
        name,
        dateOfBirth,
        street,
        city,
        country,
      }: {
        name: IAuthor["name"];
        dateOfBirth: IAuthor["dateOfBirth"];
        street: IAuthor["street"];
        city: IAuthor["city"];
        country: IAuthor["country"];
      },
      { mongooseConnection, currentUser }: ResolverContext
    ) => {
      logger.verbose("currentUser :>> ", currentUser);
      if (!currentUser) {
        throw new AuthenticationError("Only logged in users can add authors");
      }

      const Author = AuthorModel(mongooseConnection);

      const newAuthor = {
        name,
        dateOfBirth,
        street,
        city,
        country,
      };
      logger.debug("Trying to save author with params", newAuthor);

      try {
        const savedAuthor = await Author.create(newAuthor);
        logger.info("Successfully Saved!");
        return savedAuthor;
      } catch (error) {
        logger.info("Unable to create new author");
        throw new ApolloError("Unable to create new author", {
          ...error,
          invalidArgs: newAuthor,
        });
      }
    },
  },
  Author: {
    address: ({
      street,
      city,
      country,
    }: {
      street: string;
      city: string;
      country: string;
    }) => {
      return {
        street,
        city,
        country,
      };
    },
  },
};
