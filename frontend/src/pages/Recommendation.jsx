import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Recommendations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/recommendations");
      setData(res.data.data);
    };

    fetchData();
  }, []);

  const generatePlan = async (ideaId) => {
    await api.post("/ai/business-plan", { ideaId });
    alert("Business plan generated!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Recommendations
      </h1>

      {data.map((item) => (
        <div key={item.id} className="border p-4 mb-3">
          <h2 className="font-bold">{item.name}</h2>
          <p>Score: {item.score}</p>
          <p>{item.reason}</p>

          <button
            className="bg-green-500 text-white p-2 mt-2"
            onClick={() => generatePlan(item.id)}
          >
            Generate AI Plan
          </button>
        </div>
      ))}
    </div>
  );
}