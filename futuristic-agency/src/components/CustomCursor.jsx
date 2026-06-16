'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) return; // Disable cursor on mobile

    setIsVisible(true);

    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;

    // quickTo for high-performance positioning
    const xDotTo = gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power3.out' });
    const yDotTo = gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power3.out' });

    const xRingTo = gsap.quickTo(cursorRing, 'x', { duration: 0.4, ease: 'power3.out' });
    const yRingTo = gsap.quickTo(cursorRing, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      xDotTo(clientX);
      yDotTo(clientY);
      xRingTo(clientX);
      yRingTo(clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Dynamic hover listeners
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      const magnetic = e.target.closest('.magnetic');

      if (target) {
        setIsHovered(true);
        const text = target.getAttribute('data-cursor-text');
        if (text) {
          setCursorText(text);
          gsap.to(cursorRing, {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            borderColor: '#00f0ff',
            duration: 0.3
          });
          gsap.to(cursorDot, { scale: 0, duration: 0.2 });
        } else {
          gsap.to(cursorRing, {
            scale: 2,
            borderColor: '#00f0ff',
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            duration: 0.3
          });
          gsap.to(cursorDot, { scale: 1.5, backgroundColor: '#00f0ff', duration: 0.3 });
        }
      }

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        gsap.to(magnetic, {
          x: (e.clientX - centerX) * 0.35,
          y: (e.clientY - centerY) * 0.35,
          ease: 'power2.out',
          duration: 0.4
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      const magnetic = e.target.closest('.magnetic');

      if (target) {
        setIsHovered(false);
        setCursorText('');
        gsap.to(cursorRing, {
          width: 32,
          height: 32,
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          duration: 0.3
        });
        gsap.to(cursorDot, { scale: 1, backgroundColor: '#ffffff', duration: 0.3 });
      }

      if (magnetic) {
        gsap.to(magnetic, {
          x: 0,
          y: 0,
          ease: 'elastic.out(1, 0.3)',
          duration: 0.6
        });
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny solid dot cursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[100000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Outer tracking ring with text option */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/40 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden transition-colors"
        style={{
          boxShadow: isHovered ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none',
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-display uppercase tracking-wider text-cyber-blue font-bold">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
