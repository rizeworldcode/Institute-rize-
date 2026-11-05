import { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";

interface AmbientSparkle {
  x: number;
  y: number;
  char: string;
  color: string;
  alpha: number;
  speed: number;
  angle: number;
}

const AMBIENT_CHARS = ["+", "*", "x", "#", "%", "·", "✦", "~"];
const AMBIENT_COLORS = ["#38bdf8", "#a855f7", "#ec4899", "#fbbf24", "#f97316", "#ef4444"];
const GLYPHS = ["#", "x", "@", "X", "+", "*", "%", "&", "8", "$"];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);
  const [showFloatingDiya, setShowFloatingDiya] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const ambientSparklesRef = useRef<AmbientSparkle[]>([]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setShowFloatingDiya(true);
  }, []);

  const handleReopen = () => {
    setIsOpen(true);
    setShowFloatingDiya(false);
  };

  // Auto-dismiss after 7.5 seconds so user can freely interact with the site
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 7500);
    return () => clearTimeout(timer);
  }, [isOpen, handleClose]);

  // Canvas Animation: ASCII / Code Matrix Glowing Diya
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initialize floating ambient code sparks around Diya
    const sparkles: AmbientSparkle[] = [];
    for (let i = 0; i < 90; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: AMBIENT_CHARS[Math.floor(Math.random() * AMBIENT_CHARS.length)],
        color: AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)],
        alpha: Math.random() * 0.65 + 0.15,
        speed: Math.random() * 0.35 + 0.15,
        angle: Math.random() * Math.PI * 2,
      });
    }
    ambientSparklesRef.current = sparkles;

    let time = 0;

    const render = () => {
      time++;

      // Deep dark cyber festive background with subtle trail
      ctx.fillStyle = "rgba(7, 3, 13, 0.28)";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw floating ambient sparkles
      for (const sp of ambientSparklesRef.current) {
        sp.y += Math.sin(time * 0.02 + sp.angle) * sp.speed;
        sp.x += Math.cos(time * 0.02 + sp.angle) * sp.speed;
        sp.alpha += (Math.random() - 0.5) * 0.03;
        sp.alpha = Math.max(0.1, Math.min(0.8, sp.alpha));

        // Wrap around
        if (sp.x < 0) sp.x = width;
        if (sp.x > width) sp.x = 0;
        if (sp.y < 0) sp.y = height;
        if (sp.y > height) sp.y = 0;

        ctx.save();
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = sp.color;
        ctx.fillText(sp.char, sp.x, sp.y);
        ctx.restore();
      }

      // 2. Render ASCII Coded Diya in Center
      const isMobile = width < 640;
      const cellW = isMobile ? 8.5 : 12;
      const cellH = isMobile ? 12 : 16;
      const rows = 31;
      const cols = 41;
      const centerCol = 20;

      // Center the Diya slightly above middle
      const startX = width / 2 - (cols * cellW) / 2;
      const startY = height / 2 - (rows * cellH) / 2 - (isMobile ? 10 : 20);

      // Flickering flame tip sway with sine wave
      const flameSway = Math.sin(time * 0.08) * 1.8;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c - centerCol;
          let drawChar = "";
          let charColor = "";
          let shadowColor = "";
          let shadowBlur = 0;

          // ================= FLAME (Rows 3 to 17) =================
          if (r >= 3 && r <= 17) {
            const fy = (r - 3) / 14; // 0 at top, 1 at base
            // Flame sway offset (tip sways more)
            const currentDx = dx - (1 - fy) * flameSway;
            // Flame envelope width
            const flameWidth = Math.sin(fy * Math.PI) * 4.6 + (1 - fy) * 0.6;

            if (Math.abs(currentDx) <= flameWidth) {
              const coreDist = Math.abs(currentDx) / flameWidth;

              // Core flame: white / bright yellow
              if (coreDist <= 0.38) {
                drawChar = Math.random() > 0.3 ? "@" : "x";
                charColor = "#ffffff";
                shadowColor = "#fef08a";
                shadowBlur = 14;
              }
              // Mid flame: gold / warm yellow
              else if (coreDist <= 0.72) {
                drawChar = GLYPHS[Math.floor((time + r * 3 + c) % GLYPHS.length)];
                charColor = "#fbbf24";
                shadowColor = "#f59e0b";
                shadowBlur = 12;
              }
              // Outer flame / base: saffron / flame red
              else {
                drawChar = Math.random() > 0.4 ? "x" : "+";
                charColor = fy > 0.8 ? "#ef4444" : "#f97316";
                shadowColor = "#dc2626";
                shadowBlur = 9;
              }
            }
          }

          // ================= DIYA RIM (Row 18) =================
          else if (r === 18) {
            if (Math.abs(dx) <= 17) {
              drawChar = Math.abs(dx) === 17 ? "/" : dx % 2 === 0 ? "=" : "-";
              charColor = "#fbbf24";
              shadowColor = "#f59e0b";
              shadowBlur = 10;
            }
          }

          // ================= DIYA BOWL (Rows 19 to 26) =================
          else if (r >= 19 && r <= 26) {
            const by = (r - 18) / 8; // 0 to 1
            const bowlW = 16.5 * Math.sqrt(Math.max(0, 1 - by * by * 0.75));

            if (Math.abs(dx) <= bowlW) {
              const edgeDist = Math.abs(dx) / bowlW;

              // Outer bowl edge: gold & terracotta
              if (edgeDist > 0.8) {
                drawChar = Math.random() > 0.5 ? "#" : "x";
                charColor = "#ea580c";
                shadowColor = "#f97316";
                shadowBlur = 8;
              }
              // Inner bowl fill: crimson red / maroon code characters
              else {
                drawChar = GLYPHS[Math.floor((time * 2 + r * 5 + c) % GLYPHS.length)];
                charColor = (r + c) % 2 === 0 ? "#ef4444" : "#b91c1c";
                shadowColor = "#991b1b";
                shadowBlur = 6;
              }
            }
          }

          // ================= DIYA BASE STAND (Rows 27 to 29) =================
          else if (r >= 27 && r <= 29) {
            const standW = 6 - (r - 27) * 1.5;
            if (Math.abs(dx) <= standW) {
              drawChar = "_";
              charColor = "#b45309";
              shadowColor = "#78350f";
              shadowBlur = 5;
            }
          }

          // Draw the character if defined
          if (drawChar) {
            ctx.save();
            ctx.font = `bold ${isMobile ? 11 : 14}px 'Courier New', monospace`;
            ctx.fillStyle = charColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowColor = shadowColor;
            ctx.fillText(drawChar, startX + c * cellW, startY + r * cellH);
            ctx.restore();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  return (
    <>
      {/* Immersive Diwali Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#07030d] select-none overflow-hidden animate-in fade-in duration-500">
          {/* Background Canvas: Animated ASCII / Code Matrix Diya */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Top Bar: Close Button & Sparkling Heading */}
          <div className="relative z-10 w-full pt-8 sm:pt-12 px-6 flex flex-col items-center text-center">
            {/* Close Button in top right */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 border border-white/15 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Close Greeting"
            >
              <X size={18} />
            </button>

            {/* Top Reel-Style Header: "HAPPY DIWALI ✦" */}
            <div className="flex items-center justify-center gap-3">
              <h1
                className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.22em] uppercase"
                style={{
                  background: "linear-gradient(90deg, #fde047 0%, #38bdf8 50%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(56, 189, 248, 0.5))",
                }}
              >
                HAPPY DIWALI
              </h1>
              <span className="text-2xl sm:text-3xl text-cyan-400 animate-pulse font-mono">
                ✦
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-amber-300/80 tracking-widest uppercase mt-2 font-semibold">
              RizeWorld Institute of AI & Digital Marketing
            </p>
          </div>

          {/* Spacer for center Canvas Diya */}
          <div className="flex-1 pointer-events-none" />

          {/* Bottom Bar: Festive Quote & Enter Button */}
          <div className="relative z-10 w-full pb-8 sm:pb-12 px-6 flex flex-col items-center text-center">
            <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed mb-6 font-medium">
              May your code run bug-free, your campaigns convert, and your career shine brighter than a thousand lamps. 🪔✨
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-linear-to-r from-amber-500 via-yellow-400 to-cyan-400 hover:from-amber-400 hover:to-cyan-300 text-neutral-950 font-mono font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
            >
              <span>Celebrate & Enter Site</span>
              <span className="text-base group-hover:rotate-12 transition-transform">🪔</span>
            </button>

            <p className="font-mono text-[11px] text-neutral-500 mt-3">
              Auto-entering in a few seconds...
            </p>
          </div>
        </div>
      )}

      {/* Floating Corner Diya Widget to Replay celebration */}
      {showFloatingDiya && (
        <button
          type="button"
          onClick={handleReopen}
          className="fixed bottom-24 right-5 md:right-8 z-40 group flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-950/90 border border-cyan-400/50 shadow-[0_0_25px_rgba(56,189,248,0.4)] text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Click to replay Diwali animation!"
        >
          <span className="text-base animate-bounce">🪔</span>
          <span className="text-amber-200 group-hover:text-cyan-200">Happy Diwali</span>
          <Sparkles size={13} className="text-cyan-400 animate-spin" style={{ animationDuration: "5s" }} />
        </button>
      )}
    </>
  );
}
