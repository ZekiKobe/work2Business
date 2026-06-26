import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import api from "../../api/axios";
import { downloadInvoicePdf } from "../../components/billing/InvoicePdf";
import AdminDetailShell, { DetailRow, StatusBadge } from "../../components/admin/AdminDetailShell";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatMethod(method) {
  if (!method) return "—";
  return method.replace(/_/g, " ");
}

function UserLink({ user }) {
  if (!user?._id) return "—";
  return (
    <Link to={`/admin/users/${user._id}`} className="text-sm text-indigo-400 hover:text-indigo-300">
      {user.firstName} {user.lastName} · {user.email}
    </Link>
  );
}

export function AdminPaymentDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-payment", id],
    queryFn: () => api.get(`/admin/payments/${id}`).then((r) => r.data.data)
  });

  const payment = data;

  return (
    <AdminDetailShell
      backTo="/admin/payments"
      backLabel="Back to payments"
      title={payment ? `${payment.currency} ${payment.amount?.toLocaleString()} · ${payment.plan}` : "Payment details"}
      subtitle={payment?.txRef}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !payment}
    >
      <div className="divide-y divide-slate-800/60">
        <DetailRow label="Status">
          <StatusBadge status={payment?.status} />
        </DetailRow>
        <DetailRow label="Amount" value={`${payment?.currency} ${payment?.amount?.toLocaleString()}`} />
        <DetailRow label="Plan" value={payment?.plan} />
        <DetailRow label="Method" value={formatMethod(payment?.method)} />
        <DetailRow label="Transaction ref" value={payment?.txRef} mono />
        <DetailRow label="Provider ref" value={payment?.providerRef || "—"} mono />
        <DetailRow label="Customer">
          <UserLink user={payment?.user} />
        </DetailRow>
        <DetailRow label="Created" value={formatDate(payment?.createdAt)} />
        <DetailRow label="Updated" value={formatDate(payment?.updatedAt)} />
        {payment?.invoice && (
          <DetailRow label="Invoice">
            <Link to={`/admin/invoices/${payment.invoice._id}`} className="text-sm text-indigo-400 hover:text-indigo-300">
              {payment.invoice.invoiceNumber}
            </Link>
          </DetailRow>
        )}
      </div>

      {payment?.metadata && Object.keys(payment.metadata).length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-3">Provider metadata</p>
          <pre className="text-xs text-slate-400 bg-slate-900/60 rounded-xl p-4 overflow-x-auto font-mono">
            {JSON.stringify(payment.metadata, null, 2)}
          </pre>
        </div>
      )}
    </AdminDetailShell>
  );
}

