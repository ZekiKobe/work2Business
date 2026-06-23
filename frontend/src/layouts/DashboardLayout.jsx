import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

export default function DashboardLayout({
  children
}) {
  return (
    // Updated root layout wrapper to use slate-950 and force white text defaults
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30">

      {/* SIDEBAR NAVIGATION PANEL */}
      <Sidebar />

      {/* MAIN CONTENT WORKSPACE VIEW */}
      <div className="lg:pl-72 flex flex-col min-h-screen">

        {/* SITE TOP INTEGRATION BAR */}
        <Topbar />

        {/* CONTAINER VIEWPORTS */}
        <main className="p-6 flex-1 bg-slate-950">
          {children}
        </main>

      </div>

    </div>
  );
}