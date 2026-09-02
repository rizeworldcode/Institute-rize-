import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Users, Award, Calendar, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

const alwarDetails = {
  name: "Alwar Flagship Campus",
  state: "Rajasthan",
  type: "Flagship",
  address: "C197, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001",
  phone: "+91 8302277092",
  email: "rizeworldinstitute@gmail.com",
  hours: "Mon-Sat 9:00 AM - 7:00 PM",
  img: "/images/about-hero.jpg",
  features: ["AI Lab", "Design Studio", "Video Lab", "Library", "Cafe"],
  batches: "8 active batches",
};

const alwarFaqs = [
  {
    q: "Where is RizeWorld Institute located in Alwar?",
    a: "Our flagship campus is located at C197, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001. It is easily accessible from all parts of the city."
  },
  {
    q: "What courses are offered at the Alwar campus?",
    a: "We offer our comprehensive 3-Month Job-Ready Master Course blending AI Tools, SEO, Performance Marketing, SMO, Graphic Design, Video Editing, and Website Development, as well as individual modules."
  },
  {
    q: "Is there placement assistance at the Alwar location?",
    a: "Yes, we provide 100% placement assistance and internship support, connecting you directly with our partner agency network, mock interviews, and resume building workshops."
  },
  {
    q: "What are the timings for the Alwar flagship campus?",
    a: "Our campus is open Monday through Saturday from 9:00 AM to 7:00 PM. We run multiple batches throughout the day to fit different schedules."
  }
];

