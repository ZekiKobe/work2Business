import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileText, Trash2, Eye, Zap, Wrench, Calendar, TrendingUp,
  Search, LayoutGrid, LayoutList, AlertTriangle, Heart
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/Skeleton";
import api from "../../api/axios";

function PlanCard({ plan, onDelete, isDeleting, view, onToggleFavorite }) {
  const idea = plan.businessIdea;
  const isAI = plan.source === "AI";
  const riskColor = { LOW: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/25", HIGH: "text-red-400 bg-red-500/10 border-red-500/25" }[idea?.riskLevel] || "text-slate-400 bg-slate-800 border-slate-700";

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="glass rounded-xl px-5 py-4 flex items-center gap-4 hover:border-slate-700/80 transition-all group"
      >
        <div className={`p-2.5 rounded-xl border ${isAI ? "bg-indigo-500/10 border-indigo-500/20" : "bg-slate-800 border-slate-700"}`}>
          {isAI ? <Zap className="w-4 h-4 text-indigo-400" /> : <Wrench className="w-4 h-4 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{plan.title || idea?.name || "Business Plan"}</p>
          <p className="text-xs text-slate-500 mt-0.5">{idea?.category} • {new Date(plan.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {plan.successProbability > 0 && (
            <span className="text-xs font-bold text-indigo-400">{plan.successProbability}%</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>{idea?.riskLevel}</span>
          <button
            onClick={() => onToggleFavorite?.(plan._id)}
            title={plan.isFavorited ? "Remove from favorites" : "Save to favorites"}
            className={`p-1.5 rounded-lg transition-colors ${
              plan.isFavorited
                ? "text-pink-400 bg-pink-500/10 hover:bg-pink-500/15"
                : "text-slate-600 hover:text-pink-400 hover:bg-pink-500/10"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${plan.isFavorited ? "fill-current" : ""}`} />
          </button>
          <Link to={`/plans/${plan._id}`} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => onDelete(plan._id)} disabled={isDeleting} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="glass rounded-2xl p-5 hover:border-slate-700/80 transition-all group flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${isAI ? "bg-indigo-500/10 border-indigo-500/20" : "bg-slate-800 border-slate-700"}`}>
          {isAI ? <Zap className="w-4 h-4 text-indigo-400" /> : <Wrench className="w-4 h-4 text-slate-400" />}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAI ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
            {isAI ? "AI Generated" : "Manual"}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskColor}`}>{idea?.riskLevel}</span>
        </div>
      </div>

      <h3 className="font-bold text-white text-sm leading-tight mb-1">{plan.title || idea?.name || "Business Plan"}</h3>
      <p className="text-xs text-slate-500 mb-3">{idea?.category}</p>

      {plan.executiveSummary && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1 mb-4">
          {typeof plan.executiveSummary === "string" ? plan.executiveSummary.slice(0, 150) + "..." : ""}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-slate-800/60">
        {plan.successProbability > 0 && (
          <div className="text-center">
            <p className="text-xs font-bold text-indigo-400">{plan.successProbability}%</p>
            <p className="text-[10px] text-slate-600">Success</p>
          </div>
        )}
        {plan.projectedRevenue > 0 && (
          <div className="text-center">
            <p className="text-xs font-bold text-emerald-400">{(plan.projectedRevenue / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-slate-600">Revenue</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-xs font-bold text-slate-300">{new Date(plan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          <p className="text-[10px] text-slate-600">Created</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Link to={`/plans/${plan._id}`} className="btn-primary text-xs flex-1 justify-center py-2">
          <Eye className="w-3.5 h-3.5" /> View Plan
        </Link>
        <button
          onClick={() => onToggleFavorite?.(plan._id)}
          title={plan.isFavorited ? "Remove from favorites" : "Save to favorites"}
          className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
            plan.isFavorited
              ? "border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/15"
              : "btn-secondary px-3 py-2"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${plan.isFavorited ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={() => onDelete(plan._id)}
          disabled={isDeleting}
          className="btn-danger text-xs px-3 py-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export { PlanCard };

export default function Plans() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/business-plans").then((r) => r.data.data)
  });

  const { mutate: deletePlan } = useMutation({
    mutationFn: (id) => api.delete(`/business-plans/${id}`),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success("Plan deleted");
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["favorite-plans"]);
      queryClient.invalidateQueries(["dashboard-stats"]);
    },
    onError: () => toast.error("Failed to delete plan"),
    onSettled: () => setDeletingId(null)
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (id) => api.post(`/business-plans/${id}/favorite`),
    onSuccess: (res, id) => {
      const favorited = res.data.isFavorited;
      toast.success(favorited ? "Saved to favorites" : "Removed from favorites");
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["favorite-plans"]);
      queryClient.invalidateQueries(["plan", id]);
    },
    onError: () => toast.error("Failed to update favorite")
  });

  const plans = data || [];
  const filtered = plans.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.title?.toLowerCase().includes(q) || p.businessIdea?.name?.toLowerCase().includes(q) || p.businessIdea?.category?.toLowerCase().includes(q));
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Business Plans"
        subtitle={`${plans.length} plan${plans.length !== 1 ? "s" : ""} generated`}
        badge="My Plans"
        actions={
          <div className="flex gap-2">
            <button onClick={() => setView("grid")} className={`p-2 rounded-lg border transition-colors ${view === "grid" ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "btn-secondary p-2"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-lg border transition-colors ${view === "list" ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "btn-secondary p-2"}`}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plans by name, category..."
          className="input-base pl-10"
        />
      </div>

      {isLoading ? (
        <div className={view === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? "No plans match your search" : "No business plans yet"}
          description={search ? "Try a different search term." : "Go to Recommendations to generate your first AI-powered business plan."}
          action={
            !search && (
              <Link to="/recommendations" className="btn-primary text-sm">
                <Zap className="w-4 h-4" /> Get Recommendations
              </Link>
            )
          }
        />
      ) : (
        <motion.div layout className={view === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
          <AnimatePresence mode="popLayout">
            {filtered.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                view={view}
                onDelete={deletePlan}
                isDeleting={deletingId === plan._id}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
