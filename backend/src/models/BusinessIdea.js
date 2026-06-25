const mongoose = require("mongoose");

const businessIdeaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    minimumCapital: {
      type: Number,
      default: 0
    },

    expectedProfit: {
      type: Number,
      default: 0
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    requiredSkills: [
      {
        type: String,
        trim: true
      }
    ],

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    timeToProfit: {
      type: Number,
      default: 6,
      comment: "Estimated months to first profit"
    },

    hoursRequiredPerWeek: {
      type: Number,
      default: 20,
      comment: "Minimum hours per week needed"
    },

    successRate: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
      comment: "Estimated % success rate based on industry data"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BusinessIdea", businessIdeaSchema);
