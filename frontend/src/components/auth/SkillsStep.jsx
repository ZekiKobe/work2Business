import { SKILLS } from "../../constants/skills";

export default function SkillsStep({
  formData,
  setFormData
}) {

  const toggleSkill = (skill) => {
    const exists = formData.skills.includes(skill);

    if (exists) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
        Select Your Skills
      </h2>

      <p className="text-slate-400 text-sm mb-6">
        Choose all that apply to your profile.
      </p>

      <div className="flex flex-wrap gap-3">

        {SKILLS.map(skill => {
          const isSelected = formData.skills.includes(skill);
          
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`
                px-4 py-2 rounded-full border text-sm font-medium
                transition-all duration-150 transform active:scale-95
                ${
                  isSelected
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-sm shadow-indigo-500/5"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              {skill}
            </button>
          );
        })}

      </div>

    </div>
  );
}