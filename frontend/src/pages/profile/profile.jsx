import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User, Briefcase, Building, DollarSign, Wallet, Clock, Star, Heart,
  CheckCircle2, X, Search, Save, TrendingUp, AlertTriangle, Target, Zap, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { SKILLS } from "../../constants/skills";
import { INTERESTS } from "../../constants/interests";
import { PLACEHOLDERS } from "../../constants/placeholders";

function TagSelector({ selected, options, onChange, colorClass, placeholder }) {
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o));

  const toggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {selected.map((item) => (
          <span key={item} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${colorClass}`}>
            {item}
            <button type="button" onClick={() => toggle(item)} className="hover:text-red-400 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selected.length === 0 && <span className="text-xs text-slate-600 py-1">{placeholder}</span>}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={PLACEHOLDERS.tagSearch}
          className="input-base pl-9 text-xs py-2"
        />
      </div>
      {search && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {filtered.slice(0, 20).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { toggle(item); setSearch(""); }}
              className="px-2.5 py-1 rounded-full border bg-slate-800/60 border-slate-700/60 text-slate-300 text-xs hover:border-slate-500 transition-colors"
            >
              + {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CompletenessSection({ completeness }) {
  const items = [
    { label: "First & Last Name", done: true },
    { label: "Profession", done: true },
    { label: "Current Employer", done: true },
    { label: "Monthly Salary", done: true },
    { label: "Available Capital", done: true },
    { label: "Hours per Week", done: true },
    { label: "3+ Skills selected", done: true },
    { label: "2+ Interests selected", done: true }
  ];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white text-sm">Profile Completeness</h3>
        <span className={`text-sm font-bold ${completeness >= 80 ? "text-emerald-400" : completeness >= 50 ? "text-amber-400" : "text-red-400"}`}>
          {completeness}%
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full rounded-full ${completeness >= 80 ? "bg-emerald-500" : completeness >= 50 ? "bg-amber-500" : "bg-red-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${completeness}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {completeness < 100 && (
        <p className="text-xs text-slate-400 leading-relaxed">
          {completeness < 50 ? "Complete your profile to unlock accurate business recommendations." : "Almost there! A complete profile gets significantly better match scores."}
        </p>
      )}
      {completeness === 100 && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <p className="text-xs text-emerald-300">Your profile is fully complete!</p>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    profession: user?.profession || "",
    employer: user?.employer || "",
    monthlySalary: user?.monthlySalary || 0,
    availableCapital: user?.availableCapital || 0,
    availableHoursPerWeek: user?.availableHoursPerWeek || 0,
    skills: user?.skills || [],
    interests: user?.interests || []
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const completeness = user?.profileCompleteness ?? 0;

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.put("/user/profile", data),
    onSuccess: (res) => {
      updateUser(res.data.user);
      queryClient.invalidateQueries(["dashboard-stats"]);
      queryClient.invalidateQueries(["recommendations"]);
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      ...form,
      monthlySalary: Number(form.monthlySalary),
      availableCapital: Number(form.availableCapital),
      availableHoursPerWeek: Number(form.availableHoursPerWeek)
    });
  };

  const readinessItems = [
    { label: "Capital vs avg. idea requirement", status: user?.availableCapital >= 20000 ? "good" : user?.availableCapital > 0 ? "warning" : "bad", hint: user?.availableCapital >= 20000 ? "Strong capital base" : "Consider adding more capital" },
    { label: "Skills breadth", status: (user?.skills?.length || 0) >= 5 ? "good" : (user?.skills?.length || 0) >= 2 ? "warning" : "bad", hint: `${user?.skills?.length || 0} skill${user?.skills?.length !== 1 ? "s" : ""} added` },
    { label: "Available time", status: (user?.availableHoursPerWeek || 0) >= 20 ? "good" : (user?.availableHoursPerWeek || 0) > 0 ? "warning" : "bad", hint: `${user?.availableHoursPerWeek || 0} hrs/week available` },
    { label: "Interest alignment", status: (user?.interests?.length || 0) >= 3 ? "good" : (user?.interests?.length || 0) > 0 ? "warning" : "bad", hint: `${user?.interests?.length || 0} interest${user?.interests?.length !== 1 ? "s" : ""} selected` }
  ];

  const statusColor = { good: "text-emerald-400 bg-emerald-500/10", warning: "text-amber-400 bg-amber-500/10", bad: "text-red-400 bg-red-500/10" };
  const statusIcon = { good: CheckCircle2, warning: AlertTriangle, bad: X };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        subtitle="Keep your profile current for the most accurate business recommendations"
        badge="Account Settings"
      />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-bold text-white text-sm">Personal Information</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name</label>
                  <input value={form.firstName} onChange={set("firstName")} className="input-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                  <input value={form.lastName} onChange={set("lastName")} className="input-base text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input value={user?.email || ""} disabled className="input-base text-sm opacity-50 cursor-not-allowed" />
                  <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Employment */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-sm">Employment</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Profession</label>
                  <input value={form.profession} onChange={set("profession")} placeholder={PLACEHOLDERS.profession} className="input-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Employer</label>
                  <input value={form.employer} onChange={set("employer")} placeholder={PLACEHOLDERS.employer} className="input-base text-sm" />
                </div>
              </div>
            </div>

            {/* Financial */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-sm">Financial Capacity</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Monthly Salary (ETB)</label>
                  <input type="number" min="0" value={form.monthlySalary} onChange={set("monthlySalary")} placeholder={PLACEHOLDERS.monthlySalary} className="input-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Available Capital (ETB)</label>
                  <input type="number" min="0" value={form.availableCapital} onChange={set("availableCapital")} placeholder={PLACEHOLDERS.availableCapital} className="input-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Hours/Week Available</label>
                  <input type="number" min="0" max="80" value={form.availableHoursPerWeek} onChange={set("availableHoursPerWeek")} placeholder={PLACEHOLDERS.hoursPerWeek} className="input-base text-sm" />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <h3 className="font-bold text-white text-sm">Professional Skills</h3>
                <span className="ml-auto text-xs text-slate-500">{form.skills.length} selected</span>
              </div>
              <TagSelector
                selected={form.skills}
                options={SKILLS}
                onChange={(skills) => setForm({ ...form, skills })}
                colorClass="bg-yellow-500/10 border-yellow-500/25 text-yellow-300"
                placeholder="No skills selected yet"
              />
            </div>

            {/* Interests */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <h3 className="font-bold text-white text-sm">Business Interests</h3>
                <span className="ml-auto text-xs text-slate-500">{form.interests.length} selected</span>
              </div>
              <TagSelector
                selected={form.interests}
                options={INTERESTS}
                onChange={(interests) => setForm({ ...form, interests })}
                colorClass="bg-pink-500/10 border-pink-500/25 text-pink-300"
                placeholder="No interests selected yet"
              />
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
              {isPending ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <CompletenessSection completeness={completeness} />

          {/* Readiness Analysis */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-1">E2B Readiness Analysis</h3>
            <p className="text-xs text-slate-500 mb-4">Factors affecting your match quality</p>
            <div className="space-y-3">
              {readinessItems.map((item) => {
                const Icon = statusIcon[item.status];
                return (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className={`p-1 rounded-lg mt-0.5 ${statusColor[item.status]}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 font-medium">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/recommendations" className="flex items-center gap-2.5 p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl hover:bg-indigo-500/10 transition-colors group">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-indigo-300 group-hover:text-indigo-200">View my recommendations</span>
                <ArrowRight className="w-3 h-3 text-indigo-500 ml-auto" />
              </Link>
              <Link to="/plans" className="flex items-center gap-2.5 p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl hover:bg-slate-800/60 transition-colors group">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 group-hover:text-slate-200">View my business plans</span>
                <ArrowRight className="w-3 h-3 text-slate-600 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Account info */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">Account</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-300 truncate ml-2">{user?.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Role</span>
                <span className="text-slate-300 capitalize">{user?.role?.toLowerCase() || "employee"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Member since</span>
                <span className="text-slate-300">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
