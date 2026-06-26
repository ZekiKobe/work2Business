import { Shield, Lock, Key, Server, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import PublicPageLayout from "../../layouts/PublicPageLayout";

const PRACTICES = [
  {
    icon: Lock,
    title: "Encryption in transit",
    desc: "All traffic between your browser and our API uses HTTPS/TLS encryption."
  },
  {
    icon: Key,
    title: "Secure authentication",
    desc: "Passwords are hashed with bcrypt. Sessions use signed JWT tokens with expiration."
  },
  {
    icon: Shield,
    title: "Role-based access",
    desc: "Users can only access their own plans and profile. Admin routes require ADMIN role."
  },
  {
    icon: Server,
    title: "Data isolation",
    desc: "Business plans, favorites, and notifications are scoped per user account."
  },
  {
    icon: Eye,
    title: "Minimal data sharing",
    desc: "We do not sell personal data. AI features send only necessary context to generate plans."
  }
];

export default function SecurityPage() {
  return (
    <PublicPageLayout>
      <div className="max-w-4xl mx-auto px-5 lg:px-10 py-16">
        <p className="section-label mb-3">Company</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Security</h1>
        <p className="text-slate-400 text-base max-w-2xl mb-12">
          How we protect your account, profile data, and business plans on Work2Business.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {PRACTICES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-5">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl w-fit mb-3">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="font-bold text-white text-sm mb-2">{title}</h2>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 text-sm text-slate-400 leading-relaxed space-y-4">
          <p>
            If you discover a security vulnerability, please report it responsibly to{" "}
            <a href="mailto:security@work2business.com" className="text-indigo-400 hover:text-indigo-300">
              security@work2business.com
            </a>
            . We review reports promptly.
          </p>
          <p>
            Read our full <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link> for details on data handling and your rights.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
