'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const textTriggerRef = useRef(null);

  useEffect(() => {
    const triggerEl = textTriggerRef.current;
    if (!triggerEl) return;

    // Split text into lines/words manually for robust GSAP animation
    const words = triggerEl.innerText.split(' ');
    triggerEl.innerHTML = words
      .map((word) => `<span class="word inline-block mr-[0.2em] transition-colors duration-300 text-white/10">${word}</span>`)
      .join('');

    const children = triggerEl.querySelectorAll('.word');

    // ScrollTrigger timeline that lights up words as user scrolls
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1.2,
      },
    });

    tl.to(children, {
      color: '#ffffff',
      stagger: 0.1,
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6 md:px-20 bg-[#000000] z-20 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] radial-glow-red opacity-15 pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex flex-col justify-between">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-[10px] font-display uppercase tracking-[0.4em] text-cyber-red shadow-[0_0_15px_rgba(255,0,85,0.1)] px-4 py-1.5 glass-panel rounded-full">
            THE METHODOLOGY
          </span>
        </div>

        {/* Cinematic Stagger Text */}
        <p
          ref={textTriggerRef}
          className="text-3xl sm:text-5xl md:text-7xl font-light tracking-tight leading-[1.1] uppercase font-sans select-none"
        >
          We build growth loops. Marketing is no longer a linear path of campaigns. It is a continuous, self-reinforcing cybernetic engine. Every digital asset, every creative execution, and every data model feeds back into the loop. Expanding your influence. Amplifying your reach. Automating your authority.
        </p>

        {/* Small detail grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 pt-10 border-t border-white/5">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-display text-cyber-blue font-bold">01 / AUTONOMOUS</span>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Self-optimizing AI models targeting, converting, and analyzing audiences in real time.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-display text-cyber-red font-bold">02 / INTERCONNECTED</span>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              We tie performance, organic brand building, and conversion optimization into a single loop.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-display text-white font-bold">03 / EXPONENTIAL</span>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Systematic scalability that multiplies inputs into compounding organic brand results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
