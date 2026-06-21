import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RecommendationCard({
  item,
  onGeneratePlan
}) {
  return (
    <Card className="space-y-3">

      <div className="flex justify-between items-start">

        <h2 className="text-lg font-bold">
          {item.name}
        </h2>

        <div
          className="
          px-3 py-1
          rounded-full
          text-sm
          bg-blue-100
          text-blue-700
          "
        >
          {item.score}%
        </div>

      </div>

      <p className="text-sm text-gray-500">
        {item.category}
      </p>

      <p className="text-sm">
        {item.reason}
      </p>

      <div className="flex gap-2 mt-4">

        <Button
          onClick={() =>
            onGeneratePlan(item.id)
          }
        >
          Generate AI Plan
        </Button>

      </div>

    </Card>
  );
}