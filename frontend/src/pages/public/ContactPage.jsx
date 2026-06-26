import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import PublicPageLayout from "../../layouts/PublicPageLayout";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error("Please fill in name, email, and message");
    }
    toast.success("Message sent! We'll get back to you within 2 business days.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <PublicPageLayout>
      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-16">
        <p className="section-label mb-3">Company</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Contact us</h1>
        <p className="text-slate-400 max-w-xl mb-12">
          Questions about the platform, partnerships, or your account? We are here to help.
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@work2business.com", href: "mailto:hello@work2business.com" },
              { icon: MessageSquare, label: "Support", value: "support@work2business.com", href: "mailto:support@work2business.com" },
              { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia", href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-white hover:text-indigo-300 transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 glass rounded-2xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Name</label>
                <input value={form.name} onChange={set("name")} className="input-base text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={set("email")} className="input-base text-sm" placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
              <input value={form.subject} onChange={set("subject")} className="input-base text-sm" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
              <textarea value={form.message} onChange={set("message")} rows={5} className="input-base text-sm resize-none" placeholder="Tell us more..." />
            </div>
            <button type="submit" className="btn-primary text-sm">
              <Send className="w-4 h-4" /> Send message
            </button>
          </form>
        </div>
      </div>
    </PublicPageLayout>
  );
}
