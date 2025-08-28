import { StatusCodes } from "http-status-codes";
import userService from "../services/user.js";

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

const addExportJob = async (req, res) => {
  const { _id, progress } = await userService.addExportJob(
    req.query,
    req.protocol,
    req.get("host"),
    req.originalUrl,
  );
  res.send({ _id, progress });
};

const checkExportJob = async (req, res) => {
  const { progress, downloadUrl } = await userService.checkExportJob(
    req.params.jobId,
  );
  res.send({ progress, downloadUrl });
};

const downloadExportCSV = async (req, res) => {
  const exportJobFilePath = await userService.getExportJobFilePath(
    req.params.jobId,
  );
  res.download(exportJobFilePath);
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
export {
  createUser,
  getUser,
  getUsers,
  addExportJob,
  checkExportJob,
  downloadExportCSV,
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
