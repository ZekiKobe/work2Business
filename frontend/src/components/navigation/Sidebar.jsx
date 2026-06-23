import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Building2
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Recommendations", icon: Briefcase, path: "/recommendations" },
  { name: "Business Plans", icon: FileText, path: "/plans" },
  { name: "Profile", icon: User, path: "/profile" }
];

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-72
        bg-slate-950
        border-r border-slate-900
        flex flex-col
        z-40
      "
    >
      {/* BRAND & IDENTITY */}
      <div className="px-6 py-6 border-b border-slate-900 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-950/50">
            <Building2 className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-slate-50 to-slate-400 bg-clip-text">
            Work2Business
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase mt-1">
          E2B Transition Engine
        </p>
      </div>

      {/* MENU NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                relative flex items-center gap-3.5
                px-4 py-3 rounded-xl
                text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100 border border-transparent"
                }
              `
              }
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE GLOW INDICATOR */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}

                  <Icon 
                    size={18} 
                    className={`transition-colors duration-200 ${
                      isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    }`} 
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="
            flex items-center gap-3.5
            w-full px-4 py-3
            rounded-xl
            text-sm font-medium
            text-rose-400/90
            hover:bg-rose-500/10 hover:text-rose-400
            border border-transparent hover:border-rose-500/20
            transition-all duration-200
          "
        >
          <LogOut size={18} className="text-rose-400/70" />
          <span>Logout System</span>
        </button>

        <p className="text-[10px] font-mono text-slate-600 mt-4 text-center tracking-wider">
          v2.4.0 // COGNITIVE ENGINE
        </p>
      </div>
    </aside>
  );
}