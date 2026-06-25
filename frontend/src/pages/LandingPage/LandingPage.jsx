import LandingNavbar from "../../components/landing/LandingNavbar";
import Hero from "../../components/landing/Hero";
import SocialProof from "../../components/landing/SocialProof";
import HowItWorks from "../../components/landing/HowItWorks";
import Features from "../../components/landing/Features";
import Testimonials from "../../components/landing/Testimonials";
import Pricing from "../../components/landing/Pricing";
import FAQ from "../../components/landing/FAQ";
import CTASection from "../../components/landing/CTASection";
import LandingFooter from "../../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-300 antialiased overflow-x-hidden font-sans">
      <LandingNavbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
