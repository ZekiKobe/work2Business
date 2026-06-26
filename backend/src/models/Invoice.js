const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },
    invoiceNumber: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["founder"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "ETB" },
    method: { type: String, required: true },
    billingSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["paid"], default: "paid" },
    issuedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
