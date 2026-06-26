const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/plans", paymentController.getPlans);
router.post("/webhook/chapa", paymentController.chapaWebhook);

router.get("/subscription", protect, paymentController.getSubscription);
router.post("/initiate", protect, paymentController.initiatePayment);
router.get("/verify/:txRef", protect, paymentController.verifyPayment);

module.exports = router;
