const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendPasswordResetEmail } = require("../services/emailService");

const formatUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  profession: user.profession,
  employer: user.employer,
  monthlySalary: user.monthlySalary,
  availableCapital: user.availableCapital,
  availableHoursPerWeek: user.availableHoursPerWeek,
  skills: user.skills,
  interests: user.interests,
  role: user.role,
  profileCompleteness: user.profileCompleteness,
  subscription: user.subscription || { plan: "starter", status: "active" }
});

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const { password, selectedPlan, ...profile } = req.body;
    const plan = selectedPlan === "founder" ? "founder" : "starter";
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      ...profile,
      password: hashedPassword,
      subscription: {
        plan,
        status: plan === "founder" ? "pending" : "active"
      }
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address"
      });
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent"
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again."
      });
    }

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired"
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in."
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
