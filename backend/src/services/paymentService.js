const crypto = require("crypto");
const Payment = require("../models/Payment");
const { PLANS } = require("../constants/plans");

const generateTxRef = () => `w2b_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

exports.activateFounderPlan = async (user, method) => {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  user.subscription = {
    plan: "founder",
    status: "active",
    expiresAt,
    paymentMethod: method,
    lastPaymentAt: new Date()
  };

  await user.save();
  return user;
};

exports.initiatePayment = async (user, method) => {
  const plan = PLANS.founder;
  const txRef = generateTxRef();

  const payment = await Payment.create({
    user: user._id,
    plan: "founder",
    amount: plan.price,
    currency: plan.currency,
    method,
    status: "pending",
    txRef
  });

  const chapaKey = process.env.CHAPA_SECRET_KEY;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (method === "chapa" && chapaKey) {
    try {
      const res = await fetch("https://api.chapa.co/v1/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${chapaKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: plan.price,
          currency: "ETB",
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          tx_ref: txRef,
          callback_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/v1/payments/webhook/chapa`,
          return_url: `${frontendUrl}/checkout?plan=founder&tx_ref=${txRef}`
        })
      });

      const data = await res.json();
      if (data.status === "success" && data.data?.checkout_url) {
        payment.providerRef = data.data.reference;
        await payment.save();
        return { payment, checkoutUrl: data.data.checkout_url, mock: false };
      }
    } catch (err) {
      console.error("Chapa init error:", err.message);
    }
  }

  return { payment, checkoutUrl: null, mock: true, txRef };
};

exports.completePayment = async (txRef, providerRef = null) => {
  const payment = await Payment.findOne({ txRef });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (payment.status === "completed") {
    return payment;
  }

  payment.status = "completed";
  if (providerRef) payment.providerRef = providerRef;
  await payment.save();

  const User = require("../models/User");
  const user = await User.findById(payment.user);
  if (user) {
    await exports.activateFounderPlan(user, payment.method);
  }

  return payment;
};
