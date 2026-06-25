import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } }
};

/* Mini mock dashboard card that floats in the hero */
function MockDashboardCard({ delay, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`absolute bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl shadow-black/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

const PROOF_POINTS = [
  "No startup experience needed",
  "AI plan ready in 30 seconds",
  "Matched to your exact capital"
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080d1a] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-xs font-semibold text-indigo-300 mb-7">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI-Powered Employee → Entrepreneur Platform
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.06] tracking-tight mb-5">
            Your job made you
            <br />
            <span className="gradient-text">the perfect founder.</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
            Work2Business analyzes your skills, capital, and experience to match you with the right business — then builds a complete, personalized launch plan in seconds.
          </motion.p>

          <motion.ul variants={item} className="space-y-2.5 mb-10">
            {PROOF_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                {p}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.97] shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Start for free — 3 minutes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm rounded-xl transition-all duration-200"
            >
              Sign in to dashboard
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={item} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {["S", "Y", "L", "M", "A"].map((initial, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080d1a] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: ["#4f46e5","#7c3aed","#0891b2","#059669","#d97706"][i] }}>
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">12,400+ professionals</p>
              <p className="text-xs text-slate-500">discovered their business this week</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Floating UI mockup */}
        <div className="relative hidden lg:block h-[500px]">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="absolute inset-x-8 top-12 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 shadow-2xl"
          >
            {/* Score ring mockup */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-16 h-16 shrink-0">
                <svg width="64" height="64" className="-rotate-90">
                  <circle cx="32" cy="32" r="26" strokeWidth="5" stroke="#1e293b" fill="none" />
                  <circle cx="32" cy="32" r="26" strokeWidth="5" stroke="#6366f1" fill="none"
                    strokeLinecap="round" strokeDasharray="163" strokeDashoffset="28" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">83%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Top Match</p>
                <p className="font-bold text-white text-sm">Data Analytics Consultancy</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-full font-bold">LOW Risk</span>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 rounded-full">Technology</span>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="space-y-2.5">
              {[
                { label: "Capital Match", val: 90, color: "bg-blue-500" },
                { label: "Skill Overlap", val: 75, color: "bg-purple-500" },
                { label: "Interest Fit", val: 88, color: "bg-pink-500" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>{bar.label}</span><span>{bar.val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${bar.val}%` }}
                      transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${bar.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" /> Generate Business Plan
            </motion.button>
          </motion.div>

          {/* Floating stat cards */}
          <MockDashboardCard delay={0.6} className="-right-4 top-4 w-44">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-medium">E2B Readiness</span>
            </div>
            <p className="text-2xl font-bold text-white">87%</p>
            <div className="mt-2 h-1 bg-slate-800 rounded-full">
              <div className="h-full w-[87%] bg-emerald-500 rounded-full" />
            </div>
          </MockDashboardCard>

          <MockDashboardCard delay={0.8} className="-left-4 bottom-24 w-48">
            <p className="text-[10px] text-slate-400 mb-2 font-medium">AI Plan Generated</p>
            <div className="space-y-1.5">
              {["Executive Summary", "Financial Plan", "90-Day Roadmap"].map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" />{s}
                </div>
              ))}
            </div>
          </MockDashboardCard>

          <MockDashboardCard delay={1.0} className="right-0 bottom-4 w-40">
            <p className="text-[10px] text-slate-400 mb-1 font-medium">Ideas Matched</p>
            <p className="text-3xl font-bold text-indigo-400">15</p>
            <p className="text-[10px] text-slate-500 mt-0.5">8 high-fit matches</p>
          </MockDashboardCard>
        </div>
      </div>
    </section>
  );
}
