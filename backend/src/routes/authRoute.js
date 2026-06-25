const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const { handleValidationErrors } = require("../middlewares/validationMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many password reset attempts, please try again in an hour" },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/register", authLimiter, registerValidator, handleValidationErrors, authController.register);
router.post("/login", authLimiter, loginValidator, handleValidationErrors, authController.login);
router.post("/forgot-password", passwordResetLimiter, authController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, authController.resetPassword);

module.exports = router;