export function AdminInvoiceDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-invoice", id],
    queryFn: () => api.get(`/admin/invoices/${id}`).then((r) => r.data.data)
  });

  const invoice = data;
  const billing = invoice?.billingSnapshot || {};

  return (
    <AdminDetailShell
      backTo="/admin/invoices"
      backLabel="Back to invoices"
      title={invoice?.invoiceNumber || "Invoice details"}
      subtitle={invoice ? `${invoice.currency} ${invoice.amount?.toLocaleString()} · ${invoice.plan}` : undefined}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !invoice}
      actions={
        invoice ? (
          <button
            type="button"
            onClick={() => downloadInvoicePdf(invoice)}
            className="btn-secondary text-sm inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        ) : null
      }
    >
      <div className="divide-y divide-slate-800/60">
        <DetailRow label="Status">
          <StatusBadge status={invoice?.status || "paid"} />
        </DetailRow>
        <DetailRow label="Amount" value={`${invoice?.currency} ${invoice?.amount?.toLocaleString()}`} />
        <DetailRow label="Plan" value={invoice?.plan} />
        <DetailRow label="Method" value={formatMethod(invoice?.method)} />
        <DetailRow label="Issued" value={formatDate(invoice?.issuedAt)} />
        <DetailRow label="Customer">
          <UserLink user={invoice?.user} />
        </DetailRow>
        {invoice?.payment && (
          <DetailRow label="Payment">
            <Link to={`/admin/payments/${invoice.payment._id}`} className="text-sm text-indigo-400 hover:text-indigo-300 font-mono">
              {invoice.payment.txRef}
            </Link>
          </DetailRow>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60">
        <p className="text-xs font-medium text-slate-500 mb-3">Billing snapshot</p>
        <div className="divide-y divide-slate-800/60">
          <DetailRow label="Full name" value={billing.fullName || "—"} />
          <DetailRow label="Company" value={billing.company || "—"} />
          <DetailRow label="Email" value={billing.email || invoice?.user?.email || "—"} />
          <DetailRow label="Phone" value={billing.phone || "—"} />
          <DetailRow label="Address" value={[billing.addressLine1, billing.addressLine2].filter(Boolean).join(", ") || "—"} />
          <DetailRow label="City / Region" value={[billing.city, billing.region].filter(Boolean).join(", ") || "—"} />
          <DetailRow label="Country" value={billing.country || "—"} />
          <DetailRow label="Tax ID" value={billing.taxId || "—"} />
        </div>
      </div>
    </AdminDetailShell>
  );
}

export function AdminUserDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => api.get(`/admin/users/${id}`).then((r) => r.data.data)
  });

  const user = data;
  const sub = user?.subscription || {};
  const billing = user?.billingDetails || {};

  return (
    <AdminDetailShell
      backTo="/admin/users"
      backLabel="Back to users"
      title={user ? `${user.firstName} ${user.lastName}` : "User details"}
      subtitle={user?.email}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !user}
    >
      <div className="divide-y divide-slate-800/60">
        <DetailRow label="Role" value={user?.role} />
        <DetailRow label="Status">
          <StatusBadge status={user?.isActive ? "active" : "inactive"} />
        </DetailRow>
        <DetailRow label="Profession" value={user?.profession || "—"} />
        <DetailRow label="Employer" value={user?.employer || "—"} />
        <DetailRow label="Plans created" value={String(user?.planCount ?? 0)} />
        <DetailRow label="Favorite ideas" value={String(user?.favoriteIdeasCount ?? 0)} />
        <DetailRow label="Favorite plans" value={String(user?.favoritePlansCount ?? 0)} />
        <DetailRow label="Joined" value={formatDate(user?.createdAt)} />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60">
        <p className="text-xs font-medium text-slate-500 mb-3">Subscription</p>
        <div className="divide-y divide-slate-800/60">
          <DetailRow label="Plan" value={sub.plan || "starter"} />
          <DetailRow label="Status">
            <StatusBadge status={sub.status || "active"} />
          </DetailRow>
          <DetailRow label="Expires" value={formatDate(sub.expiresAt)} />
          <DetailRow label="Payment method" value={formatMethod(sub.paymentMethod)} />
          <DetailRow label="Last payment" value={formatDate(sub.lastPaymentAt)} />
          <DetailRow label="Cancel at period end" value={sub.cancelAtPeriodEnd ? "Yes" : "No"} />
        </div>
      </div>

      {(billing.fullName || billing.phone || billing.addressLine1) && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-3">Billing details</p>
          <div className="divide-y divide-slate-800/60">
            <DetailRow label="Full name" value={billing.fullName || "—"} />
            <DetailRow label="Phone" value={billing.phone || "—"} />
            <DetailRow label="City" value={billing.city || "—"} />
            <DetailRow label="Country" value={billing.country || "—"} />
          </div>
        </div>
      )}

      {user?.skills?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <span key={skill} className="text-[10px] bg-slate-800 text-slate-400 rounded px-2 py-0.5">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </AdminDetailShell>
  );
}

const RISK_COLORS = {
  LOW: "text-emerald-400 bg-emerald-500/10",
  MEDIUM: "text-amber-400 bg-amber-500/10",
  HIGH: "text-red-400 bg-red-500/10"
};

