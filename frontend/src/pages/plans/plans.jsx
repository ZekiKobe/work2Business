import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../api/axios";
import toast from "react-hot-toast";

import PlanCard from "../../components/plans/PlanCard";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");

  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        setLoading(true);

        const res = await api.get("/business-plans");

        console.log("PLANS RESPONSE:", res.data);

        if (!mounted) return;

        const data = res.data?.data;

        setPlans(Array.isArray(data) ? data : []);

      } catch {
        if (mounted) toast.error("Failed to load plans");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  const deletePlan = async (id) => {
    try {
      await api.delete(`/business-plans/${id}`);

      toast.success("Plan deleted");

      setPlans(prev => prev.filter(p => p._id !== id));

    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];

    return plans.filter(plan => {
      const text =
        plan.title ||
        plan.businessIdea?.name ||
        plan.executiveSummary ||
        "";

      return text.toLowerCase().includes(search.toLowerCase());
    });
  }, [plans, search]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-1">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">E2B Business Plans</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all your enterprise-extracted business roadmaps
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blueprints..."
              className="px-4 py-2 bg-slate-900 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-lg w-full sm:w-64 text-sm text-slate-200 placeholder-slate-500 transition-colors"
            />

            <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-900">
              <button
                onClick={() => setView("list")}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  view === "list" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                List
              </button>

              <button
                onClick={() => setView("grid")}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  view === "grid" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* LOADING SKELETONS */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-16 bg-slate-900/40 border border-slate-900/60 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredPlans.length === 0 && (
          <div className="text-center py-20 border border-slate-900 rounded-2xl bg-slate-900/10 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-slate-300">
              No plan architectures found
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Generate a new venture plan from your recommendations profile to initialize your stack.
            </p>
          </div>
        )}

        {/* LIST VIEW */}
        {!loading && view === "list" && filteredPlans.length > 0 && (
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
            {filteredPlans.map((plan, index) => (
              <div
                key={plan._id}
                className={`flex flex-col md:grid md:grid-cols-3 items-center gap-4 p-5 hover:bg-slate-900/40 transition-colors ${
                  index !== 0 ? "border-t border-slate-900" : ""
                }`}
              >
                {/* TITLE & SUMMARY */}
                <div className="w-full">
                  <h3 className="font-semibold text-white tracking-tight text-sm sm:text-base">
                    {plan.title || plan.businessIdea?.name || "Business Blueprint"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {plan.executiveSummary || "AI Transition Blueprint Dynamic Generation Asset"}
                  </p>
                </div>

                {/* ORIGIN SOURCE BADGES */}
                <div className="w-full flex md:justify-start">
                  <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                    (plan.source || "ai") === "ai"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-slate-800/40 text-slate-400 border-slate-800"
                  }`}>
                    {(plan.source || "ai") === "ai" ? "AI Generated Asset" : "Manual Integration"}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="w-full flex gap-2 md:justify-end">
                  <a
                    href={`/plans/${plan._id}`}
                    className="px-3 py-1.5 text-xs font-medium border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
                  >
                    View Stack
                  </a>
                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && view === "grid" && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onDelete={deletePlan}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}