import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../database/models/user";
import config from "../../utils/config";
import { TokenUserObject } from "../resolvers/authResolvers/user";

export const getCurrentUser = async (
  authorizationKey: string | undefined,
  mongooseConnection: mongoose.Connection
) => {
  const User = UserModel(mongooseConnection);

  let decodedToken: TokenUserObject | null = null;
  let verifiedToken: any = null;

  if (
    authorizationKey &&
    authorizationKey.toLowerCase().startsWith("bearer ")
  ) {
    const authToken = authorizationKey.substring(7);

    try {
      verifiedToken = jwt.verify(authToken, config.JWT_SECRET) as any;
    } catch (error) {
      console.error("An error occured while decoding the token");
      console.error(error);
    }
  }

  if (verifiedToken) {
    decodedToken = verifiedToken as TokenUserObject;
    console.info("Successfully decoded the token");
    console.info(verifiedToken);

    try {
      await User.findById(decodedToken.id);
      return decodedToken;
    } catch (error) {
      console.info("Unable to find user");
      return null;
    }
  }

  return null;
};
