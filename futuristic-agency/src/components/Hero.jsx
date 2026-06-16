'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    // Word splitting manually for performance and stability without external CSS issues
    const splitWords = (el) => {
      if (!el) return;
      const text = el.innerText;
      el.innerHTML = text
        .split(' ')
        .map((word) => `<span class="inline-block opacity-0 filter blur-md transform translate-y-8 select-none mr-[0.2em]">${word}</span>`)
        .join('');
    };

    splitWords(heading1Ref.current);
    splitWords(heading2Ref.current);

    const tl = gsap.timeline({ delay: 0.8 }); // starts after loader fades out

    // Word by word reveal
    tl.to(heading1Ref.current.children, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power4.out',
    })
    .to(heading2Ref.current.children, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power4.out',
    }, '-=0.5')
    .fromTo(subRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 0.6, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(btnRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(scrollIndicatorRef.current,
      { opacity: 0, y: -20 },
      { opacity: 0.4, y: 0, repeat: -1, yoyo: true, duration: 1.2, ease: 'power2.inOut' },
      '-=0.4'
    );
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 py-32 overflow-hidden select-none">
      {/* Background overlay lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow-blue opacity-25 pointer-events-none" />

      {/* Empty div for spacer */}
      <div className="h-10" />

      {/* Hero Typography */}
      <div className="z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* Unit Tag */}
        <div className="mb-6 px-4 py-1.5 glass-panel rounded-full text-[10px] font-display uppercase tracking-[0.4em] text-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-pulse">
          INTELLIGENT SYSTEMS
        </div>

        {/* Dynamic Headings */}
        <h1
          ref={heading1Ref}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white font-sans uppercase mb-2"
        >
          29 Specialized Service Units.
        </h1>
        <h1
          ref={heading2Ref}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-purple-500 font-sans uppercase"
        >
          One Integrated Growth System.
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="mt-8 text-sm md:text-lg uppercase tracking-[0.6em] text-white/80 font-light max-w-2xl text-center leading-relaxed"
        >
          The Infinite Loop of Smarter Growth
        </p>

        {/* Button */}
        <div ref={btnRef} className="mt-10">
          <a
            href="#about"
            className="magnetic inline-flex items-center gap-3 bg-transparent border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full hover:border-cyber-blue hover:text-cyber-blue transition-all duration-300 backdrop-blur-sm"
            data-cursor
          >
            Explore Growth Loop
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="z-20 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        data-cursor
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-light text-white">
          Scroll to explore
        </span>
        <ArrowDown size={14} className="text-cyber-blue" />
      </div>
    </section>
  );
}
