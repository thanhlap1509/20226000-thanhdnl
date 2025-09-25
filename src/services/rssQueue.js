import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();
const rssQueue = new Queue("rss-scraper", { connection });

export default rssQueue;
