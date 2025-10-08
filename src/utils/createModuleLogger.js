import { createLogger, format, transports, config } from "winston";
import { redactEmail } from "./redactInformation.js";
const redactSensitive = format((info) => {
  if (info.returnData) {
    if (info.returnData.user) {
      info.returnData.user.email = redactEmail(info.returnData.user.email);
    }
  }
  if (info.returnData) {
    if (info.returnData.users) {
      info.returnData.users.map((user) => {
        user.email = redactEmail(user.email);
        return user;
      });
    }
  }
  if (info.body) {
    if (info.body.email) {
      info.body.email = redactEmail(info.body.email);
    }
  }
  return info;
});

const levelFilter = (level) => {
  return format((info) => {
    return level.localeCompare(info.level) === 0 ? info : false;
  })();
};

const levels =
  (process.env.LOG_LEVELS && JSON.parse(process.env.LOG_LEVELS)) ||
  config.npm.levels;

const levels_transports = Object.keys(levels).map((level) => {
  return new transports.File({
    level: level,
    filename: `./logs/${level}.log`,
    format: levelFilter(level),
  });
});

const createModuleLogger = (moduleName) => {
  const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    defaultMeta: { source: { module: moduleName } },
    format: format.combine(
      format.timestamp(),
      redactSensitive(),
      format.prettyPrint(),
    ),
    transports: [
      new transports.Console({}),
      new transports.File({ filename: "./logs/combine.log" }),
      ...levels_transports,
    ],
  });
  return logger;
};

export default createModuleLogger;
