'use client';

const reviews = [
  {
    name: 'ELENA ROSTOVA',
    role: 'HEAD OF BRAND, NEURA',
    text: 'Aetheris re-architected our entire conversion layout. The resulting custom AI targeting loop boosted our customer retention rates by 140% in just two quarters.',
  },
  {
    name: 'MARCUS VANCE',
    role: 'VP OF MARKETING, KRONOS',
    text: 'Their visual design is futuristic yet highly logical. They did not just build a website; they delivered a next-gen digital experience that commands authority.',
  },
  {
    name: 'SARAH CHEN',
    role: 'FOUNDER, SYNAPSE PROTOCOL',
    text: 'The autonomous organic pipeline is pure wizardry. We are occupying top positions across high-intent semantic keyword searches with zero ad spend.',
  },
  {
    name: 'DAVID KERR',
    role: 'DIRECTOR, AETHER LOGISTICS',
    text: 'Their 3D interactive interface has set a new benchmark in our sector. The feedback from clients and the conversion numbers have exceeded our expectations.',
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-32 px-6 md:px-20 bg-[#000000] z-20 overflow-hidden flex flex-col justify-center"
    >
      {/* Background neon elements */}
      <div className="absolute left-10 bottom-1/4 w-[400px] h-[400px] radial-glow-blue opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full mb-16 text-center md:text-left">
        <span className="text-[10px] font-display uppercase tracking-[0.4em] text-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.1)] px-4 py-1.5 glass-panel rounded-full">
          CLIENT VERDICTS
        </span>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mt-6 font-display">
          Trusted by Pioneers.
        </h2>
      </div>

      {/* Infinite Marquee Grid container */}
      <div className="w-full relative flex flex-col gap-6 overflow-hidden py-4 mask-marquee">
        {/* Row 1 - Forward */}
        <div className="flex gap-6 w-max animate-marquee whitespace-nowrap">
          {[...reviews, ...reviews].map((rev, idx) => (
            <div
              key={idx}
              className="w-[300px] md:w-[450px] glass-panel p-8 md:p-10 rounded-3xl flex flex-col justify-between shrink-0 hover:border-white/20 transition-colors duration-300"
            >
              <p className="text-sm md:text-base text-white/70 leading-relaxed font-light whitespace-normal italic">
                "{rev.text}"
              </p>
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-1">
                <span className="text-xs font-display font-bold tracking-widest text-cyber-blue">
                  {rev.name}
                </span>
                <span className="text-[10px] text-white/30 tracking-widest uppercase">
                  {rev.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind & CSS custom animations for marquee */}
      <style jsx global>{`
        .mask-marquee {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
