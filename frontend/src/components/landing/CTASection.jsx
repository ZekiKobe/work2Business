import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-xs font-semibold text-indigo-300 mb-8">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Join 12,400+ professionals who started their journey
          </div>

          <h2 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Stop planning to start.
            <br />
            <span className="gradient-text">Start now.</span>
          </h2>

          <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Your professional experience is your biggest asset. Work2Business turns it into a business plan in minutes.
          </p>

          {/* Quick wins */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-12">
            {["Free to start", "3-minute setup", "AI plan in 30 seconds", "No credit card required"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />{item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-xl transition-all duration-200 active:scale-[0.97] shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              Build your free profile <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-base rounded-xl transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
