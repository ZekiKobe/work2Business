const crypto = require("crypto");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const { PLANS } = require("../constants/plans");

const generateTxRef = () => `w2b_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 })
    .select("invoiceNumber");

  let seq = 1;
  if (last?.invoiceNumber) {
    const part = last.invoiceNumber.replace(prefix, "");
    seq = parseInt(part, 10) + 1;
  }

  return `${prefix}${String(seq).padStart(5, "0")}`;
};

const createInvoiceForPayment = async (user, payment) => {
  const existing = await Invoice.findOne({ payment: payment._id });
  if (existing) return existing;

  const invoiceNumber = await generateInvoiceNumber();
  const billing = user.billingDetails?.toObject?.() ?? user.billingDetails ?? {};

  return Invoice.create({
    user: user._id,
    payment: payment._id,
    invoiceNumber,
    plan: payment.plan,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    billingSnapshot: {
      fullName: billing.fullName || `${user.firstName} ${user.lastName}`.trim(),
      company: billing.company || "",
      phone: billing.phone || "",
      addressLine1: billing.addressLine1 || "",
      addressLine2: billing.addressLine2 || "",
      city: billing.city || "",
      region: billing.region || "",
      country: billing.country || "Ethiopia",
      taxId: billing.taxId || "",
      email: user.email
    },
    status: "paid",
    issuedAt: new Date()
  });
};

exports.activateFounderPlan = async (user, method) => {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  user.subscription = {
    plan: "founder",
    status: "active",
    expiresAt,
    paymentMethod: method,
    lastPaymentAt: new Date(),
    cancelAtPeriodEnd: false,
    cancelledAt: undefined
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
    await createInvoiceForPayment(user, payment);
  }

  return payment;
};

exports.createInvoiceForPayment = createInvoiceForPayment;
