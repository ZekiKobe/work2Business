import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../api/axios";

import RecommendationCard from "../../components/recommendations/RecommendationCard";
import RecommendationFilters from "../../components/recommendations/RecommendationFilters";

import toast from "react-hot-toast";

export default function Recommendations() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    risk: "",
    maxCapital: "",
    category: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/recommendations"
      );

      setData(res.data.data);

    } catch (err) {
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) => {
      if (
        filters.risk &&
        item.riskLevel !== filters.risk
      ) {
        return false;
      }

      if (
        filters.maxCapital &&
        item.minimumCapital >
          Number(filters.maxCapital)
      ) {
        return false;
      }

      if (
        filters.category &&
        !item.category
          .toLowerCase()
          .includes(
            filters.category.toLowerCase()
          )
      ) {
        return false;
      }

      return true;
    }
  );

  const generatePlan = async (ideaId) => {
    try {
      await api.post(
        "/ai/business-plan",
        {
          ideaId
        }
      );

      toast.success(
        "Business plan generated!"
      );

    } catch (err) {
      toast.error("Failed to generate plan");
    }
  };

  return (
    <DashboardLayout>

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Recommendations
        </h1>

        <p className="text-gray-500">
          AI-powered business opportunities
        </p>

      </div>

      <RecommendationFilters
        filters={filters}
        setFilters={setFilters}
      />

      {loading ? (
        <div className="text-center p-10">
          Loading recommendations...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No recommendations found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredData.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              onGeneratePlan={
                generatePlan
              }
            />
          ))}

        </div>
      )}

    </DashboardLayout>
  );
}