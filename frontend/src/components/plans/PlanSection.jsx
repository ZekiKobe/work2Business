export default function PlanSection({ title, content }) {
  const renderClean = (data) => {
    if (!data) return null;

    // STRING
    if (typeof data === "string") {
      return (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {data}
        </p>
      );
    }

    // NUMBER
    if (typeof data === "number") {
      return (
        <div className="text-2xl font-bold text-gray-900">
          {data}
        </div>
      );
    }

    // ARRAY
    if (Array.isArray(data)) {
      return (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border bg-gray-50"
            >
              {typeof item === "object"
                ? Object.entries(item).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-gray-500 capitalize">
                        {key}
                      </span>

                      <span className="font-medium text-gray-800">
                        {value}
                      </span>
                    </div>
                  ))
                : (
                  <p className="text-gray-700">
                    {item}
                  </p>
                )}
            </div>
          ))}
        </div>
      );
    }

    // OBJECT (IMPORTANT FIX)
    if (typeof data === "object") {
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-xl border bg-white shadow-sm"
            >
              <p className="text-sm text-gray-500 capitalize mb-2">
                {key.replace(/([A-Z])/g, " $1")}
              </p>

              {/* IMPORTANT: never JSON.stringify */}
              {Array.isArray(value) ? (
                <ul className="space-y-2">
                  {value.map((v, i) => (
                    <li key={i} className="text-gray-700 text-sm">
                      • {typeof v === "object"
                        ? Object.values(v).join(" | ")
                        : v}
                    </li>
                  ))}
                </ul>
              ) : typeof value === "object" ? (
                <p className="text-gray-700 text-sm">
                  {Object.values(value).join(" | ")}
                </p>
              ) : (
                <p className="text-gray-900 font-semibold">
                  {value}
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
      <h3 className="text-lg font-bold mb-3">
        {title}
      </h3>

      <div className="p-5 bg-white border rounded-xl">
        {renderClean(content)}
      </div>
    </div>
  );
}