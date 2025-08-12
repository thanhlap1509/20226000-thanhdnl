const mongoose = require("mongoose");
const { MONGO_URI } = require("../configs");

mongoose.connect(MONGO_URI);

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error.`, MONGO_URI);
  console.error(err);
  process.exit();
});
mongoose.connection.on("open", () => {
  console.log(`Connect to MongoDB: ${MONGO_URI}`);
});
