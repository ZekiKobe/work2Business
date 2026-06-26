const User = require("../models/User");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const { PLANS, syncSubscriptionStatus, buildSubscriptionResponse } = require("../constants/plans");
const paymentService = require("../services/paymentService");

const BILLING_FIELDS = [
  "fullName", "company", "phone", "addressLine1", "addressLine2",
  "city", "region", "country", "taxId"
];

exports.getPlans = async (req, res) => {
  res.json({ success: true, data: Object.values(PLANS) });
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
    const { method } = req.body;
    if (!["card", "chapa", "telebirr"].includes(method)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    const user = await User.findById(req.user._id);
    await syncSubscriptionStatus(user);

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
      await syncSubscriptionStatus(updated);
      return res.json({
        success: true,
        message: "Payment successful",
        txRef: result.payment.txRef,
        subscription: buildSubscriptionResponse(updated),
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
    await syncSubscriptionStatus(user);
    res.json({
      success: true,
      subscription: buildSubscriptionResponse(user),
      status: "completed"
    });
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
