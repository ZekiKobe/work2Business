import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Work2Business Dashboard
      </h1>

      <div className="mt-6 space-y-4">
        <Link to="/recommendations" className="block p-4 border">
          View Business Recommendations
        </Link>

        <Link to="/plans" className="block p-4 border">
          View Business Plans
        </Link>
      </div>
    </div>
  );
}