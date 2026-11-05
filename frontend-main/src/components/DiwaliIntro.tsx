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

// 8 Diyas arranged in cardinal & diagonal directions
const DIYA_ANGLES = [270, 315, 0, 45, 90, 135, 180, 225];

export default function DiwaliIntro() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-dismiss after 8 seconds so user can freely interact with the site
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#14072b]/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Background radial ambient lights */}
      <div className="absolute w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-[540px] flex flex-col items-center justify-center py-6">
        {/* Close Button in top corner */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-0 sm:right-0 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer z-30 shadow-lg"
          aria-label="Close Greeting"
        >
          <X size={18} />
        </button>

        {/* ================= CIRCULAR MANDALA & 8 DIYAS CANVAS ================= */}
        <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">
          {/* Outer Decorative Mandala Ring (Gentle Slow Rotation) */}
          <div
            className="absolute inset-4 sm:inset-6 rounded-full border border-purple-400/25 pointer-events-none animate-spin"
            style={{ animationDuration: "90s" }}
          >
            {/* Mandala Petals / Scallop pattern using repeating SVG */}
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-35">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="6 4" />
              {/* Radial spokes */}
              {[...Array(16)].map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={200 + 175 * Math.cos((i * Math.PI) / 8)}
                  y2={200 + 175 * Math.sin((i * Math.PI) / 8)}
                  stroke="#a855f7"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
              ))}
            </svg>
          </div>

          {/* Inner Mandala Decorative Ring */}
          <div
            className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border-2 border-dashed border-amber-400/30 pointer-events-none animate-spin"
            style={{ animationDuration: "45s", animationDirection: "reverse" }}
          />

          {/* ================= 8 SOCIAL MEDIA CHANNELS ================= */}
          {SOCIAL_CHANNELS.map((ch, idx) => {
            const rad = (ch.angle * Math.PI) / 180;
            // Radius for social icon circles
            const radiusPercent = 38; // Percentage from center
            const left = 50 + radiusPercent * Math.cos(rad);
            const top = 50 + radiusPercent * Math.sin(rad);

            return (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                style={{ left: `${left}%`, top: `${top}%` }}
                title={ch.label}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2a124e] shadow-[0_4px_14px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-125 transition-transform duration-300 border border-white/60">
                  <ch.icon size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>
            );
          })}

          {/* ================= 8 ORNATE GLOWING DIYAS ================= */}
          {DIYA_ANGLES.map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            // Radius where Diyas are anchored
            const radiusPercent = 40;
            const left = 50 + radiusPercent * Math.cos(rad);
            const top = 50 + radiusPercent * Math.sin(rad);

            // Rotate diya so flame points directly outwards from center
            const rotationDeg = angle + 90;

            return (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
                }}
              >
                {/* Single Traditional Terracotta & Gold Diya SVG */}
                <div className="relative w-14 h-16 sm:w-20 sm:h-22 flex flex-col items-center">
                  {/* Glowing Flame Beam (Shoots outward) */}
                  <div className="absolute -top-3 w-1.5 h-6 bg-gradient-to-t from-amber-300 via-amber-100 to-transparent blur-[1px] animate-pulse" />

                  {/* Flickering Flame Aura */}
                  <div className="absolute -top-1 w-6 h-6 bg-amber-400/40 rounded-full blur-md animate-pulse" />

                  {/* Diya SVG */}
                  <svg
                    viewBox="0 0 80 90"
                    className="w-full h-full drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Terracotta / Magenta Clay Gradient matching the image */}
                      <linearGradient id={`diyaClayGrad_${idx}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7a1849" />
                        <stop offset="50%" stopColor="#541132" />
                        <stop offset="100%" stopColor="#35081e" />
                      </linearGradient>

                      {/* Golden Filigree Rim Gradient */}
                      <linearGradient id={`diyaGoldRim_${idx}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>

                      {/* Flame Gradient */}
                      <radialGradient id={`diyaFlame_${idx}`} cx="50%" cy="60%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="35%" stopColor="#fef08a" />
                        <stop offset="70%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </radialGradient>
                    </defs>

                    {/* Outer Flame (Flickering Pulse) */}
                    <path
                      d="M40 2 C36 12 30 18 30 26 C30 34 35 38 40 38 C45 38 50 34 50 26 C50 18 44 12 40 2 Z"
                      fill={`url(#diyaFlame_${idx})`}
                      className="animate-pulse"
                    />

                    {/* Inner Core Flame */}
                    <path
                      d="M40 10 C38 16 35 20 35 26 C35 30 37 34 40 34 C43 34 45 30 45 26 C45 20 42 16 40 10 Z"
                      fill="#ffffff"
                      opacity="0.95"
                    />

                    {/* Ornate Outer Wings / Clay Trim */}
                    <path
                      d="M14 36 C10 44 16 52 24 50 C20 58 28 66 40 76 C52 66 60 58 56 50 C64 52 70 44 66 36 C60 44 50 40 40 34 C30 40 20 44 14 36 Z"
                      fill="#831b4e"
                      stroke={`url(#diyaGoldRim_${idx})`}
                      strokeWidth="1.2"
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

                    {/* Golden Wick Line down the center */}
                    <path
                      d="M40 32 Q40 48 40 62"
                      stroke={`url(#diyaGoldRim_${idx})`}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}

          {/* ================= CENTER GREETING CIRCLE ================= */}
          <div className="relative z-20 w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] rounded-full bg-gradient-to-br from-[#2f1354] via-[#200c3b] to-[#120524] border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.35),inset_0_0_20px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center text-center p-3 sm:p-4">
            <span className="text-amber-200/90 text-xs sm:text-sm font-medium tracking-wide">
              Wishing you a
            </span>

            <h2
              className="text-white text-xl sm:text-3xl font-extrabold tracking-wider uppercase leading-tight my-0.5 sm:my-1"
              style={{
                textShadow: "0 0 16px rgba(251,191,36,0.6)",
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
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center px-4 z-20">
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
