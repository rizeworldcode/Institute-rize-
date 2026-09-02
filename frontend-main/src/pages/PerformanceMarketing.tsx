import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function PerformanceMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Performance Marketing Course",
      "description": "Master Meta Ads, Google Ads, Google Analytics, and ROAS Optimization Training. Enroll in the premium Performance Marketing Institute India.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Certified Performance Marketer"
    }
  ];

  const faqs = [
    {
      q: "What certifications are supported in the Performance Marketing Course?",
      a: "Our curriculum prepares you for standard industry credentials including Google Ads Certification, Meta Ads Certification, and Google Analytics Certification, validating your skills to top employers."
    },
    {
      q: "What tools are covered in this Performance Ads training?",
      a: "The program covers Facebook Ads, Google Ads, Google Tag Manager Training, Google Analytics Training, and advanced dashboarding for scale."
    },
    {
      q: "Who is the ideal candidate for the Performance Marketing Institute courses?",
      a: "This course is ideal for working professionals, entrepreneurs aiming to lower customer acquisition costs, and freshers looking for a job-oriented career path in digital marketing."
    },
    {
      q: "Is there practical ROAS Optimization Training?",
      a: "Yes, you will manage live ad budgets during the course, learning real-world media buying, campaign structuring, A/B testing, and ROAS Optimization Training."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best Performance Marketing Course in India | Google & Meta Ads Training"
        description="Enroll in the flagship Performance Marketing Course at RizeWorld Institute. Master Google Ads, Facebook Ads, conversion tracking, and earn certifications."
        canonicalPath="/performance-marketing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <BarChart3 size={12} /> PAID ADS PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Advanced <span className="text-blue-600">Performance Marketing Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Learn media buying from the leading Performance Marketing Institute. Scale brand revenues using paid search, social media ads, and technical web analytics.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Enquire About Course <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program Quick Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold">Performance Marketing Course in India</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Paid Ad Modules</span>
                  <span className="font-semibold">Google Ads Training & Facebook Ads Course</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Analytics</span>
                  <span className="font-semibold">Google Analytics Training</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Optimization</span>
                  <span className="font-semibold">ROAS Optimization Training</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 transition-all flex items-center justify-center font-bold gap-2 text-sm">
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Performance Marketing Training India Structure</h2>
              <p className="mt-4 text-neutral-600 font-medium">Quick explanations optimized for answer engines and prospective applicants</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Performance Marketing Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                It is a results-driven training program that focuses on paid media planning, execution, and data analytics. Students learn to design campaigns on Google, Meta, and LinkedIn with absolute control over budget and conversions.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose our Performance Marketing Institute?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute stands as the preferred Performance Marketing Institute India. We combine certified trainers, real ad budgets, live project training, and placement support to ensure professional success.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of Google Ads Training & Facebook Ads Course</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Mastering Google Ads Course and Facebook Ads Course modules equips you with ROAS Optimization Training, campaign automation techniques, and advanced tag implementation skills.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities after Performance Marketing Training</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates transition into roles such as Media Buyers, Performance Marketing Specialists, PPC Managers, and Analytics Experts, supported by our network internships and recruitment assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Advertising Platforms & Analytics Comparison */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Paid Acquisition & Web Analytics Engine breakdown</h2>
              <p className="mt-4 text-neutral-600 font-medium">Core technical competencies developed during class hours</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Channel / Tool</th>
                  <th className="p-4 border-r border-neutral-800">Course Syllabus Coverage</th>
                  <th className="p-4">Relevant Certifications</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Google Ads</td>
                  <td className="p-4 border-r border-neutral-200">Search Ads, Performance Max campaigns, Display ads, YouTube media buying, bid strategy setup</td>
                  <td className="p-4">Google Ads Certification</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Meta Ads</td>
                  <td className="p-4 border-r border-neutral-200">Pixel setup, CBO vs ABO testing, custom conversions, Lookalike audiences, catalog ads</td>
                  <td className="p-4">Meta Ads Certification</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Google Analytics (GA4)</td>
                  <td className="p-4 border-r border-neutral-200">Event tracking, custom reports, attribution modeling, path explorations</td>
                  <td className="p-4">Google Analytics Certification</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Google Tag Manager</td>
                  <td className="p-4 border-r border-neutral-200">Google Tag Manager Training, trigger variables, container setup, schema insertion, server-side tracking</td>
                  <td className="p-4">RizeWorld Certified Specialist</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Conversion Setup", desc: "Configure tracking using Google Tag Manager Training to measure conversions precisely." },
              { title: "Funnel Budgeting", desc: "Allocate ad budgets between cold prospecting, warm engagement, and hot retargeting campaigns." },
              { title: "ROAS Optimization Training", desc: "A/B test ad creatives, landing pages, and audience targets to maximize Return on Ad Spend." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Expertise, Real-World Budgets, Industry Trainers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Learn from a Certified Performance Marketing Institute India</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our curriculum emphasizes practical learning over textbook theories. Work alongside senior media buyers, gain access to live project training, get internship opportunities at agency levels, and acquire certifications recognized internationally.
              </p>
              <div className="space-y-4">
                {[
                  "Hands-on budget management on real Google and Facebook accounts",
                  "100% placement support with resume builders and placement mock drills",
                  "Taught by active industry trainers managing digital campaigns",
                  "Direct counseling and lifetime community updates"
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
            <div className="bg-linear-to-br from-orange-600 to-red-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Start Ad Management</h3>
              <p className="text-white/80 text-sm mb-6">
                Fill out our admission enquiry form today to book a free demo class at our Performance Marketing Institute in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Performance Marketing Course FAQ</h2>
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

      <ExploreLinks activePath="/performance-marketing" />
    </main>
  );
}
