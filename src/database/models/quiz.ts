import mongoose, { HookNextFunction } from "mongoose";
import { createQuiz, ProcessedWord } from "../../quiz/createQuiz";

export interface Quiz extends mongoose.Document {
  title: string;
  text: string;
  createdQuiz: ProcessedWord[];
  isNew: boolean;
}

const schema: mongoose.SchemaDefinition = {
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  text: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  createdQuiz: [
    {
      wordType: {
        type: mongoose.Schema.Types.String,
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
    },
  ],
};

const QuizSchema: mongoose.Schema = new mongoose.Schema(schema);
QuizSchema.pre("save", async function (next: HookNextFunction) {
  const thisObj = this as Quiz;

  if (thisObj.isNew) {
    try {
      thisObj.createdQuiz = createQuiz(thisObj.text);
      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  return next();
});

export const QuizModel = (databaseConnection: mongoose.Connection) => {
  return databaseConnection.model(
    "Quiz",
    QuizSchema
  ) as any as mongoose.Model<Quiz>;
};
