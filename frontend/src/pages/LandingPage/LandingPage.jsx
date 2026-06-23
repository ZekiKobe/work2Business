import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Zap,
  Building2,
  Shield,
  Layers,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 antialiased selection:bg-blue-500/30 font-sans tracking-normal overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-indigo-500/[0.015] blur-[180px] pointer-events-none" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-6 lg:px-12 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <Building2 className="text-white w-4 h-4" />
          </div>
          <span className="text-md font-semibold tracking-tight text-white bg-gradient-to-r from-slate-50 via-slate-200 to-slate-400 bg-clip-text">
            Work2Business
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors duration-200">Features</a>
          <a href="#process" className="hover:text-slate-100 transition-colors duration-200">Architecture</a>
          <a href="#pricing" className="hover:text-slate-100 transition-colors duration-200">Pricing</a>
          <a href="#faq" className="hover:text-slate-100 transition-colors duration-200">FAQ</a>
        </nav>

        <div className="flex gap-5 items-center">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 lg:px-8 pt-32 pb-24 text-center max-w-5xl mx-auto z-10">
        {/* Border Pill Alert */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-medium mb-10 backdrop-blur-md shadow-inner">
          <Sparkles size={13} className="text-blue-400 animate-pulse" />
          <span className="text-slate-400">Introducing Studio Engine v2.4 —</span>
          <span className="text-blue-400 font-semibold flex items-center gap-1 hover:text-blue-300 transition-colors cursor-pointer">
            Read Release Notes <ArrowRight size={12} />
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto text-white">
          Your career is data.
          <span className="block mt-3 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Turn it into equity.
          </span>
        </h1>

        <p className="text-slate-400 mt-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal tracking-wide">
          Work2Business parses enterprise workflows, isolates competitive domain expertise, and constructs automated operating roadmaps directly from your track record.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 text-slate-950 hover:bg-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-white/5 active:scale-[0.98]"
          >
            Extract Your Profile <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm rounded-lg transition-all duration-200"
          >
            Explore Sandbox Docs
          </Link>
        </div>

        {/* METRICS MATRIX */}
        <div className="mt-32 pt-16 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
          <div className="border-l-2 border-blue-500 pl-5">
            <p className="text-3xl font-bold tracking-tight text-white font-sans">12.4K</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-2 font-semibold">Pipelines Formed</p>
          </div>
          <div className="border-l border-slate-800 pl-5">
            <p className="text-3xl font-bold tracking-tight text-white font-sans">$4.2M</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-2 font-semibold">Originated Cap</p>
          </div>
          <div className="border-l border-slate-800 pl-5">
            <p className="text-3xl font-bold tracking-tight text-white font-sans">87.2%</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-2 font-semibold">Conversion Rate</p>
          </div>
          <div className="border-l border-slate-800 pl-5">
            <p className="text-3xl font-bold tracking-tight text-white font-sans">0.0ms</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-2 font-semibold">Data Latency</p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="px-6 lg:px-16 py-32 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-24">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-3">System Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">Engineered to isolate structural leverage options</h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed self-end">
              We remove conceptual generalities. Our model transforms unstructured job profiles into exact operational matrix units.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature card 1 */}
            <div className="bg-slate-900/20 border border-slate-800/60 p-8 rounded-xl hover:bg-slate-900/40 hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[280px] shadow-sm">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit">
                <UserCheck size={20} className="text-blue-400" />
              </div>
              <div className="mt-8">
                <h3 className="font-bold text-lg text-white tracking-tight">Structured Vector Parsing</h3>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed font-normal">
                  Convert CV entries and historical codebases into vector embeddings representing explicit skill architectures.
                </p>
              </div>
            </div>

            {/* Feature card 2 */}
            <div className="bg-slate-900/20 border border-slate-800/60 p-8 rounded-xl hover:bg-slate-900/40 hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[280px] shadow-sm">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit">
                <Cpu size={20} className="text-purple-400" />
              </div>
              <div className="mt-8">
                <h3 className="font-bold text-lg text-white tracking-tight">Market Asymmetry Analysis</h3>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed font-normal">
                  Automatically match your architectural skill graph against live real-world micro-B2B gaps and processing demands.
                </p>
              </div>
            </div>

            {/* Feature card 3 */}
            <div className="bg-slate-900/20 border border-slate-800/60 p-8 rounded-xl hover:bg-slate-900/40 hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[280px] shadow-sm">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
                <BarChart3 size={20} className="text-emerald-400" />
              </div>
              <div className="mt-8">
                <h3 className="font-bold text-lg text-white tracking-tight">Automated Fiscal Runways</h3>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed font-normal">
                  Generate complete multi-year cap tables, margin analysis, and subscription pricing strategies inside isolated sandboxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE WORKFLOW */}
      <section id="process" className="px-6 lg:px-16 py-32 max-w-6xl mx-auto">
        <div className="max-w-3xl mb-24">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-3">Architecture Workflow</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">The Ingestion Matrix</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/30 to-transparent absolute top-0 left-0 mb-6 hidden lg:block" />
            <div className="text-[11px] font-semibold text-blue-500 mb-4 tracking-widest uppercase">Stage 01</div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
              <Layers size={16} className="text-slate-400" /> Secure Data Pull
            </h4>
            <p className="text-slate-400 text-sm mt-3.5 leading-relaxed">
              Drop job parameters into zero-retention staging servers under TLS 1.3 verification protocols.
            </p>
          </div>

          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/30 to-transparent absolute top-0 left-0 mb-6 hidden lg:block" />
            <div className="text-[11px] font-semibold text-indigo-400 mb-4 tracking-widest uppercase">Stage 02</div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
              <Cpu size={16} className="text-slate-400" /> Matrix Deconstruction
            </h4>
            <p className="text-slate-400 text-sm mt-3.5 leading-relaxed">
              ML clusters trace core values out of plain prose text patterns to detect domain leverage items.
            </p>
          </div>

          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-purple-500/30 to-transparent absolute top-0 left-0 mb-6 hidden lg:block" />
            <div className="text-[11px] font-semibold text-purple-400 mb-4 tracking-widest uppercase">Stage 03</div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
              <TrendingUp size={16} className="text-slate-400" /> Parameter Testing
            </h4>
            <p className="text-slate-400 text-sm mt-3.5 leading-relaxed">
              Simulate cash runrates against historical market trends using targeted pricing variables.
            </p>
          </div>

          <div className="relative group">
            <div className="text-[11px] font-semibold text-emerald-400 mb-4 tracking-widest uppercase">Stage 04</div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
              <Shield size={16} className="text-slate-400" /> Asset Export
            </h4>
            <p className="text-slate-400 text-sm mt-3.5 leading-relaxed">
              Instantly ship clean spreadsheets, pitch formats, and entity setup plans.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 lg:px-16 py-32 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-24">
            <h2 className="text-3xl font-bold tracking-tight text-white">Transparent, fixed capital pricing</h2>
            <p className="text-slate-400 mt-4 text-sm tracking-wide">No recurring monthly traps. Pay explicitly per runtime orchestration.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl flex flex-col justify-between shadow-lg">
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400">Standard Matrix</h3>
                <p className="text-slate-500 text-xs mt-2">For evaluating foundational vectors.</p>
                <div className="my-10">
                  <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-400 border-t border-slate-900 pt-6">
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Basic skill schema mapping</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> 1 Sandbox calculation run</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Standard log storage options</li>
                </ul>
              </div>
              <Link to="/register" className="mt-10 block w-full text-center py-3 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-white transition-colors">
                Initialize Instance
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-950 p-8 rounded-xl border-2 border-blue-600 relative flex flex-col justify-between shadow-2xl shadow-blue-500/[0.05]">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full tracking-widest uppercase font-bold shadow-md shadow-blue-600/20">Production Ready</span>
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-blue-400">Founder Core</h3>
                <p className="text-slate-500 text-xs mt-2">Full processing power for building pipelines.</p>
                <div className="my-10 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$49</span>
                  <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">/ single pass</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 border-t border-slate-900 pt-6">
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Unlimited AI strategy generations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Full operational runway exports</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Market Gap matching metrics API</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={15} className="text-blue-500 shrink-0" /> Priority cluster queue positioning</li>
                </ul>
              </div>
              <Link to="/register" className="mt-10 block w-full text-center py-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                Deploy Production Tier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="px-6 lg:px-16 py-32 max-w-4xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-3">Knowledge Base</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Queries</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the engine handle data processing isolation?",
              a: "We deploy individual ephemeral processing environments for every ingestion sequence. No inputs are used for baseline foundational model tuning, guaranteeing zero tracking leaks."
            },
            {
              q: "Can I extract maps without previous startup infrastructure experience?",
              a: "Yes. The environment synthesizes your day-to-day corporate workflow items directly into concrete technical operational parameters, erasing corporate translation dependencies."
            },
            {
              q: "What types of formatting structures are exported?",
              a: "You receive fully relational spreadsheet layouts, raw financial projection JSON configurations, and ready-to-present markdown strategy documentation outlines."
            }
          ].map((item, index) => (
            <div key={index} className="border border-slate-900 bg-slate-950 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between text-sm font-medium text-slate-200 hover:bg-slate-900/30 transition-colors"
              >
                <span className="font-medium text-slate-100">{item.q}</span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${openFaq === index ? "rotate-180 text-blue-400" : ""}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm leading-relaxed border-t border-slate-900 bg-slate-900/10">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-36 text-center relative border-t border-slate-900 bg-gradient-to-b from-transparent to-slate-950">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Unshackle your true leverage.
        </h2>
        <p className="text-slate-400 mt-6 text-base max-w-xl mx-auto leading-relaxed tracking-wide">
          Stop contributing your structural engineering output to a steady base salary. Initialize your standalone runtime map now.
        </p>

        <div className="mt-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm bg-slate-100 text-slate-950 font-bold rounded-lg shadow-xl hover:bg-white transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Deploy Your Matrix Instance <Zap size={14} className="fill-current" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 px-8 lg:px-12 py-12 text-slate-600 text-xs flex flex-col sm:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="tracking-wide">
          &copy; {new Date().getFullYear()} Work2Business Inc. All rights reserved.
        </div>
        <div className="flex gap-8 text-slate-500">
          <a href="#" className="hover:text-slate-300 transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors duration-200">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors duration-200">Security</a>
        </div>
      </footer>

    </div>
  );
}