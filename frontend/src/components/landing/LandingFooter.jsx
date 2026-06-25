import { Link } from "react-router-dom";
import { Building2, Globe, Share2, ExternalLink } from "lucide-react";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/40 bg-[#040810]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Work2Business</span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed">
              The AI-powered platform that transforms employee expertise into entrepreneurship. Build your profile, get matched, launch.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-2.5">
              {[
                { href: "#how-it-works", label: "How It Works" },
                { href: "#features", label: "Features" },
                { href: "#pricing", label: "Pricing" },
                { href: "/register", label: "Get Started" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-500 hover:text-slate-200 text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Platform</p>
            <ul className="space-y-2.5">
              {[
                { label: "Dashboard" },
                { label: "Recommendations" },
                { label: "Business Plans" },
                { label: "Profile Settings" },
              ].map((item) => (
                <li key={item.label}>
                  <span className="text-slate-500 text-sm">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Security", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            &copy; {year} Work2Business Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { icon: Globe, href: "#" },
              { icon: Share2, href: "#" },
              { icon: ExternalLink, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="p-2 text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
