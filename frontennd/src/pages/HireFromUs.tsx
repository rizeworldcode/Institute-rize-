import { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Users, Award, Brain, Briefcase, Target, TrendingUp, Heart, Lightbulb } from "lucide-react";
import Reveal from "../components/Reveal";

const reasons = [
  { icon: Brain, title: "AI-First Curriculum", desc: "Our students are trained to use AI tools in every marketing workflow — a rare edge in the industry." },
  { icon: Target, title: "Project-Based Learning", desc: "Every student graduates with a portfolio of 10+ real client projects, not theoretical assignments." },
  { icon: Users, title: "Small Batch Mentorship", desc: "Max 20 students per batch means personalized attention and quality skill development." },
  { icon: Award, title: "Industry-Recognized Skills", desc: "Meta & Google aligned curriculum ensures students meet hiring standards of top agencies." },
  { icon: TrendingUp, title: "Job-Ready in 12 Weeks", desc: "Our structured 3-month program produces professionals ready to contribute from day one." },
  { icon: Lightbulb, title: "Creative + Technical Blend", desc: "Rare combination of design, marketing, and tech skills in one holistic program." },
];

const skillHighlights = [
  { title: "AI Tools Mastery", skills: ["ChatGPT", "Midjourney", "Gemini", "Claude", "Workflow Automation"] },
  { title: "Creative Skills", skills: ["Photoshop", "Canva Pro", "Premiere Pro", "CapCut", "Brand Identity"] },
  { title: "Marketing Skills", skills: ["Meta Ads", "Google Ads", "SEO", "SMO", "Analytics"] },
  { title: "Tech Skills", skills: ["WordPress", "Webflow", "HTML/CSS", "Landing Pages", "E-commerce"] },
];

export default function HireFromUs() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const phoneNumber = "918302277092";
    const dateStr = new Date().toLocaleString();
    
    const messageTemplate = `💼 *NEW HIRING INQUIRY* 💼
━━━━━━━━━━━━━━━━━━━━━
🏢 *Company:* ${form.company}
👤 *Contact Person:* ${form.name}
📞 *Phone:* ${form.phone}
✉️ *Email:* ${form.email}
━━━━━━━━━━━━━━━━━━━━━
📝 *Requirements / Message:*
_${form.message || 'No additional requirements specified.'}_
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr}
🌐 *Source:* RizeWorld Website (Hire From Us)`;

    // Open WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageTemplate)}`;
    window.open(url, '_blank');

    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", company: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Briefcase size={12} /> FOR COMPANIES & AGENCIES
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-none tracking-tight">
                Hire <span className="text-blue-600">future-ready</span> digital talent.
              </h1>
              <p className="mt-6 text-lg text-neutral-500 max-w-2xl">
                Partner with RizeWorld to access a curated pool of AI-savvy, job-ready digital marketing professionals trained in real-world skills.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Collaborate */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-green text-xs font-semibold text-[#059669] mb-4">
                <Sparkles size={12} /> WHY COLLABORATE
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white">
                Why <span className="gradient-text">RizeWorld?</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full hover:shadow-luxury hover:-translate-y-2 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center mb-5 shadow-luxury group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <r.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2 text-lg">{r.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student Skill Highlights */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="text-xs font-bold tracking-widest text-[#ff6b1a] mb-2">STUDENT CAPABILITIES</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white">
                Skills they <span className="gradient-text">bring to your team.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillHighlights.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`rounded-3xl p-6 h-full transition-all duration-500 hover:-translate-y-1 ${
                  i % 2 === 0 ? "glass-orange hover:shadow-orange" : "glass-green hover:shadow-green"
                }`}>
                  <div className="font-display font-bold text-white mb-4">{s.title}</div>
                  <div className="space-y-2">
                    {s.skills.map((skill, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className={i % 2 === 0 ? "text-[#ff6b1a]" : "text-[#10b981]"} />
                        <span className="text-sm text-neutral-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Training Quality */}
      <section className="py-24 bg-[#0f0f0f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <img src="/images/classroom.jpg" alt="Training" className="w-full h-[500px] object-cover rounded-3xl shadow-luxury" />
              <div className="absolute -bottom-6 -right-6 w-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-luxury hidden md:block">
                <Heart size={24} className="text-[#ff6b1a] mb-2" />
                <div className="font-display font-bold text-white">96% Satisfaction</div>
                <div className="text-xs text-neutral-400">From partner companies</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <div className="text-xs font-bold tracking-widest text-[#ff6b1a] mb-2">TRAINING QUALITY</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Trained to <span className="gradient-text">perform, not just know.</span>
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                Our students don't just learn concepts — they apply them daily through live projects, mock campaigns, and industry mentorship.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { v: "500+", l: "Hours of training" },
                  { v: "10+", l: "Live projects" },
                  { v: "100%", l: "Hands-on approach" },
                  { v: "20", l: "Max batch size" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="font-display text-3xl font-extrabold gradient-text">{s.v}</div>
                    <div className="text-xs text-neutral-400 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-dots" />
        <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-orange text-xs font-semibold text-[#ff6b1a] mb-5">
                <Briefcase size={12} /> LET'S TALK
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Ready to <span className="gradient-text">collaborate?</span>
              </h2>
              <p className="mt-6 text-lg text-neutral-400">
                Tell us about your hiring needs. Our team will connect you with the right talent within 7 days.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Dedicated talent matching",
                  "Pre-screened, job-ready candidates",
                  "Flexible hiring models (full-time, freelance, intern)",
                  "Post-hire support for 90 days",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#10b981]" />
                    <span className="text-neutral-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form onSubmit={submit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-luxury">
              <h3 className="font-display text-2xl font-bold text-white mb-6">Send inquiry</h3>
              <div className="space-y-4">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name *"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/10 focus:border-[#ff6b1a] focus:outline-none transition-colors"
                />
                <input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company Name *"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/10 focus:border-[#ff6b1a] focus:outline-none transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email *"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/10 focus:border-[#ff6b1a] focus:outline-none transition-colors"
                  />
                  <div className="flex items-center w-full px-4 py-3 rounded-xl bg-white/60 border border-white/10 focus-within:border-[#ff6b1a] transition-colors">
                    <span className="text-neutral-500 font-semibold mr-2 border-r border-neutral-300/50 pr-2">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setForm({ ...form, phone: val });
                      }}
                      placeholder="00000 00000"
                      className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500"
                    />
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your hiring needs..."
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/10 focus:border-[#ff6b1a] focus:outline-none transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="magnetic-btn w-full py-4 rounded-full gradient-orange text-white font-bold shadow-orange btn-shine flex items-center justify-center gap-2"
                >
                  {sent ? "Sent! We'll reach out soon ✓" : <>Submit Inquiry <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
