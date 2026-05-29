import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Target, Eye, Heart } from "lucide-react";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);



export default function About() {
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <Sparkles size={12} /> OUR STORY
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-[0.95] tracking-tight">
                Where <span className="text-blue-600">ambition</span> <br />meets opportunity.
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
                RizeWorld Institute of AI & Digital Marketing was born from a simple belief: world-class digital education shouldn't be limited to big cities. We're building the next generation of AI-savvy digital leaders — right here in Alwar, Rajasthan.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <img src="/images/about-hero.jpg" alt="RizeWorld Institute" className="w-full h-[500px] object-cover rounded-3xl shadow-luxury" />
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-2xl p-5 shadow-luxury hidden md:block">
                <div className="font-display font-extrabold text-4xl text-blue-600">Since 2020</div>
                <div className="text-xs text-neutral-500">Shaping digital careers</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "To democratize premium AI & digital marketing education by blending industry expertise, hands-on learning, and a luxury campus experience — making career transformation accessible beyond metros.",
              color: "orange",
            },
            {
              icon: Eye,
              title: "Our Vision",
              desc: "To become India's most trusted AI & digital marketing institute — where every student becomes a confident, future-ready professional shaping the digital economy.",
              color: "green",
            },
            {
              icon: Heart,
              title: "Our Values",
              desc: "Excellence in every session. Integrity in every interaction. Innovation in every module. Community above competition — we rise by lifting each other.",
              color: "orange",
            },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full hover:shadow-luxury transition-all duration-500 hover:-translate-y-2 ${v.color === "orange" ? "hover:shadow-orange" : "hover:shadow-green"
                }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-luxury ${v.color === "orange" ? "gradient-orange" : "gradient-green"
                  }`}>
                  <v.icon size={24} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Final */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 gradient-orange opacity-5" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Be part of the <span className="gradient-text">story.</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Whether you're a student, trainer, or collaborator — there's a place for you at RizeWorld.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
