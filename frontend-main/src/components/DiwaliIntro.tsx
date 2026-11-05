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

// 8 Social Media & Digital Marketing Channels positioned in the V-notches between Diyas
const SOCIAL_CHANNELS = [
  { icon: Facebook, label: "Facebook", angle: 292.5, color: "#1877F2" },
  { icon: Instagram, label: "Instagram", angle: 337.5, color: "#E4405F" },
  { icon: Linkedin, label: "LinkedIn", angle: 22.5, color: "#0A66C2" },
  { icon: Twitter, label: "X / Twitter", angle: 67.5, color: "#111827" },
  { icon: Globe, label: "Website & SEO", angle: 112.5, color: "#059669" },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#140628]/92 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
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
          animation: diwaliWheelSpin 28s linear infinite;
        }
        .animate-icon-counter {
          animation: iconCounterSpin 28s linear infinite;
        }
      `}</style>

      {/* Background ambient festival glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[340px] h-[340px] bg-amber-500/18 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[560px] flex flex-col items-center justify-center py-2 sm:py-4">
        {/* Close Button in top right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-0 right-0 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer z-50 shadow-lg"
          aria-label="Close Greeting"
        >
          <X size={18} />
        </button>

        {/* ================= AUTHENTIC DIWALI MANDALA WHEEL ================= */}
        {/* Clean, high-fidelity circular composition matching the reference reel */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] aspect-square flex items-center justify-center">
          
          {/* ROTATING WHEEL (Contains Mandala Lace + 8 Diyas + 8 Social Badges) */}
          <div className="absolute inset-0 w-full h-full animate-diwali-wheel pointer-events-none">
            
            {/* Traditional Indian Mandala Lace Ring (Hugging the center disc) */}
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

                {/* Soft Radial Glow behind the whole wheel */}
                <radialGradient id="wheelCenterAura" cx="50%" cy="50%" r="50%">
                  <stop offset="40%" stopColor="#7e22ce" stopOpacity="0.35" />
                  <stop offset="75%" stopColor="#4c1d95" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Soft purple radial aura */}
              <circle cx="250" cy="250" r="230" fill="url(#wheelCenterAura)" />

              {/* Outer delicate ring tying the composition together */}
              <circle
                cx="250"
                cy="250"
                r="192"
                fill="none"
                stroke="url(#mandalaGold)"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                opacity="0.45"
              />

              {/* Decorative Mandala Petals hugging the center ring */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                const r1 = 105;
                const r2 = 132;
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
                    opacity="0.85"
                  />
                );
              })}

              {/* Inner golden beaded circle */}
              <circle
                cx="250"
                cy="250"
                r="106"
                fill="none"
                stroke="url(#mandalaGold)"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Golden bead accents around inner ring */}
              {[...Array(24)].map((_, i) => {
                const angle = (i * Math.PI) / 12;
                return (
                  <circle
                    key={`bead_${i}`}
                    cx={250 + 106 * Math.cos(angle)}
                    cy={250 + 106 * Math.sin(angle)}
                    r="2.2"
                    fill="#fef08a"
                    stroke="#d97706"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>

            {/* ================= 8 TRADITIONAL LOTUS-PETAL DIYAS ================= */}
            {/* Sits snugly around the center circle like radiant flower petals */}
            {DIYA_ANGLES.map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              // Radius 32% places the rounded base of the Diya right against the center mandala,
              // while the flame tip reaches outward to 43%, creating a perfect lotus circle!
              const radiusPercent = 32;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              // Flame points radially outwards
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
                  {/* Diya sized to form a complete floral garland */}
                  <div className="relative w-14 h-20 sm:w-20 sm:h-28 flex flex-col items-center">
                    {/* Soft warm flame aura */}
                    <div className="absolute top-1 w-7 h-7 sm:w-10 sm:h-10 bg-amber-400/35 rounded-full blur-md animate-pulse" />

                    {/* High-Fidelity Traditional Indian Diya Vector Artwork */}
                    <svg
                      viewBox="0 0 100 120"
                      className="w-full h-full drop-shadow-[0_6px_20px_rgba(0,0,0,0.75)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Authentic Terracotta Clay Gradient */}
                        <linearGradient id={`clayGrad_${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#a21caf" />
                          <stop offset="20%" stopColor="#9f1239" />
                          <stop offset="60%" stopColor="#701a75" />
                          <stop offset="100%" stopColor="#4c0519" />
                        </linearGradient>

                        {/* Gleaming Gold Filigree Border */}
                        <linearGradient id={`goldRim_${idx}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#fbbf24" />
                          <stop offset="80%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
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
                      {/* Flickering Outer Flame */}
                      <path
                        d="M50 4 C43 15 35 24 35 34 C35 44 42 48 50 48 C58 48 65 44 65 34 C65 24 57 15 50 4 Z"
                        fill={`url(#flameGrad_${idx})`}
                        className="animate-pulse"
                      />

                      {/* Pure White Flame Core */}
                      <path
                        d="M50 12 C46 19 41 26 41 34 C41 40 45 44 50 44 C55 44 59 40 59 34 C59 26 54 19 50 12 Z"
                        fill="#ffffff"
                        opacity="0.95"
                      />

                      {/* --- DIYA BODY (TRADITIONAL CLAY POT) --- */}
                      {/* Left Ornate Scalloped Ear / Wing */}
                      <path
                        d="M32 48 C20 44 10 54 14 66 C18 76 26 82 36 86"
                        fill="none"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M32 48 C20 44 10 54 14 66 C18 76 26 82 36 86 C28 78 24 68 28 60 C30 54 34 50 32 48 Z"
                        fill="#881337"
                        opacity="0.9"
                      />

                      {/* Right Ornate Scalloped Ear / Wing */}
                      <path
                        d="M68 48 C80 44 90 54 86 66 C82 76 74 82 64 86"
                        fill="none"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M68 48 C80 44 90 54 86 66 C82 76 74 82 64 86 C72 78 76 68 72 60 C70 54 66 50 68 48 Z"
                        fill="#881337"
                        opacity="0.9"
                      />

                      {/* Main Rounded Clay Bowl (Proper Rounded Bottom Base) */}
                      <path
                        d="M26 50 C18 64 24 88 40 102 C44 105 56 105 60 102 C76 88 82 64 74 50 C66 56 34 56 26 50 Z"
                        fill={`url(#clayGrad_${idx})`}
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2.2"
                      />

                      {/* Decorative Gold Rim along the Bowl Lip */}
                      <path
                        d="M26 50 Q50 58 74 50"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Inner Dark Oil Well */}
                      <path
                        d="M30 55 C26 66 32 82 44 92 C47 94 53 94 56 92 C68 82 74 66 70 55 C62 60 38 60 30 55 Z"
                        fill="#300718"
                      />

                      {/* Golden Central Cotton Wick Line */}
                      <path
                        d="M50 44 L50 82"
                        stroke={`url(#goldRim_${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Base Decorative Golden Floral Accent */}
                      <circle cx="50" cy="98" r="2.5" fill="#fef08a" />
                    </svg>
                  </div>
                </div>
              );
            })}

            {/* ================= 8 SOCIAL MEDIA BADGES IN THE NOTCHES ================= */}
            {/* Positioned cleanly in the V-notches between adjacent Diyas */}
            {SOCIAL_CHANNELS.map((ch, idx) => {
              const rad = (ch.angle * Math.PI) / 180;
              // Radius 35% places the badge right into the open space between the tips of adjacent Diyas
              const radiusPercent = 35;
              const left = 50 + radiusPercent * Math.cos(rad);
              const top = 50 + radiusPercent * Math.sin(rad);

              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={ch.label}
                >
                  {/* Counter-rotating badge keeps icon upright as the wheel spins */}
                  <div className="animate-icon-counter">
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.65)] flex items-center justify-center border-2 border-amber-300 hover:scale-125 transition-transform duration-200">
                      <ch.icon size={15} className="sm:w-5 sm:h-5" style={{ color: ch.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STEADY CENTER GREETING (Crisp, High-Contrast & Readable) ================= */}
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
