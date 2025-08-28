const ObjectId = require("mongoose").Types.ObjectId;
const { mkConfig, generateCsv, asString } = require("export-to-csv");
const { writeFile } = require("node:fs");
const { Buffer } = require("node:buffer");
const path = require("path");

const userDaos = require("../daos/user");
const exportJobDaos = require("../daos/exportJob");
const { EXPORT_JOB_NAME, EXPORT_JOB_STATUS } = require("../models/exportJob");
const prepareSortCondition = require("../utils/prepareSortCondition");
const hashPassword = require("../utils/hashPassword");
const strToDate = require("../utils/strToDate");
const errorCode = require("../error/code");
const CustomError = require("../error/customError");

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "result",
  quoteCharacter: "",
});

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
  cursor,
  email,
  role,
  start_date,
  end_date,
}) => {
  start_date = strToDate(start_date);
  end_date = strToDate(end_date);
  offset = Number(offset);
  limit = Number(limit) || 20;
  cursor = ObjectId.isValid(cursor) ? cursor : null;
  sort_by = sort_by ? prepareSortCondition(sort_by) : null;

  const result = await userDaos.returnUsers({
    sort_by,
    limit: limit + 1,
    offset,
    cursor,
    email,
    role,
    start_date,
    end_date,
  });
  const hasNextPage = result.length > limit;
  const data = hasNextPage ? result.slice(0, limit) : result;

  let returnData;

  if (offset) {
    returnData = {
      data: data.slice(0, limit),
      pagination: {
        offset,
        limit,
        hasNextPage,
      },
    };
  } else {
    const nextCursor = hasNextPage ? result[result.length - 2]._id : null;
    returnData = {
      data: data.slice(0, limit),
      pagination: {
        limit,
        nextCursor,
        hasNextPage,
      },
    };
  }
  return returnData;
};

const constructExportFilePath = (jobName, jobId) => {
  const filename = `${jobName}_${jobId}_.csv`;
  const filePath = path.resolve("./export", filename);
  return filePath;
};
const returnUsersAsCSV = async ({
  jobId,
  jobName,
  protocol,
  host,
  originalUrl,
  sort_by,
  limit,
  offset,
  cursor,
  email,
  role,
  start_date,
  end_date,
}) => {
  try {
    const users = await getUsers({
      sort_by,
      limit,
      offset,
      cursor,
      email,
      role,
      start_date,
      end_date,
    });

    const csvData = users.data.length > 0 ? users.data : "";
    const csv = generateCsv(csvConfig)(JSON.parse(JSON.stringify(csvData)));
    const filePath = constructExportFilePath(jobName, jobId);
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    writeFile(filePath, csvBuffer, () => {
      console.log(`File saved at ${filePath}`);
    });

    const fullUrl = `${protocol}://${host}${originalUrl}`;
    const url = new URL(fullUrl);
    url.pathname += `/${jobId}/download`;

    await exportJobDaos.updateExportJobStatus(
      jobId,
      EXPORT_JOB_STATUS.COMPLETE,
      url.toString(),
    );
    return;
  } catch (err) {
    await exportJobDaos.updateExportJobStatus(jobId, EXPORT_JOB_STATUS.FAIL);
    throw err;
  }
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

const addExportJob = async (params, protocol, host, originalUrl) => {
  const jobName = EXPORT_JOB_NAME.EXPORT_USERS;
  const job = await exportJobDaos.addExportJob(params, jobName);
  const jobId = job._id;
  // cal the return users function
  returnUsersAsCSV({ jobId, jobName, protocol, host, originalUrl, ...params });
  return job;
};

const checkExportJob = async (jobId) => {
  const job = await exportJobDaos.getJobById(jobId);
  return job;
};

const updateExportJob = async (jobId, status) => {
  const result = await exportJobDaos.updateExportJobStatus(jobId, status);
  return result;
};

const getExportJobFilePath = async (jobId) => {
  const job = await exportJobDaos.getJobById(jobId);
  const filePath = constructExportFilePath(job.name, job._id);
  return filePath;
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
  addExportJob,
  checkExportJob,
  updateExportJob,
  getExportJobFilePath,
};
