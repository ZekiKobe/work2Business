const mongoose = require("mongoose");
const crypto = require("crypto");

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
    },

    resetPasswordToken: {
      type: String,
      select: false
    },

    resetPasswordExpires: {
      type: Date,
      select: false
    },

    favoriteIdeas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessIdea"
      }
    ],

    favoritePlans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessPlan"
      }
    ],

    milestones: [
      {
        key: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        order: { type: Number, default: 0 }
      }
    ],

    preferences: {
      emailOnPlan: { type: Boolean, default: true },
      emailOnMilestone: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false }
    },

    subscription: {
      plan: {
        type: String,
        enum: ["starter", "founder"],
        default: "starter"
      },
      status: {
        type: String,
        enum: ["active", "pending", "expired"],
        default: "active"
      },
      expiresAt: { type: Date },
      paymentMethod: { type: String },
      lastPaymentAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

// Virtual: profile completeness score (0–100)
userSchema.virtual("profileCompleteness").get(function () {
  let score = 0;
  if (this.firstName && this.lastName) score += 15;
  if (this.profession) score += 15;
  if (this.employer) score += 10;
  if (this.monthlySalary > 0) score += 10;
  if (this.availableCapital > 0) score += 20;
  if (this.availableHoursPerWeek > 0) score += 10;
  if (this.skills && this.skills.length >= 3) score += 10;
  if (this.interests && this.interests.length >= 2) score += 10;
  return Math.min(100, score);
});

// Generate & set password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
