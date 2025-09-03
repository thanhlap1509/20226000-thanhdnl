import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import { resolve } from "path";

import userDaos from "../daos/user.js";
import exportJobDaos from "../daos/exportJob.js";
import exportJob from "../models/exportJob.js";
const { EXPORT_JOB_NAME, EXPORT_JOB_STATUS } = exportJob;
import prepareSortCondition from "../utils/prepareSortCondition.js";
import hashPassword from "../utils/hashPassword.js";
import strToDate from "../utils/strToDate.js";
import { NOT_FOUND, BAD_REQUEST } from "../error/code.js";
import CustomError from "../error/customError.js";

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
    const error = new CustomError(NOT_FOUND);
    error.details = "User not found";
    throw error;
  }
  const error = new CustomError(BAD_REQUEST);
  error.details = "Invalid userId";
  throw error;
};

const encodeCursor = (obj) => {
  const cursor = Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
  return cursor;
};

const decodeCursor = (cursor) => {
  if (cursor) {
    const obj = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    return obj;
  }
  return null;
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

const computeReturnData = (queryResult, limit) => {
  const hasNextPage = queryResult.length > limit;
  const data = hasNextPage ? queryResult.slice(0, limit) : queryResult;
  return { data, hasNextPage };
};

const getUsersUsingCursor = async ({
  limit,
  sort_by,
  email,
  role,
  start_date,
  end_date,
  _id,
}) => {
  const queryResult = await userDaos.returnUsersByCursor({
    sort_by,
    limit: limit + 1,
    email,
    role,
    start_date,
    end_date,
    _id,
  });

  const { data, hasNextPage } = computeReturnData(queryResult, limit);

  const lastDocId = hasNextPage
    ? queryResult[queryResult.length - 2]._id
    : queryResult[queryResult.length - 1]._id;

  const cursor = encodeCursor({
    limit,
    sort_by,
    email,
    role,
    start_date,
    end_date,
    _id: lastDocId,
  });
  const returnData = {
    data,
    pagination: {
      limit,
      hasNextPage,
      cursor,
    },
  };
  return returnData;
};

const getUsersUsingOffset = async ({
  limit,
  sort_by,
  offset,
  email,
  role,
  start_date,
  end_date,
}) => {
  const queryResult = await userDaos.returnUsersByOffset({
    sort_by,
    limit: limit + 1,
    offset,
    email,
    role,
    start_date,
    end_date,
  });

  const { data, hasNextPage } = computeReturnData(queryResult, limit);

  const returnData = {
    data,
    pagination: {
      limit,
      hasNextPage,
      offset,
    },
  };
  return returnData;
};

const getUsers = async ({
  limit,
  sort_by,
  offset,
  cursor,
  email,
  role,
  start_date,
  end_date,
}) => {
  limit = Number(limit) || 20;
  sort_by = sort_by ? prepareSortCondition(sort_by) : null;
  offset = Number(offset);
  start_date = strToDate(start_date);
  end_date = strToDate(end_date);

  let returnData;

  if (offset) {
    returnData = await getUsersUsingOffset({
      limit,
      sort_by,
      offset,
      email,
      role,
      start_date,
      end_date,
    });
  } else {
    const queryCond = decodeCursor(cursor);
    if (queryCond) {
      returnData = await getUsersUsingCursor({ limit, ...queryCond });
    } else {
      returnData = await getUsersUsingCursor({
        limit,
        sort_by,
        email,
        role,
        start_date,
        end_date,
      });
    }
  }
  return returnData;
};

const constructExportFilePath = (jobName, jobId) => {
  const filename = `${jobName}_${jobId}_.csv`;
  const filePath = resolve("./export", filename);
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

export default {
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
