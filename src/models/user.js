const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ["admin", "user"],
    },
  },
  { versionKey: false },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const userFields = Object.keys(userSchema.paths);

module.exports.userModel = mongoose.model("User", userSchema);
module.exports.userFields = userFields.sort();
