import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";
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

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // ================= 1. FIREWORKS ENGINE (CANVAS) =================
  const spawnFirework = useCallback((originX: number, originY: number, count = 45) => {
    // Luxury Festive Color Palette: Rich Gold, Saffron, Radiant White, Warm Amber
    const colors = [
      "#FDE68A", // Light gold
      "#F59E0B", // Vibrant amber
      "#EA580C", // Saffron orange
      "#FEF08A", // Pale yellow
      "#FFFFFF", // Pure white core
      "#FBBF24", // Golden yellow
      "#D97706", // Deep gold
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      // 360-degree radial explosion with randomized velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 6.5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // subtle upward initial lift
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018, // 1.2 to 2s fade
        color,
        size: 1.8 + Math.random() * 2.6,
        sparkle: Math.random() > 0.4,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Continuous Canvas Particle Render Loop
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

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gentle gravity
        p.vx *= 0.98; // Air resistance drag
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Render glowing particle
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
  }, [isOpen]);

  // ================= 2. GSAP ENTRANCE ANIMATION =================
  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const popup = popupRef.current;
    if (!backdrop || !popup) return;

    // Set initial GSAP states
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(popup, { opacity: 0, scale: 0.88, y: 20 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // Welcome celebration burst in center
        const rect = popup.getBoundingClientRect();
        spawnFirework(rect.left + rect.width / 2, rect.top + 80, 50);
      },
    });

    tl.to(backdrop, { opacity: 1, duration: 0.45 })
      .to(popup, { opacity: 1, scale: 1, y: 0, duration: 0.65 }, "-=0.25")
      .from(
        ".diwali-stagger-item",
        {
          opacity: 0,
          y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
        },
        "-=0.3"
      );

    return () => {
      tl.kill();
    };
  }, [isOpen, spawnFirework]);

  // ================= 3. SMOOTH EXIT ANIMATION =================
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const backdrop = backdropRef.current;
    const popup = popupRef.current;
    if (!backdrop || !popup) {
      setIsOpen(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
      },
    });

    tl.to(popup, {
      scale: 0.9,
      opacity: 0,
      y: 15,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      backdrop,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.15"
    );
  }, [isClosing]);

  // Keyboard accessibility: Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Handle interactive clicks on the popup or backdrop to launch fireworks
  const handleInteractiveClick = (e: React.MouseEvent) => {
    // Avoid re-triggering if clicking close button
    const target = e.target as HTMLElement;
    if (target.closest("button[data-close-btn]")) return;

    spawnFirework(e.clientX, e.clientY, 35);
  };

  // Trigger extra rich fireworks when clicking CTA
  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    spawnFirework(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

    // Also trigger subtle side bursts
    setTimeout(() => {
      spawnFirework(rect.left - 40, rect.top, 30);
      spawnFirework(rect.right + 40, rect.top, 30);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleInteractiveClick}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0a0504]/85 backdrop-blur-md select-none overflow-y-auto cursor-crosshair"
      aria-modal="true"
      role="dialog"
    >
      {/* Interactive Fireworks Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Custom Styles for Flame, Floating & Luxury Glow */}
      <style>{`
        @keyframes diyaFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
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
        .animate-diya-float {
          animation: diyaFloat 4.5s ease-in-out infinite;
        }
        .animate-flame-flicker {
          animation: flameFlicker 1.8s ease-in-out infinite;
          transform-origin: 50% 90%;
        }
        .animate-halo-pulse {
          animation: haloPulse 3.2s ease-in-out infinite;
        }
        .animate-gold-border {
          animation: goldBorderShimmer 6s ease-in-out infinite;
        }
      `}</style>

      {/* ================= MAIN CINEMATIC POPUP CARD ================= */}
      <div
        ref={popupRef}
        onClick={handleInteractiveClick}
        className="relative z-20 w-full max-w-[460px] sm:max-w-[490px] rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#1b0d06] via-[#120703] to-[#0c0402] border border-amber-500/40 p-6 sm:p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.25)] animate-gold-border cursor-default overflow-hidden"
      >
        {/* Subtle Luxury Corner Filigree Highlights */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none rounded-tl-[32px]" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/20 to-transparent pointer-events-none rounded-tr-[32px]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-400/15 to-transparent pointer-events-none rounded-bl-[32px]" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-400/15 to-transparent pointer-events-none rounded-br-[32px]" />

        {/* Ambient Warm Golden Orb Behind the Diya */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/18 rounded-full blur-[70px] pointer-events-none" />

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

        {/* ================= 1. BRANDING & DIYA ILLUSTRATION ================= */}
        <div className="diwali-stagger-item flex flex-col items-center justify-center mt-1">
          {/* Small Top Branding */}
          <span className="text-amber-300/80 tracking-[0.28em] text-[10px] sm:text-[11px] font-semibold uppercase mb-3 flex items-center gap-1.5">
            <span className="text-amber-400">✦</span>
            RizeWorld Institute
            <span className="text-amber-400">✦</span>
          </span>

          {/* Animated Glowing Diya */}
          <div className="relative animate-diya-float flex flex-col items-center justify-center my-1">
            {/* Pulsing Light Halo */}
            <div className="absolute -top-3 w-20 h-20 bg-gradient-to-t from-amber-400/40 via-yellow-300/25 to-transparent rounded-full blur-xl animate-halo-pulse pointer-events-none" />

            {/* Glowing Flame and Lamp SVG */}
            <svg
              width="88"
              height="64"
              viewBox="0 0 88 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)]"
            >
              <defs>
                {/* Flame Gradient: White Core -> Yellow -> Saffron Red */}
                <radialGradient id="popupFlameGrad" cx="50%" cy="65%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#DC2626" />
                </radialGradient>

                {/* Metallic Gold Diya Rim */}
                <linearGradient id="popupGoldRim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="80%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Diya Clay Base Gradient */}
                <linearGradient id="popupDiyaClay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A16207" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>

              {/* Flame (Flickering) */}
              <g className="animate-flame-flicker">
                {/* Outer Flame */}
                <path
                  d="M44 4 C38 14 32 20 32 28 C32 36 37 41 44 41 C51 41 56 36 56 28 C56 20 50 14 44 4 Z"
                  fill="url(#popupFlameGrad)"
                />
                {/* Intense Core White Glow */}
                <path
                  d="M44 14 C41 20 38 24 38 29 C38 33 41 36 44 36 C47 36 50 33 50 29 C50 24 47 20 44 14 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              </g>

              {/* Diya Bowl (Golden Curved Clay Arc) */}
              {/* Outer Golden Fluted Wings */}
              <path
                d="M16 38 C24 48 34 54 44 54 C54 54 64 48 72 38 C68 44 58 50 44 50 C30 50 20 44 16 38 Z"
                fill="url(#popupGoldRim)"
              />

              {/* Main Clay Lamp Body */}
              <path
                d="M18 36 C24 46 33 52 44 52 C55 52 64 46 70 36 C64 40 54 44 44 44 C34 44 24 40 18 36 Z"
                fill="url(#popupDiyaClay)"
                stroke="url(#popupGoldRim)"
                strokeWidth="1.6"
              />

              {/* Golden Lip Arc */}
              <path
                d="M16 36 Q44 44 72 36"
                stroke="url(#popupGoldRim)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Sparkle Stars Beside Flame */}
              <circle cx="26" cy="24" r="1.5" fill="#FEF08A" opacity="0.8" />
              <circle cx="62" cy="22" r="1.2" fill="#FEF08A" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* ================= 2. FESTIVE BADGE ================= */}
        <div className="diwali-stagger-item mt-3 mb-2 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="text-amber-400 text-xs">✧</span>
            <span className="text-amber-300 tracking-[0.24em] text-[11px] sm:text-xs font-semibold uppercase">
              SHUBH DEEPAWALI
            </span>
            <span className="text-amber-400 text-xs">✧</span>
          </div>
        </div>

        {/* ================= 3. MAIN HEADING ================= */}
        <div className="diwali-stagger-item my-2">
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
        <div className="diwali-stagger-item mb-3">
          <p className="text-amber-200/90 font-medium tracking-wide text-xs sm:text-sm">
            Warm Wishes from <span className="text-amber-300 font-semibold">RizeWorld Institute</span>
          </p>
        </div>

        {/* ================= 5. DESCRIPTION ================= */}
        <div className="diwali-stagger-item mb-5 px-2">
          <p className="text-neutral-300 text-xs sm:text-[13px] leading-relaxed max-w-sm mx-auto font-normal">
            May this Diwali illuminate your path with knowledge, happiness, new opportunities, and outstanding career success.
          </p>
        </div>

        {/* Decorative Divider with Diya Motif */}
        <div className="diwali-stagger-item flex items-center justify-center gap-2.5 my-3 text-amber-400/70 text-xs">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-amber-400/50" />
          <span>✦</span>
          <span>🪔</span>
          <span>✦</span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        {/* ================= 6. BOTTOM CTA & INTERACTION ================= */}
        <div className="diwali-stagger-item flex flex-col items-center gap-2.5 mt-2">
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_28px_rgba(245,158,11,0.55)] hover:shadow-[0_0_38px_rgba(245,158,11,0.75)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 border border-amber-200"
          >
            <span>Celebrate With Us</span>
            <Sparkles size={16} className="text-neutral-950 animate-pulse" />
          </button>

          {/* Small fireworks tip */}
          <span className="text-amber-300/70 text-[10px] sm:text-[11px] tracking-wider mt-1 font-medium">
            Click anywhere for magical fireworks ✨
          </span>
        </div>
      </div>
    </div>
  );
}
