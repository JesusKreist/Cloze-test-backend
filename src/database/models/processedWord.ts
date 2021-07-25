import mongoose from "mongoose";

export interface ProcessedWord {
  wordType: "whole" | "split";
  returnedWord: string;
  lineLength: number;
  indexOfWord: number;
  punctuation: string;
  fullWord: string;
  answers: string[];
  hasPunctuation: boolean;
}

const schema: mongoose.SchemaDefinition = {
  wordType: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  returnedWord: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  lineLength: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  indexOfWord: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  punctuation: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  fullWord: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  answers: [
    {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  ],
  hasPunctuation: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
};

const ProcessedWordSchema: mongoose.Schema = new mongoose.Schema(schema);

export const ProcessedWordModel = (databaseConnection: mongoose.Connection) => {
  const _ProcessedWordModel = databaseConnection.model(
    "ProcessedWord",
    ProcessedWordSchema
  ) as any;
  return _ProcessedWordModel as mongoose.Model<ProcessedWord>;
};
