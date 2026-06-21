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
        value={
          formData.monthlySalary
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            monthlySalary:
              e.target.value
          })
        }
      />

      <Input
        type="number"
        label="Available Capital"
        value={
          formData.availableCapital
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            availableCapital:
              e.target.value
          })
        }
      />

    </div>
  );
}