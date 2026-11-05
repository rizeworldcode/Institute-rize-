import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";

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

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // ================= 1. FIREWORKS ENGINE (CANVAS) =================
  const spawnFirework = useCallback((originX: number, originY: number, count = 45) => {
    // Luxury Festive Colors: Golden Yellow, Saffron Orange, Pure White, Vibrant Amber
    const colors = [
      "#FEF08A", // Pale Yellow
      "#FDE68A", // Light Gold
      "#F59E0B", // Vibrant Amber
      "#EA580C", // Saffron Orange
      "#FFFFFF", // Pure White Core
      "#FBBF24", // Golden Yellow
      "#D97706", // Deep Gold
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 6.5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
        color,
        size: 1.8 + Math.random() * 2.6,
        sparkle: Math.random() > 0.4,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Canvas particle animation loop
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

    // Initial festive burst on load
    setTimeout(() => {
      spawnFirework(window.innerWidth / 2, window.innerHeight / 2 - 120, 50);
    }, 300);

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity
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
        ctx.shadowBlur = p.sparkle ? 10 : 4;

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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isOpen, spawnFirework]);

  // Smooth exit handler
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 250);
  }, [isClosing]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Click handler for fireworks
  const handleBackdropClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button[data-close-btn]")) return;
    spawnFirework(e.clientX, e.clientY, 35);
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    spawnFirework(cx, cy, 60);
    setTimeout(() => {
      spawnFirework(cx - 50, cy - 20, 35);
      spawnFirework(cx + 50, cy - 20, 35);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0a0402]/85 backdrop-blur-md select-none overflow-y-auto cursor-crosshair transition-opacity duration-300 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Fullscreen Interactive Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Custom Keyframes */}
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(-0.5deg); opacity: 0.98; }
          25% { transform: scale(1.08, 0.95) rotate(1.2deg); opacity: 1; }
          50% { transform: scale(0.95, 1.05) rotate(-1deg); opacity: 0.94; }
          75% { transform: scale(1.04, 1.02) rotate(0.6deg); opacity: 0.99; }
        }
        @keyframes haloPulse {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(1.2); opacity: 0.75; }
        }
        @keyframes goldBorderShimmer {
          0%, 100% { border-color: rgba(245, 158, 11, 0.45); box-shadow: 0 0 25px rgba(245, 158, 11, 0.2); }
          50% { border-color: rgba(253, 230, 138, 0.75); box-shadow: 0 0 40px rgba(245, 158, 11, 0.35); }
        }
        .animate-flame-flicker {
          animation: flameFlicker 1.8s ease-in-out infinite;
          transform-origin: 50% 90%;
        }
        .animate-halo-pulse {
          animation: haloPulse 3s ease-in-out infinite;
        }
        .animate-gold-border {
          animation: goldBorderShimmer 6s ease-in-out infinite;
        }
      `}</style>

      {/* ================= MAIN FESTIVE CARD ================= */}
      <div
        onClick={handleBackdropClick}
        className={`relative z-20 w-full max-w-[440px] sm:max-w-[480px] rounded-[30px] sm:rounded-[34px] bg-gradient-to-b from-[#1c0e07] via-[#120703] to-[#0a0301] border border-amber-500/50 p-6 sm:p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] animate-gold-border cursor-default transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Corner Gold Highlights */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none rounded-tl-[34px]" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/20 to-transparent pointer-events-none rounded-tr-[34px]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-400/15 to-transparent pointer-events-none rounded-bl-[34px]" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-400/15 to-transparent pointer-events-none rounded-br-[34px]" />

        {/* Ambient Warm Glow Behind Diya */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-[65px] pointer-events-none" />

        {/* Close Button in Top-Right Corner */}
        <button
          type="button"
          data-close-btn="true"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/15 transition-all duration-200 cursor-pointer z-30 shadow-md"
          aria-label="Close Diwali Greeting"
        >
          <X size={16} />
        </button>

        {/* ================= 1. TOP GLOWING DIYA ================= */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="relative flex flex-col items-center justify-center my-1">
            {/* Ambient Pulsing Halo */}
            <div className="absolute -top-3 w-20 h-20 bg-gradient-to-t from-amber-400/40 via-yellow-300/25 to-transparent rounded-full blur-xl animate-halo-pulse pointer-events-none" />

            {/* Glowing Diya Flame & Lamp Vector */}
            <svg
              width="88"
              height="64"
              viewBox="0 0 88 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)]"
            >
              <defs>
                <radialGradient id="cardFlameGrad" cx="50%" cy="65%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#DC2626" />
                </radialGradient>

                <linearGradient id="cardGoldRim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FEF08A" />
                </linearGradient>

                <linearGradient id="cardClayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A16207" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>

              {/* Flickering Flame */}
              <g className="animate-flame-flicker">
                <path
                  d="M44 4 C38 14 32 20 32 28 C32 36 37 41 44 41 C51 41 56 36 56 28 C56 20 50 14 44 4 Z"
                  fill="url(#cardFlameGrad)"
                />
                <path
                  d="M44 14 C41 20 38 24 38 29 C38 33 41 36 44 36 C47 36 50 33 50 29 C50 24 47 20 44 14 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              </g>

              {/* Diya Clay Bowl */}
              <path
                d="M16 38 C24 48 34 54 44 54 C54 54 64 48 72 38 C68 44 58 50 44 50 C30 50 20 44 16 38 Z"
                fill="url(#cardGoldRim)"
              />
              <path
                d="M18 36 C24 46 33 52 44 52 C55 52 64 46 70 36 C64 40 54 44 44 44 C34 44 24 40 18 36 Z"
                fill="url(#cardClayGrad)"
                stroke="url(#cardGoldRim)"
                strokeWidth="1.6"
              />
              <path
                d="M16 36 Q44 44 72 36"
                stroke="url(#cardGoldRim)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Sparkles */}
              <circle cx="26" cy="24" r="1.5" fill="#FEF08A" opacity="0.8" />
              <circle cx="62" cy="22" r="1.2" fill="#FEF08A" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* ================= 2. SHUBH DEEPAWALI PILL BADGE ================= */}
        <div className="mb-2 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-950/50 via-amber-900/35 to-amber-950/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="text-amber-400 text-xs">✧</span>
            <span className="text-amber-300 tracking-[0.24em] text-[11px] sm:text-xs font-semibold uppercase">
              SHUBH DEEPAWALI
            </span>
            <span className="text-amber-400 text-xs">✧</span>
          </div>
        </div>

        {/* ================= 3. MAIN HEADING ================= */}
        <div className="my-2">
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-[42px] font-extrabold uppercase tracking-wide leading-tight"
            style={{
              background:
                "linear-gradient(135deg, #FFFBEB 0%, #FDE68A 25%, #F59E0B 55%, #FEF08A 80%, #D97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 24px rgba(245,158,11,0.35)",
            }}
          >
            HAPPY DIWALI!
          </h2>
        </div>

        {/* ================= 4. SUBHEADING ================= */}
        <div className="mb-3">
          <p className="text-amber-200/95 font-medium tracking-wide text-xs sm:text-sm">
            Warm Wishes from <span className="text-amber-300 font-bold">RizeWorld Institute</span>
          </p>
        </div>

        {/* ================= 5. DESCRIPTION ================= */}
        <div className="mb-4 px-2">
          <p className="text-neutral-200 text-xs sm:text-[13px] leading-relaxed max-w-sm mx-auto font-normal">
            May this Diwali illuminate your path with knowledge, happiness, new opportunities, and outstanding career success.
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2.5 my-3 text-amber-400/80 text-xs">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-amber-400/50" />
          <span>✦</span>
          <span>🪔</span>
          <span>✦</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        {/* ================= 6. CELEBRATE WITH US BUTTON ================= */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:brightness-110 text-neutral-950 font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_28px_rgba(245,158,11,0.55)] hover:shadow-[0_0_38px_rgba(245,158,11,0.75)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 border border-amber-200"
          >
            <span>Celebrate With Us</span>
            <Sparkles size={16} className="text-neutral-950 animate-pulse" />
          </button>

          {/* Fireworks hint caption */}
          <span className="text-amber-300/70 text-[10px] sm:text-[11px] tracking-wider mt-1 font-medium">
            Click anywhere for magical fireworks ✨
          </span>
        </div>
      </div>
    </div>
  );
}
