import { MapPin, Phone, Mail, Clock, CheckCircle2, Users, Award, Calendar, Sparkles } from "lucide-react";
import Reveal from "../components/Reveal";

const centers = [
  {
    name: "Alwar Flagship Campus",
    state: "Rajasthan",
    type: "Flagship",
    address: "C198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001",
    phone: "+91 8302277092",
    email: "rizeworldinstitute@gmail.com",
    hours: "Mon-Sat 9AM-7PM",
    img: "/images/about-hero.jpg",
    features: ["AI Lab", "Design Studio", "Video Lab", "Library", "Cafe"],
    batches: "8 active batches",
  },
  {
    name: "Rajasthan State Hub",
    state: "Rajasthan",
    type: "Regional",
    address: "Jaipur Road, Rajasthan",
    phone: "+91 8302277092",
    email: "rizeworldinstitute@gmail.com",
    hours: "Mon-Sat 10AM-6PM",
    img: "/images/classroom.jpg",
    features: ["Smart Classrooms", "Co-working Space", "Event Hall"],
    batches: "4 active batches",
  },
];

export default function Centers() {
  return (
    <main className="pt-28">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 gradient-orange opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 gradient-green opacity-20 blur-3xl rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-orange text-xs font-semibold text-[#ff6b1a] mb-5">
                <MapPin size={12} /> OUR CAMPUSES
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
                Learn where <span className="gradient-text">great minds gather.</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-400">
                Luxury campuses designed to inspire focus, creativity, and community.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {centers.map((c, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-luxury hover:shadow-orange transition-all duration-500">
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="aspect-4/3 lg:aspect-auto overflow-hidden lg:[direction:ltr]">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 md:p-12 lg:[direction:ltr] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full gradient-orange text-white text-[10px] font-bold tracking-widest">
                        {c.type.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold tracking-widest">
                        {c.state.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
                      {c.name}
                    </h2>
                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-[#ff6b1a] mt-0.5 shrink-0" />
                        <span className="text-neutral-300">{c.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#10b981] shrink-0" />
                        <span className="text-neutral-300">{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-[#10b981] shrink-0" />
                        <span className="text-neutral-300">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-[#ff6b1a] shrink-0" />
                        <span className="text-neutral-300">{c.hours}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-xs font-bold tracking-widest text-neutral-400 mb-2">FACILITIES</div>
                      <div className="flex flex-wrap gap-2">
                        {c.features.map((f, j) => (
                          <span key={j} className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-neutral-300">{f}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
                      <div className="text-center">
                        <Users size={18} className="text-[#ff6b1a] mx-auto mb-1" />
                        <div className="text-xs text-neutral-400">{c.batches}</div>
                      </div>
                      <div className="text-center">
                        <Award size={18} className="text-[#10b981] mx-auto mb-1" />
                        <div className="text-xs text-neutral-400">Certified</div>
                      </div>
                      <div className="text-center">
                        <Calendar size={18} className="text-[#ff6b1a] mx-auto mb-1" />
                        <div className="text-xs text-neutral-400">Jun 17 Batch</div>
                      </div>
                    </div>

                    <a
                      href="/contact"
                      className="magnetic-btn mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gradient-orange text-white font-semibold shadow-orange"
                    >
                      Book Campus Tour <Sparkles size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Visit CTA */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <CheckCircle2 size={40} className="text-[#10b981] mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Visit us for a <span className="gradient-text">free campus tour.</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Every Saturday, we open our doors. Meet trainers, explore facilities, and get your questions answered.
            </p>
            <a
              href="/contact"
              className="magnetic-btn inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-neutral-900 text-white font-bold hover:bg-[#ff6b1a] transition-colors"
            >
              Schedule a Tour →
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
