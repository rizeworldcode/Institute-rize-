import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

export default function CallWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Show label after 3 seconds to draw attention
    const timer = setTimeout(() => setShowLabel(true), 3000);
    const hideTimer = setTimeout(() => setShowLabel(false), 7000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 justify-end">
      {/* Label */}
      <div
        className={`transition-all duration-500 ${
          showLabel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="bg-white text-neutral-900 shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap relative">
          📞 +91 8302277092
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
        </div>
      </div>

      {/* Button */}
      <a
        href="tel:+918302277092"
        aria-label="Call RizeWorld Institute"
        className="group relative flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-[0_8px_32px_rgba(22,163,74,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(22,163,74,0.65)] overflow-hidden"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-green-500" />
        <Phone size={26} className="relative z-10" />
      </a>
    </div>
  );
}
