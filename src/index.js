const express = require("express");
const app = express();

require("dotenv").config();
require("./models");

const { PORT } = require("./configs");
const userRouter = require("./routes");

app.use(express.json());
app.use("/api", userRouter);

app.listen(PORT, () => {
  `App is runnning on port ${PORT}`;
});
