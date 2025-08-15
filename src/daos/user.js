const { userModel } = require("../models/user");

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

const returnAllUsers = async (sortCondition) => {
  if (!sortCondition) {
    return await userModel.find({});
  }
  return await userModel.find({}).sort(sortCondition);
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
