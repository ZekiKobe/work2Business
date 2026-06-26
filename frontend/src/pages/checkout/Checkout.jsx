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
  AlertTriangle
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { PLANS } from "../../constants/plans";

const METHODS = [
  { id: "chapa", label: "Chapa", icon: Wallet, desc: "Cards, Telebirr, mobile money" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Visa, Mastercard via Chapa" },
  { id: "telebirr", label: "Telebirr", icon: Smartphone, desc: "USSD prompt to your phone" }
];

export default function Checkout() {
  const { user, updateUser, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "founder";
  const txRefFromUrl = searchParams.get("tx_ref");

  const plan = PLANS[planId] || PLANS.founder;
  const [method, setMethod] = useState("chapa");
  const [telebirrPhone, setTelebirrPhone] = useState("");
  const [awaitingTxRef, setAwaitingTxRef] = useState(null);
  const pollRef = useRef(null);

  const sub = user?.subscription;
  const alreadyActive = sub?.plan === "founder" && sub?.status === "active";

  const { data: paymentConfig } = useQuery({
    queryKey: ["payment-config"],
    queryFn: () => api.get("/payments/config").then((r) => r.data.data)
  });

  const { data: billingData } = useQuery({
    queryKey: ["billing-details"],
    queryFn: () => api.get("/payments/billing-details").then((r) => r.data.data),
    enabled: !!user
  });

  const billing = billingData?.billingDetails || {};
  const hasBillingDetails = Boolean(billing.fullName && billing.addressLine1);
  const defaultPhone = billing.phone || "";

  useEffect(() => {
    if (defaultPhone && !telebirrPhone) setTelebirrPhone(defaultPhone);
  }, [defaultPhone, telebirrPhone]);

  useEffect(() => {
    if (alreadyActive) {
      navigate("/billing", { replace: true });
    }
  }, [alreadyActive, navigate]);

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const handlePaymentSuccess = async (subscription) => {
    if (subscription) {
      updateUser({ ...user, subscription });
    } else {
      await refreshProfile();
    }
    toast.success("Payment confirmed! Welcome to Founder.");
    navigate("/billing?success=1");
  };

  const verifyMutation = useMutation({
    mutationFn: (txRef) => api.get(`/payments/verify/${txRef}`),
    onSuccess: async (res) => {
      if (res.data.status === "completed") {
        if (pollRef.current) clearInterval(pollRef.current);
        setAwaitingTxRef(null);
        await handlePaymentSuccess(res.data.subscription);
      } else if (res.data.status === "pending") {
        // keep polling for telebirr
      }
    },
    onError: (err) => {
      if (pollRef.current) clearInterval(pollRef.current);
      setAwaitingTxRef(null);
      toast.error(err.response?.data?.message || "Payment verification failed");
    }
  });

  useEffect(() => {
    if (txRefFromUrl) {
      verifyMutation.mutate(txRefFromUrl);
    }
  }, [txRefFromUrl]);

  const startPolling = (txRef) => {
    setAwaitingTxRef(txRef);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      verifyMutation.mutate(txRef);
    }, 4000);
  };

  const payMutation = useMutation({
    mutationFn: (payload) => api.post("/payments/initiate", payload),
    onSuccess: (res) => {
      if (res.data.redirect && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }
      if (res.data.awaitingConfirmation && res.data.txRef) {
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
    if (method === "telebirr") {
      payload.phone = telebirrPhone.trim();
      if (!payload.phone) {
        toast.error("Enter your Telebirr phone number");
        return;
      }
    }
    payMutation.mutate(payload);
  };

  const paymentsReady = paymentConfig?.configured;

  if (txRefFromUrl && verifyMutation.isPending && !awaitingTxRef) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Confirming your payment with Chapa...</p>
        </div>
      </div>
    );
  }

  if (awaitingTxRef) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-bold text-white mb-2">Waiting for Telebirr approval</h1>
          <p className="text-sm text-slate-400 mb-4">
            Approve the USSD prompt on your phone. This page will update automatically once Chapa confirms payment.
          </p>
          <p className="text-xs text-slate-600 font-mono mb-6">{awaitingTxRef}</p>
          <button
            type="button"
            onClick={() => verifyMutation.mutate(awaitingTxRef)}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Check status now
          </button>
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

            {(method === "chapa" || method === "card") && (
              <p className="text-sm text-slate-400 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                {method === "card"
                  ? "You will be redirected to Chapa's secure checkout to pay with Visa or Mastercard."
                  : "You will be redirected to Chapa to pay with card, Telebirr, or other supported methods."}
              </p>
            )}

            {method === "telebirr" && (
              <div className="space-y-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <p className="text-sm text-slate-400">
                  Enter your Telebirr phone number. Chapa will send a USSD prompt — approve it to complete payment.
                </p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Telebirr phone number</label>
                  <input
                    value={telebirrPhone}
                    onChange={(e) => setTelebirrPhone(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="0912345678"
                  />
                </div>
              </div>
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
