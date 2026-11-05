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

// 8 Marketing Channels arranged in clockwise order matching the reference design
// Placed in the exact midpoint V-notch (22.5 deg offset) between each Diya
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

  // Exact mathematical radial distances for a seamless floral ring
  // R_DIYA: places the Diya so its base touches the center mandala ring and flame points outward
  const R_DIYA = 30.5;
  // R_ICON: places the social badge in the V-notch between adjacent Diya flame spouts
  const R_ICON = 34.5;

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

      {/* Background ambient lighting matching the reel's deep purple spotlight */}
      <div className="absolute w-[520px] h-[520px] bg-purple-700/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[360px] h-[360px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

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
          
          {/* ROTATING WHEEL (Contains Mandala Lace + 8 Authentic 3D Diyas + 8 Social Badges) */}
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

              {/* Mandala Lace Tier 3: Pointed Floral Petals */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                const r1 = 104;
                const r2 = 138;
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

              {/* Mandala Lace Tier 2: Scalloped Ring */}
              {[...Array(32)].map((_, i) => {
                const angle = (i * Math.PI) / 16;
                const r = 114;
                const cx = 250 + r * Math.cos(angle);
                const cy = 250 + r * Math.sin(angle);
                return (
                  <circle
                    key={`lace_dot_${i}`}
                    cx={cx}
                    cy={cy}
                    r="2"
                    fill="#fef08a"
                    opacity="0.75"
                  />
                );
              })}

              {/* Mandala Lace Tier 1: Inner Solid Crimson Ring with Gold Trim */}
              <circle
                cx="250"
                cy="250"
                r="106"
                fill="none"
                stroke="url(#mandalaCrimsonGrad)"
                strokeWidth="6"
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

            {/* ================= 8 HIGH-FIDELITY 3D TERRACOTTA DIYAS ================= */}
            {/* Sits snugly around the center circle like radiant lotus petals */}
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
                  <div className="relative w-14 h-20 sm:w-20 sm:h-28 flex flex-col items-center justify-center">
                    
                    {/* Dramatic shooting light ray pointing outward from flame tip */}
                    <div className="absolute -top-3 w-1.5 h-8 sm:h-12 bg-gradient-to-t from-amber-300 via-white to-transparent blur-[0.8px] animate-pulse pointer-events-none" />

                    {/* Soft warm flame aura */}
                    <div className="absolute top-1 w-8 h-8 sm:w-11 sm:h-11 bg-amber-400/35 rounded-full blur-md animate-pulse pointer-events-none" />

                    {/* Authentic 3D Terracotta Diya Vector Artwork matching reference image */}
                    <svg
                      viewBox="0 0 120 150"
                      className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Deep Terracotta Clay Gradient */}
                        <linearGradient id={`diyaClayDark_${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#9f1239" />
                          <stop offset="30%" stopColor="#881337" />
                          <stop offset="70%" stopColor="#580f24" />
                          <stop offset="100%" stopColor="#2c0410" />
                        </linearGradient>

                        {/* Clay Surface Radial Highlight */}
                        <radialGradient id={`diyaClayRelief_${idx}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.8" />
                          <stop offset="60%" stopColor="#881337" />
                          <stop offset="100%" stopColor="#4c0519" />
                        </radialGradient>

                        {/* Gleaming Carved Gold Filigree Border */}
                        <linearGradient id={`diyaGoldBorder_${idx}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="35%" stopColor="#fbbf24" />
                          <stop offset="70%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>

                        {/* Deep Glossy Oil Reservoir */}
                        <radialGradient id={`diyaOilWell_${idx}`} cx="50%" cy="40%" r="55%">
                          <stop offset="0%" stopColor="#650a22" />
                          <stop offset="50%" stopColor="#3d0515" />
                          <stop offset="100%" stopColor="#180108" />
                        </radialGradient>

                        {/* Radiant Flame Gradient */}
                        <radialGradient id={`diyaFlameGrad_${idx}`} cx="50%" cy="65%" r="55%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="30%" stopColor="#fef08a" />
                          <stop offset="65%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </radialGradient>
                      </defs>

                      {/* --- FLAME --- */}
                      {/* Outer Flickering Flame */}
                      <path
                        d="M60 14 C50 26 42 36 42 47 C42 58 50 63 60 63 C70 63 78 58 78 47 C78 36 70 26 60 14 Z"
                        fill={`url(#diyaFlameGrad_${idx})`}
                        className="animate-pulse"
                      />

                      {/* Pure White Flame Core */}
                      <path
                        d="M60 22 C54 30 48 38 48 47 C48 54 53 58 60 58 C67 58 72 54 72 47 C72 38 66 30 60 22 Z"
                        fill="#ffffff"
                        opacity="0.96"
                      />

                      {/* --- CARVED ORNATE WINGS / EARS (LEFT & RIGHT) --- */}
                      {/* Left Scalloped Carved Wing */}
                      <path
                        d="M36 58 C22 52 14 62 16 76 C18 88 28 94 38 98 C26 90 22 78 28 68 C32 62 36 60 36 58 Z"
                        fill={`url(#diyaClayDark_${idx})`}
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="1.8"
                      />
                      <path
                        d="M38 96 C26 102 24 114 34 122 C40 126 48 128 54 130"
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                      {/* Right Scalloped Carved Wing */}
                      <path
                        d="M84 58 C98 52 106 62 104 76 C102 88 92 94 82 98 C94 90 98 78 92 68 C88 62 84 60 84 58 Z"
                        fill={`url(#diyaClayDark_${idx})`}
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="1.8"
                      />
                      <path
                        d="M82 96 C94 102 96 114 86 122 C80 126 72 128 66 130"
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                      {/* --- MAIN TERRACOTTA BOWL --- */}
                      {/* Sculpted Outer Clay Body */}
                      <path
                        d="M30 60 C18 78 24 112 44 132 C50 137 70 137 76 132 C96 112 102 78 90 60 C78 68 42 68 30 60 Z"
                        fill={`url(#diyaClayRelief_${idx})`}
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="2.4"
                      />

                      {/* Golden Filigree Rim along the Lip */}
                      <path
                        d="M30 60 Q60 70 90 60"
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="2.8"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Concave Oil Reservoir with Deep Shadow */}
                      <path
                        d="M36 66 C26 82 32 106 48 124 C52 128 68 128 72 124 C88 106 94 82 84 66 C74 72 46 72 36 66 Z"
                        fill={`url(#diyaOilWell_${idx})`}
                      />

                      {/* Glossy Oil Surface Reflection */}
                      <path
                        d="M44 76 Q60 82 76 76"
                        stroke="#fef08a"
                        strokeWidth="1"
                        opacity="0.35"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Slender Curved Golden Wick */}
                      <path
                        d="M60 52 Q57 74 63 94 T59 116"
                        stroke={`url(#diyaGoldBorder_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Inward-Pointing 3-Lobed Lotus Finial at Base */}
                      <path
                        d="M52 134 C50 142 56 146 60 146 C64 146 70 142 68 134 Z"
                        fill="#fef08a"
                        stroke="#b45309"
                        strokeWidth="0.8"
                      />
                      <circle cx="53" cy="138" r="2" fill="#fbbf24" />
                      <circle cx="67" cy="138" r="2" fill="#fbbf24" />
                    </svg>
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
                    {/* Clean white circle with luxury drop shadow matching reference reel */}
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
