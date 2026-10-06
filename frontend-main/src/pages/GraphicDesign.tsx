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
      "name": "Graphic Design Course in Alwar & Rajasthan",
      "description": "Enroll in the Best Graphic Design Course in Alwar at RizeWorld Institute. Leading Graphic Design Institute in Rajasthan offering a Professional Graphic Design Course in Rajasthan.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Certified Graphic Designer"
    }
  ];

  const faqs = [
    {
      q: "Which institute offers the Best Graphic Design Course in Alwar?",
      a: "RizeWorld Institute is rated as the Best Graphic Design Course in Alwar, featuring hands-on training in Photoshop, Illustrator, Canva Pro, brand identity kits, and marketing visual design."
    },
    {
      q: "What makes RizeWorld the leading Graphic Design Institute in Alwar?",
      a: "As the top Graphic Design Institute in Alwar, RizeWorld provides state-of-the-art creative labs, real corporate design briefs, certified mentors, and 1-on-1 portfolio feedback."
    },
    {
      q: "Why enroll in a Professional Graphic Design Course in Rajasthan at RizeWorld?",
      a: "Our Professional Graphic Design Course in Rajasthan empowers students to create an industry-grade portfolio of 15+ real-world brand assets, supported by verified certification and placement assistance."
    },
    {
      q: "How does RizeWorld compare to another Graphic Design Institute in Rajasthan?",
      a: "Unlike institutes that focus only on software basics, our Graphic Design Course in Rajasthan and training at our Graphic Design Institute in Rajasthan incorporate UI/UX basics, AI design generation, and print production standards."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best Graphic Design Course in Alwar | Graphic Design Institute in Rajasthan"
        description="Enroll in the Best Graphic Design Course in Alwar at RizeWorld Institute. Top Graphic Design Institute in Alwar offering a Professional Graphic Design Course in Rajasthan."
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
                Unlock Creativity with the <span className="text-blue-600">Best Graphic Design Course in Alwar</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Build a striking creative portfolio at RizeWorld Institute, recognized as the premier <strong>Graphic Design Institute in Alwar</strong>. Enroll in our practical <strong>Graphic Design Course in Alwar</strong> or take your career state-wide with the most recommended <strong>Graphic Design Course in Rajasthan</strong>. As the foremost <strong>Graphic Design Institute in Rajasthan</strong>, we offer an industry-acclaimed <strong>Professional Graphic Design Course in Rajasthan</strong> backed by 100% practical lab work and job placement assistance.
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
                  <span className="font-semibold">Best Graphic Design Course in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Campus</span>
                  <span className="font-semibold">Graphic Design Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">State Reach</span>
                  <span className="font-semibold">Graphic Design Institute in Rajasthan</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Program</span>
                  <span className="font-semibold">Professional Graphic Design Course in Rajasthan</span>
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
              <p className="mt-4 text-neutral-600 font-medium">Direct explanations regarding our Graphic Design Course in Alwar & Rajasthan</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Graphic Design Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A <strong>Graphic Design Course</strong> teaches visual communication, composition, color psychology, and professional design suites. RizeWorld Institute provides an industry-tested <strong>Graphic Design Course in Alwar</strong> and <strong>Graphic Design Course in Rajasthan</strong> covering Photoshop, Illustrator, and Canva.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld as your Graphic Design Institute in Alwar?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute is recognized as the leading <strong>Graphic Design Institute in Alwar</strong> and top <strong>Graphic Design Institute in Rajasthan</strong>, offering live agency briefs, design critique sessions, and the <strong>Best Graphic Design Course in Alwar</strong>.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of our Professional Graphic Design Course in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our <strong>Professional Graphic Design Course in Rajasthan</strong> equips you with high-value design credentials, complete brand identity creation skills, and direct access to design agency hiring drives.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities from our Graphic Design Institute in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates from our campus—a benchmark among any <strong>Graphic Design Institute in Rajasthan</strong>—step into high-demand roles as Brand Designers, Visual Creatives, and Art Directors with complete placement support.
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Graphic Design Tool Matrix & Syllabus Breakdown</h2>
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Premier Professional Graphic Design Course in Rajasthan</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our <strong>Professional Graphic Design Course in Rajasthan</strong> and hands-on lab sessions at our <strong>Graphic Design Institute in Alwar</strong> emphasize career-focused excellence. Setting us apart from any ordinary <strong>Graphic Design Institute in Rajasthan</strong>, students learn under experienced design directors, work on live projects during our <strong>Graphic Design Course in Alwar</strong>, and secure agency internships.
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
                Connect with our counselor to get batch details and schedule a free demo class at our graphic design training center in Alwar, Rajasthan.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Graphic Design Course in Alwar & Rajasthan FAQs</h2>
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
