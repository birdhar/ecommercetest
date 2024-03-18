import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    password_reset_token: { type: String, required: false },
    role: { type: String, required: false },
    address: { type: Object, required: false },
  },
  { timestamps: true }
);
export const User = models.User || model("User", UserSchema);
