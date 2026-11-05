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

// 8 Social Media / Digital Marketing Channels placed between the Diyas
const SOCIAL_CHANNELS = [
  { icon: Facebook, label: "Facebook", angle: 292.5 },
  { icon: Instagram, label: "Instagram", angle: 337.5 },
  { icon: Linkedin, label: "LinkedIn", angle: 22.5 },
  { icon: Twitter, label: "X / Twitter", angle: 67.5 },
  { icon: Globe, label: "SEO & Web", angle: 112.5 },
  { icon: Sparkles, label: "AI Marketing", angle: 157.5 },
  { icon: Youtube, label: "YouTube", angle: 202.5 },
  { icon: MessageCircle, label: "WhatsApp", angle: 247.5 },
];

// 8 Diyas arranged in perfect circular angles (every 45 degrees)
const DIYA_ANGLES = [270, 315, 0, 45, 90, 135, 180, 225];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-dismiss after 9 seconds so user can freely interact with the site
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 9000);
    return () => clearTimeout(timer);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#120527]/90 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Custom Keyframes for Smooth Spinning Wheel and Counter-Rotation */}
      <style>{`
        @keyframes diwaliWheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes iconCounterSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        .animate-diwali-wheel {
          animation: diwaliWheelSpin 28s linear infinite;
        }
        .animate-icon-counter {
          animation: iconCounterSpin 28s linear infinite;
        }
      `}</style>

      {/* Background ambient glow circles */}
      <div className="absolute w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-amber-500/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[540px] flex flex-col items-center justify-center py-4">
        {/* Close Button in top right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-0 right-0 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer z-40 shadow-lg"
          aria-label="Close Greeting"
        >
          <X size={18} />
        </button>

        {/* ================= PERFECT CIRCULAR ROTATING WHEEL ================= */}
        <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] aspect-square flex items-center justify-center">
          {/* SPINNING ROTATING CONTAINER (Ghumta hua circle) */}
          <div className="absolute inset-0 w-full h-full animate-diwali-wheel pointer-events-none">
            {/* Concentric Decorative Mandala Rings */}
            <svg viewBox="0 0 460 460" className="absolute inset-0 w-full h-full opacity-40">
              <circle cx="230" cy="230" r="185" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="230" cy="230" r="150" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5" />
              <circle cx="230" cy="230" r="120" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5 5" />
              {/* Radial Spokes */}
              {[...Array(16)].map((_, i) => (
                <line
                  key={i}
                  x1="230"
                  y1="230"
                  x2={230 + 185 * Math.cos((i * Math.PI) / 8)}
                  y2={230 + 185 * Math.sin((i * Math.PI) / 8)}
                  stroke="#a855f7"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
              ))}
            </svg>

            {/* ================= 8 DIYAS IN PERFECT ROUND CIRCLE ================= */}
            {DIYA_ANGLES.map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              // Radius percentage for perfect round circle
              const radiusPercent = 38.5;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              // Rotate Diya so its flame points straight outward along the radius
              const rotationDeg = angle + 90;

              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
                  }}
                >
                  {/* Organic Lotus-Petal Diya matching the reel */}
                  <div className="relative w-14 h-16 sm:w-18 sm:h-22 flex flex-col items-center">
                    {/* Radiating Light Beam shooting outward */}
                    <div className="absolute -top-3 w-1.5 h-7 bg-gradient-to-t from-amber-300 via-amber-100 to-transparent blur-[1px] animate-pulse" />

                    {/* Flickering Flame Aura */}
                    <div className="absolute -top-1 w-6 h-6 bg-amber-400/40 rounded-full blur-md animate-pulse" />

                    {/* Traditional Clay Diya SVG */}
                    <svg
                      viewBox="0 0 80 90"
                      className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Magenta / Deep Wine Terracotta Gradient */}
                        <linearGradient id={`diyaClayGrad_${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7a1849" />
                          <stop offset="50%" stopColor="#541132" />
                          <stop offset="100%" stopColor="#35081e" />
                        </linearGradient>

                        {/* Gold Filigree Border */}
                        <linearGradient id={`diyaGoldRim_${idx}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="50%" stopColor="#fef08a" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>

                        {/* Radiant Flame Gradient */}
                        <radialGradient id={`diyaFlame_${idx}`} cx="50%" cy="60%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="35%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </radialGradient>
                      </defs>

                      {/* Flickering Flame */}
                      <path
                        d="M40 2 C36 12 30 18 30 26 C30 34 35 38 40 38 C45 38 50 34 50 26 C50 18 44 12 40 2 Z"
                        fill={`url(#diyaFlame_${idx})`}
                        className="animate-pulse"
                      />

                      {/* Core White Flame */}
                      <path
                        d="M40 10 C38 16 35 20 35 26 C35 30 37 34 40 34 C43 34 45 30 45 26 C45 20 42 16 40 10 Z"
                        fill="#ffffff"
                        opacity="0.95"
                      />

                      {/* Lotus Petal Outer Clay Wings */}
                      <path
                        d="M14 36 C10 44 16 52 24 50 C20 58 28 66 40 76 C52 66 60 58 56 50 C64 52 70 44 66 36 C60 44 50 40 40 34 C30 40 20 44 14 36 Z"
                        fill="#831b4e"
                        stroke={`url(#diyaGoldRim_${idx})`}
                        strokeWidth="1.3"
                      />

                      {/* Main Diya Bowl Body */}
                      <path
                        d="M22 36 C16 46 22 62 40 74 C58 62 64 46 58 36 C50 42 30 42 22 36 Z"
                        fill={`url(#diyaClayGrad_${idx})`}
                        stroke={`url(#diyaGoldRim_${idx})`}
                        strokeWidth="1.6"
                      />

                      {/* Inner Oil Well */}
                      <path
                        d="M26 40 C22 48 26 58 40 66 C54 58 58 48 54 40 C48 44 32 44 26 40 Z"
                        fill="#33071c"
                      />

                      {/* Golden Center Wick Line */}
                      <path
                        d="M40 32 Q40 48 40 62"
                        stroke={`url(#diyaGoldRim_${idx})`}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}

            {/* ================= 8 SOCIAL MEDIA ICONS (Rotating in orbit) ================= */}
            {SOCIAL_CHANNELS.map((ch, idx) => {
              const rad = (ch.angle * Math.PI) / 180;
              // Radius for social badges
              const radiusPercent = 26.5;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={ch.label}
                >
                  {/* Counter-rotating badge so the social icon stays right-side up while orbiting */}
                  <div className="animate-icon-counter">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#200c3b] shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center border border-white/80 hover:scale-125 transition-transform duration-200">
                      <ch.icon size={13} className="sm:w-4 sm:h-4 text-[#200c3b]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STEADY CENTER GREETING (Stays upright & stable) ================= */}
          <div className="relative z-30 w-[140px] h-[140px] sm:w-[185px] sm:h-[185px] rounded-full bg-gradient-to-br from-[#2f1354] via-[#1f0b3a] to-[#120524] border-2 border-amber-400/70 shadow-[0_0_40px_rgba(245,158,11,0.4),inset_0_0_25px_rgba(168,85,247,0.35)] flex flex-col items-center justify-center text-center p-3 sm:p-4">
            <span className="text-amber-200/90 text-xs sm:text-sm font-medium tracking-wide">
              Wishing you a
            </span>

            <h2
              className="text-white text-xl sm:text-3xl font-extrabold tracking-wider uppercase leading-tight my-0.5 sm:my-1"
              style={{
                textShadow: "0 0 18px rgba(251,191,36,0.65)",
              }}
            >
              DIWALI
            </h2>

            <p className="text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wide">
              RizeWorld Institute
            </p>

            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-400">
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
