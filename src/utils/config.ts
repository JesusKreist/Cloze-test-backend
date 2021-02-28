let { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  throw new Error("MongoDB uri is not set!");
} else {
  MONGODB_URI = MONGODB_URI.toString();
}

let { LOG_DNA_INGESTION_KEY } = process.env;
if (!LOG_DNA_INGESTION_KEY) {
  throw new Error("Log dna ingestion key is not set!");
} else {
  LOG_DNA_INGESTION_KEY = LOG_DNA_INGESTION_KEY.toString();
}

let { APP_NAME } = process.env;
if (!APP_NAME) {
  throw new Error("App name is not set!");
} else {
  APP_NAME = APP_NAME.toString();
}

let { STAGE } = process.env;
if (!STAGE) {
  throw new Error("Stage is not set!");
} else {
  STAGE = STAGE.toString();
}

let { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error("JWT Secret is not set!");
} else {
  JWT_SECRET = JWT_SECRET.toString();
}

let { JWT_EXPIRES_IN } = process.env;
if (!JWT_EXPIRES_IN) {
  throw new Error("JWT expiration is not set!");
} else {
  JWT_EXPIRES_IN = JWT_EXPIRES_IN.toString();
}

let { AWS_BUCKET_NAME } = process.env;
if (!AWS_BUCKET_NAME) {
  throw new Error("AWS bucket name is not set!");
} else {
  AWS_BUCKET_NAME = AWS_BUCKET_NAME.toString();
}

export default {
  MONGODB_URI,
  LOG_DNA_INGESTION_KEY,
  APP_NAME,
  STAGE,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  AWS_BUCKET_NAME,
};
