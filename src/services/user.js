const userDaos = require("../daos");
const { prepareSortCondition } = require("../utils");
const createUser = async (data) => {
  return await userDaos.createUser(data);
};

const getUser = async (userId) => {
  return await userDaos.findUserById(userId);
};

const getAllUsers = async (condition) => {
  if (!condition) {
    return await userDaos.returnAllUsers();
  }
  condition = prepareSortCondition(condition);
  console.log(condition);
  return await userDaos.returnAllUsers(condition);
};

const updateUser = async (userId, data) => {
  console.log("Id in service is " + userId);
  return await userDaos.updateUser(userId, data);
};

const deleteUser = async (userId) => {
  return await userDaos.deleteUser(userId);
};

const getUserCount = async () => {
  return await userDaos.getUserCount();
};

module.exports = { createUser, updateUser, getUser, getAllUsers, deleteUser, getUserCount };
