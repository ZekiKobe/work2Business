import Input from "../ui/Input";

export default function PersonalInfoStep({
  formData,
  setFormData
}) {

  return (
    <div className="space-y-4">

      <Input
        label="First Name"
        placeholder="John"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({
            ...formData,
            firstName: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

      <Input
        label="Last Name"
        placeholder="Doe"
        value={formData.lastName}
        onChange={(e) =>
          setFormData({
            ...formData,
            lastName: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

      <Input
        label="Email"
        type="email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value
          })
        }
        className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/30"
      />

    </div>
  );
}