import moment from "moment";
const httpLogger = (logger) => {
  return (req, res, next) => {
    const startTime = new moment();
    logger.http("Http request received", {
      URL: req.originalUrl,
      method: req.method,
      query: req.query,
      params: req.params,
    });

    res.on("finish", () => {
      const endTime = new moment();
      logger.http("Http response transmitted", {
        statusCode: res.statusCode,
        executionTime: `${endTime.diff(startTime, "milliseconds")}`,
      });
    });

    next();
  };
};

export default httpLogger;
