import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ArrowLeft, Zap, Wrench, ChevronDown, FileText, TrendingUp, DollarSign,
  BarChart3, Megaphone, Shield, Rocket, Target, Calendar, Trash2, Share2,
  Download, CheckCircle2, AlertTriangle, Heart
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { SkeletonCard } from "../../components/common/Skeleton";
import api from "../../api/axios";

const SECTIONS = [
  { key: "executiveSummary", label: "Executive Summary", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { key: "marketAnalysis", label: "Market Analysis", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { key: "businessModel", label: "Business Model", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { key: "financialPlan", label: "Financial Plan", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { key: "marketingStrategy", label: "Marketing Strategy", icon: Megaphone, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { key: "operationalPlan", label: "90-Day Launch Roadmap", icon: Rocket, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { key: "riskAnalysis", label: "Risk Analysis", icon: Shield, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }
];

function SectionContent({ content }) {
  if (!content) return <p className="text-slate-500 text-sm italic">No content available</p>;

  if (typeof content === "string") {
    return (
      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  if (typeof content === "object") {
    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
            {Array.isArray(value) ? (
              <ul className="space-y-1.5">
                {value.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">{String(value)}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function AccordionSection({ section, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;

  if (!content) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/30 transition-colors text-left"
      >
        <div className={`p-2 border rounded-xl shrink-0 ${section.bg}`}>
          <Icon className={`w-4 h-4 ${section.color}`} />
        </div>
        <span className="flex-1 font-semibold text-white text-sm">{section.label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-800/60">
              <SectionContent content={content} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => api.get(`/business-plans/${id}`).then((r) => r.data.data)
  });

  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/business-plans/${id}`),
    onSuccess: () => {
      toast.success("Plan deleted");
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["favorite-plans"]);
      navigate("/plans");
    },
    onError: () => toast.error("Failed to delete plan")
  });

  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useMutation({
    mutationFn: () => api.post(`/business-plans/${id}/favorite`),
    onSuccess: (res) => {
      const favorited = res.data.isFavorited;
      toast.success(favorited ? "Saved to favorites" : "Removed from favorites");
      queryClient.invalidateQueries(["plan", id]);
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["favorite-plans"]);
    },
    onError: () => toast.error("Failed to update favorite")
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const planContentRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    if (!planContentRef.current) return;
    setIsExporting(true);
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const element = planContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#080d1a",
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const margin = 10;
      const usableHeight = pageHeight - margin * 2;

      let y = margin;
      let remaining = imgHeight;
      let srcY = 0;

      while (remaining > 0) {
        const sliceHeight = Math.min(usableHeight, remaining);
        const srcSliceH = (sliceHeight / imgHeight) * canvas.height;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcSliceH;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceH, 0, 0, canvas.width, srcSliceH);

        const sliceData = sliceCanvas.toDataURL("image/png");
        if (srcY > 0) {
          pdf.addPage();
          y = margin;
        }
        pdf.addImage(sliceData, "PNG", 0, y, imgWidth, sliceHeight);

        srcY += srcSliceH;
        remaining -= sliceHeight;
      }

      const filename = (data?.title || "business-plan").replace(/[^a-z0-9]/gi, "-").toLowerCase();
      pdf.save(`${filename}.pdf`);
      toast.success("PDF downloaded!", { id: "pdf" });
    } catch (err) {
      toast.error("Failed to generate PDF", { id: "pdf" });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Plan not found</h3>
          <p className="text-slate-400 text-sm mb-6">This plan may have been deleted or doesn't belong to your account.</p>
          <Link to="/plans" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Back to Plans</Link>
        </div>
      </DashboardLayout>
    );
  }

  const idea = data.businessIdea;
  const isAI = data.source === "AI";
  const riskStyle = { LOW: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/25", HIGH: "text-red-400 bg-red-500/10 border-red-500/25" }[idea?.riskLevel] || "text-slate-400 bg-slate-800 border-slate-700";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto" ref={planContentRef}>
        {/* Back nav */}
        <Link to="/plans" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </Link>

        {/* Header card */}
        <div className="glass rounded-2xl p-6 mb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border shrink-0 ${isAI ? "bg-indigo-500/10 border-indigo-500/20" : "bg-slate-800 border-slate-700"}`}>
                {isAI ? <Zap className="w-5 h-5 text-indigo-400" /> : <Wrench className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAI ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
                    {isAI ? "AI Generated" : "Manual"}
                  </span>
                  {idea?.riskLevel && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskStyle}`}>{idea.riskLevel} Risk</span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-white">{data.title || idea?.name || "Business Plan"}</h1>
                <p className="text-sm text-slate-400 mt-1">{idea?.category} • Created {new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleFavorite()}
                disabled={isTogglingFavorite}
                title={data.isFavorited ? "Remove from favorites" : "Save to favorites"}
                className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                  data.isFavorited
                    ? "border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/15"
                    : "btn-secondary px-3 py-2"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${data.isFavorited ? "fill-current" : ""}`} />
              </button>
              <button onClick={handleShare} className="btn-secondary text-xs px-3 py-2">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button onClick={handleDownloadPDF} disabled={isExporting} className="btn-secondary text-xs px-3 py-2">
                <Download className="w-3.5 h-3.5" /> {isExporting ? "Exporting..." : "PDF"}
              </button>
              <button onClick={() => deletePlan()} disabled={isDeleting} className="btn-danger text-xs px-3 py-2">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Key metrics */}
          {(data.successProbability > 0 || data.projectedRevenue > 0 || data.projectedProfit > 0 || data.initialCapital > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800/60">
              {data.successProbability > 0 && (
                <div className="text-center p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                  <p className="text-lg font-bold text-indigo-400">{data.successProbability}%</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Success Probability</p>
                </div>
              )}
              {data.initialCapital > 0 && (
                <div className="text-center p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl">
                  <p className="text-lg font-bold text-white">{(data.initialCapital / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Initial Capital (ETB)</p>
                </div>
              )}
              {data.projectedRevenue > 0 && (
                <div className="text-center p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <p className="text-lg font-bold text-emerald-400">{(data.projectedRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Projected Revenue (ETB)</p>
                </div>
              )}
              {data.projectedProfit > 0 && (
                <div className="text-center p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <p className="text-lg font-bold text-amber-400">{(data.projectedProfit / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Projected Profit (ETB)</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan sections */}
        <div className="space-y-3">
          {SECTIONS.map((section, i) => (
            <AccordionSection
              key={section.key}
              section={section}
              content={data[section.key]}
              defaultOpen={i === 0}
            />
          ))}

          {/* Key milestones */}
          {data.keyMilestones && Array.isArray(data.keyMilestones) && data.keyMilestones.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 border rounded-xl bg-teal-500/10 border-teal-500/20">
                  <Target className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Key Milestones</h3>
              </div>
              <div className="relative pl-4 border-l-2 border-slate-800 space-y-4">
                {data.keyMilestones.map((milestone, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-300 ml-2">{milestone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {data.recommendation && (
            <div className="glass rounded-2xl p-5 border-indigo-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 border rounded-xl bg-indigo-500/10 border-indigo-500/20">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Final Recommendation</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{data.recommendation}"</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
