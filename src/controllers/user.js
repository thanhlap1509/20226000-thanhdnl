const { StatusCodes } = require("http-status-codes");
const userService = require("../services");
const { catchAsync } = require("../utils");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  console.log(StatusCodes.CREATED);
  res.status(StatusCodes.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query.sort_by);
  res.send(users);
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUser(req.params.userId);
  if (user) {
    res.send(user);
  } else {
    next();
  }
});

const updateUser = catchAsync(async (req, res, next) => {
  console.log("Id in controller is " + req.params.userId);
  console.log(req.body);

  const user = await userService.updateUser(req.params.userId, req.body);
  if (user) {
    res.send(user);
  } else {
    next();
  }
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await userService.deleteUser(req.params.userId);
  if (user) {
    res.status(StatusCodes.NO_CONTENT).send();
  } else {
    next();
  }
});

const getUserCount = catchAsync(async (req, res) => {
  const userCount = await userService.getUserCount();
  console.log(userCount);

  res.send({ userCount });
});

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
};