export function AdminIdeaDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-idea", id],
    queryFn: () => api.get(`/admin/ideas/${id}`).then((r) => r.data.data)
  });

  const idea = data;

  return (
    <AdminDetailShell
      backTo="/admin/ideas"
      backLabel="Back to business ideas"
      title={idea?.name || "Business idea details"}
      subtitle={idea?.category}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !idea}
    >
      <div className="divide-y divide-slate-800/60">
        <DetailRow label="Status">
          <StatusBadge status={idea?.isActive !== false ? "active" : "inactive"} />
        </DetailRow>
        <DetailRow label="Category" value={idea?.category} />
        <DetailRow label="Risk level">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${RISK_COLORS[idea?.riskLevel] || "text-slate-400 bg-slate-500/10"}`}>
            {idea?.riskLevel}
          </span>
        </DetailRow>
        <DetailRow label="Min capital" value={`$${(idea?.minimumCapital || 0).toLocaleString()}`} />
        <DetailRow label="Expected profit" value={`$${(idea?.expectedProfit || 0).toLocaleString()}/yr`} />
        <DetailRow label="Time to profit" value={`${idea?.timeToProfit || 0} months`} />
        <DetailRow label="Hours per week" value={`${idea?.hoursRequiredPerWeek || 0}h`} />
        <DetailRow label="Success rate" value={`${idea?.successRate || 0}%`} />
        <DetailRow label="Created" value={formatDate(idea?.createdAt)} />
        <DetailRow label="Updated" value={formatDate(idea?.updatedAt)} />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60">
        <p className="text-xs font-medium text-slate-500 mb-2">Description</p>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{idea?.description || "—"}</p>
      </div>

      {idea?.requiredSkills?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-2">Required skills</p>
          <div className="flex flex-wrap gap-1.5">
            {idea.requiredSkills.map((skill) => (
              <span key={skill} className="text-[10px] bg-indigo-500/10 text-indigo-300 rounded px-2 py-0.5">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {idea?.tags?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map((tag) => (
              <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 rounded px-2 py-0.5">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </AdminDetailShell>
  );
}

function PlanSection({ label, content }) {
  if (!content) return null;
  const text = typeof content === "string"
    ? content
    : typeof content === "object"
      ? JSON.stringify(content, null, 2)
      : String(content);

  return (
    <div className="py-4 border-b border-slate-800/60 last:border-0">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

const PLAN_SECTIONS = [
  { key: "executiveSummary", label: "Executive Summary" },
  { key: "marketAnalysis", label: "Market Analysis" },
  { key: "businessModel", label: "Business Model" },
  { key: "financialPlan", label: "Financial Plan" },
  { key: "marketingStrategy", label: "Marketing Strategy" },
  { key: "operationalPlan", label: "Operational Plan" },
  { key: "riskAnalysis", label: "Risk Analysis" }
];

export function AdminPlanDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-plan", id],
    queryFn: () => api.get(`/admin/plans/${id}`).then((r) => r.data.data)
  });

  const plan = data;
  const sections = PLAN_SECTIONS.filter(({ key }) => plan?.[key]);

  return (
    <AdminDetailShell
      backTo="/admin/plans"
      backLabel="Back to business plans"
      title={plan?.title || plan?.businessIdea?.name || "Plan details"}
      subtitle={plan?.user ? `${plan.user.firstName} ${plan.user.lastName}` : undefined}
      isLoading={isLoading}
      isError={isError}
      notFound={!isLoading && !isError && !plan}
    >
      <div className="divide-y divide-slate-800/60">
        <DetailRow label="Source" value={plan?.source} />
        <DetailRow label="Status">
          <StatusBadge status={plan?.isActive !== false ? "active" : "inactive"} />
        </DetailRow>
        <DetailRow label="Owner">
          <UserLink user={plan?.user} />
        </DetailRow>
        <DetailRow label="Business idea" value={plan?.businessIdea?.name || "—"} />
        <DetailRow label="Initial capital" value={plan?.initialCapital ? `$${plan.initialCapital.toLocaleString()}` : "—"} />
        <DetailRow label="Projected revenue" value={plan?.projectedRevenue ? `$${plan.projectedRevenue.toLocaleString()}` : "—"} />
        <DetailRow label="Success probability" value={plan?.successProbability != null ? `${plan.successProbability}%` : "—"} />
        <DetailRow label="Created" value={formatDate(plan?.createdAt)} />
        <DetailRow label="Updated" value={formatDate(plan?.updatedAt)} />
      </div>

      {sections.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 mb-1">Plan content</p>
          {sections.map(({ key, label }) => (
            <PlanSection key={key} label={label} content={plan[key]} />
          ))}
        </div>
      )}
    </AdminDetailShell>
  );
}
