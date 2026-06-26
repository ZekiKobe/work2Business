import { useState } from "react";
import { Search, X, CheckCircle2 } from "lucide-react";
import { SKILLS } from "../../constants/skills";
import { PLACEHOLDERS } from "../../constants/placeholders";

export default function SkillsStep({ formData, setFormData }) {
  const [search, setSearch] = useState("");

  const toggle = (skill) => {
    const exists = formData.skills.includes(skill);
    setFormData({
      ...formData,
      skills: exists ? formData.skills.filter((s) => s !== skill) : [...formData.skills, skill]
    });
  };

  const filtered = SKILLS.filter((s) => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div>
        <div className="relative mb-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={PLACEHOLDERS.searchSkills}
            className="input-base pl-10"
          />
        </div>
      </div>

      {formData.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
          <span className="text-xs text-indigo-400 w-full mb-1 font-medium">Selected ({formData.skills.length}):</span>
          {formData.skills.map((s) => (
            <span key={s} className="flex items-center gap-1 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs rounded-full">
              {s}
              <button type="button" onClick={() => toggle(s)} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="max-h-52 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {filtered.map((skill) => {
            const selected = formData.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggle(skill)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 active:scale-95
                  ${selected
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
                    : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-600 hover:text-white"
                  }`}
              >
                {selected && <CheckCircle2 className="w-3 h-3" />}
                {skill}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm py-4">No skills matching "{search}"</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Select all skills you have. The more you add, the better your business match score.
      </p>
    </div>
  );
}
