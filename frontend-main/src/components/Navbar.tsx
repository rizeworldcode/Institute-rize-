import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Home, Briefcase, MoreHorizontal, Menu } from "lucide-react";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);



  return (
    <>
      {/* Fixed Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
        {/* Main Nav Icons */}
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-4xl p-3 flex flex-col items-center gap-6 py-6 border border-white/40">
          <Link to="/" title="Home" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
            <Home size={20} />
          </Link>
          <Link to="/hire-from-us" title="Hire From Us" className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <Briefcase size={22} />
          </Link>
          
          <div className="relative group mt-2">
            <button className="text-neutral-400 hover:text-neutral-900 transition-colors flex items-center justify-center">
              <MoreHorizontal size={24} />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-white/40 p-2 flex flex-col gap-1 z-50">
              <Link to="/about" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors uppercase">About Us</Link>
              <Link to="/blog" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors uppercase">Blogs</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors uppercase">Contact Us</Link>
            </div>
          </div>
        </div>


      </aside>



      {/* ============================================================== */}
      {/* MOBILE & TABLET NAVBAR (Unified floating white glass capsule) */}
      {/* ============================================================== */}
      <div className="lg:hidden fixed top-6 left-4 right-4 z-50 pointer-events-none">
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-between px-6 py-3.5 pointer-events-auto">
          
          {/* Logo container */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-start h-10 w-32 overflow-hidden relative pointer-events-auto"
          >
            <img 
              src="/logo/RIZE LOGO HORI PNG.png" 
              alt="RizeWorld Logo" 
              className="absolute top-1/2 -translate-y-1/2 left-0 h-[500%] w-auto max-w-none object-contain object-left ml-[-70px]" 
            />
          </Link>

          {/* Thin circular hamburger button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/20 text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Top Floating Navbar (Desktop) */}
      <nav className="hidden lg:flex fixed top-10 left-28 right-8 xl:left-32 xl:right-12 z-50 pointer-events-auto transition-all duration-300">
        <div className="w-full bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-white/60 rounded-full flex items-center justify-between px-6 xl:px-8 py-3">
          
          {/* Left: Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center justify-start h-10 w-32 shrink-0 overflow-hidden relative">
             <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="absolute top-1/2 left-0 -translate-y-1/2 h-[500%] w-auto max-w-none object-contain object-left ml-[-70px]" />
          </Link>

          {/* Middle: Links */}
          <div className="flex items-center gap-6 xl:gap-10 text-[14px] xl:text-[16px] font-normal text-neutral-900 tracking-wide uppercase" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
            <a href="https://maps.google.com/?q=Rizeworld+Institute+of+AI+and+Digital+Marketing,+Alwar" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              Location Alwar, RJ
            </a>
            <Link to="/courses" className="hover:text-blue-600 transition-colors">Explore Courses</Link>
            <Link to="/master-course" className="hover:text-blue-600 transition-colors">Program Master Course</Link>
            <Link to="/certificate" className="hover:text-blue-600 transition-colors">Certificate</Link>
          </div>

          {/* Right: Button */}
          <div className="shrink-0 pl-2">
            <Link to="/contact" className="px-6 py-2.5 rounded-full border border-rose-400/60 text-neutral-900 font-normal text-[15px] tracking-wide hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center uppercase" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
              Enroll Now
            </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
        mobileOpen ? "visible" : "invisible"
      }`}>
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white/98 backdrop-blur-xl border-l border-white/40 shadow-luxury transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="h-full overflow-y-auto p-6 pt-24 space-y-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
            <a href="https://maps.google.com/?q=Rizeworld+Institute+of+AI+and+Digital+Marketing,+Alwar" target="_blank" rel="noopener noreferrer" className="block py-3 px-4 rounded-xl font-normal text-neutral-900 hover:bg-neutral-200 hover:text-rize-blue transition-colors uppercase">
              Location Alwar, RJ
            </a>
            <MobileLink to="/courses" label="Explore Courses" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/master-course" label="Program Master Course" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/certificate" label="Certificate" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/courses" label="Courses" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/master-course" label="Master Course" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/trainers" label="Trainers" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/blog" label="Blogs" onClick={() => setMobileOpen(false)} />

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-6 text-center py-3 rounded-full border border-rose-300 text-neutral-900 font-normal hover:bg-rose-50 transition-colors uppercase"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileLink({ to, label, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block py-3 px-4 rounded-xl font-normal text-neutral-900 hover:bg-neutral-200 hover:text-rize-blue transition-colors uppercase"
    >
      {label}
    </Link>
  );
}
