import { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

const FESTIVE_COLORS = [
  "#f59e0b", // Gold/Amber
  "#fbbf24", // Warm Yellow
  "#ef4444", // Festive Red
  "#ec4899", // Deep Pink
  "#a855f7", // Royal Purple
  "#38bdf8", // Sky Blue
  "#10b981", // Emerald Green
  "#ffffff", // Sparkle White
];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingDiya, setShowFloatingDiya] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const autoBurstTimerRef = useRef<number | null>(null);

  // Trigger a firework explosion at (x, y)
  const createFirework = useCallback((x: number, y: number, count = 45) => {
    const particles: Particle[] = [];
    const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
    const secondaryColor = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 4.5 + 1.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.4 ? color : secondaryColor,
        alpha: 1,
        decay: Math.random() * 0.018 + 0.012,
        size: Math.random() * 3 + 1.8,
      });
    }
    particlesRef.current.push(...particles);
  }, []);

  // Launch auto fireworks bursts
  const triggerRandomBurst = useCallback(() => {
    if (typeof window === "undefined") return;
    const x = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
    const y = Math.random() * (window.innerHeight * 0.5) + window.innerHeight * 0.1;
    createFirework(x, y, 40);
  }, [createFirework]);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const remaining: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // subtle gravity
        p.alpha -= p.decay;
        p.size *= 0.985;

        if (p.alpha > 0.05 && p.size > 0.5) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          remaining.push(p);
        }
      }
      particlesRef.current = remaining;

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Show intro celebration on mount (once per session, or always allow user to reopen)
  useEffect(() => {
    const seen = sessionStorage.getItem("rize_diwali_seen_v1");
    // Open on fresh load
    if (!seen) {
      setIsOpen(true);
      sessionStorage.setItem("rize_diwali_seen_v1", "true");
    } else {
      // If already seen, keep floating Diya available in corner
      setShowFloatingDiya(true);
    }
  }, []);

  // When open, run periodic fireworks
  useEffect(() => {
    if (!isOpen) {
      if (autoBurstTimerRef.current) clearInterval(autoBurstTimerRef.current);
      return;
    }

    // Initial burst salvo
    triggerRandomBurst();
    const t1 = setTimeout(() => triggerRandomBurst(), 300);
    const t2 = setTimeout(() => triggerRandomBurst(), 700);

    // Periodic fireworks
    autoBurstTimerRef.current = window.setInterval(() => {
      triggerRandomBurst();
    }, 900);

    // Auto-minimize after 7 seconds to preserve reading experience
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(autoCloseTimer);
      if (autoBurstTimerRef.current) clearInterval(autoBurstTimerRef.current);
    };
  }, [isOpen, triggerRandomBurst]);

  const handleClose = () => {
    setIsOpen(false);
    setShowFloatingDiya(true);
  };

  const handleReopen = () => {
    setIsOpen(true);
    setShowFloatingDiya(false);
    // Extra celebration bursts
    triggerRandomBurst();
    setTimeout(() => triggerRandomBurst(), 250);
    setTimeout(() => triggerRandomBurst(), 500);
  };

  return (
    <>
      {/* Canvas for Fireworks overlay across screen */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Main Diwali Greeting Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="relative w-full max-w-md rounded-3xl bg-linear-to-b from-neutral-900 via-neutral-950 to-black p-8 text-center border-2 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.35)] overflow-hidden animate-in zoom-in-95 duration-400"
            onClick={(e) => {
              // Click anywhere on card spawns extra sparkles
              createFirework(e.clientX, e.clientY, 35);
            }}
          >
            {/* Background glowing gradients */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer z-10"
              aria-label="Close Greeting"
            >
              <X size={18} />
            </button>

            {/* Glowing Traditional Diya SVG */}
            <div className="relative mb-4 flex justify-center">
              <div className="absolute -top-3 w-16 h-16 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
              <svg
                viewBox="0 0 100 80"
                className="w-20 h-16 drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="diyaFlameGrad" cx="50%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#fef08a" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </radialGradient>
                  <linearGradient id="diyaBaseGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>
                {/* Outer Flame (flickers) */}
                <path
                  d="M50 6 C46 20 37 26 37 36 C37 47 43 53 50 53 C57 53 63 47 63 36 C63 26 54 20 50 6 Z"
                  fill="url(#diyaFlameGrad)"
                  className="animate-pulse"
                />
                {/* Inner Core Flame */}
                <path
                  d="M50 16 C48 24 43 30 43 36 C43 43 46 47 50 47 C54 47 57 43 57 36 C57 30 52 24 50 16 Z"
                  fill="#ffffff"
                  opacity="0.95"
                />
                {/* Diya Clay Base */}
                <path
                  d="M14 47 C25 68 75 68 86 47 C90 42 94 45 86 53 C74 67 26 67 14 53 C6 45 10 42 14 47 Z"
                  fill="url(#diyaBaseGrad)"
                  stroke="#fef08a"
                  strokeWidth="1.5"
                />
                {/* Stand */}
                <path d="M40 63 C44 69 56 69 60 63 Z" fill="#92400e" stroke="#fbbf24" strokeWidth="1" />
              </svg>
            </div>

            {/* Shubh Deepavali Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              Shubh Deepavali
              <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-300 to-amber-500 tracking-tight">
              Happy Diwali!
            </h2>

            {/* Brand subtext */}
            <p className="text-amber-200/90 font-semibold text-sm sm:text-base mt-1">
              Warm Wishes from RizeWorld Institute
            </p>

            {/* Wish Message */}
            <p className="text-neutral-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm mx-auto">
              May the divine festival of lights illuminate your path with infinite wisdom, happiness, and outstanding career success. 🪔✨
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Celebrate With Us 🪔
              </button>
            </div>

            {/* Auto-closing hint */}
            <p className="text-[11px] text-neutral-400 mt-3">
              Click anywhere for extra fireworks ✨
            </p>
          </div>
        </div>
      )}

      {/* Floating Corner Diya (Appears after closing so users can click to celebrate anytime) */}
      {showFloatingDiya && (
        <button
          type="button"
          onClick={handleReopen}
          className="fixed bottom-24 right-5 md:right-8 z-40 group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-neutral-950/90 hover:bg-neutral-900 border border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.4)] text-amber-300 text-xs font-bold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Click to celebrate Diwali with fireworks!"
        >
          <span className="text-base animate-bounce">🪔</span>
          <span className="hidden sm:inline text-amber-200 group-hover:text-amber-100">Happy Diwali</span>
          <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "5s" }} />
        </button>
      )}
    </>
  );
}

