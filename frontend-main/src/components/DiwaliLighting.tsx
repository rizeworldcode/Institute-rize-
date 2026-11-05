// Festive bulb palette matching authentic Diwali fairy lights
const BULB_COLORS = [
  { color: "#FBBF24", glow: "rgba(251, 191, 36, 0.9)", name: "Gold" },
  { color: "#F97316", glow: "rgba(249, 115, 22, 0.9)", name: "Saffron" },
  { color: "#EF4444", glow: "rgba(239, 68, 68, 0.85)", name: "Ruby" },
  { color: "#10B981", glow: "rgba(16, 185, 129, 0.85)", name: "Emerald" },
  { color: "#F59E0B", glow: "rgba(245, 158, 11, 0.9)", name: "Amber" },
  { color: "#38BDF8", glow: "rgba(56, 189, 248, 0.85)", name: "Sapphire" },
  { color: "#FEF08A", glow: "rgba(254, 240, 138, 0.95)", name: "Lemon" },
];

export default function DiwaliLighting() {
  // 24 bulbs across the top screen
  const bulbCount = 24;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[42] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Keyframe Animations for Bulbs, Flame & Sway */}
      <style>{`
        @keyframes fairyBlink1 {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px var(--bulb-glow)) brightness(1.2); }
          50% { opacity: 0.35; filter: drop-shadow(0 0 2px var(--bulb-glow)) brightness(0.7); }
        }
        @keyframes fairyBlink2 {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 3px var(--bulb-glow)) brightness(0.75); }
          50% { opacity: 1; filter: drop-shadow(0 0 12px var(--bulb-glow)) brightness(1.25); }
        }
        @keyframes fairyBlink3 {
          0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 9px var(--bulb-glow)) brightness(1.1); }
          25% { opacity: 0.3; filter: drop-shadow(0 0 1px var(--bulb-glow)) brightness(0.6); }
          75% { opacity: 1; filter: drop-shadow(0 0 14px var(--bulb-glow)) brightness(1.3); }
        }
        @keyframes fairyBlink4 {
          0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 8px var(--bulb-glow)); }
          40% { opacity: 1; filter: drop-shadow(0 0 13px var(--bulb-glow)) brightness(1.25); }
          80% { opacity: 0.25; filter: drop-shadow(0 0 2px var(--bulb-glow)) brightness(0.65); }
        }
        @keyframes lanternSwayLeft {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(3.5deg); }
        }
        @keyframes lanternSwayRight {
          0% { transform: rotate(3deg); }
          100% { transform: rotate(-3.5deg); }
        }
        @keyframes diyaFlickerFlame {
          0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
          25% { transform: scale(1.1, 0.92) rotate(2deg); opacity: 1; }
          50% { transform: scale(0.92, 1.08) rotate(-1.5deg); opacity: 0.9; }
          75% { transform: scale(1.06, 1.02) rotate(1deg); opacity: 0.98; }
        }
        @keyframes diyaGlowHalo {
          0%, 100% { transform: scale(1); opacity: 0.65; }
          50% { transform: scale(1.3); opacity: 0.95; }
        }
        @keyframes floatSparkle {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.2; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(-30px) scale(0.8); opacity: 0.2; }
        }

        .anim-fairy-1 { animation: fairyBlink1 1.6s ease-in-out infinite; }
        .anim-fairy-2 { animation: fairyBlink2 2.1s ease-in-out infinite; }
        .anim-fairy-3 { animation: fairyBlink3 1.8s ease-in-out infinite; }
        .anim-fairy-4 { animation: fairyBlink4 2.4s ease-in-out infinite; }
      `}</style>

      {/* ================= 1. TOP AMBIENT FESTIVE WARM LIGHT AURA ================= */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(251, 191, 36, 0.18) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 75%)",
        }}
      />

      {/* ================= 2. TOP HANGING STRING FAIRY LIGHTS (LADI / JHALAR) ================= */}
      <div className="absolute top-0 left-0 right-0 h-16 w-full flex items-start justify-between px-2 sm:px-4">
        {/* Curving green wire spanning the top */}
        <svg
          className="absolute top-0 left-0 w-full h-8 overflow-visible"
          preserveAspectRatio="none"
          viewBox={`0 0 ${bulbCount * 40} 24`}
        >
          {Array.from({ length: bulbCount }).map((_, i) => {
            const startX = i * 40;
            const midX = startX + 20;
            const endX = startX + 40;
            return (
              <path
                key={i}
                d={`M ${startX} 0 Q ${midX} 14 ${endX} 0`}
                fill="none"
                stroke="#1B4332"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.85"
              />
            );
          })}
        </svg>

        {/* Individual Glowing Hanging Bulbs */}
        <div className="relative w-full flex items-start justify-between">
          {Array.from({ length: bulbCount }).map((_, i) => {
            const colorObj = BULB_COLORS[i % BULB_COLORS.length];
            const animClass = `anim-fairy-${(i % 4) + 1}`;
            const delay = `${((i * 0.18) % 1.5).toFixed(2)}s`;
            // Calculate natural drop height matching the wire curve
            const isMid = i % 2 === 1;
            const topOffset = isMid ? "11px" : "6px";

            return (
              <div
                key={i}
                className="flex flex-col items-center shrink-0"
                style={{
                  marginTop: topOffset,
                  // @ts-expect-error custom CSS variable
                  "--bulb-glow": colorObj.glow,
                }}
              >
                {/* Metallic dark green/brass bulb socket */}
                <div className="w-[6px] h-[5px] bg-[#2D4A22] rounded-t-sm shadow-sm" />

                {/* Glass Light Bulb Teardrop */}
                <div
                  className={`w-3 h-4 sm:w-3.5 sm:h-5 rounded-full transition-transform ${animClass}`}
                  style={{
                    backgroundColor: colorObj.color,
                    animationDelay: delay,
                    boxShadow: `0 0 10px ${colorObj.glow}, 0 0 20px ${colorObj.glow}`,
                    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  }}
                >
                  {/* Inner filament highlight */}
                  <div className="w-1 h-1.5 bg-white/80 rounded-full mx-auto mt-0.5 filter blur-[0.5px]" />
                </div>

                {/* Soft festive light cone cast downward */}
                <div
                  className="w-4 h-6 sm:w-6 sm:h-10 opacity-30 pointer-events-none -mt-1"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${colorObj.glow} 0%, transparent 80%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 3. TOP-LEFT HANGING TRADITIONAL AKASH KANDIL (LANTERN) ================= */}
      <div
        className="hidden md:flex flex-col items-center absolute top-0 left-16 sm:left-24 lg:left-28 origin-top"
        style={{
          animation: "lanternSwayLeft 4.5s ease-in-out infinite alternate",
        }}
      >
        {/* Golden chain */}
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-500 shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
        {/* Ornate Lantern Body */}
        <div className="relative flex flex-col items-center">
          {/* Top cap */}
          <div className="w-6 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-t-md shadow-md" />
          {/* Glowing Lantern Core */}
          <div className="relative w-8 h-9 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.85)] flex items-center justify-center border border-amber-200/50">
            {/* Inner diamond cutouts */}
            <div className="w-3.5 h-4.5 bg-yellow-100 rounded-sm shadow-[0_0_10px_#FFF] animate-pulse" />
          </div>
          {/* Bottom hanging tassels */}
          <div className="flex gap-1 mt-0.5">
            <div className="w-[1.5px] h-7 bg-amber-400" />
            <div className="w-[1.5px] h-9 bg-yellow-300" />
            <div className="w-[1.5px] h-11 bg-amber-400" />
            <div className="w-[1.5px] h-9 bg-yellow-300" />
            <div className="w-[1.5px] h-7 bg-amber-400" />
          </div>
        </div>
      </div>

      {/* ================= 4. TOP-RIGHT HANGING TRADITIONAL AKASH KANDIL (LANTERN) ================= */}
      <div
        className="hidden md:flex flex-col items-center absolute top-0 right-6 sm:right-10 origin-top"
        style={{
          animation: "lanternSwayRight 4.8s ease-in-out infinite alternate",
        }}
      >
        {/* Golden chain */}
        <div className="w-[1.5px] h-14 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-500 shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
        {/* Ornate Lantern Body */}
        <div className="relative flex flex-col items-center">
          {/* Top cap */}
          <div className="w-6 h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-t-md shadow-md" />
          {/* Glowing Lantern Core */}
          <div className="relative w-8 h-9 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.85)] flex items-center justify-center border border-amber-200/50">
            {/* Inner diamond cutouts */}
            <div className="w-3.5 h-4.5 bg-yellow-100 rounded-sm shadow-[0_0_10px_#FFF] animate-pulse" />
          </div>
          {/* Bottom hanging tassels */}
          <div className="flex gap-1 mt-0.5">
            <div className="w-[1.5px] h-7 bg-amber-400" />
            <div className="w-[1.5px] h-9 bg-yellow-300" />
            <div className="w-[1.5px] h-11 bg-amber-400" />
            <div className="w-[1.5px] h-9 bg-yellow-300" />
            <div className="w-[1.5px] h-7 bg-amber-400" />
          </div>
        </div>
      </div>

      {/* ================= 5. BOTTOM-LEFT GLOWING DIYA ON ORNATE BASE ================= */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-center pointer-events-none">
        {/* Pulsing Warm Diya Halo */}
        <div
          className="absolute -top-6 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 75%)",
            animation: "diyaGlowHalo 2.5s ease-in-out infinite",
          }}
        />

        {/* Diya SVG with Animated Flickering Flame */}
        <svg
          viewBox="0 0 100 65"
          className="w-16 h-12 sm:w-20 sm:h-14 overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        >
          <defs>
            {/* Clay / Brass Diya Body Gradient */}
            <linearGradient id="cornerDiyaBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="45%" stopColor="#C2410C" />
              <stop offset="80%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="cornerDiyaRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            {/* Flame Gradient */}
            <radialGradient id="cornerFlameGrad" cx="50%" cy="85%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Diya Plate / Rangoli ring */}
          <ellipse cx="50" cy="55" rx="36" ry="7" fill="#78350F" opacity="0.4" />
          <ellipse cx="50" cy="54" rx="32" ry="5.5" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 3" opacity="0.75" />

          {/* Diya Body */}
          <path
            d="M 18 36 C 24 52, 76 52, 82 36 C 85 34, 75 32, 50 32 C 25 32, 15 34, 18 36 Z"
            fill="url(#cornerDiyaBody)"
            stroke="url(#cornerDiyaRim)"
            strokeWidth="1.2"
          />

          {/* Oil Surface */}
          <ellipse cx="50" cy="35" rx="27" ry="4" fill="#9A3412" />
          <ellipse cx="50" cy="35" rx="22" ry="2.5" fill="#D97706" opacity="0.6" />

          {/* Wick */}
          <line x1="50" y1="36" x2="50" y2="28" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />

          {/* Animated Flickering Flame */}
          <g
            style={{
              transformOrigin: "50px 30px",
              animation: "diyaFlickerFlame 1.5s ease-in-out infinite",
            }}
          >
            {/* Outer flame */}
            <path
              d="M 50 8 C 42 18, 44 26, 50 30 C 56 26, 58 18, 50 8 Z"
              fill="url(#cornerFlameGrad)"
              filter="drop-shadow(0 0 10px #F59E0B)"
            />
            {/* Inner flame core */}
            <path
              d="M 50 16 C 46 22, 47 26, 50 28 C 53 26, 54 22, 50 16 Z"
              fill="#FFFFFF"
              opacity="0.95"
            />
          </g>
        </svg>

        {/* Small Festive Caption */}
        <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500 drop-shadow-sm mt-0.5 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-300/40">
          Shubh Diwali
        </span>
      </div>

      {/* ================= 6. AMBIENT DRIFTING FESTIVE SPARKLES ================= */}
      {[
        { left: "10%", top: "25%", delay: "0s", duration: "4s", size: "14px" },
        { left: "22%", top: "75%", delay: "1.2s", duration: "5s", size: "12px" },
        { left: "85%", top: "35%", delay: "2.5s", duration: "4.5s", size: "16px" },
        { left: "92%", top: "80%", delay: "0.8s", duration: "5.5s", size: "11px" },
        { left: "5%", top: "60%", delay: "3s", duration: "6s", size: "13px" },
        { left: "80%", top: "15%", delay: "1.8s", duration: "4.8s", size: "15px" },
        { left: "50%", top: "90%", delay: "2.2s", duration: "5.2s", size: "12px" },
      ].map((sp, idx) => (
        <span
          key={idx}
          className="absolute text-amber-400 pointer-events-none select-none"
          style={{
            left: sp.left,
            top: sp.top,
            fontSize: sp.size,
            animation: `floatSparkle ${sp.duration} ease-in-out infinite`,
            animationDelay: sp.delay,
            filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))",
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
