import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ADMIN_MENU } from "../../constants/adminNav";

export default function AdminSidebar({ isOpen = false, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-[#0a0f1e] border-r border-amber-900/20 flex flex-col z-40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-glow-sm shrink-0">
              <ShieldCheck className="text-white w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-white tracking-tight block">Work2Business</span>
              <span className="text-[10px] text-amber-400/90 font-medium uppercase tracking-widest">Admin Console</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {user && (
        <div className="mx-3 mt-4 mb-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm select-none">
              {user.firstName?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-amber-400/80 truncate">Platform Administrator</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 mt-2">Management</p>
        {ADMIN_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "bg-amber-500/15 text-amber-200 border border-amber-500/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-amber-400 rounded-r-full" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-amber-400/60" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800/60 space-y-1">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
        <p className="text-center text-[10px] text-slate-700 pt-1">&copy; {new Date().getFullYear()} Work2Business</p>
      </div>

      {createPortal(
        <AnimatePresence>
          {showLogoutConfirm && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
              onClick={() => setShowLogoutConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="bg-[#0d1425] border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Sign out?</p>
                    <p className="text-xs text-slate-500 mt-0.5">You will need to sign in again to continue.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </aside>
  );
}
