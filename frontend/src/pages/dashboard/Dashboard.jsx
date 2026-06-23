import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* WRAPPER FOR SYSTEM ALIGNMENT */}
      <div className="min-h-screen bg-slate-950 text-slate-100 p-1">
        
        {/* PAGE HEADER */}
        <div className="mb-8">
          <PageHeader
            title="Dashboard"
            subtitle="Monitor your corporate to venture transition metrics"
          />
        </div>

        {/* METRICS GRID */}
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
            title="E2B Match Score"
            value="87%"
            subtitle="High professional alignment"
            trend={{ value: "Optimal", isPositive: true }}
          />

          <StatCard
            title="Venture Recommendations"
            value="14"
            subtitle="Market gaps uncovered"
            trend={{ value: "+3 new", isPositive: true }}
          />

          <StatCard
            title="Business Plans"
            value="5"
            subtitle="Full architecture assets generated"
            trend={{ value: "Stable", isPositive: true }}
          />

          <StatCard
            title="Capital Readiness"
            value="$10,000"
            subtitle="Simulated sandbox target runway"
            trend={{ value: "Ready", isPositive: true }}
          />
        </div>

        {/* ANALYTICS CHARTS SECTION */}
        <div className="mt-8">
          <AnalyticsChart />
        </div>

      </div>
    </DashboardLayout>
  );
}