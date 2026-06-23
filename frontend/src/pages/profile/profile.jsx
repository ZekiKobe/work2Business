import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    employer: "",
    monthlySalary: 0,
    availableCapital: 0,
    availableHoursPerWeek: 0,
    skills: "",
    interests: "",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        if (isMounted) setLoading(true);
        const res = await api.get("/user/profile");
        
        if (isMounted && res.data?.user) {
          const u = res.data.user;
          setFormData({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            profession: u.profession || "",
            employer: u.employer || "",
            monthlySalary: u.monthlySalary || 0,
            availableCapital: u.availableCapital || 0,
            availableHoursPerWeek: u.availableHoursPerWeek || 0,
            skills: Array.isArray(u.skills) ? u.skills.join(", ") : "",
            interests: Array.isArray(u.interests) ? u.interests.join(", ") : "",
          });
        }
      } catch (error) {
        console.error(error);
        if (isMounted) toast.error("Failed to load profile data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        monthlySalary: Number(formData.monthlySalary) || 0,
        availableCapital: Number(formData.availableCapital) || 0,
        availableHoursPerWeek: Number(formData.availableHoursPerWeek) || 0,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
      };

      await api.put("/user/profile", payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 pb-12 text-slate-100">
        
        {/* Page Title */}
        <div className="mb-8 border-b border-slate-900 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Update your professional snapshot, resources, and expert skill alignments for the E2B matching core.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 animate-pulse text-sm font-medium">Loading profile context...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Identity (Using explicit raw styled div container) */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
              <h2 className="text-base font-bold text-white mb-4 tracking-tight">Identity Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-900/40 border border-slate-800/60 text-slate-500 rounded-xl text-sm cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Profession & Logistics */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
              <h2 className="text-base font-bold text-white mb-4 tracking-tight">Professional Baseline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Employer / Company</label>
                  <input
                    type="text"
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Monthly Salary</label>
                  <input
                    type="number"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Capital for Ventures</label>
                  <input
                    type="number"
                    name="availableCapital"
                    value={formData.availableCapital}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Hours / Week</label>
                  <input
                    type="number"
                    name="availableHoursPerWeek"
                    value={formData.availableHoursPerWeek}
                    onChange={handleChange}
                    className="w-full md:w-1/2 px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: AI Engine Attributes */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
              <h2 className="text-base font-bold text-white mb-1 tracking-tight">AI Engine Parameters</h2>
              <p className="text-xs text-slate-500 mb-4">Separate individual items using commas to maximize professional mapping density.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Core Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Project Management, Sales, Copywriting"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Market Interests</label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="SaaS, E-commerce, Artificial Intelligence, Green Energy"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-100 placeholder-slate-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-slate-400 border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:text-slate-200 rounded-xl transition-all"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-blue-600 hover:bg-blue-500 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-md min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating Engine...
                  </>
                ) : (
                  "Save Blueprint"
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </DashboardLayout>
  );
}