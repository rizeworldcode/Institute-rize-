import { useEffect, useState, useCallback } from "react";
import {
  X,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  MessageCircle,
  Globe,
  Sparkles,
} from "lucide-react";

// 8 Marketing Channels arranged in clockwise order
// Placed at the exact midpoint (22.5 deg offset) between each Diya
const SOCIAL_CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", angle: 22.5 },
  { icon: Facebook, label: "Facebook", angle: 67.5 },
  { icon: Instagram, label: "Instagram", angle: 112.5 },
  { icon: Linkedin, label: "LinkedIn", angle: 157.5 },
  { icon: Twitter, label: "X / Twitter", angle: 202.5 },
  { icon: Youtube, label: "YouTube", angle: 247.5 },
  { icon: Globe, label: "Website & SEO", angle: 292.5 },
  { icon: Sparkles, label: "AI Marketing", angle: 337.5 },
];

// 8 Diyas arranged in 45-degree intervals (0° = Top / 12 o'clock)
const DIYA_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-dismiss after 10 seconds so user can freely explore the website
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Exact mathematical radial distances for a seamless circular ring
  // R_DIYA: places the 🪔 lamps in a ring hugging the center circle
  const R_DIYA = 29.5;
  // R_ICON: places the social badge in the notch between adjacent Diyas
  const R_ICON = 34.0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#1a0833]/92 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Custom Keyframes for Smooth Spinning Circular Wheel and Counter-Rotation */}
      <style>{`
        @keyframes diwaliWheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes iconCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-diwali-wheel {
          animation: diwaliWheelSpin 28s linear infinite;
        }
        .animate-icon-counter {
          animation: iconCounterSpin 28s linear infinite;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div className="absolute w-[520px] h-[520px] bg-purple-700/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[360px] h-[360px] bg-amber-500/18 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[560px] flex flex-col items-center justify-center py-2 sm:py-4">
        {/* Close Button in top right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-0 right-0 p-2 sm:p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer z-50 shadow-lg"
          aria-label="Close Greeting"
        >
          <X size={18} />
        </button>

        {/* ================= HIGH-FIDELITY ROTATING FESTIVE WHEEL ================= */}
        {/* Strictly aspect-square container ensures perfect circular geometry on all screen sizes */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] aspect-square flex items-center justify-center">
          
          {/* ROTATING WHEEL (Contains Mandala Lace + 8 🪔 Diyas + 8 Social Badges) */}
          <div className="absolute inset-0 w-full h-full animate-diwali-wheel pointer-events-none">
            
            {/* Traditional Indian Mandala Background Artwork */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
              <defs>
                {/* Gold Filigree Gradient */}
                <linearGradient id="mandalaGoldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>

                {/* Deep Royal Crimson for Mandala Lace */}
                <linearGradient id="mandalaCrimsonGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#9f1239" />
                  <stop offset="50%" stopColor="#881337" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>

                {/* Radial Backdrop Glow */}
                <radialGradient id="wheelCenterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="35%" stopColor="#6b21a8" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#4c1d95" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Soft purple radial aura */}
              <circle cx="250" cy="250" r="230" fill="url(#wheelCenterAura)" />

              {/* Outer decorative halo ring */}
              <circle
                cx="250"
                cy="250"
                r="196"
                fill="none"
                stroke="url(#mandalaGoldGrad)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                opacity="0.4"
              />

              {/* Circular track passing directly behind the Diyas */}
              <circle
                cx="250"
                cy="250"
                r="147.5"
                fill="none"
                stroke="url(#mandalaGoldGrad)"
                strokeWidth="1"
                strokeDasharray="3 5"
                opacity="0.35"
              />

              {/* Mandala Lace Tier: Pointed Floral Petals */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                const r1 = 104;
                const r2 = 136;
                const p1x = 250 + r1 * Math.cos(angle - 0.12);
                const p1y = 250 + r1 * Math.sin(angle - 0.12);
                const p2x = 250 + r2 * Math.cos(angle);
                const p2y = 250 + r2 * Math.sin(angle);
                const p3x = 250 + r1 * Math.cos(angle + 0.12);
                const p3y = 250 + r1 * Math.sin(angle + 0.12);

                return (
                  <path
                    key={`petal_${i}`}
                    d={`M ${p1x} ${p1y} Q ${p2x} ${p2y} ${p3x} ${p3y} Z`}
                    fill="url(#mandalaCrimsonGrad)"
                    stroke="url(#mandalaGoldGrad)"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                );
              })}

              {/* Inner Solid Crimson Ring with Gold Trim */}
              <circle
                cx="250"
                cy="250"
                r="106"
                fill="none"
                stroke="url(#mandalaCrimsonGrad)"
                strokeWidth="5"
                opacity="0.9"
              />
              <circle
                cx="250"
                cy="250"
                r="109"
                fill="none"
                stroke="url(#mandalaGoldGrad)"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <circle
                cx="250"
                cy="250"
                r="103"
                fill="none"
                stroke="url(#mandalaGoldGrad)"
                strokeWidth="1.5"
                opacity="0.85"
              />
            </svg>

            {/* ================= 8 DIYAS USING "🪔" IN PERFECT CIRCULAR ALIGNMENT ================= */}
            {DIYA_ANGLES.map((theta, idx) => {
              // Convert clockwise angle from 12 o'clock to standard radians
              const rad = (theta * Math.PI) / 180;
              // Precise polar coordinates from the center (50%, 50%)
              const x = 50 + R_DIYA * Math.sin(rad);
              const y = 50 - R_DIYA * Math.cos(rad);

              return (
                <div
                  key={`diya_${idx}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    // Perfectly centered on (x, y)
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Counter-rotation keeps the Diya lamp upright and glowing as the wheel spins */}
                  <div className="animate-icon-counter flex items-center justify-center relative">
                    {/* Warm golden pulsing flame aura behind the Diya */}
                    <div className="absolute w-8 h-8 sm:w-12 sm:h-12 bg-amber-400/35 rounded-full blur-md animate-pulse pointer-events-none" />

                    {/* Traditional Diya Emoji specified by user */}
                    <span
                      className="text-3xl sm:text-5xl select-none relative z-10 transition-transform duration-300 hover:scale-125 filter drop-shadow-[0_4px_16px_rgba(251,191,36,0.7)]"
                      role="img"
                      aria-label="Diya"
                    >
                      🪔
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ================= 8 SOCIAL MEDIA BADGES IN NOTCHES ================= */}
            {/* Clean white discs with dark plum icons matching the reference design */}
            {SOCIAL_CHANNELS.map((ch, idx) => {
              // Convert clockwise angle from 12 o'clock to standard radians
              const rad = (ch.angle * Math.PI) / 180;
              // Exact polar coordinates: perfectly midway between adjacent Diyas
              const x = 50 + R_ICON * Math.sin(rad);
              const y = 50 - R_ICON * Math.cos(rad);

              return (
                <div
                  key={`social_${idx}`}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={ch.label}
                >
                  {/* Counter-rotating badge keeps icon upright as the circle spins */}
                  <div className="animate-icon-counter flex items-center justify-center">
                    {/* Clean white circle with luxury drop shadow */}
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.65)] flex items-center justify-center border-2 border-amber-300 hover:scale-125 transition-transform duration-200">
                      <ch.icon size={14} className="sm:w-4 sm:h-4 text-[#200c3b]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STEADY CENTER DIWALI GREETING (UNCHANGED & PRESERVED) ================= */}
          <div className="relative z-30 w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] rounded-full bg-gradient-to-br from-[#2f1354] via-[#1f0b3a] to-[#120524] border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.55),inset_0_0_25px_rgba(168,85,247,0.45)] flex flex-col items-center justify-center text-center p-3 sm:p-5">
            <span className="text-amber-200/95 text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
              Wishing you a
            </span>

            <h2
              className="text-white text-2xl sm:text-4xl font-black tracking-wider uppercase leading-tight my-0.5 sm:my-1"
              style={{
                textShadow: "0 0 20px rgba(251,191,36,0.75)",
              }}
            >
              DIWALI
            </h2>

            <p className="text-amber-300 text-[10px] sm:text-xs font-bold tracking-wide">
              RizeWorld Institute
            </p>

            <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 text-xs text-amber-400">
              <span>✨</span>
              <span>🪔</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ACTION & GREETING ================= */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center px-4 z-30">
          <p className="text-neutral-300 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed font-medium">
            May this festival of lights illuminate your digital journey with innovation, growth, and bright success! 🪔✨
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-amber-200"
          >
            <span>Celebrate & Enter Site</span>
            <span className="text-base">🪔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
