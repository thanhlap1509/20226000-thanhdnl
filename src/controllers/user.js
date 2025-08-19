const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user");
const catchAsync = require("../utils/catchAsync");

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
};

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.send(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUser(req.params.userId);
  res.send(user);
};

const updateUser = async (req, res) => {
  await userService.updateUser(req.params.userId, req.body);
  res.send({ userFound: 1, userUpdated: 1 });
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.send({ userFound: 1, userDeleted: 1 });
};

const getUserAge = async (req, res) => {
  const userAge = await userService.getUserAge(req.params.userId);
  res.send(userAge);
};

const getUserCount = async (req, res) => {
  const userCount = await userService.getUserCount();
  res.send({ userCount });
};

const getUserCountByRoles = async (req, res) => {
  const userStats = await userService.getUserCountByRoles();
  res.send(userStats);
};

const getUserCountByRole = async (req, res) => {
  const userStats = await userService.getUserCountByRole(req.params.role);
  return res.send(userStats);
};

const getUserCountByEmailDomains = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomains();
  res.send(userStats);
};

const getUserCountByEmailDomain = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomain(
    req.params.domain,
  );
  res.send(userStats);
};

const getTopNEmailDomains = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomains(
    "des",
    req.params.n,
  );
  res.send(userStats);
};

const getLastNEmailDomains = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomains(
    "asc",
    req.params.n,
  );
  res.send(userStats);
};

const exportFuncs = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
  getLastNEmailDomains,
  getTopNEmailDomains,
  getUserAge,
};

// for (const [fnName, fn] of Object.entries(exportFuncs)) {
//   exportFuncs[fnName] = catchAsync(fn);
// }

Object.entries(exportFuncs).forEach(([fnName, fn]) => {
  exportFuncs[fnName] = catchAsync(fn);
});

module.exports = exportFuncs;
