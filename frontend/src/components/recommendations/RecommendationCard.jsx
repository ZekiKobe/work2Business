import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RecommendationCard({
  item,
  onGeneratePlan
}) {
  return (
    <Card className="p-5 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-900/60 flex flex-col justify-between h-full space-y-4">

      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          {/* IDEA NAME */}
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {item.name}
          </h2>

          {/* ENGINE METRIC BADGE */}
          <div className="px-2.5 py-0.5 font-mono text-[11px] font-bold rounded-full bg-emerald-950/80 border border-emerald-900/50 text-emerald-400 shrink-0 uppercase tracking-wider">
            {item.score || 100}%
          </div>
        </div>

        {/* CATEGORY TAG */}
        <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
          {item.category}
        </p>

        {/* REASON BRIEF */}
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {item.reason}
        </p>
      </div>

      {/* CORE EXECUTION ACTION */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => onGeneratePlan(item.id)}
          className="w-full justify-center text-center px-4 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          Generate AI Plan
        </Button>
      </div>

    </Card>
  );
}