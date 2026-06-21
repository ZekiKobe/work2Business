import Input from "../ui/Input";

export default function EmploymentStep({
  formData,
  setFormData
}) {

  return (
    <div className="space-y-4">

      <Input
        label="Profession"
        placeholder="Software Engineer, Marketing Director, etc."
        value={formData.profession}
        onChange={(e) =>
          setFormData({
            ...formData,
            profession: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

      <Input
        label="Employer"
        placeholder="Acme Corp or Self-Employed"
        value={formData.employer}
        onChange={(e) =>
          setFormData({
            ...formData,
            employer: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

    </div>
  );
}