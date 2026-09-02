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
      "name": "Video Editing Course",
      "description": "Enroll in the Best Video Editing Course. Master Adobe Premiere Pro Course, DaVinci Resolve Course, and Youtube Video Editing.",
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
      q: "What software is covered in this Professional Video Editing Course?",
      a: "Our curriculum covers Adobe Premiere Pro Course, Adobe After Effects Course, DaVinci Resolve Course, and Final Cut Pro Course concepts."
    },
    {
      q: "Do I need a high-end computer to join Video Editing Classes?",
      a: "No, RizeWorld Institute features high-performance editing systems in our physical computer lab. Students get complete access during course hours."
    },
    {
      q: "Is YouTube Video Editing covered in the curriculum?",
      a: "Yes, we focus heavily on YouTube Video Editing, Reels production, TikTok structures, Video Animation, and audio design workflows."
    },
    {
      q: "Do you offer placement support for editors?",
      a: "Yes, we provide placement support and internship opportunities. RizeWorld Institute connects graduates with media agencies, production houses, and marketing firms."
    }
  ];

  return (
    <main className="pt-28 bg-[#0a0a0c] text-white min-h-screen">
      <SEO
        title="Best Video Editing Course in India | Professional Video Editing Classes"
        description="Enroll in the professional Video Editing Course at RizeWorld Institute. Master Premiere Pro, After Effects, DaVinci Resolve, and Video Animation."
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
                Master Storytelling with our <span className="text-blue-400">Video Editing Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-400 leading-relaxed font-medium">
                Enroll in the Best Video Editing Course India. Train at our leading Video Editing Institute and acquire advanced skills in Adobe Premiere Pro Course and DaVinci Resolve Course structures.
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
                  <span className="font-semibold text-white">Video Editing Course in India</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Institute</span>
                  <span className="font-semibold text-white">Video Editing Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Main Focus</span>
                  <span className="font-semibold text-white">Premiere Pro Video Editing Course & Effects</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Method</span>
                  <span className="font-semibold text-white">Practical learning (Live Projects)</span>
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Video Editing Training India Course Breakdown</h2>
              <p className="mt-4 text-neutral-400 font-medium">Clear answers formatted for modern voice-search and generative engines</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">What is a Video Editing Course?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A <strong>Video Editing Course</strong> is an educational curriculum covering footage cutting, audio alignment, color grading, and special effects. It teaches you to compile video sequences for commercial brands and YouTube.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Why choose RizeWorld Institute for editing?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We are a premier digital institute providing industry trainers, high-performance systems, live project training, internship opportunities, and placement support.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Benefits of our Video Editing Classes</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Learn modern Premiere Pro Video Editing Course modules, master DaVinci Resolve Course setups for color workflows, and learn to compile professional Video Animation.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Career opportunities after Video Editing Training</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Open professional pathways as a Video Editor, Motion Graphic Designer, YouTube Editor, or Studio Post-Production Specialist, with comprehensive support from our counseling team.
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
              <h2 className="font-display text-3xl font-extrabold text-white">Video Editing Training India Technical Breakdown</h2>
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
              <h2 className="font-display text-3xl font-extrabold text-white mb-6">Learn at a Premier Video Editing Institute</h2>
              <p className="text-neutral-400 leading-relaxed mb-6 font-medium">
                Our Video Editing Training India structure centers on practical learning. Work alongside veteran film creators, execute live project training, secure internship opportunities with active studios, and receive full placement support.
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
                Fill out our course admission enquiry today to book a free demo class at our Video Editing Training center in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Video Editing Course FAQs</h2>
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
