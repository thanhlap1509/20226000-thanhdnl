const { userModel } = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

const createUser = async (userData) => {
  const user = await userModel.insertOne(userData);
  return user;
};

const createUsers = async (usersData) => {
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
  return await userModel.findByIdAndUpdate(userId, userData, {
    new: true,
  });
};

const deleteUser = async (userId) => {
  return await userModel.findByIdAndDelete(userId);
};

const getUserCount = async () => {
  return userModel.countDocuments({});
};

module.exports = {
  createUser,
  createUsers,
  findUserById,
  returnAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
};
