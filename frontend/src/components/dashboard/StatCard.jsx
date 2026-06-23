import Card from "../ui/Card";

export default function StatCard({
  title,
  value,
  subtitle,
  trend
}) {
  return (
    <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl transition-all duration-200 hover:border-slate-800">
      
      {/* HEADER & OPTIONAL TREND PILL */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        
        {trend && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
            trend.isPositive 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/10"
          }`}>
            {trend.value}
          </span>
        )}
      </div>

      {/* METRIC VALUE */}
      <h2 className="text-3xl font-bold mt-3 tracking-tight text-white font-sans">
        {value}
      </h2>

      {/* SUPPORTING SUBTITLE */}
      {subtitle && (
        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
          {subtitle}
        </p>
      )}

    </Card>
  );
}