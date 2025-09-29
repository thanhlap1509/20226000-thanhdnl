import rssQueue from "./queue.js";

const rssURL = "https://vnexpress.net/rss/the-gioi.rss";
async function scheduleJob() {
  // Remove all existing repeatable jobs
  const repeatableJobs = await rssQueue.getJobSchedulers();
  for (const job of repeatableJobs) {
    await rssQueue.removeJobScheduler(job.key);
    console.log(`Removed old repeatable job: ${job.key}`);
  }
  await rssQueue.add(
    "scrape-rss",
    { url: rssURL },
    {
      repeat: { every: 1 * 60 * 1000 }, // 1 minutes
      attempts: 3, // retry up to 3 times
      backoff: 30000, // wait 30s before retry
      removeOnComplete: false,
      removeOnFail: false,
    },
  );

  console.log(`Scheduled RSS scraping job every 1 minutes from ${rssURL}`);
}

scheduleJob();
