import { Briefcase, Building } from "lucide-react";

export default function EmploymentStep({ formData, setFormData }) {
  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Profession <span className="text-red-400">*</span></label>
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={formData.profession}
            onChange={set("profession")}
            placeholder="e.g. Software Engineer, Accountant, HR Manager"
            className="input-base pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">This helps us match you with relevant business ideas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Employer</label>
        <div className="relative">
          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={formData.employer}
            onChange={set("employer")}
            placeholder="e.g. Tech Corp, Ethiopian Airlines, Self-employed"
            className="input-base pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Optional — helps with context for your business plan</p>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
        <p className="text-xs text-indigo-300 leading-relaxed">
          <span className="font-semibold">Why we ask:</span> Your employment background directly informs which business ideas are a natural fit for your experience.
        </p>
      </div>
    </div>
  );
}
