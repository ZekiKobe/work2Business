import { SKILLS } from "../../constants/skills";

export default function SkillsStep({
  formData,
  setFormData
}) {

  const toggleSkill = (skill) => {
    const exists =
      formData.skills.includes(skill);

    if (exists) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(
          s => s !== skill
        )
      });
    } else {
      setFormData({
        ...formData,
        skills: [
          ...formData.skills,
          skill
        ]
      });
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-2">
        Select Your Skills
      </h2>

      <p className="text-gray-500 mb-6">
        Choose all that apply
      </p>

      <div className="flex flex-wrap gap-3">

        {SKILLS.map(skill => (
          <button
            key={skill}
            type="button"
            onClick={() =>
              toggleSkill(skill)
            }
            className={`
              px-4 py-2 rounded-full border

              ${
                formData.skills.includes(skill)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white"
              }
            `}
          >
            {skill}
          </button>
        ))}

      </div>

    </div>
  );
}