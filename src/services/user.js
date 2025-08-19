const userDaos = require("../daos/user");
const prepareSortCondition = require("../utils/prepareSortCondition");
const ObjectId = require("mongoose").Types.ObjectId;
const errorCode = require("../error/code");
const CustomError = require("../error/customError");
const { USER_ROLES } = require("../constants/user");

const performUserIdQuery = async (userId, queryFunc, otherData) => {
  if (ObjectId.isValid(userId)) {
    const res = await queryFunc(userId, otherData);
    if (res) {
      return res;
    }
    const error = new CustomError(errorCode.NOT_FOUND);
    error.details = "User not found";
    throw error;
  }
  const error = new CustomError(errorCode.BAD_REQUEST);
  error.details = "Invalid userId";
  throw error;
};

const createUser = async (data) => {
  const user = await userDaos.createUser(data);
  return user;
};

const getUser = async (userId) => {
  const user = await performUserIdQuery(userId, userDaos.findUserById);
  return user;
};

const getAllUsers = async ({ sort_by, limit, offset, ...filter }) => {
  if (sort_by) {
    sort_by = prepareSortCondition(sort_by);
    const users = await userDaos.returnAllUsers(sort_by, limit, offset, filter);
    return users;
  }
  const users = await userDaos.returnAllUsers(null, limit, offset, filter);
  return users;
};

const updateUser = async (userId, data) => {
  const user = await performUserIdQuery(userId, userDaos.updateUser, data);
  return user;
};

const deleteUser = async (userId) => {
  const user = performUserIdQuery(userId, userDaos.deleteUser);
  return user;
};

const getUserAge = async (userId) => {
  const createdTime = (
    await performUserIdQuery(userId, userDaos.getUserCreatedTime)
  ).createdAt;
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
    const prevMonth = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      0,
    );
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
  const userCount = await userDaos.getUserCount();
  return userCount;
};

const getUserCountByRole = async (role) => {
  const count = await userDaos.getUserCountByRole(role);
  const roleCount = {
    role,
    count,
  };
  return roleCount;
};

const getUserCountByRoles = async () => {
  const roleCounts = await Promise.all(
    USER_ROLES.map(async (role) => {
      const roleCount = await getUserCountByRole(role);
      return roleCount;
    }),
  );
  return roleCounts;
};

const getUserCountByEmailDomains = async (sortOrder, count) => {
  const userStats = await userDaos.getUserCountByEmailDomains(sortOrder, count);
  return userStats;
};

const getUserCountByEmailDomain = async (domain) => {
  const userStats = await userDaos.getUserCountByEmailDomain(domain);
  return userStats;
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
