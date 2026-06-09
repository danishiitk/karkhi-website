import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "login" | "signup" | "phone";

export default function LoginPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (mode === "signup") {
      const err = await signUpWithEmail(email, password, fullName);
      if (err) setError(err);
      else setSuccess("Account created! Please check your email to confirm, then log in.");
    } else {
      const err = await signInWithEmail(email, password);
      if (err) setError(err);
    }
    setSubmitting(false);
  };

  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signInWithPhone(phone);
    if (err) setError(err);
    else setShowOtpInput(true);
    setSubmitting(false);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await verifyOtp(phone, otp);
    if (err) setError(err);
    setSubmitting(false);
  };

  const inputClass = "w-full rounded-xl border border-ink/10 bg-white/50 p-3.5 text-sm outline-none transition focus:border-cedar focus:bg-white focus:ring-2 focus:ring-cedar/20 placeholder-ink/30";

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-hero-gradient relative overflow-hidden">
      {/* Geometric background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3Cpath d='M40 10L70 40L40 70L10 40z'/%3E%3Cpath d='M40 20L60 40L40 60L20 40z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Decorative elements */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-cedar/5 animate-float" />
      <div className="absolute bottom-[15%] right-[12%] w-24 h-24 rounded-full bg-cedar/5 animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="w-full max-w-md rounded-2xl border border-white/10 glass-warm p-8 shadow-xl relative animate-scale-in">
        <Link to="/" className="absolute top-4 left-4 text-ink/40 hover:text-cedar transition flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} />
          Home
        </Link>
        
        <div className="text-center mt-2">
          <h1 className="text-2xl font-serif font-bold text-ink">Welcome</h1>
          <p className="text-sm text-ink/40 mt-1">Sign in to manage the family tree</p>
        </div>
        
        <div className="mt-6 flex justify-center gap-1 bg-ink/5 rounded-xl p-1">
          <button onClick={() => setMode("login")} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "login" ? "bg-cedar text-white shadow-sm" : "text-ink/50 hover:text-ink/80 hover:bg-ink/5"}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "signup" ? "bg-cedar text-white shadow-sm" : "text-ink/50 hover:text-ink/80 hover:bg-ink/5"}`}>Sign Up</button>
          <button onClick={() => setMode("phone")} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${mode === "phone" ? "bg-cedar text-white shadow-sm" : "text-ink/50 hover:text-ink/80 hover:bg-ink/5"}`}>Phone</button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-madder/10 p-3 text-sm text-madder border border-madder/20">{error}</div>}
        {success && <div className="mt-4 rounded-xl bg-emerald/10 p-3 text-sm text-emerald border border-emerald/20">{success}</div>}

        <div className="mt-6">
          {mode === "phone" ? (
            !showOtpInput ? (
              <form onSubmit={handlePhoneSend} className="space-y-4">
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (+1234567890)" className={inputClass} />
                <button disabled={submitting} className="w-full rounded-xl bg-gold-gradient py-3 text-onyx font-bold shadow-sm hover:shadow-glow-gold transition-all disabled:opacity-50">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <input required type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className={`${inputClass} tracking-[0.3em] text-center`} />
                <button disabled={submitting} className="w-full rounded-xl bg-gold-gradient py-3 text-onyx font-bold shadow-sm hover:shadow-glow-gold transition-all disabled:opacity-50">Verify</button>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "signup" && <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className={inputClass} />}
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} />
              <button disabled={submitting} className="w-full rounded-xl bg-gold-gradient py-3 text-onyx font-bold shadow-sm hover:shadow-glow-gold transition-all disabled:opacity-50">{mode === "login" ? "Sign In" : "Sign Up"}</button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink/10" /></div>
              <div className="relative flex justify-center"><span className="bg-mist/80 px-3 text-xs text-ink/40 font-medium">or continue with</span></div>
            </div>
            <button onClick={signInWithGoogle} className="w-full rounded-xl border border-ink/10 bg-white py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/5 hover:border-ink/20 transition-all shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
