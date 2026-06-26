const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/plans", paymentController.getPlans);
router.get("/config", paymentController.getPaymentConfig);
router.post("/webhook/chapa", paymentController.chapaWebhook);

router.get("/subscription", protect, paymentController.getSubscription);
router.get("/billing-details", protect, paymentController.getBillingDetails);
router.put("/billing-details", protect, paymentController.updateBillingDetails);
router.get("/history", protect, paymentController.getPaymentHistory);
router.get("/invoices", protect, paymentController.getInvoices);
router.get("/invoices/:id", protect, paymentController.getInvoiceById);
router.post("/cancel", protect, paymentController.cancelSubscription);
router.post("/reactivate", protect, paymentController.reactivateSubscription);
router.post("/initiate", protect, paymentController.initiatePayment);
router.get("/verify/:txRef", protect, paymentController.verifyPayment);

module.exports = router;
