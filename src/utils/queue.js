const { Queue, Job } = require("bullmq");

const exportJobQueue = new Queue("exportJobQueue", {
  connection: {
    host: "localhost",
    port: 6379, // Redis default
  },
});

const addExportJob = async (params) => {
  const job = await exportJobQueue.add("export", params, {
    removeOnComplete: true,
    removeOnFail: false,
  });
  return job.id;
};

async function getJobById(jobId) {
  try {
    const job = await Job.fromId("exportJobQueue", jobId);
    if (job) {
      console.log(`Job found: ${job.id}, Status: ${await job.getState()}`);
      return job;
    } else {
      console.log(`Job with ID ${jobId} not found in queue ${exportJobQueue}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving job: ${error}`);
    return null;
  }
}
module.exports = { exportJobQueue, addExportJob, getJobById };
