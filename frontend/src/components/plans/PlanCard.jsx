import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="space-y-3">

      <h2 className="text-xl font-bold">
        {plan.title}
      </h2>

      <p className="text-sm text-gray-500">
        Created: {new Date(plan.createdAt).toLocaleDateString()}
      </p>

      <p className="text-sm line-clamp-2">
        {plan.summary}
      </p>

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