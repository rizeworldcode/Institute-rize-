import { useEffect, useState } from "react";
import { Sparkles, Mail, Phone, GraduationCap, ExternalLink, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { getApiUrl } from "../utils/api";

interface DBTeacher {
  _id: string;
  techer_name: string;
  techer_ID: string;
  course_name: string;
  phone: string;
  email: string;
  address?: string;
}

const STATIC_MENTORS = [
  {
    name: "Rahul Sharma",
    role: "Director of AI & Robotics",
    specialty: "Generative AI, LLMs & Neural Networks",
    experience: "Ex-Senior Machine Learning Engineer at TechCorp",
    bio: "Rahul leads the AI curriculum, bringing years of industrial machine learning experience to prepare students for the next frontier of artificial intelligence.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    tags: ["AI/ML", "Python", "Deep Learning"],
  },
  {
    name: "Karan Soni",
    role: "Head of Digital Marketing",
    specialty: "Growth Hacking, Performance Marketing & SEO",
    experience: "8+ Years Mentoring & Executing Global Ad Campaigns",
    bio: "Karan is a master strategist who has managed millions in ad spend. He teaches performance marketing with a direct, data-driven, results-oriented approach.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    tags: ["Marketing", "Growth", "SEO"],
  },
  {
    name: "Priyanka Verma",
    role: "UI/UX & Creative Director",
    specialty: "Human-Centered Design, Branding & Prototyping",
    experience: "Product Designer & Brand Consultant",
    bio: "Priyanka guides students through design thinking, wireframing, and creating high-converting user interfaces that balance aesthetics and usability.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    tags: ["UI/UX", "Figma", "Branding"],
  },
  {
    name: "Ankit Choudhary",
    role: "Lead Web Developer & Architect",
    specialty: "Full-Stack Development, React & Cloud Infrastructure",
    experience: "Senior Software Architect & Mentor",
    bio: "Ankit is passionate about building scalable, high-performance web applications. He trains students in modern frontend & backend architectures.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    tags: ["React", "Node.js", "Cloud"],
  },
];

export default function Trainers() {
  const [dbTeachers, setDbTeachers] = useState<DBTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(getApiUrl("/allTeachers"));
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setDbTeachers(data.data);
        }
      } catch (err) {
        console.error("Error fetching teachers from backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <main className="pt-28 bg-[#0a0a0c] text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-orange-400 mb-6 tracking-wide uppercase">
              <Sparkles size={12} className="animate-pulse" /> Our Faculty & Mentors
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
              Learn from the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-orange-400 to-green-400">
                industry elite.
              </span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              We believe in mentorship, not just lectures. Our trainers are active industry professionals, entrepreneurs, and experts who build what they teach.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Senior Leadership / Key Mentors Grid */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold font-display">Core Mentors</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {STATIC_MENTORS.map((mentor, index) => (
              <Reveal key={index} delay={index * 0.15}>
                <div className="bg-[#121215]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 group">
                  <div className="w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden relative shadow-md">
                    <img 
                      src={mentor.img} 
                      alt={mentor.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                  </div>
                  
                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {mentor.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-neutral-300 border border-white/5 uppercase">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                        {mentor.name}
                      </h3>
                      <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mt-0.5">
                        {mentor.role}
                      </p>
                      <p className="text-xs text-neutral-400 font-medium mt-1">
                        {mentor.experience}
                      </p>
                      <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                        {mentor.bio}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-semibold text-neutral-500">Specialty:</span>
                      <span className="text-white/80 font-bold">{mentor.specialty}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Teachers Section (from DB) */}
      {(!loading && dbTeachers.length > 0) && (
        <section className="py-16 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold font-display">Faculty Directory</h2>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbTeachers.map((teacher, index) => (
                <Reveal key={teacher._id || index} delay={index * 0.1}>
                  <div className="bg-[#121215]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-green-500/20 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-lg border border-green-500/20 uppercase">
                        {teacher.techer_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white">{teacher.techer_name}</h3>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                          {teacher.course_name}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-400 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-neutral-500" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-neutral-500" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#0a0a0c] relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <GraduationCap size={40} className="text-orange-400 mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Want to learn from the <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-yellow-400">best?</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400 max-w-xl mx-auto font-medium">
              Schedule a personalized 1-on-1 mentorship session or career roadmap guidance with our head mentors.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group"
              >
                Enroll in a Program <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://wa.me/918302277092"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold flex items-center justify-center gap-2"
              >
                Talk to Advisor <ExternalLink size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
