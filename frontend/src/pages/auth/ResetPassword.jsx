import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extracts access token from URL parameters

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        token,
        password: formData.password
      });
      toast.success("Password secure. Please sign in!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Token expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 sm:px-12 lg:px-20 relative overflow-hidden font-sans antialiased">
      {/* Background Premium Ambient Glows */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] bottom-10 right-[-10%] pointer-events-none" />

      <div className="w-full max-w-[440px] py-12 relative z-10">
        {/* Header Area */}
        <div className="mb-9 text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Set new password
          </h2>
          <p className="text-slate-400 mt-2.5 text-sm">
            Please engineer a complex password consisting of numbers, letters, and unique symbols to safeguard your account architecture.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <PasswordInput
              label="New Password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <PasswordInput
              label="Confirm New Password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm tracking-wide shadow-lg shadow-black/20"
          >
            Update Credentials
          </Button>
        </form>
      </div>
    </div>
  );
}