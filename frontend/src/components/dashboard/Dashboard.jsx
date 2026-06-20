import DashboardLayout
from "../../layouts/DashboardLayout";

import StatCard
from "../../components/dashboard/StatCard";

export default function Dashboard() {

  return (
    <DashboardLayout>

      <div
        className="
        mb-8
        "
      >

        <h1
          className="
          text-3xl
          font-bold
          "
        >
          Dashboard
        </h1>

        <p
          className="
          text-gray-500
          mt-2
          "
        >
          Welcome back
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        "
      >

        <StatCard
          title="Business Match Score"
          value="87%"
          subtitle="Excellent"
        />

        <StatCard
          title="Recommendations"
          value="14"
          subtitle="Available"
        />

        <StatCard
          title="Business Plans"
          value="5"
          subtitle="Generated"
        />

        <StatCard
          title="Funding Readiness"
          value="78%"
          subtitle="Good"
        />

      </div>

      <div
        className="
        grid
        lg:grid-cols-2
        gap-6
        mt-8
        "
      >

        <div
          className="
          bg-white
          rounded-2xl
          border
          p-6
          "
        >

          <h2
            className="
            font-bold
            text-lg
            mb-4
            "
          >
            Top Recommendations
          </h2>

          <div className="space-y-4">

            <div className="p-4 border rounded-xl">
              Data Analytics Consultancy
            </div>

            <div className="p-4 border rounded-xl">
              Online Training Center
            </div>

            <div className="p-4 border rounded-xl">
              Digital Marketing Agency
            </div>

          </div>

        </div>

        <div
          className="
          bg-white
          rounded-2xl
          border
          p-6
          "
        >

          <h2
            className="
            font-bold
            text-lg
            mb-4
            "
          >
            Recent Business Plans
          </h2>

          <div className="space-y-4">

            <div className="p-4 border rounded-xl">
              Data Analytics Consultancy
            </div>

            <div className="p-4 border rounded-xl">
              Online Training Center
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}