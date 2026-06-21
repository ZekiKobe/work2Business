import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", score: 55 },
  { month: "Feb", score: 62 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 73 },
  { month: "May", score: 81 },
  { month: "Jun", score: 87 }
];

export default function AnalyticsChart() {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      border
      p-6
      "
    >
      <h2 className="font-bold mb-6">
        Business Readiness Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}