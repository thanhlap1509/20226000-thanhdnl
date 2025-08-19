const express = require("express");
const app = express();
require("dotenv").config();
const { closeConnection } = require("./models");

const { PORT } = require("./configs");
const userRouter = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const routeHandler = require("./middlewares/routeHandler");
const shutdown = require("./utils/shutdown");

app.use(express.json({ limit: "100mb" }));
app.use("/api", userRouter);
app.use(routeHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`App is runnning on port ${PORT}`);
});

/* eslint-disable no-undef */
process.on("SIGUSR2", () => shutdown(server, closeConnection));
process.on("SIGINT", () => shutdown(server, closeConnection));
process.on("SIGTERM", () => {
  console.log("sigterm");
  shutdown(server, closeConnection);
});
process.on("SIGKILL", () => shutdown(server, closeConnection));
