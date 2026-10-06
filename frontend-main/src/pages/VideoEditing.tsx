import { useState } from "react";
import { Link } from "react-router-dom";
import { Video, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function VideoEditingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Video Editing Course in Alwar & Rajasthan",
      "description": "Enroll in the Best Video Editing Course in Alwar at RizeWorld Institute. Leading Video Editing Institute in Rajasthan offering a Professional Video Editing Course in Rajasthan.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Certified Video Editor"
    }
  ];

  const faqs = [
    {
      q: "Where can I find the Best Video Editing Course in Alwar?",
      a: "RizeWorld Institute offers the Best Video Editing Course in Alwar, featuring dedicated high-end editing workstations, real YouTube and commercial brand footage, and 1-on-1 mentor guidance."
    },
    {
      q: "What makes RizeWorld the top Video Editing Institute in Alwar?",
      a: "As the premier Video Editing Institute in Alwar, RizeWorld provides comprehensive hands-on training across Adobe Premiere Pro, After Effects, and DaVinci Resolve, complemented by color grading and audio engineering modules."
    },
    {
      q: "Is this a Professional Video Editing Course in Rajasthan with job placement?",
      a: "Yes, our Professional Video Editing Course in Rajasthan includes complete placement support, internship opportunities with active media houses, and assistance building a professional creator portfolio."
    },
    {
      q: "Why choose this Video Editing Course in Rajasthan at RizeWorld Institute?",
      a: "Unlike institutes that teach only basic cuts, our Video Editing Course in Rajasthan and training at our Video Editing Institute in Rajasthan focus on cinematic storytelling, pacing, sound design, and viral short-form editing."
    }
  ];

  return (
    <main className="pt-28 bg-[#0a0a0c] text-white min-h-screen">
      <SEO
        title="Best Video Editing Course in Alwar | Video Editing Institute in Rajasthan"
        description="Join the Best Video Editing Course in Alwar at RizeWorld Institute. Premier Video Editing Institute in Alwar offering a Professional Video Editing Course in Rajasthan."
        canonicalPath="/video-editing"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-neutral-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-5">
                <Video size={12} className="text-blue-400" /> CREATIVE EDITING
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Master Storytelling with the <span className="text-blue-400">Best Video Editing Course in Alwar</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-400 leading-relaxed font-medium">
                Transform raw footage into captivating cinematic stories at RizeWorld Institute, recognized as the premier <strong>Video Editing Institute in Alwar</strong>. Whether you seek the <strong>Best Video Editing Course in Alwar</strong> or wish to enroll in a comprehensive <strong>Video Editing Course in Alwar</strong>, our advanced lab training establishes us as the top <strong>Video Editing Institute in Rajasthan</strong>. Gain industry-standard post-production skills with our acclaimed <strong>Video Editing Course in Rajasthan</strong> and our career-defining <strong>Professional Video Editing Course in Rajasthan</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                  Enquire About Course <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-neutral-900 text-white rounded-4xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="font-display text-xl font-bold mb-4">Program Quick Overview</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold text-white">Best Video Editing Course in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Campus</span>
                  <span className="font-semibold text-white">Video Editing Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Regional Reach</span>
                  <span className="font-semibold text-white">Video Editing Institute in Rajasthan</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Program</span>
                  <span className="font-semibold text-white">Professional Video Editing Course in Rajasthan</span>
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
      <section className="py-20 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Video Editing Training Structure</h2>
              <p className="mt-4 text-neutral-400 font-medium">Direct answers regarding our Video Editing Course in Alwar & Rajasthan</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">What is a Video Editing Course?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A <strong>Video Editing Course</strong> covers timeline assembly, multi-camera editing, visual effects, and color grading. RizeWorld Institute provides an advanced <strong>Video Editing Course in Alwar</strong> and <strong>Video Editing Course in Rajasthan</strong> covering Premiere Pro, After Effects, and DaVinci Resolve.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Why choose RizeWorld as your Video Editing Institute in Alwar?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                As the leading <strong>Video Editing Institute in Alwar</strong> and premier <strong>Video Editing Institute in Rajasthan</strong>, RizeWorld offers high-end editing rigs, live production footage, certified mentors, and the <strong>Best Video Editing Course in Alwar</strong>.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Benefits of our Professional Video Editing Course in Rajasthan</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Enrolling in our <strong>Professional Video Editing Course in Rajasthan</strong> allows you to build an impressive portfolio of commercial edits, YouTube videos, and dynamic reels with verifiable credentials.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Career opportunities from our Video Editing Institute in Rajasthan</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Graduates from our campus—a recognized standard among any <strong>Video Editing Institute in Rajasthan</strong>—step into in-demand roles as Video Editors, Motion Graphic Artists, and Post-Production Leads with full placement support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Video Software Table */}
      <section className="py-20 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-white">Video Editing Training Technical Breakdown</h2>
              <p className="mt-4 text-neutral-400 font-medium">Comparison of professional editing systems and engines taught in class</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900 shadow-xl mb-12">
            <table className="w-full text-left border-collapse text-white">
              <thead>
                <tr className="bg-neutral-800 text-white font-display text-sm">
                  <th className="p-4 border-r border-white/5">Software Tool</th>
                  <th className="p-4 border-r border-white/5">Syllabus Coverage Details</th>
                  <th className="p-4">Key Professional Competencies</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-400">
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">Premiere Pro</td>
                  <td className="p-4 border-r border-white/5">Adobe Premiere Pro Course, timeline control, multi-cam editing, audio leveling, proxy workflows</td>
                  <td className="p-4">Commercial advertising editing, YouTube Video Editing workflows</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">After Effects</td>
                  <td className="p-4 border-r border-white/5">Adobe After Effects Course, keyframes, kinetic typography, Video Animation, tracking</td>
                  <td className="p-4">Motion graphic design, intro/outro creation, CGI composite editing</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">DaVinci Resolve</td>
                  <td className="p-4 border-r border-white/5">DaVinci Resolve Course, color nodes, LUT mapping, HDR color wheels, tracking masks</td>
                  <td className="p-4">Cinematic color grading, professional movie post-production alignment</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-white/5 text-white">Final Cut Pro</td>
                  <td className="p-4 border-r border-white/5">Final Cut Pro Course, magnetic timeline, rendering setups, compression rules</td>
                  <td className="p-4">Rapid editing for macOS users, broadcast delivery optimization</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-neutral-300">
            {[
              { title: "Footage Assembly", desc: "Assemble video timelines using professional Adobe Premiere Pro Course protocols." },
              { title: "Motion Graphics", desc: "Build transitions, lower thirds, and kinetics via the Adobe After Effects Course module." },
              { title: "Cinematic Grading", desc: "Master professional node-based color grading within our DaVinci Resolve Course lessons." }
            ].map((step, idx) => (
              <div key={idx} className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
                <h4 className="font-display font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Trust, Practical Learning, Placement Support */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-white mb-6">Premier Professional Video Editing Course in Rajasthan</h2>
              <p className="text-neutral-400 leading-relaxed mb-6 font-medium">
                Our <strong>Professional Video Editing Course in Rajasthan</strong> and practical training at our <strong>Video Editing Institute in Alwar</strong> center on real-world workflows. Distinguishing us as the premier <strong>Video Editing Institute in Rajasthan</strong>, students work alongside veteran film creators, execute live client projects, secure studio internships, and receive dedicated job placement assistance.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning sessions in dedicated computer editing labs",
                  "Create a strong portfolio featuring YouTube edits, commercials, and reels",
                  "Receive an industry recognized certification in post-production",
                  "Complete career counsel support and placement assistance"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                    <span className="text-sm text-neutral-300 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-linear-to-br from-blue-700 to-indigo-950 text-white rounded-3xl p-10 relative overflow-hidden border border-white/10">
              <h3 className="font-display text-2xl font-bold mb-4">Start Creative Editing</h3>
              <p className="text-neutral-300 text-sm mb-6">
                Fill out our course admission enquiry today to book a free demo class at our leading video editing institute in Alwar, Rajasthan.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold hover:scale-105 transition-transform">
                Talk to Our Counselor <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Video Editing Course in Alwar & Rajasthan FAQs</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} onClick={() => setOpenFaq(isOpen ? null : idx)} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-display font-bold text-white text-lg">{faq.q}</span>
                    <span className="text-xl font-bold">{isOpen ? "-" : "+"}</span>
                  </div>
                  {isOpen && <p className="mt-4 text-neutral-400 text-sm leading-relaxed">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ExploreLinks activePath="/video-editing" />
    </main>
  );
}
