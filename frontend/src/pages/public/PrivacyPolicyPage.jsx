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

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16">
        <p className="section-label mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="glass rounded-2xl p-8">
          <Section title="Information we collect">
            <p>We collect information you provide when registering and using Work2Business, including your name, email, employment details, skills, interests, financial inputs, and business plans generated on the platform.</p>
            <p>We also collect usage data such as pages visited, features used, and device/browser information to improve the product.</p>
          </Section>

          <Section title="How we use your data">
            <p>Your profile data powers our recommendation engine and AI business plan generation. We do not sell your personal information to third parties.</p>
            <p>We may send transactional emails (plan ready, milestones, password reset) based on your notification preferences.</p>
          </Section>

          <Section title="Data storage & security">
            <p>Data is stored on secure servers with encrypted connections (HTTPS). Passwords are hashed and never stored in plain text.</p>
            <p>See our <Link to="/security" className="text-indigo-400 hover:text-indigo-300">Security</Link> page for more details.</p>
          </Section>

          <Section title="Your rights">
            <p>You can update or delete your profile from Settings. Account deactivation removes access while preserving data for recovery upon request.</p>
            <p>Contact us at <a href="mailto:privacy@work2business.com" className="text-indigo-400 hover:text-indigo-300">privacy@work2business.com</a> for data access or deletion requests.</p>
          </Section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
