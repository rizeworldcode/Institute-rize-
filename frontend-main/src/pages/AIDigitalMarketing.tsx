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
      "@type": "Course",
      "name": "AI Digital Marketing Course",
      "description": "Enroll in the Artificial Intelligence Courses in India. Master ChatGPT Course, Prompt Engineering Course, Gemini AI, Claude AI, and earn an AI Digital Marketing Course with Certificate.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "AI Digital Marketing Course with Certificate"
    }
  ];

  const faqs = [
    {
      q: "What certifications are available in this AI marketing program?",
      a: "Our students earn an AI Digital Marketing Course with Certificate from RizeWorld Institute upon completing all modules and live campaign integrations."
    },
    {
      q: "Which tools are covered in this AI Tools Training Institute?",
      a: "We provide comprehensive training on ChatGPT Course systems, Gemini AI, Claude AI, Midjourney AI, DALL·E AI, and custom automation scripts."
    },
    {
      q: "What is the focus of the Prompt Engineering Course module?",
      a: "The Prompt Engineering module teaches structured prompt patterns, role-prompting, few-shot generation, and context optimization for content creation and copywriting."
    },
    {
      q: "Are there job placements after completing the AI Course in India?",
      a: "Yes, RizeWorld Institute provides 100% placement support and internship opportunities. AI Training India graduates are highly sought after by modern agencies."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best AI Courses in India | AI Digital Marketing Course with Certificate"
        description="Enroll in the AI Digital Marketing Course at RizeWorld Institute. Master ChatGPT, Claude, Gemini, Prompt Engineering, and AI Automation."
        canonicalPath="/ai-digital-marketing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 mb-5">
                <Brain size={12} className="text-blue-600 animate-pulse" /> FUTURE-PROOF PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Scale Workflows with our <span className="text-blue-600">AI Digital Marketing Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Enroll in the Best AI Courses in India. Learn from the leading AI Tools Training Institute and master ChatGPT for Digital Marketing, prompt engineering, and automation.
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
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program Quick Overview</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold text-white">AI Digital Marketing Course with Certificate</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Institute</span>
                  <span className="font-semibold text-white">AI Tools Training Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Core Training</span>
                  <span className="font-semibold text-white">ChatGPT Course & Prompt Engineering Course</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Framework</span>
                  <span className="font-semibold text-white">Practical learning (AI Automation Course)</span>
                </div>
              </div>
              <Link to="/contact" className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center font-bold gap-2 text-sm text-white">
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">AI Marketing Training India Details</h2>
              <p className="mt-4 text-neutral-600 font-medium">Clear answers formatted for modern answer engines and digital agencies</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is an AI Digital Marketing Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                An <strong>AI Digital Marketing Course</strong> is an educational training program covering prompt engineering, workflow automation, copywriting, and synthetic media generation using tools like ChatGPT, Claude, and Midjourney.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute for AI training?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute is a recognized AI Tools Training Institute offering certified industry trainers, live project training, internship opportunities, and placement support.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of our Prompt Engineering & AI Automation Course</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Master prompt engineering, build automated lead generation agents, create AI content at scale, and earn an industry-recognized certification.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities after AI Training India</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Transition into roles like AI Content Lead, Prompt Engineer, Automation Specialist, or Digital Campaign Optimizer, supported by our career counseling and placement support.
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Artificial Intelligence Courses in India Tool Matrix</h2>
              <p className="mt-4 text-neutral-600 font-medium">Comparison of large language models and generation frameworks taught in class</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">AI Platform</th>
                  <th className="p-4 border-r border-neutral-800">Syllabus Details</th>
                  <th className="p-4">Key Marketing Competencies Developed</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">ChatGPT & Claude AI</td>
                  <td className="p-4 border-r border-neutral-200">ChatGPT Course, Prompt Engineering Course, Claude AI writing, context mapping</td>
                  <td className="p-4">AI Copywriting, customer support scripting, lead magnet generation</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Gemini AI</td>
                  <td className="p-4 border-r border-neutral-200">Gemini AI dashboarding, Google Workspace integration, multi-modal search optimization</td>
                  <td className="p-4">Google ecosystem integration, rapid analytics interpretation</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Midjourney & DALL-E</td>
                  <td className="p-4 border-r border-neutral-200">Midjourney AI prompt structures, DALL·E AI edits, aspect ratio optimization</td>
                  <td className="p-4">AI Content Creation, social media creative design, banner asset generation</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Workflow Automation</td>
                  <td className="p-4 border-r border-neutral-200">AI Automation Course, CRM integrations, auto-responders, auto-posting setups</td>
                  <td className="p-4">AI marketing workflows, lead generation pipelines</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "AI Copywriting", desc: "Craft conversion-oriented sales copy and email campaigns utilizing ChatGPT for Digital Marketing." },
              { title: "AI Content Creation", desc: "Generate graphics and layout elements using Midjourney AI and DALL·E AI pipelines." },
              { title: "AI Automation Course", desc: "Build automated marketing responders and lead pipelines with modern workflow connectors." }
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Learn at the Premier AI Tools Training Institute</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our AI Marketing Training India structure emphasizes practical learning. Master modern prompt engineering, build active automated campaign pipelines, execute live project training, secure internship opportunities, and leverage our placement support.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning sessions in state-of-the-art tech classrooms",
                  "Create a complete portfolio showing 10+ AI automated marketing workflows",
                  "Earn an industry recognized AI Digital Marketing Course with Certificate",
                  "Receive comprehensive career counselor support and placement mock drills"
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
              <h3 className="font-display text-2xl font-bold mb-4">Start AI Marketing</h3>
              <p className="text-white/80 text-sm mb-6">
                Enquire now to lock your batch seat and schedule a free demo class at our AI Training India center in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">AI Digital Marketing Course FAQs</h2>
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
