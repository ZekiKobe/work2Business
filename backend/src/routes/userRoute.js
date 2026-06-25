const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.get("/dashboard-stats", protect, userController.getDashboardStats);
router.get("/milestones", protect, userController.getMilestones);
router.patch("/milestones/:key/toggle", protect, userController.toggleMilestone);

module.exports = router;
