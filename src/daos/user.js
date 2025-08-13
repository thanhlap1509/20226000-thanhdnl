const User = require("../models/user");

const createUser = async (userData) => {
  const user = await User.create(userData);
  console.log(user);
  return user;
};

const findUserById = async (userId) => {
  const user = await User.findById(userId);
  console.log(user);
  return user;
};

const returnAllUsers = async () => {
  return await User.find({});
};

const updateUser = async (userId, userData) => {
  console.log("Id is " + userId);
  console.log(userData);
  const user = await User.findByIdAndUpdate(userId, userData, { new: true });
  console.log("user after update is " + user);
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  console.log(user);
};

module.exports = {
  createUser,
  findUserById,
  returnAllUsers,
  updateUser,
  deleteUser,
};
