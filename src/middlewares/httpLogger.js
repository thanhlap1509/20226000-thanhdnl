import moment from "moment";
const httpLogger = (logger) => {
  return (req, res, next) => {
    const startTime = new moment();
    let { password, ...data } = req.body;
    logger.http("Http request received", {
      URL: req.originalUrl,
      requestId: req.requestId,
      method: req.method,
      query: req.query,
      params: req.params,
      body: { ...data },
    });

    res.on("finish", () => {
      const endTime = new moment();
      logger.http("Http response transmitted", {
        URL: req.originalUrl,
        requestId: req.requestId,
        statusCode: res.statusCode,
        executionTime: `${endTime.diff(startTime, "milliseconds")} ms`,
      });
    });

    next();
  };
};

export default httpLogger;
