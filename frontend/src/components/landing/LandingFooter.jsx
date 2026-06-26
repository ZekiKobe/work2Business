import { Link } from "react-router-dom";
import { Building2, Globe, Share2, ExternalLink } from "lucide-react";

const PRODUCT_LINKS = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/register", label: "Get Started" },
];

const PLATFORM_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/plans", label: "Business Plans" },
  { to: "/settings", label: "Profile Settings" },
];

const COMPANY_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/security", label: "Security" },
  { to: "/contact", label: "Contact" },
];

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
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 hover:text-slate-200 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Platform</p>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 hover:text-slate-200 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 hover:text-slate-200 text-sm transition-colors">
                    {link.label}
                  </Link>
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
            <Link to="/" title="Home" className="p-2 text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors">
              <Globe className="w-4 h-4" />
            </Link>
            <Link to="/features" title="Features" className="p-2 text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </Link>
            <Link to="/contact" title="Contact" className="p-2 text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
