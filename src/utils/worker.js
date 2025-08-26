const { Worker } = require("bullmq");
const { mkConfig, generateCsv, asString, download } = require("export-to-csv");
const { writeFile } = require("node:fs");
const { Buffer } = require("node:buffer");
const { getUsers } = require("../services/user");

require("dotenv").config();
require("../models");

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "result",
  quoteCharacter: "",
});

const worker = new Worker(
  "exportJobQueue",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    const returnData = await getUsers(job.data);
    const csv = generateCsv(csvConfig)(
      JSON.parse(JSON.stringify(returnData.data)),
    );

    const filename = `${csvConfig.filename}.csv`;
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    writeFile(filename, csvBuffer, (err) => {
      if (err) throw err;
      console.log("file saved: ", filename);
    });
    return;
  },
  {
    connection: { host: "localhost", port: 6379 },
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
