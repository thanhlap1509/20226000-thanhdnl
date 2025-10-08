import { createLogger, format, transports, config } from "winston";

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
    format: format.combine(levelFilter(level), format.prettyPrint()),
  });
});

const createModuleLogger = (moduleName) => {
  const logger = createLogger({
    defaultMeta: { source: { module: moduleName } },
    format: format.combine(format.timestamp(), format.prettyPrint()),
    transports: [
      new transports.Console({
        level: process.env.LOG_LEVEL || "info",
      }),
      new transports.File({ filename: "./logs/combine.log" }),
      ...levels_transports,
    ],
  });
  return logger;
};

export default createModuleLogger;
