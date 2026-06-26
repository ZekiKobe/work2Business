const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const { PLANS } = require("../constants/plans");
const chapaService = require("./chapaService");

const generateTxRef = () => `w2b_${Date.now()}_${require("crypto").randomBytes(4).toString("hex")}`;

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 })
    .select("invoiceNumber");

  let seq = 1;
  if (last?.invoiceNumber) {
    seq = parseInt(last.invoiceNumber.replace(prefix, ""), 10) + 1;
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

exports.initiatePayment = async (user, method, { phone } = {}) => {
  if (!chapaService.isConfigured()) {
    throw new Error("Payment provider is not configured. Contact support or configure CHAPA_SECRET_KEY.");
  }

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

  if (method === "telebirr") {
    const telebirrPhone = phone || user.billingDetails?.phone;
    const result = await chapaService.directChargeTelebirr(user, {
      txRef,
      amount: plan.price,
      phone: telebirrPhone
    });

    payment.providerRef = result.reference;
    await payment.save();

    return {
      payment,
      awaitingConfirmation: true,
      message: result.message
    };
  }

  // card and chapa use Chapa hosted checkout (cards + mobile money)
  const result = await chapaService.initializeCheckout(user, {
    txRef,
    amount: plan.price,
    title: "Work2Business Founder"
  });

  payment.providerRef = result.reference;
  await payment.save();

  return {
    payment,
    checkoutUrl: result.checkoutUrl
  };
};

exports.verifyAndCompletePayment = async (txRef) => {
  const payment = await Payment.findOne({ txRef });
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "completed") {
    return { payment, alreadyCompleted: true };
  }

  const verified = await chapaService.verifyTransaction(txRef);

  if (verified.failed) {
    payment.status = "failed";
    await payment.save();
    return { payment, failed: true, message: "Payment was declined or cancelled" };
  }

  if (!verified.paid) {
    return { payment, pending: true, message: "Payment not confirmed yet" };
  }

  payment.status = "completed";
  if (verified.reference) payment.providerRef = verified.reference;
  await payment.save();

  const User = require("../models/User");
  const user = await User.findById(payment.user);
  if (user) {
    await exports.activateFounderPlan(user, payment.method);
    await createInvoiceForPayment(user, payment);
  }

  return { payment, completed: true };
};

exports.createInvoiceForPayment = createInvoiceForPayment;
