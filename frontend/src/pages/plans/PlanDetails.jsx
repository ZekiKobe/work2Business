import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";

export default function PlanDetails() {
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPlan = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const res = await api.get(`/business-plans/${id}`);

        if (isMounted) {
          setPlan(res.data.data);
        }
      } catch {
        if (isMounted) {
          toast.error("Failed to load plan structure");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ✅ DARK MODE RECURSIVE RENDERER
  const renderContent = (data) => {
    if (data === null || data === undefined) return null;

    // STRING
    if (typeof data === "string") {
      return (
        <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
          {data}
        </p>
      );
    }

    // NUMBER
    if (typeof data === "number") {
      return (
        <span className="text-blue-400 font-mono font-bold text-lg">
          {data.toLocaleString()}
        </span>
      );
    }

    // ARRAY
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3 w-full">
          {data.map((item, i) => (
            <div
              key={i}
              className="p-4 border border-slate-800/60 bg-slate-900/30 rounded-xl"
            >
              {typeof item === "object"
                ? renderContent(item)
                : (
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item}
                  </p>
                )}
            </div>
          ))}
        </div>
      );
    }

    // OBJECT
    if (typeof data === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-slate-900/50 rounded-xl border border-slate-900 flex flex-col gap-1.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>

              <div className="text-slate-200">
                {renderContent(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // LOADING STATE
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-950 text-slate-400 p-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
            <span className="text-sm font-medium tracking-wide">Compiling blueprint data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // NOT FOUND
  if (!plan) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-950 text-slate-500 p-6 flex flex-col items-center justify-center">
          <p className="text-sm font-medium">Venture blueprint map code signature not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-1">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {plan.title || "Untitled Venture Strategy"}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mt-2">
            E2B Strategic Transition Blueprint Asset
          </p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6 max-w-6xl">

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Executive Summary
            </h2>
            {renderContent(plan.executiveSummary)}
          </Card>

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Market Analysis & Target Gaps
            </h2>
            {renderContent(plan.marketAnalysis)}
          </Card>

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Business Model Engine
            </h2>
            {renderContent(plan.businessModel)}
          </Card>

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Marketing & User Acquisition Strategy
            </h2>
            {renderContent(plan.marketingStrategy)}
          </Card>

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Financial Modeling & Projections
            </h2>
            {renderContent(plan.financialPlan)}
          </Card>

          <Card className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-tight border-b border-slate-900 pb-3">
              Risk Mitigation & Feasibility Metrics
            </h2>
            {renderContent(plan.riskAnalysis)}
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}