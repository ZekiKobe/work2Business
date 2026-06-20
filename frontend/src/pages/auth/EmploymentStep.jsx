import Input from "../ui/Input";

export default function EmploymentStep({
  formData,
  setFormData
}) {

  return (
    <div className="space-y-4">

      <Input
        label="Profession"
        value={formData.profession}
        onChange={(e) =>
          setFormData({
            ...formData,
            profession:
              e.target.value
          })
        }
      />

      <Input
        label="Employer"
        value={formData.employer}
        onChange={(e) =>
          setFormData({
            ...formData,
            employer:
              e.target.value
          })
        }
      />

    </div>
  );
}