import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate();

  const title =
    plan.title ||
    plan.businessIdea?.name ||
    "Business Plan";

  const summary =
    plan.summary ||
    plan.executiveSummary ||
    "No summary available";

  return (
    <Card className="space-y-3 hover:shadow-md transition">

      {/* TITLE */}
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      {/* DATE */}
      <p className="text-sm text-gray-500">
        Created:{" "}
        {plan.createdAt
          ? new Date(plan.createdAt).toLocaleDateString()
          : "Unknown"}
      </p>

      {/* SUMMARY */}
      <p className="text-sm text-gray-700 line-clamp-3">
        {typeof summary === "string"
          ? summary
          : "AI Generated Business Plan"}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">

        <Button
          onClick={() =>
            navigate(`/plans/${plan._id}`)
          }
        >
          View
        </Button>

        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => onDelete(plan._id)}
        >
          Delete
        </Button>

      </div>

    </Card>
  );
}