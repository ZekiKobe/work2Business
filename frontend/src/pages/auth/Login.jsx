import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Imported crisp navigation back icon
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      login(res.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans antialiased">
      {/* LEFT SIDE - PREMIUM MARKETING SIDEBAR */}
      <div className="hidden lg:flex w-[45%] bg-slate-950 p-16 relative overflow-hidden flex-col justify-between select-none border-r border-white/[0.04]">
        {/* Subtle Luxury Ambient Glows */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] -top-40 -left-40" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] bottom-10 right-[-10%]" />

        {/* Decorative Grid Overlay for a tech/business vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Brand/Logo Area */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-lg tracking-wider">
              W
            </span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Work2<span className="text-indigo-400">Business</span>
          </span>
        </div>

        {/* Core Marketing Content */}
        <div className="relative z-10 my-auto max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Turn your career into a <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              business opportunity.
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-base xl:text-lg leading-relaxed font-light">
            Analyze your industry experience, architect your professional
            profile, and deploy AI-powered business structures engineered for
            entrepreneurship.
          </p>

          {/* Feature Badges */}
          <div className="mt-10 space-y-4">
            {[
              "Build enterprise-grade profiles",
              "AI-generated tactical business plans",
              "Seamless career-to-business pathways",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-xl p-3.5 transition hover:bg-white/[0.04]"
              >
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-400/20">
                  <svg
                    className="h-3 w-3 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm font-medium tracking-wide">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer/Trust Element */}
        <div className="relative z-10 pt-6 border-t border-white/[0.04]">
          <p className="text-xs text-slate-500 tracking-wide">
            © {new Date().getFullYear()} Work2Business Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - CLEAN, MINIMALIST LOGIN FORM */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-slate-900/40 px-6 sm:px-12 lg:px-20 relative">
        
        <div className="w-full max-w-[440px] py-12">
          
          {/* BACK NAVIGATION ACTION BUTTON */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-slate-500 hover:text-slate-200 mb-8 px-3 py-2 border border-slate-900 bg-slate-950/40 rounded-xl transition-all duration-150 select-none group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back
          </button>

          {/* Header Area */}
          <div className="mb-9 text-left">
            {/* Mobile-only logo visibility */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-white font-bold text-base">
                Work2Business
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="text-slate-400 mt-2.5 text-sm">
              Enter your details to securely access your entrepreneurship suite.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Email address"
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/30"
              />

              <div className="space-y-1.5 relative">
                <PasswordInput
                  label="Password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password Utilities */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2.5 text-slate-400 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500/30 accent-indigo-500 transition cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150 text-sm"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Action Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm tracking-wide shadow-lg shadow-black/20 active:scale-[0.99] transform transition duration-150 flex items-center justify-center gap-2"
            >
              Sign In to Suite
            </Button>

            {/* Registration Callout */}
            <p className="text-center text-sm text-slate-500 pt-2">
              New to our platform?
              <Link
                to="/register"
                className="text-indigo-400 ml-1.5 font-semibold hover:text-indigo-300 transition-colors duration-150"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}