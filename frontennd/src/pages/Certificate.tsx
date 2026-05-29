import { useState } from "react";
import { Download, CheckCircle2, User, Eye, FileText, Lock, Mail, ArrowRight } from "lucide-react";

export default function Certificate() {
  const [downloading, setDownloading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", studentId: "" });

  const studentData = {
    name: "Aarav Sharma",
    id: "RW1234",
    status: "Certificate Issued",
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloading certificate for ${studentData.name}...`);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.studentId) {
      // For now, any input logs them in to see the dummy data
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-4xl p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-neutral-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-sm">
            <Lock size={32} className="stroke-[1.5]" />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
              Student Login
            </h1>
            <p className="text-sm font-semibold text-neutral-500">
              Enter your credentials to view and download your official certificate.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-sm font-semibold text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                Student ID
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  required
                  type="text"
                  value={loginForm.studentId}
                  onChange={(e) => setLoginForm({ ...loginForm, studentId: e.target.value })}
                  placeholder="e.g. RW1234"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-sm font-semibold text-neutral-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md mt-4"
            >
              Access Certificate <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              My Document Center
            </h1>
          </div>
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest pl-5">
            VIEW & DOWNLOAD YOUR OFFICIAL CERTIFICATES
          </p>
        </div>

        {/* Student Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Student Name</div>
              <div className="text-sm font-black text-neutral-900">{studentData.name}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Student ID</div>
              <div className="text-sm font-black text-neutral-900">{studentData.id}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Student Status</div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-green-50 text-green-700 border border-green-200">
                {studentData.status}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-4xl p-6 md:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-neutral-100 relative overflow-hidden">
          {/* Subtle background pattern or watermark could go here */}
          
          {/* Verification Badge */}
          <div className="absolute top-6 right-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 size={14} className="stroke-2" />
              VERIFIED
            </span>
          </div>

          <div className="relative z-10">
            {/* Certificate Details & Actions */}
            <div className="flex flex-col justify-between pt-4 lg:pt-8 pb-4">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Student Certificate
                  </span>
                  <h2 className="text-3xl font-black text-neutral-900">
                    {studentData.name}
                  </h2>
                </div>

                <div className="border-t border-b border-neutral-100 py-5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    Student ID
                  </span>
                  <span className="text-sm font-black text-blue-600">
                    {studentData.id}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  {downloading ? "Downloading..." : "Download Certificate"}
                </button>
                <button className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Eye size={18} className="text-neutral-400" />
                  View Full PDF
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
