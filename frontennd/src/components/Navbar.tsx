import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown, ChevronRight, Home, Users, Briefcase, MoreHorizontal, MoreVertical, MapPin, BookOpen, Star } from "lucide-react";


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);



  return (
    <>
      {/* Fixed Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
        {/* Main Nav Icons */}
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-4xl p-3 flex flex-col items-center gap-6 py-6 border border-white/40">
          <Link to="/" title="Home" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
            <Home size={20} />
          </Link>
          <Link to="/trainers" title="Trainers" className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <Users size={22} />
          </Link>
          <Link to="/hire-from-us" title="Hire From Us" className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <Briefcase size={22} />
          </Link>
          
          <div className="relative group mt-2">
            <button className="text-neutral-400 hover:text-neutral-900 transition-colors flex items-center justify-center">
              <MoreHorizontal size={24} />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-white/40 p-2 flex flex-col gap-1 z-50">
              <Link to="/about" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors">About Us</Link>
              <Link to="/blog" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors">Blogs</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-rize-blue hover:bg-[#0f0f0f] rounded-xl transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>


      </aside>



      {/* ============================================================== */}
      {/* 1. MOBILE NAVBAR (Phones: hidden on md and above) */}
      {/* ============================================================== */}
      <div className="flex md:hidden fixed top-6 left-0 right-0 z-50 justify-between items-center px-6 pointer-events-none">
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-start h-12 w-32 pointer-events-auto"
        >
          {/* Mobile Logo Sizing */}
          <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-[600%] w-auto max-w-none object-contain object-left ml-[-88px]" />
        </Link>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="pointer-events-auto h-12 w-12 mr-2 flex items-center justify-center bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full text-neutral-900 cursor-pointer shrink-0"
        >
          {mobileOpen ? <X size={24} /> : <MoreVertical size={24} />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. PAD NAVBAR (Tablets: shown on md, hidden on lg) */}
      {/* ============================================================== */}
      <div className="hidden md:flex lg:hidden fixed top-6 left-0 right-0 z-50 justify-between items-center px-8 pointer-events-none">
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-start h-14 w-40 pointer-events-auto"
        >
          {/* Pad Logo Sizing (Edit these values to change Pad logo size) */}
          <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-[600%] w-auto max-w-none object-contain object-left ml-[-88px]" />
        </Link>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="pointer-events-auto h-14 w-14 mr-2 flex items-center justify-center bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full text-neutral-900 cursor-pointer shrink-0"
        >
          {mobileOpen ? <X size={28} /> : <MoreVertical size={28} />}
        </button>
      </div>

      {/* Top Floating Navbar (Desktop) */}
      <nav className="hidden lg:flex fixed top-4 left-24 right-4 z-50 justify-between items-start pointer-events-none">
        
        {/* Left Pill (Logo) */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 rounded-full flex items-center justify-center hover:scale-105 transition-transform h-[64px] w-[200px] pt-2"
        >
           <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-full w-full object-contain object-center drop-shadow-md scale-[5.5]" />
        </Link>

        {/* Center Pill (Search/Filters) */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 rounded-4xl px-4 xl:px-8 py-3 flex items-center gap-6 xl:gap-12 relative">
          
          {/* Location Block */}
          <a href="https://maps.google.com/?q=Rizeworld+Institute+of+AI+and+Digital+Marketing,+Alwar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer group">
            <div className="text-neutral-400 group-hover:text-blue-600 transition-colors">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-0.5">Location</div>
              <div className="flex items-center gap-1 text-xs xl:text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                Alwar, RJ
              </div>
            </div>
          </a>
          
          <div className="w-px h-8 bg-neutral-200"></div>

          {/* Explore Courses Block */}
          <Link to="/courses" className="relative group flex items-center gap-3 cursor-pointer">
            <div className="text-neutral-400 group-hover:text-rize-blue transition-colors">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-0.5">Explore</div>
              <div className="flex items-center gap-1 text-xs xl:text-sm font-bold text-neutral-900 group-hover:text-rize-blue transition-colors">
                Courses
              </div>
            </div>
          </Link>

          <div className="w-px h-8 bg-neutral-200"></div>

          {/* Program Block */}
          <Link to="/master-course" className="relative group flex items-center gap-3 cursor-pointer">
            <div className="text-neutral-400 group-hover:text-rize-blue transition-colors">
              <Star size={18} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase mb-0.5">Program</div>
              <div className="flex items-center gap-1 text-xs xl:text-sm font-bold text-neutral-900 group-hover:text-rize-blue transition-colors">
                Master Course
              </div>
            </div>
          </Link>

        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <Link to="/certificate" className="bg-white hover:bg-neutral-50 text-neutral-900 shadow-md hover:shadow-lg h-[64px] px-6 rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all hover:scale-105 active:scale-95 border border-white/40 backdrop-blur-xl">
            Certificate
          </Link>
          <Link to="/admin/login" className="bg-white hover:bg-neutral-50 text-neutral-900 shadow-md hover:shadow-lg h-[64px] px-6 rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all hover:scale-105 active:scale-95 border border-white/40 backdrop-blur-xl">
            Admin
          </Link>
          <Link to="/contact" className="bg-white hover:bg-neutral-50 text-neutral-900 shadow-md hover:shadow-lg h-[64px] px-8 rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all hover:scale-105 active:scale-95 border border-white/40 backdrop-blur-xl">
            Enroll Now <ChevronRight size={18} className="text-neutral-400" />
          </Link>
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
          <div className="h-full overflow-y-auto p-6 pt-24 space-y-2">
            <MobileLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
            
            <MobileLink to="/courses" label="Courses" onClick={() => setMobileOpen(false)} />

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === "centers" ? null : "centers")}
                className="w-full flex justify-between items-center py-3 px-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <span className="font-semibold text-neutral-900">Centers</span>
                <ChevronDown size={16} className={`text-neutral-900 transition-transform ${mobileDropdown === "centers" ? "rotate-180" : ""}`} />
              </button>
              {mobileDropdown === "centers" && (
                <div className="pl-4 space-y-1 pb-2">
                  <Link to="/centers" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-neutral-900/80 hover:text-rize-blue">Rajasthan</Link>
                  <Link to="/centers" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-neutral-900/80 hover:text-rize-blue">Alwar</Link>
                </div>
              )}
            </div>

            <MobileLink to="/trainers" label="Trainers" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/master-course" label="Master Course" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/hire-from-us" label="Hire From Us" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/about" label="About Us" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/blog" label="Blogs" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/contact" label="Contact Us" onClick={() => setMobileOpen(false)} />

            <Link
              to="/certificate"
              onClick={() => setMobileOpen(false)}
              className="block mt-6 text-center py-3 rounded-full bg-neutral-900 text-white font-semibold shadow-luxury"
            >
              Certificate
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="block mt-4 text-center py-3 rounded-full border-2 border-neutral-900 text-neutral-900 font-semibold"
            >
              Admin Login
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-4 text-center py-3 rounded-full bg-blue-600 text-white font-semibold shadow-blue"
            >
              Enroll Now →
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
      className="block py-3 px-4 rounded-xl font-semibold text-neutral-900 hover:bg-neutral-200 hover:text-rize-blue transition-colors"
    >
      {label}
    </Link>
  );
}
