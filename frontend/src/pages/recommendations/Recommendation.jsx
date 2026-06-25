import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Lightbulb, Filter, SortAsc, X, ChevronDown, Zap, Clock, DollarSign,
  TrendingUp, CheckCircle2, AlertTriangle, Info, ArrowRight, Search
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/Skeleton";
import api from "../../api/axios";

const RISK_COLORS = {
  LOW: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" },
  MEDIUM: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25" },
  HIGH: { text: "text-red-400", bg: "bg-red-500/10 border-red-500/25" }
};

function ScoreRing({ score }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#6366f1";

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} strokeWidth="5" stroke="#1e293b" fill="none" />
        <circle cx="32" cy="32" r={radius} strokeWidth="5" stroke={color} fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-white">{score}%</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, max, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-400 font-medium">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function RecommendationCard({ idea, onGenerate, isGenerating }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const risk = RISK_COLORS[idea.riskLevel] || RISK_COLORS.MEDIUM;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="glass rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <ScoreRing score={idea.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-white text-sm leading-tight">{idea.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-500">{idea.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text}`}>{idea.riskLevel} Risk</span>
                {idea.successRate && (
                  <span className="text-[10px] text-slate-500">{idea.successRate}% success rate</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{idea.description}</p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/60">
        <div className="text-center">
          <p className="text-xs font-bold text-white">{(idea.minimumCapital / 1000).toFixed(0)}K ETB</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Min Capital</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-white">{idea.timeToProfit || 6} mo</p>
          <p className="text-[10px] text-slate-500 mt-0.5">To Profit</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-emerald-400">{(idea.expectedProfit / 1000).toFixed(0)}K ETB</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Annual Profit</p>
        </div>
      </div>

      {/* Match reasons */}
      {idea.reasons && idea.reasons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {idea.reasons.slice(0, 3).map((r, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800/60 border border-slate-700/50 text-slate-400 rounded-full">{r}</span>
          ))}
        </div>
      )}

      {/* Score breakdown toggle */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
      >
        <Info className="w-3 h-3" />
        {showBreakdown ? "Hide" : "Show"} score breakdown
        <ChevronDown className={`w-3 h-3 transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {showBreakdown && idea.breakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-slate-800/40 rounded-xl space-y-2"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Why {idea.score}% match</p>
            <BreakdownBar label="Capital Match" value={idea.breakdown.capital} max={30} color="bg-blue-500" />
            <BreakdownBar label="Skill Match" value={idea.breakdown.skills} max={25} color="bg-purple-500" />
            <BreakdownBar label="Interest Alignment" value={idea.breakdown.interest} max={20} color="bg-pink-500" />
            <BreakdownBar label="Hours Availability" value={idea.breakdown.hours} max={10} color="bg-emerald-500" />
            <BreakdownBar label="Salary Replacement" value={idea.breakdown.salaryReplacement} max={10} color="bg-amber-500" />
            <BreakdownBar label="Risk Alignment" value={idea.breakdown.risk} max={5} color="bg-indigo-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(idea.requiredSkills || []).slice(0, 3).map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">{s}</span>
          ))}
        </div>
        <button
          onClick={() => onGenerate(idea.id)}
          disabled={isGenerating}
          className="btn-primary text-xs px-4 py-2 shrink-0"
        >
          {isGenerating ? (
            <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</>
          ) : (
            <><Zap className="w-3 h-3" /> Generate Plan</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0 });
  const [sort, setSort] = useState("score");
  const [showFilters, setShowFilters] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.get("/recommendations").then((r) => r.data.data)
  });

  const { mutate: generatePlan } = useMutation({
    mutationFn: (ideaId) => api.post("/ai/business-plan", { ideaId }),
    onMutate: (ideaId) => setGeneratingId(ideaId),
    onSuccess: (res) => {
      toast.success("Business plan generated successfully!");
      queryClient.invalidateQueries(["plans"]);
      navigate(`/plans/${res.data.data._id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to generate plan");
    },
    onSettled: () => setGeneratingId(null)
  });

  const ideas = data || [];
  const categories = ["ALL", ...new Set(ideas.map((i) => i.category))];

  const filtered = useMemo(() => {
    let result = ideas.filter((idea) => {
      if (search && !idea.name.toLowerCase().includes(search.toLowerCase()) && !idea.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.risk !== "ALL" && idea.riskLevel !== filters.risk) return false;
      if (filters.maxCapital && idea.minimumCapital > Number(filters.maxCapital)) return false;
      if (filters.category !== "ALL" && idea.category !== filters.category) return false;
      if (idea.score < filters.minScore) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "capital") return a.minimumCapital - b.minimumCapital;
      if (sort === "profit") return b.expectedProfit - a.expectedProfit;
      if (sort === "risk") return ["LOW", "MEDIUM", "HIGH"].indexOf(a.riskLevel) - ["LOW", "MEDIUM", "HIGH"].indexOf(b.riskLevel);
      return 0;
    });

    return result;
  }, [ideas, search, filters, sort]);

  const activeFilterCount = [filters.risk !== "ALL", filters.maxCapital, filters.category !== "ALL", filters.minScore > 0].filter(Boolean).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Business Recommendations"
        subtitle={`${filtered.length} opportunities matched to your profile`}
        badge="AI-Powered Matching"
        actions={
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary text-xs ${activeFilterCount > 0 ? "border-indigo-500/40 text-indigo-300" : ""}`}>
            <Filter className="w-3.5 h-3.5" />
            Filters {activeFilterCount > 0 && <span className="bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
          </button>
        }
      />

      {/* Search + Sort bar */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="input-base pl-10 text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-base w-auto text-sm pr-8"
        >
          <option value="score">Sort: Best Match</option>
          <option value="capital">Sort: Lowest Capital</option>
          <option value="profit">Sort: Highest Profit</option>
          <option value="risk">Sort: Lowest Risk</option>
        </select>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Risk Level</label>
                <select value={filters.risk} onChange={(e) => setFilters({ ...filters, risk: e.target.value })} className="input-base text-sm">
                  <option value="ALL">All Risks</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input-base text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Capital (ETB)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={filters.maxCapital}
                  onChange={(e) => setFilters({ ...filters, maxCapital: e.target.value })}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Match Score: {filters.minScore}%</label>
                <input
                  type="range" min="0" max="100" step="5"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
              <button
                onClick={() => setFilters({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0 })}
                className="sm:col-span-2 lg:col-span-4 btn-secondary text-xs justify-center"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ideas grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No matching ideas"
          description="Try adjusting your filters or complete your profile for better recommendations."
          action={<button onClick={() => { setFilters({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0 }); setSearch(""); }} className="btn-secondary text-sm">Clear filters</button>}
        />
      ) : (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((idea) => (
              <RecommendationCard
                key={idea.id}
                idea={idea}
                onGenerate={generatePlan}
                isGenerating={generatingId === idea.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* AI plan generation loading overlay */}
      <AnimatePresence>
        {generatingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080d1a]/80 backdrop-blur-sm"
          >
            <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Generating your plan...</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                AI is analyzing your profile and writing a personalized business plan. This takes 15–30 seconds.
              </p>
              <div className="space-y-2">
                {["Analyzing your profile", "Researching market", "Writing business plan"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
