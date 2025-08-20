const { userModel } = require("../models/user");

const createUser = async (userData) => {
  const user = await userModel.insertOne(userData);
  return user;
};

const findUserById = async (userId) => {
  const user = await userModel.findById(userId).lean();
  return user;
};

const returnAllUsers = async (sortCondition, limit, offset, filter) => {
  if (sortCondition) {
    const user = await userModel
      .find(filter)
      .sort(sortCondition)
      .skip(offset)
      .limit(limit)
      .lean();
    return user;
  }
  const user = await userModel.find(filter).skip(offset).limit(limit).lean();
  return user;
};

const updateUser = async (userId, userData) => {
  const result = await userModel.updateOne({ _id: userId }, userData);
  return result;
};

const deleteUser = async (userId) => {
  const result = await userModel.deleteOne({ _id: userId });
  return result;
};

const getUserCreatedTime = async (userId) => {
  const user = await userModel
    .findOne({ _id: userId }, { createdAt: 1, _id: 0 })
    .lean();
  return user;
};

const getUserCount = async () => {
  const user = await userModel.estimatedDocumentCount();
  return user;
};

const getUserCountByRole = async (role) => {
  const count = await userModel.countDocuments({ role });
  return count;
};

const getUserCountByRoles = async () => {
  const counts = await userModel.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    {
      $project: {
        role: "$_id",
        _id: 0,
        _count: "$count",
      },
    },
    {
      $project: {
        role: "$role",
        count: "$_count",
      },
    },
  ]);
  return counts;
};

const getUserCountByEmailDomains = async (order, count) => {
  const docCount = Number(count);
  const pipeline = [
    {
      $project: {
        domain: { $arrayElemAt: [{ $split: ["$email", "@"] }, 1] },
        _id: 0,
      },
    },
    {
      $group: {
        _id: "$domain",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        domain: "$_id",
        _id: 0,
        _count: "$count",
      },
    },
    {
      $project: {
        domain: "$domain",
        count: "$_count",
      },
    },
  ];

  if (order) {
    pipeline.push({ $sort: { count: order === "asc" ? 1 : -1 } });
  }
  if (docCount) {
    pipeline.push({ $limit: docCount });
  }

  const user = await userModel.aggregate(pipeline);
  return user;
};

const getUserCountByEmailDomain = async (domain) => {
  const user = await {
    domain,
    count: await userModel.countDocuments({
      email: new RegExp(`@${domain}$`, "i"),
    }),
  };
  return user;
};

module.exports = {
  createUser,
  findUserById,
  returnAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
  getUserCountByRole,
  getUserCountByRoles,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
  getUserCreatedTime,
};
