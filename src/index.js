const express = require("express");
const { ObjectId } = require("mongoose").Types;
const app = express();
console.log("HHHHHHHHHHH");
require("dotenv").config();

// Import db connection and data model
require("./models");

const { PORT } = require("./configs");

app.use(express.json());

app.listen(PORT, () => {
  `App is runnning on port ${PORT}`;
});
