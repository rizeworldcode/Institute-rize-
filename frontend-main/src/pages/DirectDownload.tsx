import { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";

export default function DirectDownload() {
  const [downloaded, setDownloaded] = useState(false);

  const startDownload = () => {
    try {
      const fileUrl = "/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "RizeWorld_Certificate_Punit_Sharma.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
    } catch (e) {
      console.error("Auto download failed, redirecting:", e);
      window.location.href = "/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg";
    }
  };

  useEffect(() => {
    // Immediately initiate download on scan
    const timer = setTimeout(() => {
      startDownload();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-6 py-20 font-sans">
      <SEO
        title="Downloading Certificate | RizeWorld Institute"
        description="Official Certificate Download for Punit Sharma - RizeWorld Institute of AI & Digital Marketing"
        canonicalPath="/download-certificate"
      />

      <div className="max-w-md w-full bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Download size={32} className="animate-bounce" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white mb-2">
          Downloading Certificate
        </h1>
        <p className="text-sm text-neutral-300 font-medium mb-6">
          RizeWorld Institute of AI & Digital Marketing
        </p>

        <div className="bg-neutral-900/80 rounded-2xl p-4 mb-6 border border-neutral-700/50 text-left space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-400">Student:</span>
            <span className="text-white font-bold">Punit Sharma</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-400">Course:</span>
            <span className="text-blue-400 font-bold">Creative Pro (Graphic + Video)</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-400">Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={13} /> Verified
            </span>
          </div>
        </div>

        <button
          onClick={startDownload}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg mb-4 cursor-pointer"
        >
          <Download size={18} />
          {downloaded ? "Download Again" : "Download Certificate Now"}
        </button>

        <a
          href="/hero/White and Gold Simple Elegant Appreciation Certificate.jpg.jpeg"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-400 hover:text-white transition-colors underline block"
        >
          Open file directly in browser
        </a>
      </div>
    </div>
  );
}
