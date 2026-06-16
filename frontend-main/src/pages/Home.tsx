import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ArrowRight, Sparkles, Brain, Palette, Video, TrendingUp, Search, BarChart3, Code, Users, Award, Zap, CheckCircle2, Quote, Star, MapPin, BookOpen, Briefcase } from "lucide-react";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  { icon: Brain, title: "AI Tools + DM Basics", desc: "Master ChatGPT, Midjourney, and AI-powered marketing workflows.", color: "orange" },
  { icon: Palette, title: "Graphic Design + Photoshop", desc: "Create stunning visuals with modern design principles and tools.", color: "green" },
  { icon: Video, title: "Video Editing", desc: "Cinematic editing for YouTube, Reels, and brand storytelling.", color: "orange" },
  { icon: TrendingUp, title: "SMO", desc: "Build brands on Instagram, Facebook, LinkedIn, and more.", color: "green" },
  { icon: Search, title: "SEO", desc: "Rank #1 on Google with advanced on-page and off-page strategies.", color: "orange" },
  { icon: BarChart3, title: "Performance Marketing", desc: "Run profitable Meta, Google, and YouTube ad campaigns.", color: "green" },
  { icon: Code, title: "Website Development", desc: "Build fast, modern websites with no-code and code tools.", color: "orange" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Digital Marketer", text: "RizeWorld transformed my career. The AI tools module alone was worth the entire course. I landed a senior role within 2 months.", rating: 5 },
  { name: "Rahul Verma", role: "Freelance Designer", text: "The trainers are industry pros who genuinely care. The glass-classroom vibe and hands-on projects made learning addictive.", rating: 5 },
  { name: "Anjali Mehta", role: "Content Creator", text: "From zero to 100K followers on Instagram. The SMO and video editing modules are pure gold. Highly recommended.", rating: 5 },
];

const faqs = [
  { q: "What makes RizeWorld different?", a: "We blend AI, design, and marketing into one premium curriculum taught by industry veterans. Our focus is job-ready skills, not theory." },
  { q: "Do I need prior experience?", a: "Not at all. Our modules are designed for absolute beginners and progress to advanced mastery with hands-on projects." },
  { q: "What is the batch size?", a: "We keep batches small (max 20 students) to ensure personalized mentorship and premium learning experience." },
  { q: "Is the course online or offline?", a: "Both. Our flagship campus is in Alwar, Rajasthan, with hybrid options available for working professionals." },
  { q: "Will I get a certificate?", a: "Yes, you receive an industry-recognized RizeWorld certificate upon completion, plus portfolio reviews." },
];


