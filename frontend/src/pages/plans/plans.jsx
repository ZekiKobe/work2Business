import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../api/axios";
import toast from "react-hot-toast";

import PlanCard from "../../components/plans/PlanCard";

export default function Plans() {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        if (!mounted) return;
        setLoading(true);

        const res = await api.get("/business-plans");

        if (!mounted) return;
        setPlans(res.data.data);

      } catch {
        if (mounted) toast.error("Failed to load plans");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // call asynchronously inside effect body
    loadPlans();

    return () => { mounted = false; };
  }, []);

  const deletePlan = async (id) => {
    try {
      await api.delete(`/business-plans/${id}`);

      toast.success("Plan deleted");

      setPlans(
        plans.filter(p => p._id !== id)
      );

    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Business Plans
        </h1>
        <p className="text-gray-500">
          AI generated business strategies
        </p>
      </div>

      {loading ? (
        <p>Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-500">
          No plans generated yet
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map(plan => (
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