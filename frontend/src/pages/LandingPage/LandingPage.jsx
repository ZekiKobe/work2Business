import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, BarChart3, UserCheck, CheckCircle2, ChevronDown,
  Zap, Building2, Shield, Lightbulb, TrendingUp, Brain, Users, Target,
  Star, Clock, DollarSign, ChevronRight
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const STEPS = [
  { num: "01", icon: UserCheck, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Build Your Profile", desc: "Tell us about your profession, skills, available capital, and business interests in our guided 6-step onboarding." },
  { num: "02", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", title: "Get Matched", desc: "Our multi-dimensional scoring engine analyzes your profile against 15+ business ideas and ranks them by fit." },
  { num: "03", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", title: "Generate AI Plans", desc: "One click generates a full AI-powered business plan tailored to your profile — executive summary, financials, and launch roadmap." },
  { num: "04", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Launch & Track", desc: "Track your E2B readiness score, manage plans, and take action steps toward launching your venture." }
];

const FEATURES = [
  { icon: Target, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", title: "Precision Matching", desc: "6-factor scoring engine considers capital, skills, interests, hours, salary replacement, and risk — not just generic suggestions." },
  { icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", title: "GPT-4o Powered Plans", desc: "AI generates personalized 8-section business plans with financial projections, market analysis, and a 90-day launch roadmap." },
  { icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Real-time Analytics", desc: "Live dashboard tracks your E2B readiness score, plan generation history, and capital deployment readiness." },
  { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Secure & Private", desc: "Your financial and professional data is encrypted and never shared. JWT-based auth with secure password management." },
  { icon: Users, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", title: "15+ Business Categories", desc: "From Tech to Healthcare, Finance to Creative — we cover the full spectrum of viable business opportunities." },
  { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", title: "Instant Fallback Plans", desc: "AI unavailable? Our rule-based engine generates complete plans instantly — no delays, always covered." }
];

const TESTIMONIALS = [
  { name: "Sara M.", role: "Former Bank Analyst → Finance Consultant", stars: 5, text: "Work2Business matched me with financial consulting as my top idea. Three months later I have 4 clients and replaced 70% of my salary." },
  { name: "Yonas T.", role: "Software Engineer → Tech Agency Owner", stars: 5, text: "The AI business plan was incredibly detailed. It gave me a real 90-day roadmap. I launched in 6 weeks and already have my first paid project." },
  { name: "Liya B.", role: "HR Manager → HR Consultancy Founder", stars: 5, text: "The matching score explained exactly why each business was a fit — I could see how my skills and capital aligned. Made the decision so much easier." }
];

const FAQS = [
  { q: "How does the business matching work?", a: "We score every business idea across 6 dimensions: capital match, skill overlap, interest alignment, hours availability, salary replacement potential, and risk level. Each dimension contributes to a 0–100 match score, so you see exactly why a business is or isn't a fit." },
  { q: "Is the AI-generated business plan actually useful?", a: "Yes. We use GPT-4o-mini with a detailed prompt that includes your full profile — profession, capital, skills, interests, and the specific business idea. The output includes executive summary, market analysis, financial projections, 90-day roadmap, risk analysis, and key milestones. It's not a template." },
  { q: "Can I start if I have limited capital?", a: "Absolutely. Several ideas in our catalog (online training, graphic design, content creation) require under 10,000 ETB to start. The platform shows you which ideas are achievable at your capital level and which require planning to reach." },
  { q: "Is my financial information secure?", a: "Yes. Financial data is stored securely, never sold, and only used to personalize your recommendations. We use bcrypt password hashing, JWT authentication, and HTTPS in production." },
  { q: "What happens after I generate a business plan?", a: "You can view the full plan any time from your Plans dashboard, share it, or use it as a foundation for your actual business. We're building mentor matching and milestone tracking features next." }
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-300 antialiased overflow-x-hidden font-sans">
      {/* Global background elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/[0.04] blur-[150px] pointer-events-none" />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080d1a]/85 border-b border-slate-800/60 px-5 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-glow-sm group-hover:scale-105 transition-transform">
            <Building2 className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">Work2Business</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm px-4 py-2"
          >
            Get Started Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative px-5 lg:px-10 pt-24 pb-20 text-center max-w-5xl mx-auto z-10">
        <motion.div {...fadeInUp}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-slate-400">AI-powered career-to-business transition</span>
            <span className="text-indigo-400 font-semibold flex items-center gap-1">
              12,400+ professionals <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
            Your career skills are
            <span className="block gradient-text mt-2">your business foundation.</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Work2Business analyzes your professional background, available capital, and interests to match you with the right business ideas — then generates a full AI business plan in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto sm:max-w-none">
            <Link to="/register" className="btn-primary px-7 py-3.5 text-sm">
              Start for free — takes 3 minutes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-7 py-3.5 text-sm">
              Sign in to your account
            </Link>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 pt-12 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "12,400+", label: "Profiles Created" },
            { value: "15+", label: "Business Categories" },
            { value: "87%", label: "Avg Match Score" },
            { value: "6-factor", label: "Scoring Engine" }
          ].map((stat, i) => (
            <div key={i} className={`text-left ${i === 0 ? "border-l-2 border-indigo-500 pl-4" : "border-l border-slate-800 pl-4"}`}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5 font-semibold">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-5 lg:px-10 py-24 border-t border-slate-800/40 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">From employee to entrepreneur</h2>
          <p className="text-slate-400 mt-3 text-base max-w-xl mx-auto">Four clear steps to discover and launch your business</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-slate-600 font-mono">{step.num}</span>
                  <div className={`p-2.5 border rounded-xl ${step.bg}`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-5 lg:px-10 py-24 border-t border-slate-800/40 bg-slate-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Platform Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Everything you need to launch</h2>
            <p className="text-slate-400 mt-3 text-base max-w-xl mx-auto">Production-grade features for your entrepreneurship journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-hover rounded-2xl p-6 group"
                >
                  <div className={`p-3 border rounded-xl w-fit mb-4 ${feat.bg}`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-5 lg:px-10 py-24 border-t border-slate-800/40 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Success Stories</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">People who made the leap</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="border-t border-slate-800 pt-4">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-5 lg:px-10 py-24 border-t border-slate-800/40 bg-slate-900/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Pricing</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-3 text-sm">Start free. Upgrade when you're ready to launch.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="glass rounded-2xl p-7 flex flex-col">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starter</p>
                <div className="mt-5 mb-6">
                  <span className="text-5xl font-extrabold text-white">$0</span>
                  <span className="text-slate-500 text-sm ml-2">forever free</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  {["Profile setup & matching", "View all recommendations", "1 AI business plan", "Basic dashboard"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="mt-8 btn-secondary justify-center">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-indigo-950/80 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-7 flex flex-col shadow-glow">
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Founder Pro</p>
                <div className="mt-5 mb-6">
                  <span className="text-5xl font-extrabold text-white">$49</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {[
                    "Everything in Starter",
                    "Unlimited AI business plans",
                    "Advanced analytics & tracking",
                    "Export plans to PDF",
                    "Priority support"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register" className="mt-8 btn-primary justify-center">
                Start free trial <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-5 lg:px-10 py-24 border-t border-slate-800/40 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">Common questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-medium text-slate-200 hover:bg-slate-800/30 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-3 ${openFaq === i ? "rotate-180 text-indigo-400" : ""}`} />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800"
                >
                  <div className="pt-4">{item.a}</div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 lg:px-10 py-28 text-center border-t border-slate-800/40 bg-gradient-to-b from-transparent via-indigo-950/10 to-[#080d1a]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">Ready to Begin?</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Your business is waiting.<br />
            <span className="gradient-text">Start building it today.</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed mb-10">
            Join thousands of professionals who have discovered their ideal business path using Work2Business.
          </p>
          <Link to="/register" className="btn-primary px-8 py-4 text-base">
            Create your free account <Zap className="w-4 h-4 fill-current" />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/40 bg-[#050810] px-5 lg:px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <Building2 className="text-white w-3 h-3" />
          </div>
          <span className="text-slate-500">&copy; {new Date().getFullYear()} Work2Business Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-slate-600">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
        </div>
      </footer>
    </div>
  );
}
