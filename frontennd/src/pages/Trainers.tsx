import { Linkedin, Instagram, Award, Briefcase, Sparkles, Quote } from "lucide-react";
import Reveal from "../components/Reveal";

const trainers = [
  {
    name: "Ankit Srivastava",
    role: "Performance Marketing Lead",
    expertise: ["Meta Ads", "Google Ads", "Analytics", "ROAS Optimization"],
    experience: "12+ years",
    bio: "Former Flipkart growth lead. Scaled brands to 8-figure revenue through data-driven paid campaigns.",
    img: "/images/trainer-1.jpg",
    color: "orange",
  },
  {
    name: "Meera Kapoor",
    role: "Creative Director",
    expertise: ["Brand Design", "Photoshop", "Visual Identity", "UX"],
    experience: "10+ years",
    bio: "Award-winning designer with work featured in Cannes Lions. Specializes in building iconic brands.",
    img: "/images/trainer-2.jpg",
    color: "green",
  },
  {
    name: "Rohan Mehta",
    role: "AI & Automation Coach",
    expertise: ["ChatGPT", "Midjourney", "Automation", "AI Strategy"],
    experience: "8+ years",
    bio: "Tech innovator helping 200+ businesses integrate AI into their marketing workflows.",
    img: "/images/trainer-3.jpg",
    color: "orange",
  },
  {
    name: "Priya Nair",
    role: "SEO & Content Strategist",
    expertise: ["SEO", "Content Strategy", "Copywriting", "Analytics"],
    experience: "9+ years",
    bio: "Ranked 100+ websites on page 1 of Google. Passionate about organic growth strategies.",
    img: "/images/trainer-1.jpg",
    color: "green",
  },
  {
    name: "Arjun Singh",
    role: "Video Production Expert",
    expertise: ["Premiere Pro", "Color Grading", "Motion Graphics", "Reels"],
    experience: "7+ years",
    bio: "Cinematic storyteller who's edited for Netflix India creators and top YouTube channels.",
    img: "/images/trainer-2.jpg",
    color: "orange",
  },
  {
    name: "Kavya Iyer",
    role: "SMO & Influencer Coach",
    expertise: ["Instagram Growth", "Influencer Marketing", "Reels", "Community"],
    experience: "6+ years",
    bio: "Built 5 creator brands from zero to 1M+ followers organically. Social-first strategist.",
    img: "/images/trainer-3.jpg",
    color: "green",
  },
];

export default function Trainers() {
  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Sparkles size={12} /> INDUSTRY EXPERTS
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-none tracking-tight">
                The <span className="text-blue-600">masters</span> behind the method.
              </h1>
              <p className="mt-6 text-lg text-neutral-500">
                Every trainer at RizeWorld is a battle-tested industry veteran. No theorists — only practitioners.
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-20 bg-[#0f0f0f] relative">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12">
              <div className="text-xs font-bold tracking-widest text-[#ff6b1a] mb-2">FEATURED TRAINERS</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white">Meet the legends.</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-luxury hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-dark bg-white/20 backdrop-blur text-[10px] font-bold tracking-widest text-white">
                      {t.experience}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${
                        t.color === "orange" ? "bg-[#ff6b1a]" : "bg-[#10b981]"
                      }`}>
                        {t.role.toUpperCase()}
                      </div>
                      <h3 className="font-display text-2xl font-bold">{t.name}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                      <Quote size={14} className="inline text-[#ff6b1a] mr-1" />
                      {t.bio}
                    </p>

                    <div className="mb-4">
                      <div className="text-[10px] font-bold tracking-widest text-neutral-400 mb-2">EXPERTISE</div>
                      <div className="flex flex-wrap gap-1.5">
                        {t.expertise.map((e, j) => (
                          <span key={j} className={`px-2.5 py-1 rounded-full text-xs ${
                            t.color === "orange" ? "bg-[#ff6b1a]/10 text-[#ff6b1a]" : "bg-[#10b981]/10 text-[#10b981]"
                          }`}>
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex gap-2">
                        {[
                          { Icon: Linkedin, url: "https://www.linkedin.com/company/rizeworld-institute/" },
                          { Icon: Instagram, url: "https://www.instagram.com/rizeworldinstitute?igsh=MWl4M2J3bDZuMTRpeA==" }
                        ].map((social, j) => (
                          <a key={j} href={social.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all">
                            <social.Icon size={14} className="text-neutral-300" />
                          </a>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#ff6b1a]">
                        <Award size={12} />
                        Top Mentor
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join as Trainer */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <Briefcase size={40} className="text-[#ff6b1a] mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Are you an <span className="gradient-text">industry expert?</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Join our elite trainer network. Shape the next generation of digital leaders.
            </p>
            <a
              href="/contact"
              className="magnetic-btn inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full gradient-orange text-white font-bold shadow-orange btn-shine"
            >
              Apply as Trainer →
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
