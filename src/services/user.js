const userDaos = require("../daos");
const { prepareSortCondition } = require("../utils");
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
  sortCondition = prepareSortCondition(sortCondition);
  return await userDaos.returnAllUsers(sortCondition, limit, offset);
};

const updateUser = async (userId, data) => {
  return await userDaos.updateUser(userId, data);
};

const deleteUser = async (userId) => {
  return await userDaos.deleteUser(userId);
};

const getUserAge = async (userId) => {
  const createdTime = (await userDaos.getUserCreatedTime(userId)).createdAt;
  const currentTime = new Date();

  let years = currentTime.getFullYear() - createdTime.getFullYear();
  let months = currentTime.getMonth() - createdTime.getMonth();
  let days = currentTime.getDate() - createdTime.getDate();
  let hours = currentTime.getHours() - createdTime.getHours();
  let minutes = currentTime.getMinutes() - createdTime.getMinutes();

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const prevMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { currentTime, createdTime, years, months, days, hours, minutes };
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

const getUserCountByEmailDomains = async (sortOrder, count) => {
  return await userDaos.getUserCountByEmailDomains(sortOrder, count);
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
  getUserAge,
};
