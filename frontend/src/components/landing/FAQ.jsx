import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need startup experience to use Work2Business?",
    a: "Not at all. That's the whole point. Work2Business is specifically designed for employees who have never started a business before. It turns your existing professional experience, skills, and capital into a concrete business plan — no entrepreneur background required."
  },
  {
    q: "How accurate is the business matching?",
    a: "We score every idea across 6 dimensions tailored to your exact profile: capital coverage, skill overlap, interest alignment, weekly hours available, salary replacement potential, and risk tolerance. The result is a 0–100 match score with a transparent breakdown — you can see exactly why each score is what it is."
  },
  {
    q: "What does the AI business plan actually include?",
    a: "8 sections: Executive Summary, Market Analysis, Business Model, Financial Plan (with startup costs, monthly expenses, and revenue projections), Marketing Strategy, 90-day Operational Roadmap, Risk Analysis, and Key Milestones. It's generated using GPT-4o with your specific profile data injected — not a template."
  },
  {
    q: "What are the new features like Skill Gap Analysis and Business Comparison?",
    a: "Skill Gap Analysis shows you — for any business idea — exactly which required skills you already have and which ones you need to develop, with learning resource suggestions. Business Comparison lets you pick two ideas and view every metric side-by-side to make a confident decision."
  },
  {
    q: "What if the AI fails to generate a plan?",
    a: "We have a rule-based fallback engine that generates a complete plan instantly — covering executive summary, financial projections, marketing strategy, and operational plan. You'll be notified if AI was used or if the fallback was triggered. You're never left with nothing."
  },
  {
    q: "Is my financial information private?",
    a: "Completely. Your salary, capital, and financial data are stored securely, never sold, and only used to compute your business match scores and plan projections. We use bcrypt password hashing, JWT authentication, and all endpoints require ownership verification."
  },
  {
    q: "Can I save ideas I like and come back later?",
    a: "Yes — use the Favorites/Bookmarks feature to save any business idea with one click. Your saved ideas appear in a dedicated filter on the Recommendations page so you can revisit them anytime."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-28">
      <div className="max-w-3xl mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label mb-3">FAQ</p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className={`text-sm font-semibold transition-colors ${open === i ? "text-white" : "text-slate-200"}`}>
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-indigo-400" : "text-slate-500"}`}
                />
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
