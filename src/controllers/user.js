const httpStatus = require("http-status");
const userService = require("../services");
const { catchAsync } = require("../utils");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.userId);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userid, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
