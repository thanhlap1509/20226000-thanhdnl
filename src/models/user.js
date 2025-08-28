import { Schema, model } from "mongoose";
import validator from "validator";
import { USER_ROLES } from "../constants/user.js";
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (validator.isEmail(value)) {
          return;
        }
        throw new Error("Invalid email");
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
      enum: USER_ROLES,
    },
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } },
);

const userFields = Object.keys(userSchema.paths);

export const userModel = model("User", userSchema);
const _userFields = userFields.sort();
export { _userFields as userFields };
