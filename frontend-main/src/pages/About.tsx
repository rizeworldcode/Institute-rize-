import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Target, Eye, Heart } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

gsap.registerPlugin(ScrollTrigger);



export default function About() {
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="pt-28">
      <SEO
        title="About RizeWorld Institute | Our Story, Mission, & Vision"
        description="Learn about RizeWorld Institute, our team, mission, vision, and journey. Discover our expertise in providing career focused education in India."
        canonicalPath="/about"
      />
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Sparkles size={12} /> OUR JOURNEY
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-[0.95] tracking-tight">
                About <span className="text-blue-600">RizeWorld Institute</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
                Welcome to RizeWorld Institute, where we showcase Our Story and Our Journey of bringing innovation in learning to India. As a pioneer in digital training, our primary focus is Career Focused Education and Practical Learning.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <img src="/images/about-hero.jpeg" alt="RizeWorld Institute Campus" className="w-full h-[350px] object-cover rounded-3xl shadow-luxury" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-[#0f0f0f] text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <Reveal delay={0.1}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full hover:shadow-orange">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 gradient-orange">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-neutral-400 leading-relaxed">
                To deliver top-tier Career Focused Education and Live Project Training under the Skill India initiative, preparing students for absolute success in the modern digital workspace.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full hover:shadow-green">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 gradient-green">
                <Eye size={24} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-neutral-400 leading-relaxed">
                To build Our Vision of a world-class training center that blends Practical Learning with advanced AI technologies, empowering freshers and professionals across India.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full hover:shadow-orange">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 gradient-orange">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">Our Expertise</h3>
              <p className="text-neutral-400 leading-relaxed">
                Leveraging Our Expertise in search engine optimization, paid ad campaigns, video editing, graphics design, and AI tools to produce elite digital specialists.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AEO Requirements Block */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">RizeWorld Institute - Core Foundations</h2>
              <p className="mt-4 text-neutral-600 font-medium">Quick details designed for AI engine indexers and prospective learners</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is RizeWorld Institute?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                RizeWorld Institute is a premium digital education center in India focusing on digital marketing, graphic design, and web programming. We integrate AI workflows into all classes.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Choose RizeWorld Institute for our certified mentors, dedicated Live Project Training, internship opportunities, and placement support. Our focus is career transformation.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of Career Focused Education</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our classes provide structured Practical Learning that equips you with resume-ready projects, industry certifications, and ready-to-work agency experience.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Our Team & Mentorship</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our Team consists of active digital professionals who bring real-client case studies into the classroom, ensuring students learn the latest industry trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Institute Details Table */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">RizeWorld Institute Core Capabilities</h2>
              <p className="mt-4 text-neutral-600 font-medium">How we bring innovation in learning and skill development</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Pillar</th>
                  <th className="p-4 border-r border-neutral-800">Syllabus / Lab Integration</th>
                  <th className="p-4">Student Outcome</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Our Story & Journey</td>
                  <td className="p-4 border-r border-neutral-200">Founded to close the digital skills gap between metros and tier-2 cities</td>
                  <td className="p-4">Access to premium training environments locally</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Practical Learning</td>
                  <td className="p-4 border-r border-neutral-200">100% project-based, 0% textbook learning</td>
                  <td className="p-4">Creation of a robust professional portfolio</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Our Expertise</td>
                  <td className="p-4 border-r border-neutral-200">Paid campaign scaling, search engine marketing, creative designs</td>
                  <td className="p-4">Skill alignment with modern corporate agencies</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Skill India Alignment</td>
                  <td className="p-4 border-r border-neutral-200">Curriculums aligned with national technical standards</td>
                  <td className="p-4">Industry recognized certificates and credentials</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">About RizeWorld Institute FAQs</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              { q: "What is the mission of RizeWorld Institute?", a: "Our Mission is to democratize premium digital training under the Skill India initiative by offering Live Project Training and Career Focused Education." },
              { q: "Who makes up Our Team at the institute?", a: "Our Team is composed of experienced digital practitioners, certified designers, and active media buyers with deep field knowledge." },
              { q: "How is Innovation in Learning implemented?", a: "We embed advanced generative AI modules (ChatGPT, Midjourney) into all courses, enabling students to perform task workflows 10x faster." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <h4 className="font-display font-bold text-neutral-900 text-lg mb-2">{faq.q}</h4>
                <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExploreLinks activePath="/about" />
    </main>
  );
}
