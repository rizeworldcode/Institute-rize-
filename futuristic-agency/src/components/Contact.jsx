'use client';

import { useState } from 'react';
import { Send, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="relative py-32 px-6 md:px-20 bg-[#020202] z-20 overflow-hidden min-h-screen flex items-center justify-center"
    >
      {/* Background glow orb */}
      <div className="absolute right-10 bottom-10 w-[500px] h-[500px] radial-glow-red opacity-15 pointer-events-none" />
      <div className="absolute left-10 top-10 w-[500px] h-[500px] radial-glow-blue opacity-15 pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Detail text */}
        <div>
          <span className="text-[10px] font-display uppercase tracking-[0.4em] text-cyber-red shadow-[0_0_15px_rgba(255,0,85,0.1)] px-4 py-1.5 glass-panel rounded-full">
            CONNECTION NODE
          </span>
          <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-white mt-6 font-display leading-[0.9]">
            INITIALIZE<br />
            GROWTH.
          </h2>
          <p className="text-sm md:text-base text-white/50 mt-6 max-w-sm font-light leading-relaxed">
            Ready to integrate the 29 Service Units? Submit your details to establish a secure uplink with our development core.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">SECURE TERMINAL</span>
              <span className="text-sm text-cyber-blue font-semibold font-display tracking-wider">uplink@aetheris.agency</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">COGNITIVE HUB</span>
              <span className="text-sm text-white/70 font-light">Silicon Valley / Tokyo / Distributed</span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="glass-panel p-8 md:p-12 rounded-[32px] relative overflow-hidden border-white/5">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-display font-bold uppercase text-white tracking-widest">
                UPLINK ESTABLISHED
              </h3>
              <p className="text-xs text-white/40 mt-2 font-light">
                Secure handshake success. Response vector queued in T-120s.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name */}
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 font-light"
                  data-cursor
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Secure Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 font-light"
                  data-cursor
                />
              </div>

              {/* Message */}
              <div className="relative group">
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your Growth Objective"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 font-light resize-none"
                  data-cursor
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="magnetic w-full py-4 bg-white hover:bg-cyber-blue text-black text-xs font-semibold uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_#00f0ff] flex items-center justify-center gap-2 group"
                data-cursor
              >
                Transmit Signal
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
