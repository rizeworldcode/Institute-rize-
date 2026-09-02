import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function SEOPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const seoPageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "SEO Course Certification",
      "description": "Learn from the Best SEO Training Institute. Master Keyword Research, On-Page SEO, Off-Page SEO, Technical SEO, and Link Building.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Certified SEO Specialist"
    }
  ];

  const faqs = [
    {
      q: "What is the duration of the SEO Course at RizeWorld Institute?",
      a: "The Advanced SEO Training program runs for 4 weeks. It is designed to equip you with practical SEO Skills through live project training and comprehensive SEO Classes."
    },
    {
      q: "Does your SEO Training Institute offer placement support?",
      a: "Yes, RizeWorld Institute provides complete placement support and internship opportunities. Students work on real-world projects to gain hands-on experience before entering the job market."
    },
    {
      q: "What topics are covered under the Technical SEO module?",
      a: "Our SEO Training Programs cover advanced Technical SEO, including crawling, indexing, XML sitemaps, robots.txt, Core Web Vitals, and implementing an organic search audit."
    },
    {
      q: "Who conducts the SEO specialist training?",
      a: "Our professional SEO training India sessions are led by experienced industry trainers who teach advanced SEO Strategy and link building techniques."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best SEO Course in India | Advanced SEO Training Institute"
        description="Enroll in the professional SEO Course at RizeWorld Institute. Master keyword research, technical SEO, link building, and earn an SEO Course Certification."
        canonicalPath="/seo"
        schemas={seoPageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 mb-5">
                <Search size={12} /> SPECIALIST PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Master Organic Search with the Best <span className="text-blue-600">SEO Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Enroll in professional SEO Classes at RizeWorld Institute, recognized as the Best SEO Training Institute. Accelerate your career with live project training and advanced SEO Strategy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Enquire About Digital Marketing Course <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program Quick Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold">SEO Optimization Course</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Institute</span>
                  <span className="font-semibold">SEO Training Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Trainers</span>
                  <span className="font-semibold">Industry trainers</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Format</span>
                  <span className="font-semibold">Practical learning (Live Projects)</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center font-bold gap-2 text-sm">
                Book Free Demo Class
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AEO Requirements Block */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Advanced SEO Training Programs Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Direct answers to help search and AI engines understand our curriculum</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is an SEO Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                An <strong>SEO Course</strong> is a specialized training program that teaches organic search growth strategies. RizeWorld Institute provides a professional SEO Course covering on-page, off-page, and technical optimization to help business websites rank first on search engines.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Choose RizeWorld Institute because we are the Best SEO Training Institute offering hands-on training, industry trainers, live project training, and placement support. Our curriculum focuses heavily on real-world projects.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of SEO Classes</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Attending our professional SEO classes builds career-focused skills, grants an industry recognized SEO Course Certification, and teaches you how to generate organic traffic without paid ads.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities after SEO Specialist Training</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates from our SEO Institute India can land high-paying roles as SEO Specialists, Organic Search Managers, Search Strategists, and Content Optimizers, supported by our active recruitment and internship opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Structured Data Table & Steps */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Advanced SEO Training Course Structure Comparison</h2>
              <p className="mt-4 text-neutral-600 font-medium">Detailed breakdown of our practical SEO Strategy and optimization training modules</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Module</th>
                  <th className="p-4 border-r border-neutral-800">Key SEO Skills Covered</th>
                  <th className="p-4">Training Method</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Keyword Research</td>
                  <td className="p-4 border-r border-neutral-200">Search Intent Analysis, Competition Mapping, Semantic SEO mapping</td>
                  <td className="p-4">Hands-on live project training</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">On-Page SEO</td>
                  <td className="p-4 border-r border-neutral-200">Heading tags optimization, Content formatting, Meta titles & descriptions, Internal linking</td>
                  <td className="p-4">Practical learning on active websites</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Technical SEO</td>
                  <td className="p-4 border-r border-neutral-200">Speed optimization, Sitemap management, Schema markup injection, Google Search Console</td>
                  <td className="p-4">Live SEO Audit on actual domains</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Off-Page SEO & Link Building</td>
                  <td className="p-4 border-r border-neutral-200">Backlink outreach, PR writing, Guest posting, Citation building</td>
                  <td className="p-4">Real agency workflows</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Step 1: In-depth Audit", desc: "Perform a complete SEO Audit of real websites using professional software." },
              { title: "Step 2: Content Strategy", desc: "Build topical authority using semantic clustering and keyword research techniques." },
              { title: "Step 3: Link Acquisition", desc: "Master off-page SEO methods to build premium authority links naturally." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Industry Trainers & Practical Learning */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Expert-Led SEO Course in India</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                At RizeWorld Institute, we believe in career-focused education. Our SEO training India curriculum is crafted by certified SEO specialist trainers who manage multi-million organic search campaigns daily.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning focusing on actual live project training",
                  "Internship opportunities with local and national corporate agencies",
                  "Verified SEO Course Certification recognized globally",
                  "Comprehensive placement support for job readiness"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600 shrink-0" size={18} />
                    <span className="text-sm text-neutral-700 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-linear-to-br from-blue-600 to-indigo-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Start Your Career</h3>
              <p className="text-white/80 text-sm mb-6">
                Connect with our team today and schedule your free demo class at our SEO Training Institute in Alwar.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold hover:scale-105 transition-transform">
                Talk to Our Counselor <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">SEO Course Frequently Asked Questions</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} onClick={() => setOpenFaq(isOpen ? null : idx)} className="bg-white border border-neutral-200 rounded-2xl p-6 cursor-pointer transition-all">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-display font-bold text-neutral-900 text-lg">{faq.q}</span>
                    <span className="text-xl font-bold">{isOpen ? "-" : "+"}</span>
                  </div>
                  {isOpen && <p className="mt-4 text-neutral-600 text-sm leading-relaxed">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ExploreLinks activePath="/seo" />
    </main>
  );
}
