import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, FileText, Lightbulb, DollarSign, User, ArrowRight,
  CheckCircle2, AlertTriangle, Zap, Target, Milestone, Circle, X, CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import { SkeletonCard } from "../../components/common/Skeleton";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

function ScoreRing({ score, label, color = "#6366f1", size = 100 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="8" stroke="#1e293b" fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius} strokeWidth="8"
            stroke={color} fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center">{label}</span>
    </div>
  );
}

function ActionItem({ icon: Icon, text, to, color }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 hover:border-slate-600/60 rounded-xl transition-all group">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">{text}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
    </Link>
  );
}

function MilestoneTracker() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["milestones"],
    queryFn: () => api.get("/user/milestones").then(r => r.data),
    staleTime: 1000 * 60
  });

  const { mutate: toggleMilestone } = useMutation({
    mutationFn: (key) => api.patch(`/user/milestones/${key}/toggle`),
    onMutate: async (key) => {
      await queryClient.cancelQueries(["milestones"]);
      const prev = queryClient.getQueryData(["milestones"]);
      queryClient.setQueryData(["milestones"], old => {
        if (!old) return old;
        return {
          ...old,
          milestones: old.milestones.map(m => m.key === key ? { ...m, completed: !m.completed } : m)
        };
      });
      return { prev };
    },
    onError: (err, key, context) => {
      queryClient.setQueryData(["milestones"], context.prev);
      toast.error("Failed to update milestone");
    },
    onSuccess: (res) => {
      const m = res.data.milestone;
      if (m.completed) toast.success(`✓ "${m.title}" completed!`);
    },
    onSettled: () => queryClient.invalidateQueries(["milestones"])
  });

  const milestones = data?.milestones || [];
  const progressPercent = data?.progressPercent || 0;
  const completedCount = data?.completedCount || 0;
  const totalCount = data?.totalCount || 0;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Milestone className="w-4 h-4 text-amber-400" /> Launch Milestone Tracker
        </h3>
        <span className="text-xs font-bold text-amber-400">{completedCount}/{totalCount}</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">Complete each milestone to launch your business</p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-amber-400">{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4].map(i=><div key={i} className="h-9 bg-slate-800 animate-pulse rounded-xl" />)}</div>
      ) : (
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {milestones.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMilestone(m.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                m.completed
                  ? "bg-amber-500/8 border border-amber-500/20"
                  : "bg-slate-800/30 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/40"
              }`}
            >
              {m.completed ? (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
              )}
              <span className={`text-xs font-medium ${m.completed ? "line-through text-slate-500" : "text-slate-300 group-hover:text-white"} transition-colors`}>
                {m.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BillingBanner({ user }) {
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem("billing-banner-dismissed") === "1"
  );

  const sub = user?.subscription;
  if (!sub || dismissed) return null;

  let banner = null;

  if (sub.plan === "founder" && sub.status === "pending") {
    banner = {
      tone: "amber",
      message: "Complete your Founder payment to unlock unlimited AI plans and bookmarks.",
      cta: "Complete payment",
      to: "/checkout?plan=founder"
    };
  } else if (sub.plan === "starter" || sub.status === "expired") {
    banner = {
      tone: "indigo",
      message: "Upgrade to Founder for unlimited AI business plans, bookmarks, and PDF export.",
      cta: "View plans",
      to: "/billing"
    };
  } else if (sub.plan === "founder" && sub.status === "active") {
    const expires = sub.expiresAt ? new Date(sub.expiresAt) : null;
    const daysLeft = expires ? Math.ceil((expires - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    if (sub.cancelAtPeriodEnd) {
      banner = {
        tone: "amber",
        message: `Your Founder plan ends on ${expires?.toLocaleDateString()}. Reactivate anytime in Billing.`,
        cta: "Manage billing",
        to: "/billing"
      };
    } else if (daysLeft != null && daysLeft <= 30) {
      banner = {
        tone: "amber",
        message: `Your Founder plan renews in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
        cta: "Billing",
        to: "/billing"
      };
    }
  }

  if (!banner) return null;

  const tones = {
    amber: "bg-amber-500/10 border-amber-500/25 text-amber-200",
    indigo: "bg-indigo-500/10 border-indigo-500/25 text-indigo-200"
  };

  return (
    <div className={`mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border ${tones[banner.tone]}`}>
      <div className="flex items-start gap-2 text-sm">
        <CreditCard className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{banner.message}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link to={banner.to} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 transition-colors">
          {banner.cta}
        </Link>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("billing-banner-dismissed", "1");
            setDismissed(true);
          }}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/user/dashboard-stats").then((r) => r.data.data),
    staleTime: 1000 * 60 * 2
  });

  const stats = data || {};
  const completeness = user?.profileCompleteness ?? 0;

  const actionItems = [];
  if (completeness < 50) actionItems.push({ icon: User, text: "Complete your profile to unlock better matches", to: "/profile", color: "bg-amber-500/15 text-amber-400" });
  if (!user?.availableCapital) actionItems.push({ icon: DollarSign, text: "Add your available capital for accurate recommendations", to: "/profile", color: "bg-blue-500/15 text-blue-400" });
  if ((!user?.skills || user.skills.length === 0)) actionItems.push({ icon: Target, text: "Add your skills to improve match scoring", to: "/profile", color: "bg-purple-500/15 text-purple-400" });
  if ((stats.totalPlans || 0) === 0) actionItems.push({ icon: Zap, text: "Generate your first AI business plan", to: "/recommendations", color: "bg-emerald-500/15 text-emerald-400" });

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${user?.firstName || "Entrepreneur"}`}
        subtitle="Your entrepreneurship journey at a glance"
        badge="Dashboard"
      />

      <BillingBanner user={user} />

      {isError && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Failed to load dashboard stats. Refresh the page to try again.
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {[
              {
                label: "E2B Readiness",
                value: `${stats.e2bReadiness ?? 0}%`,
                sub: "Profile + match score",
                icon: TrendingUp,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10 border-indigo-500/20",
                trend: { label: stats.e2bReadiness >= 70 ? "On Track" : "Needs work", positive: stats.e2bReadiness >= 70 }
              },
              {
                label: "Best Match Score",
                value: `${stats.topMatchScore ?? 0}%`,
                sub: stats.topIdea?.name || "No ideas yet",
                icon: Lightbulb,
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
                trend: { label: `${stats.qualifiedRecommendations ?? 0} qualified`, positive: true }
              },
              {
                label: "Business Plans",
                value: String(stats.totalPlans ?? 0),
                sub: `${stats.aiPlans ?? 0} AI • ${stats.manualPlans ?? 0} manual`,
                icon: FileText,
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                trend: null
              },
              {
                label: "Capital Ready",
                value: user?.availableCapital ? `${(user.availableCapital / 1000).toFixed(0)}K ETB` : "—",
                sub: `Readiness: ${stats.capitalReadiness ?? 0}%`,
                icon: DollarSign,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
                trend: { label: stats.capitalReadiness >= 100 ? "Fully ready" : `${stats.capitalReadiness ?? 0}% ready`, positive: (stats.capitalReadiness ?? 0) >= 80 }
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 hover:border-slate-700/80 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 border rounded-xl ${card.bg}`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    {card.trend && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.trend.positive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {card.trend.label}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{card.sub}</p>
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Monthly activity */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-bold text-white text-sm">Plan Generation Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Business plans created over the last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">Loading chart...</div>
            ) : (stats.monthlyActivity || []).every((m) => m.count === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <FileText className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">No plans created in the last 6 months</p>
                <Link to="/recommendations" className="text-xs text-indigo-400 hover:text-indigo-300 mt-2">Generate your first plan →</Link>
              </div>
            ) : (
            <BarChart data={stats.monthlyActivity || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "12px" }}
                cursor={{ fill: "rgba(99,102,241,0.06)" }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <Bar dataKey="count" name="Plans" fill="url(#barGrad)" radius={[5, 5, 0, 0]} maxBarSize={40} />
            </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Readiness gauges */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Readiness Scores</h3>
          <p className="text-xs text-slate-500 mb-5">Your current E2B indicators</p>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-slate-800/60 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="flex justify-around items-center h-[180px]">
              <ScoreRing score={stats.e2bReadiness ?? 0} label="E2B Score" color="#6366f1" />
              <ScoreRing score={completeness} label="Profile" color="#10b981" />
              <ScoreRing score={stats.capitalReadiness ?? 0} label="Capital" color="#f59e0b" />
            </div>
          )}

          {/* Plan source pie */}
          {!isLoading && stats.totalPlans > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-3">Plan Sources</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14">
                  <PieChart width={56} height={56}>
                    <Pie data={[{ name: "AI", value: stats.aiPlans || 0 }, { name: "Manual", value: stats.manualPlans || 0 }]}
                      dataKey="value" innerRadius={16} outerRadius={26} paddingAngle={2} stroke="none">
                      <Cell fill="#6366f1" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-xs text-slate-400">AI ({stats.aiPlans ?? 0})</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span className="text-xs text-slate-400">Manual ({stats.manualPlans ?? 0})</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Action items */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Recommended Actions</h3>
          <p className="text-xs text-slate-500 mb-4">Steps to improve your E2B readiness score</p>
          {actionItems.length === 0 ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-300">Your profile is complete and you have business plans. Keep building!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {actionItems.map((item, i) => (
                <ActionItem key={i} {...item} />
              ))}
            </div>
          )}
        </div>

        {/* Milestone tracker */}
        <MilestoneTracker />

        {/* Top match */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-1">Your Top Business Match</h3>
          <p className="text-xs text-slate-500 mb-4">Best-scored idea based on your profile</p>
          {isLoading ? (
            <SkeletonCard />
          ) : stats.topIdea ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white">{stats.topIdea.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stats.topIdea.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-400">{stats.topMatchScore}%</p>
                  <p className="text-xs text-slate-500">match</p>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.topMatchScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${stats.topIdea.riskLevel === "LOW" ? "bg-emerald-500/15 text-emerald-400" : stats.topIdea.riskLevel === "MEDIUM" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                  {stats.topIdea.riskLevel} Risk
                </span>
                <Link to="/recommendations" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  See all matches <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Complete your profile to see your top business match</p>
              <Link to="/profile" className="btn-primary text-xs mt-4 inline-flex">Complete Profile <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
