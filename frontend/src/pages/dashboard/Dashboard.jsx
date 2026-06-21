import DashboardLayout from "../../layouts/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {

  return (
    <DashboardLayout>

      <PageHeader
        title="Dashboard"
        subtitle="Monitor your entrepreneurial journey"
      />

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
          title="Match Score"
          value="87%"
          subtitle="Excellent"
        />

        <StatCard
          title="Recommendations"
          value="14"
          subtitle="Available"
        />

        <StatCard
          title="Plans"
          value="5"
          subtitle="Generated"
        />

        <StatCard
          title="Capital Readiness"
          value="$10,000"
          subtitle="Available"
        />

      </div>

      <div className="mt-8">
        <AnalyticsChart />
      </div>

    </DashboardLayout>
  );
}