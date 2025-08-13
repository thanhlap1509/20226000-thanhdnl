const userDaos = require("../daos");

const createUser = async (data) => {
  return await userDaos.createUser(data);
};

const getUser = async (condition) => {
  return await userDaos.findUser(condition);
};

const getAllUsers = async () => {
  return await userDaos.returnAllUsers();
};

const updateUser = async (userId, data) => {
  console.log("Id in service is " + userId);
  return await userDaos.updateUser(userId, data);
};

const deleteUser = async (userId) => {
  return await userDaos.deleteUser(userId);
};

module.exports = { createUser, updateUser, getUser, getAllUsers, deleteUser };
