import Input from "../ui/Input";

export default function FinancialStep({
  formData,
  setFormData
}) {

  return (
    <div className="space-y-4">

      <Input
        type="number"
        label="Monthly Salary"
        placeholder="5000"
        value={formData.monthlySalary}
        onChange={(e) =>
          setFormData({
            ...formData,
            monthlySalary: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

      <Input
        type="number"
        label="Available Capital"
        placeholder="25000"
        value={formData.availableCapital}
        onChange={(e) =>
          setFormData({
            ...formData,
            availableCapital: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

    </div>
  );
}