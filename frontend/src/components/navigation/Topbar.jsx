import { Bell, Search, TrendingUp } from "lucide-react";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Your entrepreneurship overview" },
  "/recommendations": { title: "Recommendations", subtitle: "Business ideas matched to your profile" },
  "/plans": { title: "Business Plans", subtitle: "Your AI-generated business plans" },
  "/profile": { title: "Profile", subtitle: "Manage your professional profile" }
};

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const page = PAGE_TITLES[pathname] || { title: "Work2Business", subtitle: "" };
  const completeness = user?.profileCompleteness ?? 0;

  return (
    <header className="h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/60 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Page title */}
      <div>
        <h2 className="text-sm font-bold text-white">{page.title}</h2>
        <p className="text-xs text-slate-500 hidden sm:block">{page.subtitle}</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Profile completion alert */}
        {completeness < 80 && (
          <Link
            to="/profile"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/15 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium">Complete profile — {completeness}%</span>
          </Link>
        )}

        {/* Notification */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 border-l border-slate-800/60 pl-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs select-none">
            {user?.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-none">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-none capitalize">
              {user?.role?.toLowerCase() || "member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
