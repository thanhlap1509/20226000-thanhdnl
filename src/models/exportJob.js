import { Schema, model } from "mongoose";

const EXPORT_JOB_STATUS = {
  PENDING: "pending",
  COMPLETE: "complete",
  FAIL: "fail",
  CANCEL: "cancel",
};

const EXPORT_JOB_NAME = {
  EXPORT_USERS: "export_user",
};

const exportJobSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      enum: Object.values(EXPORT_JOB_NAME),
    },
    progress: {
      type: String,
      require: true,
      enum: Object.values(EXPORT_JOB_STATUS),
      default: EXPORT_JOB_STATUS.PENDING,
    },
    config: {
      type: Object,
      require: true,
    },
    downloadUrl: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } },
);

const exportJobModel = model("ExportJob", exportJobSchema);
export default { exportJobModel, EXPORT_JOB_STATUS, EXPORT_JOB_NAME };
