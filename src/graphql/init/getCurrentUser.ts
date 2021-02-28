import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../database/models/user";
import config from "../../utils/config";
import { logger } from "../../utils/logger";
import { TokenUserObject } from "../resolvers/user";

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
      logger.error("An error occured while decoding the token", { ...error });
    }
  }

  if (verifiedToken) {
    decodedToken = verifiedToken as TokenUserObject;

    try {
      await User.findById(decodedToken.id);
      return decodedToken;
    } catch (error) {
      logger.info("Unable to find user");
      return null;
    }
  }

  return null;
};
