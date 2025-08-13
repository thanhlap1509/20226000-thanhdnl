const express = require("express");
const app = express();
console.log("HHHHHHHHHHH");
require("dotenv").config();

// Import db connection and data model
require("./models");

// TODO: Test CRUD operation from daos
// const { createUser, findUser, updateUser, deleteUser } = require("./daos");

const { PORT } = require("./configs");

app.use(express.json());

// Test dao functions
// Create test: createUser({ email: "thanh1@gmail.com", password: "kdkd" });
// Read test: findUser({ email: "thanh1@gmail.com" });
// Update test: updateUser("689b257ffd9939e5d904f5a7", { password: "thanh13@gmail.com" });
// Delete test: deleteUser("689b29839d1099933e2747b1");
app.listen(PORT, () => {
  `App is runnning on port ${PORT}`;
});
