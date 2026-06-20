const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    profession: {
      type: String,
      default: ""
    },

    employer: {
      type: String,
      default: ""
    },

    monthlySalary: {
      type: Number,
      default: 0
    },

    availableCapital: {
      type: Number,
      default: 0
    },

    availableHoursPerWeek: {
      type: Number,
      default: 0
    },

    skills: [String],

    interests: [String],

    role: {
      type: String,
      enum: ["EMPLOYEE", "MENTOR", "ADMIN"],
      default: "EMPLOYEE"
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

module.exports =
mongoose.model("User", userSchema);