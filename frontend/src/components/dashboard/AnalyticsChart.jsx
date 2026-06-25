import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
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
  { name: "Manual Verification", value: 35 }
];

// Recharts specific colors optimized for dark layouts
const COLORS = ["#3b82f6", "#6366f1"]; // Sleek tech Blue and Indigo

export default function AnalyticsChart() {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-slate-950 p-1 text-slate-200">

      {/* 📊 BAR CHART */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="font-bold text-base text-white tracking-tight">
            Transition Pipeline Growth
          </h2>
          <p className="text-xs text-slate-500 mt-1">E2B conversions initiated by employees per month.</p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Subtle grid layout lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f172a", 
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc"
              }}
              itemStyle={{ color: "#3b82f6" }}
              cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
            />
            <Bar
              dataKey="plans"
              fill="url(#colorPlans)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            {/* Gradients make the dark mode chart pop */}
            <defs>
              <linearGradient id="colorPlans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 PIE CHART */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="font-bold text-base text-white tracking-tight">
            Plan Origin Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-1">Breakdown of AI strategy maps vs customized runs.</p>
        </div>

        <div className="flex justify-center items-center h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={65} // Converted to donut chart for premium SaaS aesthetics
                outerRadius={90}
                paddingAngle={5}
                stroke="#0f172a"
                strokeWidth={3}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0f172a", 
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f8fafc"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Side Legend since default SVG ones are tricky to color code cleanly */}
          <div className="flex flex-col gap-3 pr-4 shrink-0">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">{entry.name}</span>
                  <span className="text-[11px] font-mono text-slate-500">{entry.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}