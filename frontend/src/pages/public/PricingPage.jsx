import PublicPageLayout from "../../layouts/PublicPageLayout";
import Pricing from "../../components/landing/Pricing";
import FAQ from "../../components/landing/FAQ";
import CTASection from "../../components/landing/CTASection";

export default function PricingPage() {
  return (
    <PublicPageLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-4 text-center">
          <p className="section-label mb-3">Product</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when you are ready to launch with full AI planning power.
          </p>
        </div>
        <Pricing />
        <FAQ />
        <CTASection />
      </div>
    </PublicPageLayout>
  );
}
