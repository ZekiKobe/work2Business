const mongoose = require("mongoose");

const businessPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    businessIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessIdea",
      required: true
    },

    title: {
      type: String,
      default: ""
    },

    source: {
      type: String,
      enum: ["AI", "MANUAL"],
      default: "AI"
    },

    executiveSummary: {
      type: String
    },

    marketAnalysis: {
      type: String
    },

    businessModel: {
      type: String
    },

    financialPlan: {
      type: mongoose.Schema.Types.Mixed
    },

    marketingStrategy: {
      type: String
    },

    riskAnalysis: {
      type: mongoose.Schema.Types.Mixed
    },

    operationalPlan: {
      type: String
    },

    initialCapital: {
      type: Number,
      default: 0
    },

    projectedRevenue: {
      type: Number,
      default: 0
    },

    projectedProfit: {
      type: Number,
      default: 0
    },

    successProbability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BusinessPlan", businessPlanSchema);
