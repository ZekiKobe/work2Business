import { Bell, TrendingUp, CheckCheck, Zap, BookMarked, Milestone, X, Menu } from "lucide-react";
import { useContext, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Your entrepreneurship overview" },
  "/recommendations": { title: "Recommendations", subtitle: "Business ideas matched to your profile" },
  "/plans": { title: "Business Plans", subtitle: "Your AI-generated business plans" },
  "/favorites": { title: "Favorite Plans", subtitle: "Saved plans for quick access" },
  "/profile": { title: "Profile", subtitle: "Manage your professional profile" },
  "/settings": { title: "Settings", subtitle: "Account, notifications, and preferences" },
  "/admin": { title: "Admin Panel", subtitle: "Manage platform users, ideas, and plans" }
};

const NOTIF_ICONS = {
  PLAN_GENERATED: { icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  MILESTONE_COMPLETED: { icon: Milestone, color: "text-amber-400", bg: "bg-amber-500/10" },
  IDEA_FAVORITED: { icon: BookMarked, color: "text-pink-400", bg: "bg-pink-500/10" },
  SYSTEM: { icon: Bell, color: "text-slate-400", bg: "bg-slate-500/10" },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications").then(r => r.data),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const { mutate: markRead } = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(["notifications"])
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => api.patch("/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries(["notifications"])
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleNotifClick = (notif) => {
    if (!notif.read) markRead(notif._id);
    if (notif.link) navigate(notif.link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setOpen(!open); if (!open) refetch(); }}
        className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-indigo-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#0d1425] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
              <p className="text-sm font-bold text-white">Notifications</p>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={() => markAllRead()} className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-7 h-7 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const config = NOTIF_ICONS[notif.type] || NOTIF_ICONS.SYSTEM;
                  const Icon = config.icon;
                  return (
                    <button
                      key={notif._id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-800/30 last:border-0 transition-colors ${
                        notif.read ? "hover:bg-slate-800/20" : "bg-indigo-500/5 hover:bg-indigo-500/8"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${config.bg} shrink-0 mt-0.5`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-snug ${notif.read ? "text-slate-400" : "text-white"}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-700 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Topbar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const page = PAGE_TITLES[pathname] || { title: "Work2Business", subtitle: "" };
  const completeness = user?.profileCompleteness ?? 0;

  return (
    <header className="h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/60 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
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

      {/* Right actions */}
      <div className="flex items-center gap-3">
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

        {/* Notification bell */}
        <NotificationBell />

        {/* User avatar */}
        <div className="flex items-center gap-3 border-l border-slate-800/60 pl-3">
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
