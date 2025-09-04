import express, { json } from "express";
import v8 from "v8";
import client from "prom-client";
const app = express();
import "dotenv/config.js";
import { closeConnection } from "./models/index.js";

import { PORT } from "./configs/index.js";
import userRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import routeHandler from "./middlewares/routeHandler.js";
import shutdown from "./utils/shutdown.js";

app.set("view engine", "ejs");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
});

app.use(json({ limit: "5mb" }));
app.use("/api", userRouter);
app.use(routeHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`App is runnning on port ${PORT}`);
});

/* eslint-disable no-undef */
process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  console.log(`Created head dump file: ${fileName}`);
});
process.on("SIGINT", () => shutdown(server, closeConnection));
process.on("SIGTERM", () => {
  console.log("sigterm");
  shutdown(server, closeConnection);
});
//process.on("SIGKILL", () => shutdown(server, closeConnection));
