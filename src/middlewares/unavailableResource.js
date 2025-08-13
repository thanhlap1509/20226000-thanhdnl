module.exports = (req, res, next) => {
  const error = new Error();
  error.statusCode = 404;
  next(error);
};
