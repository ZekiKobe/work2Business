const User = require("../models/User");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const { PLANS, syncSubscriptionStatus, buildSubscriptionResponse } = require("../constants/plans");
const paymentService = require("../services/paymentService");
const chapaService = require("../services/chapaService");

const BILLING_FIELDS = [
  "fullName", "company", "phone", "addressLine1", "addressLine2",
  "city", "region", "country", "taxId"
];

exports.getPlans = async (req, res) => {
  res.json({ success: true, data: Object.values(PLANS) });
};

exports.getPaymentConfig = async (req, res) => {
  res.json({
    success: true,
    data: {
      provider: "chapa",
      configured: chapaService.isConfigured(),
      methods: ["chapa", "card", "telebirr"],
      currency: "ETB"
    }
  });
};

exports.getSubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  await syncSubscriptionStatus(user);
  res.json({
    success: true,
    data: buildSubscriptionResponse(user)
  });
};

exports.getBillingDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    data: {
      email: user.email,
      billingDetails: user.billingDetails || {}
    }
  });
};

exports.updateBillingDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.billingDetails) user.billingDetails = {};

    BILLING_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.billingDetails[field] = String(req.body[field]).trim();
      }
    });

    await user.save();
    res.json({
      success: true,
      message: "Billing details updated",
      data: { email: user.email, billingDetails: user.billingDetails }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update billing details" });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Payment.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch payment history" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({ issuedAt: -1 })
      .lean();
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invoices" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invoice" });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await syncSubscriptionStatus(user);

    const sub = user.subscription;
    if (sub?.plan !== "founder" || sub?.status !== "active") {
      return res.status(400).json({ success: false, message: "No active Founder subscription to cancel" });
    }

    sub.cancelAtPeriodEnd = true;
    sub.cancelledAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Subscription will cancel at end of billing period",
      data: buildSubscriptionResponse(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel subscription" });
  }
};

exports.reactivateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await syncSubscriptionStatus(user);

    const sub = user.subscription;
    if (sub?.plan !== "founder" || sub?.status !== "active") {
      return res.status(400).json({ success: false, message: "No active Founder subscription to reactivate" });
    }

    if (!sub.cancelAtPeriodEnd) {
      return res.status(400).json({ success: false, message: "Subscription is not scheduled for cancellation" });
    }

    sub.cancelAtPeriodEnd = false;
    sub.cancelledAt = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Subscription reactivated",
      data: buildSubscriptionResponse(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reactivate subscription" });
  }
};

exports.initiatePayment = async (req, res) => {
  try {
    const { method, phone } = req.body;
    if (!["card", "chapa", "telebirr"].includes(method)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    if (!chapaService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Payments are not configured. Set CHAPA_SECRET_KEY on the server."
      });
    }

    const user = await User.findById(req.user._id);
    await syncSubscriptionStatus(user);

    if (user.subscription?.plan === "founder" && user.subscription?.status === "active") {
      return res.status(400).json({ success: false, message: "You already have an active Founder plan" });
    }

    if (method === "telebirr") {
      const telebirrPhone = phone || user.billingDetails?.phone;
      if (!telebirrPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for Telebirr. Add it in Billing or enter it below."
        });
      }
    }

    const result = await paymentService.initiatePayment(user, method, { phone });

    if (result.checkoutUrl) {
      return res.json({
        success: true,
        redirect: true,
        checkoutUrl: result.checkoutUrl,
        txRef: result.payment.txRef
      });
    }

    if (result.awaitingConfirmation) {
      return res.json({
        success: true,
        awaitingConfirmation: true,
        txRef: result.payment.txRef,
        message: result.message || "Approve the payment on your phone to continue."
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

    if (payment.status === "completed") {
      const user = await User.findById(req.user._id);
      await syncSubscriptionStatus(user);
      return res.json({
        success: true,
        status: "completed",
        subscription: buildSubscriptionResponse(user)
      });
    }

    if (payment.status === "failed") {
      return res.status(400).json({
        success: false,
        status: "failed",
        message: "Payment failed or was cancelled"
      });
    }

    const result = await paymentService.verifyAndCompletePayment(txRef);

    if (result.pending) {
      return res.json({
        success: true,
        status: "pending",
        message: result.message || "Waiting for payment confirmation"
      });
    }

    if (result.failed) {
      return res.status(400).json({
        success: false,
        status: "failed",
        message: result.message || "Payment failed"
      });
    }

    const user = await User.findById(req.user._id);
    await syncSubscriptionStatus(user);
    res.json({
      success: true,
      status: "completed",
      subscription: buildSubscriptionResponse(user)
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: error.message || "Verification failed" });
  }
};

exports.chapaWebhook = async (req, res) => {
  try {
    const txRef = req.body?.tx_ref;
    if (!txRef) {
      return res.status(200).send("OK");
    }

    await paymentService.verifyAndCompletePayment(txRef);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Chapa webhook error:", err.message);
    res.status(200).send("OK");
  }
};
