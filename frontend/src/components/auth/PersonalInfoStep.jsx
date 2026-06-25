import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export default function PersonalInfoStep({ formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={formData.firstName}
              onChange={set("firstName")}
              placeholder="John"
              className="input-base pl-10"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Last Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={formData.lastName}
              onChange={set("lastName")}
              placeholder="Doe"
              className="input-base pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            value={formData.email}
            onChange={set("email")}
            placeholder="you@company.com"
            className="input-base pl-10"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={set("password")}
            placeholder="Min. 8 characters"
            className="input-base pl-10 pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Use at least 8 characters with uppercase, lowercase, and a number</p>
      </div>
    </div>
  );
}
