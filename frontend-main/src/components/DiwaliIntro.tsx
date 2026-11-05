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

// 8 Social Media / Marketing Channels nested directly in the circle between Diyas
const SOCIAL_CHANNELS = [
  { icon: Facebook, label: "Facebook", angle: 292.5, color: "#1877F2" },
  { icon: Instagram, label: "Instagram", angle: 337.5, color: "#E4405F" },
  { icon: Linkedin, label: "LinkedIn", angle: 22.5, color: "#0A66C2" },
  { icon: Twitter, label: "X / Twitter", angle: 67.5, color: "#000000" },
  { icon: Globe, label: "SEO & Web", angle: 112.5, color: "#059669" },
  { icon: Sparkles, label: "AI Marketing", angle: 157.5, color: "#7C3AED" },
  { icon: Youtube, label: "YouTube", angle: 202.5, color: "#FF0000" },
  { icon: MessageCircle, label: "WhatsApp", angle: 247.5, color: "#25D366" },
];

// 8 Diyas arranged in circular angles (every 45 degrees)
const DIYA_ANGLES = [270, 315, 0, 45, 90, 135, 180, 225];

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#0d031c]/90 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Custom Keyframes for Smooth Spinning Circular Wheel and Counter-Rotation */}
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
          animation: diwaliWheelSpin 26s linear infinite;
        }
        .animate-icon-counter {
          animation: iconCounterSpin 26s linear infinite;
        }
      `}</style>

      {/* Background ambient glow circles */}
      <div className="absolute w-[480px] h-[480px] bg-purple-700/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card Container */}
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

        {/* ================= COMPLETE CIRCULAR ROTATING WHEEL ================= */}
        {/* The entire wheel has a clear, beautiful circular outer boundary that fully encloses all Diyas */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] aspect-square flex items-center justify-center">
          
          {/* SPINNING ROTATING CONTAINER (Ghumta hua circle - mandala + diyas + social icons) */}
          <div className="absolute inset-0 w-full h-full animate-diwali-wheel pointer-events-none">
            
            {/* Concentric Decorative Mandala Rings enclosing the Diyas inside */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
              {/* Outer decorative halo ring that encloses all Diyas */}
              <circle
                cx="250"
                cy="250"
                r="232"
                fill="none"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.35"
              />
              <circle
                cx="250"
                cy="250"
                r="220"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.75"
              />
              <circle
                cx="250"
                cy="250"
                r="212"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.2"
                opacity="0.4"
              />

              {/* Outer decorative golden dots along the enclosing perimeter */}
              {[...Array(32)].map((_, i) => (
                <circle
                  key={`dot_${i}`}
                  cx={250 + 220 * Math.cos((i * Math.PI) / 16)}
                  cy={250 + 220 * Math.sin((i * Math.PI) / 16)}
                  r="2.5"
                  fill="#fef08a"
                  opacity="0.8"
                />
              ))}

              {/* Mid circular track passing directly behind the Diyas */}
              <circle
                cx="250"
                cy="250"
                r="155"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />

              {/* Inner circle right under Diya bases */}
              <circle
                cx="250"
                cy="250"
                r="112"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                opacity="0.65"
              />

              {/* Inner decorative mandala scallop ring */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                return (
                  <path
                    key={`scallop_${i}`}
                    d={`M ${250 + 104 * Math.cos(angle)} ${250 + 104 * Math.sin(angle)} Q ${250 + 118 * Math.cos(angle + 0.13)} ${250 + 118 * Math.sin(angle + 0.13)} ${250 + 104 * Math.cos(angle + 0.26)} ${250 + 104 * Math.sin(angle + 0.26)}`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.2"
                    opacity="0.55"
                  />
                );
              })}

              {/* Radial decorative spoke rays connecting the inner & outer circles */}
              {[...Array(16)].map((_, i) => (
                <line
                  key={`ray_${i}`}
                  x1={250 + 112 * Math.cos((i * Math.PI) / 8)}
                  y1={250 + 112 * Math.sin((i * Math.PI) / 8)}
                  x2={250 + 220 * Math.cos((i * Math.PI) / 8)}
                  y2={250 + 220 * Math.sin((i * Math.PI) / 8)}
                  stroke="#a855f7"
                  strokeWidth="0.8"
                  strokeDasharray="3 4"
                  opacity="0.35"
                />
              ))}
            </svg>

            {/* ================= 8 DIYAS RESTING FIRMLY INSIDE THE CIRCLE ================= */}
            {DIYA_ANGLES.map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              // Radius percentage: 31% places the Diya body firmly ON the circular mandala track,
              // with the outer circle at 44% fully enclosing both Diya and its flame!
              const radiusPercent = 31;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              // Rotate Diya so its flame points straight outward along the circle's radius
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
                  {/* Diya sized to sit comfortably between inner and outer circular boundaries */}
                  <div className="relative w-11 h-14 sm:w-16 sm:h-20 flex flex-col items-center">
                    {/* Radiating Light Beam shooting outward towards the circular perimeter */}
                    <div className="absolute -top-3 w-1.5 h-6 sm:h-8 bg-gradient-to-t from-amber-300 via-amber-100 to-transparent blur-[1px] animate-pulse" />

                    {/* Flickering Flame Aura */}
                    <div className="absolute -top-1 w-6 h-6 sm:w-8 sm:h-8 bg-amber-400/40 rounded-full blur-md animate-pulse" />

                    {/* Traditional Clay Diya SVG matching the reference reel */}
                    <svg
                      viewBox="0 0 80 90"
                      className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Deep Terracotta / Royal Wine Clay Gradient */}
                        <linearGradient id={`diyaClayGrad_${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#831b4e" />
                          <stop offset="50%" stopColor="#581134" />
                          <stop offset="100%" stopColor="#30071c" />
                        </linearGradient>

                        {/* Gold Filigree Rim */}
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

                      {/* Flickering Outer Flame */}
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
                        fill="#2a0618"
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

            {/* ================= 8 SOCIAL MEDIA BADGES IN CIRCLE BETWEEN DIYAS ================= */}
            {SOCIAL_CHANNELS.map((ch, idx) => {
              const rad = (ch.angle * Math.PI) / 180;
              // Sits on the exact same circular track as the Diyas, tucked neatly in the space between each pair
              const radiusPercent = 31.5;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={ch.label}
                >
                  {/* Counter-rotating badge keeps icon upright as the circle spins */}
                  <div className="animate-icon-counter">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.55)] flex items-center justify-center border-2 border-amber-300 hover:scale-125 transition-transform duration-200">
                      <ch.icon size={13} className="sm:w-4 sm:h-4 text-[#1e0735]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STEADY CENTER GREETING (Stays upright, clean & stable) ================= */}
          <div className="relative z-30 w-[130px] h-[130px] sm:w-[172px] sm:h-[172px] rounded-full bg-gradient-to-br from-[#2f1354] via-[#1a0833] to-[#0f031e] border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5),inset_0_0_22px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center text-center p-2.5 sm:p-4">
            <span className="text-amber-200/95 text-[11px] sm:text-sm font-medium tracking-wide">
              Wishing you a
            </span>

            <h2
              className="text-white text-xl sm:text-3xl font-black tracking-wider uppercase leading-tight my-0.5 sm:my-1"
              style={{
                textShadow: "0 0 18px rgba(251,191,36,0.7)",
              }}
            >
              DIWALI
            </h2>

            <p className="text-amber-300 text-[10px] sm:text-xs font-bold tracking-wide">
              RizeWorld Institute
            </p>

            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 text-[11px] sm:text-xs text-amber-400">
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
