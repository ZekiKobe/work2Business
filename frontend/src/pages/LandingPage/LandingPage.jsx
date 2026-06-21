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
    <div className="min-h-screen bg-[#030712] text-slate-200 antialiased selection:bg-blue-500/20 tracking-normal font-sans">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-indigo-500/[0.02] blur-[150px] pointer-events-none" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/75 border-b border-white/[0.06] px-6 lg:px-16 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-inner">
            <Building2 className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text">
            Work2Business
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#process" className="hover:text-white transition-colors duration-200">Architecture</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
        </nav>

        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-medium text-white rounded-lg group bg-gradient-to-br from-blue-600 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-500 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-800 mt-2"
          >
            <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#030712] rounded-md group-hover:bg-opacity-0">
              Get Started Free
            </span>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 lg:px-8 pt-28 pb-24 text-center max-w-5xl mx-auto z-10">
        {/* Border Pill Alert */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-slate-300 text-xs font-medium mb-8 backdrop-blur-md">
          <Sparkles size={12} className="text-blue-400" />
          <span className="text-slate-400">Introducing Studio Engine v2.4 —</span>
          <span className="text-blue-400 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
            Read Release Note <ArrowRight size={10} />
          </span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto text-white">
          Your career is data.
          <span className="block mt-2 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Turn it into equity.
          </span>
        </h1>

        <p className="text-slate-400 mt-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Work2Business parses enterprise workflows, isolates competitive domain expertise, and constructs automated operating roadmaps directly from your track record.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-md mx-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#030712] hover:bg-slate-200 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            Extract Your Profile <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white font-medium text-sm rounded-lg transition-all duration-200"
          >
            Explore Sandbox Docs
          </Link>
        </div>

        {/* REFINED METRICS MATRIX */}
        <div className="mt-28 pt-12 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-left">
          <div className="border-l border-blue-500/30 pl-4">
            <p className="text-2xl font-bold tracking-tight text-white font-mono">12.4K</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Pipelines Formed</p>
          </div>
          <div className="border-l border-white/[0.08] pl-4">
            <p className="text-2xl font-bold tracking-tight text-white font-mono">$4.2M</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Originated Cap</p>
          </div>
          <div className="border-l border-white/[0.08] pl-4">
            <p className="text-2xl font-bold tracking-tight text-white font-mono">87.2%</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Conversion Rate</p>
          </div>
          <div className="border-l border-white/[0.08] pl-4">
            <p className="text-2xl font-bold tracking-tight text-white font-mono">0.0ms</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Data Latency</p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (ASYMMETRIC GRID DESIGN) */}
      <section id="features" className="px-6 lg:px-16 py-28 border-t border-white/[0.06] bg-[#050b18]/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-20">
            <div className="max-w-xl">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest block mb-3">System Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Engineered to isolate structural leverage options</h2>
            </div>
            <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed self-end">
              We remove conceptual generalities. Our model transforms unstructured job profiles into exact operational matrix units.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature card 1 */}
            <div className="bg-white/[0.01] border border-white/[0.06] p-8 rounded-xl hover:bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 flex flex-col justify-between min-h-[260px]">
              <UserCheck size={20} className="text-blue-400" />
              <div>
                <h3 className="font-bold text-base text-white tracking-tight">Structured Vector Parsing</h3>
                <p className="text-slate-400 mt-2.5 text-xs sm:text-sm leading-relaxed font-normal">
                  Convert CV entries and historical codebases into vector embeddings representing explicit skill architectures.
                </p>
              </div>
            </div>

            {/* Feature card 2 */}
            <div className="bg-white/[0.01] border border-white/[0.06] p-8 rounded-xl hover:bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 flex flex-col justify-between min-h-[260px]">
              <Cpu size={20} className="text-purple-400" />
              <div>
                <h3 className="font-bold text-base text-white tracking-tight">Market Asymmetry Analysis</h3>
                <p className="text-slate-400 mt-2.5 text-xs sm:text-sm leading-relaxed font-normal">
                  Automatically match your architectural skill graph against live real-world micro-B2B gaps and processing demands.
                </p>
              </div>
            </div>

            {/* Feature card 3 */}
            <div className="bg-white/[0.01] border border-white/[0.06] p-8 rounded-xl hover:bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 flex flex-col justify-between min-h-[260px]">
              <BarChart3 size={20} className="text-emerald-400" />
              <div>
                <h3 className="font-bold text-base text-white tracking-tight">Automated Fiscal Runways</h3>
                <p className="text-slate-400 mt-2.5 text-xs sm:text-sm leading-relaxed font-normal">
                  Generate complete multi-year cap tables, margin analysis, and subscription pricing strategies inside isolated sandboxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFINED PIPELINE WORKFLOW */}
      <section id="process" className="px-6 lg:px-16 py-28 max-w-6xl mx-auto">
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest block mb-3">Architecture Workflow</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">The ingestion matrix, visualized.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/40 to-transparent absolute top-0 left-0 mb-4 hidden lg:block" />
            <div className="text-[11px] font-mono text-blue-500 font-bold mb-4 tracking-wider">STAGE // 01</div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Layers size={14} className="text-slate-400" /> Secure Data Pull
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-3.5 leading-relaxed">
              Drop job parameters into zero-retention staging servers under TLS 1.3 verification protocols.
            </p>
          </div>

          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/40 to-transparent absolute top-0 left-0 mb-4 hidden lg:block" />
            <div className="text-[11px] font-mono text-indigo-400 font-bold mb-4 tracking-wider">STAGE // 02</div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu size={14} className="text-slate-400" /> Matrix Deconstruction
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-3.5 leading-relaxed">
              ML clusters trace core values out of plain prose text patterns to detect domain leverage items.
            </p>
          </div>

          <div className="relative group">
            <div className="h-[1px] w-full bg-gradient-to-r from-purple-500/40 to-transparent absolute top-0 left-0 mb-4 hidden lg:block" />
            <div className="text-[11px] font-mono text-purple-400 font-bold mb-4 tracking-wider">STAGE // 03</div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={14} className="text-slate-400" /> Parameter Stress-Testing
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-3.5 leading-relaxed">
              Simulate cash runrates against historical market trends using targeted pricing variables.
            </p>
          </div>

          <div className="relative group">
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-4 tracking-wider">STAGE // 04</div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield size={14} className="text-slate-400" /> Production Asset Export
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-3.5 leading-relaxed">
              Instantly ship clean spreadsheets, pitch formats, and entity setup plans.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING (MINIMALIST TECH TIERS) */}
      <section id="pricing" className="px-6 lg:px-16 py-28 bg-[#050b18]/40 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-white">Transparent, fixed capital pricing</h2>
            <p className="text-slate-400 mt-3 text-sm">No recurring monthly traps. Pay explicitly per runtime orchestration.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white/[0.01] p-8 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">Standard Matrix</h3>
                <p className="text-slate-400 text-xs mt-1.5">For evaluating foundational vectors.</p>
                <div className="my-8">
                  <span className="text-4xl font-bold tracking-tight text-white font-mono">$0</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/[0.04] pt-6">
                  <li className="flex items-center gap-2.5 text-slate-400"><CheckCircle2 size={14} className="text-blue-500" /> Basic skill schema mapping</li>
                  <li className="flex items-center gap-2.5 text-slate-400"><CheckCircle2 size={14} className="text-blue-500" /> 1 Sandbox calculation run</li>
                  <li className="flex items-center gap-2.5 text-slate-400"><CheckCircle2 size={14} className="text-blue-500" /> Standard log storage options</li>
                </ul>
              </div>
              <Link to="/register" className="mt-10 block w-full text-center py-2.5 text-xs rounded-lg border border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.04] font-medium text-white transition-colors">
                Initialize Instance
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#070e1e] p-8 rounded-xl border border-blue-500/40 relative flex flex-col justify-between shadow-2xl shadow-blue-500/[0.03]">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono tracking-wider uppercase font-bold">Production ready</span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">Founder Core</h3>
                <p className="text-slate-400 text-xs mt-1.5">Full processing power for building pipelines.</p>
                <div className="my-8 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-white font-mono">$49</span>
                  <span className="text-slate-500 text-xs font-mono">/ single pass</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/[0.04] pt-6">
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-blue-500" /> Unlimited AI strategy generations</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-blue-500" /> Full operational runway exports (.xlsx, .json)</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-blue-500" /> Market Gap matching metrics API</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-blue-500" /> Priority cluster queue positioning</li>
                </ul>
              </div>
              <Link to="/register" className="mt-10 block w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98]">
                Deploy Production Tier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL CODE-STYLE FAQ ACCORDION */}
      <section id="faq" className="px-6 lg:px-16 py-28 max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest block mb-3">Knowledge Base</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Queries</h2>
        </div>

        <div className="space-y-3">
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
            <div key={index} className="border border-white/[0.06] bg-white/[0.01] rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-200 hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-mono tracking-tight text-white">{`[0${index + 1}] ${item.q}`}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${openFaq === index ? "rotate-180 text-blue-400" : ""}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4.5 pt-1.5 text-slate-400 text-xs leading-relaxed border-t border-white/[0.04]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL HIGH-CONVERTING CTA */}
      <section className="px-6 lg:px-16 py-32 text-center relative border-t border-white/[0.06] bg-gradient-to-b from-transparent to-[#040914]">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Unshackle your true leverage.
        </h2>
        <p className="text-slate-400 mt-5 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Stop contributing your structural engineering output to a steady base salary. Initialize your standalone runtime map now.
        </p>

        <div className="mt-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs bg-white text-black font-bold rounded-lg shadow-xl hover:bg-slate-200 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Deploy Your Matrix Instance <Zap size={12} className="fill-current" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#030712] px-8 lg:px-16 py-10 text-slate-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto font-mono">
        <div>
          &copy; {new Date().getFullYear()} Work2Business Inc. [STAGING_ENV].
        </div>
        <div className="flex gap-6 text-slate-400">
          <a href="#" className="hover:text-white transition-colors duration-200">/privacy_policy</a>
          <a href="#" className="hover:text-white transition-colors duration-200">/terms_of_service</a>
          <a href="#" className="hover:text-white transition-colors duration-200">/security_manifest</a>
        </div>
      </footer>

    </div>
  );
}