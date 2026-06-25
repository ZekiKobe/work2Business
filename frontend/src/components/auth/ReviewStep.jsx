import { CheckCircle2, User, Briefcase, DollarSign, Star, Heart } from "lucide-react";

export default function ReviewStep({ formData }) {
  const sections = [
    {
      icon: User,
      title: "Personal Info",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      items: [
        { label: "Name", value: `${formData.firstName} ${formData.lastName}` },
        { label: "Email", value: formData.email }
      ]
    },
    {
      icon: Briefcase,
      title: "Employment",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      items: [
        { label: "Profession", value: formData.profession || "—" },
        { label: "Employer", value: formData.employer || "—" }
      ]
    },
    {
      icon: DollarSign,
      title: "Financial Capacity",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      items: [
        { label: "Monthly Salary", value: formData.monthlySalary ? `${Number(formData.monthlySalary).toLocaleString()} ETB` : "—" },
        { label: "Available Capital", value: formData.availableCapital ? `${Number(formData.availableCapital).toLocaleString()} ETB` : "—" },
        { label: "Hours/Week", value: formData.availableHoursPerWeek ? `${formData.availableHoursPerWeek} hrs` : "—" }
      ]
    },
    {
      icon: Star,
      title: "Skills",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      items: [
        { label: "Selected Skills", value: formData.skills.length > 0 ? formData.skills.join(", ") : "None selected" }
      ]
    },
    {
      icon: Heart,
      title: "Interests",
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/20",
      items: [
        { label: "Business Interests", value: formData.interests.length > 0 ? formData.interests.join(", ") : "None selected" }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-xs text-emerald-300">Everything looks good! Review your details before submitting.</p>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className={`border rounded-xl p-3.5 ${section.bg}`}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className={`w-3.5 h-3.5 ${section.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${section.color}`}>{section.title}</span>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-2 text-xs">
                    <span className="text-slate-500 w-28 shrink-0">{item.label}:</span>
                    <span className="text-slate-200 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
