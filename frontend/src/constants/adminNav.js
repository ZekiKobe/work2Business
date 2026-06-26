import {
  LayoutDashboard,
  Lightbulb,
  Users,
  FileText,
  DollarSign,
  Receipt
} from "lucide-react";

export const ADMIN_MENU = [
  { id: "overview", name: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "ideas", name: "Business Ideas", icon: Lightbulb, path: "/admin/ideas" },
  { id: "users", name: "Users", icon: Users, path: "/admin/users" },
  { id: "plans", name: "Business Plans", icon: FileText, path: "/admin/plans" },
  { id: "payments", name: "Payments", icon: DollarSign, path: "/admin/payments" },
  { id: "invoices", name: "Invoices", icon: Receipt, path: "/admin/invoices" }
];

export const ADMIN_PAGE_META = {
  overview: {
    title: "Overview",
    subtitle: "Platform statistics and quick actions",
    path: "/admin"
  },
  ideas: {
    title: "Business Ideas",
    subtitle: "Manage the recommendation catalog",
    path: "/admin/ideas"
  },
  users: {
    title: "Users",
    subtitle: "Manage accounts and roles",
    path: "/admin/users"
  },
  plans: {
    title: "Business Plans",
    subtitle: "Review and manage user-generated plans",
    path: "/admin/plans"
  },
  payments: {
    title: "Payments",
    subtitle: "View subscription payments",
    path: "/admin/payments"
  },
  invoices: {
    title: "Invoices",
    subtitle: "Issued billing invoices",
    path: "/admin/invoices"
  }
};

export function resolveAdminTab(pathname) {
  if (pathname === "/admin" || pathname === "/admin/") return "overview";
  const match = ADMIN_MENU.find((item) => item.path !== "/admin" && pathname.startsWith(item.path));
  return match?.id || null;
}
