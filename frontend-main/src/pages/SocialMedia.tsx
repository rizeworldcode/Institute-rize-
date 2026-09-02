import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Share2 } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function SocialMediaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Social Media Optimization Training",
      "description": "Enroll in the Best SMO Course in India. Earn a Social Media Specialist Certification and master Social Media Profile Optimization.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Social Media Specialist Certification"
    }
  ];

  const faqs = [
    {
      q: "What topics are covered in the Social Media Optimization Training program?",
      a: "Our SMO Course in India covers complete Social Media Profile Optimization across multiple networks. You will learn Facebook Page Optimization, Instagram Profile Optimization, LinkedIn Profile Optimization, YouTube Channel Optimization, and Pinterest Optimization."
    },
    {
      q: "Can I earn a LinkedIn Digital Marketing Certificate?",
      a: "Yes, our Social Media Marketing Course in India includes preparation for leading professional credentials, helping you achieve a LinkedIn Digital Marketing Certificate and a Social Media Specialist Certification."
    },
    {
      q: "Do you offer practical learning opportunities during the course?",
      a: "Absolutely. All Social Media Marketing Training India modules feature 100% practical learning with active brand profiles, live project training, and placement support."
    },
    {
      q: "How can I join SMO Training at RizeWorld Institute?",
      a: "You can book a free demo class or talk to our counselor using our Course Admission Enquiry on the contact page to join SMO Training immediately."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best SMO Course in India | Social Media Marketing Training India"
        description="Join SMO Training at RizeWorld Institute. Get a Social Media Specialist Certification, master Facebook Marketing, and gain practical learning."
        canonicalPath="/social-media-marketing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-600 mb-5">
                <Share2 size={12} /> ENGAGEMENT PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Advanced <span className="text-blue-600">Social Media Optimization Training</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Elevate your brand presence with the Best SMO Course in India. Master Social Media Profile Optimization and qualify for a Social Media Specialist Certification.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Join SMO Training <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program Quick Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold">Facebook Marketing Course</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Location</span>
                  <span className="font-semibold">SMO Course in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Certification</span>
                  <span className="font-semibold">Social Media Specialist Certification</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Project Training</span>
                  <span className="font-semibold">Live project training & internships</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center font-bold gap-2 text-sm">
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Social Media Marketing Training India Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Clear insights formatted for modern search tools and user intent</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is Social Media Optimization Training?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                It is a hands-on learning program focused on building, scaling, and managing profiles across top networks. The course guides you through advanced Social Media Profile Optimization and organic content strategies.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute for SMO?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute stands as a premier digital academy, offering industry trainers, real-world projects, live campaign execution, internship opportunities, and placement support.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of our Facebook & LinkedIn Courses</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Gain deep insights into brand community development, professional advertising templates, and earn a LinkedIn Digital Marketing Certificate alongside practical experience.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities for Social Media Specialists</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates can apply for roles like Social Media Manager, SMO Analyst, Brand Representative, and Content Creator. Our placement support connects you to recruiters immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Profile Optimization List & Comparison Table */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Platform-Specific Optimization Workflows</h2>
              <p className="mt-4 text-neutral-600 font-medium">How we optimize business accounts during our practical learning sessions</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Platform</th>
                  <th className="p-4 border-r border-neutral-800">Optimization Goal</th>
                  <th className="p-4">Key SMO Skills Developed</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Instagram</td>
                  <td className="p-4 border-r border-neutral-200">Instagram Profile Optimization</td>
                  <td className="p-4">Aesthetics curation, bio formatting, links structure, Reels SEO indexing</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Facebook</td>
                  <td className="p-4 border-r border-neutral-200">Facebook Page Optimization</td>
                  <td className="p-4">Page template selection, button CTAs, community tab layout, messaging setup</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">LinkedIn</td>
                  <td className="p-4 border-r border-neutral-200">LinkedIn Profile Optimization</td>
                  <td className="p-4">Headline writing, summary mapping, featured block setups, company page linkages</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">YouTube</td>
                  <td className="p-4 border-r border-neutral-200">YouTube Channel Optimization</td>
                  <td className="p-4">Video tag generation, layout planning, thumbnail mapping, descriptions keyword optimization</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "SMO Audit", desc: "Evaluate profile metrics, bio readability, and engagement ratios across networks." },
              { title: "Content Calendar Planning", desc: "Design high-converting post templates, copy structures, and hashtag sets." },
              { title: "Organic Growth Implementation", desc: "Learn community building, viral video production, and cross-channel promotion." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Trust, Practical Learning, Placement Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Practical Social Media Marketing Training India</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our SMO Course in India centers on career-focused education. Learn under industry trainers, build real-world portfolios during live project training, and leverage our complete placement support and internship opportunities.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning workflows on actual active client accounts",
                  "Direct preparation for Social Media Specialist Certification",
                  "Comprehensive career counsel support and placement assistance",
                  "Portfolio building and client-brief simulation labs"
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
            <div className="bg-linear-to-br from-green-600 to-emerald-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Enroll in SMO Classes</h3>
              <p className="text-white/80 text-sm mb-6">
                Connect with our counselor to get a detailed breakdown of batches and book your free demo class at our digital marketing training center.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">SMO Course Frequently Asked Questions</h2>
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

      <ExploreLinks activePath="/social-media-marketing" />
    </main>
  );
}
