const userDaos = require("../daos");
const { prepareSortsortCondition } = require("../utils");
const createUser = async (data) => {
  if (Array.isArray(data)) {
    return await userDaos.createUsers(data);
  }
  return await userDaos.createUser(data);
};

const getUser = async (userId) => {
  return await userDaos.findUserById(userId);
};

const getAllUsers = async (sortCondition, limit, offset) => {
  if (!sortCondition) {
    return await userDaos.returnAllUsers(null, limit, offset);
  }
  sortCondition = prepareSortsortCondition(sortCondition);
  return await userDaos.returnAllUsers(sortCondition, limit, offset);
};

const updateUser = async (userId, data) => {
  return await userDaos.updateUser(userId, data);
};

const deleteUser = async (userId) => {
  return await userDaos.deleteUser(userId);
};

const getUserCount = async () => {
  return await userDaos.getUserCount();
};

const getUserCountByRoles = async () => {
  return await userDaos.getUserCountByRoles();
};

const getUserCountByRole = async (role) => {
  return await userDaos.getUserCountByRole(role);
};

const getUserCountByEmailDomains = async () => {
  return await userDaos.getUserCountByEmailDomains();
};

const getUserCountByEmailDomain = async (domain) => {
  return await userDaos.getUserCountByEmailDomain(domain);
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  getUserCount,
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
};
