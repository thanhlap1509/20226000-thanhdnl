const { StatusCodes } = require("http-status-codes");
const converter = require("json-2-csv");
const userService = require("../services/user");

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
};

const getUsers = async (req, res) => {
  const users = await userService.getUsers(req.query);
  res.send(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUser(req.params.userId);
  res.send(user);
};

const getUsersAsCSV = async (req, res) => {
  const users = await userService.getUsers(req.query);
  const data = converter.json2csv(JSON.parse(JSON.stringify(users.data)));

  res.attachment("result.csv");
  res.status(200).send(data);
};

const updateUser = async (req, res) => {
  const result = await userService.updateUser(req.params.userId, req.body);
  res.send(result);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.userId);
  res.send(result);
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
  const userStats = await userService.getUserCountByEmailDomains(null, null, {
    start_date: req.query.start_date,
    end_date: req.query.end_date,
  });
  res.send(userStats);
};

const getUserCountByEmailDomain = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomain(
    req.params.domain,
    {
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    },
  );
  res.send(userStats);
};

const getTopNEmailDomains = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomains(
    "des",
    req.params.n,
    { start_date: req.query.start_date, end_date: req.query.end_date },
  );
  res.send(userStats);
};

const getLastNEmailDomains = async (req, res) => {
  const userStats = await userService.getUserCountByEmailDomains(
    "asc",
    req.params.n,
    { start_date: req.query.start_date, end_date: req.query.end_date },
  );
  res.send(userStats);
};
const exportFuncs = {
  createUser,
  getUser,
  getUsers,
  getUsersAsCSV,
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

module.exports = exportFuncs;
