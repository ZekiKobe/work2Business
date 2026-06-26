import { DollarSign, Wallet, Clock } from "lucide-react";

export default function FinancialStep({ formData, setFormData }) {
  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Monthly Salary (ETB)</label>
        <div className="relative">
          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="number"
            min="0"
            value={formData.monthlySalary}
            onChange={set("monthlySalary")}
            placeholder="e.g. 15000"
            className="input-base pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Used to calculate salary replacement potential in business recommendations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Available Capital (ETB) <span className="text-red-400">*</span></label>
        <div className="relative">
          <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="number"
            min="0"
            value={formData.availableCapital}
            onChange={set("availableCapital")}
            placeholder="e.g. 50000"
            className="input-base pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Amount you can invest to start a business</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Available Hours per Week <span className="text-red-400">*</span></label>
        <div className="relative">
          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="number"
            min="1"
            max="80"
            value={formData.availableHoursPerWeek}
            onChange={set("availableHoursPerWeek")}
            placeholder="e.g. 20"
            className="input-base pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Hours you can dedicate weekly to your new business</p>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-xs text-emerald-300 leading-relaxed">
          <span className="font-semibold">Your data is private.</span> Financial information is used only to personalize business recommendations -never shared or sold.
        </p>
      </div>
    </div>
  );
}
