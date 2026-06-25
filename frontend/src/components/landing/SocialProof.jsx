import { motion } from "framer-motion";
import { Users, TrendingUp, Zap, Award } from "lucide-react";

const STATS = [
  { icon: Users, value: "12,400+", label: "Professionals Onboarded", color: "text-indigo-400" },
  { icon: TrendingUp, value: "87%", label: "Average Match Accuracy", color: "text-emerald-400" },
  { icon: Zap, value: "< 30s", label: "AI Plan Generation Time", color: "text-amber-400" },
  { icon: Award, value: "15+", label: "Business Categories", color: "text-purple-400" },
];

export default function SocialProof() {
  return (
    <section className="border-y border-slate-800/50 bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`mb-3 ${stat.color}`}>
                  <Icon className="w-5 h-5 mx-auto mb-2 opacity-70" />
                  <p className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider leading-relaxed">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
