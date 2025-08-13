const { StatusCodes } = require("http-status-codes");
const userService = require("../services");
const { catchAsync } = require("../utils");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  console.log(StatusCodes.CREATED);
  res.status(StatusCodes.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.userId);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  console.log("Id in controller is " + req.params.userId);
  console.log(req.body);

  const user = await userService.updateUser(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(StatusCodes.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
