import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Lock, Bell, Palette, AlertTriangle, Eye, EyeOff, CheckCircle2, Sun, Moon, Monitor
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "account", label: "Account", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

// ─── Change Password Tab ──────────────────────────────────────────────────────

function AccountTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const checks = {
    length: form.newPassword.length >= 8,
    upper: /[A-Z]/.test(form.newPassword),
    lower: /[a-z]/.test(form.newPassword),
    number: /\d/.test(form.newPassword),
  };
  const strongEnough = Object.values(checks).every(Boolean);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.put("/user/change-password", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    }),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to change password")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.currentPassword) return toast.error("Enter your current password");
    if (!strongEnough) return toast.error("New password doesn't meet requirements");
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords don't match");
    mutate();
  };

  return (
    <div className="max-w-md">
      <h2 className="text-base font-bold text-white mb-1">Change Password</h2>
      <p className="text-sm text-slate-500 mb-6">Update your password to keep your account secure.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: "currentPassword", label: "Current Password", showKey: "current" },
          { key: "newPassword", label: "New Password", showKey: "next" },
          { key: "confirmPassword", label: "Confirm New Password", showKey: "confirm" },
        ].map(({ key, label, showKey }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
            <div className="relative">
              <input
                type={show[showKey] ? "text" : "password"}
                value={form[key]}
                onChange={set(key)}
                placeholder="••••••••"
                className="input-base pr-10 text-sm"
                autoComplete={key === "currentPassword" ? "current-password" : "new-password"}
              />
              <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {/* Strength indicators */}
        {form.newPassword && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {[
              { label: "8+ chars", ok: checks.length },
              { label: "Uppercase", ok: checks.upper },
              { label: "Lowercase", ok: checks.lower },
              { label: "Number", ok: checks.number },
            ].map(({ label, ok }) => (
              <span key={label} className={`text-[11px] font-medium ${ok ? "text-emerald-400" : "text-slate-600"}`}>
                {ok ? "✓" : "○"} {label}
              </span>
            ))}
          </div>
        )}

        <button type="submit" disabled={isPending} className="btn-primary mt-2">
          {isPending ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-indigo-600" : "bg-slate-700"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <motion.span
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

function NotificationsTab() {
  const { user, updateUser } = useContext(AuthContext);
  const prefs = user?.preferences || { emailOnPlan: true, emailOnMilestone: true, weeklyDigest: false };

  const { mutate, isPending } = useMutation({
    mutationFn: (updates) => api.put("/user/preferences", updates),
    onSuccess: (res, updates) => {
      updateUser({ ...user, preferences: { ...prefs, ...updates } });
      toast.success("Preferences saved");
    },
    onError: () => toast.error("Failed to save preferences")
  });

  const togglePref = (key) => {
    const updates = { [key]: !prefs[key] };
    mutate(updates);
  };

  const PREFS = [
    {
      key: "emailOnPlan",
      label: "Plan generated",
      desc: "Email me when an AI business plan is generated"
    },
    {
      key: "emailOnMilestone",
      label: "Milestone completed",
      desc: "Email me when I check off a launch milestone"
    },
    {
      key: "weeklyDigest",
      label: "Weekly progress digest",
      desc: "Weekly summary of your E2B readiness and activity"
    },
  ];

  return (
    <div className="max-w-lg">
      <h2 className="text-base font-bold text-white mb-1">Email Notifications</h2>
      <p className="text-sm text-slate-500 mb-6">Choose which emails you want to receive from Work2Business.</p>

      <div className="space-y-3">
        {PREFS.map(({ key, label, desc }) => (
          <div key={key} className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <ToggleSwitch
              checked={!!prefs[key]}
              onChange={() => togglePref(key)}
            />
          </div>
        ))}
      </div>
      {isPending && <p className="text-xs text-slate-500 mt-3">Saving...</p>}
    </div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
  { id: "system", label: "System", icon: Monitor, desc: "Follow OS setting" },
  { id: "light", label: "Light", icon: Sun, desc: "Bright mode" },
];

function AppearanceTab() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const applyTheme = (t) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (t === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    }
    toast.success(`Theme set to ${t}`);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-base font-bold text-white mb-1">Appearance</h2>
      <p className="text-sm text-slate-500 mb-6">Choose how Work2Business looks for you.</p>

      <div className="grid grid-cols-3 gap-3">
        {THEMES.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => applyTheme(id)}
            className={`glass rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
              theme === id ? "border-indigo-500/60 bg-indigo-500/8" : "hover:border-slate-600/80"
            }`}
          >
            <Icon className={`w-5 h-5 ${theme === id ? "text-indigo-400" : "text-slate-500"}`} />
            <span className={`text-xs font-semibold ${theme === id ? "text-white" : "text-slate-400"}`}>{label}</span>
            <span className="text-[10px] text-slate-600">{desc}</span>
            {theme === id && (
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Danger Zone Tab ──────────────────────────────────────────────────────────

function DangerTab() {
  const { logout } = useContext(AuthContext);
  const [confirm, setConfirm] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.delete("/user/account"),
    onSuccess: () => {
      toast.success("Account deactivated. Goodbye!");
      setTimeout(() => logout(), 1200);
    },
    onError: () => toast.error("Failed to deactivate account")
  });

  return (
    <div className="max-w-md">
      <h2 className="text-base font-bold text-white mb-1">Danger Zone</h2>
      <p className="text-sm text-slate-500 mb-6">Irreversible actions for your account.</p>

      <div className="border border-red-500/25 bg-red-500/5 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white text-sm">Deactivate Account</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Your account will be deactivated and you will be logged out. Your data is preserved — contact support to reactivate.
            </p>
          </div>
        </div>

        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="btn-danger text-sm">
            <AlertTriangle className="w-4 h-4" /> Deactivate Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-amber-400 font-medium">Are you sure? This will log you out immediately.</p>
            <div className="flex gap-2">
              <button onClick={() => mutate()} disabled={isPending} className="btn-danger text-sm">
                {isPending ? "Deactivating..." : "Yes, deactivate"}
              </button>
              <button onClick={() => setConfirm(false)} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const tabContent = {
    account: <AccountTab />,
    notifications: <NotificationsTab />,
    appearance: <AppearanceTab />,
    danger: <DangerTab />,
  };

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Manage your account, notifications, and preferences" badge="Account" />

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar tabs */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === id
                  ? id === "danger"
                    ? "bg-red-500/10 border border-red-500/25 text-red-400"
                    : "bg-slate-800/80 border border-slate-700/60 text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === id && id === "danger" ? "text-red-400" : activeTab === id ? "text-indigo-400" : ""}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="glass rounded-2xl p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
