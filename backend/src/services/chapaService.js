const CHAPA_BASE = "https://api.chapa.co/v1";

class ChapaError extends Error {
  constructor(message, { statusCode = 400, details } = {}) {
    super(message);
    this.name = "ChapaError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

exports.ChapaError = ChapaError;

const getSecretKey = () => process.env.CHAPA_SECRET_KEY?.trim() || "";

exports.isConfigured = () => Boolean(getSecretKey());

const formatChapaMessage = (value, fallback = "") => {
  if (value == null || value === "") return fallback;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => formatChapaMessage(item, "")).filter(Boolean).join(". ");
  }
  if (typeof value === "object") {
    const parts = Object.entries(value).flatMap(([field, err]) => {
      const msg = formatChapaMessage(err, "");
      if (!msg) return [];
      const label = field.replace(/_/g, " ");
      return msg.includes(label) ? [msg] : [`${label}: ${msg}`];
    });
    return parts.join(". ") || fallback;
  }
  return String(value);
};

const CHAPA_CHECKOUT_TITLE = "Work2Business";
const CHAPA_CHECKOUT_TITLE_MAX = 16;
const CHAPA_CHECKOUT_DESC_MAX = 50;

const sanitizeCheckoutTitle = (title) => {
  const value = String(title || CHAPA_CHECKOUT_TITLE).trim() || CHAPA_CHECKOUT_TITLE;
  return value.slice(0, CHAPA_CHECKOUT_TITLE_MAX);
};

const sanitizeCheckoutDescription = (description) => {
  const value = String(description || "Founder plan").trim() || "Founder plan";
  return value.slice(0, CHAPA_CHECKOUT_DESC_MAX);
};

const toUserFriendlyPaymentError = (rawMessage) => {
  const message = String(rawMessage || "").trim();
  if (!message) {
    return "We couldn't start your payment. Please check your details and try again.";
  }

  const lower = message.toLowerCase();

  if (/phone/.test(lower)) {
    if (/required|missing|empty/.test(lower)) {
      return "Please enter a valid Ethiopian phone number (e.g. 0912345678).";
    }
    return "That phone number doesn't look valid. Use format 0912345678 or 0712345678.";
  }

  if (/email/.test(lower)) {
    return "Please check the email on your account and try again.";
  }

  if (/amount/.test(lower)) {
    return "There was a problem with the payment amount. Please contact support if this continues.";
  }

  if (/unauthorized|invalid token|authentication/.test(lower)) {
    return "Payments are temporarily unavailable. Please try again in a few minutes.";
  }

  if (/insufficient balance/.test(lower)) {
    return "Your account doesn't have enough balance to complete this payment.";
  }

  if (/customization|tx_ref|callback_url|return_url|field must|must not exceed|must be/.test(lower)) {
    return "We couldn't start your payment. Please try again or contact support if the problem continues.";
  }

  if (message.length > 120 || /^\w+\.\w+/.test(message)) {
    return "We couldn't start your payment. Please check your details and try again.";
  }

  return message;
};

const parseChapaFailure = (data, fallback) => {
  const raw =
    formatChapaMessage(data?.message) ||
    formatChapaMessage(data?.data?.message) ||
    formatChapaMessage(data?.errors) ||
    formatChapaMessage(data?.data) ||
    fallback;

  if (process.env.NODE_ENV !== "production") {
    console.error("Chapa API error:", JSON.stringify(data, null, 2));
  }

  return toUserFriendlyPaymentError(raw);
};

exports.normalizeEthiopianPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length === 12) return `0${digits.slice(3)}`;
  if (digits.startsWith("09") && digits.length === 10) return digits;
  if (digits.startsWith("07") && digits.length === 10) return digits;
  if (digits.length === 9 && (digits.startsWith("9") || digits.startsWith("7"))) return `0${digits}`;
  return null;
};

const resolvePhone = (user, phoneOverride) => {
  const mobile = exports.normalizeEthiopianPhone(phoneOverride || user.billingDetails?.phone);
  if (!mobile) {
    throw new ChapaError(
      "A valid Ethiopian phone number is required (e.g. 0912345678). Add it in Billing or enter it at checkout."
    );
  }
  return mobile;
};

exports.initializeCheckout = async (user, { txRef, amount, title, phone }) => {
  const key = getSecretKey();
  if (!key) {
    throw new ChapaError("Payment provider is not configured. Set CHAPA_SECRET_KEY in the server environment.", {
      statusCode: 503
    });
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const phoneNumber = resolvePhone(user, phone);

  const body = {
    amount: String(amount),
    currency: "ETB",
    email: user.email,
    first_name: (user.firstName || "Customer").trim().slice(0, 35),
    last_name: (user.lastName || "User").trim().slice(0, 35),
    phone_number: phoneNumber,
    tx_ref: txRef,
    callback_url: `${backendUrl}/api/v1/payments/webhook/chapa`,
    return_url: `${frontendUrl}/checkout?payment_return=1&plan=founder`,
    customization: {
      title: sanitizeCheckoutTitle(title),
      description: sanitizeCheckoutDescription("Founder plan")
    }
  };

  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (data.status !== "success" || !data.data?.checkout_url) {
    throw new ChapaError(parseChapaFailure(data, "Could not initialize Chapa checkout"), {
      details: data,
      statusCode: res.status >= 400 && res.status < 500 ? res.status : 400
    });
  }

  return {
    checkoutUrl: data.data.checkout_url,
    reference: data.data.reference
  };
};

exports.directChargeTelebirr = async (user, { txRef, amount, phone }) => {
  const key = getSecretKey();
  if (!key) {
    throw new ChapaError("Payment provider is not configured. Set CHAPA_SECRET_KEY in the server environment.", {
      statusCode: 503
    });
  }

  const mobile = resolvePhone(user, phone);

  const params = new URLSearchParams({
    amount: String(amount),
    currency: "ETB",
    tx_ref: txRef,
    mobile,
    email: user.email,
    first_name: (user.firstName || "Customer").trim().slice(0, 35),
    last_name: (user.lastName || "User").trim().slice(0, 35)
  });

  const res = await fetch(`${CHAPA_BASE}/charges?type=telebirr`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await res.json();

  if (data.status !== "success") {
    throw new ChapaError(parseChapaFailure(data, "Telebirr payment could not be initiated"), {
      details: data,
      statusCode: res.status >= 400 && res.status < 500 ? res.status : 400
    });
  }

  return {
    reference: data.data?.reference || data.reference,
    message: data.message || "Approve the payment prompt on your phone"
  };
};

exports.verifyTransaction = async (txRef) => {
  const key = getSecretKey();
  if (!key) {
    throw new ChapaError("Payment provider is not configured", { statusCode: 503 });
  }

  const res = await fetch(`${CHAPA_BASE}/transaction/verify/${encodeURIComponent(txRef)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${key}` }
  });

  const data = await res.json();
  const txStatus = data.data?.status?.toLowerCase?.();

  return {
    paid: data.status === "success" && txStatus === "success",
    pending: data.status === "success" && (txStatus === "pending" || txStatus === "processing"),
    failed: txStatus === "failed" || txStatus === "cancelled" || txStatus === "canceled",
    reference: data.data?.reference,
    raw: data
  };
};
