import mongoose, { Schema, model, models } from "mongoose";
const OrderSchema = new Schema(
  {
    product_info: [{ type: Object }],
    name: { type: String },
    email: { type: String },
    city: { type: String },
    postalCode: { type: String },
    phone: { type: String },
    streetAddress: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payment: { type: String },
    delivery: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order = models.Order || model("Order", OrderSchema);
