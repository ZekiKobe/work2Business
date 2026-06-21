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
          toast.error("Failed to load plan");
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

  // ✅ CLEAN RECURSIVE RENDERER (FIXED)
  const renderContent = (data) => {
    if (data === null || data === undefined) return null;

    // STRING
    if (typeof data === "string") {
      return (
        <p className="text-gray-700 whitespace-pre-wrap">
          {data}
        </p>
      );
    }

    // NUMBER
    if (typeof data === "number") {
      return (
        <span className="text-gray-900 font-bold text-lg">
          {data}
        </span>
      );
    }

    // ARRAY
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="p-3 border rounded-lg bg-gray-50"
            >
              {typeof item === "object"
                ? renderContent(item)
                : (
                  <p className="text-gray-700">
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
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded-xl border"
            >
              <p className="text-sm text-gray-500 capitalize mb-1">
                {key.replace(/([A-Z])/g, " $1")}
              </p>

              <div className="text-gray-800">
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
        <p className="p-6">Loading...</p>
      </DashboardLayout>
    );
  }

  // NOT FOUND
  if (!plan) {
    return (
      <DashboardLayout>
        <p className="p-6 text-gray-500">Plan not found</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {plan.title}
        </h1>

        <p className="text-gray-500 mt-1">
          AI Generated Business Plan
        </p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-6">

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Executive Summary
          </h2>
          {renderContent(plan.executiveSummary)}
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Market Analysis
          </h2>
          {renderContent(plan.marketAnalysis)}
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Business Model
          </h2>
          {renderContent(plan.businessModel)}
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Marketing Strategy
          </h2>
          {renderContent(plan.marketingStrategy)}
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Financial Plan
          </h2>
          {renderContent(plan.financialPlan)}
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-3">
            Risk Analysis
          </h2>
          {renderContent(plan.riskAnalysis)}
        </Card>

      </div>
    </DashboardLayout>
  );
}