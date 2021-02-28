import { ApolloError } from "apollo-server-lambda";
import { AuthorModel } from "../../database/models/author";
import { BookModel, IBook } from "../../database/models/book";
import { logger } from "../../utils/logger";
import { ResolverContext } from "../server";

export const bookResolver = {
  Query: {
    getAllBooks: async (
      _root: any,
      _args: any,
      { mongooseConnection }: ResolverContext
    ) => {
      const Book = BookModel(mongooseConnection);
      const Author = AuthorModel(mongooseConnection);

      const allBooks = await Book.find({}).populate({
        path: "author",
        model: Author,
        populate: { path: "booksWritten", model: Book },
      });

      return allBooks;
    },
    getOneBook: async (
      _root: any,
      {
        bookTitle,
      }: {
        bookTitle: string;
      },
      { mongooseConnection }: ResolverContext
    ) => {
      const Book = BookModel(mongooseConnection);
      const Author = AuthorModel(mongooseConnection);

      return Book.findOne({
        title: { $regex: ".*" + bookTitle + ".*", $options: "i" },
      }).populate({
        path: "author",
        model: Author,
        populate: { path: "booksWritten", model: Book },
      });
    },
  },
  Mutation: {
    addOneBook: async (
      _root: any,
      {
        title,
        authorName,
        genres,
        publicationDate,
        ISBN,
      }: {
        title: IBook["title"];
        authorName: string;
        genres: IBook["genres"];
        publicationDate: IBook["publicationDate"];
        ISBN: IBook["ISBN"];
      },
      { mongooseConnection }: ResolverContext
    ) => {
      const Book = BookModel(mongooseConnection);
      const Author = AuthorModel(mongooseConnection);

      const newBook: any = {
        title,
        publicationDate,
        genres,
        ISBN,
        author: undefined,
      };

      const authorIsInDatabase = await Author.findOne({
        name: { $regex: ".*" + authorName + ".*", $options: "i" },
      });

      if (authorIsInDatabase) {
        newBook.author = authorIsInDatabase._id;
      } else {
        const newAuthor = await Author.create({
          name: authorName,
        });
        newBook.author = newAuthor._id;
      }

      try {
        logger.info("Trying to add a new book");
        const newlyAddedBook = await Book.create(newBook);
        await Author.findByIdAndUpdate(
          newBook.author,
          {
            $push: { booksWritten: newlyAddedBook._id },
          },
          { upsert: true, new: true }
        ).exec();

        return newlyAddedBook;
      } catch (error) {
        logger.error("Could not create new book", { ...error });
        throw new ApolloError("Could not create new book", {
          newBookParams: newBook,
          ...error,
        });
      }
    },
  },
};
