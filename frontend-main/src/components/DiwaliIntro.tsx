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

// 8 Marketing Channels arranged in exact clockwise order (offset by 22.5 deg between each Diya)
// Angle is measured in degrees clockwise from 12 o'clock (0° = Top)
const SOCIAL_CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", angle: 22.5, color: "#25D366" },
  { icon: Facebook, label: "Facebook", angle: 67.5, color: "#1877F2" },
  { icon: Instagram, label: "Instagram", angle: 112.5, color: "#E4405F" },
  { icon: Linkedin, label: "LinkedIn", angle: 157.5, color: "#0A66C2" },
  { icon: Twitter, label: "X / Twitter", angle: 202.5, color: "#111827" },
  { icon: Youtube, label: "YouTube", angle: 247.5, color: "#FF0000" },
  { icon: Globe, label: "Website & SEO", angle: 292.5, color: "#059669" },
  { icon: Sparkles, label: "AI Marketing", angle: 337.5, color: "#7C3AED" },
];

// 8 Diyas arranged in exact 45-degree intervals starting from 12 o'clock (0° = Top)
const DIYA_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-dismiss after 10 seconds so user can freely interact with the site
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Mathematical radius percentages (relative to the square wheel container)
  // R_diya: places the Diya so its base touches the center DIWALI circle and flame points outward
  const R_DIYA = 29.5;
  // R_icon: places the social badge exactly in the middle of the V-notch between adjacent Diyas
  const R_ICON = 33.0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#140628]/92 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
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

      {/* Background ambient festival glow */}
      <div className="absolute w-[460px] h-[460px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] bg-amber-500/18 rounded-full blur-[90px] pointer-events-none" />

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

        {/* ================= PERFECT MATHEMATICAL CIRCULAR WHEEL ================= */}
        {/* Strictly aspect-square container ensures perfect circular geometry on both mobile and desktop */}
        <div className="relative w-[330px] h-[330px] sm:w-[460px] sm:h-[460px] aspect-square flex items-center justify-center">
          
          {/* ROTATING WHEEL (Contains Mandala Lace + 8 Diyas + 8 Social Badges) */}
          <div className="absolute inset-0 w-full h-full animate-diwali-wheel pointer-events-none">
            
            {/* Traditional Indian Mandala Background */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
              <defs>
                {/* Gold Gradient for Mandala Accents */}
                <linearGradient id="mandalaGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Rich Terracotta Red for Mandala Petals */}
                <linearGradient id="mandalaPetalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#9f1239" />
                  <stop offset="50%" stopColor="#881337" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>

                {/* Soft Radial Glow behind the wheel */}
                <radialGradient id="wheelCenterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="30%" stopColor="#7e22ce" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#4c1d95" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Soft purple radial aura */}
              <circle cx="250" cy="250" r="225" fill="url(#wheelCenterAura)" />

              {/* Subtle circular track passing behind the Diyas */}
              <circle
                cx="250"
                cy="250"
                r="147.5"
                fill="none"
                stroke="url(#mandalaGold)"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.35"
              />

              {/* Decorative Mandala Petals hugging the center ring */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                const r1 = 100;
                const r2 = 126;
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
                    fill="url(#mandalaPetalGrad)"
                    stroke="url(#mandalaGold)"
                    strokeWidth="0.8"
                    opacity="0.8"
                  />
                );
              })}

              {/* Inner golden ring right around the center disc */}
              <circle
                cx="250"
                cy="250"
                r="102"
                fill="none"
                stroke="url(#mandalaGold)"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>

            {/* ================= 8 DIYAS IN 100% PERFECT CIRCULAR ALIGNMENT ================= */}
            {DIYA_ANGLES.map((theta, idx) => {
              // Convert clockwise angle from 12 o'clock to standard radians
              const rad = (theta * Math.PI) / 180;
              // Precise polar coordinates from the center (50%, 50%)
              const x = 50 + R_DIYA * Math.sin(rad);
              const y = 50 - R_DIYA * Math.cos(rad);

              return (
                <div
                  key={`diya_${idx}`}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    // Perfectly centered on (x, y) and rotated so flame points straight outward
                    transform: `translate(-50%, -50%) rotate(${theta}deg)`,
                  }}
                >
                  {/* Diya box sized proportionally for mobile & desktop */}
                  <div className="relative w-12 h-16 sm:w-16 sm:h-22 flex flex-col items-center justify-center">
                    {/* Soft warm flame aura */}
                    <div className="absolute top-1 w-6 h-6 sm:w-8 sm:h-8 bg-amber-400/35 rounded-full blur-md animate-pulse pointer-events-none" />

                    {/* Symmetrical Traditional Indian Diya Vector (Center of mass at 50, 60) */}
                    <svg
                      viewBox="0 0 100 120"
                      className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Terracotta Clay Gradient */}
                        <linearGradient id={`clayGrad_${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#a21caf" />
                          <stop offset="25%" stopColor="#9f1239" />
                          <stop offset="65%" stopColor="#701a75" />
                          <stop offset="100%" stopColor="#4c0519" />
                        </linearGradient>

                        {/* Gold Filigree Rim */}
                        <linearGradient id={`goldRim_${idx}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>

                        {/* Radiant Flame Gradient */}
                        <radialGradient id={`flameGrad_${idx}`} cx="50%" cy="65%" r="55%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="35%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </radialGradient>
                      </defs>

                      {/* --- FLAME --- */}
                      <path
                        d="M50 8 C42 20 34 28 34 38 C34 48 42 52 50 52 C58 52 66 48 66 38 C66 28 58 20 50 8 Z"
                        fill={`url(#flameGrad_${idx})`}
                        className="animate-pulse"
                      />
                      <path
                        d="M50 16 C45 24 40 30 40 38 C40 44 44 48 50 48 C56 48 60 44 60 38 C60 30 55 24 50 16 Z"
                        fill="#ffffff"
                        opacity="0.95"
                      />

                      {/* --- DIYA BODY (TRADITIONAL CLAY LAMP) --- */}
                      {/* Left Scalloped Ear / Wing */}
                      <path
                        d="M32 52 C20 48 12 58 16 70 C20 80 28 84 36 88"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M32 52 C20 48 12 58 16 70 C20 80 28 84 36 88 C28 80 24 70 28 62 C30 56 34 54 32 52 Z"
                        fill="#881337"
                        opacity="0.9"
                      />

                      {/* Right Scalloped Ear / Wing */}
                      <path
                        d="M68 52 C80 48 88 58 84 70 C80 80 72 84 64 88"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M68 52 C80 48 88 58 84 70 C80 80 72 84 64 88 C72 80 76 70 72 62 C70 56 66 54 68 52 Z"
                        fill="#881337"
                        opacity="0.9"
                      />

                      {/* Main Rounded Clay Bowl */}
                      <path
                        d="M26 52 C18 66 24 92 40 106 C44 110 56 110 60 106 C76 92 82 66 74 52 C66 58 34 58 26 52 Z"
                        fill={`url(#clayGrad_${idx})`}
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2.2"
                      />

                      {/* Gold Lip Rim */}
                      <path
                        d="M26 52 Q50 60 74 52"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Inner Dark Oil Well */}
                      <path
                        d="M30 58 C26 70 32 86 44 96 C47 98 53 98 56 96 C68 86 74 70 70 58 C62 64 38 64 30 58 Z"
                        fill="#300718"
                      />

                      {/* Golden Center Wick */}
                      <path
                        d="M50 48 L50 86"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Base Gold Dot */}
                      <circle cx="50" cy="102" r="2.5" fill="#fef08a" />
                    </svg>
                  </div>
                </div>
              );
            })}

            {/* ================= 8 SOCIAL MEDIA BADGES IN 100% EQUAL SPACING ================= */}
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
                    // Perfectly centered on (x, y) - no double translate!
                    transform: "translate(-50%, -50%)",
                  }}
                  title={ch.label}
                >
                  {/* Counter-rotating badge keeps icon upright as the circle spins */}
                  <div className="animate-icon-counter flex items-center justify-center">
                    {/* Consistent white circle size across all 8 badges */}
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.6)] flex items-center justify-center border-2 border-amber-300 hover:scale-125 transition-transform duration-200">
                      <ch.icon size={14} className="sm:w-4 sm:h-4" style={{ color: ch.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STEADY CENTER DIWALI GREETING (UNCHANGED & PRESERVED) ================= */}
          <div className="relative z-30 w-[130px] h-[130px] sm:w-[190px] sm:h-[190px] rounded-full bg-gradient-to-br from-[#2f1354] via-[#1f0b3a] to-[#120524] border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.55),inset_0_0_25px_rgba(168,85,247,0.45)] flex flex-col items-center justify-center text-center p-3 sm:p-5">
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
