import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

export default function PublicPageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-300 antialiased font-sans flex flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-16">{children}</main>
      <LandingFooter />
    </div>
  );
}
