import crypto from "crypto";

export const prototypeResolver = {
  Query: {
    displayTestString: () => {
      const testString = crypto.randomBytes(256).toString("base64");
      return testString;
    },
  },
};
