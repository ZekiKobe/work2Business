import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BusinessPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await api.get("/business-plans");
      setPlans(res.data.data);
    };

    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        My Business Plans
      </h1>

      {plans.map((plan) => (
        <div key={plan._id} className="border p-4 mb-3">
          <h2 className="font-bold">
            {plan.businessIdea?.name}
          </h2>

          <p className="mt-2">
            {plan.executiveSummary}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Risk: {plan.riskAnalysis}
          </p>
        </div>
      ))}
    </div>
  );
}