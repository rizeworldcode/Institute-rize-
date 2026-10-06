import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function AIDigitalMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "AI Digital Marketing Agency & Services in Alwar & Rajasthan",
      "description": "Leading AI Digital Marketing Agency in Alwar offering advanced AI Digital Marketing Services in Alwar and AI Marketing Agency in Rajasthan solutions.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      }
    }
  ];

  const faqs = [
    {
      q: "What solutions are provided by your AI Digital Marketing Agency in Alwar?",
      a: "Our AI Digital Marketing Agency in Alwar delivers comprehensive AI Digital Marketing Services in Alwar, including ChatGPT marketing integration, prompt automation, AI copywriting, automated lead funnels, and predictive analytics."
    },
    {
      q: "Why choose RizeWorld as your primary AI Marketing Agency in Alwar?",
      a: "As a forward-thinking AI Marketing Agency in Alwar, RizeWorld combines artificial intelligence workflows with growth marketing to execute campaigns 10x faster with higher ROI and conversion rates."
    },
    {
      q: "Do you deliver AI Digital Marketing Services in Rajasthan across multiple sectors?",
      a: "Yes, our AI Digital Marketing Services in Rajasthan assist eCommerce brands, local businesses, and enterprises statewide in deploying automated lead generation and AI marketing agents."
    },
    {
      q: "How does partnering with an AI Marketing Agency in Rajasthan provide a competitive edge?",
      a: "Partnering with our AI Marketing Agency in Rajasthan and recognized AI Digital Marketing Agency in Rajasthan empowers your business with hyper-personalized customer journeys, synthetic media creation, and automated ad workflows."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="AI Digital Marketing Agency in Alwar & Rajasthan | AI Marketing Services - RizeWorld"
        description="Scale your growth with the leading AI Digital Marketing Agency in Alwar. RizeWorld provides premier AI Digital Marketing Services in Alwar & AI Marketing Agency in Rajasthan solutions."
        canonicalPath="/ai-digital-marketing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 mb-5">
                <Brain size={12} className="text-blue-600 animate-pulse" /> FUTURE-PROOF AGENCY & TRAINING
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Scale Growth with the Premier <span className="text-blue-600">AI Digital Marketing Agency in Alwar</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Transform your business efficiency and customer acquisition with cutting-edge <strong>AI Digital Marketing Services in Alwar</strong>. Operating as a visionary <strong>AI Marketing Agency in Alwar</strong> and recognized as a leading <strong>AI Digital Marketing Agency in Rajasthan</strong>, RizeWorld delivers automated <strong>AI Digital Marketing Services in Rajasthan</strong>. Whether seeking enterprise agency execution or training, we are your premier <strong>AI Marketing Agency in Rajasthan</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Get AI Marketing Consultation <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program & Services Overview</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Agency Hub</span>
                  <span className="font-semibold text-white">AI Digital Marketing Agency in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Services</span>
                  <span className="font-semibold text-white">AI Digital Marketing Services in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Regional Partner</span>
                  <span className="font-semibold text-white">AI Marketing Agency in Rajasthan</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">State Reach</span>
                  <span className="font-semibold text-white">AI Digital Marketing Services in Rajasthan</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center font-bold gap-2 text-sm text-white">
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">AI Marketing Services & Solutions Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Clear insights regarding our AI Digital Marketing Agency in Alwar & Rajasthan</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What are AI Digital Marketing Services?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                <strong>AI Digital Marketing Services</strong> integrate predictive machine learning, prompt engineering, generative copy, and automated ad workflows. RizeWorld provides advanced <strong>AI Digital Marketing Services in Alwar</strong> and <strong>AI Digital Marketing Services in Rajasthan</strong>.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why partner with an AI Marketing Agency in Alwar?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Partnering with our <strong>AI Marketing Agency in Alwar</strong> or top-rated <strong>AI Digital Marketing Agency in Alwar</strong> ensures your business automates content creation, optimizes media spend in real time, and outpaces traditional marketing setups.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Impact of our AI Digital Marketing Agency in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                As the leading <strong>AI Digital Marketing Agency in Rajasthan</strong>, we help brands deploy custom AI chatbots, intelligent lead qualifiers, and automated multi-channel marketing campaigns.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Advantages of choosing an AI Marketing Agency in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Collaborating with an experienced <strong>AI Marketing Agency in Rajasthan</strong> unlocks cost-efficient customer acquisition, high-converting synthetic media, and enterprise-grade automation pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: AI Tool Grid */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">AI Tool Matrix & Marketing Automation Engine</h2>
              <p className="mt-4 text-neutral-600 font-medium">Comparison of large language models and generation frameworks deployed</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">AI Platform</th>
                  <th className="p-4 border-r border-neutral-800">Deployment Details</th>
                  <th className="p-4">Key Marketing Competencies Delivered</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">ChatGPT & Claude AI</td>
                  <td className="p-4 border-r border-neutral-200">Prompt Engineering patterns, Claude AI copywriting, context mapping</td>
                  <td className="p-4">AI Copywriting, customer support scripting, lead magnet generation</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Gemini AI</td>
                  <td className="p-4 border-r border-neutral-200">Gemini AI dashboarding, Google Workspace integration, multi-modal search optimization</td>
                  <td className="p-4">Google ecosystem integration, rapid analytics interpretation</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Midjourney & DALL-E</td>
                  <td className="p-4 border-r border-neutral-200">Midjourney prompt structures, DALL·E visual edits, asset generation</td>
                  <td className="p-4">AI Content Creation, social media creative design, banner asset generation</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Workflow Automation</td>
                  <td className="p-4 border-r border-neutral-200">CRM integrations, auto-responders, AI auto-posting setups</td>
                  <td className="p-4">AI marketing workflows, automated lead generation pipelines</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "AI Copywriting", desc: "Craft conversion-oriented sales copy and email campaigns utilizing ChatGPT for Digital Marketing." },
              { title: "AI Content Creation", desc: "Generate graphics and layout elements using Midjourney AI and DALL·E AI pipelines." },
              { title: "AI Marketing Workflows", desc: "Build automated marketing responders and lead pipelines with modern workflow connectors." }
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Future-Proof AI Marketing Agency in Rajasthan & Alwar</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our team blends enterprise artificial intelligence implementation with specialized training. As a pioneering <strong>AI Marketing Agency in Alwar</strong> and acclaimed <strong>AI Digital Marketing Agency in Rajasthan</strong>, we deliver custom <strong>AI Digital Marketing Services in Alwar</strong> and across Rajasthan that scale business revenues.
              </p>
              <div className="space-y-4">
                {[
                  "Full-service AI Digital Marketing Services in Alwar & Rajasthan",
                  "100% Practical hands-on training with cutting-edge AI models",
                  "Verified AI Digital Marketing Certification recognized across India",
                  "Comprehensive placement and agency career acceleration"
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
            <div className="bg-linear-to-br from-blue-700 to-cyan-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Start AI Marketing Today</h3>
              <p className="text-white/80 text-sm mb-6">
                Connect with our AI strategy team to schedule a demo or audit at our AI marketing headquarters in Alwar, Rajasthan.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">AI Digital Marketing Agency FAQs</h2>
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

      <ExploreLinks activePath="/ai-digital-marketing" />
    </main>
  );
}
