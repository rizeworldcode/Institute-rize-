'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const logoTextRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // 1. Percentage counter simulation
    const duration = 2.5; // seconds
    const counterObj = { value: 0 };
    
    const countTl = gsap.to(counterObj, {
      value: 100,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.floor(counterObj.value));
      }
    });

    // 2. Logo entrance animations
    const entryTl = gsap.timeline();
    
    // Split text or char blur-to-clear effect
    entryTl.fromTo(
      logoTextRef.current,
      { filter: 'blur(20px)', opacity: 0, y: 30 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
    ).fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.6, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.8'
    );

    // 3. Exit Animation
    countTl.then(() => {
      // Small pause at 100%
      gsap.delayedCall(0.4, () => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        // Split text scaling glow exit, blur and slide up
        exitTl.to(logoTextRef.current, {
          textShadow: '0 0 40px rgba(0, 240, 255, 0.9)',
          color: '#00f0ff',
          duration: 0.4
        })
        .to([logoTextRef.current, subtitleRef.current, counterRef.current], {
          y: -100,
          opacity: 0,
          filter: 'blur(15px)',
          stagger: 0.1,
          duration: 0.8,
          ease: 'power4.in'
        })
        .to(containerRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.8,
          ease: 'power4.inOut'
        }, '-=0.4')
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.4
        }, '-=0.4');
      });
    });

    return () => {
      countTl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#000000] z-[99999] flex flex-col justify-between p-10 md:p-20 overflow-hidden select-none"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Background radial overlay */}
      <div className="absolute inset-0 radial-glow-blue opacity-30 pointer-events-none" />
      <div className="noise-overlay" />

      {/* Top Section */}
      <div className="flex justify-between items-center w-full">
        <span className="text-xs uppercase tracking-[0.3em] text-white/30 font-display">
          Aetheris Studio
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-white/30">
          SYSTEM_BOOT_v4.8
        </span>
      </div>

      {/* Center Logo */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1
          ref={logoTextRef}
          className="text-4xl md:text-8xl font-bold font-display uppercase tracking-widest text-white mb-4 glow-text-blue transition-all"
        >
          AETHERIS
        </h1>
        <p
          ref={subtitleRef}
          className="text-sm md:text-md uppercase tracking-[0.5em] text-white/60 font-light"
        >
          The Infinite Loop of Smarter Growth
        </p>
      </div>

      {/* Bottom Counter */}
      <div ref={counterRef} className="flex justify-between items-end w-full">
        <div className="flex flex-col">
          <span className="text-xs text-white/40 uppercase tracking-[0.2em] mb-1">
            Loading System Kernel
          </span>
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="h-full bg-cyber-blue transition-all duration-75 shadow-[0_0_10px_#00f0ff]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <span className="text-6xl md:text-9xl font-bold font-display leading-none text-white select-none">
            {percent}
          </span>
          <span className="text-xl md:text-2xl font-display font-light text-cyber-blue ml-2">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
