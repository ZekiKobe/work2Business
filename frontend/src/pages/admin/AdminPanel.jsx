import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Navigate, Link } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Save, X, ShieldCheck, ChevronDown, ChevronUp,
  DollarSign, TrendingUp, Clock, AlertTriangle, Search, Users, FileText,
  Lightbulb, LayoutDashboard, Eye, UserX, UserCheck, EyeOff, ExternalLink
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "ideas", label: "Business Ideas", icon: Lightbulb },
  { id: "users", label: "Users", icon: Users },
  { id: "plans", label: "Business Plans", icon: FileText },
];

const BLANK_IDEA = {
  name: "",
  description: "",
  category: "",
  minimumCapital: "",
  expectedProfit: "",
  timeToProfit: "",
  riskLevel: "MEDIUM",
  hoursRequiredPerWeek: "",
  successRate: "",
  requiredSkills: "",
  tags: "",
  isActive: true
};

const RISK_COLORS = {
  LOW: "text-emerald-400 bg-emerald-500/10",
  MEDIUM: "text-amber-400 bg-amber-500/10",
  HIGH: "text-red-400 bg-red-500/10"
};

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-10 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${checked ? "bg-indigo-600" : "bg-slate-700"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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

function IdeaFormModal({ idea, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(() =>
    idea
      ? {
          ...BLANK_IDEA,
          ...idea,
          requiredSkills: idea.requiredSkills?.join(", ") || "",
          tags: idea.tags?.join(", ") || "",
          isActive: idea.isActive !== false
        }
      : { ...BLANK_IDEA }
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      return toast.error("Name, description, and category are required");
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      minimumCapital: Number(form.minimumCapital) || 0,
      expectedProfit: Number(form.expectedProfit) || 0,
      timeToProfit: Number(form.timeToProfit) || 0,
      hoursRequiredPerWeek: Number(form.hoursRequiredPerWeek) || 0,
      successRate: Number(form.successRate) || 0,
      riskLevel: form.riskLevel,
      isActive: form.isActive,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean)
    };
    onSave(payload);
  };

  const FIELDS = [
    { key: "name", label: "Idea Name", type: "text", full: true },
    { key: "category", label: "Category", type: "text" },
    { key: "riskLevel", label: "Risk Level", type: "select", options: ["LOW", "MEDIUM", "HIGH"] },
    { key: "minimumCapital", label: "Min Capital ($)", type: "number" },
    { key: "expectedProfit", label: "Expected Profit ($/yr)", type: "number" },
    { key: "timeToProfit", label: "Months to Profit", type: "number" },
    { key: "hoursRequiredPerWeek", label: "Hours/Week", type: "number" },
    { key: "successRate", label: "Success Rate (%)", type: "number" },
    { key: "requiredSkills", label: "Required Skills (comma-separated)", type: "text", full: true },
    { key: "tags", label: "Tags (comma-separated)", type: "text", full: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="bg-[#0d1425] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <h2 className="text-base font-bold text-white">{idea ? "Edit Idea" : "Add New Idea"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3} className="input-base resize-none text-sm" placeholder="Describe the business idea..." />
          </div>

          {FIELDS.map(({ key, label, type, full, options }) => (
            <div key={key} className={full ? "col-span-2" : ""}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
              {type === "select" ? (
                <select value={form[key]} onChange={set(key)} className="input-base text-sm">
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type} value={form[key]} onChange={set(key)} className="input-base text-sm" placeholder={label} />
              )}
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-between glass rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Active in recommendations</p>
              <p className="text-xs text-slate-500">Inactive ideas are hidden from users</p>
            </div>
            <ToggleSwitch checked={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : idea ? "Save Changes" : "Create Idea"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmDeleteModal({ title, message, confirmLabel, onConfirm, onClose, isPending }) {
  const [typed, setTyped] = useState("");
  const canConfirm = typed === confirmLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d1425] border border-red-500/25 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
          <div>
            <p className="font-bold text-white text-sm">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-4">{message}</p>
        <p className="text-xs text-slate-500 mb-2">Type <span className="text-red-400 font-mono">{confirmLabel}</span> to confirm:</p>
        <input value={typed} onChange={(e) => setTyped(e.target.value)} className="input-base text-sm mb-4" placeholder={confirmLabel} />
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={!canConfirm || isPending} className="btn-danger text-sm flex-1">
            {isPending ? "Deleting..." : "Permanent Delete"}
          </button>
          <button onClick={onClose} className="btn-secondary text-sm flex-1">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

function OverviewTab({ onNavigate }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data.data)
  });

  const stats = data || {};

  const cards = [
    { label: "Total Users", value: stats.totalUsers ?? 0, sub: `${stats.activeUsers ?? 0} active`, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Business Ideas", value: stats.totalIdeas ?? 0, sub: `${stats.activeIdeas ?? 0} active`, icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Business Plans", value: stats.totalPlans ?? 0, sub: `${stats.plansThisMonth ?? 0} this month`, icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "AI Plans", value: stats.aiPlans ?? 0, sub: `${stats.manualPlans ?? 0} manual`, icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 glass rounded-2xl animate-pulse bg-slate-800/40" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="glass rounded-2xl p-5">
                <div className={`p-2.5 rounded-xl ${card.bg} mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                <p className="text-xs text-slate-600">{card.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { label: "Manage Ideas", tab: "ideas" },
            { label: "Manage Users", tab: "users" },
            { label: "Manage Plans", tab: "plans" },
          ].map(({ label, tab }) => (
            <button key={tab} onClick={() => onNavigate(tab)} className="btn-secondary text-sm justify-center py-2.5">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IdeasTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ideas"],
    queryFn: () => api.get("/business-ideas").then((r) => r.data.ideas || r.data)
  });

  const ideas = (Array.isArray(data) ? data : data?.ideas || []).filter((idea) =>
    idea.name?.toLowerCase().includes(search.toLowerCase()) ||
    idea.category?.toLowerCase().includes(search.toLowerCase())
  );

  const { mutate: saveIdea, isPending: isSaving } = useMutation({
    mutationFn: ({ id, payload }) => id ? api.put(`/business-ideas/${id}`, payload) : api.post("/business-ideas", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-ideas"]);
      toast.success(editTarget?._id ? "Idea updated" : "Idea created");
      setEditTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to save idea")
  });

  const { mutate: toggleIdeaActive } = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/business-ideas/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-ideas"]);
      toast.success("Idea status updated");
    },
    onError: () => toast.error("Failed to update idea")
  });

  const { mutate: deleteIdea, isPending: isDeleting } = useMutation({
    mutationFn: (id) => api.delete(`/business-ideas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-ideas"]);
      toast.success("Idea deleted");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete idea")
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas..." className="input-base pl-9 text-sm" />
        </div>
        <button onClick={() => setEditTarget("new")} className="btn-primary text-sm shrink-0">
          <Plus className="w-4 h-4" /> Add New Idea
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 glass rounded-xl animate-pulse bg-slate-800/40" />)}</div>
      ) : (
        <div className="space-y-2">
          {ideas.map((idea) => (
            <div key={idea._id} className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white truncate">{idea.name}</p>
                    {idea.category && <span className="text-[10px] bg-slate-800 text-slate-400 rounded px-1.5 py-0.5">{idea.category}</span>}
                    <span className={`text-[10px] rounded px-1.5 py-0.5 font-medium ${RISK_COLORS[idea.riskLevel] || "text-slate-400 bg-slate-500/10"}`}>{idea.riskLevel}</span>
                    {!idea.isActive && <span className="text-[10px] bg-red-500/10 text-red-400 rounded px-1.5 py-0.5">Inactive</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${(idea.minimumCapital || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />${(idea.expectedProfit || 0).toLocaleString()}/yr</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{idea.hoursRequiredPerWeek || 0}h/week</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ToggleSwitch checked={idea.isActive !== false} onChange={(v) => toggleIdeaActive({ id: idea._id, isActive: v })} />
                  <button onClick={() => setExpandedId(expandedId === idea._id ? null : idea._id)} className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/60">
                    {expandedId === idea._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditTarget(idea)} className="p-1.5 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget(idea)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <AnimatePresence>
                {expandedId === idea._id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-slate-800/60 overflow-hidden">
                    <div className="px-4 py-3 text-xs text-slate-400 leading-relaxed">{idea.description}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editTarget && (
          <IdeaFormModal idea={editTarget === "new" ? null : editTarget} isSaving={isSaving} onClose={() => setEditTarget(null)} onSave={(payload) => saveIdea({ id: editTarget !== "new" ? editTarget._id : null, payload })} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d1425] border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full">
              <p className="font-bold text-white text-sm mb-2">Delete Idea</p>
              <p className="text-sm text-slate-400 mb-5">Delete <strong className="text-white">{deleteTarget.name}</strong>?</p>
              <div className="flex gap-3">
                <button onClick={() => deleteIdea(deleteTarget._id)} disabled={isDeleting} className="btn-danger text-sm flex-1">{isDeleting ? "Deleting..." : "Delete"}</button>
                <button onClick={() => setDeleteTarget(null)} className="btn-secondary text-sm flex-1">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter],
    queryFn: () => api.get("/admin/users", { params: { search, role: roleFilter || undefined, limit: 50 } }).then((r) => r.data.data)
  });

  const users = data || [];

  const { mutate: updateUser } = useMutation({
    mutationFn: ({ id, payload }) => api.patch(`/admin/users/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      queryClient.invalidateQueries(["admin-stats"]);
      toast.success("User updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update user")
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}?confirm=true`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      queryClient.invalidateQueries(["admin-stats"]);
      toast.success("User permanently deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete user")
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-base pl-9 text-sm" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-base text-sm w-40">
          <option value="">All roles</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 glass rounded-xl animate-pulse bg-slate-800/40" />)}</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const isSelf = u._id === currentUser?._id;
            return (
              <div key={u._id} className="glass rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] bg-slate-800 text-slate-400 rounded px-1.5 py-0.5">{u.role}</span>
                    <span className={`text-[10px] rounded px-1.5 py-0.5 ${u.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                    <span className="text-[10px] text-slate-600">{u.planCount ?? 0} plans</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={u.role}
                    disabled={isSelf}
                    onChange={(e) => updateUser({ id: u._id, payload: { role: e.target.value } })}
                    className="input-base text-xs py-1.5 px-2 w-28"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {!isSelf && (
                    <button
                      onClick={() => updateUser({ id: u._id, payload: { isActive: !u.isActive } })}
                      className={`p-1.5 rounded-lg transition-colors ${u.isActive ? "text-amber-400 hover:bg-amber-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
                      title={u.isActive ? "Deactivate" : "Reactivate"}
                    >
                      {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  )}
                  {!isSelf && (
                    <button onClick={() => setDeleteTarget(u)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDeleteModal
            title="Delete User Permanently"
            message={`This will permanently delete ${deleteTarget.firstName} ${deleteTarget.lastName} and all their plans and notifications.`}
            confirmLabel="DELETE"
            isPending={isDeleting}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => deleteUser(deleteTarget._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlansTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-plans", search],
    queryFn: () => api.get("/admin/plans", { params: { search, limit: 50 } }).then((r) => r.data.data),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000)
  });

  const plans = data || [];

  const { mutate: updatePlan } = useMutation({
    mutationFn: ({ id, isActive }) => api.patch(`/admin/plans/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-plans"]);
      queryClient.invalidateQueries(["admin-stats"]);
      toast.success("Plan status updated");
    },
    onError: () => toast.error("Failed to update plan")
  });

  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: (id) => api.delete(`/admin/plans/${id}?confirm=true`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-plans"]);
      queryClient.invalidateQueries(["admin-stats"]);
      toast.success("Plan permanently deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete plan")
  });

  return (
    <div>
      <div className="relative max-w-xs mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans..." className="input-base pl-9 text-sm" />
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 glass rounded-xl animate-pulse bg-slate-800/40" />)}</div>
      ) : isError ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-sm text-slate-400 mb-1">Could not load plans.</p>
          <p className="text-xs text-slate-600 mb-4">The API may be restarting — try again in a moment.</p>
          <button type="button" onClick={() => refetch()} className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => (
            <div key={plan._id} className="glass rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{plan.title || plan.businessIdea?.name}</p>
                <p className="text-xs text-slate-500">
                  {plan.user?.firstName} {plan.user?.lastName} · {plan.user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] bg-slate-800 text-slate-400 rounded px-1.5 py-0.5">{plan.source}</span>
                  {!plan.isActive && <span className="text-[10px] bg-red-500/10 text-red-400 rounded px-1.5 py-0.5">Hidden</span>}
                  <span className="text-[10px] text-slate-600">{new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/plans/${plan._id}`} className="p-1.5 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10" title="View plan">
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => updatePlan({ id: plan._id, isActive: !plan.isActive })}
                  className={`p-1.5 rounded-lg transition-colors ${plan.isActive ? "text-amber-400 hover:bg-amber-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
                  title={plan.isActive ? "Hide plan" : "Restore plan"}
                >
                  {plan.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => setDeleteTarget(plan)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDeleteModal
            title="Delete Plan Permanently"
            message={`This will permanently delete "${deleteTarget.title || deleteTarget.businessIdea?.name}".`}
            confirmLabel="DELETE"
            isPending={isDeleting}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => deletePlan(deleteTarget._id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");

  if (user && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  const tabContent = {
    overview: <OverviewTab onNavigate={setActiveTab} />,
    ideas: <IdeasTab />,
    users: <UsersTab />,
    plans: <PlansTab />
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Panel"
        subtitle="Manage platform users, ideas, and plans"
        badge={<span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</span>}
      />

      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === id
                  ? "bg-amber-500/10 border border-amber-500/25 text-amber-300"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === id ? "text-amber-400" : ""}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 sm:p-7 min-w-0">
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
