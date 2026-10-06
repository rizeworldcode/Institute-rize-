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
      "name": "Website Development Course in Alwar & Rajasthan",
      "description": "Enroll in the Best Web Development Course in Alwar at RizeWorld Institute. Top Web Development Institute in Rajasthan offering Full Stack Development Course in Rajasthan.",
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
      q: "Which institute offers the Best Web Development Course in Alwar?",
      a: "RizeWorld Institute provides the Best Web Development Course in Alwar, featuring hands-on training across HTML, CSS, JavaScript, React JS, Node.js, and WordPress development."
    },
    {
      q: "What makes RizeWorld the leading Web Development Institute in Alwar?",
      a: "As the top Web Development Institute in Alwar, RizeWorld offers high-tech coding labs, live project deployments on real servers, verified industry certifications, and 1-on-1 code reviews."
    },
    {
      q: "Is this a Full Stack Development Course in Rajasthan with job placement?",
      a: "Yes, our Full Stack Development Course in Rajasthan and Website Development Course in Rajasthan provide 100% placement support, mock technical interviews, and portfolio hosting assistance."
    },
    {
      q: "Why choose RizeWorld among other Web Development Institute in Rajasthan options?",
      a: "Unlike typical theory-focused institutes, our Website Development Course in Rajasthan and training at our Web Development Institute in Rajasthan focus on building production-grade web apps, APIs, and scalable eCommerce systems."
    }
  ];

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      <SEO
        title="Best Web Development Course in Alwar | Web Development Institute in Rajasthan"
        description="Learn coding at RizeWorld Institute, the top Web Development Institute in Alwar. Join our Website Development Course in Alwar & Full Stack Development Course in Rajasthan."
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
                Master Coding with the <span className="text-blue-600">Best Web Development Course in Alwar</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 leading-relaxed font-medium">
                Launch your software engineering journey at RizeWorld Institute, acknowledged as the top <strong>Web Development Institute in Alwar</strong>. Whether you are looking for an intensive <strong>Website Development Course in Alwar</strong> or the highest-rated <strong>Website Development Course in Rajasthan</strong>, our practical curriculum cements our reputation as the leading <strong>Web Development Institute in Rajasthan</strong>. Master frontend and backend engineering through our industry-leading <strong>Full Stack Development Course in Rajasthan</strong>.
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
                  <span className="font-semibold">Best Web Development Course in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Campus</span>
                  <span className="font-semibold">Web Development Institute in Alwar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Regional Reach</span>
                  <span className="font-semibold">Web Development Institute in Rajasthan</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-400">Specialization</span>
                  <span className="font-semibold">Full Stack Development Course in Rajasthan</span>
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Website Development Training Curriculum Overview</h2>
              <p className="mt-4 text-neutral-600 font-medium">Direct explanations regarding our Website Development Course in Alwar & Rajasthan</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Website Development Course?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A <strong>Website Development Course</strong> is an educational curriculum covering coding architecture, databases, UI engineering, and CMS frameworks. RizeWorld Institute provides an advanced <strong>Website Development Course in Alwar</strong> and <strong>Website Development Course in Rajasthan</strong> covering React, Node.js, and WordPress.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld as your Web Development Institute in Alwar?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute is rated as the premier <strong>Web Development Institute in Alwar</strong> and foremost <strong>Web Development Institute in Rajasthan</strong>, offering hands-on coding drills, live servers, verified developer certifications, and the <strong>Best Web Development Course in Alwar</strong>.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of our Full Stack Development Course in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Completing our <strong>Full Stack Development Course in Rajasthan</strong> equips you to architect full-scale web applications, manage REST APIs, configure databases, and command high-paying developer packages.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Career opportunities from our Web Development Institute in Rajasthan</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Graduates from our campus—a gold standard among any <strong>Web Development Institute in Rajasthan</strong>—step into roles as Frontend Engineers, Full Stack Developers, and WordPress Specialists with complete recruitment support.
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Website Development Tech Stack Breakdown</h2>
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
              { title: "Database Integration", desc: "Connect frontend inputs to SQL/NoSQL databases using modern backend connectors." },
              { title: "Dynamic Web Apps", desc: "Build feature-rich application portals utilizing the React JS architecture." },
              { title: "CMS Customization", desc: "Develop bespoke corporate portals using the WordPress Development codebase." }
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
              <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Premier Full Stack Development Course in Rajasthan & Alwar</h2>
              <p className="text-neutral-600 leading-relaxed mb-6 font-medium">
                Our <strong>Full Stack Development Course in Rajasthan</strong> and hands-on coding sessions at our <strong>Web Development Institute in Alwar</strong> focus on real-world engineering. Setting us apart as the foremost <strong>Web Development Institute in Rajasthan</strong>, our students build and launch production websites during our <strong>Website Development Course in Alwar</strong> with complete placement support.
              </p>
              <div className="space-y-4">
                {[
                  "100% Practical learning focusing on code implementation",
                  "Develop a portfolio of 5+ dynamic web applications",
                  "Receive an industry verified developer certificate",
                  "Full access to placement support workshops and mock interviews"
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
                Enquire now to lock your batch seat and schedule a free demo class at our web engineering campus in Alwar, Rajasthan.
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
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Website Development Course in Alwar & Rajasthan FAQs</h2>
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
