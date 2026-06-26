import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Users, Lightbulb, FileText, DollarSign, TrendingUp, ArrowRight,
  AlertTriangle, CheckCircle2, ShieldCheck, Receipt, UserPlus, Zap
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import { SkeletonCard } from "../../components/common/Skeleton";
import api from "../../api/axios";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f172a",
  borderColor: "#334155",
  borderRadius: "10px",
  color: "#f1f5f9",
  fontSize: "12px"
};

function ScoreRing({ score, label, color = "#f59e0b", size = 88 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="7" stroke="#1e293b" fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth="7"
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-[11px] text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function ActionLink({ icon: Icon, text, to, color }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 hover:border-amber-500/20 rounded-xl transition-all group"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">{text}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
    </Link>
  );
}

function MetricRow({ label, value, hint, positive }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        {hint && <p className="text-[10px] text-slate-600 mt-0.5">{hint}</p>}
      </div>
      <span className={`text-sm font-semibold ${positive === false ? "text-red-400" : positive === true ? "text-emerald-400" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

export default function AdminOverview() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data.data),
    staleTime: 1000 * 60 * 2
  });

  const stats = data || {};
  const hasActivity = (stats.monthlyActivity || []).some((m) => m.plans > 0 || m.users > 0);

  const kpiCards = [
    {
      label: "Total Users",
      value: String(stats.totalUsers ?? 0),
      sub: `${stats.activeUsers ?? 0} active · ${stats.recentSignups ?? 0} new this week`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      trend: { label: `${stats.activeRate ?? 0}% active`, positive: (stats.activeRate ?? 0) >= 70 }
    },
    {
      label: "Business Ideas",
      value: String(stats.totalIdeas ?? 0),
      sub: `${stats.activeIdeas ?? 0} published in catalog`,
      icon: Lightbulb,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      trend: { label: `${stats.ideaActiveRate ?? 0}% live`, positive: (stats.ideaActiveRate ?? 0) >= 80 }
    },
    {
      label: "Business Plans",
      value: String(stats.totalPlans ?? 0),
      sub: `${stats.plansThisMonth ?? 0} created this month`,
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      trend: { label: `${stats.aiPlans ?? 0} AI`, positive: true }
    },
    {
      label: "Revenue",
      value: stats.totalRevenue ? `${Number(stats.totalRevenue).toLocaleString()} ETB` : "0 ETB",
      sub: `${stats.completedPayments ?? 0} completed payments`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      trend: stats.pendingPayments > 0
        ? { label: `${stats.pendingPayments} pending`, positive: false }
        : { label: "All clear", positive: true }
    }
  ];

  const userPie = [
    { name: "Active", value: stats.activeUsers || 0 },
    { name: "Inactive", value: stats.inactiveUsers || 0 }
  ].filter((d) => d.value > 0);

  const planPie = [
    { name: "AI", value: stats.aiPlans || 0 },
    { name: "Manual", value: stats.manualPlans || 0 }
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 mb-1">Admin overview</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.firstName || "Admin"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Platform health and growth at a glance</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          Administrator
        </span>
      </div>

      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Failed to load platform stats. Refresh the page to try again.
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 hover:border-amber-500/15 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 border rounded-xl ${card.bg}`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    {card.trend && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          card.trend.positive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {card.trend.label}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{card.sub}</p>
                </motion.div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-bold text-white text-sm">Platform Growth</h3>
            <p className="text-xs text-slate-500 mt-0.5">New users and business plans over the last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart…</div>
            ) : !hasActivity ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <TrendingUp className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">No platform activity in the last 6 months yet</p>
              </div>
            ) : (
              <BarChart data={stats.monthlyActivity || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(245,158,11,0.06)" }} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                <defs>
                  <linearGradient id="adminBarUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="adminBarPlans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <Bar dataKey="users" name="New users" fill="url(#adminBarUsers)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="plans" name="New plans" fill="url(#adminBarPlans)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Platform Health</h3>
          <p className="text-xs text-slate-500 mb-5">Active rates and subscription mix</p>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-slate-800/60 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-around items-center h-[140px] mb-4">
                <ScoreRing score={stats.activeRate ?? 0} label="User activity" color="#3b82f6" />
                <ScoreRing score={stats.ideaActiveRate ?? 0} label="Ideas live" color="#f59e0b" />
              </div>

              {!isLoading && stats.totalPlans > 0 && planPie.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-3">Plan sources</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0">
                      <PieChart width={64} height={64}>
                        <Pie data={planPie} dataKey="value" innerRadius={18} outerRadius={30} paddingAngle={2} stroke="none">
                          <Cell fill="#6366f1" />
                          <Cell fill="#8b5cf6" />
                        </Pie>
                      </PieChart>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span className="text-xs text-slate-400">AI ({stats.aiPlans ?? 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <span className="text-xs text-slate-400">Manual ({stats.manualPlans ?? 0})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && userPie.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-2">User accounts</p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">{stats.activeUsers} active</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{stats.inactiveUsers} inactive</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Quick Actions</h3>
          <p className="text-xs text-slate-500 mb-4">Jump to common management tasks</p>
          <div className="space-y-2">
            <ActionLink icon={Lightbulb} text="Manage business ideas" to="/admin/ideas" color="bg-amber-500/15 text-amber-400" />
            <ActionLink icon={Users} text="View and edit users" to="/admin/users" color="bg-blue-500/15 text-blue-400" />
            <ActionLink icon={FileText} text="Review business plans" to="/admin/plans" color="bg-purple-500/15 text-purple-400" />
            <ActionLink icon={DollarSign} text="Payment history" to="/admin/payments" color="bg-emerald-500/15 text-emerald-400" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Subscriptions & Billing</h3>
          <p className="text-xs text-slate-500 mb-4">Founder plan and payment snapshot</p>
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <div>
              <MetricRow label="Founder subscribers" value={stats.founderUsers ?? 0} hint="Active paid plans" positive />
              <MetricRow label="Completed payments" value={stats.completedPayments ?? 0} positive />
              <MetricRow
                label="Pending payments"
                value={stats.pendingPayments ?? 0}
                positive={!(stats.pendingPayments > 0)}
              />
              <MetricRow
                label="Total revenue"
                value={`${Number(stats.totalRevenue || 0).toLocaleString()} ETB`}
                positive
              />
              <button
                type="button"
                onClick={() => navigate("/admin/invoices")}
                className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                View all invoices
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Catalog Snapshot</h3>
          <p className="text-xs text-slate-500 mb-4">Content available to users today</p>
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <>
              <MetricRow label="Published ideas" value={stats.activeIdeas ?? 0} hint={`${stats.inactiveIdeas ?? 0} hidden`} positive />
              <MetricRow label="Visible plans" value={stats.activePlans ?? 0} hint={`${stats.hiddenPlans ?? 0} hidden`} positive />
              <MetricRow label="Plans this month" value={stats.plansThisMonth ?? 0} positive />
              <MetricRow label="New users (7 days)" value={stats.recentSignups ?? 0} positive />

              {(stats.inactiveIdeas > 0 || stats.hiddenPlans > 0) ? (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90">
                    Some catalog items are hidden from users. Review ideas and plans to keep content fresh.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300">All catalog items are visible to users.</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => navigate("/admin/ideas")} className="btn-secondary text-xs py-2 justify-center">
                  <Zap className="w-3.5 h-3.5" /> Ideas
                </button>
                <button type="button" onClick={() => navigate("/admin/users")} className="btn-secondary text-xs py-2 justify-center">
                  <UserPlus className="w-3.5 h-3.5" /> Users
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
