import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Building2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import api from "../../api/axios";
import { forgotPasswordSchema } from "../../schemas/loginSchema";
import { PLACEHOLDERS } from "../../constants/placeholders";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post("/auth/forgot-password", data),
    onSuccess: () => {
      setSent(true);
      toast.success("Reset link sent if account exists");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  });

  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-glow-sm group-hover:scale-105 transition-transform">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Work2Business</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">Reset your password</h1>
          <p className="text-slate-400 text-sm mt-1.5">Enter your email and we'll send a reset link</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-card">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check your inbox</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                If an account exists with that email, we've sent a password reset link. It expires in 1 hour.
              </p>
              <Link to="/login" className="btn-secondary w-full justify-center">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(mutate)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder={PLACEHOLDERS.email}
                    className="input-base pl-10"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={isPending} className="btn-primary w-full">
                {isPending ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-sm text-slate-400 hover:text-slate-300 flex items-center justify-center gap-1.5 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
