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
      "@type": "Service",
      "name": "Social Media Optimization Services & Marketing in Alwar & Rajasthan",
      "description": "Leading SMO Agency in Alwar delivering top Social Media Optimization Services in Alwar & Social Media Marketing in Rajasthan.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      }
    }
  ];

  const faqs = [
    {
      q: "What makes RizeWorld the leading SMO Agency in Alwar?",
      a: "As a top-tier SMO Agency in Alwar, RizeWorld provides end-to-end Social Media Optimization Services in Alwar, covering profile revamp, organic reach maximization, aesthetic alignment, and high-engagement content strategy."
    },
    {
      q: "How does Social Media Marketing in Alwar help businesses grow?",
      a: "Investing in Social Media Marketing in Alwar builds localized brand authority, drives high-intent customer inquiries on Instagram and Facebook, and fosters strong community loyalty for regional brands."
    },
    {
      q: "Do you deliver Social Media Optimization Services in Rajasthan across all major networks?",
      a: "Yes, our Social Media Optimization Services in Rajasthan cover Instagram, Facebook, LinkedIn, YouTube, and Pinterest to guarantee multi-channel dominance."
    },
    {
      q: "Why partner with an established SMO Agency in Rajasthan like RizeWorld?",
      a: "Partnering with a recognized SMO Agency in Rajasthan ensures data-backed audience targeting, trend-jacking video strategies, and high-performing Social Media Marketing in Rajasthan that converts followers into real revenue."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Social Media Marketing in Alwar & Rajasthan | SMO Agency in Alwar - RizeWorld"
        description="Expert Social Media Marketing in Alwar and Rajasthan. RizeWorld Institute offers top Social Media Optimization Services in Alwar, operating as a leading SMO Agency in Rajasthan."
        canonicalPath="/social-media-marketing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-600 mb-5">
                <Share2 size={12} /> ENGAGEMENT PROGRAM & SERVICES
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Scale Your Reach with Premier <span className="text-blue-600">Social Media Marketing in Alwar</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Amplify your digital presence with high-impact <strong>Social Media Marketing in Alwar</strong> and comprehensive <strong>Social Media Optimization Services in Alwar</strong>. Backed by the strategic expertise of a premier <strong>SMO Agency in Alwar</strong>, RizeWorld delivers cutting-edge <strong>Social Media Marketing in Rajasthan</strong> and trusted <strong>Social Media Optimization Services in Rajasthan</strong>. Whether you are building an organic audience or hiring a top <strong>SMO Agency in Rajasthan</strong>, our battle-tested agency methods drive massive visibility.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Get Social Media Consultation <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program & Services Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Services</span>
                  <span className="font-semibold">Social Media Optimization Services in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Agency Hub</span>
                  <span className="font-semibold">Premier SMO Agency in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Regional Reach</span>
                  <span className="font-semibold">Social Media Marketing in Rajasthan</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">State Agency</span>
                  <span className="font-semibold">Leading SMO Agency in Rajasthan</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center font-bold gap-2 text-sm">
                Book Free Consultation / Demo
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Social Media Solutions & Training Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Clear insights regarding our Social Media Optimization Services in Alwar & Rajasthan</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What are Social Media Optimization Services?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                <strong>Social Media Optimization Services</strong> involve curating bios, hashtags, content pillars, and link funnels to maximize organic reach. RizeWorld provides dedicated <strong>Social Media Optimization Services in Alwar</strong> and <strong>Social Media Optimization Services in Rajasthan</strong>.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why partner with RizeWorld as your SMO Agency in Alwar?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                As a results-first <strong>SMO Agency in Alwar</strong> and leading <strong>SMO Agency in Rajasthan</strong>, RizeWorld Institute blends creative storytelling with viral distribution to multiply engagement and customer retention.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of Social Media Marketing in Alwar</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Leveraging targeted <strong>Social Media Marketing in Alwar</strong> enables brands to capture qualified local consumer traffic, boost social proof, and build an active digital community on Instagram and LinkedIn.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Impact of Social Media Marketing in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Executing full-funnel <strong>Social Media Marketing in Rajasthan</strong> with an experienced agency unlocks massive statewide reach, influencer partnerships, and measurable sales pipelines.
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
              <p className="mt-4 text-neutral-600 font-medium">How our SMO Agency optimizes business accounts and client profiles</p>
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Results-Driven Social Media Marketing in Rajasthan & Alwar</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Whether deploying <strong>Social Media Optimization Services in Rajasthan</strong> or learning directly from the leading <strong>SMO Agency in Alwar</strong>, RizeWorld Institute provides unparalleled practical mastery. As the most trusted <strong>SMO Agency in Rajasthan</strong>, our team manages live brand accounts across diverse industries.
              </p>
              <div className="space-y-4">
                {[
                  "Delivering full Social Media Optimization Services in Alwar & Rajasthan",
                  "100% Practical learning workflows on actual active client accounts",
                  "Direct preparation for Social Media Specialist Certification",
                  "Comprehensive placement support and agency internship programs"
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
              <h3 className="font-display text-2xl font-bold mb-4">Start Growing Your Brand</h3>
              <p className="text-white/80 text-sm mb-6">
                Connect with our social media strategists to get an account audit or book a free demo session at our agency headquarters in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Social Media Marketing in Alwar & Rajasthan FAQs</h2>
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
