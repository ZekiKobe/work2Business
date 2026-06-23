import { motion } from "framer-motion";

export default function AuthLayout({
  children
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-100 antialiased">
      
      {/* BRAND/HERO PROMO SPLIT SIDE */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-slate-950 border-r border-slate-900 relative overflow-hidden">
        
        {/* Subtle Tech Grid Accent Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
        
        {/* Floating Ambient Light Glow Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center space-y-3">
          <h1 className="text-5xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Work2Business
          </h1>
          <p className="text-sm font-medium tracking-wide text-slate-500 max-w-sm font-mono uppercase">
            AI-Driven Venture Structuring Engine
          </p>
        </div>
      </div>

      {/* INTERACTIVE FORM CONTAINER SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <motion.div
          initial={{
            opacity: 0,
            y: 15
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
          className="w-full max-w-md bg-slate-900/20 border border-slate-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          {children}
        </motion.div>
      </div>

    </div>
  );
}