import { Link } from "react-router-dom";
import PublicPageLayout from "../../layouts/PublicPageLayout";

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-slate-400 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16">
        <p className="section-label mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="glass rounded-2xl p-8">
          <Section title="Acceptance of terms">
            <p>By accessing or using Work2Business, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
          </Section>

          <Section title="Service description">
            <p>Work2Business provides AI-powered business idea matching, plan generation, and entrepreneurship tools for employees transitioning to business ownership. Outputs are informational and not legal, financial, or investment advice.</p>
          </Section>

          <Section title="Account responsibilities">
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
            <p>You agree to provide accurate profile information so recommendations and plans reflect your real situation.</p>
          </Section>

          <Section title="Acceptable use">
            <p>You may not misuse the platform, attempt unauthorized access, scrape data, or use generated content to violate applicable laws.</p>
          </Section>

          <Section title="Limitation of liability">
            <p>Work2Business is provided &quot;as is.&quot; We are not liable for business outcomes, losses, or decisions made based on AI-generated plans or recommendations.</p>
          </Section>

          <Section title="Contact">
            <p>Questions about these terms: <Link to="/contact" className="text-indigo-400 hover:text-indigo-300">Contact us</Link> or email <a href="mailto:legal@work2business.com" className="text-indigo-400 hover:text-indigo-300">legal@work2business.com</a>.</p>
          </Section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
