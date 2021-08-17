import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from "apollo-server-lambda";
import { IUser, UserModel } from "../../database/models/user";
import { ResolverContext } from "../server";
import * as jwt from "jsonwebtoken";
import config from "../../utils/config";

export interface TokenUserObject {
  username: string;
  id: string;
  fullName: string;
}

export const userResolver = {
  Mutation: {
    login: async (
      _root: any,
      { username, password, emailAddress }: IUser,
      { mongooseConnection }: ResolverContext
    ) => {
      if (!username && !emailAddress) {
        return new UserInputError("Please enter a username or email address.");
      }

      const UserDatabase = UserModel(mongooseConnection);
      const enteredUser =
        (await UserDatabase.findOne({ username })) ||
        (await UserDatabase.findOne({ emailAddress }));
      const passwordIsCorrect = await enteredUser?.isPasswordCorrect(password);

      if (!enteredUser || !passwordIsCorrect) {
        return new AuthenticationError("Username or password incorrect!");
      }

      const loggedInUser: TokenUserObject = {
        username,
        id: enteredUser._id,
        fullName: enteredUser.fullName,
      };

      const jwtToken = jwt.sign(loggedInUser, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      });

      return { value: jwtToken };
    },
    createUser: async (
      _root: any,
      { username, password, fullName, dateOfBirth, emailAddress }: IUser,
      { mongooseConnection }: ResolverContext
    ) => {
      const User = UserModel(mongooseConnection);

      const newUser: Partial<IUser> = {
        username,
        fullName,
        dateOfBirth,
        password,
        emailAddress,
      };

      try {
        const newlyCreatedUser = await User.create(newUser);
        return newlyCreatedUser;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: newUser });
      }
    },
    updatePassword: async (
      _root: any,
      {
        oldPassword,
        newPassword,
      }: { oldPassword: string; newPassword: string },
      { mongooseConnection, currentUser }: ResolverContext
    ) => {
      if (!currentUser) {
        throw new ApolloError("You must be logged in to update your password!");
      }

      const User = UserModel(mongooseConnection);

      const enteredUser = await User.findById(currentUser.id);
      if (!enteredUser) {
        return new UserInputError("The username you entered does not exist.");
      }

      const passwordIsCorrect = await enteredUser.isPasswordCorrect(
        oldPassword
      );
      if (!passwordIsCorrect) {
        return new AuthenticationError(
          "Nice try, but you can only alter your own accounts. Please check the password."
        );
      }

      try {
        enteredUser.password = newPassword;
        return enteredUser.save();
      } catch (error) {
        throw new ApolloError("An error occured!", { ...error });
      }
    },
  },
};
