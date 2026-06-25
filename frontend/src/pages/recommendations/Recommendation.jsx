import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Lightbulb, Filter, X, Zap, Info, Search, BookMarked, BookmarkCheck,
  GitCompare, Wand2, ChevronDown, CheckCircle2, AlertCircle, ExternalLink
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/Skeleton";
import api from "../../api/axios";

// ─── Shared helpers ──────────────────────────────────────────────────────────

const RISK_COLORS = {
  LOW: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" },
  MEDIUM: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25" },
  HIGH: { text: "text-red-400", bg: "bg-red-500/10 border-red-500/25" }
};

function ScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#6366f1";
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} strokeWidth="5" stroke="#1e293b" fill="none" />
        <circle cx="32" cy="32" r={r} strokeWidth="5" stroke={color} fill="none"
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

// ─── Skill Gap Modal ──────────────────────────────────────────────────────────

function SkillGapModal({ idea, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ["skill-gap", idea.id],
    queryFn: () => api.get(`/business-ideas/${idea.id}/skill-gap`).then(r => r.data),
    staleTime: 1000 * 60 * 5
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080d1a]/85 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">Skill Gap Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">{idea.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800/60 animate-pulse rounded-xl" />)}
          </div>
        ) : data ? (
          <>
            {/* Coverage bar */}
            <div className="mb-5 p-3 bg-slate-800/40 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Skill Coverage</span>
                <span className={`text-xs font-bold ${data.coveragePercent >= 70 ? "text-emerald-400" : data.coveragePercent >= 40 ? "text-amber-400" : "text-red-400"}`}>
                  {data.coveragePercent}% ({data.matched?.length}/{data.totalRequired} skills)
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${data.coveragePercent >= 70 ? "bg-emerald-500" : data.coveragePercent >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${data.coveragePercent}%` }}
                />
              </div>
            </div>

            {/* Matched skills */}
            {data.matched?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You already have ({data.matched.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.matched.map(s => (
                    <span key={s} className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {data.missing?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Skills to develop ({data.missing.length})
                </p>
                <div className="space-y-2.5">
                  {data.missing.map(item => (
                    <div key={item.skill} className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
                      <span className="text-sm text-white font-medium">{item.skill}</span>
                      {item.resource && (
                        <a
                          href={item.resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          {item.resource.platform} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.totalRequired === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No required skills defined for this idea yet.</p>
            )}
          </>
        ) : (
          <p className="text-sm text-red-400 text-center py-4">Failed to load skill gap data.</p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── AI Names Modal ───────────────────────────────────────────────────────────

function NamesModal({ idea, onClose }) {
  const [names, setNames] = useState(null);
  const [copied, setCopied] = useState(null);

  const { mutate: generate, isLoading } = useMutation({
    mutationFn: () => api.post("/ai/business-names", { ideaId: idea.id }).then(r => r.data.names),
    onSuccess: (data) => setNames(data),
    onError: () => toast.error("Failed to generate names. Try again.")
  });

  const copyName = (name) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
    toast.success(`"${name}" copied!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080d1a]/85 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-sm glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2"><Wand2 className="w-4 h-4 text-pink-400" />Business Name Generator</h3>
            <p className="text-xs text-slate-500 mt-0.5">{idea.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!names ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              AI will generate 5 unique, brandable business names tailored to this idea and your background.
            </p>
            <button
              onClick={() => generate()}
              disabled={isLoading}
              className="btn-primary w-full justify-center"
            >
              {isLoading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Generating names...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate 5 Names</>
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 mb-4">
              {names.map((name, i) => (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => copyName(name)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl transition-all group"
                >
                  <span className="text-sm font-semibold text-white">{name}</span>
                  <span className={`text-[10px] transition-colors ${copied === name ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {copied === name ? "Copied!" : "Click to copy"}
                  </span>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => { setNames(null); generate(); }}
              className="btn-secondary text-xs w-full justify-center"
            >
              <Wand2 className="w-3.5 h-3.5" /> Generate more
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Compare Drawer ───────────────────────────────────────────────────────────

function CompareRow({ label, a, b, higherIsBetter = true }) {
  const aNum = typeof a === "number" ? a : null;
  const bNum = typeof b === "number" ? b : null;
  const aWins = aNum !== null && bNum !== null && (higherIsBetter ? aNum > bNum : aNum < bNum);
  const bWins = aNum !== null && bNum !== null && (higherIsBetter ? bNum > aNum : bNum < aNum);

  return (
    <tr className="border-t border-slate-800/40">
      <td className="py-3 pr-4 text-xs text-slate-300 font-medium w-1/3">{label}</td>
      <td className={`py-3 pr-4 text-xs font-semibold text-center ${aWins ? "text-emerald-400" : "text-slate-300"}`}>{a}</td>
      <td className={`py-3 text-xs font-semibold text-center ${bWins ? "text-emerald-400" : "text-slate-300"}`}>{b}</td>
    </tr>
  );
}

function CompareDrawer({ ideaA, ideaB, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ["compare", ideaA.id, ideaB.id],
    queryFn: () => api.post("/business-ideas/compare", { ideaIdA: ideaA.id, ideaIdB: ideaB.id }).then(r => r.data),
    staleTime: 1000 * 60 * 10
  });

  const a = data?.ideaA || ideaA;
  const b = data?.ideaB || ideaB;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#080d1a]/85 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-2xl glass rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white flex items-center gap-2"><GitCompare className="w-4 h-4 text-cyan-400" />Side-by-Side Comparison</h3>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-10 bg-slate-800 animate-pulse rounded-xl" />)}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-3 text-left text-xs text-slate-500 font-medium w-1/3">Metric</th>
                <th className="pb-3 text-center text-xs text-white font-bold">{a.name}</th>
                <th className="pb-3 text-center text-xs text-white font-bold">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Match Score" a={`${ideaA.score || 0}%`} b={`${ideaB.score || 0}%`} />
              <CompareRow label="Min Capital" a={`${(a.minimumCapital/1000).toFixed(0)}K ETB`} b={`${(b.minimumCapital/1000).toFixed(0)}K ETB`} higherIsBetter={false} />
              <CompareRow label="Annual Profit" a={`${(a.expectedProfit/1000).toFixed(0)}K ETB`} b={`${(b.expectedProfit/1000).toFixed(0)}K ETB`} />
              <CompareRow label="Months to Profit" a={a.timeToProfit || 6} b={b.timeToProfit || 6} higherIsBetter={false} />
              <CompareRow label="Hrs/Week Required" a={a.hoursRequiredPerWeek || 20} b={b.hoursRequiredPerWeek || 20} higherIsBetter={false} />
              <CompareRow label="Success Rate" a={`${a.successRate || 70}%`} b={`${b.successRate || 70}%`} />
              <CompareRow label="Risk Level" a={a.riskLevel} b={b.riskLevel} />
              <CompareRow label="Category" a={a.category} b={b.category} />
            </tbody>
          </table>
        )}

        {/* Skills comparison */}
        {!isLoading && (
          <div className="mt-5 pt-5 border-t border-slate-800/40 grid grid-cols-2 gap-4">
            {[a, b].map((idea) => (
              <div key={idea._id || idea.id}>
                <p className="text-xs font-bold text-slate-400 mb-2">{idea.name} — Skills</p>
                <div className="flex flex-wrap gap-1">
                  {(idea.requiredSkills || []).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

function IdeaCard({ idea, onGenerate, isGenerating, isFavorited, onToggleFavorite, onSkillGap, onNames, isSelectedForCompare, onToggleCompare, compareCount }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const risk = RISK_COLORS[idea.riskLevel] || RISK_COLORS.MEDIUM;
  const canCompare = isSelectedForCompare || compareCount < 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`glass rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-300 group relative ${isSelectedForCompare ? "ring-2 ring-cyan-500/50" : ""}`}
    >
      {/* Compare badge */}
      {isSelectedForCompare && (
        <div className="absolute -top-2.5 left-3 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold rounded-full">
          Selected for compare
        </div>
      )}

      <div className="flex items-start gap-4">
        <ScoreRing score={idea.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate">{idea.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-500">{idea.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text}`}>{idea.riskLevel} Risk</span>
              </div>
            </div>
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(idea.id)}
              title={isFavorited ? "Remove from favorites" : "Save to favorites"}
              className={`p-1.5 rounded-lg transition-all shrink-0 ${isFavorited ? "text-amber-400 bg-amber-500/10" : "text-slate-600 hover:text-amber-400 hover:bg-amber-500/10"}`}
            >
              {isFavorited ? <BookmarkCheck className="w-4 h-4" /> : <BookMarked className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{idea.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/60">
        <div className="text-center">
          <p className="text-xs font-bold text-white">{(idea.minimumCapital/1000).toFixed(0)}K ETB</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Min Capital</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-white">{idea.timeToProfit || 6} mo</p>
          <p className="text-[10px] text-slate-500 mt-0.5">To Profit</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-emerald-400">{(idea.expectedProfit/1000).toFixed(0)}K ETB</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Annual Profit</p>
        </div>
      </div>

      {/* Match reasons */}
      {idea.reasons?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {idea.reasons.slice(0, 3).map((r, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800/60 border border-slate-700/50 text-slate-400 rounded-full">{r}</span>
          ))}
        </div>
      )}

      {/* Score breakdown */}
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
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-slate-800/40 rounded-xl space-y-2">
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

      {/* Action buttons row */}
      <div className="mt-4 pt-3 border-t border-slate-800/40 grid grid-cols-2 gap-2">
        <button onClick={() => onSkillGap(idea)}
          className="btn-secondary text-[10px] px-3 py-2 justify-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> Skill Gap
        </button>
        <button onClick={() => onNames(idea)}
          className="btn-secondary text-[10px] px-3 py-2 justify-center gap-1.5">
          <Wand2 className="w-3 h-3 text-pink-400" /> Name Ideas
        </button>
        <button
          onClick={() => canCompare && onToggleCompare(idea)}
          disabled={!canCompare && !isSelectedForCompare}
          className={`btn-secondary text-[10px] px-3 py-2 justify-center gap-1.5 ${isSelectedForCompare ? "border-cyan-500/40 text-cyan-400" : ""} ${!canCompare ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <GitCompare className="w-3 h-3 text-cyan-400" />{isSelectedForCompare ? "Deselect" : "Compare"}
        </button>
        <button
          onClick={() => onGenerate(idea.id)}
          disabled={isGenerating}
          className="btn-primary text-[10px] px-3 py-2 justify-center gap-1.5"
        >
          {isGenerating ? (
            <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
          ) : (
            <><Zap className="w-3 h-3" />AI Plan</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Recommendations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0, showFavorites: false });
  const [sort, setSort] = useState("score");
  const [showFilters, setShowFilters] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  const [skillGapIdea, setSkillGapIdea] = useState(null);
  const [namesIdea, setNamesIdea] = useState(null);
  const [compareSelection, setCompareSelection] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Fetch recommendations
  const { data, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.get("/recommendations").then((r) => r.data.data)
  });

  // Fetch favorites
  const { data: favData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get("/business-ideas/favorites").then(r => r.data.favorites || [])
  });

  const favIds = new Set((favData || []).map(f => f._id || f.id));

  // Toggle favorite
  const { mutate: toggleFav } = useMutation({
    mutationFn: (ideaId) => api.post(`/business-ideas/${ideaId}/favorite`),
    onSuccess: (res, ideaId) => {
      const isFav = res.data.isFavorited;
      toast.success(isFav ? "Saved to favorites" : "Removed from favorites");
      queryClient.invalidateQueries(["favorites"]);
    },
    onError: () => toast.error("Failed to update favorites")
  });

  // Generate plan
  const { mutate: generatePlan } = useMutation({
    mutationFn: (ideaId) => api.post("/ai/business-plan", { ideaId }),
    onMutate: (ideaId) => setGeneratingId(ideaId),
    onSuccess: (res) => {
      toast.success("Business plan generated!");
      queryClient.invalidateQueries(["plans"]);
      navigate(`/plans/${res.data.data._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to generate plan"),
    onSettled: () => setGeneratingId(null)
  });

  const ideas = data || [];
  const categories = ["ALL", ...new Set(ideas.map((i) => i.category))];

  const filtered = useMemo(() => {
    let result = ideas.filter((idea) => {
      if (filters.showFavorites && !favIds.has(idea.id)) return false;
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
  }, [ideas, search, filters, sort, favIds]);

  const activeFilterCount = [filters.risk !== "ALL", filters.maxCapital, filters.category !== "ALL", filters.minScore > 0, filters.showFavorites].filter(Boolean).length;

  const handleToggleCompare = (idea) => {
    setCompareSelection(prev => {
      if (prev.find(i => i.id === idea.id)) return prev.filter(i => i.id !== idea.id);
      if (prev.length >= 2) return prev;
      const next = [...prev, idea];
      if (next.length === 2) setShowCompare(true);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Business Recommendations"
        subtitle={`${filtered.length} opportunities matched to your profile`}
        badge="AI-Powered Matching"
        actions={
          <div className="flex gap-2">
            {compareSelection.length > 0 && (
              <button
                onClick={() => compareSelection.length === 2 ? setShowCompare(true) : toast("Select 2 ideas to compare", { icon: "ℹ️" })}
                className={`btn-secondary text-xs ${compareSelection.length === 2 ? "border-cyan-500/40 text-cyan-400" : ""}`}
              >
                <GitCompare className="w-3.5 h-3.5" /> Compare ({compareSelection.length}/2)
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary text-xs ${activeFilterCount > 0 ? "border-indigo-500/40 text-indigo-300" : ""}`}>
              <Filter className="w-3.5 h-3.5" />
              Filters {activeFilterCount > 0 && <span className="bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
            </button>
          </div>
        }
      />

      {/* Tabs: All / Favorites */}
      <div className="flex gap-1 mb-4 p-1 bg-slate-900/40 border border-slate-800/60 rounded-xl w-fit">
        {[
          { label: "All Ideas", active: !filters.showFavorites },
          { label: `Favorites (${favIds.size})`, active: filters.showFavorites }
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setFilters(f => ({ ...f, showFavorites: !f.showFavorites }))}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${tab.active ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or category..." className="input-base pl-10 text-sm" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-base w-auto text-sm pr-8">
          <option value="score">Sort: Best Match</option>
          <option value="capital">Sort: Lowest Capital</option>
          <option value="profit">Sort: Highest Profit</option>
          <option value="risk">Sort: Lowest Risk</option>
        </select>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
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
                <input type="number" placeholder="e.g. 50000" value={filters.maxCapital} onChange={(e) => setFilters({ ...filters, maxCapital: e.target.value })} className="input-base text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Score: {filters.minScore}%</label>
                <input type="range" min="0" max="100" step="5" value={filters.minScore} onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })} className="w-full accent-indigo-500" />
              </div>
              <button onClick={() => setFilters({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0, showFavorites: false })} className="sm:col-span-2 lg:col-span-4 btn-secondary text-xs justify-center">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ideas grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filters.showFavorites ? BookMarked : Lightbulb}
          title={filters.showFavorites ? "No favorites yet" : "No matching ideas"}
          description={filters.showFavorites ? "Save business ideas by clicking the bookmark icon on any card." : "Try adjusting your filters or complete your profile for better recommendations."}
          action={<button onClick={() => setFilters({ risk: "ALL", maxCapital: "", category: "ALL", minScore: 0, showFavorites: false })} className="btn-secondary text-sm">Clear filters</button>}
        />
      ) : (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onGenerate={generatePlan}
                isGenerating={generatingId === idea.id}
                isFavorited={favIds.has(idea.id)}
                onToggleFavorite={toggleFav}
                onSkillGap={setSkillGapIdea}
                onNames={setNamesIdea}
                isSelectedForCompare={compareSelection.some(i => i.id === idea.id)}
                onToggleCompare={handleToggleCompare}
                compareCount={compareSelection.length}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* AI generation loading overlay */}
      <AnimatePresence>
        {generatingId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080d1a]/80 backdrop-blur-sm">
            <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Generating your plan...</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">AI is analyzing your profile and writing a personalized business plan. Takes 15–30 seconds.</p>
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

      {/* Modals */}
      <AnimatePresence>
        {skillGapIdea && <SkillGapModal idea={skillGapIdea} onClose={() => setSkillGapIdea(null)} />}
        {namesIdea && <NamesModal idea={namesIdea} onClose={() => setNamesIdea(null)} />}
        {showCompare && compareSelection.length === 2 && (
          <CompareDrawer
            ideaA={compareSelection[0]}
            ideaB={compareSelection[1]}
            onClose={() => { setShowCompare(false); setCompareSelection([]); }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
