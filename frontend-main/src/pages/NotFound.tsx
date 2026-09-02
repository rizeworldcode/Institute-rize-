import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Phone, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

/* ── Animated SVG Illustration ─────────────────────────────────────────── */
function NotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 420 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full max-w-md mx-auto"
    >
      <circle cx="210" cy="140" r="120" fill="url(#glowGrad)" opacity="0.12" />

      {/* Open book */}
      <g transform="translate(130, 80)">
        <path d="M80 20 C60 18 20 22 0 30 L0 150 C20 140 60 136 80 138 Z" fill="#eef2ff" stroke="#4168b2" strokeWidth="1.5" />
        <path d="M80 20 C100 18 140 22 160 30 L160 150 C140 140 100 136 80 138 Z" fill="#fff7ed" stroke="#ed5923" strokeWidth="1.5" />
        <line x1="80" y1="20" x2="80" y2="138" stroke="#2d4c88" strokeWidth="2.5" />
        <line x1="16" y1="55" x2="68" y2="55" stroke="#4168b2" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="16" y1="75" x2="58" y2="75" stroke="#4168b2" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="16" y1="95" x2="68" y2="95" stroke="#4168b2" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="16" y1="115" x2="58" y2="115" stroke="#4168b2" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="92" y1="55" x2="144" y2="55" stroke="#ed5923" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="92" y1="75" x2="134" y2="75" stroke="#ed5923" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="92" y1="95" x2="144" y2="95" stroke="#ed5923" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <line x1="92" y1="115" x2="134" y2="115" stroke="#ed5923" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        {/* Graduation cap */}
        <g transform="translate(55, -40)">
          <rect x="0" y="20" width="50" height="8" rx="2" fill="#4168b2" />
          <path d="M7 28 L7 46 Q25 54 43 46 L43 28" fill="#2d4c88" />
          <polygon points="25,0 50,20 25,28 0,20" fill="#4168b2" />
          <line x1="50" y1="20" x2="56" y2="36" stroke="#fcbf12" strokeWidth="2" />
          <circle cx="56" cy="38" r="3" fill="#fcbf12" />
        </g>
      </g>

      {/* Floating dots */}
      <circle cx="80" cy="60" r="5" fill="#4168b2" opacity="0.3">
        <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="100" r="4" fill="#ed5923" opacity="0.3">
        <animate attributeName="cy" values="100;88;100" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="55" cy="200" r="3" fill="#fcbf12" opacity="0.4">
        <animate attributeName="cy" values="200;192;200" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="360" cy="200" r="6" fill="#367f40" opacity="0.25">
        <animate attributeName="cy" values="200;210;200" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {/* Compass */}
      <g transform="translate(330, 55)">
        <circle cx="0" cy="0" r="24" fill="white" stroke="#4168b2" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3" fill="#4168b2" />
        <text x="-3" y="-14" fontFamily="sans-serif" fontSize="8" fill="#4168b2" fontWeight="700">N</text>
        <text x="-3" y="20" fontFamily="sans-serif" fontSize="8" fill="#4168b2" fontWeight="700">S</text>
        <text x="14" y="3" fontFamily="sans-serif" fontSize="8" fill="#ed5923" fontWeight="700">E</text>
        <text x="-22" y="3" fontFamily="sans-serif" fontSize="8" fill="#ed5923" fontWeight="700">W</text>
        <polygon points="0,-16 3,0 0,4 -3,0" fill="#ed5923">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="8s" repeatCount="indefinite" />
        </polygon>
      </g>

      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4168b2" />
          <stop offset="100%" stopColor="#4168b2" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Popular pages ─────────────────────────────────────────────────────── */
const popularPages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Master Course", href: "/master-course" },
  { label: "Admissions", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Trainers", href: "/trainers" },
  { label: "Contact Us", href: "/contact" },
  { label: "Certificate", href: "/certificate" },
  { label: "Hire From Us", href: "/hire-from-us" },
];

/* ── Animated counter ──────────────────────────────────────────────────── */
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

/* ── Main 404 page ─────────────────────────────────────────────────────── */
export default function NotFound() {
  return (
    <>
      <SEO
        title="404 – Page Not Found | RizeWorld Institute"
        description="The page you're looking for doesn't exist or may have been moved. Explore courses, about us, contact and more at RizeWorld Institute."
        canonicalPath="/404"
        noIndex={true}
      />

      <main
        id="main-content"
        className="min-h-screen bg-white relative overflow-hidden"
        aria-label="404 Error Page"
      >
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#ff6b1a] via-[#ffb088] to-[#10b981]" />
          <div className="absolute top-20 -left-32 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-32 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-28">
          {/* ── Hero grid ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">

            {/* Left: text */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-widest uppercase mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Error 404
              </div>

              {/* H1 */}
              <h1
                className="font-display leading-none mb-4"
                style={{
                  fontSize: "clamp(5rem, 18vw, 9rem)",
                  background: "linear-gradient(135deg, #4168b2 0%, #2d4c88 40%, #ed5923 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.04em",
                }}
              >
                <AnimatedCounter target={404} />
              </h1>

              <h2
                className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Page Not Found
              </h2>

              <p
                className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
              >
                The page you're looking for doesn't exist, may have been moved, or the URL may be incorrect.
              </p>

              {/* Action buttons */}
              <div
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
                role="navigation"
                aria-label="Recovery actions"
              >
                <Link
                  to="/"
                  id="btn-go-home"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4168b2] text-white font-semibold text-sm hover:bg-[#2d4c88] focus:outline-none focus:ring-2 focus:ring-[#4168b2] focus:ring-offset-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 btn-shine"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  aria-label="Go to Home page"
                >
                  <Home size={16} aria-hidden="true" />
                  Go to Home
                </Link>

                <Link
                  to="/courses"
                  id="btn-explore-courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-orange-300 text-orange-600 font-semibold text-sm hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  aria-label="Explore our Courses"
                >
                  <BookOpen size={16} aria-hidden="true" />
                  Explore Courses
                </Link>

                <Link
                  to="/contact"
                  id="btn-contact-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  aria-label="Contact Us"
                >
                  <Phone size={16} aria-hidden="true" />
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="order-1 lg:order-2 flex items-center justify-center" aria-hidden="true">
              <div className="animate-float-slow w-full">
                <NotFoundIllustration />
              </div>
            </div>
          </div>

          {/* ── Popular pages ── */}
          <section aria-labelledby="popular-pages-heading" className="relative">
            <div className="text-center mb-8">
              <h3
                id="popular-pages-heading"
                className="text-lg font-bold text-neutral-900 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Popular Pages
              </h3>
              <p
                className="text-sm text-neutral-500"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
              >
                Maybe one of these is what you were looking for?
              </p>
            </div>

            <nav aria-label="Popular pages" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {popularPages.map(({ label, href }) => (
                <Link
                  key={href + label}
                  to={href}
                  className="group flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#4168b2] focus:outline-none focus:ring-2 focus:ring-[#4168b2] focus:ring-offset-2 transition-all duration-200"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <span>{label}</span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 -translate-x-1 group-hover:translate-x-0 group-focus:translate-x-0 transition-all shrink-0 text-[#4168b2]"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>
          </section>

          {/* ── Footer strip ── */}
          <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
            <p style={{ fontFamily: "Poppins, sans-serif" }}>
              &copy; 2026 RizeWorld Institute of AI &amp; Digital Marketing
            </p>
            <div className="flex gap-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              <Link to="/privacy" className="hover:text-neutral-700 focus:outline-none focus:underline transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-neutral-700 focus:outline-none focus:underline transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
