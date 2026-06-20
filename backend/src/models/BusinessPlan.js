const mongoose = require("mongoose");

const businessPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessIdea",
      required: true,
    },

    executiveSummary: {
      type: String,
    },

    marketAnalysis: {
      type: String,
    },

    financialPlan: {
      type: Object,   // ✅ FIXED (was String)
    },

    marketingStrategy: {
      type: String,
    },

    riskAnalysis: {
      type: Object,   // ✅ FIXED (was String)
    },

    initialCapital: {
      type: Number,   // (fixed typo also)
    },

    projectedRevenue: {
      type: Number,
    },

    projectedProfit: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessPlan", businessPlanSchema);