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

  // ✅ FIXED FILTER (uses real data fields)
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

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold">Business Plans</h1>
          <p className="text-gray-500">
            Manage all your generated and created plans
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="px-4 py-2 border rounded-lg w-full sm:w-64"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 border rounded-lg ${
                view === "list" ? "bg-black text-white" : ""
              }`}
            >
              List
            </button>

            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 border rounded-lg ${
                view === "grid" ? "bg-black text-white" : ""
              }`}
            >
              Cards
            </button>
          </div>

        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-16 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredPlans.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-white">
          <h3 className="text-lg font-semibold">
            No plans found
          </h3>
          <p className="text-gray-500 mt-2">
            Create a new business plan to get started
          </p>
        </div>
      )}

      {/* LIST VIEW */}
      {!loading && view === "list" && filteredPlans.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">

          {filteredPlans.map(plan => (
            <div
              key={plan._id}
              className="flex flex-col md:grid md:grid-cols-3 gap-2 p-4 border-t hover:bg-gray-50"
            >

              {/* TITLE */}
              <div>
                <h3 className="font-semibold">
                  {plan.title || plan.businessIdea?.name || "Business Plan"}
                </h3>

                <p className="text-sm text-gray-500">
                  {plan.executiveSummary?.slice(0, 60) || "AI Generated Plan"}
                </p>
              </div>

              {/* TYPE */}
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  (plan.source || "ai") === "ai"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {(plan.source || "ai") === "ai"
                    ? "AI Generated"
                    : "Manual"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 md:justify-end">

                <a
                  href={`/dashboard/plans/${plan._id}`}
                  className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                >
                  View
                </a>

                <button
                  onClick={() => deletePlan(plan._id)}
                  className="px-3 py-1 text-sm text-red-600 border rounded-lg hover:bg-red-50"
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

    </DashboardLayout>
  );
}