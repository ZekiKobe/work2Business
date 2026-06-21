import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const barData = [
  { month: "Jan", plans: 3 },
  { month: "Feb", plans: 5 },
  { month: "Mar", plans: 7 },
  { month: "Apr", plans: 6 },
  { month: "May", plans: 9 },
  { month: "Jun", plans: 12 }
];

const pieData = [
  { name: "AI Generated", value: 65 },
  { name: "Manual", value: 35 }
];

const COLORS = ["#3b82f6", "#10b981"];

export default function AnalyticsChart() {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* 📊 BAR CHART */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="font-bold mb-4">
          Business Plan Growth
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="plans"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 PIE CHART */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="font-bold mb-4">
          Plan Type Distribution
        </h2>

        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}