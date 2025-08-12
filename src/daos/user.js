const { ObjectId } = require("mongoose").Types;
const User = require("../models/user");

const createUser = async (userData) => {
  const user = await User.create(userData);
  console.log(user);
  return user;
};

const findUser = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const user = await User.findById(condition);
    console.log(user);
    return user;
  }

  if (condition instanceof Object && Object.keys(condition).length > 0) {
    const user = await User.find(condition);
    console.log(user);
    return user;
  }

  return null;
};

const updateUser = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(userId, userData, { new: true });
  console.log(user);
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  console.log(user);
};

module.exports = { createUser, findUser, updateUser, deleteUser };
