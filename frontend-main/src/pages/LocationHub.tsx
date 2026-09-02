import { MapPin, ArrowRight, Clock, Phone, Mail, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

const locationList = [
  {
    slug: "alwar",
    name: "Alwar Flagship Campus",
    state: "Rajasthan",
    type: "Flagship",
    address: "C197, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001",
    phone: "+91 8302277092",
    email: "rizeworldinstitute@gmail.com",
    hours: "Mon-Sat 9:00 AM - 7:00 PM",
    img: "/alwar.jpeg",
    tagline: "Our premium flagship learning center equipped with state-of-the-art AI labs.",
  },
  {
    slug: "jaipur",
    name: "Jaipur Regional Hub (Coming Soon)",
    state: "Rajasthan",
    type: "Regional",
    address: "Jaipur Road, Rajasthan",
    phone: "+91 8302277092",
    email: "rizeworldinstitute@gmail.com",
    hours: "Mon-Sat 9:00 AM - 7:00 PM",
    img: "/jaipur.jpg",
    tagline: "Expanding our horizon to bring world-class AI learning to the Pink City.",
    isUpcoming: true,
  }
];

export default function LocationHub() {
  return (
    <main className="pt-28 min-h-screen bg-[#0a0a0c] text-white">
      <SEO
        title="Our Locations | RizeWorld Institute"
        description="Explore RizeWorld Institute campuses. Find our flagship campus in Alwar, Rajasthan, offering premium AI and digital marketing training."
        canonicalPath="/location"
      />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 opacity-20 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-orange-500 mb-5">
              <Compass size={12} className="animate-spin-slow" /> OUR CAMPUSES
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
              Our <span className="gradient-text">Locations</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
              Step into modern, state-of-the-art learning hubs designed to foster creativity, focus, and collaboration. Explore our current campuses and upcoming expansions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {locationList.map((loc, idx) => (
            <Reveal key={idx} delay={idx * 0.15}>
              <div className={`relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-luxury transition-all duration-500 flex flex-col group ${loc.isUpcoming ? "opacity-60" : "hover:shadow-orange hover:border-orange-500/30"
                }`}>
                {/* Image header */}
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase">
                      {loc.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase">
                      {loc.state}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-3">
                    {loc.name}
                  </h2>
                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed flex-1">
                    {loc.tagline}
                  </p>

                  <div className="space-y-3 text-sm mb-8 border-t border-white/10 pt-6">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-orange-500 mt-0.5 shrink-0" />
                      <span className="text-neutral-300">{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-green-500 shrink-0" />
                      <span className="text-neutral-300">{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-green-500 shrink-0" />
                      <span className="text-neutral-300">{loc.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-orange-500 shrink-0" />
                      <span className="text-neutral-300">{loc.hours}</span>
                    </div>
                  </div>

                  {!loc.isUpcoming ? (
                    <Link
                      to={`/location/${loc.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all group-hover:scale-[1.02] duration-300 shadow-orange"
                    >
                      Explore Alwar Campus <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <div className="w-full text-center py-4 rounded-full border border-white/10 text-neutral-500 font-semibold text-sm">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
