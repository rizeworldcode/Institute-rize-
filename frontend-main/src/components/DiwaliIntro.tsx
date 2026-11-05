import React, { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function DiwaliIntro() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 700);
  };

  // Auto dismiss after 4.2 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      dismiss();
    }, 4200);
    return () => clearTimeout(timer);
  }, [visible]);

  // Fireworks Canvas Animation
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#fbbf24", // Gold
      "#f59e0b", // Amber
      "#f97316", // Saffron
      "#ef4444", // Crimson
      "#ec4899", // Pink
      "#38bdf8", // Cyan
      "#a855f7", // Purple
      "#4ade80", // Green
    ];

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

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      exploded: boolean;
    }

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const createExplosion = (x: number, y: number, color: string) => {
      const count = 75;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 6.5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.35 ? color : colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          size: Math.random() * 2.8 + 1.6,
        });
      }
    };

    const launchRocket = () => {
      const x = Math.random() * (width * 0.8) + width * 0.1;
      const targetY = Math.random() * (height * 0.45) + height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.push({
        x,
        y: height,
        targetY,
        vy: -(Math.random() * 5 + 11),
        color,
        exploded: false,
      });
    };

    // Initial burst immediately
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        createExplosion(
          Math.random() * (width * 0.7) + width * 0.15,
          Math.random() * (height * 0.4) + height * 0.15,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }, i * 220);
    }

    // Rocket spawn interval
    const rocketInterval = setInterval(() => {
      launchRocket();
      if (Math.random() > 0.4) launchRocket();
    }, 420);

    const render = () => {
      ctx.fillStyle = "rgba(10, 5, 24, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        // Sparkle tail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = r.color;
        ctx.fill();

        if (r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity
        p.vx *= 0.98; // Air resistance
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(rocketInterval);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible]);

  return (
    <>
      {/* Full-Screen 3-Second Grand Intro Overlay */}
      {visible && (
        <div
          onClick={dismiss}
          className={`fixed inset-0 z-[999999] flex items-center justify-center cursor-pointer transition-opacity duration-700 select-none ${
            fading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            backgroundColor: "rgba(10, 5, 24, 0.88)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Background Fireworks Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="absolute top-6 right-6 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer"
            aria-label="Skip Celebration"
          >
            <span>Skip</span>
            <X size={15} />
          </button>

          {/* Festive Center Greeting Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-w-xl mx-4 p-8 md:p-12 text-center rounded-[2.5rem] bg-linear-to-b from-amber-950/40 via-purple-950/40 to-black/75 border border-amber-400/40 shadow-[0_0_90px_rgba(245,158,11,0.35)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500"
          >
            {/* Glow halo */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Floating Diya Icon */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDuration: "2s" }}>
                🪔
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-[0.2em] uppercase">
                <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                Shubh Deepawali
              </div>
              <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.4s" }}>
                🪔
              </span>
            </div>

            {/* Main Happy Diwali Heading */}
            <h1
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-4"
              style={{
                background: "linear-gradient(135deg, #fffbeb 0%, #fde047 25%, #f59e0b 55%, #fbbf24 85%, #fff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 35px rgba(245, 158, 11, 0.4)",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
              }}
            >
              Happy Diwali
            </h1>

            {/* Subtitle / Blessing */}
            <p className="text-amber-100/90 text-sm sm:text-base md:text-lg font-medium max-w-md mx-auto leading-relaxed mb-6">
              May the divine festival of lights illuminate your path with boundless knowledge, innovation, and career success!
            </p>

            {/* Institute Signature */}
            <div className="pt-4 border-t border-amber-400/20">
              <p className="text-xs tracking-widest text-amber-300/80 uppercase font-semibold">
                Warmest Wishes From
              </p>
              <p className="text-base sm:text-lg font-bold text-white tracking-wide mt-1">
                RizeWorld Institute of AI & Digital Marketing
              </p>
            </div>

            {/* Enter Site Button */}
            <div className="mt-8">
              <button
                onClick={dismiss}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Celebrate & Enter Site</span>
                <Sparkles size={16} />
              </button>
            </div>

            {/* Hint */}
            <p className="text-[11px] text-white/40 mt-3">Click anywhere to skip</p>
          </div>
        </div>
      )}

      {/* Floating Diya Trigger to Replay Celebration */}
      {!visible && (
        <button
          onClick={() => {
            setFading(false);
            setVisible(true);
          }}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold text-xs shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/40 animate-pulse"
          title="Click to celebrate Diwali again!"
          aria-label="Replay Diwali Celebration"
        >
          <span className="text-base">🪔</span>
          <span className="hidden sm:inline">Diwali Celebration</span>
        </button>
      )}
    </>
  );
}
