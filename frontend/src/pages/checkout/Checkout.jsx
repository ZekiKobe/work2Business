import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Shield,
  AlertTriangle,
  Sparkles,
  LayoutDashboard,
  Receipt
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { PLANS } from "../../constants/plans";
import { PLACEHOLDERS } from "../../constants/placeholders";

const METHODS = [
  { id: "chapa", label: "Chapa", icon: Wallet, desc: "Cards, Telebirr, mobile money" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Visa, Mastercard via Chapa" },
  { id: "telebirr", label: "Telebirr", icon: Smartphone, desc: "USSD prompt to your phone" }
];

const getTxRefFromParams = (searchParams) =>
  searchParams.get("tx_ref") ||
  searchParams.get("trx_ref") ||
  searchParams.get("trxref") ||
  searchParams.get("reference");

const PENDING_TX_KEY = "w2b_pending_checkout_tx";

const isChapaReturn = (searchParams) =>
  searchParams.get("payment_return") === "1" ||
  ["success", "successful"].includes(String(searchParams.get("status") || "").toLowerCase()) ||
  Boolean(getTxRefFromParams(searchParams));

export default function Checkout() {
  const { user, updateUser, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "founder";
  const returningFromChapa = isChapaReturn(searchParams);

  const plan = PLANS[planId] || PLANS.founder;
  const [method, setMethod] = useState("chapa");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [awaitingTxRef, setAwaitingTxRef] = useState(null);
  const [activeTxRef, setActiveTxRef] = useState(null);
  const [paymentPhase, setPaymentPhase] = useState(() => {
    if (
      getTxRefFromParams(searchParams) ||
      isChapaReturn(searchParams) ||
      sessionStorage.getItem(PENDING_TX_KEY)
    ) {
      return "resolving";
    }
    return "idle";
  });
  const [verifyError, setVerifyError] = useState("");
  const pollRef = useRef(null);
  const verifyCompletedRef = useRef(false);

  const sub = user?.subscription;
  const alreadyActive = sub?.plan === "founder" && sub?.status === "active";

  const { data: paymentConfig } = useQuery({
    queryKey: ["payment-config"],
    queryFn: () => api.get("/payments/config").then((r) => r.data.data)
  });

  const { data: billingData } = useQuery({
    queryKey: ["billing-details", user?._id],
    queryFn: () => api.get("/payments/billing-details").then((r) => r.data.data),
    enabled: !!user?._id
  });

  const billing = billingData?.billingDetails || {};
  const hasBillingDetails = Boolean(billing.fullName && billing.addressLine1);
  const defaultPhone = billing.phone || "";

  useEffect(() => {
    if (defaultPhone && !checkoutPhone) setCheckoutPhone(defaultPhone);
  }, [defaultPhone, checkoutPhone]);

  useEffect(() => {
    if (alreadyActive && !activeTxRef && !returningFromChapa && paymentPhase === "idle") {
      navigate("/billing", { replace: true });
    }
  }, [alreadyActive, navigate, activeTxRef, returningFromChapa, paymentPhase]);

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handlePaymentSuccess = async (subscription) => {
    verifyCompletedRef.current = true;
    stopPolling();
    setAwaitingTxRef(null);
    setPaymentPhase("success");
    setVerifyError("");

    if (subscription) {
      updateUser({ ...user, subscription });
    } else {
      await refreshProfile();
    }

    sessionStorage.removeItem(PENDING_TX_KEY);
    setSearchParams({ plan: planId }, { replace: true });
    toast.success("Payment confirmed! Welcome to Founder.");
  };

  const verifyMutation = useMutation({
    mutationFn: (txRef) => api.get(`/payments/verify/${encodeURIComponent(txRef)}`),
    onSuccess: async (res) => {
      if (res.data.status === "completed") {
        await handlePaymentSuccess(res.data.subscription);
      } else if (res.data.status === "pending") {
        setPaymentPhase("verifying");
      }
    },
    onError: (err) => {
      if (verifyCompletedRef.current) return;

      const status = err.response?.data?.status;
      if (status === "failed") {
        stopPolling();
        setAwaitingTxRef(null);
        setPaymentPhase("failed");
        setVerifyError(err.response?.data?.message || "Payment was not completed.");
        return;
      }

      setPaymentPhase("verifying");
    }
  });

  const runVerify = (txRef) => {
    if (!txRef || verifyCompletedRef.current) return;
    verifyMutation.mutate(txRef);
  };

  useEffect(() => {
    if (!user?._id) return;

    let cancelled = false;

    const resolveTxRef = async () => {
      const fromUrl = getTxRefFromParams(searchParams);
      if (fromUrl) {
        if (!cancelled) {
          setActiveTxRef(fromUrl);
          sessionStorage.setItem(PENDING_TX_KEY, fromUrl);
          setPaymentPhase("verifying");
        }
        return;
      }

      const fromStorage = sessionStorage.getItem(PENDING_TX_KEY);
      if (fromStorage) {
        if (!cancelled) {
          setActiveTxRef(fromStorage);
          setPaymentPhase("verifying");
        }
        return;
      }

      if (returningFromChapa) {
        try {
          const res = await api.get("/payments/pending-checkout");
          const txRef = res.data?.data?.txRef;
          if (txRef && !cancelled) {
            setActiveTxRef(txRef);
            sessionStorage.setItem(PENDING_TX_KEY, txRef);
            setPaymentPhase("verifying");
          } else if (!cancelled) {
            sessionStorage.removeItem(PENDING_TX_KEY);
            setPaymentPhase("idle");
          }
        } catch {
          if (!cancelled) setPaymentPhase("idle");
        }
      }
    };

    resolveTxRef();
    return () => {
      cancelled = true;
    };
  }, [user?._id, searchParams, returningFromChapa]);

  useEffect(() => {
    if (!activeTxRef || verifyCompletedRef.current) return;

    verifyCompletedRef.current = false;
    setPaymentPhase("verifying");
    setVerifyError("");
    runVerify(activeTxRef);

    stopPolling();
    pollRef.current = setInterval(() => runVerify(activeTxRef), 4000);

    const timeout = setTimeout(() => {
      if (!verifyCompletedRef.current) {
        stopPolling();
        setPaymentPhase("pending_timeout");
      }
    }, 120000);

    return () => {
      stopPolling();
      clearTimeout(timeout);
    };
  }, [activeTxRef]);

  const startPolling = (txRef) => {
    setAwaitingTxRef(txRef);
    setPaymentPhase("verifying");
    verifyCompletedRef.current = false;
    stopPolling();
    runVerify(txRef);
    pollRef.current = setInterval(() => runVerify(txRef), 4000);
  };

  const payMutation = useMutation({
    mutationFn: (payload) => api.post("/payments/initiate", payload),
    onSuccess: (res) => {
      if (res.data.redirect && res.data.checkoutUrl) {
        if (res.data.txRef) {
          sessionStorage.setItem(PENDING_TX_KEY, res.data.txRef);
        }
        window.location.href = res.data.checkoutUrl;
        return;
      }
      if (res.data.awaitingConfirmation && res.data.txRef) {
        sessionStorage.setItem(PENDING_TX_KEY, res.data.txRef);
        toast.success(res.data.message || "Check your phone to approve the payment.");
        startPolling(res.data.txRef);
        return;
      }
      toast.error("Unexpected payment response");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  });

  const handlePay = () => {
    const payload = { method, plan: planId };
    payload.phone = checkoutPhone.trim() || defaultPhone.trim();
    if (!payload.phone) {
      toast.error("Enter your phone number (required for Chapa)");
      return;
    }
    payMutation.mutate(payload);
  };

  const paymentsReady = paymentConfig?.configured;

  if (paymentPhase === "success") {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full glass rounded-2xl p-8 text-center border border-emerald-500/20"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Founder plan activated
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment successful</h1>
          <p className="text-slate-400 text-sm mb-2">
            Thank you! Your {plan.name} subscription is now active for one year.
          </p>
          <p className="text-slate-500 text-xs mb-8">
            A receipt and invoice are available on your billing page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to dashboard
            </Link>
            <Link
              to="/billing"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors border border-slate-700"
            >
              <Receipt className="w-4 h-4" />
              View billing & invoice
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (paymentPhase === "failed") {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-white mb-2">Payment not completed</h1>
          <p className="text-sm text-slate-400 mb-6">{verifyError || "Your payment was cancelled or could not be verified."}</p>
          <button
            type="button"
            onClick={() => {
              setPaymentPhase("idle");
              setVerifyError("");
              setSearchParams({ plan: planId }, { replace: true });
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (paymentPhase === "resolving" || (paymentPhase === "verifying" && !verifyCompletedRef.current)) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-bold text-white mb-2">
            {paymentPhase === "resolving" ? "Loading payment status" : "Confirming your payment"}
          </h1>
          <p className="text-sm text-slate-400 mb-4">
            {awaitingTxRef
              ? "Approve the USSD prompt on your phone. This page will update automatically."
              : "We are verifying your payment with Chapa. Please wait a moment..."}
          </p>
          {(activeTxRef || awaitingTxRef) && paymentPhase !== "resolving" && (
            <button
              type="button"
              onClick={() => runVerify(activeTxRef || awaitingTxRef)}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Check status now
            </button>
          )}
        </div>
      </div>
    );
  }

  if (paymentPhase === "pending_timeout") {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-white mb-2">Still waiting for confirmation</h1>
          <p className="text-sm text-slate-400 mb-6">
            Payment can take a minute to confirm. If you already paid, check your billing page or try again below.
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => runVerify(activeTxRef || sessionStorage.getItem(PENDING_TX_KEY))}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
            >
              Check payment status
            </button>
            <Link to="/billing" className="text-sm text-indigo-400 hover:text-indigo-300">
              Go to billing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] py-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link to="/pricing" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to pricing
          </Link>
          <Link to="/billing" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            Manage billing
          </Link>
        </div>

        {paymentConfig && !paymentsReady && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Payments are not configured on the server. Add <code className="text-red-100">CHAPA_SECRET_KEY</code> to your backend <code className="text-red-100">.env</code> file.
            </span>
          </div>
        )}

        {!hasBillingDetails && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm text-amber-200">
            Add billing details for your invoice.{" "}
            <Link to="/billing" className="underline font-medium hover:text-white">Go to Billing</Link>
          </div>
        )}

        {hasBillingDetails && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm text-slate-400">
            Billing to: <span className="text-slate-200">{billing.fullName}</span>
            {billing.city ? ` · ${billing.city}` : ""}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass rounded-2xl p-6 h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Order summary</p>
                <h1 className="text-xl font-bold text-white">{plan.name} Plan</h1>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{plan.name} subscription</span>
                <span className="text-white font-medium">{plan.priceLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Billing period</span>
                <span className="text-slate-300">1 year</span>
              </div>
              <div className="border-t border-slate-700/60 pt-4 flex justify-between">
                <span className="text-white font-semibold">Total due today</span>
                <span className="text-2xl font-bold text-white">{plan.priceLabel}</span>
              </div>
            </div>

            <ul className="space-y-2.5">
              {[
                "Unlimited AI business plans",
                "Unlimited bookmarks",
                "PDF export & priority support",
                "Valid for 12 months"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-3 glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-white mb-1">Payment method</h2>
            <p className="text-slate-400 text-sm mb-6">All payments are processed securely through Chapa</p>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {METHODS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`rounded-xl p-4 text-left border transition-all ${
                    method === id
                      ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/40"
                      : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${method === id ? "text-indigo-400" : "text-slate-400"}`} />
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <p className="text-sm text-slate-400">
                {method === "telebirr"
                  ? "Enter your Telebirr phone number. Chapa will send a USSD prompt — approve it to complete payment."
                  : "Enter your Ethiopian phone number. Chapa requires this for payment verification."}
              </p>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Phone number</label>
                <input
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder={PLACEHOLDERS.phone}
                />
              </div>
            </div>

            {(method === "chapa" || method === "card") && (
              <p className="text-sm text-slate-400 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 -mt-2">
                {method === "card"
                  ? "You will be redirected to Chapa's secure checkout to pay with Visa or Mastercard."
                  : "You will be redirected to Chapa to pay with card, Telebirr, or other supported methods."}
              </p>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={payMutation.isPending || !paymentsReady}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              {payMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay {plan.priceLabel}</>
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-4">
              <Shield className="w-3.5 h-3.5" />
              Secured by Chapa · ETB {plan.price?.toLocaleString?.() ?? "2,500"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
