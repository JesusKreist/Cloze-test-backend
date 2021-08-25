import mongoose, { HookNextFunction } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import * as bcrypt from "bcryptjs";

export interface IUser {
  id: string;
  fullName: string;
  username: string;
  usernameInLowerCase: string;
  dateOfBirth?: Date;
  password: string;
  emailAddress: string;
  emailAddressInLowerCase: string;
  photoUrl?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

type IUserDocument = mongoose.Document & IUser;

const schema: mongoose.SchemaDefinition = {
  username: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  usernameInLowerCase: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  fullName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  dateOfBirth: { type: mongoose.Schema.Types.Date, required: false },
  emailAddress: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  emailAddressInLowerCase: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  photoUrl: {
    type: mongoose.Schema.Types.String,
    unique: false,
  },
};

const UserSchema = new mongoose.Schema(schema);

UserSchema.pre<IUserDocument>("save", async function (next: HookNextFunction) {
  if (this.isModified("password")) {
    try {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
      return next();
    } catch (e) {
      return next(e);
    }
  }
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  const thisObj = this as IUserDocument;
  return await bcrypt.compare(password, thisObj.password);
};

UserSchema.plugin(uniqueValidator);
export const UserModel = (databaseConnection: mongoose.Connection) => {
  const User = databaseConnection.model("User", UserSchema) as any;
  return User as mongoose.Model<IUser>;
};
