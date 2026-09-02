import { useState } from "react";
import { Link } from "react-router-dom";
import { Palette, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function GraphicDesignPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Graphic Design Course",
      "description": "Enroll in the Advanced Graphic Design Course. Master Photoshop Training, Logo Design, Canva Course, and earn a Graphic Design Course with Certificate.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Graphic Design Course with Certificate"
    }
  ];

  const faqs = [
    {
      q: "What certifications are provided in this Graphic Designing Course?",
      a: "Our students receive a Graphic Design Course with Certificate upon completion. We also prepare you for industry Photoshop Certification."
    },
    {
      q: "Which tools are covered in this Graphic Design Training?",
      a: "The program at our Graphic Design Institute includes Photoshop Training, Illustrator design concepts, and a complete Canva Graphic Design Course."
    },
    {
      q: "What projects will I build during the Advanced Graphic Design Course?",
      a: "You will work on real-world projects such as Logo Design, Print Design marketing collaterals, and social media brand templates."
    },
    {
      q: "Are there job placements after completing the Graphic Designing Course India?",
      a: "Yes, RizeWorld Institute provides 100% placement support and internship opportunities. We connect our graduates with hiring agencies across India."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best Graphic Design Course in India | Graphic Design Institute"
        description="Enroll in the Advanced Graphic Design Course at RizeWorld Institute. Master Photoshop, Canva, Logo Design, Print Design, and get certified."
        canonicalPath="/graphic-design"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Palette size={12} /> CREATIVE PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Unlock Creativity with our <span className="text-blue-600">Graphic Design Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Enroll in the premium Graphic Designing Course at RizeWorld Institute, a leading Graphic Design Training Institute. Build a striking creative portfolio with practical learning and certified industry trainers.
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
                  <span className="font-semibold">Graphic Design Course in India</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Institute</span>
                  <span className="font-semibold">Graphic Design Institute in India</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Main Focus</span>
                  <span className="font-semibold">Logo Design & Photoshop Training</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Certificate</span>
                  <span className="font-semibold">Graphic Design Course with Certificate</span>
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Graphic Design Training Syllabus Insights</h2>
              <p className="mt-4 text-neutral-600 font-medium">Direct explanations compiled for smart answer engines and design recruiters</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Graphic Design Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A <strong>Graphic Design Course</strong> is an educational training program teaching layout management, typography, visual theory, and editing tools. It trains students to translate brand narratives into striking visuals.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute for design training?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute is a recognized Graphic Design Training Institute. We offer live project training, creative design labs, certified industry trainers, internship opportunities, and 100% placement support.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of our Advanced Graphic Design Course</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Get a recognized Graphic Design Course with Certificate, master Logo Design, and learn modern workflow automation using Canva Graphic Design Course setups.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities in Graphic Designing Course India</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Unlock premium creative pathways as a Brand Designer, Photoshop Editor, Layout Specialist, or Creative Director, supported by our active recruitment and counseling team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Design Tools Table */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Graphic Designing Course India Tool Matrix</h2>
              <p className="mt-4 text-neutral-600 font-medium">Comparison of professional vector and raster software taught in class</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Tool / Subject</th>
                  <th className="p-4 border-r border-neutral-800">Syllabus Breakdown</th>
                  <th className="p-4">Key Creative Competencies Developed</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Photoshop</td>
                  <td className="p-4 border-r border-neutral-200">Photoshop Training, layer masking, photo restoration, blending modes, raster formats</td>
                  <td className="p-4">Digital art compilation, image manipulation, Photoshop Certification preparation</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Canva</td>
                  <td className="p-4 border-r border-neutral-200">Canva Course, templates curation, social media grids, brand kits creation</td>
                  <td className="p-4">Canva Graphic Design Course, rapid marketing design, client deck setups</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Logo & Brand Identity</td>
                  <td className="p-4 border-r border-neutral-200">Logo Design, color palettes, vector layout rules, client brief guidelines</td>
                  <td className="p-4">Corporate branding, vector design, typography hierarchy mapping</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Print Design</td>
                  <td className="p-4 border-r border-neutral-200">Print layouts, CMYK mapping, bleed lines, packaging design, brochures</td>
                  <td className="p-4">Industrial publication design, print production management</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Visual Branding", desc: "Build complete corporate identities including Logo Design assets and brand guidelines." },
              { title: "Marketing Collateral", desc: "Design social media banners and print designs optimized for high-performing client campaigns." },
              { title: "Advanced Photo Editing", desc: "Acquire Photoshop Certification prep training for photo manipulation and composite creation." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Trust, Practical Learning, Mentorship */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Learn at the Best Graphic Design Institute</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our Graphic Design Training focuses heavily on practical learning. Work with experienced industry trainers, execute live project training, secure internship opportunities with active agencies, and receive full placement support.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning sessions in state-of-the-art creative labs",
                  "Design a premium portfolio with 15+ real client briefs",
                  "Earn an industry recognized Graphic Design Course with Certificate",
                  "Active recruitment support and interview counselling drills"
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
            <div className="bg-linear-to-br from-orange-600 to-amber-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Start Designing</h3>
              <p className="text-white/80 text-sm mb-6">
                Connect with our counselor to get batch details and schedule a free demo class at our Graphic Design Training Institute in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Graphic Design Course FAQs</h2>
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

      <ExploreLinks activePath="/graphic-design" />
    </main>
  );
}
