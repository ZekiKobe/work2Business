export default function PlanSection({ title, content }) {
  const renderClean = (data) => {
    if (!data) return null;

    // STRING
    if (typeof data === "string") {
      return (
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {data}
        </p>
      );
    }

    // NUMBER
    if (typeof data === "number") {
      return (
        <div className="text-2xl font-mono font-bold text-blue-400">
          {data.toLocaleString()}
        </div>
      );
    }

    // ARRAY
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3 w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-800/60 bg-slate-950/30"
            >
              {typeof item === "object"
                ? Object.entries(item).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start gap-4 text-xs py-1 border-b border-slate-900/50 last:border-0"
                    >
                      <span className="text-slate-500 font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>

                      <span className="font-semibold text-slate-300 text-right">
                        {typeof value === "object" && value !== null
                          ? Object.values(value).join(" | ")
                          : String(value)}
                      </span>
                    </div>
                  ))
                : (
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item}
                  </p>
                )}
            </div>
          ))}
        </div>
      );
    }

    // OBJECT
    if (typeof data === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col gap-1.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>

              {/* Prevent JSON stringify leaks */}
              {Array.isArray(value) ? (
                <ul className="space-y-1.5">
                  {value.map((v, i) => (
                    <li key={i} className="text-slate-300 text-xs leading-relaxed flex items-start gap-2">
                      <span className="text-blue-500 select-none">•</span>
                      <span>
                        {typeof v === "object" && v !== null
                          ? Object.values(v).join(" | ")
                          : String(v)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : typeof value === "object" && value !== null ? (
                <p className="text-slate-300 text-xs leading-relaxed">
                  {Object.values(value).join(" | ")}
                </p>
              ) : (
                <p className="text-slate-200 font-semibold text-sm">
                  {String(value)}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-6">
      {/* HEADER SECTION */}
      <h3 className="text-base font-bold text-white tracking-tight mb-3">
        {title}
      </h3>

      {/* CONTAINER SURFACE */}
      <div className="p-5 bg-slate-900/20 border border-slate-900/60 rounded-2xl shadow-xl backdrop-blur-md">
        {renderClean(content)}
      </div>
    </div>
  );
}