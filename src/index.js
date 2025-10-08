import express, { json } from "express";
import v8 from "v8";
import client from "prom-client";
const app = express();
import "dotenv/config.js";
import { closeConnection } from "./models/index.js";
import createModuleLogger from "./utils/createModuleLogger.js";
import { PORT } from "./configs/index.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import routeHandler from "./middlewares/routeHandler.js";
import shutdown from "./utils/shutdown.js";

app.set("view engine", "ejs");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const logger = createModuleLogger("index");

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
});

app.use(json({ limit: "5mb" }));
app.use("/api", router);
app.use(routeHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`App is running on port ${PORT}`);
});

/* eslint-disable no-undef */
process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  logger.info(`Created head dump file: ${fileName}`);
});
process.on("SIGINT", () => shutdown(server, closeConnection));
process.on("SIGTERM", () => {
  shutdown(server, closeConnection);
});
