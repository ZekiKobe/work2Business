import { motion } from "framer-motion";
import { UserCheck, Brain, Lightbulb, Rocket, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: UserCheck,
    color: "from-blue-600 to-indigo-600",
    glow: "rgba(99,102,241,0.2)",
    title: "Build Your Profile",
    desc: "Complete a 6-step onboarding -your profession, current employer, monthly salary, available capital, skills, and business interests. Takes 3 minutes.",
    detail: ["No resume upload needed", "Skills from a curated list of 45+", "Capital & time availability tracked"]
  },
  {
    num: "02",
    icon: Brain,
    color: "from-purple-600 to-violet-600",
    glow: "rgba(139,92,246,0.2)",
    title: "Get AI-Matched",
    desc: "Our 6-factor scoring engine ranks every business idea against your exact profile -not generic suggestions.",
    detail: ["Capital match scoring", "Skill overlap analysis", "Interest & hours alignment"]
  },
  {
    num: "03",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.2)",
    title: "Generate Your Plan",
    desc: "One click. GPT-4o writes a complete, personalized business plan -executive summary, financials, marketing strategy, and a 90-day launch roadmap.",
    detail: ["8-section business plan", "Financial projections", "90-day milestone roadmap"]
  },
  {
    num: "04",
    icon: Rocket,
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.2)",
    title: "Track & Launch",
    desc: "Use the milestone tracker, compare ideas, analyze skill gaps, and generate AI business names. Your dashboard updates as you grow.",
    detail: ["Launch milestone tracker", "Skill gap analysis", "Business name generator"]
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.04),transparent)]" />
      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="section-label mb-3">The Process</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            From employee to<br />
            <span className="gradient-text">entrepreneur in 4 steps</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            A clear, guided path -no guesswork, no generic advice. Everything personalized to your situation.
          </p>
        </motion.div>

        {/* Steps -alternating layout */}
        <div className="space-y-8 lg:space-y-0 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-20 bottom-20 w-px bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-emerald-500/20 -translate-x-1/2" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i > 0 ? "lg:mt-20" : ""}`}
              >
                {/* Text */}
                <div className={`${isEven ? "lg:order-1" : "lg:order-2"} mb-8 lg:mb-0`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-black text-slate-600 font-mono tracking-widest">{step.num}</span>
                    <div className={`h-px flex-1 bg-gradient-to-r ${isEven ? step.color : "to-transparent from-transparent via-slate-800"} opacity-40`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-5">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.detail.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual card */}
                <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
                      style={{ background: `radial-gradient(circle, ${step.glow}, transparent)` }}
                    />
                    <div className="relative glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[180px] text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-2xl`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="font-bold text-white text-lg">{step.title}</p>
                      <p className="text-slate-500 text-sm mt-1">Step {step.num}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
