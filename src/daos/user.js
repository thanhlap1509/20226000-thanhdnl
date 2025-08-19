const { userModel } = require("../models/user");
const { USER_ROLES } = require("../constants/user");

const createUser = async (userData) => {
  const user = await userModel.insertOne(userData);
  return user;
};

const findUserById = async (userId) => {
  const user = await userModel.findById(userId);
  return user;
};

const returnAllUsers = async (sortCondition, limit, offset, filter) => {
  if (sortCondition) {
    const user = await userModel.find(filter).skip(offset).limit(limit);
    return user;
  }
  const user = await userModel
    .find(filter)
    .sort(sortCondition)
    .skip(offset)
    .limit(limit);
  return user;
};

const updateUser = async (userId, userData) => {
  const user = await userModel.findByIdAndUpdate(userId, userData, {
    // cân nhắc đổi sang updateOne
    new: true,
  });
  return user;
};

const deleteUser = async (userId) => {
  const user = await userModel.findByIdAndDelete(userId); // tương tự updateUser
  return user;
};

//TODO: Tìm hiểu lean()
const getUserCreatedTime = async (userId) => {
  const user = await userModel
    .findOne({ _id: userId }, { createdAt: 1, _id: 0 })
    .lean(); // lean để format lại dữ liệu
  return user;
};

const getUserCount = async () => {
  const user = await userModel.estimatedDocumentCount();
  return user;
};

const getUserCountByRole = async (role) => {
  const user = await {
    role,
    count: await userModel.countDocuments({ role }),
  };
  return user;
};

const getUserCountByRoles = async () => {
  const user = await Promise.all(USER_ROLES.map(getUserCountByRole));
  return user;
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
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
  getUserCreatedTime,
};
