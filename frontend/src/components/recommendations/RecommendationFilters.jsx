export default function RecommendationFilters({
  filters,
  setFilters
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">

      <select
        className="border p-3 rounded-xl"
        value={filters.risk}
        onChange={(e) =>
          setFilters({
            ...filters,
            risk: e.target.value
          })
        }
      >
        <option value="">All Risk Levels</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <input
        type="number"
        placeholder="Max Capital"
        className="border p-3 rounded-xl"
        value={filters.maxCapital}
        onChange={(e) =>
          setFilters({
            ...filters,
            maxCapital: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Category"
        className="border p-3 rounded-xl"
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