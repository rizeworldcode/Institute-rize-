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
  const contentRef = useRef<HTMLDivElement>(null);
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
    // Luxury Festive Color Spectrum: Pure White, Golden Yellow, Saffron Orange, Amber
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
        vy: Math.sin(angle) * speed - 1.5, // slight upward impulse
        alpha: 1,
        decay: 0.01 + Math.random() * 0.016, // graceful 1.5 to 2.2s lifespan
        color,
        size: 2.0 + Math.random() * 2.8,
        sparkle: Math.random() > 0.35,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Initialize floating golden dust particles
  useEffect(() => {
    if (!isOpen) return;

    const dust: FloatingDust[] = [];
    const count = window.innerWidth < 640 ? 25 : 55;
    for (let i = 0; i < count; i++) {
      dust.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5, // gentle upward drift
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

    // Opening festive celebration burst
    const initialTimer = setTimeout(() => {
      spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.32, 65);
      setTimeout(() => {
        spawnFirework(window.innerWidth * 0.25, window.innerHeight * 0.28, 45);
        spawnFirework(window.innerWidth * 0.75, window.innerHeight * 0.28, 45);
      }, 350);
    }, 400);

    // Periodic ambient background fireworks (every 4 seconds)
    const startPeriodicFireworks = () => {
      autoFireworkTimerRef.current = setInterval(() => {
        if (!isRunning) return;
        const randomX = window.innerWidth * (0.2 + Math.random() * 0.6);
        const randomY = window.innerHeight * (0.15 + Math.random() * 0.35);
        spawnFirework(randomX, randomY, 40);
      }, 3800);
    };

    startPeriodicFireworks();

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Render Floating Ambient Golden Dust
      const dust = dustRef.current;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.fadeSpeed;

        if (d.alpha > d.maxAlpha || d.alpha < 0.05) {
          d.fadeSpeed = -d.fadeSpeed;
        }

        // Wrap around viewport
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
        p.vy += 0.09; // Realistic gravity
        p.vx *= 0.98; // Air drag
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
    const content = contentRef.current;
    if (!container || !content) return;

    // Use fromTo with explicit safety defaults so content is guaranteed visible
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6 })
      .fromTo(
        content,
        { opacity: 0, scale: 0.94, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        "-=0.3"
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
      scale: 0.98,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        setIsOpen(false);
      },
    });
  }, [isClosing]);

  // Keyboard accessibility: Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Screen click handler (triggers fireworks unless clicking interactive buttons)
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

    // Massive grand celebration firework
    spawnFirework(cx, cy, 75);
    setTimeout(() => {
      spawnFirework(cx - 80, cy - 40, 45);
      spawnFirework(cx + 80, cy - 40, 45);
    }, 180);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleScreenClick}
      className="fixed inset-0 w-screen h-[100dvh] z-[9999] overflow-hidden select-none cursor-crosshair flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(ellipse at 50% 32%, #261108 0%, #170702 42%, #0a0301 75%, #050100 100%)",
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Interactive Fireworks & Golden Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(-0.5deg); opacity: 0.98; }
          25% { transform: scale(1.08, 0.94) rotate(1.4deg); opacity: 1; }
          50% { transform: scale(0.95, 1.06) rotate(-1deg); opacity: 0.94; }
          75% { transform: scale(1.04, 1.02) rotate(0.6deg); opacity: 0.99; }
        }
        @keyframes haloPulse {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(1.22); opacity: 0.75; }
        }
        @keyframes borderGoldShimmer {
          0%, 100% { border-color: rgba(245, 158, 11, 0.35); box-shadow: 0 0 25px rgba(245, 158, 11, 0.15); }
          50% { border-color: rgba(253, 230, 138, 0.65); box-shadow: 0 0 45px rgba(245, 158, 11, 0.3); }
        }
        .animate-flame-flicker {
          animation: flameFlicker 1.8s ease-in-out infinite;
          transform-origin: 50% 90%;
        }
        .animate-halo-pulse {
          animation: haloPulse 3.5s ease-in-out infinite;
        }
        .animate-border-shimmer {
          animation: borderGoldShimmer 6s ease-in-out infinite;
        }
      `}</style>

      {/* ================= BACKGROUND AMBIENT GLOW ORBS ================= */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[380px] h-[380px] bg-orange-600/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[380px] h-[380px] bg-amber-600/12 rounded-full blur-[120px] pointer-events-none" />

      {/* ================= CINEMATIC METALLIC GOLD BORDER FRAME ================= */}
      <div className="fixed inset-3 sm:inset-5 md:inset-7 rounded-2xl sm:rounded-3xl border border-amber-400/30 pointer-events-none z-20 animate-border-shimmer">
        {/* Ornate Corner Highlights */}
        <div className="absolute top-2 left-2 text-amber-400/60 text-xs sm:text-sm">✧</div>
        <div className="absolute top-2 right-2 text-amber-400/60 text-xs sm:text-sm">✧</div>
        <div className="absolute bottom-2 left-2 text-amber-400/60 text-xs sm:text-sm">✧</div>
        <div className="absolute bottom-2 right-2 text-amber-400/60 text-xs sm:text-sm">✧</div>
      </div>

      {/* ================= TOP BAR ================= */}
      <header className="relative z-30 w-full px-6 sm:px-12 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand Logo / Identity */}
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">✦</span>
          <span className="text-amber-200/95 tracking-[0.28em] text-[11px] sm:text-xs md:text-sm font-bold uppercase">
            RizeWorld Institute
          </span>
          <span className="text-amber-400 text-xs">✦</span>
        </div>

        {/* Close Button / Skip Option */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-no-firework="true"
            data-close-btn="true"
            onClick={handleClose}
            className="group flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-amber-400/30 hover:border-amber-300 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md"
            aria-label="Enter Website"
          >
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-200 group-hover:text-white">
              Enter Site
            </span>
            <X size={15} className="text-amber-300 group-hover:text-white" />
          </button>
        </div>
      </header>

      {/* ================= MAIN FULL-SCREEN CONTENT ================= */}
      <main
        ref={contentRef}
        className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto my-auto"
      >
        {/* ================= 1. GLOWING UPPER-CENTER DIYA ================= */}
        <div className="relative flex flex-col items-center justify-center mb-3 sm:mb-5">
          {/* Ambient Pulsing Light Halo */}
          <div className="absolute -top-6 w-32 h-32 sm:w-44 sm:h-44 bg-gradient-to-t from-amber-400/50 via-yellow-300/30 to-transparent rounded-full blur-2xl animate-halo-pulse pointer-events-none" />

          {/* Upward Radiating Soft Light Beam */}
          <div className="absolute -top-10 w-2 h-20 sm:h-28 bg-gradient-to-t from-amber-200 via-white to-transparent blur-[1px] animate-pulse pointer-events-none" />

          {/* High-Fidelity Majestic Diya Lamp Vector */}
          <svg
            width="120"
            height="84"
            viewBox="0 0 120 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 w-24 h-18 sm:w-32 sm:h-24 md:w-36 md:h-26 drop-shadow-[0_6px_22px_rgba(245,158,11,0.7)]"
          >
            <defs>
              {/* Flame Radial Gradient: White Core -> Lemon Yellow -> Amber Red */}
              <radialGradient id="fsFlameGrad" cx="50%" cy="65%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#DC2626" />
              </radialGradient>

              {/* Metallic Gold Trim Gradient */}
              <linearGradient id="fsGoldRim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Terracotta Clay Body Gradient */}
              <linearGradient id="fsClayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="45%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>

            {/* Flickering Teardrop Flame */}
            <g className="animate-flame-flicker">
              <path
                d="M60 4 C52 18 44 26 44 38 C44 49 51 56 60 56 C69 56 76 49 76 38 C76 26 68 18 60 4 Z"
                fill="url(#fsFlameGrad)"
              />
              <path
                d="M60 18 C56 26 52 32 52 39 C52 45 56 49 60 49 C64 49 68 45 68 39 C68 32 64 26 60 18 Z"
                fill="#FFFFFF"
                opacity="0.96"
              />
            </g>

            {/* Diya Lamp Base */}
            {/* Outer Golden Fluted Wings */}
            <path
              d="M20 50 C32 64 46 72 60 72 C74 72 88 64 100 50 C94 58 80 66 60 66 C40 66 26 58 20 50 Z"
              fill="url(#fsGoldRim)"
            />

            {/* Main Clay Lamp Body */}
            <path
              d="M22 48 C30 62 44 70 60 70 C76 70 90 62 98 48 C90 54 76 60 60 60 C44 60 30 54 22 48 Z"
              fill="url(#fsClayGrad)"
              stroke="url(#fsGoldRim)"
              strokeWidth="2"
            />

            {/* Golden Lip Arc */}
            <path
              d="M20 48 Q60 58 100 48"
              stroke="url(#fsGoldRim)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Subtle Star Sparkles Beside Lamp */}
            <circle cx="34" cy="34" r="1.8" fill="#FEF08A" opacity="0.85" />
            <circle cx="86" cy="32" r="1.5" fill="#FEF08A" opacity="0.85" />
          </svg>
        </div>

        {/* ================= 2. SHUBH DEEPAWALI PILL BADGE ================= */}
        <div className="mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
            <span className="text-amber-400 text-xs sm:text-sm">✧</span>
            <span className="text-amber-300 tracking-[0.3em] text-xs sm:text-sm font-bold uppercase">
              SHUBH DEEPAWALI
            </span>
            <span className="text-amber-400 text-xs sm:text-sm">✧</span>
          </div>
        </div>

        {/* ================= 3. MAJESTIC MAIN HEADING ================= */}
        <div className="my-1 sm:my-2">
          <h1
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-black uppercase tracking-wider leading-[0.95]"
            style={{
              background:
                "linear-gradient(135deg, #FFFDF5 0%, #FDE68A 25%, #F59E0B 55%, #FEF08A 75%, #D97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 35px rgba(245,158,11,0.45)",
            }}
          >
            HAPPY DIWALI!
          </h1>
        </div>

        {/* ================= 4. SUBHEADING ================= */}
        <div className="mt-3 sm:mt-4">
          <p className="text-amber-200/95 font-semibold tracking-wide text-base sm:text-xl md:text-2xl">
            Warm Wishes from <span className="text-amber-300 font-extrabold">RizeWorld Institute</span>
          </p>
        </div>

        {/* ================= 5. DESCRIPTION ================= */}
        <div className="mt-3 sm:mt-4 max-w-xl mx-auto px-2">
          <p className="text-neutral-200/90 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            May this Diwali illuminate your path with knowledge, happiness, new opportunities, and outstanding career success.
          </p>
        </div>

        {/* Golden Ornamental Divider */}
        <div className="flex items-center justify-center gap-3 my-4 sm:my-6 text-amber-400/80 text-sm">
          <span className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-amber-400/60" />
          <span>✦</span>
          <span>🪔</span>
          <span>✦</span>
          <span className="w-16 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-amber-400/60" />
        </div>

        {/* ================= 6. LARGE GLOWING CTA BUTTON ================= */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            data-no-firework="true"
            onClick={handleCtaClick}
            className="group relative px-9 py-3.5 sm:px-12 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:brightness-110 text-neutral-950 font-black text-sm sm:text-base md:text-lg tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:shadow-[0_0_50px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3 border-2 border-amber-200"
          >
            <span>Celebrate With Us</span>
            <Sparkles size={20} className="text-neutral-950 animate-pulse" />
          </button>
        </div>
      </main>

      {/* ================= FOOTER / INSTRUCTION ================= */}
      <footer className="relative z-30 w-full px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
        {/* Fireworks Instruction */}
        <span className="text-amber-300/80 text-xs sm:text-sm tracking-widest uppercase font-medium flex items-center gap-1.5 mx-auto sm:mx-0">
          <span>✨</span>
          <span>Click anywhere for magical fireworks</span>
          <span>✨</span>
        </span>

        {/* Enter Site Quick Link */}
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
