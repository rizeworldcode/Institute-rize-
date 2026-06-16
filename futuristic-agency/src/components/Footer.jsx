'use client';

export default function Footer() {
  return (
    <footer className="relative bg-black py-16 px-6 md:px-20 border-t border-white/5 overflow-hidden z-20">
      {/* Animated background glow pulse */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-cyber-blue/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        {/* Left branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <span className="text-xl font-display font-black tracking-widest text-white">
            AETHERIS
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-light">
            29 Specialized Units. One Integrated Growth System.
          </span>
        </div>

        {/* Center links */}
        <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-white/50">
          <a href="#" className="hover:text-cyber-blue transition-colors duration-300" data-cursor>
            TERMS_OF_SERVICE
          </a>
          <a href="#" className="hover:text-cyber-blue transition-colors duration-300" data-cursor>
            PRIVACY_SCHEMAS
          </a>
          <a href="#" className="hover:text-cyber-blue transition-colors duration-300" data-cursor>
            SYSTEM_STATUS
          </a>
        </div>

        {/* Right copyright */}
        <div className="text-[10px] text-white/30 uppercase tracking-widest font-light text-center md:text-right">
          © {new Date().getFullYear()} Aetheris Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
