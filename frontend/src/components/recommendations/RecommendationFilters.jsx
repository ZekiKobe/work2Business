import { PLACEHOLDERS } from "../../constants/placeholders";

export default function RecommendationFilters({
  filters,
  setFilters
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-blue-500/10 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-all cursor-pointer"
        value={filters.risk}
        onChange={(e) =>
          setFilters({
            ...filters,
            risk: e.target.value
          })
        }
      >
        <option value="" className="bg-slate-950 text-slate-300">All Risk Levels</option>
        <option value="LOW" className="bg-slate-950 text-slate-300">Low Risk</option>
        <option value="MEDIUM" className="bg-slate-950 text-slate-300">Medium Risk</option>
        <option value="HIGH" className="bg-slate-950 text-slate-300">High Risk</option>
      </select>

      {/* MAX CAPITAL */}
      <input
        type="number"
        placeholder={PLACEHOLDERS.maxCapital}
        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-blue-500/10 text-sm text-slate-200 placeholder-slate-500 transition-all"
        value={filters.maxCapital}
        onChange={(e) =>
          setFilters({
            ...filters,
            maxCapital: e.target.value
          })
        }
      />

      {/* CATEGORY ENTRY */}
      <input
        type="text"
        placeholder={PLACEHOLDERS.searchCategory}
        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-slate-700 focus:ring-2 focus:ring-blue-500/10 text-sm text-slate-200 placeholder-slate-500 transition-all"
        value={filters.category}
        onChange={(e) =>
          setFilters({
            ...filters,
            category: e.target.value
          })
        }
      />

    </div>
  );
}