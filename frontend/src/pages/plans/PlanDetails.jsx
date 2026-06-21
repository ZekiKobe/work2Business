import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

import toast from "react-hot-toast";

import PlanSection from "../../components/plans/PlanSection";

export default function PlanDetails() {

  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/plans/${id}`
      );

      setPlan(res.data.data);

    } catch (err) {
      toast.error("Failed to load plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  if (!plan) {
    return (
      <DashboardLayout>
        <p>Plan not found</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          {plan.title}
        </h1>

        <p className="text-gray-500">
          Full AI Business Plan
        </p>

      </div>

      <PlanSection
        title="Executive Summary"
        content={plan.executiveSummary}
      />

      <PlanSection
        title="Market Analysis"
        content={plan.marketAnalysis}
      />

      <PlanSection
        title="Business Model"
        content={plan.businessModel}
      />

      <PlanSection
        title="Marketing Strategy"
        content={plan.marketingStrategy}
      />

      <PlanSection
        title="Financial Plan"
        content={plan.financialPlan}
      />

      <PlanSection
        title="Risk Analysis"
        content={plan.riskAnalysis}
      />

    </DashboardLayout>
  );
}