'use client';

import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Components
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import Scene3D from '@/components/Scene3D';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll integrated with GSAP ScrollTrigger
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Coordinate GSAP ticker with Lenis raf
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  return (
    <>
      {/* Noise layer texture */}
      <div className="noise-overlay" />

      {/* Futuristic Custom Cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Content wrapper */}
      <div className={`relative min-h-screen bg-black transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Absolute Background 3D Canvas Visuals */}
        <div className="fixed inset-0 w-full h-full z-0 bg-[#000000] pointer-events-none">
          <Scene3D />
        </div>

        {/* Global Navigation Header */}
        <Header />

        {/* Sections stack */}
        <main className="relative z-10 w-full overflow-hidden">
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Testimonials />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
