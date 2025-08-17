const { StatusCodes } = require("http-status-codes");
const userService = require("../services");
const { catchAsync } = require("../utils");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query.sort_by, req.query.limit, req.query.offset);
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
  res.send({ userCount });
});

const getUserCountByRoles = catchAsync(async (req, res) => {
  const userStats = await userService.getUserCountByRoles();
  res.send(userStats);
});

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
  getUserCountByRoles,
};
