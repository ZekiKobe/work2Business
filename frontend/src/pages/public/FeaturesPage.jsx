import PublicPageLayout from "../../layouts/PublicPageLayout";
import Features from "../../components/landing/Features";
import CTASection from "../../components/landing/CTASection";

export default function FeaturesPage() {
  return (
    <PublicPageLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-4 text-center">
          <p className="section-label mb-3">Product</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Platform features
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to go from employment to entrepreneurship — matching, planning, and launch tracking.
          </p>
        </div>
        <Features />
        <CTASection />
      </div>
    </PublicPageLayout>
  );
}
