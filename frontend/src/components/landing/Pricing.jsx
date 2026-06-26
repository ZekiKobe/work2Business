import { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getPlanCta } from "../../constants/plans";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "ETB 0",
    period: "forever free",
    desc: "Everything you need to discover your business path.",
    highlight: false,
    features: [
      "6-step profile onboarding",
      "AI match scoring (all 15+ ideas)",
      "1 AI-powered business plan",
      "Skill gap analysis",
      "Basic dashboard & stats",
      "Bookmark 3 favorite ideas",
    ]
  },
  {
    id: "founder",
    name: "Founder",
    price: "ETB 2,500",
    period: "/ year",
    desc: "Unlimited power for serious entrepreneurs.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Unlimited AI business plans",
      "Business idea comparison tool",
      "Launch milestone tracker",
      "AI business name generator (unlimited)",
      "Unlimited bookmarks",
      "Priority AI plan generation",
      "Export plans to PDF",
      "Priority support",
    ]
  }
];

export default function Pricing() {
  const { user } = useContext(AuthContext);

  return (
    <section id="pricing" className="py-28 bg-slate-900/15 border-y border-slate-800/40">
      <div className="max-w-4xl mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">Pricing</p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            Choose a plan and get started — free forever or upgrade when you are ready to launch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => {
            const cta = getPlanCta(plan.id, user);
            const isCurrent =
              user?.subscription?.plan === plan.id &&
              user?.subscription?.status === "active";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-br from-indigo-950/80 via-slate-900/80 to-slate-900 border-2 border-indigo-500/60 shadow-[0_0_60px_rgba(99,102,241,0.12)]"
                    : "glass"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                )}

                {isCurrent && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/30">
                    Current
                  </span>
                )}

                <div className="mb-6">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-indigo-400" : "text-slate-500"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{plan.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-400" : "text-slate-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={cta.to}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.97] ${
                    plan.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      : "bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200"
                  } ${isCurrent && plan.id === "founder" ? "opacity-60 pointer-events-none" : ""}`}
                >
                  {plan.highlight ? <Zap className="w-4 h-4" /> : null}
                  {cta.label}
                  {!(isCurrent && plan.id === "founder") ? <ArrowRight className="w-4 h-4" /> : null}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
