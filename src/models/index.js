import mongoose from "mongoose";
import { MONGODB_URI } from "../configs/index.js";

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

const _closeConnection = closeConnection;
export { _closeConnection as closeConnection };
