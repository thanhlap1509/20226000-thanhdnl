const { userModel } = require("../models/user");
const { USER_ROLES } = require("../constants/user");

const createUser = async (userData) => {
  const user = await userModel.insertOne(userData);
  return user;
};

const createUsers = async (usersData) => {
  return await userModel.insertMany(usersData, { ordered: false });
};

const findUserById = async (userId) => {
  return await userModel.findById(userId);
};

const returnAllUsers = async (sortCondition, limit, offset, filter) => {
  if (sortCondition) {
    return await userModel.find(filter).skip(offset).limit(limit);
  }
  return await userModel
    .find(filter)
    .sort(sortCondition)
    .skip(offset)
    .limit(limit);
};

const updateUser = async (userId, userData) => {
  return await userModel.findByIdAndUpdate(userId, userData, {
    // cân nhắc đổi sang updateOne
    new: true,
  });
};

const deleteUser = async (userId) => {
  return await userModel.findByIdAndDelete(userId); // tương tự updateUser
};

//TODO: Tìm hiểu lean()
const getUserCreatedTime = async (userId) => {
  return await userModel
    .findOne({ _id: userId }, { createdAt: 1, _id: 0 })
    .lean(); // lean để format lại dữ liệu
};

const getUserCount = async () => {
  return await userModel.estimatedDocumentCount();
};

const getUserCountByRole = async (role) => {
  return await {
    role,
    count: await userModel.countDocuments({ role }),
  };
};

const getUserCountByRoles = async () => {
  return await Promise.all(USER_ROLES.map(getUserCountByRole));
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

  return await userModel.aggregate(pipeline);
};

const getUserCountByEmailDomain = async (domain) => {
  return await {
    domain,
    count: await userModel.countDocuments({
      email: new RegExp(`@${domain}$`, "i"),
    }),
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
  getUserCreatedTime,
};
