import PublicPageLayout from "../../layouts/PublicPageLayout";
import HowItWorks from "../../components/landing/HowItWorks";
import CTASection from "../../components/landing/CTASection";

export default function HowItWorksPage() {
  return (
    <PublicPageLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-4 text-center">
          <p className="section-label mb-3">Product</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Work2Business works
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From employee profile to launch-ready business plan in four clear steps.
          </p>
        </div>
        <HowItWorks />
        <CTASection />
      </div>
    </PublicPageLayout>
  );
}
