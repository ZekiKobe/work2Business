const CHAPA_BASE = "https://api.chapa.co/v1";

const getSecretKey = () => process.env.CHAPA_SECRET_KEY?.trim() || "";

exports.isConfigured = () => Boolean(getSecretKey());

exports.normalizeEthiopianPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length === 12) return `0${digits.slice(3)}`;
  if (digits.startsWith("09") && digits.length === 10) return digits;
  if (digits.length === 9 && digits.startsWith("9")) return `0${digits}`;
  return null;
};

exports.initializeCheckout = async (user, { txRef, amount, title }) => {
  const key = getSecretKey();
  if (!key) {
    throw new Error("Payment provider is not configured. Set CHAPA_SECRET_KEY in the server environment.");
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const phone = user.billingDetails?.phone
    ? exports.normalizeEthiopianPhone(user.billingDetails.phone)
    : null;

  const body = {
    amount: String(amount),
    currency: "ETB",
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    tx_ref: txRef,
    callback_url: `${backendUrl}/api/v1/payments/webhook/chapa`,
    return_url: `${frontendUrl}/checkout?plan=founder&tx_ref=${encodeURIComponent(txRef)}`,
    customization: {
      title: title || "Work2Business",
      description: "Founder plan subscription"
    }
  };

  if (phone) body.phone_number = phone;

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
    const message = data.message || data.data?.message || "Could not initialize Chapa checkout";
    throw new Error(message);
  }

  return {
    checkoutUrl: data.data.checkout_url,
    reference: data.data.reference
  };
};

exports.directChargeTelebirr = async (user, { txRef, amount, phone }) => {
  const key = getSecretKey();
  if (!key) {
    throw new Error("Payment provider is not configured. Set CHAPA_SECRET_KEY in the server environment.");
  }

  const mobile = exports.normalizeEthiopianPhone(phone);
  if (!mobile) {
    throw new Error("Enter a valid Ethiopian phone number (e.g. 0912345678)");
  }

  const params = new URLSearchParams({
    amount: String(amount),
    currency: "ETB",
    tx_ref: txRef,
    mobile,
    email: user.email,
    first_name: user.firstName || "Customer",
    last_name: user.lastName || "User"
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
    throw new Error(data.message || "Telebirr payment could not be initiated");
  }

  return {
    reference: data.data?.reference || data.reference,
    message: data.message || "Approve the payment prompt on your phone"
  };
};

exports.verifyTransaction = async (txRef) => {
  const key = getSecretKey();
  if (!key) {
    throw new Error("Payment provider is not configured");
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
