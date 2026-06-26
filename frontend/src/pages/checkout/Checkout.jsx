import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Shield
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { PLANS } from "../../constants/plans";

const METHODS = [
  { id: "card", label: "Card", icon: CreditCard, desc: "Visa, Mastercard" },
  { id: "chapa", label: "Chapa", icon: Wallet, desc: "Cards & mobile money" },
  { id: "telebirr", label: "Telebirr", icon: Smartphone, desc: "Ethio Telecom wallet" }
];

export default function Checkout() {
  const { user, updateUser, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "founder";
  const txRefFromUrl = searchParams.get("tx_ref");

  const plan = PLANS[planId] || PLANS.founder;
  const [method, setMethod] = useState("chapa");
  const [card, setCard] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });

  const sub = user?.subscription;
  const alreadyActive = sub?.plan === "founder" && sub?.status === "active";

  useEffect(() => {
    if (alreadyActive) {
      navigate("/dashboard", { replace: true });
    }
  }, [alreadyActive, navigate]);

  const verifyMutation = useMutation({
    mutationFn: (txRef) => api.get(`/payments/verify/${txRef}`),
    onSuccess: async (res) => {
      if (res.data.subscription) {
        updateUser({ ...user, subscription: res.data.subscription });
      } else {
        await refreshProfile();
      }
      toast.success("Payment confirmed! Welcome to Founder.");
      navigate("/dashboard");
    },
    onError: () => toast.error("Could not verify payment. Contact support if you were charged.")
  });

  useEffect(() => {
    if (txRefFromUrl) {
      verifyMutation.mutate(txRefFromUrl);
    }
  }, [txRefFromUrl]);

  const payMutation = useMutation({
    mutationFn: (payload) => api.post("/payments/initiate", payload),
    onSuccess: (res) => {
      if (res.data.redirect && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }
      if (res.data.subscription) {
        updateUser({ ...user, subscription: res.data.subscription });
      }
      toast.success(res.data.mock ? "Payment simulated successfully (demo mode)" : "Payment successful!");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  });

  const handlePay = () => {
    const payload = { method, plan: planId };
    if (method === "card") {
      Object.assign(payload, card);
    }
    payMutation.mutate(payload);
  };

  if (txRefFromUrl && verifyMutation.isPending) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1a] py-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <Link to="/pricing" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </Link>

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
            <p className="text-slate-400 text-sm mb-6">Choose how you would like to pay</p>

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

            {method === "card" && (
              <div className="space-y-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Name on card</label>
                  <input
                    value={card.cardName}
                    onChange={(e) => setCard({ ...card, cardName: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Card number</label>
                  <input
                    value={card.cardNumber}
                    onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Expiry</label>
                    <input
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">CVV</label>
                    <input
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="123"
                      type="password"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "chapa" && (
              <p className="text-sm text-slate-400 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                You will be redirected to Chapa to complete payment securely with card or mobile money.
              </p>
            )}

            {method === "telebirr" && (
              <p className="text-sm text-slate-400 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                Pay with your Telebirr wallet. A USSD prompt will be sent to your registered phone (demo mode simulates success).
              </p>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={payMutation.isPending}
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
              Secure payment · Encrypted checkout
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
