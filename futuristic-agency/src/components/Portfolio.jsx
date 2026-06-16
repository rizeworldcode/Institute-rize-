'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'AETHERIS ENGINE',
    category: 'RE-BRAND / WEB3 PLATFORM',
    year: '2026',
    desc: 'Visual interface and neural targeting loop built for decentralized cloud networks.',
    gradient: 'from-blue-600 via-indigo-900 to-black',
  },
  {
    title: 'HYPERION SYSTEM',
    category: 'AUTONOMOUS MARKETING PIPELINE',
    year: '2026',
    desc: 'Self-correcting conversion models scaling active user counts by 312% in 90 days.',
    gradient: 'from-rose-700 via-stone-900 to-black',
  },
  {
    title: 'NEXUS COGNITIVE',
    category: 'AI DATA CORE / ANALYTICS',
    year: '2025',
    desc: 'Multi-agent user behavior analysis dashboard for consumer market predictions.',
    gradient: 'from-emerald-800 via-teal-950 to-black',
  },
  {
    title: 'CHRONOS SYNAPSE',
    category: 'WebGL 3D PLATFORM / TECH',
    year: '2025',
    desc: 'Immersive temporal simulation displaying large global dataset feeds at 90fps.',
    gradient: 'from-purple-800 via-violet-950 to-black',
  },
];

export default function Portfolio() {
  const containerRef = useRef(null);
  const scrollSectionRef = useRef(null);

  useEffect(() => {
    const scrollSection = scrollSectionRef.current;
    if (!scrollSection) return;

    const sections = scrollSection.querySelectorAll('.portfolio-panel');
    const scrollWidth = scrollSection.scrollWidth - window.innerWidth;

    const pin = gsap.to(scrollSection, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
      },
    });

    // Sub-animation: Zoom-in the gradients inside panels on scroll scrub
    sections.forEach((panel) => {
      const gradientBox = panel.querySelector('.gradient-box');
      if (gradientBox) {
        gsap.fromTo(gradientBox,
          { scale: 0.95, filter: 'brightness(0.6)' },
          {
            scale: 1,
            filter: 'brightness(1.1)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: pin,
              start: 'left right',
              end: 'left left',
              scrub: true,
            }
          }
        );
      }
    });

    return () => {
      if (pin.scrollTrigger) pin.scrollTrigger.kill();
      pin.kill();
    };
  }, []);

  return (
    <div ref={containerRef} id="portfolio" className="relative bg-black z-20">
      {/* Dynamic pinned layout */}
      <div className="overflow-hidden flex items-center h-screen">
        <div ref={scrollSectionRef} className="flex flex-nowrap h-full items-center">
          
          {/* Panel 1: Introductory Card */}
          <div className="portfolio-panel w-[100vw] h-full flex flex-col justify-center px-10 md:px-24 flex-shrink-0 relative">
            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.1)] px-4 py-1.5 glass-panel rounded-full w-fit">
              PORTFOLIO ARCHIVE
            </span>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white mt-8 font-display">
              CINEMATIC<br />
              SHOWCASE.
            </h2>
            <p className="text-sm md:text-base text-white/40 mt-6 max-w-md font-light leading-relaxed">
              Slide to explore a selection of our premium cybernetic integrations. We construct high-impact digital tools.
            </p>
          </div>

          {/* Project Panels */}
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="portfolio-panel w-[100vw] md:w-[85vw] h-full flex items-center justify-center p-6 md:p-16 flex-shrink-0 relative"
            >
              {/* Main project container with data-cursor to show "VIEW" inside custom cursor ring */}
              <div 
                className="w-full h-[70vh] rounded-3xl relative overflow-hidden flex flex-col justify-end p-8 md:p-16 group select-none border border-white/5"
                data-cursor
                data-cursor-text="VIEW"
              >
                {/* Gradient Visual Box */}
                <div className={`gradient-box absolute inset-0 bg-gradient-to-br ${proj.gradient} transition-transform duration-700 ease-out`} />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                
                {/* Visual particles overlay */}
                <div className="absolute inset-0 noise-overlay opacity-[0.08]" />

                {/* Project Details Overlay */}
                <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4 text-xs font-display tracking-widest text-cyber-blue mb-3 font-semibold">
                      <span>{proj.category}</span>
                      <span>•</span>
                      <span>{proj.year}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-display">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-white/60 mt-3 font-light leading-relaxed max-w-md">
                      {proj.desc}
                    </p>
                  </div>
                  
                  {/* Outer circle pointer CTA */}
                  <div className="p-4 bg-white/10 group-hover:bg-cyber-blue group-hover:text-black border border-white/10 rounded-full transition-all duration-300 transform group-hover:scale-110">
                    <ArrowUpRight size={24} className="text-white group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
