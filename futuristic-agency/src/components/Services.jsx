'use client';

import { useRef } from 'react';
import { Cpu, Globe, Rocket, Eye, BarChart, Code2 } from 'lucide-react';

const services = [
  {
    num: '01',
    title: 'Autonomous Growth Systems',
    desc: 'Deploying self-optimizing programmatic funnels and marketing systems driven by multi-layered model architectures.',
    icon: Cpu,
    glow: 'rgba(0, 240, 255, 0.15)',
  },
  {
    num: '02',
    title: 'Cinematic Visual Engineering',
    desc: 'Immersive, high-performance interface design and brand identities built to mesmerize, retain, and convert high-tier audiences.',
    icon: Globe,
    glow: 'rgba(255, 0, 85, 0.15)',
  },
  {
    num: '03',
    title: 'Precision Brand Acceleration',
    desc: 'Synthesizing creative positioning with mathematical precision, launching multi-channel digital authority loops.',
    icon: Rocket,
    glow: 'rgba(168, 85, 247, 0.15)',
  },
  {
    num: '04',
    title: 'Semantic Data Analytics',
    desc: 'Uncovering cognitive patterns, intent channels, and custom insights through deep predictive model pipelines.',
    icon: BarChart,
    glow: 'rgba(0, 240, 255, 0.15)',
  },
  {
    num: '05',
    title: 'Interactive WebGL Systems',
    desc: 'Designing highly tactile web engines, interactive 3D platforms, and digital experiences that secure world-class awards.',
    icon: Code2,
    glow: 'rgba(255, 0, 85, 0.15)',
  },
  {
    num: '06',
    title: 'Autonomous Organic Search',
    desc: 'Generating semantic topical graphs and programmatic authority pipelines that dominate top search engine results pages.',
    icon: Eye,
    glow: 'rgba(168, 85, 247, 0.15)',
  },
];

// Interactive Card component with 3D Mouse Tilt
function ServiceCard({ service }) {
  const cardRef = useRef(null);
  const Icon = service.icon;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within the card
    const y = e.clientY - rect.top;  // y coordinate within the card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles
    const rotateX = -(y - centerY) / 12; // 3D tilt limit
    const rotateY = (x - centerX) / 12;

    // Apply rotation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.boxShadow = `0 15px 35px rgba(0,0,0,0.4), 0 0 25px ${service.glow}`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.boxShadow = 'none';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel glass-panel-hover p-8 md:p-10 rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[350px] transform-gpu"
      data-cursor
    >
      {/* Background Glow */}
      <div
        className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[80px]"
        style={{ backgroundColor: service.glow.replace('0.15', '0.4') }}
      />

      {/* Top row */}
      <div className="flex justify-between items-start">
        <span className="text-sm font-display text-white/30 tracking-widest">
          {service.num}
        </span>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.1)]">
          <Icon size={20} className="animate-pulse" />
        </div>
      </div>

      {/* Text and Info */}
      <div className="mt-12">
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight uppercase text-white mb-4">
          {service.title}
        </h3>
        <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
          {service.desc}
        </p>
      </div>

      {/* Subtle indicator bottom */}
      <div className="mt-8 flex items-center gap-1.5 text-xs text-cyber-blue tracking-[0.2em] font-semibold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        Initialize Systems
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative min-h-screen py-32 px-6 md:px-20 bg-[#020202] z-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.1)] px-4 py-1.5 glass-panel rounded-full">
              SERVICE ARCHITECTURES
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mt-6 font-display">
              Autonomous Units.
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/40 max-w-md font-light leading-relaxed">
            Our multi-disciplinary agency units run concurrently, synchronizing data feedback loops to deliver automated scaling at speed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
