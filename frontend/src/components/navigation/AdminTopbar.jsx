import { ShieldCheck, Menu } from "lucide-react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAdminPageMeta } from "../../constants/adminNav";

export default function AdminTopbar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const page = getAdminPageMeta(pathname);

  return (
    <header className="h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-amber-900/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate">{page.title}</h2>
          <p className="text-xs text-slate-500 hidden sm:block truncate">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25">
          <ShieldCheck className="w-3 h-3" />
          Admin
        </span>
        <div className="flex items-center gap-3 border-l border-slate-800/60 pl-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-xs select-none">
            {user?.firstName?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-none">
              {user ? `${user.firstName} ${user.lastName}` : "Admin"}
            </p>
            <p className="text-[10px] text-amber-400/80 mt-0.5 leading-none">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
