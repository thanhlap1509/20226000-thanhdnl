const { userModel } = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const { userRoles } = require("../models/user");
const { binarySearch } = require("../utils");

const addEmailDomain = (data) => {
  data.domain = data.email.split("@")[1];
  return data;
};

const createUser = async (userData) => {
  userData = addEmailDomain(userData);
  const user = await userModel.insertOne(userData);
  return user;
};

const createUsers = async (usersData) => {
  usersData = usersData.map((data) => {
    data = addEmailDomain(data);
    return data;
  });
  return await userModel.insertMany(usersData, { ordered: false });
};

const findUserById = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }
  return await userModel.findById(userId);
};

const returnAllUsers = async (sortCondition, limit, offset) => {
  if (!sortCondition) {
    return await userModel.find({}).skip(offset).limit(limit);
  }
  return await userModel.find({}).sort(sortCondition).skip(offset).limit(limit);
};

const updateUser = async (userId, userData) => {
  if (userData.email) {
    userData = addEmailDomain(userData);
  }
  return await userModel.findByIdAndUpdate(userId, userData, {
    new: true,
  });
};

const deleteUser = async (userId) => {
  return await userModel.findByIdAndDelete(userId);
};

const getUserCount = async () => {
  return await userModel.estimatedDocumentCount();
};

const getUserCountByRoles = async () => {
  return await Promise.all(
    userRoles.map(async (role) => ({
      role,
      count: await userModel.countDocuments({ role }),
    })),
  );
};

const getUserCountByRole = async (role) => {
  if (binarySearch(userRoles, role, (a, b) => a.localeCompare(b)) === -1) {
    return null;
  }
  return await {
    role,
    count: await userModel.countDocuments({ role }),
  };
};

const getUserCountByEmailDomains = async (order, count) => {
  const docCount = Number(count);
  const pipeline = [
    {
      $group: {
        _id: "$domain",
        count: { $sum: 1 },
      },
    },
  ];

  if (order) {
    pipeline.push({ $sort: { count: order === "asc" ? 1 : -1 } });
  }
  if (docCount) {
    pipeline.push({ $limit: docCount });
  }

  return await userModel.aggregate(pipeline);
};

const getUserCountByEmailDomain = async (domain) => {
  return await {
    domain,
    count: await userModel.countDocuments({ domain }),
  };
};

module.exports = {
  createUser,
  createUsers,
  findUserById,
  returnAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
};
