import Card from "../ui/Card";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate();

  const title =
    plan.title ||
    plan.businessIdea?.name ||
    "Business Blueprint";

  const summary =
    plan.summary ||
    plan.executiveSummary ||
    "No structural summary asset configured";

  return (
    <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all duration-200 hover:border-slate-800 hover:shadow-2xl space-y-4">
      
      <div>
        {/* TITLE */}
        <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">
          {title}
        </h2>

        {/* DATE TAG */}
        <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider mt-1">
          Initialized:{" "}
          {plan.createdAt
            ? new Date(plan.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Dynamic Instance"}
        </p>

        {/* SUMMARY BRIEF */}
        <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">
          {typeof summary === "string"
            ? summary
            : "AI Generated Business Plan Transition Asset Structure"}
        </p>
      </div>

      {/* COMPONENT ACTIONS FOOTER */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={() => navigate(`/plans/${plan._id}`)}
          className="px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/10"
        >
          View Stack
        </Button>

        <Button
          onClick={() => onDelete(plan._id)}
          className="px-4 py-2 text-xs font-semibold tracking-wide uppercase text-rose-400 border border-slate-800 bg-slate-950/40 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-300 rounded-xl transition-all"
        >
          Delete
        </Button>
      </div>

    </Card>
  );
}