const heroCourseData: any = {
  master: {
    title: "Master Course Program",
    desc: "This flagship program seamlessly blends into the modern digital landscape. Master all core modules with our 12-week intensive curriculum.",
    stats: [
      { text: "12 Weeks (3 hrs daily)", icon: <Clock size={16} /> },
      { text: "7 Modules", icon: <BookOpen size={16} /> },
      { text: "20 Seat Batch", icon: <Users size={16} /> },
      { text: "Placement Assistance", icon: <Briefcase size={16} /> }
    ]
  },
  individual: {
    title: "Individual Modules",
    desc: "AI Tools+DM basics, Graphic Design+Photoshop, Video Editing, SMO, SEO, Performance Marketing, Website Development.",
    stats: [
      { text: "Flexible Duration", icon: <Clock size={16} /> },
      { text: "Pick Any Module", icon: <BookOpen size={16} /> },
      { text: "Personalized", icon: <Users size={16} /> },
      { text: "Skill Specific", icon: <Briefcase size={16} /> }
    ]
  },
  combo: {
    title: "Combo Packages",
    desc: "Marketing Pro (SEO+SMO+Performance), Creative Pro (Graphic+Video), Tech Pro (Web Dev+AI Tools).",
    stats: [
      { text: "Package Based", icon: <Clock size={16} /> },
      { text: "2-3 Modules", icon: <BookOpen size={16} /> },
      { text: "Specialized", icon: <Users size={16} /> },
      { text: "Career Focused", icon: <Briefcase size={16} /> }
    ]
  }
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeHeroCourse] = useState('master');


  useEffect(() => {
    const hero = heroRef.current;
    const cleanups: (() => void)[] = [];

    // Hero GSAP animations scoped in context
    const ctx = gsap.context(() => {
      if (hero) {
        // Removed parallax effect as user requested a simple background
        // gsap.to(hero.querySelector(".hero-bg"), {
        //   yPercent: 30,
        //   ease: "none",
        //   scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        // });
        gsap.fromTo(
          hero.querySelectorAll(".hero-title span"),
          { y: 120, opacity: 0, rotateX: 40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.12, ease: "power4.out", delay: 0.2 }
        );
        gsap.fromTo(
          hero.querySelector(".hero-sub"),
          { y: 40, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out", delay: 0.8 }
        );

        gsap.fromTo(
          hero.querySelectorAll(".floating-card"),
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: "back.out(1.5)", delay: 1.3 }
        );
      }
    });

    // Marquee tilt
    const tiltCards = document.querySelectorAll(".tilt-card");
    const tiltMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 8;
      const rotateX = -((y - cy) / cy) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    };
    const tiltLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    };

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", tiltMove);
      card.addEventListener("mouseleave", tiltLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", tiltMove);
        card.removeEventListener("mouseleave", tiltLeave);
      });
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    const magneticMove = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left - rect.width / 2;
      const y = (e as MouseEvent).clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    };
    const magneticLeave = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = "translate(0, 0)";
    };

    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", magneticMove);
      btn.addEventListener("mouseleave", magneticLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", magneticMove);
        btn.removeEventListener("mouseleave", magneticLeave);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <main className="relative">
      {/* ============ HERO ============ */}
      {/* ============ BENTO-BOX HERO ============ */}
      <section ref={heroRef} className="relative w-full min-h-dvh md:h-screen p-4 md:p-6 bg-white overflow-hidden flex flex-col">
        {/* Main Rounded Container */}
        <div className="relative w-full flex-1 rounded-[3rem] overflow-hidden bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col pb-4 md:pb-0">
          {/* Background Image */}
          <img
            src="/hero/hero.jpeg"
            alt="Futuristic Campus"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/60" />

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col lg:flex-row flex-1 w-full h-full pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-16 xl:px-24 gap-8">

            {/* Main Left-Aligned Typography */}
            <div className="flex-1 flex flex-col justify-center w-full pointer-events-none lg:max-w-2xl xl:max-w-3xl">
              <h1 className="hero-title font-display text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] font-semibold text-white leading-[1.1] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-4 md:mb-6">
                <span>RizeWorld <span className="text-[#ed5923]">Institute</span></span><br />
                <span className="text-white/90">of AI & Digital Marketing</span>
              </h1>
              <p className="hero-sub text-white/90 text-sm md:text-base lg:text-base xl:text-lg leading-relaxed font-medium max-w-xl drop-shadow-md">
                Discover extraordinary AI and digital marketing programs available for ambitious learners. Whether you're seeking a career shift or a unique skill investment, our curated modules offer the most exceptional education worldwide.
              </p>
            </div>

            {/* Bottom Right Floating Glass Card */}
            <div className="floating-card relative lg:mt-auto self-start lg:self-end bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 xl:p-8 lg:max-w-[340px] xl:max-w-[420px] shrink-0 w-full z-20 shadow-[0_30px_60px_rgba(0,0,0,0.3)] pointer-events-auto">

              <h3 className="font-display text-xl lg:text-xl xl:text-2xl font-bold text-white mb-2">{heroCourseData[activeHeroCourse].title}</h3>
              <div className="flex items-center gap-2 text-white/70 text-xs lg:text-sm mb-4 font-medium line-clamp-1">
                <MapPin size={14} className="shrink-0" /> C198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar
              </div>
              <p className="text-white/80 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8 min-h-[40px] lg:min-h-[60px] line-clamp-3">
                {heroCourseData[activeHeroCourse].desc}
              </p>
              <div className="grid grid-cols-2 gap-3 lg:gap-4 text-white/90 text-xs lg:text-sm font-semibold border-t border-white/10 pt-4 lg:pt-6">
                {heroCourseData[activeHeroCourse].stats.map((stat: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-blue-500/80">{stat.icon}</span>
                    <span className="leading-tight">{stat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="py-8 border-y border-white/5 overflow-hidden bg-premium-light">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12 pr-12">
              {["AI TOOLS", "PHOTOSHOP", "VIDEO EDITING", "SMO", "SEO", "META ADS", "GOOGLE ADS", "WEB DEV", "CHATGPT", "MIDJOURNEY"].map((t, j) => {
                const colors = ['text-blue-600', 'text-yellow-500', 'text-orange-500', 'text-green-600'];
                return (
                  <div key={j} className="flex items-center gap-12">
                    <span className={`font-display text-3xl md:text-5xl font-extrabold transition-colors ${colors[j % colors.length]} hover:opacity-80`}>{t}</span>
                    <Sparkles size={24} className="text-orange-500 opacity-50" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ============ PREMIUM COURSES ============ */}
      <section className="py-32 relative overflow-hidden bg-premium-light">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-linear-to-bl from-blue-600/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-linear-to-tr from-orange-500/5 to-transparent blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-340 mx-auto px-6 relative">
          <Reveal y={40}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <div className="premium-pill inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-600 mb-6 uppercase">
                  <Sparkles size={12} className="text-blue-600" />
                  Individual Modules
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter leading-[0.95]">
                  7 modules.<br />
                  <span className="gradient-text">One elite career.</span>
                </h2>
              </div>
              <p className="text-lg text-neutral-500 max-w-sm md:text-right font-medium">
                Crafted by industry leaders to transform ambitious beginners into highly-paid digital professionals.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <Link to="/courses" className={`block group relative h-full glass-card p-10 hover:-translate-y-1 overflow-hidden transition-all duration-500 border-2 ${c.color === "orange" ? "border-orange-500/20 hover:border-orange-500/40" : "border-green-600/20 hover:border-green-600/40"
                  }`}>
                  {/* Hover gradient background reveal */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.color === "orange" ? "bg-orange-500/10" : "bg-green-500/10"
                    }`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-12">
                      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 animate-float-slow shadow-sm ${c.color === "orange" ? "bg-orange-50 text-orange-500" : "bg-green-50 text-green-600"
                        }`}>
                        <c.icon size={28} strokeWidth={2} />
                      </div>
                      <span className="font-display text-4xl font-black text-neutral-800 group-hover:text-neutral-900 transition-colors">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-neutral-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{c.title}</h3>
                    <p className="text-neutral-700 leading-relaxed font-medium mb-8 grow">{c.desc}</p>

                    <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-800 group-hover:text-blue-600 transition-colors">
                      <span className="relative overflow-hidden">
                        <span className="inline-block group-hover:-translate-y-full transition-transform duration-300">Learn more</span>
                        <span className="absolute left-0 top-0 inline-block translate-y-full group-hover:translate-y-0 transition-transform duration-300">Learn more</span>
                      </span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* The 8th card (Call to action) */}
            <Reveal delay={0.7}>
              <div className="group relative h-full premium-card-dark p-10 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 hover:-translate-y-1 border-2 border-blue-500/30 hover:border-blue-500/50">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center mx-auto mb-6 animate-float shadow-[0_20px_40px_-10px_rgba(65,104,178,0.4)] group-hover:scale-110 transition-transform duration-500 text-white">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-4">Master Course</h3>
                  <p className="text-white/70 font-medium mb-8">Get all 7 modules + 100% placement assistance.</p>

                  <Link to="/master-course" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-900 font-bold text-sm hover:scale-105 transition-transform">
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ ABOUT/WHY US ============ */}
      <section className="py-24 md:py-32 bg-premium-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-10">
            <Reveal>
              <div className="relative w-full">
                <div className="rounded-[3rem] overflow-hidden shadow-luxury border border-neutral-100">
                  <img src="/images/rize.png" alt="RizeWorld" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
                {/* Floating cards */}
                <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 w-64 premium-card-light p-6 hidden md:block z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-neutral-900">Industry Certified</div>
                      <div className="text-xs text-neutral-500">Meta & Google Partner</div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">Recognized for excellence in AI & digital education.</div>
                </div>
                <div className="absolute -top-6 -left-6 lg:-top-8 lg:-left-8 w-40 premium-card-light rounded-3xl p-4 animate-float-slow hidden md:block z-10 shadow-lg">
                  <div className="font-display font-extrabold text-3xl text-neutral-900">4.9★</div>
                  <div className="text-xs text-neutral-500">Student Rating</div>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={10} fill="#4168b2" className="text-blue-500" />)}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative w-full mt-4 lg:mt-8">
                <div className="rounded-[3rem] overflow-hidden shadow-luxury border border-neutral-100">
                  <img src="/images/led mentorship.jpg" alt="Expert-led mentorship" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="relative w-full">
                <div className="rounded-[3rem] overflow-hidden shadow-luxury border border-neutral-100">
                  <img src="/images/live projects.jpg" alt="Live project-based learning" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="relative w-full mt-6">
                <div className="rounded-[3rem] overflow-hidden shadow-luxury border border-neutral-100">
                  <img src="/images/small batch size.jpg" alt="Small batch sizes" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="relative w-full mt-6">
                <div className="rounded-[3rem] overflow-hidden shadow-luxury border border-neutral-100">
                  <img src="/images/smart leaning.jpg" alt="Smart Learning for the Digital Era" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div>
              <div className="premium-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-5">
                WHY RIZEWORLD
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight tracking-tight">
                A learning experience <span className="gradient-text">reimagined.</span>
              </h2>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
                We don't just teach theory. We build careers. RizeWorld blends cutting-edge AI tools, premium mentorship, and real-world projects in a luxury campus designed for focus and flow.
              </p>

              <StackingCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ MASTER COURSE CTA ============ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="relative premium-card-dark overflow-hidden">
              <img src="/images/master-course.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-[#0d0a1a]" />
              <div className="relative p-10 md:p-20 text-neutral-900">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold tracking-widest text-white mb-5">
                      <Sparkles size={12} /> FLAGSHIP PROGRAM
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-white">
                      The 3-Month <br /><span className="text-[#fcbf12]">Job-Ready Master Course</span>
                    </h2>
                    <p className="mt-6 text-lg text-white/80">
                      7 modules. 12 weeks. 3 hours daily. Everything you need to launch a career in AI & digital marketing — in one transformative program.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {["7 Modules", "12 Weeks", "3 hrs/day", "Live Projects", "Certification"].map((t, i) => (
                        <span key={i} className="px-4 py-2 rounded-full glass-dark bg-white/10 border border-white/20 text-sm font-medium text-white">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-white/90 backdrop-blur-3xl border border-white/90 shadow-luxury rounded-3xl">

                    <div className="mt-6 space-y-3">
                      {[
                        "All 7 modules included",
                        "Lifetime community access",
                        "Portfolio building sessions",
                        "1-on-1 mentor calls",
                      ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/master-course"
                      className="w-full mt-8 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-blue-600 text-white font-bold shadow-[0_20px_40px_-10px_rgba(65,104,178,0.4)] hover:scale-105 transition-transform duration-300"
                    >
                      Enroll Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>



      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 md:py-32 bg-premium-light relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center mb-16 relative z-10">
              <div className="premium-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-4">
                <Quote size={12} /> STUDENT STORIES
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight">
                Voices from <span className="gradient-text">the community.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="premium-card-light border-none rounded-4xl p-8 h-full hover:shadow-[0_30px_60px_rgba(99,102,241,0.15)] transition-all hover:-translate-y-2 duration-500 relative z-10 flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#4168b2" className="text-blue-600" />)}
                  </div>
                  <Quote size={24} className="text-blue-600 opacity-40 mb-3" />
                  <p className="text-neutral-600 leading-relaxed mb-6 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{t.name}</div>
                      <div className="text-xs text-neutral-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-24 md:py-32 bg-premium-light">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="premium-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-orange-600 mb-4">
                QUESTIONS ANSWERED
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight">
                Got <span className="gradient-text">questions?</span>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-premium-light">
        <div className="absolute inset-0 bg-blue-600 opacity-5" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 opacity-20 blur-3xl rounded-full" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <div className="premium-card-dark p-12 md:p-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <Sparkles size={40} className="text-blue-600 mx-auto mb-6 animate-pulse relative z-10" />
              <h2 className="font-display text-5xl md:text-8xl font-extrabold text-white leading-none tracking-tight relative z-10">
                Ready to <span className="gradient-text">Rize?</span>
              </h2>
              <p className="mt-8 text-xl text-white/70 max-w-2xl mx-auto relative z-10">
                Join the next batch. Limited seats. Unlimited potential.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 relative z-10">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-blue-600 text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(65,104,178,0.4)] hover:scale-105 transition-transform"
                >
                  Book Free Counseling
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/master-course"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full premium-pill text-neutral-900 font-semibold text-lg hover:scale-105 transition-transform"
                >
                  See Curriculum
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const items = [
    { t: "Expert-led mentorship", d: "Learn directly from industry veterans with years of hands-on experience.", icon: Award, color: "bg-blue-600" },
    { t: "Live project-based learning", d: "Work on real client briefs, build a portfolio that actually gets you hired.", icon: Zap, color: "bg-orange-500" },
    { t: "Small batch sizes", d: "Max 20 students per batch for personalized attention and support.", icon: Users, color: "bg-green-600" },
    { t: "Smart Learning for the Digital Era", d: "An inspiring space created for students to explore AI, digital marketing, and creative technologies.", icon: Brain, color: "bg-yellow-500" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;

        ScrollTrigger.create({
          trigger: card,
          start: "top 15%",
          end: isLast ? "bottom bottom" : "bottom 15%",
          pin: true,
          pinSpacing: false,
          scrub: 1,
          onUpdate: (self) => {
            if (!isLast) {
              const progress = self.progress;
              gsap.set(card, {
                scale: 1 - progress * 0.08,
                y: -progress * 80,
                opacity: 1 - progress * 0.6,
                filter: `brightness(${1 - progress * 0.3})`,
              });
            }
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="mt-10 relative">
      {items.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="relative w-full mb-6"
            style={{ zIndex: items.length - i }}
          >
            <div className="glass-card border-none rounded-4xl p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(30,27,75,0.06)] border border-neutral-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-4xl ${f.color} flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(30,27,75,0.06)] border border-neutral-100 shrink-0`}>
                  <Icon size={36} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold tracking-widest text-neutral-500 mb-2">0{i + 1} / 0{items.length}</div>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900 mb-3">{f.t}</h3>
                  <p className="text-neutral-500 text-base md:text-lg leading-relaxed">{f.d}</p>
                </div>
                <div className="hidden md:flex w-14 h-14 rounded-full bg-white/5 items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-2xl text-neutral-300">0{i + 1}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`premium-card-light transition-all duration-500 cursor-pointer ${open ? "border-rize-blue shadow-[0_20px_40px_-10px_rgba(99,102,241,0.15)]" : ""
        }`}>
      <div className="w-full p-6 flex justify-between items-center gap-4 text-left">
        <span className="font-display font-bold text-neutral-900 text-lg">{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${open ? "bg-blue-600 rotate-45 text-white" : "bg-white/5 backdrop-blur-xl border border-white/10"
          }`}>
          <span className={`text-lg font-bold ${open ? "text-white" : "text-neutral-300"}`}>+</span>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${open ? "max-h-40" : "max-h-0"}`}>
        <p className="px-6 pb-6 text-neutral-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
