import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link dispatched!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
        {!submitted ? (
          <>
            {/* Header Area */}
            <div className="mb-9 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Recover access
              </h2>
              <p className="text-slate-400 mt-2.5 text-sm">
                Enter your registered email below and we will send you instructions to safely reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full transition duration-200 bg-slate-900 border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/30"
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm tracking-wide shadow-lg shadow-black/20"
              >
                Send Recovery Link
              </Button>
            </form>
          </>
        ) : (
          /* Success Empty State */
          <div className="text-left bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-400/20 mb-6">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              We have sent a secure authentication link to <span className="text-indigo-400 font-medium">{email}</span>. Please click the link to rewrite your credentials.
            </p>
          </div>
        )}

        {/* Back to Login Action */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Remembered your security code?
          <Link
            to="/login"
            className="text-indigo-400 ml-1.5 font-semibold hover:text-indigo-300 transition-colors duration-150"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}