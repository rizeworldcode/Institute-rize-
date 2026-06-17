import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, Calendar, MapPin, Users, Zap, Brain, Palette, Video, TrendingUp, Search, BarChart3, Code, Sparkles, Target } from "lucide-react";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const roadmap = [
  { week: "Week 1-2", title: "AI Tools + DM Basics", desc: "Master ChatGPT, Midjourney, and foundational digital marketing principles.", icon: Brain, color: "orange" },
  { week: "Week 3-4", title: "Graphic Design + Photoshop", desc: "Design stunning visuals, brand identities, and social creatives.", icon: Palette, color: "green" },
  { week: "Week 5-6", title: "Video Editing", desc: "Cinematic editing, Reels, and YouTube content creation mastery.", icon: Video, color: "orange" },
  { week: "Week 7-8", title: "SMO", desc: "Build and grow audiences on Instagram, Facebook, LinkedIn.", icon: TrendingUp, color: "green" },
  { week: "Week 9", title: "SEO", desc: "Rank #1 on Google with on-page, off-page, and technical SEO.", icon: Search, color: "orange" },
  { week: "Week 10-11", title: "Performance Marketing", desc: "Run profitable Meta and Google ads with data-driven strategies.", icon: BarChart3, color: "green" },
  { week: "Week 12", title: "Website Development", desc: "Build fast, modern websites with WordPress and Webflow.", icon: Code, color: "orange" },
];

const highlights = [
  { icon: Calendar, label: "Duration", value: "12 Weeks" },
  { icon: Zap, label: "Job Assistance", value: "100%" },
  { icon: Users, label: "Batch Size", value: "Max 20" },
  { icon: MapPin, label: "Location", value: "Alwar, Rajasthan" },
];

export default function MasterCourse() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    const line = tl.querySelector(".timeline-line") as HTMLElement;
    if (line) {
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 60%", scrub: true },
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white border-b border-neutral-200">
        <div className="absolute inset-0">
          <img src="/images/master-course.jpg" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-linear-to-br from-white via-white/95 to-white/90" />
        </div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 opacity-50 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 opacity-50 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Sparkles size={12} /> FLAGSHIP PROGRAM
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-[0.95] tracking-tight">
                The 3-Month <br /><span className="text-blue-600">Job-Ready</span> <br />Master Course.
              </h1>
              <div className="mt-6 text-lg text-neutral-600 max-w-lg leading-relaxed font-medium space-y-2 border-l-4 border-blue-600 pl-4">
                <p>3-month job-ready program | Alwar, Rajasthan</p>
                <p className="font-bold text-neutral-900">7 modules • 12 weeks</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  Enroll Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-neutral-100 text-neutral-900 font-semibold hover:bg-neutral-200 transition-colors"
                >
                  View Curriculum
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {highlights.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <h.icon size={16} className="text-blue-600 mb-1" />
                      <div className="text-[10px] text-neutral-500 font-semibold">{h.label}</div>
                      <div className="font-display font-bold text-neutral-900">{h.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-100">
                  {[
                    "All 7 modules included",
                    "Live classes + recordings",
                    "1-on-1 mentor calls",
                    "Portfolio building sessions",
                    "Industry-recognized certificate",
                    "Lifetime community access",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-sm font-medium text-neutral-700">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md transition-all"
                >
                  Reserve My Seat <ArrowRight size={16} />
                </Link>
                <p className="text-[10px] text-center text-neutral-500 mt-2">EMI options available • No credit check</p>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section id="curriculum" className="py-24 bg-neutral-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-600 mb-4">
                <Target size={12} /> 12-WEEK ROADMAP
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight">
                Your <span className="text-blue-600">journey</span>, mapped out.
              </h2>
              <p className="mt-6 text-lg text-neutral-600">
                A structured path from curious beginner to confident professional.
              </p>
            </div>
          </Reveal>

          <div ref={timelineRef} className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-neutral-200 rounded-full overflow-hidden">
              <div className="timeline-line w-full h-full bg-blue-600 origin-top" />
            </div>

            <div className="space-y-10">
              {roadmap.map((r, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center gap-6`}>
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-blue-600 z-10 shadow-sm" />
                    <div className="md:w-1/2 pl-12 md:pl-0 md:px-8">
                      <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:border-blue-500">
                        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3 ${
                          r.color === "orange" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                        }`}>
                          {r.week.toUpperCase()}
                        </div>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            r.color === "orange" ? "bg-orange-50" : "bg-green-50"
                          }`}>
                            <r.icon size={22} className={r.color === "orange" ? "text-orange-600" : "text-green-600"} />
                          </div>
                          <div>
                            <h3 className="font-display text-xl font-bold text-neutral-900">{r.title}</h3>
                            <p className="text-sm text-neutral-600 mt-1">{r.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight">
                What you'll <span className="text-blue-600">walk away with.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Portfolio of 10+ projects", desc: "Real client briefs, personal brands, and campaigns that showcase your skills." },
              { title: "Industry-recognized certificate", desc: "A credential valued by top agencies and brands across India." },
              { title: "Confident interview skills", desc: "Mock interviews and portfolio reviews prep you for the job market." },
              { title: "AI-first mindset", desc: "Work 10x faster with AI tools embedded into every workflow." },
              { title: "Professional network", desc: "Connect with our alumni network and industry mentors." },
              { title: "Lifetime community access", desc: "Stay connected with updates, job leads, and learning resources." },
            ].map((o, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 hover:border-blue-500">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Zap size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-display font-bold text-neutral-900 mb-2">{o.title}</h3>
                  <p className="text-sm text-neutral-600">{o.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-blue-50">
        <div className="absolute inset-0 bg-blue-600 opacity-[0.03]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 opacity-50 blur-3xl rounded-full" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-tight">
              Your future self will <span className="text-blue-600">thank you.</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-600">
              Enroll now. Don't wait for the next one.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 mt-10 px-10 py-5 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-md transition-all hover:scale-105"
            >
              Enroll Now <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
