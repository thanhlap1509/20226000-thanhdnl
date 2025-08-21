const ObjectId = require("mongoose").Types.ObjectId;

const userDaos = require("../daos/user");
const prepareSortCondition = require("../utils/prepareSortCondition");
const hashPassword = require("../utils/hashPassword");
const strToDate = require("../utils/strToDate");
const errorCode = require("../error/code");
const CustomError = require("../error/customError");

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
  data.password = await hashPassword(data.password);
  const user = await userDaos.createUser(data);
  return user;
};

const getUser = async (userId) => {
  const user = await performUserIdQuery(userId, userDaos.findUserById);
  return user;
};

const getUsers = async ({
  sort_by,
  limit,
  offset,
  email,
  role,
  start_date,
  end_date,
}) => {
  start_date = strToDate(start_date);
  end_date = strToDate(end_date);
  let data;
  if (sort_by) {
    sort_by = prepareSortCondition(sort_by);
    data = await userDaos.returnUsers({
      sort_by,
      limit: limit + 1,
      offset,
      email,
      role,
      start_date,
      end_date,
    });
  } else {
    data = await userDaos.returnUsers({
      limit: limit + 1,
      offset,
      email,
      role,
      start_date,
      end_date,
    });
  }
  let hasNextPage;
  let returnData;

  const total = await userDaos.getUserCount();
  const totalPages = Math.ceil(total / limit);

  offset = Number(offset);
  limit = Number(limit);

  if (limit && offset) {
    hasNextPage = data.length > limit;
    returnData = {
      data: data.slice(0, limit),
      pagination: {
        total,
        offset,
        limit,
        totalPages,
        hasNextPage,
      },
    };
  }
  return returnData;
};

const updateUser = async (userId, data) => {
  data.password = await hashPassword(data.password);
  const result = await performUserIdQuery(userId, userDaos.updateUser, data);
  return result;
};

const deleteUser = async (userId) => {
  const result = performUserIdQuery(userId, userDaos.deleteUser);
  return result;
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
  const roleCounts = await userDaos.getUserCountByRoles();
  return roleCounts;
};

const getUserCountByEmailDomains = async (
  sortOrder,
  domainsCount,
  { start_date, end_date },
) => {
  start_date = strToDate(start_date);
  end_date = strToDate(end_date);
  const userStats = await userDaos.getUserCountByEmailDomains(
    sortOrder,
    Number(domainsCount),
    { start_date, end_date },
  );
  return userStats;
};

const getUserCountByEmailDomain = async (domain, { start_date, end_date }) => {
  start_date = strToDate(start_date);
  end_date = strToDate(end_date);
  const userStats = await userDaos.getUserCountByEmailDomain(domain, {
    start_date,
    end_date,
  });
  return userStats;
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
  getUserCount,
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
  getUserAge,
};
