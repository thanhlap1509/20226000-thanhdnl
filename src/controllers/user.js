const { StatusCodes } = require("http-status-codes");
const userService = require("../services");
const { catchAsync } = require("../utils");

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
};

const getAllUsers = async (req, res) => {
  const { sort_by, limit, offset, ...filter } = req.query;
  const users = await userService.getAllUsers(sort_by, limit, offset, filter);
  res.send(users);
};

const getUser = async (req, res, next) => {
  const user = await userService.getUser(req.params.userId);
  if (user) {
    res.send(user);
  } else {
    next();
  }
};

const updateUser = async (req, res, next) => {
  const user = await userService.updateUser(req.params.userId, req.body);
  if (user) {
    res.send(user);
  } else {
    next();
  }
};

const deleteUser = async (req, res, next) => {
  const user = await userService.deleteUser(req.params.userId);
  if (user) {
    res.status(StatusCodes.NO_CONTENT).send();
  } else {
    next();
  }
};

const getUserAge = async (req, res, next) => {
  const user = await userService.getUserAge(req.params.userId);
  if (user) {
    res.send(user);
  } else {
    next();
  }
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
  res.send(await userService.getUserCountByEmailDomains("des", req.params.n));
};

const getLastNEmailDomains = async (req, res) => {
  res.send(await userService.getUserCountByEmailDomains("asc", req.params.n));
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

for (const [fnName, fn] of Object.entries(exportFuncs)) {
  exportFuncs[fnName] = catchAsync(fn);
}

module.exports = exportFuncs;
