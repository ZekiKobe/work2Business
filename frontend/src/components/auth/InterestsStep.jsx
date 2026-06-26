import { useState } from "react";
import { Search, X, CheckCircle2 } from "lucide-react";
import { INTERESTS } from "../../constants/interests";
import { PLACEHOLDERS } from "../../constants/placeholders";

export default function InterestsStep({ formData, setFormData }) {
  const [search, setSearch] = useState("");

  const toggle = (interest) => {
    const exists = formData.interests.includes(interest);
    setFormData({
      ...formData,
      interests: exists
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest]
    });
  };

  const filtered = INTERESTS.filter((i) => i.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={PLACEHOLDERS.searchInterests}
          className="input-base pl-10"
        />
      </div>

      {formData.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
          <span className="text-xs text-purple-400 w-full mb-1 font-medium">Selected ({formData.interests.length}):</span>
          {formData.interests.map((i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs rounded-full">
              {i}
              <button type="button" onClick={() => toggle(i)} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="max-h-52 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {filtered.map((interest) => {
            const selected = formData.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggle(interest)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 active:scale-95
                  ${selected
                    ? "bg-purple-500/15 text-purple-300 border-purple-500/40"
                    : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-600 hover:text-white"
                  }`}
              >
                {selected && <CheckCircle2 className="w-3 h-3" />}
                {interest}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm py-4">No interests matching "{search}"</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Choose industries and sectors that excite you. This powers interest-alignment scoring.
      </p>
    </div>
  );
}
