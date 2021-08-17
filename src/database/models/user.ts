import mongoose, { HookNextFunction } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import * as bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  id: string;
  fullName: string;
  username: string;
  dateOfBirth?: Date;
  password: string;
  emailAddress: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

const schema: mongoose.SchemaDefinition = {
  username: {
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
  },
};

const UserSchema: mongoose.Schema = new mongoose.Schema(schema);

UserSchema.pre("save", async function (next: HookNextFunction) {
  const thisObj = this as IUser;

  if (this.isModified("password")) {
    try {
      const saltRounds = 12;
      thisObj.password = await bcrypt.hash(thisObj.password, saltRounds);
      return next();
    } catch (e) {
      return next(e);
    }
  }

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
