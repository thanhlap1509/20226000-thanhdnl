const { userModel } = require("../models/user");

const createUser = async (userData) => {
  const user = await userModel.create(userData);
  console.log(user);
  return user;
};

const findUserById = async (userId) => {
  const user = await userModel.findById(userId);
  console.log(user);
  return user;
};

const returnAllUsers = async (sortCondition) => {
  if (!sortCondition) {
    return await userModel.find({});
  }
  return await userModel.find({}).sort(sortCondition);
};

const updateUser = async (userId, userData) => {
  console.log("Id is " + userId);
  console.log(userData);
  const user = await userModel.findByIdAndUpdate(userId, userData, {
    new: true,
  });
  console.log("user after update is " + user);
  return user;
};

const deleteUser = async (userId) => {
  const user = await userModel.findByIdAndDelete(userId);
  console.log(user);
};

const getUserCount = async () => {
  return userModel.countDocuments({});
};

module.exports = {
  createUser,
  findUserById,
  returnAllUsers,
  updateUser,
  deleteUser,
  getUserCount,
};