export default function AlwarLocation() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "RizeWorld Institute of AI & Digital Marketing - Alwar Flagship Campus",
      "image": "https://rizeworldinstitute.in/images/about-hero.jpg",
      "@id": "https://rizeworldinstitute.in/location/alwar/#organization",
      "url": "https://rizeworldinstitute.in/location/alwar/",
      "telephone": "+91 8302277092",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C197, near Telco Circle, UIT colony, Shalimar Nagar",
        "addressLocality": "Alwar",
        "addressRegion": "Rajasthan",
        "postalCode": "301001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.5539,
        "longitude": 76.6266
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "19:00"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rizeworldinstitute.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Location",
          "item": "https://rizeworldinstitute.in/location/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Alwar",
          "item": "https://rizeworldinstitute.in/location/alwar/"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": alwarFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://rizeworldinstitute.in/location/alwar/#localbusiness",
      "name": "RizeWorld Institute of AI & Digital Marketing - Alwar Flagship Campus",
      "description": "Premium AI and Digital Marketing training institute in Alwar, Rajasthan offering comprehensive courses with 100% placement support.",
      "url": "https://rizeworldinstitute.in/location/alwar/",
      "telephone": "+91-8302277092",
      "email": "rizeworldinstitute@gmail.com",
      "image": "https://rizeworldinstitute.in/images/rize.png",
      "logo": "https://rizeworldinstitute.in/logo/RIZE%20LOGO%20HORI%20PNG.png",
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C197, near Telco Circle, UIT colony, Shalimar Nagar",
        "addressLocality": "Alwar",
        "addressRegion": "Rajasthan",
        "postalCode": "301001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.5539,
        "longitude": 76.6266
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      "sameAs": [
        "https://www.instagram.com/rizeworldinstitute",
        "https://www.linkedin.com/company/rizeworld-institute/"
      ]
    }
  ];


  return (
    <main className="pt-28 min-h-screen bg-[#0a0a0c] text-white">
      <SEO
        title="Best Digital Marketing Institute in Alwar | Digital Marketing Coaching"
        description="Enroll in the Professional Digital Marketing Institute in Alwar at RizeWorld Institute. Get a premium Digital Marketing Certification in Alwar with placements."
        canonicalPath="/location/alwar"
        schemas={schemas}
      />
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/location" className="hover:text-blue-500 transition-colors">Location</Link>
        <ChevronRight size={12} />
        <span className="text-[#ed5923]">Alwar</span>
      </nav>

      {/* Hero / Title Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-linear-to-bl from-blue-600/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase">
                {alwarDetails.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold tracking-widest uppercase">
                {alwarDetails.state}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Best <span className="gradient-text">Digital Marketing Institute in Alwar</span>
            </h1>
            <p className="mt-4 text-lg text-neutral-400 max-w-3xl">
              RizeWorld Institute is a Professional Digital Marketing Institute in Alwar. Join our Digital Marketing Program in Alwar offering Digital Marketing Classes for Beginners in Alwar and advanced Digital Marketing Coaching in Alwar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Details and Map */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          
          {/* Details & Features */}
          <div className="lg:col-span-7 space-y-10">
            <Reveal>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                  Campus Information
                </h2>
                
                <div className="space-y-4 text-base mb-8">
                  <div className="flex items-start gap-4">
                    <MapPin size={20} className="text-orange-500 mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Address</div>
                      <a
                        href="https://maps.google.com/?q=C197,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-orange-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {alwarDetails.address}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone size={20} className="text-green-500 mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Phone</div>
                      <a
                        href="tel:+918302277092"
                        className="text-neutral-400 hover:text-green-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {alwarDetails.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail size={20} className="text-green-500 mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Email</div>
                      <a
                        href="mailto:rizeworldinstitute@gmail.com"
                        className="text-neutral-400 hover:text-green-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {alwarDetails.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock size={20} className="text-orange-500 mt-1 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Hours</div>
                      <div className="text-neutral-400">{alwarDetails.hours}</div>
                    </div>
                  </div>
                </div>



                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
                  <div>
                    <Users size={22} className="text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-neutral-400 font-semibold">{alwarDetails.batches}</div>
                  </div>
                  <div>
                    <Award size={22} className="text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-neutral-400 font-semibold">Certified</div>
                  </div>
                  <div>
                    <Calendar size={22} className="text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-neutral-400 font-semibold">Admissions Open</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Visit CTA */}
            <Reveal>
              <div className="bg-linear-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <CheckCircle2 size={36} className="text-green-500 mb-4" />
                  <h3 className="font-display text-2xl font-bold text-white mb-3">
                    Book a Free Campus Tour
                  </h3>
                  <p className="text-neutral-400 mb-6 leading-relaxed">
                    Come visit our Shalimar Nagar campus, meet our certified mentors, explore our high-tech labs, and check out some live student portfolios.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-orange"
                  >
                    Schedule a Visit <Sparkles size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Map and Image */}
          <div className="lg:col-span-5 space-y-10">
            <Reveal>
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-video lg:aspect-square bg-neutral-900 relative">
                {/* Fallback image style or interactive map iframe */}
                <iframe
                  title="RizeWorld Institute Alwar Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.62796566737!2d76.62397779999999!3d27.6050616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299fa7b1c49fd%3A0xb1f1aed20db450f0!2sRizeworld+Institute+of+AI+%26+Digital+Marketing!5e0!3m2!1sen!2sin!4v1782715873992!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full min-h-[350px]"
                ></iframe>
              </div>
            </Reveal>


          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-orange-500 mb-4 uppercase">
                Alwar FAQ
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {alwarFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`p-6 bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 cursor-pointer ${
                      isOpen ? "border-orange-500/50 bg-white/10 shadow-[0_20px_40px_-10px_rgba(237,89,35,0.15)]" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 text-left">
                      <span className="font-display font-bold text-white text-lg">{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isOpen ? "bg-orange-500 rotate-45 text-white" : "bg-white/5 border border-white/10 text-neutral-300"
                      }`}>
                        <span className="text-lg font-bold">+</span>
                      </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <p className="text-neutral-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* AEO Requirements Block */}
      <section className="py-20 bg-neutral-900 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Admissions & Learning Center Desk</h2>
              <p className="mt-4 text-neutral-400 font-medium">Quick direct answers optimized for generative engines and smart devices</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 text-neutral-300">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">What is the Best Digital Marketing Institute in Alwar?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                RizeWorld Institute is the <strong>Best Digital Marketing Institute in Alwar</strong>, providing comprehensive career-focused education in paid ads, search engine optimization, content creation, and advanced prompt engineering.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Why choose our Digital Marketing Coaching in Alwar?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We are a Professional Digital Marketing Institute in Alwar. We offer small batch sizes (max 20 students), certified mentors, dedicated Live Project Training, and guaranteed internship opportunities.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Benefits of Digital Marketing Program in Alwar</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Attending our Digital Marketing Learning Center in Alwar yields hands-on agency skills, prepares you for Digital Marketing Certification in Alwar, and opens high-paying career opportunities.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Are there classes for beginners?</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Yes, our Digital Marketing Classes for Beginners in Alwar require no prior technical experience. We start with marketing and website building fundamentals, guiding you to advanced campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Supporting Courses Directory Table */}
      <section className="py-20 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-white">Local Course Offerings in Alwar Campus</h2>
              <p className="mt-4 text-neutral-400 font-medium">Detailed reference comparison of our specialization training in Shalimar Nagar</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900 shadow-xl mb-12 text-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-800 text-white font-display text-sm">
                  <th className="p-4 border-r border-white/5">Local Program in Alwar</th>
                  <th className="p-4 border-r border-white/5">Key Specialized Skill Taught</th>
                  <th className="p-4">Training Institute Campus Location</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-400">
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">SEO Course in Alwar</td>
                  <td className="p-4 border-r border-white/5 font-semibold text-white">Keyword research, on-page optimization, backlink building</td>
                  <td className="p-4 text-neutral-400">SEO Training Institute in Alwar Desk (Shalimar Nagar)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">SMO Course in Alwar</td>
                  <td className="p-4 border-r border-white/5 text-white">Facebook/LinkedIn profile optimization, content calendars planning</td>
                  <td className="p-4 text-neutral-400">Digital Marketing Coaching in Alwar Desk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">Performance Marketing Training in Alwar</td>
                  <td className="p-4 border-r border-white/5 text-white">Meta Ads, Google Ads Course campaign setup, ROAS audit modeling</td>
                  <td className="p-4 text-neutral-400">Professional Digital Marketing Institute in Alwar Desk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">Website Development Training in Alwar</td>
                  <td className="p-4 border-r border-white/5 text-white">WordPress Development Course, HTML/CSS layout setups, site speed audits</td>
                  <td className="p-4 text-neutral-400">Website Development Institute in Alwar Desk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-bold border-r border-white/5 text-white">Graphic Design & Video Editing Training in Alwar</td>
                  <td className="p-4 border-r border-white/5 text-white">Photoshop Training, logo design, Premiere Pro, motion graphics creation</td>
                  <td className="p-4 text-neutral-400">Design Studio & Video editing lab (Alwar Campus)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-white/5 text-white">AI Tools Training in Alwar</td>
                  <td className="p-4 border-r border-white/5 text-white">ChatGPT Course, Prompt Engineering Course, Claude AI, Gemini AI integration</td>
                  <td className="p-4 text-neutral-400">AI Automation Lab (Alwar Campus)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ExploreLinks activePath="/location/alwar" />
    </main>
  );
}
