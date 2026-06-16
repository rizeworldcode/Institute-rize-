'use client';

import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Growth Loop', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Feedback', href: '#testimonials' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 md:py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3.5 rounded-full border-white/5 backdrop-blur-md">
          {/* Logo */}
          <a
            href="#"
            className="text-lg md:text-xl font-display font-bold tracking-widest text-white hover:text-cyber-blue transition-colors duration-300"
            data-cursor
          >
            AETHERIS
          </a>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyber-blue hover:after:w-full after:transition-all after:duration-300"
                data-cursor
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="magnetic inline-flex items-center gap-2 bg-white text-black text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-cyber-blue hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_#00f0ff]"
              data-cursor
            >
              Get In Touch
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* Hamburger Menu - Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/80 hover:text-white"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/98 z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-2xl font-display font-light uppercase tracking-widest text-white/70 hover:text-cyber-blue hover:tracking-[0.15em] transition-all duration-300"
          >
            {link.name}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="inline-flex items-center gap-2 bg-cyber-blue text-black text-sm font-semibold uppercase tracking-widest px-8 py-3 rounded-full mt-4"
        >
          Get In Touch
          <ArrowUpRight size={16} />
        </a>
      </div>
    </>
  );
}
