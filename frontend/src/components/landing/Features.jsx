import { motion } from "framer-motion";
import {
  Target, Brain, BarChart3, Shield, BookOpen, Zap, BookMarked, GitCompare, Milestone, Wand2
} from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    badge: "Core",
    title: "6-Factor Match Scoring",
    desc: "Capital, skills, interests, hours, salary replacement potential, and risk level — scored per-dimension with full transparency."
  },
  {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    badge: "AI",
    title: "GPT-4o Business Plans",
    desc: "8-section plans with personalized market analysis, financial projections, operational roadmap, and risk mitigation."
  },
  {
    icon: BookMarked,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "New",
    title: "Favorites & Bookmarks",
    desc: "Save business ideas you like. Revisit, compare, and plan at your own pace without starting over."
  },
  {
    icon: BookOpen,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    badge: "New",
    title: "Skill Gap Analysis",
    desc: "See exactly which skills you already have for a business, which are missing, and curated resources to close the gap."
  },
  {
    icon: GitCompare,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    badge: "New",
    title: "Business Comparison",
    desc: "Select any two business ideas and see them side-by-side — capital, profit, risk, skill requirements, and match scores."
  },
  {
    icon: Milestone,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    badge: "New",
    title: "Launch Milestone Tracker",
    desc: "A personalized launch checklist with 10 actionable milestones. Check off each step as you move toward opening day."
  },
  {
    icon: Wand2,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    badge: "New",
    title: "AI Business Name Generator",
    desc: "Generate 5 creative, brandable business names for your chosen idea with one click — powered by GPT-4o."
  },
  {
    icon: BarChart3,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "Core",
    title: "Real-time Dashboard",
    desc: "E2B readiness score, plan activity charts, capital readiness, and personalized action items — all live, never hardcoded."
  },
  {
    icon: Shield,
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
    badge: "Core",
    title: "Secure & Private",
    desc: "bcrypt-hashed passwords, JWT auth, ownership-checked plan access, and rate-limited endpoints. Production-grade security."
  },
];

const BADGE_COLORS = {
  "Core": "bg-slate-800 text-slate-400 border-slate-700",
  "AI": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "New": "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
};

export default function Features() {
  return (
    <section id="features" className="py-28 bg-slate-900/15 border-y border-slate-800/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="section-label mb-3">What You Get</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything to go from<br />
            <span className="gradient-text">idea to launch</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Not just recommendations — a complete toolset designed around the real challenges of transitioning from employment to entrepreneurship.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.5 }}
                className="glass rounded-2xl p-6 group hover:border-slate-700/80 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 border rounded-xl ${feat.bg}`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE_COLORS[feat.badge]}`}>
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
