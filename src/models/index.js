const mongoose = require("mongoose");
const { MONGODB_URI } = require("../configs");

mongoose
  .connect(MONGODB_URI, {
    dbName: "test",
  })
  .then(() => {
    console.log("Open connection to db");
  })
  .catch((err) => {
    console.log(`Error connecting to db ${err}`);
  });

const closeConnection = async () => {
  await mongoose.connection
    .close(false)
    .then(() => {
      console.log("Close connection to db");
    })
    .catch((err) => {
      console.log(`Error closing connection to db ${err}`);
    });
};

module.exports.closeConnection = closeConnection;
