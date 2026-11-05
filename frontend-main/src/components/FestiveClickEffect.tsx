import { useEffect, useRef } from "react";

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  shape: "circle" | "star";
  rotation: number;
  rotationSpeed: number;
}

const FESTIVE_COLORS = [
  "#FFFFFF", // Pure Diamond White
  "#FEF08A", // Soft Lemon Gold
  "#FDE68A", // Champagne Gold
  "#FBBF24", // Royal Gold
  "#F59E0B", // Warm Amber
  "#FB923C", // Festive Orange
  "#EA580C", // Saffron
];

export default function FestiveClickEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const isLoopRunningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Draw 4-pointed sparkle star
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    // Animation loop (only active while particles exist)
    const animate = () => {
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        isLoopRunningRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14; // gentle gravity
        p.vx *= 0.96; // air drag
        p.vy *= 0.96;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.shape === "star") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          drawStar(ctx, 0, 0, 4, p.size * 2, p.size * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    // Spawn burst function
    const spawnBurst = (originX: number, originY: number) => {
      const isMobile = window.innerWidth < 640;
      const count = isMobile ? 22 : 36;
      const newParticles: SparkleParticle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 6.5;
        const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
        const isStar = Math.random() > 0.45;

        newParticles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.022,
          color,
          size: 1.5 + Math.random() * 2.5,
          shape: isStar ? "star" : "circle",
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }

      particlesRef.current.push(...newParticles);

      if (!isLoopRunningRef.current) {
        isLoopRunningRef.current = true;
        requestAnimationFrame(animate);
      }
    };

    // Global pointer listener
    const handlePointerDown = (e: PointerEvent) => {
      // If the Diwali full-screen popup is actively open, it has its own firework canvas
      if (document.body.getAttribute("data-diwali-active") === "true") return;

      spawnBurst(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointerdown", handlePointerDown);
      particlesRef.current = [];
      isLoopRunningRef.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99999] w-screen h-screen select-none"
      aria-hidden="true"
    />
  );
}
