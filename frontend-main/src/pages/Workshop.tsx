import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Calendar,
  Sparkles,
  Video,
  X,
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  Zap,
  ExternalLink,
} from "lucide-react";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";

export interface WorkshopVideo {
  id: string;
  title: string;
  date: string;
  videoUrl: string; // Local video file (/video/...)
  featured?: boolean;
}

function isVideoFile(url: string): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mov") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.startsWith("/video/")
  );
}

// Exactly 3 official RizeWorld Workshop recordings
const WORKSHOP_VIDEOS: WorkshopVideo[] = [
  {
    id: "ws-lords",
    title: "Lords International School × RizeWorld Workshop",
    date: "Lords International School Campus",
    videoUrl: "/video/lords-x-rize.mov",
    featured: true,
  },
  {
    id: "ws-dwps",
    title: "DWPS Alwar × RizeWorld Workshop",
    date: "DWPS Alwar Campus",
    videoUrl: "/video/rw-ins-workshop.mov",
  },
  {
    id: "ws-sophia",
    title: "Sophia Public School Alwar × RizeWorld Workshop",
    date: "Sophia Public School Campus",
    videoUrl: "/video/sophia-workshop.mov",
  },
];

export default function Workshop() {
  const [activeVideo, setActiveVideo] = useState<WorkshopVideo | null>(null);

  const featuredWorkshop =
    WORKSHOP_VIDEOS.find((w) => w.featured) || WORKSHOP_VIDEOS[0];

  const workshopSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Live Workshops & Masterclasses | RizeWorld Institute",
      "description":
        "Watch practical workshops, masterclasses, and live industry sessions on AI, Digital Marketing, SEO, and Graphic Design by RizeWorld Institute.",
      "url": "https://rizeworldinstitute.in/workshop",
      "publisher": {
        "@type": "EducationalOrganization",
        "name": "RizeWorld Institute of AI & Digital Marketing",
        "url": "https://rizeworldinstitute.in",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rizeworldinstitute.in/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Workshop",
          "item": "https://rizeworldinstitute.in/workshop",
        },
      ],
    },
  ];

  return (
    <main className="pt-28 bg-[#0a0a0c] text-white min-h-screen">
      <SEO
        title="Live Workshops & Masterclasses | RizeWorld Institute"
        description="Watch practical workshops, masterclasses, and live industry sessions on AI, Digital Marketing, SEO, and Graphic Design by RizeWorld Institute."
        canonicalPath="/workshop"
        schemas={workshopSchemas}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/10">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-orange-400 mb-6 tracking-wide uppercase">
              <Sparkles size={14} className="text-orange-400" />
              Live Workshops & Masterclasses
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Learn through real, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-orange-400 to-green-400">
                hands-on industry workshops.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Watch recordings of our exclusive live sessions, masterclasses, and agency-level case studies on AI tools, high-ROI marketing, and design.
            </p>
          </Reveal>

          {/* Quick Metrics Bar */}
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-300 text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-2">
                <Video size={16} className="text-blue-400" />
                HD Video Recordings
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} className="text-orange-400" />
                100% Practical Case Studies
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-green-400" />
                1,500+ Students Trained
              </span>
              <span className="flex items-center gap-2">
                <Award size={16} className="text-purple-400" />
                Certificate of Attendance
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURED WORKSHOP SPOTLIGHT ================= */}
      {featuredWorkshop && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
                Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Featured Workshop
              </h2>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/15 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Direct Video Player (No Image) */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 shadow-2xl">
                {featuredWorkshop.videoUrl ? (
                  <video
                    key={featuredWorkshop.videoUrl}
                    src={featuredWorkshop.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src={featuredWorkshop.videoUrl} type="video/mp4" />
                    <source src={featuredWorkshop.videoUrl} type="video/quicktime" />
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <Video size={48} className="text-neutral-600" />
                  </div>
                )}

                {/* Top Badge */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-orange-500/90 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    Featured
                  </span>
                </div>

              </div>

              {/* Right Column: Workshop Details (Clean: No Speaker Box, No Long Content) */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-3">
                    <Calendar size={14} className="text-orange-400" />
                    <span>{featuredWorkshop.date}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                    {featuredWorkshop.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= ALL WORKSHOPS ARCHIVE ================= */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Video Library
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Explore All Workshops
          </h2>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKSHOP_VIDEOS.map((ws) => (
            <div
              key={ws.id}
              className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-orange-400/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1"
            >
              <div>
                {/* 16:9 Direct Video Container (No Image) */}
                <div
                  className="relative aspect-video overflow-hidden bg-black cursor-pointer group/vid"
                  onClick={() => setActiveVideo(ws)}
                >
                  <video
                    src={`${ws.videoUrl}#t=0.5`}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500 pointer-events-none"
                  >
                    <source src={ws.videoUrl} type="video/mp4" />
                    <source src={ws.videoUrl} type="video/quicktime" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-orange-500/90 group-hover:bg-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content (Clean: Only Title & Date, No Speaker, No Description) */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2.5">
                    <Calendar size={13} className="text-orange-400" />
                    <span>{ws.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors leading-snug">
                    {ws.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveVideo(ws)}
                  className="text-xs sm:text-sm font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Watch Video</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= UPCOMING WORKSHOP INVITATION CARD ================= */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-orange-900/30 to-purple-900/40 border border-white/15 p-8 sm:p-14 text-center">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-orange-400 mb-6 uppercase tracking-wider">
              <GraduationCap size={15} />
              Attend Live & Interactive
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Want to attend our next live interactive workshop?
            </h2>

            <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Join our weekend interactive workshops at RizeWorld Institute Alwar campus or attend online live. Ask questions directly to industry mentors and get hands-on experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2"
              >
                <span>Reserve Free Seat</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="https://wa.me/919636605051?text=Hi%2C%20I%20want%20to%20register%20for%20the%20upcoming%20RizeWorld%20Workshop"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider uppercase border border-white/20 transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VIDEO MODAL POPUP ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl bg-neutral-900 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-black/60 shrink-0">
              <div className="flex items-center gap-2 overflow-hidden pr-3">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {activeVideo.videoUrl && (
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Open Video in New Tab"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center shrink-0">
              {activeVideo.videoUrl ? (
                isVideoFile(activeVideo.videoUrl) ? (
                  <video
                    key={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src={activeVideo.videoUrl} type="video/mp4" />
                    <source src={activeVideo.videoUrl} type="video/quicktime" />
                    <p className="text-sm text-neutral-300 p-6 text-center">
                      Your browser does not support HTML5 video playback.{" "}
                      <a
                        href={activeVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 underline font-semibold ml-1"
                      >
                        Click here to download or open video
                      </a>
                    </p>
                  </video>
                ) : (
                  <iframe
                    src={
                      activeVideo.videoUrl.includes("autoplay")
                        ? activeVideo.videoUrl
                        : `${activeVideo.videoUrl}?autoplay=1`
                    }
                    title={activeVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="text-center p-8 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 border border-orange-400/30">
                    <Video size={30} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    Video Coming Soon
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                    The recording for "{activeVideo.title}" is currently being prepared and will be uploaded shortly.
                  </p>
                  <a
                    href="https://wa.me/919636605051?text=Hi%2C%20please%20notify%20me%20when%20the%20workshop%20video%20is%20uploaded"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors"
                  >
                    Notify Me on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-neutral-900 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-y-auto">
              <div>
                <p className="text-sm font-bold text-white">
                  {activeVideo.title}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {activeVideo.date}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Link
                  to="/courses"
                  className="px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/contact"
                  className="px-3 sm:px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white transition-colors"
                >
                  Join Next Workshop
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

