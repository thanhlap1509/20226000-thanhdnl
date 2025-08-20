const catchAsync = (fn) => (req, res, next) => {
  console.log("catch async");
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const catchAsyncWrapper = (exportFns) => {
  Object.entries(exportFns).forEach(([fnName, fn]) => {
    exportFns[fnName] = catchAsync(fn);
  });
  return exportFns;
};
module.exports = catchAsyncWrapper;
