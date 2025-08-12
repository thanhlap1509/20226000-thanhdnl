const mongoose = require("mongoose");
const { MONGODB_URI } = require("../configs");

mongoose
  .connect(MONGODB_URI, {
    dbName: "test",
  })
  .then((value) => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(`Error connecting to db ${err}`);
  });
