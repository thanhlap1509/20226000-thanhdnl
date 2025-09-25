import { Worker } from "bullmq";
import IORedis from "ioredis";
import Parser from "rss-parser";
import fetch from "node-fetch"; // install: npm install node-fetch

const connection = new IORedis({ maxRetriesPerRequest: null });

const parser = new Parser({
  customFetch: async (url, options) => {
    // 2 min timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  },
});

const worker = new Worker(
  "rss-scraper",
  async (job) => {
    console.log(`Processing job: ${job.name}`);
    const { url } = job.data;
    console.log(`RSS URl is ${url}`);

    try {
      const feed = await parser.parseURL(url);
      console.log(`Fetched ${feed.items.length} items from ${url}`);
      feed.items.slice(0, 3).forEach((i) => console.log("-", i.title));
    } catch (err) {
      console.error("Error scraping RSS:", err.message);
      throw err;
    }
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`JOB ${job.id} IS COMPLETED`);
});

worker.on("failed", (job, err) => {
  console.error(`JOB ${job.id} HAS FAIL DUE TO: ${err.message}`);
});
