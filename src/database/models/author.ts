import mongoose from "mongoose";
import { IBook } from "./book";

export interface IAuthor extends mongoose.Document {
  _id: string;
  name: string;
  dateOfBirth: Date;
  street: string;
  city: string;
  country: string;
  booksWritten: IBook[];
}

const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true },
  dateOfBirth: { type: mongoose.SchemaTypes.Date, required: false },
  street: { type: mongoose.SchemaTypes.String, required: false },
  city: { type: mongoose.SchemaTypes.String, required: false },
  country: { type: mongoose.SchemaTypes.String, required: false },
  booksWritten: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Book" }],
};

const AuthorSchema: mongoose.Schema = new mongoose.Schema(schema);

export const AuthorModel = (databaseConnection: mongoose.Connection) => {
  const Author = databaseConnection.model("Author", AuthorSchema) as any;
  return Author as mongoose.Model<IAuthor>;
};
