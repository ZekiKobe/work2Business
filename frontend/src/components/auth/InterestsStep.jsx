import { INTERESTS } from "../../constants/interests";

export default function InterestsStep({
  formData,
  setFormData
}) {

  const toggleInterest = (interest) => {
    const exists = formData.interests.includes(interest);

    if (exists) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
        Business Interests
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {INTERESTS.map(interest => {
          const isSelected = formData.interests.includes(interest);

          return (
            <div
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`
                cursor-pointer
                p-4
                rounded-xl
                border
                text-sm
                font-medium
                transition-all
                duration-150
                select-none
                active:scale-[0.98]
                ${
                  isSelected
                    ? "bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }
              `}
            >
              {interest}
            </div>
          );
        })}

      </div>

    </div>
  );
}