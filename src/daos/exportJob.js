import exportJob from "../models/exportJob.js";
const { exportJobModel } = exportJob;

const addExportJob = async (config, name) => {
  const job = await exportJobModel.insertOne({ config, name });
  return job;
};

const getJobById = async (jobId) => {
  const job = await exportJobModel.findById(jobId);
  return job;
};

const updateExportJobStatus = async (id, progress, downloadUrl) => {
  const result = await exportJobModel.findByIdAndUpdate(id, {
    progress,
    downloadUrl,
  });
  return result;
};

export default { addExportJob, getJobById, updateExportJobStatus };
