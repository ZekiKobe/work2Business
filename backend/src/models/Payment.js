const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    plan: {
      type: String,
      enum: ["founder"],
      required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "ETB" },
    method: {
      type: String,
      enum: ["card", "chapa", "telebirr"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    txRef: { type: String, required: true, unique: true },
    providerRef: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
