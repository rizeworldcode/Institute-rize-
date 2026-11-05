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

  // ================= 1. INTERACTIVE CANVAS FIREWORKS ENGINE =================
  const spawnFirework = useCallback((originX: number, originY: number, count = 45) => {
    const colors = [
      "#FFFBEB", // Pure light
      "#FEF08A", // Pale yellow
      "#FDE68A", // Gold light
      "#F59E0B", // Vibrant amber
      "#EA580C", // Saffron orange
      "#FBBF24", // Golden yellow
      "#E11D48", // Rose festive
      "#D97706", // Deep gold
    ];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 6.5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.016,
        color,
        size: 2 + Math.random() * 2.8,
        sparkle: Math.random() > 0.35,
      });
    }

    particlesRef.current.push(...newParticles);
  }, []);

  // Canvas render loop
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

    // Initial festive welcome fireworks bursts
    const timer1 = setTimeout(() => {
      spawnFirework(window.innerWidth / 2, window.innerHeight / 2 - 120, 50);
    }, 300);

    const timer2 = setTimeout(() => {
      spawnFirework(window.innerWidth / 2 - 130, window.innerHeight / 2 - 60, 35);
      spawnFirework(window.innerWidth / 2 + 130, window.innerHeight / 2 - 60, 35);
    }, 700);

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // Gentle gravity
        p.vx *= 0.98; // Drag
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
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isOpen, spawnFirework]);

  // Smooth close
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

  // Interactive clicks
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
    spawnFirework(cx, cy, 65);
    setTimeout(() => {
      spawnFirework(cx - 70, cy - 30, 40);
      spawnFirework(cx + 70, cy - 30, 40);
    }, 150);
  };

  if (!isOpen) return null;

  // 8 Symmetrical Diya Coordinates (Radius: 172px from center 260,260)
  const diyas = [
    { deg: 0, x: 260, y: 88, delay: "0s" },
    { deg: 45, x: 381.6, y: 138.4, delay: "0.25s" },
    { deg: 90, x: 432, y: 260, delay: "0.5s" },
    { deg: 135, x: 381.6, y: 381.6, delay: "0.75s" },
    { deg: 180, x: 260, y: 432, delay: "1.0s" },
    { deg: 225, x: 138.4, y: 381.6, delay: "1.25s" },
    { deg: 270, x: 88, y: 260, delay: "1.5s" },
    { deg: 315, x: 138.4, y: 138.4, delay: "1.75s" },
  ];

  // 8 Symmetrical White Circle Badges (Radius: 135px from center 260,260)
  const icons = [
    { type: "facebook", deg: 22.5, x: 311.7, y: 135.3 },
    { type: "instagram", deg: 67.5, x: 384.7, y: 208.3 },
    { type: "linkedin", deg: 112.5, x: 384.7, y: 311.7 },
    { type: "twitter", deg: 157.5, x: 311.7, y: 384.7 },
    { type: "website", deg: 202.5, x: 208.3, y: 384.7 },
    { type: "palette", deg: 247.5, x: 135.3, y: 311.7 },
    { type: "youtube", deg: 292.5, x: 135.3, y: 208.3 },
    { type: "whatsapp", deg: 337.5, x: 208.3, y: 135.3 },
  ];

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-[#0a0314]/85 backdrop-blur-md select-none overflow-y-auto cursor-crosshair transition-opacity duration-300 ${
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

      {/* Floating Golden Dust Particles in Background */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={`gold_dust_${i}`}
            className="absolute rounded-full bg-amber-300/40 blur-[1px] animate-pulse"
            style={{
              width: `${2 + (i % 3) * 1.5}px`,
              height: `${2 + (i % 3) * 1.5}px`,
              left: `${(i * 6.8 + 3) % 96}%`,
              top: `${(i * 11.1 + 5) % 94}%`,
              animationDuration: `${2.2 + (i % 4) * 0.7}s`,
              animationDelay: `${(i % 5) * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Custom Styles for Flame Flicker & Diya Glow */}
      <style>{`
        @keyframes flameFlickerOutward {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.96; }
          25% { transform: scale(1.08, 0.94) rotate(1.4deg); opacity: 1; }
          50% { transform: scale(0.95, 1.06) rotate(-0.9deg); opacity: 0.92; }
          75% { transform: scale(1.05, 1.02) rotate(0.7deg); opacity: 0.98; }
        }
        @keyframes rayPulseSlow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.15, 1.25); }
        }
        @keyframes cardGlowShimmer {
          0%, 100% { box-shadow: 0 25px 80px rgba(0,0,0,0.9), 0 0 45px rgba(168, 85, 247, 0.25), 0 0 25px rgba(245, 158, 11, 0.2); }
          50% { box-shadow: 0 25px 85px rgba(0,0,0,0.95), 0 0 65px rgba(168, 85, 247, 0.4), 0 0 40px rgba(245, 158, 11, 0.35); }
        }
        .animate-flame-flicker {
          animation: flameFlickerOutward 1.7s ease-in-out infinite;
          transform-origin: 0px -26px;
        }
        .animate-ray-pulse {
          animation: rayPulseSlow 2.8s ease-in-out infinite;
          transform-origin: 0px -26px;
        }
        .animate-card-glow {
          animation: cardGlowShimmer 5s ease-in-out infinite;
        }
      `}</style>

      {/* ================= MAIN CINEMATIC POPUP MODAL ================= */}
      <div
        onClick={handleBackdropClick}
        className={`relative z-20 w-full max-w-[490px] sm:max-w-[530px] rounded-[32px] sm:rounded-[38px] bg-gradient-to-b from-[#260a48] via-[#1a0634] to-[#0d021c] border-2 border-amber-500/40 p-4 sm:p-6 text-center animate-card-glow cursor-default transition-all duration-300 shadow-2xl ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Soft Diagonal Ambient Light Beam like Image 3 */}
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-br from-purple-400/20 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-gradient-to-tl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button in Top-Right Corner */}
        <button
          type="button"
          data-close-btn="true"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-white/20 transition-all duration-200 cursor-pointer z-30 shadow-md backdrop-blur-sm"
          aria-label="Close Diwali Greeting"
        >
          <X size={17} />
        </button>

        {/* ================= 2. THE COMPLETE CIRCULAR MANDALA & DIYA ARTWORK ================= */}
        <div className="relative w-full aspect-square max-w-[450px] mx-auto flex items-center justify-center">
          <svg
            viewBox="0 0 520 520"
            className="w-full h-full drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Center Circle Radial Gradient */}
              <radialGradient id="popupCenterGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#3b156b" />
                <stop offset="70%" stop-color="#260c49" />
                <stop offset="100%" stop-color="#180530" />
              </radialGradient>

              {/* Diya Clay Bowl Gradient */}
              <radialGradient id="popupDiyaBowl" cx="50%" cy="60%" r="65%">
                <stop offset="0%" stop-color="#701a75" />
                <stop offset="55%" stop-color="#4a044e" />
                <stop offset="100%" stop-color="#2d0230" />
              </radialGradient>

              {/* Diya Gold Rim Gradient */}
              <linearGradient id="popupDiyaGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fde047" />
                <stop offset="50%" stop-color="#ea580c" />
                <stop offset="100%" stop-color="#991b1b" />
              </linearGradient>

              {/* Flame Glow Filter */}
              <filter id="popupFlameGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Outer Radiant Flame Light Beam */}
              <linearGradient id="popupFlameRayGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85" />
                <stop offset="40%" stop-color="#fbbf24" stop-opacity="0.5" />
                <stop offset="75%" stop-color="#f97316" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
              </linearGradient>

              {/* Traditional Ornate Diya Symbol (Pointed tip at 0, -26 facing OUTWARD) */}
              <g id="traditionalDiyaMaster">
                {/* Radiant Light Beam Shining Outward */}
                <polygon
                  points="-6,-26 0,-62 6,-26"
                  fill="url(#popupFlameRayGrad)"
                  filter="url(#popupFlameGlow)"
                  className="animate-ray-pulse"
                />
                <ellipse
                  cx="0"
                  cy="-44"
                  rx="11"
                  ry="18"
                  fill="url(#popupFlameRayGrad)"
                  opacity="0.4"
                  className="animate-ray-pulse"
                />

                {/* Outer Ornate Scalloped Terracotta Base with Filigree Curves */}
                <path
                  d="
                    M 0, -26
                    C 15, -20 26, -6 26, 8
                    C 26, 22 14, 27 0, 27
                    C -14, 27 -26, 22 -26, 8
                    C -26, -6 -15, -20 0, -26 Z
                  "
                  fill="#581c87"
                  stroke="url(#popupDiyaGoldRim)"
                  stroke-width="2.6"
                />

                {/* Scalloped Inner Flutes (Traditional Handcrafted Indian Diya Pattern) */}
                <path
                  d="
                    M 0, -24
                    Q 9, -19 16, -11
                    Q 23, -3 23, 7
                    Q 22, 17 14, 22
                    Q 7, 26 0, 26
                    Q -7, 26 -14, 22
                    Q -22, 17 -23, 7
                    Q -23, -3 -16, -11
                    Q -9, -19 0, -24 Z
                  "
                  fill="#4a044e"
                  stroke="#fbbf24"
                  stroke-width="1.3"
                />

                {/* Golden Petal Accents on the Scalloped Rim */}
                <circle cx="21" cy="-2" r="2.1" fill="#fde047" />
                <circle cx="21" cy="11" r="2.1" fill="#fde047" />
                <circle cx="11" cy="23" r="2.1" fill="#fde047" />
                <circle cx="-11" cy="23" r="2.1" fill="#fde047" />
                <circle cx="-21" cy="11" r="2.1" fill="#fde047" />
                <circle cx="-21" cy="-2" r="2.1" fill="#fde047" />
                <circle cx="0" cy="26" r="2.4" fill="#fde047" />

                {/* Inner Clay Oil Cavity */}
                <path
                  d="
                    M 0, -22
                    C 11, -16 18, -4 18, 6
                    C 18, 17 10, 21 0, 21
                    C -10, 21 -18, 17 -18, 6
                    C -18, -4 -11, -16 0, -22 Z
                  "
                  fill="url(#popupDiyaBowl)"
                  stroke="#ea580c"
                  stroke-width="1"
                />

                {/* Oil Reflection & Delicate Wick Highlight */}
                <path
                  d="M 0, -20 Q -5, 2 0, 16"
                  fill="none"
                  stroke="#fed7aa"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  opacity="0.8"
                />

                {/* The Flickering Flame */}
                <g className="animate-flame-flicker">
                  {/* Flame Halo Glow */}
                  <ellipse
                    cx="0"
                    cy="-32"
                    rx="9"
                    ry="14"
                    fill="#f59e0b"
                    opacity="0.55"
                    filter="url(#popupFlameGlow)"
                  />
                  {/* Outer Amber Flame */}
                  <path
                    d="M 0, -44 C 6.5, -35 7.5, -25 0, -24 C -7.5, -25 -6.5, -35 0, -44 Z"
                    fill="#ea580c"
                  />
                  {/* Middle Golden Flame */}
                  <path
                    d="M 0, -41 C 4.8, -34 5.2, -25 0, -24.5 C -5.2, -25 -4.8, -34 0, -41 Z"
                    fill="#fbbf24"
                  />
                  {/* Hot Pure White Core */}
                  <path
                    d="M 0, -35 C 2.6, -30 2.6, -25 0, -25 C -2.6, -25 -2.6, -30 0, -35 Z"
                    fill="#ffffff"
                  />
                </g>
              </g>
            </defs>

            {/* ================= A. MANDALA & RANGOLI LACE RINGS ================= */}
            {/* Concentric Decorative Guide Rings */}
            <circle
              cx="260"
              cy="260"
              r="135"
              fill="none"
              stroke="#be185d"
              stroke-width="1"
              stroke-dasharray="3,5"
              opacity="0.45"
            />
            <circle
              cx="260"
              cy="260"
              r="120"
              fill="none"
              stroke="#9d174d"
              stroke-width="1.4"
              opacity="0.65"
            />
            <circle
              cx="260"
              cy="260"
              r="114"
              fill="none"
              stroke="#e11d48"
              stroke-width="0.9"
              stroke-dasharray="2,3"
              opacity="0.5"
            />

            {/* Traditional Rangoli Scallop Lace Petals */}
            <g stroke="#db2777" stroke-width="1.3" fill="#be185d" fill-opacity="0.2">
              <circle cx="260" cy="260" r="98" fill="none" stroke="#f43f5e" stroke-width="1.8" />
              <circle cx="260" cy="260" r="102" fill="none" stroke="#fbbf24" stroke-width="0.9" stroke-dasharray="2,4" />

              {/* Decorative Golden Beads on Mandala Rim */}
              <g fill="#fbbf24" opacity="0.8">
                <circle cx="260" cy="158" r="2" />
                <circle cx="280" cy="160" r="2" />
                <circle cx="299" cy="168" r="2" />
                <circle cx="316" cy="180" r="2" />
                <circle cx="330" cy="196" r="2" />
                <circle cx="340" cy="215" r="2" />
                <circle cx="344" cy="235" r="2" />
                <circle cx="344" cy="260" r="2" />
                <circle cx="344" cy="285" r="2" />
                <circle cx="340" cy="305" r="2" />
                <circle cx="330" cy="324" r="2" />
                <circle cx="316" cy="340" r="2" />
                <circle cx="299" cy="352" r="2" />
                <circle cx="280" cy="360" r="2" />
                <circle cx="260" cy="362" r="2" />
                <circle cx="240" cy="360" r="2" />
                <circle cx="221" cy="352" r="2" />
                <circle cx="204" cy="340" r="2" />
                <circle cx="190" cy="324" r="2" />
                <circle cx="180" cy="305" r="2" />
                <circle cx="176" cy="285" r="2" />
                <circle cx="176" cy="260" r="2" />
                <circle cx="176" cy="235" r="2" />
                <circle cx="180" cy="215" r="2" />
                <circle cx="190" cy="196" r="2" />
                <circle cx="204" cy="180" r="2" />
                <circle cx="221" cy="168" r="2" />
                <circle cx="240" cy="160" r="2" />
              </g>
            </g>

            {/* ================= B. 8 TRADITIONAL ORNATE DIYAS ================= */}
            {diyas.map((diya, idx) => (
              <use
                key={`popup_diya_${idx}`}
                href="#traditionalDiyaMaster"
                transform={`translate(${diya.x}, ${diya.y}) rotate(${diya.deg})`}
                style={{ animationDelay: diya.delay }}
              />
            ))}

            {/* ================= C. 8 WHITE CIRCULAR ICON BADGES ================= */}
            {/* Exactly positioned at 22.5 deg offsets between every pair of diyas */}
            {icons.map((item, idx) => (
              <g key={`popup_icon_${idx}`} transform={`translate(${item.x}, ${item.y})`}>
                {/* White Circular Badge */}
                <circle
                  cx="0"
                  cy="0"
                  r="14.5"
                  fill="#ffffff"
                  filter="drop-shadow(0 2px 5px rgba(0,0,0,0.45))"
                />

                {/* Specific Icon Inside Badge */}
                {item.type === "facebook" && (
                  <path
                    d="M-1,6 L-1,0 L-3,0 L-3,-2.5 L-1,-2.5 L-1,-4.2 C-1,-6.2 0.3,-7.2 2.2,-7.2 C3.1,-7.2 3.8,-7.1 4.1,-7.1 L4.1,-4.9 L2.9,-4.9 C2,-4.9 1.8,-4.5 1.8,-3.8 L1.8,-2.5 L4.1,-2.5 L3.8,0 L1.8,0 L1.8,6 Z"
                    fill="#1877f2"
                  />
                )}
                {item.type === "instagram" && (
                  <g>
                    <rect
                      x="-6"
                      y="-6"
                      width="12"
                      height="12"
                      rx="3.5"
                      fill="none"
                      stroke="#e1306c"
                      stroke-width="1.6"
                    />
                    <circle cx="0" cy="0" r="2.8" fill="none" stroke="#e1306c" stroke-width="1.5" />
                    <circle cx="3.5" cy="-3.5" r="0.9" fill="#e1306c" />
                  </g>
                )}
                {item.type === "linkedin" && (
                  <g>
                    <rect x="-6" y="-2" width="2.4" height="8" fill="#0a66c2" />
                    <circle cx="-4.8" cy="-5" r="1.4" fill="#0a66c2" />
                    <path
                      d="M-1.5,6 L-1.5,-2 L0.8,-2 L0.8,-0.7 C1.2,-1.5 2.1,-2.2 3.5,-2.2 C5.3,-2.2 6.5,-1 6.5,1.2 L6.5,6 L4.1,6 L4.1,1.8 C4.1,0.8 3.7,0.1 2.7,0.1 C1.8,0.1 1,0.8 1,1.8 L1,6 Z"
                      fill="#0a66c2"
                    />
                  </g>
                )}
                {item.type === "twitter" && (
                  <path
                    d="M-5,-4.5 L-2.5, -0.8 L-5.5, 4.5 L-3.5, 4.5 L-1.5, 0.7 L1.2, 4.5 L5.5, 4.5 L2.5, -0.3 L5.2, -4.5 L3.2, -4.5 L1.4, -1.3 L-1.2, -4.5 Z"
                    fill="#0f1419"
                  />
                )}
                {item.type === "website" && (
                  <g>
                    <circle cx="0" cy="0" r="6.2" fill="none" stroke="#2563eb" stroke-width="1.3" />
                    <ellipse cx="0" cy="0" rx="3" ry="6.2" fill="none" stroke="#2563eb" stroke-width="1.1" />
                    <line x1="-6.2" y1="0" x2="6.2" y2="0" stroke="#2563eb" stroke-width="1.1" />
                  </g>
                )}
                {item.type === "palette" && (
                  <g>
                    <path
                      d="M -5.5,-1 C -5.5,-4.5 -2.5,-6.5 1,-6.5 C 4.5,-6.5 6.5,-4 6.5,-1 C 6.5,2 5,5 2.5,5 C 1,5 0.5,4 0,4 C -0.5,4 -1,5 -2.5,5 C -4.5,5 -5.5,3 -5.5,-1 Z"
                      fill="none"
                      stroke="#d97706"
                      stroke-width="1.3"
                    />
                    <circle cx="-2.5" cy="-2.5" r="1" fill="#ef4444" />
                    <circle cx="1.5" cy="-3.5" r="1" fill="#3b82f6" />
                    <circle cx="3.8" cy="-1" r="1" fill="#10b981" />
                  </g>
                )}
                {item.type === "youtube" && (
                  <g>
                    <rect x="-6.5" y="-4.5" width="13" height="9" rx="2.5" fill="#ff0000" />
                    <polygon points="-2,-2.5 3,0 -2,2.5" fill="#ffffff" />
                  </g>
                )}
                {item.type === "whatsapp" && (
                  <g>
                    <circle cx="0" cy="0" r="6.2" fill="#25d366" />
                    <path
                      d="M -1.8,-3.2 C -2.3,-3.2 -3.1,-2.8 -3.1,-1.8 C -3.1,-0.8 -2.3,0.8 -0.8,2.3 C 0.7,3.8 2.3,4.6 3.3,4.6 C 4.3,4.6 4.7,3.8 4.7,3.3 C 4.7,3 3.8,2.3 3.5,2.1 C 3.2,1.9 3,2 2.8,2.3 C 2.6,2.5 2.3,2.8 2.1,2.8 C 1.9,2.8 1.6,2.7 1.2,2.4 C 0.7,2.1 0.2,1.6 -0.1,1.1 C -0.4,0.7 -0.5,0.4 -0.5,0.2 C -0.5,0 -0.2,-0.3 0,-0.5 C 0.2,-0.7 0.3,-0.9 0.1,-1.2 C -0.1,-1.5 -0.8,-3.2 -1.1,-3.2 Z"
                      fill="#ffffff"
                    />
                  </g>
                )}
              </g>
            ))}

            {/* ================= D. CENTER DIWALI CIRCLE ================= */}
            <circle
              cx="260"
              cy="260"
              r="76"
              fill="url(#popupCenterGrad)"
              stroke="#fbbf24"
              stroke-width="2.5"
              filter="drop-shadow(0 0 16px rgba(251,191,36,0.4))"
            />
            <circle
              cx="260"
              cy="260"
              r="71"
              fill="none"
              stroke="#f59e0b"
              stroke-width="0.8"
              opacity="0.65"
              stroke-dasharray="3,3"
            />

            {/* Center Typography */}
            <text
              x="260"
              y="228"
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="12.5"
              fontWeight="500"
              letterSpacing="0.6"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            >
              Wishing you a
            </text>

            <text
              x="260"
              y="262"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="28"
              fontWeight="900"
              letterSpacing="1.8"
              fontFamily="'Cinzel', 'Playfair Display', Georgia, serif"
            >
              DIWALI
            </text>

            <text
              x="260"
              y="286"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="11.5"
              fontWeight="700"
              letterSpacing="0.5"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            >
              RizeWorld Institute
            </text>

            <text
              x="260"
              y="306"
              textAnchor="middle"
              fill="#f59e0b"
              fontSize="11"
              letterSpacing="2"
            >
              ✦ 🪔 ✦
            </text>
          </svg>
        </div>

        {/* ================= 3. FESTIVE MESSAGE & INTERACTIVE CTA ================= */}
        <div className="mt-2 sm:mt-3 px-2">
          <p className="text-amber-100/80 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed">
            May this festival of lights illuminate your path with knowledge, prosperity, and outstanding career success.
          </p>

          <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleCtaClick}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden border border-amber-300"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles size={14} className="text-neutral-900 animate-spin" style={{ animationDuration: "4s" }} />
                Celebrate With Us ✨
              </span>
              <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            </button>

            <span className="text-[10px] sm:text-[11px] text-amber-300/60 tracking-wider">
              ✦ Click anywhere for fireworks ✦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
