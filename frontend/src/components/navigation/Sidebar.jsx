import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Recommendations", icon: Briefcase, path: "/recommendations" },
  { name: "Business Plans", icon: FileText, path: "/plans" },
  { name: "Profile", icon: User, path: "/profile" }
];

export default function Sidebar() {
  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-72
        bg-white
        border-r
        flex flex-col
        shadow-sm
      "
    >
      {/* BRAND */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">
          Work2Business
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Business Intelligence Platform
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                relative flex items-center gap-3
                px-4 py-3 rounded-xl
                text-sm font-medium
                transition-all duration-200

                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `
              }
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE INDICATOR BAR */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                  )}

                  <Icon size={18} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t bg-gray-50">
        <button
          className="
            flex items-center gap-3
            w-full px-4 py-3
            rounded-xl
            text-red-500
            hover:bg-red-50
            transition
            font-medium
          "
        >
          <LogOut size={18} />
          Logout
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          v1.0.0 • AI Business Suite
        </p>
      </div>
    </aside>
  );
}