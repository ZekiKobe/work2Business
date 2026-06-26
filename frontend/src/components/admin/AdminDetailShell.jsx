import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { SkeletonCard } from "../common/Skeleton";

export function DetailRow({ label, value, mono = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 py-3 border-b border-slate-800/60 last:border-0">
      <span className="text-xs font-medium text-slate-500 shrink-0">{label}</span>
      {children || (
        <span className={`text-sm text-slate-200 text-left sm:text-right break-all ${mono ? "font-mono text-xs" : ""}`}>
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}

export function StatusBadge({ status, variant = "default" }) {
  const styles = {
    completed: "bg-emerald-500/15 text-emerald-400",
    paid: "bg-emerald-500/15 text-emerald-400",
    active: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-amber-500/15 text-amber-400",
    inactive: "bg-red-500/15 text-red-400",
    failed: "bg-red-500/15 text-red-400",
    default: "bg-slate-700/50 text-slate-300"
  };
  const cls = styles[status] || styles[variant] || styles.default;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

export default function AdminDetailShell({
  backTo,
  backLabel = "Back to list",
  title,
  subtitle,
  isLoading,
  isError,
  notFound,
  actions,
  children
}) {
  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="h-5 w-32 bg-slate-800/60 rounded animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || notFound) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-white mb-1">{notFound ? "Record not found" : "Failed to load details"}</p>
        <p className="text-xs text-slate-500 mb-5">The item may have been removed or the link is invalid.</p>
        <Link to={backTo} className="btn-secondary text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="glass rounded-2xl p-5 sm:p-7 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
