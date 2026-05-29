import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white text-neutral-900 overflow-hidden">
      {/* Top gradient line */}
      <div className="h-1 bg-linear-to-r from-[#ff6b1a] via-[#ffb088] to-[#10b981]" />



      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* CTA Banner */}
        <div className="relative bg-[#0b1b36] border border-blue-400/20 shadow-[0_20px_40px_-10px_rgba(65,104,178,0.3)] rounded-[2.5rem] p-12 md:p-20 mb-16 overflow-hidden text-center">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-orange-500/10 to-green-500/20 opacity-50" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 blur-[100px] rounded-full" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold mb-8 text-white tracking-widest shadow-lg uppercase">
              <Sparkles size={14} className="text-[#ffb088]" />
              Ready To Rise?
            </div>
            <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-white mb-6 tracking-tight">
              Your AI career <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fcbf12] to-[#ffb088]">starts today.</span>
            </h3>
            <p className="text-white/70 md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Join the next batch of future-ready digital leaders at RizeWorld. Transform your potential into expertise.
            </p>
          </div>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center mb-6 w-[200px] h-[64px] pt-2 -ml-24">
              <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-full w-full object-contain object-left origin-left scale-[5.5]" />
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              A premium institute of AI & Digital Marketing shaping the next generation of tech-savvy professionals in Alwar, Rajasthan.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Instagram, url: "https://www.instagram.com/rizeworldinstitute?igsh=MWl4M2J3bDZuMTRpeA==" },
                { Icon: Linkedin, url: "https://www.linkedin.com/company/rizeworld-institute/" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-[#ff6b1a] hover:text-white hover:scale-110 hover:rotate-6 transition-all shadow-sm"
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h4 className="font-display font-bold text-sm mb-4 text-orange-600">Learn</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/courses" className="hover:text-neutral-900 transition-colors">Courses</a></li>
              <li><a href="/master-course" className="hover:text-neutral-900 transition-colors">Master Course</a></li>
              <li><a href="/trainers" className="hover:text-neutral-900 transition-colors">Trainers</a></li>
              <li><a href="/blog" className="hover:text-neutral-900 transition-colors">Blogs</a></li>
            </ul>
          </div>

          <div className="relative z-10">
            <h4 className="font-display font-bold text-sm mb-4 text-green-600">Institute</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/about" className="hover:text-neutral-900 transition-colors">About Us</a></li>
              <li><a href="/hire-from-us" className="hover:text-neutral-900 transition-colors">Hire From Us</a></li>
              <li><a href="/contact" className="hover:text-neutral-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="relative z-10">
            <h4 className="font-display font-bold text-sm mb-4 text-orange-600">Reach Us</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-orange-500 mt-0.5 shrink-0" />
                <span>C198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-green-600" />
                <span>+91 8302277092</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-green-600" />
                <span>rizeworldinstitute@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">
            © 2026 RizeWorld Institute of AI & Digital Marketing. Crafted by RizeWorld.
          </p>
          <div className="flex gap-6 text-xs text-neutral-400">
            <Link to="/privacy" className="hover:text-neutral-900">Privacy</Link>
            <Link to="/terms" className="hover:text-neutral-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
