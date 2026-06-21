import Input from "../ui/Input";

export default function PersonalInfoStep({
  formData,
  setFormData
}) {

  return (
    <div className="space-y-4">

      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({
            ...formData,
            firstName: e.target.value
          })
        }
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChange={(e) =>
          setFormData({
            ...formData,
            lastName: e.target.value
          })
        }
      />

      <Input
        label="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value
          })
        }
      />

      <Input
        type="password"
        label="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value
          })
        }
      />

    </div>
  );
}