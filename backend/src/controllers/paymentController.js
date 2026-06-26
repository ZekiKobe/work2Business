const User = require("../models/User");
const Payment = require("../models/Payment");
const { PLANS } = require("../constants/plans");
const paymentService = require("../services/paymentService");

exports.getPlans = async (req, res) => {
  res.json({ success: true, data: Object.values(PLANS) });
};

exports.getSubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    data: user.subscription || { plan: "starter", status: "active" }
  });
};

exports.initiatePayment = async (req, res) => {
  try {
    const { method } = req.body;
    if (!["card", "chapa", "telebirr"].includes(method)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    const user = await User.findById(req.user._id);
    if (user.subscription?.plan === "founder" && user.subscription?.status === "active") {
      return res.status(400).json({ success: false, message: "You already have an active Founder plan" });
    }

    if (method === "card") {
      const { cardNumber, expiry, cvv, cardName } = req.body;
      if (!cardNumber || !expiry || !cvv || !cardName) {
        return res.status(400).json({ success: false, message: "Complete all card fields" });
      }
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 13) {
        return res.status(400).json({ success: false, message: "Invalid card number" });
      }
    }

    const result = await paymentService.initiatePayment(user, method);

    if (method === "chapa" && result.checkoutUrl) {
      return res.json({
        success: true,
        redirect: true,
        checkoutUrl: result.checkoutUrl,
        txRef: result.payment.txRef
      });
    }

    if (method === "telebirr" || method === "card" || result.mock) {
      await paymentService.completePayment(result.payment.txRef);
      const updated = await User.findById(user._id);
      return res.json({
        success: true,
        message: "Payment successful",
        txRef: result.payment.txRef,
        subscription: updated.subscription,
        mock: result.mock
      });
    }

    res.status(500).json({ success: false, message: "Could not initiate payment" });
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;
    const payment = await Payment.findOne({ txRef, user: req.user._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.status === "pending") {
      await paymentService.completePayment(txRef);
    }

    const user = await User.findById(req.user._id);
    res.json({ success: true, subscription: user.subscription, status: "completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

exports.chapaWebhook = async (req, res) => {
  try {
    const txRef = req.body?.tx_ref;
    if (txRef && req.body?.status === "success") {
      await paymentService.completePayment(txRef, req.body.reference);
    }
    res.status(200).send("OK");
  } catch {
    res.status(200).send("OK");
  }
};
