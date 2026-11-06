import { useState, useRef } from "react";
import {
  Play,
  Calendar,
  Video,
  ArrowRight,
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

// Exactly 3 official RizeWorld Workshop recordings
const WORKSHOP_VIDEOS: WorkshopVideo[] = [
  {
    id: "ws-lords",
    title: "Lords International School",
    date: "Lords International School Campus",
    videoUrl: "/video/lords-x-rize.mov",
    featured: true,
  },
  {
    id: "ws-dwps",
    title: "DWPS Alwar",
    date: "DWPS Alwar Campus",
    videoUrl: "/video/rw-ins-workshop.mov",
  },
  {
    id: "ws-sophia",
    title: "Sophia Public School Alwar",
    date: "Sophia Public School Campus",
    videoUrl: "/video/sophia-workshop.mov",
  },
];

export default function Workshop() {
  const [selectedVideo, setSelectedVideo] = useState<WorkshopVideo>(
    WORKSHOP_VIDEOS.find((w) => w.featured) || WORKSHOP_VIDEOS[0]
  );
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const topPlayerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSelectVideo = (ws: WorkshopVideo) => {
    setSelectedVideo(ws);
    setAutoPlay(true);
    // Smooth scroll up to the main video player
    topPlayerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Play the video
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

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
              <Video size={14} className="text-orange-400" />
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
        </div>
      </section>

      {/* ================= MAIN PLAYER (BIG CARD AT TOP) ================= */}
      <section ref={topPlayerRef} className="py-12 sm:py-16 max-w-7xl mx-auto px-6 scroll-mt-28">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Main Player
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Watch Workshop
            </h2>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/15 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Direct Video Player */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 shadow-2xl">
              {selectedVideo.videoUrl ? (
                <video
                  ref={videoRef}
                  key={selectedVideo.id}
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay={autoPlay}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain bg-black"
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  <source src={selectedVideo.videoUrl} type="video/quicktime" />
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                  <Video size={48} className="text-neutral-600" />
                </div>
              )}

              {/* Now Playing Badge */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-orange-500/90 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Now Playing
                </span>
              </div>
            </div>

            {/* Right Column: Dynamic Workshop Details (Updates to whichever card is clicked) */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2">
                  <Calendar size={14} className="text-orange-400" />
                  <span>{selectedVideo.date}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {selectedVideo.title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL WORKSHOPS (3 CARDS BELOW) ================= */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Video Library
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Explore All Workshops
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Click on any workshop below to play it in the main player above.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKSHOP_VIDEOS.map((ws) => {
            const isCurrent = selectedVideo.id === ws.id;
            return (
              <div
                key={ws.id}
                onClick={() => handleSelectVideo(ws)}
                className={`group rounded-3xl overflow-hidden bg-white/5 border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 cursor-pointer ${
                  isCurrent
                    ? "border-orange-500 ring-2 ring-orange-500/40 shadow-xl shadow-orange-500/10"
                    : "border-white/10 hover:border-orange-400/40"
                }`}
              >
                <div>
                  {/* 16:9 Direct Video Preview */}
                  <div className="relative aspect-video overflow-hidden bg-black group/vid">
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
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${
                          isCurrent
                            ? "bg-orange-500"
                            : "bg-orange-500/90 group-hover:bg-orange-500"
                        }`}
                      >
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
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
                  <span
                    className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                      isCurrent
                        ? "text-orange-400"
                        : "text-neutral-400 group-hover:text-orange-400"
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <span>Playing in Main Player</span>
                      </>
                    ) : (
                      <>
                        <span>Click to Play</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
