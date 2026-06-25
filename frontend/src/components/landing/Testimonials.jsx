import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sara Mengistu",
    role: "Bank Analyst → Finance Consultant",
    avatar: "SM",
    color: "from-indigo-600 to-blue-600",
    stars: 5,
    quote: "I had no idea where to start with my own business. Work2Business matched me with financial consulting and built a plan so detailed it looked like something a $5,000 consultant would charge for.",
    result: "Replaced 70% of salary in 3 months"
  },
  {
    name: "Yonas Tadesse",
    role: "Software Engineer → Tech Studio Founder",
    avatar: "YT",
    color: "from-purple-600 to-violet-600",
    stars: 5,
    quote: "The AI plan was specific to my exact skills and capital. It didn't just say 'start a software company' — it gave me a 90-day roadmap with weekly milestones. I followed it and landed my first client in week 4.",
    result: "First client in 28 days"
  },
  {
    name: "Liya Bekele",
    role: "HR Manager → HR Consultancy Founder",
    avatar: "LB",
    color: "from-pink-600 to-rose-600",
    stars: 5,
    quote: "What convinced me was the skill gap analysis. I could see exactly what I already knew versus what I needed to learn for each business. That transparency made the decision so much easier.",
    result: "4 corporate clients in 2 months"
  },
  {
    name: "Daniel Haile",
    role: "Accountant → Online Training Center",
    avatar: "DH",
    color: "from-emerald-600 to-teal-600",
    stars: 5,
    quote: "I used the business comparison feature to decide between two ideas I was torn on. Seeing everything side by side — profit potential, required capital, risk — made it obvious which one fit me better.",
    result: "200 students enrolled in first course"
  },
  {
    name: "Marta Solomon",
    role: "Marketing Manager → Digital Agency",
    avatar: "MS",
    color: "from-amber-600 to-orange-600",
    stars: 5,
    quote: "The milestone tracker kept me accountable. I had tried starting a business twice before and gave up. This time, I had clear weekly goals and checked each one off. That made all the difference.",
    result: "Agency profitable in month 5"
  },
  {
    name: "Abel Tesfaye",
    role: "IT Support → Managed Services Business",
    avatar: "AT",
    color: "from-cyan-600 to-blue-600",
    stars: 5,
    quote: "I generated the AI business name ideas and one of them — TechBridge Solutions — was perfect. I'm now registered under that name. It's a small thing but it made the business feel real from day one.",
    result: "6 business clients signed in month 2"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">Real Stories</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            People who made the leap
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            From employees to entrepreneurs — powered by Work2Business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 flex flex-col hover:border-slate-700/80 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-indigo-500/40 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.quote}"</p>

              {/* Result badge */}
              <div className="mb-4 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
                <p className="text-xs text-emerald-400 font-semibold">✓ {t.result}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-slate-500 text-[11px]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
