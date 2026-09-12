import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import CallWidget from "./components/CallWidget";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const MasterCourse = lazy(() => import("./pages/MasterCourse"));
const HireFromUs = lazy(() => import("./pages/HireFromUs"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Certificate = lazy(() => import("./pages/Certificate"));
const Trainers = lazy(() => import("./pages/Trainers"));
const LocationHub = lazy(() => import("./pages/LocationHub"));
const AlwarLocation = lazy(() => import("./pages/AlwarLocation"));
const SEOPage = lazy(() => import("./pages/SEO"));
const SocialMediaPage = lazy(() => import("./pages/SocialMedia"));
const PerformanceMarketingPage = lazy(() => import("./pages/PerformanceMarketing"));
const WebsiteDevelopmentPage = lazy(() => import("./pages/WebsiteDevelopment"));
const GraphicDesignPage = lazy(() => import("./pages/GraphicDesign"));
const VideoEditingPage = lazy(() => import("./pages/VideoEditing"));
const AIDigitalMarketingPage = lazy(() => import("./pages/AIDigitalMarketing"));
const DirectDownload = lazy(() => import("./pages/DirectDownload"));
const NotFound = lazy(() => import("./pages/NotFound"));


function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.length > 1 && pathname.endsWith("/")) {
      const cleanPath = pathname.replace(/\/+$/, "") + search + hash;
      navigate(cleanPath, { replace: true });
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, search, hash, navigate]);

  return null;
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function MainLayout() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/master-course" element={<MasterCourse />} />
          <Route path="/hire-from-us" element={<HireFromUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/location" element={<LocationHub />} />
          <Route path="/location/alwar" element={<AlwarLocation />} />
          <Route path="/seo" element={<SEOPage />} />
          <Route path="/social-media-marketing" element={<SocialMediaPage />} />
          <Route path="/performance-marketing" element={<PerformanceMarketingPage />} />
          <Route path="/website-development" element={<WebsiteDevelopmentPage />} />
          <Route path="/graphic-design" element={<GraphicDesignPage />} />
          <Route path="/video-editing" element={<VideoEditingPage />} />
          <Route path="/ai-digital-marketing" element={<AIDigitalMarketingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/student_login" element={<Certificate />} />
          <Route path="/download-certificate" element={<DirectDownload />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CallWidget />
      <WhatsAppWidget />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}
