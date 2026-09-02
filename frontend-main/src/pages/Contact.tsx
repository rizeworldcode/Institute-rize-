import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Instagram, Linkedin, CheckCircle2, MessageSquare } from "lucide-react";
import Reveal from "../components/Reveal";
import { getApiUrl } from "../utils/api";
import SEO from "../components/SEO";
import ExploreLinks from "../components/ExploreLinks";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const phoneNumber = "918302277092";
    const dateStr = new Date().toLocaleString();
    
    const messageTemplate = `🌟 *NEW CONTACT INQUIRY* 🌟
━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${form.name}
📞 *Phone:* ${form.phone}
✉️ *Email:* ${form.email}
━━━━━━━━━━━━━━━━━━━━━
🏷️ *Subject:* ${form.subject || 'General Inquiry'}

📝 *Message:*
_${form.message}_
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${dateStr}
🌐 *Source:* RizeWorld Website`;

    // Save to backend instead of local storage
    fetch(getApiUrl("/addInquiry"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        course: form.subject || "General Inquiry",
        message: form.message
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("Inquiry saved to database");
      }
    })
    .catch(err => console.error("Error saving inquiry:", err));

    // Open WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageTemplate)}`;
    window.open(url, '_blank');

    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="pt-28">
      <SEO
        title="Course Admission Enquiry | Contact RizeWorld Institute"
        description="Submit your Course Admission Enquiry or find our Digital Marketing Institute Contact Number. Talk to Our Counselor and Book Free Demo Class."
        canonicalPath="/contact"
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": "https://rizeworldinstitute.in/contact#contactpage",
            "name": "Contact RizeWorld Institute",
            "description": "Get in touch with RizeWorld Institute for course admission enquiries, demo class bookings, and placement support.",
            "url": "https://rizeworldinstitute.in/contact",
            "inLanguage": "en-IN",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rizeworldinstitute.in/" },
                { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://rizeworldinstitute.in/contact" }
              ]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://rizeworldinstitute.in/#organization",
            "name": "RizeWorld Institute",
            "url": "https://rizeworldinstitute.in",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-8302277092",
                "contactType": "admissions",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"],
                "contactOption": "TollFree",
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                  "opens": "09:00",
                  "closes": "19:00"
                }
              },
              {
                "@type": "ContactPoint",
                "email": "rizeworldinstitute@gmail.com",
                "contactType": "customer support",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              }
            ]
          }
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600 mb-5">
                <MessageSquare size={12} /> Course Admission Enquiry
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-neutral-900 leading-none tracking-tight">
                Contact <span className="text-blue-600">RizeWorld Institute</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-500">
                Get in Touch with Admission Support. Contact Our Team to Schedule a Free Consultation, Request a Call Back, or Enquire About Digital Marketing Course.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              <a
                href="https://maps.google.com/?q=C197,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:bg-orange-100"
              >
                <MapPin size={24} className="text-orange-500 mb-3" />
                <h3 className="font-display font-bold text-neutral-900 mb-2">Visit Our Campus</h3>
                <p className="text-sm text-neutral-600">C197, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001</p>
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href="tel:+918302277092"
                className="block bg-green-50 border border-green-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:bg-green-100"
              >
                <Phone size={24} className="text-green-600 mb-3" />
                <h3 className="font-display font-bold text-neutral-900 mb-2">Call Us</h3>
                <p className="text-sm text-neutral-600">+91 8302277092</p>
              </a>
            </Reveal>

            <Reveal delay={0.2}>
              <a
                href="mailto:rizeworldinstitute@gmail.com"
                className="block bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:bg-blue-50"
              >
                <Mail size={24} className="text-blue-500 mb-3" />
                <h3 className="font-display font-bold text-neutral-900 mb-2">Email Us</h3>
                <p className="text-sm text-neutral-600">rizeworldinstitute@gmail.com</p>
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <Clock size={24} className="text-green-600 mb-3" />
                <h3 className="font-display font-bold text-neutral-900 mb-2">Office Hours</h3>
                <p className="text-sm text-neutral-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                <p className="text-sm text-neutral-600">Sunday: By appointment only</p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 shadow-sm">
                <h4 className="font-display font-bold text-neutral-900 mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { Icon: Instagram, url: "https://www.instagram.com/rizeworldinstitute?igsh=MWl4M2J3bDZuMTRpeA==" },
                    { Icon: Linkedin, url: "https://www.linkedin.com/company/rizeworld-institute/" }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:scale-110 hover:rotate-6 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                    >
                      <social.Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <form onSubmit={submit} className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <h2 className="font-display text-3xl font-extrabold text-neutral-900 mb-2">Send us a message</h2>
                <p className="text-neutral-600 mb-8">We'll get back to you within 24 hours.</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Phone *</label>
                    <div className="flex items-center w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <span className="text-neutral-500 font-semibold mr-2 border-r border-neutral-300 pr-2">+91</span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setForm({ ...form, phone: val });
                        }}
                        placeholder="00000 00000"
                        className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900"
                  >
                    <option value="">Choose a topic</option>
                    <option value="Master Course Program">Master Course Program</option>
                    <optgroup label="INDIVIDUAL MODULES">
                      <option value="AI Tools + DM Basics">AI Tools + DM Basics</option>
                      <option value="Graphic Design + Photoshop">Graphic Design + Photoshop</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="SMO">SMO</option>
                      <option value="SEO">SEO</option>
                      <option value="Performance Marketing">Performance Marketing</option>
                      <option value="Website Development">Website Development</option>
                    </optgroup>
                    <optgroup label="COMBO PACKAGES">
                      <option value="Marketing Pro">Marketing Pro (SEO+SMO+Performance)</option>
                      <option value="Creative Pro">Creative Pro (Graphic+Video)</option>
                      <option value="Tech Pro">Tech Pro (Web Dev+AI Tools)</option>
                    </optgroup>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="magnetic-btn w-full py-4 rounded-full gradient-orange text-white font-bold shadow-orange btn-shine flex items-center justify-center gap-2"
                >
                  {sent ? (
                    <>
                      <CheckCircle2 size={18} />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <div className="grid lg:grid-cols-3">
                <div className="p-8 md:p-10 lg:col-span-1 flex flex-col justify-center">
                  <h3 className="font-display text-3xl font-extrabold text-neutral-900 mb-4">
                    come <span className="text-blue-600">together.</span>
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Our institute is designed to inspire students with a professional learning atmosphere and industry-focused education.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                      <span className="text-neutral-700 font-medium">Live projects & practical learning experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                      <span className="text-neutral-700 font-medium">AI-powered digital marketing training</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                      <span className="text-neutral-700 font-medium">Modern infrastructure & creative environment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                      <span className="text-neutral-700 font-medium">Expert guidance with career-focused learning</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 aspect-video lg:aspect-auto min-h-[400px] bg-white/5 relative overflow-hidden">
                  <iframe
                    title="RizeWorld Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.9069914288208!2d76.62333406958042!3d27.605061598515128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299fa7b1c49fd%3A0xb1f1aed20db450f0!2sRizeworld%20Institute%20of%20AI%20%26%20Digital%20Marketing!5e0!3m2!1sen!2sin!4v1779855881277!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AEO Requirements Block */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900">Counseling & Admissions Support</h2>
              <p className="mt-4 text-neutral-600 font-medium">Direct guidelines for generative engine citation and voice commands</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">What is a Course Admission Enquiry?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                A <strong>Course Admission Enquiry</strong> is a request made by prospective students or corporate teams to receive details regarding batch timings, curriculum structures, or to Book Free Demo Class sessions.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Why choose RizeWorld Institute support?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our support team is staffed by active career counselors who guide you in selecting the right modules, scheduling free consultations, and exploring placement support pathways.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">Benefits of Booking a Free Demo Class</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Attending a demo class lets you inspect our physical lab campus, experience our practical learning structure firsthand, and converse directly with industry trainers.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">How to Request a Call Back?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                You can submit your details in the contact form, use the WhatsApp widget directly, or call our Digital Marketing Institute Contact Number to connect with student support immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GEO Optimization Blocks: Structured Contacts Table */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl font-extrabold text-neutral-900">Student Support & Admission Desk Contact Matrix</h2>
              <p className="mt-4 text-neutral-600 font-medium">Quick reference directory for all course-related operations</p>
            </div>
          </Reveal>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-display text-sm">
                  <th className="p-4 border-r border-neutral-800">Support Desk</th>
                  <th className="p-4 border-r border-neutral-800">Direct Contact Mode</th>
                  <th className="p-4">Primary Assistance Scope</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Admissions Counselor</td>
                  <td className="p-4 border-r border-neutral-200">Digital Marketing Institute Contact Number (+91 8302277092)</td>
                  <td className="p-4">Schedule a Free Consultation, Course Admission Enquiry, Fee queries</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="p-4 font-bold border-r border-neutral-200">Student Support</td>
                  <td className="p-4 border-r border-neutral-200">Email (rizeworldinstitute@gmail.com)</td>
                  <td className="p-4">Batch rescheduling, certificate delivery, internship opportunities</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r border-neutral-200">Campus Visits Desk</td>
                  <td className="p-4 border-r border-neutral-200">Shalimar Nagar, Alwar Campus Visit</td>
                  <td className="p-4">Book Free Demo Class, inspect facilities, live project training files review</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ExploreLinks activePath="/contact" />
    </main>
  );
}
