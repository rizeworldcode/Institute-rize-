import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle2, User, Eye, FileText, Lock, Mail, ArrowRight, AlertCircle, LogOut } from "lucide-react";

interface Certificate {
  courseName: string;
  certificatePath: string;
  issuedAt?: string;
}

export default function Certificate() {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ studentId: "", password: "" });
  const [studentData, setStudentData] = useState<{
    name: string;
    id: string;
    certificates: Certificate[];
  } | null>(null);

  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchCertificateData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3001/certificateData", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setStudentData({
          name: data.student_name,
          id: data.student_id,
          certificates: data.certificates || [],
        });
      }
    } catch (err) {
      console.error("Error fetching certificate data:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("studentAuthToken");
    if (token) {
      setIsLoggedIn(true);
      fetchCertificateData(token);
    }
  }, []);

  const handleDownload = async (cert: Certificate) => {
    if (!cert?.certificatePath) return;
    setDownloading(cert.courseName);
    try {
      const photoPath = cert.certificatePath.startsWith('http') 
        ? cert.certificatePath 
        : cert.certificatePath.startsWith('/') 
          ? `http://localhost:3001${cert.certificatePath}` 
          : `http://localhost:3001/${cert.certificatePath}`;
      
      const response = await fetch(photoPath);
      if (!response.ok) throw new Error("File not found");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${cert.courseName}_${studentData?.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download certificate. Please try again later.");
    } finally {
      setDownloading(null);
    }
  };

  const handleViewPdf = (cert: Certificate) => {
    if (cert?.certificatePath) {
      const photoPath = cert.certificatePath.startsWith('http') 
        ? cert.certificatePath 
        : cert.certificatePath.startsWith('/') 
          ? `http://localhost:3001${cert.certificatePath}` 
          : `http://localhost:3001/${cert.certificatePath}`;
      window.open(photoPath, '_blank');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("studentAuthToken");
      if (token) {
        await fetch("http://localhost:3001/student_logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("studentAuthToken");
      localStorage.removeItem("studentId");
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      setIsLoggedIn(false);
      setStudentData(null);
      navigate("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("http://localhost:3001/student_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_ID: loginForm.studentId,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("studentAuthToken", data.token);
        localStorage.setItem("studentId", data.studentId);
        setIsLoggedIn(true);
        fetchCertificateData(data.token);
      } else {
        setLoginError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("An error occurred. Please try again later.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isLoggedIn || !studentData) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6 font-sans flex items-center justify-center">
        {!isLoggedIn ? (
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

              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                  Student Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    required
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-sm font-semibold text-neutral-900"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 text-xs font-bold text-center mt-2 animate-bounce">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Authenticating..." : (
                  <>
                    Access Certificate <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-500 font-bold">Loading your documents...</p>
          </div>
        )}
      </div>
    );
  }

  const hasCertificates = studentData.certificates.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut size={16} />
            Secure Logout
          </button>
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
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                hasCertificates 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-orange-50 text-orange-700 border-orange-200"
              }`}>
                {hasCertificates ? "Certificates Available" : "Pending"}
              </div>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        {hasCertificates ? (
          <div className="space-y-6">
            {studentData.certificates.map((cert, index) => (
              <div key={index} className="bg-white rounded-4xl p-6 md:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-neutral-100 relative overflow-hidden">
                {/* Verification Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border bg-green-50 text-green-700 border-green-200">
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
                          Course Certificate
                        </span>
                        <h2 className="text-3xl font-black text-neutral-900">
                          {cert.courseName}
                        </h2>
                      </div>

                      <div className="border-t border-b border-neutral-100 py-5">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                          Student Name
                        </span>
                        <span className="text-sm font-black text-neutral-900">
                          {studentData.name}
                        </span>
                        <div className="mt-4">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                            Student ID
                          </span>
                          <span className="text-sm font-black text-blue-600">
                            {studentData.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={downloading === cert.courseName}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Download size={18} />
                        {downloading === cert.courseName ? "Downloading..." : "Download Certificate"}
                      </button>
                      <button 
                        onClick={() => handleViewPdf(cert)}
                        className="flex-1 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 font-bold text-xs tracking-widest uppercase py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={18} className="text-neutral-400" />
                        View Full PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-4xl p-6 md:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-neutral-100">
            <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                <AlertCircle size={20} />
              </div>
              <p className="text-sm font-bold text-orange-700">
                Your certificates are currently being processed. They will be available for download once issued by the administration.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
