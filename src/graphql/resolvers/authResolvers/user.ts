import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from "apollo-server-lambda";
import { IUser, UserModel } from "../../../database/models/user";
import { ResolverContext } from "../../servers";
import * as jwt from "jsonwebtoken";
import faker from "faker";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

export type TokenUserObject = {
  username: string;
  id: string;
  fullName: string;
};

export type DecodedGoogleToken = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
};

type NewUser = Omit<IUser, "id" | "isPasswordCorrect" | "refreshTokens">;
type LoginParams = { usernameOrEmail: string; password: string };

const GOOGLE_CLIENT_ID =
  "6555442020-tan1qs8oit4dfrquajmn3a9s96f13ggr.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const userResolver = {
  Mutation: {
    login: async (
      _root: any,
      { password, usernameOrEmail }: LoginParams,
      { mongooseConnection }: ResolverContext
    ) => {
      if (!usernameOrEmail) {
        return new UserInputError("Please enter a username or email address.");
      }

      const UserDatabase = UserModel(mongooseConnection);

      const enteredUser = await UserDatabase.findOne({
        $or: [{ emailAddress: usernameOrEmail }, { username: usernameOrEmail }],
      });
      if (!enteredUser) {
        return new AuthenticationError("Username or password incorrect!");
      }

      const passwordIsCorrect = await enteredUser?.isPasswordCorrect(password);
      if (!passwordIsCorrect) {
        return new AuthenticationError("Username or password incorrect!");
      }

      const loggedInUser: TokenUserObject = {
        username: enteredUser.username,
        id: enteredUser._id,
        fullName: enteredUser.fullName,
      };
      // TODO Create two tokens, access and refresh tokens

      const accessToken = jwt.sign(
        loggedInUser,
        enteredUser.accessTokenSecret,
        {
          expiresIn: "15s",
        }
      );

      const refreshToken = jwt.sign(
        loggedInUser,
        enteredUser.refreshTokenSecret
      );

      return { accessToken, refreshToken };
    },
    createUser: async (
      _root: any,
      {
        username,
        password,
        fullName,
        emailAddress,
        dateOfBirth,
        imageUrl,
        isSocial,
      }: NewUser,
      { mongooseConnection }: ResolverContext
    ) => {
      const User = UserModel(mongooseConnection);

      const emailAddressInLowerCase = emailAddress.toLowerCase();
      const userWithSameEmail = await User.findOne({ emailAddressInLowerCase });
      if (userWithSameEmail) {
        return new ApolloError("Email already exists.");
      }

      if (isSocial) {
        console.log("This is a social account.");
        username = emailAddressInLowerCase;
        password = `${faker.internet.password(10, false, /^[aA-zZ0-9]+$/)}`;
      }

      const usernameInLowerCase = username.toLowerCase();
      const userWithSameUsername = await User.findOne({ usernameInLowerCase });
      if (userWithSameUsername) {
        return new ApolloError("Username already taken.");
      }

      const newUser: NewUser = {
        username,
        fullName,
        password,
        emailAddress,
        dateOfBirth,
        emailAddressInLowerCase,
        usernameInLowerCase,
        imageUrl,
        accessTokenSecret: crypto.randomBytes(256).toString("base64"),
        refreshTokenSecret: crypto.randomBytes(256).toString("base64"),
      };

      try {
        const newlyCreatedUser = await User.create(newUser);
        return newlyCreatedUser;
      } catch (error) {
        if (error instanceof Error) {
          throw new UserInputError(error.message, { invalidArgs: newUser });
        } else {
          throw new Error("An error occured when creating a new user");
        }
      }
    },
    googleSocialLogin: async (
      _root: any,
      { googleTokenId }: { googleTokenId: string },
      { mongooseConnection }: ResolverContext
    ) => {
      const verify = async () => {
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: googleTokenId,
            audience: GOOGLE_CLIENT_ID,
          });

          console.log(ticket);

          const payload = ticket.getPayload();
          if (payload) {
            const userid = payload["sub"];
            console.log(userid);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          }
        }
      };

      verify();

      // const decodedGoogleToken = jwt.decode(googleTokenId);
      // console.log(decodedGoogleToken);
      mongooseConnection;
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
        if (error instanceof Error) {
          throw new ApolloError("An error occured!", error.message);
        } else {
          throw new ApolloError(
            "An error occured when updating the password. "
          );
        }
      }
    },
  },
};
