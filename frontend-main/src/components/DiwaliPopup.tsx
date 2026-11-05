import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  sparkle: boolean;
}

interface FloatingDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  fadeSpeed: number;
}

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particlesRef = useRef<Particle[]>([]);
  const dustRef = useRef<FloatingDust[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const autoFireworkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ================= 1. BODY SCROLL LOCK =================
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [isOpen]);

  // ================= 2. CANVAS FIREWORKS & AMBIENT DUST ENGINE =================
  const spawnFirework = useCallback((originX: number, originY: number, count = 55) => {
    const colors = [
      "#FFFFFF", // Pure white core
      "#FEF08A", // Pale lemon gold
      "#FDE68A", // Champagne gold
      "#FBBF24", // Vibrant gold
      "#F59E0B", // Warm amber
      "#EA580C", // Saffron orange
      "#D97706", // Deep gold
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 8.0;
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.016,
        color,
        size: 2.0 + Math.random() * 2.8,
        sparkle: Math.random() > 0.35,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Ambient golden dust particles
  useEffect(() => {
    if (!isOpen) return;

    const dust: FloatingDust[] = [];
    const count = window.innerWidth < 640 ? 25 : 55;
    for (let i = 0; i < count; i++) {
      dust.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.45,
        size: 1.2 + Math.random() * 2.2,
        alpha: Math.random() * 0.7,
        maxAlpha: 0.3 + Math.random() * 0.5,
        fadeSpeed: 0.005 + Math.random() * 0.01,
      });
    }
    dustRef.current = dust;
  }, [isOpen]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let isRunning = true;

    // Initial festive welcome bursts
    const initialTimer = setTimeout(() => {
      spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.28, 65);
      setTimeout(() => {
        spawnFirework(window.innerWidth * 0.25, window.innerHeight * 0.32, 45);
        spawnFirework(window.innerWidth * 0.75, window.innerHeight * 0.32, 45);
      }, 350);
    }, 400);

    // Periodic fireworks in background sky (every 4 seconds)
    autoFireworkTimerRef.current = setInterval(() => {
      if (!isRunning) return;
      const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
      const ry = window.innerHeight * (0.12 + Math.random() * 0.4);
      spawnFirework(rx, ry, 40);
    }, 4000);

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Render Floating Golden Dust
      const dust = dustRef.current;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.fadeSpeed;

        if (d.alpha > d.maxAlpha || d.alpha < 0.05) {
          d.fadeSpeed = -d.fadeSpeed;
        }

        if (d.y < -10) d.y = window.innerHeight + 10;
        if (d.x < -10) d.x = window.innerWidth + 10;
        if (d.x > window.innerWidth + 10) d.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, d.alpha));
        ctx.fillStyle = "#FDE68A";
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Fireworks Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.09;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.sparkle ? 12 : 5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      clearTimeout(initialTimer);
      if (autoFireworkTimerRef.current) clearInterval(autoFireworkTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isOpen, spawnFirework]);

  // ================= 3. GSAP ENTRANCE & EXIT =================
  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const container = containerRef.current;
    if (!container) {
      setIsOpen(false);
      return;
    }

    gsap.to(container, {
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setIsOpen(false);
      },
    });
  }, [isClosing]);

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Screen click handler
  const handleScreenClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-firework]")) return;
    spawnFirework(e.clientX, e.clientY, 40);
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    spawnFirework(cx, cy, 75);
    setTimeout(() => {
      spawnFirework(cx - 80, cy - 30, 45);
      spawnFirework(cx + 80, cy - 30, 45);
    }, 180);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleScreenClick}
      className="fixed inset-0 w-screen h-[100dvh] z-[9999] overflow-hidden select-none cursor-crosshair flex flex-col justify-between bg-[#0B081E]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #1c143d 0%, #100b29 45%, #080516 80%, #04020b 100%)",
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Full-Screen Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes diyaFlamePulse {
          0%, 100% { transform: scale(1) rotate(-0.5deg); opacity: 0.98; }
          25% { transform: scale(1.1, 0.94) rotate(1.5deg); opacity: 1; }
          50% { transform: scale(0.95, 1.08) rotate(-1deg); opacity: 0.94; }
          75% { transform: scale(1.05, 1.02) rotate(0.8deg); opacity: 0.99; }
        }
        @keyframes diyaHaloGlow {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.25); opacity: 0.85; }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: scale(0.85) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.25) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 10px #fef08a); }
        }
        @keyframes goldShimmerBorder {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.3)); }
          50% { filter: drop-shadow(0 0 28px rgba(254, 240, 138, 0.55)); }
        }
        .animate-diya-flame {
          animation: diyaFlamePulse 1.8s ease-in-out infinite;
          transform-origin: 50% 90%;
        }
        .animate-diya-halo {
          animation: diyaHaloGlow 3s ease-in-out infinite;
        }
        .animate-star-twinkle {
          animation: starTwinkle 3.2s ease-in-out infinite;
        }
        .animate-gold-shimmer {
          animation: goldShimmerBorder 5s ease-in-out infinite;
        }
      `}</style>

      {/* ================= BACKGROUND DECORATIVE ELEMENTS (PURE CODE SVG) ================= */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <defs>
          <radialGradient id="starburstGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top-Right Background Mandala */}
        <g transform="translate(850, 100) scale(1.2)" opacity="0.35">
          <circle cx="0" cy="0" r="140" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx="0" cy="0" r="100" fill="none" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="0" cy="0" r="60" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={140 * Math.cos((i * Math.PI) / 8)}
              y2={140 * Math.sin((i * Math.PI) / 8)}
              stroke="#fbbf24"
              strokeWidth="0.6"
              opacity="0.5"
            />
          ))}
        </g>

        {/* Bottom-Left Background Mandala */}
        <g transform="translate(80, 550) scale(1.1)" opacity="0.3">
          <circle cx="0" cy="0" r="130" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx="0" cy="0" r="90" fill="none" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={130 * Math.cos((i * Math.PI) / 8)}
              y2={130 * Math.sin((i * Math.PI) / 8)}
              stroke="#fbbf24"
              strokeWidth="0.6"
              opacity="0.4"
            />
          ))}
        </g>

        {/* Radiating Line Burst Fireworks in Deep Purple Sky */}
        {[
          { cx: 120, cy: 140, r: 50 },
          { cx: 500, cy: 80, r: 65 },
          { cx: 780, cy: 520, r: 60 },
        ].map((burst, bIdx) => (
          <g key={bIdx} transform={`translate(${burst.cx}, ${burst.cy})`} opacity="0.3">
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={burst.r * Math.cos((i * Math.PI) / 6)}
                y2={burst.r * Math.sin((i * Math.PI) / 6)}
                stroke="#fef08a"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* ================= TOP HEADER (PROMINENT LARGE OFFICIAL LOGO & ENTER SITE) ================= */}
      {/* Placed outside the wish card at prominent large size as requested by user */}
      <header className="relative z-30 w-full px-5 sm:px-10 py-3 sm:py-5 flex items-center justify-between">
        
        {/* Prominent Large RizeWorld Institute Logo */}
        <div className="flex items-center">
          <div className="bg-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.6),0_0_20px_rgba(251,191,36,0.3)] border-2 border-amber-300 transition-all duration-300 hover:scale-105">
            <img
              src="/images/rizeworld-logo.png"
              alt="RizeWorld Institute of AI & Digital Marketing"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain select-none"
            />
          </div>
        </div>

        {/* Enter Site Button */}
        <button
          type="button"
          data-no-firework="true"
          onClick={handleClose}
          className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/50 hover:bg-black/75 text-neutral-300 hover:text-white border border-amber-400/40 hover:border-amber-300 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md"
          aria-label="Enter Website"
        >
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-amber-200 group-hover:text-white">
            Enter Site
          </span>
          <X size={16} className="text-amber-300 group-hover:text-white" />
        </button>
      </header>

      {/* ================= CENTRAL ROYAL CARTOUCHE FRAME (NO LOGO INSIDE CARD) ================= */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-center px-3 sm:px-6 my-auto max-w-5xl mx-auto w-full">
        <div className="relative w-full max-w-[840px] aspect-[840/540] flex items-center justify-center">
          
          {/* Authentic Indian Ogive Arch Cartouche Frame SVG */}
          <svg
            viewBox="0 0 840 540"
            className="absolute inset-0 w-full h-full animate-gold-shimmer filter drop-shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* Metallic Gold Gradient for the Royal Border */}
              <linearGradient id="cartoucheGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FEF08A" />
                <stop offset="75%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>

              {/* Inner Velvet Midnight Purple Gradient */}
              <radialGradient id="cartoucheBg" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#1a113a" />
                <stop offset="70%" stopColor="#0e0824" />
                <stop offset="100%" stopColor="#080417" />
              </radialGradient>

              {/* Flame Radial Gradient */}
              <radialGradient id="pureFlameGrad" cx="50%" cy="65%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#DC2626" />
              </radialGradient>

              {/* Clay Body Gradient for 3 Diyas */}
              <linearGradient id="pureDiyaClay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c1a4d" />
                <stop offset="50%" stopColor="#1a0c33" />
                <stop offset="100%" stopColor="#0d041c" />
              </linearGradient>
            </defs>

            {/* Main Cartouche Body Path (Traditional Indian Pointed Brackets on Left & Right) */}
            <path
              d="M 210 95 
                 L 630 95 
                 C 690 95, 725 135, 725 185
                 C 725 225, 745 255, 795 270
                 C 745 285, 725 315, 725 355
                 C 725 405, 690 445, 630 445
                 L 210 445
                 C 150 445, 115 405, 115 355
                 C 115 315, 95 285, 45 270
                 C 95 255, 115 225, 115 185
                 C 115 135, 150 95, 210 95 Z"
              fill="url(#cartoucheBg)"
              stroke="url(#cartoucheGold)"
              strokeWidth="2.8"
            />

            {/* Inner Concentric Gold Trim Line */}
            <path
              d="M 214 103 
                 L 626 103 
                 C 682 103, 715 140, 715 187
                 C 715 224, 734 252, 780 270
                 C 734 288, 715 316, 715 353
                 C 715 400, 682 437, 626 437
                 L 214 437
                 C 158 437, 125 400, 125 353
                 C 125 316, 106 288, 60 270
                 C 106 252, 125 224, 125 187
                 C 125 140, 158 103, 214 103 Z"
              fill="none"
              stroke="url(#cartoucheGold)"
              strokeWidth="1.2"
              opacity="0.65"
            />

            {/* ================= GOLD FOIL SPLATTER (PURE CODE SVG SPECKS) ================= */}
            {/* Top-Right Gold Foil Splatter Cluster */}
            <g transform="translate(680, 100)" opacity="0.85">
              {[
                { cx: 0, cy: 0, r: 3 }, { cx: 12, cy: 6, r: 2.2 }, { cx: 20, cy: -4, r: 3.5 },
                { cx: 32, cy: 12, r: 4 }, { cx: 40, cy: 2, r: 2.8 }, { cx: 48, cy: 18, r: 3.2 },
                { cx: 28, cy: 24, r: 2.5 }, { cx: 56, cy: 30, r: 4.5 }, { cx: 62, cy: 42, r: 3 },
                { cx: 45, cy: 38, r: 2 }, { cx: 70, cy: 55, r: 3.8 }, { cx: 58, cy: 62, r: 2.4 },
              ].map((dot, i) => (
                <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="url(#cartoucheGold)" />
              ))}
            </g>

            {/* Bottom-Left Gold Foil Splatter Cluster */}
            <g transform="translate(130, 420)" opacity="0.8">
              {[
                { cx: 0, cy: 0, r: 3.2 }, { cx: -10, cy: -8, r: 2.4 }, { cx: -18, cy: 4, r: 3.8 },
                { cx: -28, cy: -14, r: 2.8 }, { cx: -35, cy: -2, r: 4.2 }, { cx: -42, cy: -22, r: 3 },
                { cx: -24, cy: -26, r: 2 }, { cx: -50, cy: -32, r: 4.5 }, { cx: -58, cy: -45, r: 2.8 },
              ].map((dot, i) => (
                <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="url(#cartoucheGold)" />
              ))}
            </g>

            {/* ================= 3 TRADITIONAL CRESCENT DIYAS AT BOTTOM-RIGHT ================= */}
            
            {/* 1. Large Diya (Front Right: cx=710, cy=445) */}
            <g id="largeDiya">
              {/* Crescent Bowl Body */}
              <path
                d="M 645 440 Q 710 500 775 440 Q 710 455 645 440 Z"
                fill="url(#pureDiyaClay)"
                stroke="url(#cartoucheGold)"
                strokeWidth="2"
              />
              {/* Concentric Inner Line */}
              <path
                d="M 655 445 Q 710 488 765 445"
                fill="none"
                stroke="url(#cartoucheGold)"
                strokeWidth="1.2"
                opacity="0.7"
              />
              {/* Sawtooth / Chevron Rim Pattern */}
              {[...Array(12)].map((_, i) => {
                const x = 658 + i * 8.5;
                return (
                  <polygon
                    key={i}
                    points={`${x},444 ${x + 4},450 ${x + 8},444`}
                    fill="#FDE68A"
                    opacity="0.85"
                  />
                );
              })}
            </g>

            {/* 2. Medium Diya (Mid Right: cx=655, cy=380) */}
            <g id="mediumDiya" transform="translate(655, 380) scale(0.72) translate(-710, -445)">
              <path
                d="M 645 440 Q 710 500 775 440 Q 710 455 645 440 Z"
                fill="url(#pureDiyaClay)"
                stroke="url(#cartoucheGold)"
                strokeWidth="2.2"
              />
              <path
                d="M 655 445 Q 710 488 765 445"
                fill="none"
                stroke="url(#cartoucheGold)"
                strokeWidth="1.4"
                opacity="0.7"
              />
              {[...Array(12)].map((_, i) => {
                const x = 658 + i * 8.5;
                return (
                  <polygon
                    key={i}
                    points={`${x},444 ${x + 4},450 ${x + 8},444`}
                    fill="#FDE68A"
                    opacity="0.85"
                  />
                );
              })}
            </g>

            {/* 3. Small Diya (Far Right: cx=765, cy=360) */}
            <g id="smallDiya" transform="translate(765, 360) scale(0.52) translate(-710, -445)">
              <path
                d="M 645 440 Q 710 500 775 440 Q 710 455 645 440 Z"
                fill="url(#pureDiyaClay)"
                stroke="url(#cartoucheGold)"
                strokeWidth="2.5"
              />
              <path
                d="M 655 445 Q 710 488 765 445"
                fill="none"
                stroke="url(#cartoucheGold)"
                strokeWidth="1.6"
                opacity="0.7"
              />
            </g>
          </svg>

          {/* ================= 3 LIVE ANIMATED FLICKERING FLAMES OVER THE DIYAS ================= */}
          {/* Flame 1 (Large Diya at bottom-right) */}
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: "84.5%", top: "79.0%" }}
          >
            <div className="absolute -inset-4 bg-amber-400/50 rounded-full blur-md animate-diya-halo" />
            <svg
              width="26"
              height="36"
              viewBox="0 0 28 38"
              fill="none"
              className="relative z-10 animate-diya-flame drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
            >
              <path
                d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                fill="url(#pureFlameGrad)"
              />
              <path
                d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
            </svg>
          </div>

          {/* Flame 2 (Medium Diya at mid-right) */}
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: "78.0%", top: "68.5%" }}
          >
            <div className="absolute -inset-3 bg-amber-400/45 rounded-full blur-md animate-diya-halo" />
            <svg
              width="20"
              height="28"
              viewBox="0 0 28 38"
              fill="none"
              className="relative z-10 animate-diya-flame drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]"
              style={{ animationDelay: "0.4s" }}
            >
              <path
                d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                fill="url(#pureFlameGrad)"
              />
              <path
                d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
            </svg>
          </div>

          {/* Flame 3 (Small Diya at far-right) */}
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: "91.0%", top: "65.0%" }}
          >
            <div className="absolute -inset-2.5 bg-amber-400/40 rounded-full blur-sm animate-diya-halo" />
            <svg
              width="16"
              height="22"
              viewBox="0 0 28 38"
              fill="none"
              className="relative z-10 animate-diya-flame drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              style={{ animationDelay: "0.8s" }}
            >
              <path
                d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                fill="url(#pureFlameGrad)"
              />
              <path
                d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
            </svg>
          </div>

          {/* ================= TWINKLING SPARKLE STARS ================= */}
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-star-twinkle text-amber-200"
            style={{ left: "88%", top: "15%", fontSize: "22px" }}
          >
            ✦
          </div>
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-star-twinkle text-amber-300"
            style={{ left: "8%", top: "60%", fontSize: "18px", animationDelay: "1.2s" }}
          >
            ✦
          </div>

          {/* ================= TYPOGRAPHY INSIDE THE CARTOUCHE (NO LOGO HERE) ================= */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
            {/* H A P P Y */}
            <span className="text-amber-200/90 tracking-[0.35em] text-xs sm:text-sm font-semibold uppercase mb-1">
              H A P P Y
            </span>

            {/* Calligraphic Diwali Heading */}
            <h1
              className="font-serif italic text-5xl sm:text-7xl md:text-8xl font-normal leading-tight my-0 sm:my-1"
              style={{
                background:
                  "linear-gradient(135deg, #FFFDF5 0%, #FDE68A 25%, #F59E0B 55%, #FEF08A 75%, #D97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 25px rgba(245,158,11,0.4)",
              }}
            >
              Diwali
            </h1>

            {/* FESTIVAL OF LIGHTS */}
            <span className="text-amber-300/90 tracking-[0.3em] text-[10px] sm:text-xs font-semibold uppercase mt-0.5 sm:mt-1 mb-3">
              F E S T I V A L &nbsp; O F &nbsp; L I G H T S
            </span>

            {/* Warm Wishes from RizeWorld Institute */}
            <div className="mt-2 text-center">
              <p className="text-amber-200 font-semibold text-xs sm:text-sm md:text-base tracking-wide flex items-center justify-center gap-1.5">
                <span className="text-amber-400 text-xs">✧</span>
                Warm Wishes from <span className="text-amber-300 font-bold">RizeWorld Institute</span>
                <span className="text-amber-400 text-xs">✧</span>
              </p>

              <p className="text-neutral-300 text-[11px] sm:text-xs leading-relaxed max-w-sm mx-auto font-normal mt-1.5 mb-3 hidden sm:block">
                May this Diwali illuminate your path with knowledge, happiness, new opportunities, and outstanding career success.
              </p>
            </div>

            {/* Glowing CTA Button */}
            <button
              type="button"
              data-no-firework="true"
              onClick={handleCtaClick}
              className="group relative px-7 py-2.5 sm:px-9 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-neutral-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:shadow-[0_0_38px_rgba(245,158,11,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 border border-amber-200 mt-1"
            >
              <span>Celebrate With Us</span>
              <Sparkles size={15} className="text-neutral-950 animate-pulse" />
            </button>
          </div>
        </div>
      </main>

      {/* ================= FOOTER / INSTRUCTION ================= */}
      <footer className="relative z-30 w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center bg-gradient-to-t from-[#0B081E] to-transparent">
        <span className="text-amber-300/80 text-xs sm:text-sm tracking-widest uppercase font-medium flex items-center gap-1.5 mx-auto sm:mx-0">
          <span>✨</span>
          <span>Click anywhere for magical fireworks</span>
          <span>✨</span>
        </span>

        <button
          type="button"
          data-no-firework="true"
          onClick={handleClose}
          className="text-neutral-400 hover:text-amber-200 text-xs tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Continue to Institute Website</span>
          <ArrowRight size={13} />
        </button>
      </footer>
    </div>
  );
}
