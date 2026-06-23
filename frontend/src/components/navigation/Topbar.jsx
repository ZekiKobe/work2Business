import { Bell, Search } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 flex items-center justify-between sticky top-0 z-40">

      {/* SEARCH INTERFACE */}
      <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800 px-3 py-2 rounded-xl w-64 focus-within:w-72 focus-within:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200">
        <Search size={16} className="text-slate-500" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-xs font-medium text-slate-200 placeholder-slate-600 w-full"
        />
      </div>

      {/* UTILITY & PROFILE ACTIONS */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <button className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-900 rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </button>

        {/* PROFILE METADATA CONTAINER */}
        <div className="flex items-center gap-3 border-l border-slate-900 pl-6">
          
          {/* USER AVATAR BADGE */}
          <div className="h-9 w-9 rounded-xl bg-blue-600 font-mono text-sm font-bold text-white flex items-center justify-center shadow-lg shadow-blue-600/10 uppercase select-none">
            {user?.firstName?.[0] || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 tracking-tight leading-none">
              {user?.firstName || "Operator"}
            </p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mt-1 leading-none">
              Partner
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}