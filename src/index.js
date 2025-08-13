const express = require("express");
const app = express();
require("dotenv").config();

// import db connection and data model
require("./models");

const { PORT } = require("./configs");

app.use(express.json());

app.listen(PORT, () => {
  `App is runnning on port ${PORT}`;
});
