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
  const cardRef = useRef<HTMLDivElement>(null);
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
    // Royal Gold, Saffron & Pure White festive palette matching the image
    const colors = [
      "#FFFFFF", // Pure white core
      "#FEF08A", // Pale gold
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
    const count = window.innerWidth < 640 ? 25 : 50;
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
      spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.25, 60);
      setTimeout(() => {
        spawnFirework(window.innerWidth * 0.25, window.innerHeight * 0.35, 45);
        spawnFirework(window.innerWidth * 0.75, window.innerHeight * 0.35, 45);
      }, 350);
    }, 450);

    // Periodic ambient fireworks in background sky (every 4 seconds)
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
    const card = cardRef.current;
    if (!container || !card) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(
        card,
        { opacity: 0, scale: 0.92, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75 },
        "-=0.25"
      );

    return () => {
      tl.kill();
    };
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
      scale: 0.97,
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

  // Click handler for fireworks
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

    spawnFirework(cx, cy, 70);
    setTimeout(() => {
      spawnFirework(cx - 70, cy - 30, 40);
      spawnFirework(cx + 70, cy - 30, 40);
    }, 180);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleScreenClick}
      className="fixed inset-0 w-screen h-[100dvh] z-[9999] overflow-y-auto overflow-x-hidden select-none cursor-crosshair flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #191238 0%, #0F0B24 45%, #080614 100%)",
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
        @keyframes cardGlowShimmer {
          0%, 100% { box-shadow: 0 20px 60px rgba(0,0,0,0.85), 0 0 35px rgba(245, 158, 11, 0.2); }
          50% { box-shadow: 0 25px 80px rgba(0,0,0,0.9), 0 0 55px rgba(245, 158, 11, 0.35); }
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
        .animate-card-shimmer {
          animation: cardGlowShimmer 5s ease-in-out infinite;
        }
      `}</style>

      {/* ================= TOP BAR ================= */}
      <header className="relative z-30 w-full px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">✦</span>
          <span className="text-amber-200/90 tracking-[0.26em] text-[11px] sm:text-xs md:text-sm font-bold uppercase">
            RizeWorld Institute
          </span>
          <span className="text-amber-400 text-xs">✦</span>
        </div>

        <button
          type="button"
          data-no-firework="true"
          onClick={handleClose}
          className="group flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-amber-400/30 hover:border-amber-300 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md"
          aria-label="Enter Website"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-200 group-hover:text-white">
            Enter Site
          </span>
          <X size={15} className="text-amber-300 group-hover:text-white" />
        </button>
      </header>

      {/* ================= MAIN CONTENT SHOWCASE ================= */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-center px-3 sm:px-6 my-auto max-w-5xl mx-auto w-full">
        {/* ================= THE LUXURY DIWALI CARD ================= */}
        <div
          ref={cardRef}
          className="relative w-full max-w-[760px] rounded-2xl sm:rounded-3xl overflow-hidden animate-card-shimmer border border-amber-400/40"
        >
          {/* Exact Luxury Diwali Card Graphic */}
          <div className="relative w-full aspect-[800/533] select-none">
            <img
              src="/images/diwali-card.jpg"
              alt="Happy Diwali - Festival of Lights"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* ================= LIVE ANIMATED FLICKERING FLAMES ON THE 3 DIYAS ================= */}
            {/* 1. Large Diya Flame (Bottom Right Corner - x: 88.0%, y: 72.8%) */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: "88.2%", top: "73.2%" }}
            >
              {/* Pulsing Warm Light Halo */}
              <div className="absolute -inset-4 bg-amber-400/45 rounded-full blur-md animate-diya-halo" />

              {/* Glowing Golden Flame SVG */}
              <svg
                width="28"
                height="38"
                viewBox="0 0 28 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 animate-diya-flame drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              >
                <path
                  d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                  fill="url(#diyaFlame1)"
                />
                <path
                  d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
                <defs>
                  <radialGradient id="diyaFlame1" cx="50%" cy="65%" r="60%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#FEF08A" />
                    <stop offset="65%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* 2. Medium Diya Flame (Mid Right - x: 81.0%, y: 66.6%) */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: "81.2%", top: "66.8%" }}
            >
              <div className="absolute -inset-3 bg-amber-400/40 rounded-full blur-md animate-diya-halo" />
              <svg
                width="22"
                height="30"
                viewBox="0 0 28 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 animate-diya-flame drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]"
                style={{ animationDelay: "0.4s" }}
              >
                <path
                  d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                  fill="url(#diyaFlame1)"
                />
                <path
                  d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              </svg>
            </div>

            {/* 3. Small Diya Flame (Far Right - x: 94.0%, y: 65.3%) */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: "93.8%", top: "65.5%" }}
            >
              <div className="absolute -inset-2.5 bg-amber-400/35 rounded-full blur-sm animate-diya-halo" />
              <svg
                width="18"
                height="24"
                viewBox="0 0 28 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 animate-diya-flame drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                style={{ animationDelay: "0.8s" }}
              >
                <path
                  d="M14 2 C10 10 5 16 5 24 C5 32 9 36 14 36 C19 36 23 32 23 24 C23 16 18 10 14 2 Z"
                  fill="url(#diyaFlame1)"
                />
                <path
                  d="M14 10 C12 16 9 20 9 25 C9 29 11 32 14 32 C17 32 19 29 19 25 C19 20 16 16 14 10 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              </svg>
            </div>

            {/* ================= TWINKLING SPARKLE STARS ================= */}
            {/* Top-Right Star */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-star-twinkle text-amber-200"
              style={{ left: "89%", top: "15%", fontSize: "20px" }}
            >
              ✦
            </div>

            {/* Left Star */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-star-twinkle text-amber-300"
              style={{ left: "7%", top: "58%", fontSize: "16px", animationDelay: "1.2s" }}
            >
              ✦
            </div>

            {/* Bottom-Center Star */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-star-twinkle text-amber-200"
              style={{ left: "60%", top: "87%", fontSize: "14px", animationDelay: "0.6s" }}
            >
              ✦
            </div>
          </div>
        </div>

        {/* ================= GREETING & INTERACTIVE CTA ================= */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center max-w-xl mx-auto px-3">
          <p className="text-amber-200/95 font-semibold text-sm sm:text-base md:text-lg tracking-wide mb-1.5 flex items-center gap-2">
            <span className="text-amber-400">✧</span>
            Warm Wishes from <span className="text-amber-300 font-bold">RizeWorld Institute</span>
            <span className="text-amber-400">✧</span>
          </p>

          <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-normal mb-4">
            May this Diwali illuminate your path with knowledge, happiness, new opportunities, and outstanding career success.
          </p>

          <button
            type="button"
            data-no-firework="true"
            onClick={handleCtaClick}
            className="group relative px-9 py-3.5 sm:px-11 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-neutral-950 font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_45px_rgba(245,158,11,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2.5 border-2 border-amber-200"
          >
            <span>Celebrate With Us</span>
            <Sparkles size={18} className="text-neutral-950 animate-pulse" />
          </button>
        </div>
      </main>

      {/* ================= FOOTER / INSTRUCTION ================= */}
      <footer className="relative z-30 w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
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
