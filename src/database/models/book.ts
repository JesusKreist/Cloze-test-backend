import mongoose from "mongoose";
import { IAuthor } from "./author";

export interface IBook extends mongoose.Document {
  id: string;
  title: string;
  author: IAuthor;
  genres: string[];
  publicationDate: Date;
  ISBN: string;
}

const schema: mongoose.SchemaDefinition = {
  title: { type: mongoose.SchemaTypes.String, required: true },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Author",
  },
  genres: [{ type: mongoose.SchemaTypes.String, required: true }],
  publicationDate: { type: mongoose.SchemaTypes.Date, required: true },
  ISBN: { type: mongoose.SchemaTypes.String, required: true },
};

const BookSchema: mongoose.Schema = new mongoose.Schema(schema);

export const BookModel = (databaseConnection: mongoose.Connection) => {
  const Book = databaseConnection.model("Book", BookSchema) as any;
  return Book as mongoose.Model<IBook>;
};
