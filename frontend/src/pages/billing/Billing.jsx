import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CreditCard, Zap, Download, Loader2, AlertTriangle,
  RefreshCw, ArrowRight, CheckCircle2
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { PLANS } from "../../constants/plans";
import { downloadInvoicePdf } from "../../components/billing/InvoicePdf";
import { BILLING_PLACEHOLDERS } from "../../constants/placeholders";

const EMPTY_BILLING = {
  fullName: "", company: "", phone: "",
  addressLine1: "", addressLine2: "", city: "", region: "",
  country: "Ethiopia", taxId: ""
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatMethod(m) {
  const map = { card: "Card", chapa: "Chapa", telebirr: "Telebirr" };
  return map[m] || m;
}

export default function Billing() {
  const { user, updateUser, refreshProfile } = useContext(AuthContext);
  const userId = user?._id;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [billingForm, setBillingForm] = useState(EMPTY_BILLING);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => api.get("/payments/subscription").then((r) => r.data.data),
    enabled: !!userId
  });

  const { data: billingData } = useQuery({
    queryKey: ["billing-details", userId],
    queryFn: () => api.get("/payments/billing-details").then((r) => r.data.data),
    enabled: !!userId
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ["payment-history", userId],
    queryFn: () => api.get("/payments/history", { params: { limit: 20 } }).then((r) => r.data.data),
    enabled: !!userId
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", userId],
    queryFn: () => api.get("/payments/invoices").then((r) => r.data.data),
    enabled: !!userId
  });

  useEffect(() => {
    setBillingForm(EMPTY_BILLING);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    if (billingData?.billingDetails && Object.values(billingData.billingDetails).some(Boolean)) {
      setBillingForm({ ...EMPTY_BILLING, ...billingData.billingDetails });
    } else if (user) {
      setBillingForm({
        ...EMPTY_BILLING,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim()
      });
    }
  }, [billingData, user, userId]);

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setShowPaymentSuccess(true);
      toast.success("Payment successful! Your Founder plan is now active.");
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
      queryClient.invalidateQueries({ queryKey: ["invoices", userId] });
      queryClient.invalidateQueries({ queryKey: ["payment-history", userId] });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshProfile, queryClient, userId]);

  const saveBilling = useMutation({
    mutationFn: (payload) => api.put("/payments/billing-details", payload),
    onSuccess: () => {
      toast.success("Billing details saved");
      queryClient.invalidateQueries({ queryKey: ["billing-details", userId] });
    },
    onError: () => toast.error("Failed to save billing details")
  });

  const cancelSub = useMutation({
    mutationFn: () => api.post("/payments/cancel"),
    onSuccess: (res) => {
      const updated = res.data.data;
      queryClient.setQueryData(["subscription", userId], updated);
      updateUser({ ...user, subscription: updated });
      queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
      toast.success("Subscription will cancel at end of billing period");
      setShowCancelConfirm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to cancel")
  });

  const reactivateSub = useMutation({
    mutationFn: () => api.post("/payments/reactivate"),
    onSuccess: (res) => {
      const updated = res.data.data;
      queryClient.setQueryData(["subscription", userId], updated);
      updateUser({ ...user, subscription: updated });
      queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
      toast.success("Subscription reactivated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to reactivate")
  });

  const sub = subData || user?.subscription || { plan: "starter", status: "active" };
  const planMeta = PLANS[sub.plan] || PLANS.starter;
  const isFounderActive = sub.plan === "founder" && sub.status === "active";
  const isFounderPending = sub.plan === "founder" && sub.status === "pending";
  const isStarter = sub.plan === "starter" || sub.status === "expired";

  const setField = (key) => (e) => setBillingForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Billing"
        subtitle="Manage your subscription, billing details, and invoices"
        badge={<span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {planMeta.name}</span>}
      />

      <div className="space-y-6 max-w-4xl">
        {showPaymentSuccess && (
          <div className="rounded-2xl p-5 bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-200 font-semibold">Payment successful</p>
              <p className="text-sm text-emerald-200/80 mt-1">
                Your Founder plan is active. Your invoice is listed below.
              </p>
            </div>
          </div>
        )}

        {/* Subscription */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Current plan</h2>
          {subLoading ? (
            <div className="h-24 animate-pulse bg-slate-800/40 rounded-xl" />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">{planMeta.name}</span>
                  {isFounderActive && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                  {isFounderPending && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Payment pending
                    </span>
                  )}
                  {sub.cancelAtPeriodEnd && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                      Cancelling
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {isStarter && "Free forever · 1 AI plan · 3 bookmarks"}
                  {isFounderActive && `ETB 2,500 / year · ${sub.limits?.aiPlanLimit ? "Limited" : "Unlimited AI plans & bookmarks"}`}
                  {isFounderPending && "Complete payment to unlock Founder features"}
                </p>
                {isFounderActive && sub.expiresAt && (
                  <p className="text-xs text-slate-500">
                    {sub.cancelAtPeriodEnd
                      ? `Access until ${formatDate(sub.expiresAt)}`
                      : `Renews on ${formatDate(sub.expiresAt)}`}
                    {sub.daysRemaining != null && ` · ${sub.daysRemaining} days remaining`}
                  </p>
                )}
                {isFounderActive && sub.paymentMethod && (
                  <p className="text-xs text-slate-600 mt-1">Paid via {formatMethod(sub.paymentMethod)}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {isStarter && (
                  <Link to="/checkout?plan=founder" className="btn-primary text-sm">
                    <Zap className="w-4 h-4" /> Upgrade to Founder
                  </Link>
                )}
                {isFounderPending && (
                  <Link to="/checkout?plan=founder" className="btn-primary text-sm">
                    Complete payment <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {isFounderActive && !sub.cancelAtPeriodEnd && (
                  <button type="button" onClick={() => setShowCancelConfirm(true)} className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
                    Cancel subscription
                  </button>
                )}
                {isFounderActive && sub.cancelAtPeriodEnd && (
                  <button type="button" onClick={() => reactivateSub.mutate()} disabled={reactivateSub.isPending} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
                    {reactivateSub.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Billing details */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-1">Billing details</h2>
          <p className="text-sm text-slate-500 mb-5">Used on invoices and receipts.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); saveBilling.mutate(billingForm); }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <input value={billingData?.email || user?.email || ""} disabled className="input-base text-sm opacity-60" />
            </div>
            {[
              { key: "fullName", label: "Full name", span: 2 },
              { key: "company", label: "Company (optional)" },
              { key: "phone", label: "Phone" },
              { key: "addressLine1", label: "Address line 1", span: 2 },
              { key: "addressLine2", label: "Address line 2 (optional)", span: 2 },
              { key: "city", label: "City" },
              { key: "region", label: "Region / State" },
              { key: "country", label: "Country" },
              { key: "taxId", label: "Tax ID (optional)" }
            ].map(({ key, label, span }) => (
              <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                <input value={billingForm[key]} onChange={setField(key)} placeholder={BILLING_PLACEHOLDERS[key] || ""} className="input-base text-sm" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <button type="submit" disabled={saveBilling.isPending} className="btn-primary text-sm">
                {saveBilling.isPending ? "Saving..." : "Save billing details"}
              </button>
            </div>
          </form>
        </section>

        {/* Payment history */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Payment history</h2>
          {historyLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />)}</div>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-500">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Method</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((p) => (
                    <tr key={p._id} className="border-b border-slate-800/50 last:border-0">
                      <td className="py-3 pr-4 text-slate-300">{formatDate(p.createdAt)}</td>
                      <td className="py-3 pr-4 text-white font-medium">{p.currency} {p.amount?.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-slate-400 capitalize">{formatMethod(p.method)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : p.status === "pending" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 text-xs font-mono truncate max-w-[120px]">{p.txRef}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Invoices */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Invoices</h2>
          {invoicesLoading ? (
            <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />)}</div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-slate-500">No invoices yet. Invoices are generated after successful payments.</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv._id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div>
                    <p className="text-sm font-semibold text-white">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-500">{formatDate(inv.issuedAt)} · Founder · {inv.currency} {inv.amount?.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadInvoicePdf(inv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {createPortal(
        showCancelConfirm ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowCancelConfirm(false)}
          >
            <div
              className="bg-[#0d1425] border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-subscription-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
                <div>
                  <p id="cancel-subscription-title" className="font-bold text-white text-sm">Cancel subscription?</p>
                  <p className="text-xs text-slate-500 mt-0.5">You keep Founder access until {formatDate(sub.expiresAt)}.</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-5">After that date, your account will revert to the free Starter plan.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCancelConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700">Keep plan</button>
                <button type="button" onClick={() => cancelSub.mutate()} disabled={cancelSub.isPending} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-60">
                  {cancelSub.isPending ? "Cancelling..." : "Cancel at period end"}
                </button>
              </div>
            </div>
          </div>
        ) : null,
        document.body
      )}
    </DashboardLayout>
  );
}
