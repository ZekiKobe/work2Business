import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

export default function DashboardLayout({
  children
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <div className="lg:pl-72">

        <Topbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}