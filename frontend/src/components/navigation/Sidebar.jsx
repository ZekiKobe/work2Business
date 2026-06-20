import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
//   Settings,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/"
  },
  {
    name: "Recommendations",
    icon: Briefcase,
    path: "/recommendations"
  },
  {
    name: "Business Plans",
    icon: FileText,
    path: "/plans"
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile"
  }
];

export default function Sidebar() {
  return (
    <aside
      className="
      fixed
      left-0
      top-0
      h-screen
      w-72
      bg-white
      border-r
      hidden
      lg:flex
      flex-col
      "
    >
      <div className="p-6">

        <h1
          className="
          text-2xl
          font-bold
          text-blue-600
          "
        >
          Work2Business
        </h1>

      </div>

      <nav className="flex-1 px-4">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                mb-2
                transition

                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100"
                }
                `
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}

      </nav>

      <div className="p-4 border-t">

        <button
          className="
          flex
          items-center
          gap-3
          p-4
          w-full
          rounded-xl
          hover:bg-red-50
          text-red-500
          "
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}