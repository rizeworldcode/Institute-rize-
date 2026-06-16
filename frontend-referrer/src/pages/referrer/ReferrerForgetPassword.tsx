import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Key, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Reveal from "../../components/Reveal";
import { PasswordRequirements, checkPasswordValidity } from "./ReferrerLogin";

export default function ReferrerForgetPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // OTP logic
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [resendCount, setResendCount] = useState(0);
  const MAX_RESEND = 3;

  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (resendCount >= MAX_RESEND) {
      setError("Maximum OTP resend limit reached. Please try again later.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/sendOtpTOadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setTimer(300); // Reset to 5 mins
        setResendCount(prev => prev + 1);
        setOtp("");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (timer === 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    if (otp.length !== 4) {
      setError("OTP must be exactly 4 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkPasswordValidity(password)) {
      setError("Password does not meet the strict security requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/admin_forgatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(4);
        setTimeout(() => {
          navigate("/referrer/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-light flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500 opacity-10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 opacity-10 blur-3xl rounded-full" />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <Reveal>
        <div className="w-full max-w-md relative z-10">
          {step < 4 && (
            <Link to="/referrer/login" className="inline-flex items-center gap-2 mb-8 text-neutral-500 hover:text-neutral-900 font-semibold transition-colors">
              <ArrowLeft size={18} /> Back to Login
            </Link>
          )}

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-200 flex items-start gap-3 animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Reset Password</h1>
                <p className="text-neutral-500 mb-8">Enter your registered partner email to receive an OTP.</p>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="partner@rizeworld.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 border border-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email || resendCount >= MAX_RESEND}
                    className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-orange flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Secure OTP"}
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Verify OTP</h1>
                <p className="text-neutral-500 mb-6">We sent a secure 4-digit code to <span className="font-semibold text-neutral-800">{email}</span></p>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                   <span className="text-sm font-semibold text-neutral-700">Code expires in:</span>
                   <span className={`font-mono text-lg font-bold ${timer <= 60 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                     {formatTime(timer)}
                   </span>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">4-Digit OTP</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        maxLength={4}
                        disabled={timer === 0}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                        placeholder="0000"
                        className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/50 border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all text-neutral-900 placeholder:text-neutral-300 font-mono text-center text-2xl tracking-[0.5em] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Didn't receive code?</span>
                    <button 
                      type="button" 
                      onClick={() => handleSendOTP()}
                      disabled={timer > 0 || resendCount >= MAX_RESEND || loading} 
                      className={`font-semibold ${timer > 0 || resendCount >= MAX_RESEND ? 'text-neutral-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      {resendCount >= MAX_RESEND ? 'Limit Reached' : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 4 || timer === 0}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-blue flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify OTP"}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">New Password</h1>
                <p className="text-neutral-500 mb-8">Secure your account with a strong new password.</p>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 border border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-neutral-900"
                      />
                    </div>
                    <PasswordRequirements password={password} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 border ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:ring-red-500' : confirmPassword && password === confirmPassword ? 'border-[#10b981] focus:ring-[#10b981]' : 'border-neutral-200 focus:ring-blue-500'} focus:ring-1 focus:outline-none transition-all text-neutral-900`}
                      />
                      {confirmPassword && password === confirmPassword && (
                        <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#10b981]" />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !checkPasswordValidity(password) || password !== confirmPassword}
                    className="w-full mt-4 py-4 rounded-xl bg-[#10b981] text-white font-bold shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 scale-up">
                  <CheckCircle2 size={40} className="text-[#10b981]" />
                </div>
                <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Password Updated!</h1>
                <p className="text-neutral-500">Your password has been successfully reset using secure hashing. Redirecting to login...</p>
              </div>
            )}

          </div>
        </div>
      </Reveal>
    </div>
  );
}
