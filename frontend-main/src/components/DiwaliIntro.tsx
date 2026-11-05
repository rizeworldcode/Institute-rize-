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
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

const FESTIVE_COLORS = [
  "#fbbf24", // Warm Gold
  "#f59e0b", // Rich Amber
  "#f97316", // Saffron Orange
  "#ef4444", // Festival Red
  "#ec4899", // Deep Pink
  "#a855f7", // Royal Purple
  "#38bdf8", // Sky Blue
  "#4ade80", // Emerald Green
  "#ffffff", // Shimmer White
];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);
  const [showFloatingDiya, setShowFloatingDiya] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const autoBurstTimerRef = useRef<number | null>(null);

  // Trigger firework explosion at (x, y) with multiple spark layers
  const createExplosion = useCallback((x: number, y: number, primaryColor?: string, count = 65) => {
    const particles: Particle[] = [];
    const color = primaryColor || FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
    const secondaryColor = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = Math.random() * 5.5 + 2.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.35 ? color : secondaryColor,
        alpha: 1,
        decay: Math.random() * 0.018 + 0.012,
        size: Math.random() * 3.2 + 1.6,
        flicker: Math.random() > 0.4,
      });
    }

    // Add bright central flash
    for (let j = 0; j < 12; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: "#ffffff",
        alpha: 1,
        decay: 0.035,
        size: Math.random() * 4 + 2,
        flicker: true,
      });
    }

    particlesRef.current.push(...particles);
  }, []);

  // Launch a sky rocket from the bottom
  const launchRocket = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const x = Math.random() * (width * 0.84) + width * 0.08;
    const targetY = Math.random() * (height * 0.55) + height * 0.1;
    const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];

    rocketsRef.current.push({
      x,
      y: height + 10,
      targetY,
      vy: -(Math.random() * 4 + 11),
      color,
    });
  }, []);

  // Canvas render & animation loop
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

      // 1. Update and Draw Rockets (Shooting up)
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.y += r.vy;

        // Sparkle tail for rocket
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();

        // Trail sparks
        for (let t = 0; t < 2; t++) {
          particlesRef.current.push({
            x: r.x + (Math.random() - 0.5) * 4,
            y: r.y + Math.random() * 8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 2 + 1,
            color: r.color,
            alpha: 0.8,
            decay: 0.05,
            size: Math.random() * 2 + 1,
            flicker: false,
          });
        }
        ctx.restore();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color, 70);
          rocketsRef.current.splice(i, 1);
        }
      }

      // 2. Update and Draw Explosion Particles
      const remaining: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // Gravity
        p.vx *= 0.98; // Drag
        p.alpha -= p.decay;
        p.size *= 0.985;

        if (p.alpha > 0.03 && p.size > 0.4) {
          ctx.save();
          const displayAlpha = p.flicker && Math.random() > 0.3 ? p.alpha * 0.7 : p.alpha;
          ctx.globalAlpha = Math.max(0, displayAlpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 14;
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
  }, [createExplosion]);

  // Periodic rockets & bursts when isOpen
  useEffect(() => {
    if (!isOpen) {
      if (autoBurstTimerRef.current) clearInterval(autoBurstTimerRef.current);
      return;
    }

    // Launch instant celebration salvos
    launchRocket();
    createExplosion(window.innerWidth * 0.25, window.innerHeight * 0.3, "#fbbf24", 60);
    createExplosion(window.innerWidth * 0.75, window.innerHeight * 0.28, "#ef4444", 60);

    const t1 = setTimeout(() => {
      launchRocket();
      launchRocket();
    }, 300);

    const t2 = setTimeout(() => {
      createExplosion(window.innerWidth * 0.5, window.innerHeight * 0.2, "#a855f7", 75);
    }, 700);

    // Continuous celebration rockets every 650ms
    autoBurstTimerRef.current = window.setInterval(() => {
      launchRocket();
      if (Math.random() > 0.35) launchRocket();
    }, 650);

    // Auto-minimize after 8 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(autoCloseTimer);
      if (autoBurstTimerRef.current) clearInterval(autoBurstTimerRef.current);
    };
  }, [isOpen, createExplosion, launchRocket]);

  const handleClose = () => {
    setIsOpen(false);
    setShowFloatingDiya(true);
  };

  const handleReopen = () => {
    setIsOpen(true);
    setShowFloatingDiya(false);
    // Extra celebration salvos on reopen
    launchRocket();
    launchRocket();
    createExplosion(window.innerWidth * 0.5, window.innerHeight * 0.3, "#fbbf24", 80);
  };

  return (
    <>
      {/* High-priority Foreground Canvas - Placed at z-[105] so fireworks burst OVER the screen and around the card! */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[105] w-full h-full"
      />

      {/* Main Diwali Greeting Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300"
          onClick={(e) => {
            // Clicking anywhere on backdrop or card triggers a celebration burst at that spot!
            createExplosion(e.clientX, e.clientY, undefined, 60);
          }}
        >
          {/* Royal Festive Card */}
          <div
            className="relative w-full max-w-lg rounded-[2.5rem] bg-gradient-to-b from-[#181005]/95 via-[#100902]/98 to-[#090501]/95 p-8 sm:p-10 text-center border-2 border-amber-400/70 shadow-[0_0_80px_rgba(245,158,11,0.5),inset_0_1px_20px_rgba(251,191,36,0.15)] overflow-hidden animate-in zoom-in-95 duration-400"
            onClick={(e) => {
              e.stopPropagation();
              createExplosion(e.clientX, e.clientY, undefined, 50);
            }}
          >
            {/* Traditional Golden Corner Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/80 rounded-br-lg pointer-events-none" />

            {/* Glowing Golden Aura Backdrops */}
            <div className="absolute -top-20 -left-20 w-52 h-52 bg-amber-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-orange-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-amber-200 hover:text-white hover:bg-white/20 border border-amber-400/30 transition-all cursor-pointer z-10 shadow-md"
              aria-label="Close Greeting"
            >
              <X size={18} />
            </button>

            {/* Top Traditional Diya with 3D Glowing Flickering Flame */}
            <div className="relative mb-5 flex justify-center items-center">
              {/* Outer Radiant Glow */}
              <div className="absolute -top-4 w-24 h-24 bg-amber-400/40 rounded-full blur-2xl animate-pulse" />
              
              <svg
                viewBox="0 0 100 80"
                className="w-24 h-20 drop-shadow-[0_0_30px_rgba(251,191,36,0.95)] relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="royalFlameGrad" cx="50%" cy="65%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#fef08a" />
                    <stop offset="65%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </radialGradient>
                  <linearGradient id="royalDiyaGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="70%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                  <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>
                </defs>

                {/* Flame Aura Glow */}
                <ellipse cx="50" cy="30" rx="18" ry="24" fill="#f59e0b" opacity="0.35" className="animate-pulse" />

                {/* Flickering Outer Flame */}
                <path
                  d="M50 4 C45 18 36 25 36 36 C36 48 43 54 50 54 C57 54 64 48 64 36 C64 25 55 18 50 4 Z"
                  fill="url(#royalFlameGrad)"
                  className="animate-pulse"
                />

                {/* Inner Core Flame */}
                <path
                  d="M50 15 C47 23 42 29 42 36 C42 43 46 48 50 48 C54 48 58 43 58 36 C58 29 53 23 50 15 Z"
                  fill="#ffffff"
                  opacity="0.95"
                />

                {/* Diya Clay Base */}
                <path
                  d="M12 47 C24 70 76 70 88 47 C92 41 96 44 87 53 C74 68 26 68 13 53 C4 44 8 41 12 47 Z"
                  fill="url(#royalDiyaGrad)"
                  stroke="url(#rimGrad)"
                  strokeWidth="2"
                />

                {/* Base Stand */}
                <path
                  d="M38 64 C43 71 57 71 62 64 Z"
                  fill="#92400e"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Shubh Deepawali Decorative Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/25 to-amber-500/10 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <span className="text-amber-400">✦</span>
              <span>SHUBH DEEPAWALI</span>
              <span className="text-amber-400">✦</span>
            </div>

            {/* Royal Heading */}
            <h2
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-3"
              style={{
                background: "linear-gradient(135deg, #fffbeb 0%, #fef08a 25%, #f59e0b 55%, #fbbf24 85%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 25px rgba(245, 158, 11, 0.5))",
              }}
            >
              HAPPY DIWALI!
            </h2>

            {/* Institute Warm Wishes Subtitle */}
            <p className="text-amber-200 font-bold text-sm sm:text-base tracking-wide mt-1">
              Warm Wishes from RizeWorld Institute
            </p>

            {/* Heartfelt Wish Message */}
            <p className="text-neutral-200 text-xs sm:text-sm mt-3.5 leading-relaxed max-w-md mx-auto font-medium">
              May the divine festival of lights illuminate your path with infinite wisdom, happiness, and outstanding career success.
            </p>

            {/* Festive Diya Emoticons */}
            <div className="flex justify-center items-center gap-3 my-4 text-lg">
              <span className="animate-bounce" style={{ animationDuration: "1.8s" }}>🪔</span>
              <span className="text-amber-300 text-xs tracking-widest font-bold">✨ FESTIVAL OF LIGHTS ✨</span>
              <span className="animate-bounce" style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}>🪔</span>
            </div>

            {/* Celebrate With Us Button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Extra burst of fireworks on click
                  createExplosion(window.innerWidth * 0.5, window.innerHeight * 0.4, "#fbbf24", 80);
                  setTimeout(() => handleClose(), 600);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-extrabold text-sm shadow-[0_0_30px_rgba(251,191,36,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-200"
              >
                <span>Celebrate With Us</span>
                <span className="text-base">🪔</span>
              </button>
            </div>

            {/* Click to explode hint */}
            <p className="text-[11px] text-amber-300/60 mt-3 font-medium">
              Click anywhere for extra fireworks ✨
            </p>
          </div>
        </div>
      )}

      {/* Floating Corner Diya Widget to Replay */}
      {showFloatingDiya && (
        <button
          type="button"
          onClick={handleReopen}
          className="fixed bottom-24 right-5 md:right-8 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-amber-400/70 shadow-[0_0_30px_rgba(245,158,11,0.5)] text-amber-300 text-xs font-bold tracking-wide transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Click to celebrate Diwali with fireworks!"
        >
          <span className="text-lg animate-bounce">🪔</span>
          <span className="text-amber-200 font-bold group-hover:text-amber-100">Happy Diwali</span>
          <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: "5s" }} />
        </button>
      )}
    </>
  );
}
