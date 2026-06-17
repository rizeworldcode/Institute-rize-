import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Reveal from "../../components/Reveal";
import { getApiUrl } from "../../utils/api";

export function PasswordRequirements({ password }: { password: string }) {
  const reqs = [
    { label: "6 to 20 characters", valid: password.length >= 6 && password.length <= 20 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-1.5 p-4 bg-white/50 backdrop-blur rounded-xl border border-neutral-200 transition-all duration-300">
      {reqs.map((r, i) => (
        <div key={i} className={`flex items-center gap-2 text-xs font-bold transition-colors duration-300 ${r.valid ? 'text-[#10b981]' : 'text-red-500'}`}>
          {r.valid ? <CheckCircle2 size={14} className="shrink-0" /> : <XCircle size={14} className="shrink-0" />}
          {r.label}
        </div>
      ))}
    </div>
  );
}

export const checkPasswordValidity = (pwd: string) => {
  return (
    pwd.length >= 6 &&
    pwd.length <= 20 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  );
};

export default function ReferrerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Rate limiting states
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check lock state on mount
    const lockExpiry = localStorage.getItem("referrerLockout");
    if (lockExpiry) {
      const remaining = parseInt(lockExpiry) - Date.now();
      if (remaining > 0) {
        setLockoutTime(Math.ceil(remaining / 1000));
      } else {
        localStorage.removeItem("referrerLockout");
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTime !== null && lockoutTime > 0) {
      interval = setInterval(() => {
        setLockoutTime((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    } else if (lockoutTime === 0) {
      setLockoutTime(null);
      setAttempts(0);
      localStorage.removeItem("referrerLockout");
      setError("");
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime !== null) return;
    
    setError("");
    
    if (!checkPasswordValidity(password)) {
      setError("Password does not meet the security requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/referred_login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frontend_email: email,
          frontend_password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("referrerAuthToken", data.token);
        localStorage.setItem("referrerUserId", data.userId);
        localStorage.setItem("referrerAuthTime", Date.now().toString());
        navigate("/referrer/dashboard");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          const lockTime = 60; // 60 seconds lock
          localStorage.setItem("referrerLockout", (Date.now() + lockTime * 1000).toString());
          setLockoutTime(lockTime);
          setError("Too many failed attempts. Account temporarily locked.");
        } else {
          setError(data.message || `Invalid email or password. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.length > 0 && checkPasswordValidity(password) && lockoutTime === null;

  return (
    <div className="min-h-screen bg-premium-light flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 opacity-10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500 opacity-10 blur-3xl rounded-full" />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <Reveal>
        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-center mb-10 mt-2">
            <Link to="/" className="inline-block hover:opacity-80 transition-transform hover:scale-105">
              <div className="h-14 w-56 relative flex items-center justify-center">
                <img src="/logo/RIZE LOGO HORI PNG.png" alt="RizeWorld Logo" className="h-full w-full object-contain object-center drop-shadow-md scale-[5.5]" />
              </div>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Referrer Portal</h1>
            <p className="text-neutral-500 mb-8">Secure login for our partners and referrers.</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-200 flex items-start gap-3 animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {lockoutTime !== null && (
              <div className="bg-orange-50 text-orange-600 text-sm font-semibold p-4 rounded-xl mb-6 border border-orange-200 text-center animate-pulse">
                Account locked. Try again in {lockoutTime} seconds.
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    disabled={lockoutTime !== null}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="referrer@rizeworld.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={lockoutTime !== null}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PasswordRequirements password={password} />
              </div>

              <div className="flex justify-end pt-1">
                <Link to="/referrer/forget-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || lockoutTime !== null || !isFormValid}
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-blue flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Secure Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="text-center mt-6 text-sm text-neutral-400">
            Login with your registered email and the shared partner password.
          </div>
        </div>
      </Reveal>
    </div>
  );
}
