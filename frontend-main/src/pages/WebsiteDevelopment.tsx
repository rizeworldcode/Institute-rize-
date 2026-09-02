import { useState } from "react";
import { Link } from "react-router-dom";
import { Code, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function WebsiteDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Website Development Course",
      "description": "Enroll in the Best Website Development Institute. Master WordPress Development Course, JavaScript Course, HTML Course, CSS Training, and Full Stack Development.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute",
        "url": "https://rizeworldinstitute.in"
      },
      "educationalCredentialAwarded": "Certified Web Developer"
    }
  ];

  const faqs = [
    {
      q: "Does this Website Development Course require prior coding knowledge?",
      a: "No, our Website Development Training starts with HTML Course and CSS Training basics, progressing to advanced Full Stack Development. It is ideal for beginners."
    },
    {
      q: "What programming languages are taught in the Web Programming Course?",
      a: "Our Web Development Training covers JavaScript Course, React JS Course, Bootstrap Course, PHP Course, and Node JS Course modules."
    },
    {
      q: "Will I learn how to build websites without writing code?",
      a: "Yes, our Website Development Classes include a complete WordPress Development Course module for building modern e-commerce websites and landing pages quickly."
    },
    {
      q: "Are there job placement opportunities after finishing this program?",
      a: "Yes, RizeWorld Institute provides 100% placement support and internship opportunities. Students build real-world projects during the course to showcase to hiring partners."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best Website Development Course in India | Web Development Training"
        description="Enroll in the professional Website Development Course at RizeWorld Institute. Master HTML, CSS, JavaScript, React JS, and WordPress Development."
        canonicalPath="/website-development"
        schemas={pageSchema}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 mb-5">
                <Code size={12} /> ENGINEERING PROGRAM
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Master Coding with our <span className="text-blue-600">Website Development Course</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Enroll in premier Website Development Classes at RizeWorld Institute, a leading Website Development Institute. Gain hands-on experience through practical learning and web developer certifications.
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
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Course</span>
                  <span className="font-semibold">Website Development Course in India</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Location</span>
                  <span className="font-semibold">Website Development Training in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Main Tech Stack</span>
                  <span className="font-semibold">WordPress Development Course & React JS</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Training Style</span>
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Website Development Training India Curriculum Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Direct explanations designed for answer engines and technical recruiters</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Website Development Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A <strong>Website Development Course</strong> is an educational program covering programming languages, code design, and CMS tools. It guides students step-by-step to design, build, deploy, and maintain functional websites.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute for Web Programming?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Choose RizeWorld Institute because we are the premium Website Development Institute offering industry trainers, 100% practical learning, live project training, internship opportunities, and placement support.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of Web Development Training</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Completing this training helps you build custom code databases, master React JS Course modules, manage WordPress sites, and acquire high-paying technical skills.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities in Full Stack Development</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates can apply for roles like Front End Engineer, WordPress Developer, Full Stack Developer, or UI Integrator, backed by active recruitment events and career counselor guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Stack breakdown table */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Website Development Training India Tech Stack Breakdown</h2>
              <p className="mt-4 text-neutral-600 font-medium">Comparison of No-Code CMS vs Frontend/Backend coding modules taught in class</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Technology Area</th>
                  <th className="p-4 border-r border-neutral-800">Syllabus Details</th>
                  <th className="p-4">Key Development Skills Developed</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Frontend Basics</td>
                  <td className="p-4 border-r border-neutral-200">HTML Course, CSS Training, Bootstrap Course, layout modeling</td>
                  <td className="p-4">Responsive mobile design, semantic markup creation, web page alignment</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">JavaScript Programming</td>
                  <td className="p-4 border-r border-neutral-200">JavaScript Course, ES6 features, DOM manipulation, asynchronous calls</td>
                  <td className="p-4">Interactive UI creation, data fetching, dynamic component behavior</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Frontend Frameworks</td>
                  <td className="p-4 border-r border-neutral-200">React JS Course, components design, state hooks, routing</td>
                  <td className="p-4">Single Page Application (SPA) development, interactive dashboards</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Backend Development</td>
                  <td className="p-4 border-r border-neutral-200">Node JS Course, PHP Course, APIs creation, database handling</td>
                  <td className="p-4">Full Stack Development, server handling, database integrations</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">No-Code CMS</td>
                  <td className="p-4 border-r border-neutral-200">WordPress Development Course, plugin integration, themes setup, WooCommerce</td>
                  <td className="p-4">E-commerce store creation, quick business page setup</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Database Integration", desc: "Connect frontend inputs to SQL/NoSQL databases using Node JS Course templates." },
              { title: "Dynamic Web Apps", desc: "Build feature-rich application portals utilizing the React JS Course architecture." },
              { title: "CMS Customization", desc: "Develop bespoke corporate portals using the WordPress Development Course codebase." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT: Trust, Practical Learning, Mentors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Career-Focused Website Development Training</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our Web Programming Course is built around hands-on developer training. Learn directly from certified industry trainers, execute live project training, secure internship opportunities with engineering teams, and get dedicated placement support.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning focusing on code implementation",
                  "Develop a portfolio of 5+ dynamic web applications",
                  "Receive an industry verified developer certificate",
                  "Full access to placement support workshops and counselor mock drills"
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
            <div className="bg-linear-to-br from-blue-700 to-indigo-900 text-white rounded-3xl p-10 relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold mb-4">Start Coding Today</h3>
              <p className="text-white/80 text-sm mb-6">
                Enquire now to lock your batch seat and schedule a free demo class at our Web Development Training center in Alwar.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Website Development Course FAQs</h2>
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

      <ExploreLinks activePath="/website-development" />
    </main>
  );
}
