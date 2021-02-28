import { consoleFormat } from "winston-console-format";
import logdna from "@logdna/logger";
import config from "./config";
import winston from "winston";

const customLevels = {
  levels: {
    verbose: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
  },
  colors: {
    verbose: "white",
    debug: "blue",
    info: "green",
    warn: "yellow",
    error: "red",
  },
};

const isProductionEnv = process.env.STAGE?.toString() === "prod";

const consoleFormatOptions = {
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.padLevels(),
    consoleFormat({
      showMeta: true,
      metaStrip: ["timestamp"],
      inspectOptions: {
        depth: Infinity,
        colors: true,
        maxArrayLength: Infinity,
        breakLength: 60,
        compact: Infinity,
      },
    })
  ),
};

interface LogdnaConfig extends logdna.ConstructorOptions {
  hostname: string;
  app: string;
  env: string;
  indexMeta: boolean;
}

class Logger {
  private logger: winston.Logger;
  private logdnaLogger!: logdna.Logger;

  constructor() {
    const transport = new winston.transports.Console(consoleFormatOptions);

    this.logger = winston.createLogger({
      level: isProductionEnv ? "error" : "verbose",
      levels: customLevels.levels,
      transports: [transport],
    });

    if (isProductionEnv) {
      const logdnaOptions: LogdnaConfig = {
        hostname: "LambdaFunction",
        app: config.APP_NAME ?? "boilerplate",
        env: config.STAGE ?? "prod",
        indexMeta: true,
      };

      this.logdnaLogger = logdna.createLogger(
        config.LOG_DNA_INGESTION_KEY.toString(),
        logdnaOptions
      );
    }

    winston.addColors(customLevels.colors);
  }

  verbose(msg: any, meta?: any) {
    if (isProductionEnv) {
      this.logdnaLogger.trace(msg, { indexMeta: true, meta });
    }

    this.logger.level = "verbose";
    this.logger.verbose(msg, meta);
  }

  debug(msg: any, meta?: any) {
    if (isProductionEnv) {
      this.logdnaLogger.debug(msg, { indexMeta: true, meta });
    }

    this.logger.level = "debug";
    this.logger.debug(msg, meta);
  }

  info(msg: any, meta?: any) {
    if (isProductionEnv) {
      this.logdnaLogger.info(msg, { indexMeta: true, meta });
    }

    this.logger.level = "info";
    this.logger.info(msg, meta);
  }

  warn(msg: any, meta?: any) {
    if (isProductionEnv) {
      this.logdnaLogger.warn(msg, { indexMeta: true, meta });
    }

    this.logger.level = "warn";
    this.logger.warn(msg, meta);
  }

  error(msg: any, meta?: any) {
    if (isProductionEnv) {
      this.logdnaLogger.error(msg, { indexMeta: true, meta });
    }

    this.logger.level = "error";
    this.logger.error(msg, meta);
  }
}

export const logger = new Logger();
