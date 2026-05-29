import { Link } from "react-router-dom";
import { Brain, Palette, Video, TrendingUp, Search, BarChart3, Code, ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import Reveal from "../components/Reveal";

const modules = [
  { icon: Brain, title: "AI Tools + DM Basics", desc: "Master ChatGPT, Gemini, Claude, Midjourney, and modern AI workflows for digital marketing automation.", duration: "2 weeks", topics: ["ChatGPT for Marketing", "Midjourney & DALL-E", "AI Copywriting", "Workflow Automation", "Prompt Engineering"] },
  { icon: Palette, title: "Graphic Design + Photoshop", desc: "Create stunning visuals, brand identities, and social media creatives with industry-standard tools.", duration: "2 weeks", topics: ["Photoshop Mastery", "Canva Pro", "Brand Identity", "Social Media Design", "Print & Digital"] },
  { icon: Video, title: "Video Editing", desc: "Cinematic editing for YouTube, Reels, Shorts, and brand storytelling using Premiere Pro & CapCut.", duration: "1.5 weeks", topics: ["Premiere Pro", "CapCut Mastery", "Color Grading", "Motion Graphics", "Reels & Shorts"] },
  { icon: TrendingUp, title: "SMO (Social Media Optimization)", desc: "Build, grow, and monetize audiences across Instagram, Facebook, LinkedIn, and emerging platforms.", duration: "1.5 weeks", topics: ["Content Strategy", "Community Building", "Influencer Marketing", "Reels Growth", "Analytics"] },
  { icon: Search, title: "SEO (Search Engine Optimization)", desc: "Rank #1 on Google with advanced on-page, off-page, and technical SEO strategies.", duration: "1.5 weeks", topics: ["Keyword Research", "On-Page SEO", "Technical SEO", "Link Building", "Local SEO"] },
  { icon: BarChart3, title: "Performance Marketing", desc: "Run profitable Meta, Google, and YouTube ad campaigns with data-driven strategies.", duration: "2 weeks", topics: ["Meta Ads", "Google Ads", "YouTube Ads", "Conversion Tracking", "ROAS Optimization"] },
  { icon: Code, title: "Website Development", desc: "Build fast, modern websites with WordPress, Webflow, and basic HTML/CSS.", duration: "1.5 weeks", topics: ["WordPress", "Webflow", "HTML/CSS Basics", "Landing Pages", "E-commerce"] },
];

const combos = [
  {
    name: "Marketing Pro",
    desc: "Complete digital marketing mastery — from AI to paid ads.",
    modules: ["AI Tools", "SMO", "SEO", "Performance Marketing"],
    
    color: "orange",
    popular: false,
  },
  {
    name: "Creative Pro",
    desc: "Design + video + content creation powerhouse.",
    modules: ["AI Tools", "Graphic Design", "Video Editing", "SMO"],
    
    color: "green",
    popular: true,
  },
  {
    name: "Tech Pro",
    desc: "Web dev + AI + automation for tech-driven marketers.",
    modules: ["AI Tools", "Website Development", "SEO", "Performance Marketing"],
   
    color: "orange",
    popular: false,
  },
];

export default function Courses() {
  return (
    <main className="pt-28 bg-neutral-50 min-h-screen">
      {/* Master Course Featured */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="bg-neutral-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-300 mb-6">
                    <Sparkles size={12} /> FLAGSHIP PROGRAM
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                    The 3-Month <br />
                    <span className="text-blue-400">Job-Ready</span> Master Course.
                  </h2>
                  <p className="text-neutral-400 text-lg mb-8 max-w-md">
                    Complete digital marketing mastery from AI tools to paid ads. 7 modules, 12 weeks, 100% practical training.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link to="/master-course" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                      View Full Syllabus <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Sparkles, text: "All 7 Modules Included" },
                    { icon: CheckCircle2, text: "12 Weeks Duration" },
                    { icon: Brain, text: "AI-First Approach" },
                    { icon: Zap, text: "100% Job Assistance" }
                  ].map((f, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                      <f.icon size={24} className="text-blue-400 mb-3" />
                      <div className="font-semibold text-neutral-200">{f.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Individual Modules */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 mb-4">
                <Sparkles size={12} /> INDIVIDUAL MODULES
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-900">Master every skill.</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((m, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="group bg-white border border-neutral-200 rounded-3xl p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <m.icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-neutral-900 mb-3">{m.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">{m.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-100">
                    {m.topics.map((t, j) => (
                      <span key={j} className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Combo Packages */}
      <section className="py-24 bg-neutral-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-4">
                <Zap size={12} /> COMBO PACKAGES
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
                Stack skills. <span className="text-blue-600">Save more.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {combos.map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative bg-white rounded-3xl p-8 h-full transition-all duration-500 hover:-translate-y-2 border border-neutral-200 hover:border-blue-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex flex-col">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-orange-50 text-orange-600 self-start">
                    {c.name.toUpperCase()}
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900 mb-6 flex-1">{c.desc}</h3>
                  <div className="space-y-4 pt-6 border-t border-neutral-100">
                    {c.modules.map((mod, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-blue-600 mt-0.5" />
                        <span className="text-sm font-medium text-neutral-700">{mod}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/contact"
                    className="w-full mt-10 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all bg-neutral-100 text-neutral-900 hover:bg-blue-600 hover:text-white"
                  >
                    Choose {c.name} <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
