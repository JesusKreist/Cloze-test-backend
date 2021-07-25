import mongoose, { HookNextFunction } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import * as bcrypt from "bcryptjs";
import { ProcessedWordObject } from "./processedWord";

export interface Quiz extends mongoose.Document {
  rank: string;
  title: string;
  text: string;
  createdQuiz?: ProcessedWordObject[];
}

const schema: mongoose.SchemaDefinition = {
  rank: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  text: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  createdQuiz: {
    type: mongoose.Schema.Types.Array,
    required: true,
  },
};

const UserSchema: mongoose.Schema = new mongoose.Schema(schema);

UserSchema.pre("save", async function (next: HookNextFunction) {
  const thisObj = this as IUser;

  return next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  const thisObj = this as IUser;
  return await bcrypt.compare(password, thisObj.password);
};

UserSchema.plugin(uniqueValidator);
export const UserModel = (databaseConnection: mongoose.Connection) => {
  const User = databaseConnection.model("User", UserSchema) as any;
  return User as mongoose.Model<IUser>;
};
