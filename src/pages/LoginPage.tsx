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

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white/80 p-8 shadow-xl backdrop-blur-xl relative">
        <Link to="/" className="absolute top-4 left-4 text-ink/50 hover:text-ink transition flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} />
          Home
        </Link>
        <h1 className="text-center text-2xl font-bold text-ink mt-2">Welcome</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => setMode("login")} className={`px-4 py-2 text-sm font-medium rounded-md ${mode === "login" ? "bg-cedar text-white" : "text-ink/60 hover:bg-ink/5"}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`px-4 py-2 text-sm font-medium rounded-md ${mode === "signup" ? "bg-cedar text-white" : "text-ink/60 hover:bg-ink/5"}`}>Sign Up</button>
          <button onClick={() => setMode("phone")} className={`px-4 py-2 text-sm font-medium rounded-md ${mode === "phone" ? "bg-cedar text-white" : "text-ink/60 hover:bg-ink/5"}`}>Phone</button>
        </div>

        {error && <div className="mt-4 rounded-md bg-madder/10 p-3 text-sm text-madder">{error}</div>}
        {success && <div className="mt-4 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700">{success}</div>}

        <div className="mt-6">
          {mode === "phone" ? (
            !showOtpInput ? (
              <form onSubmit={handlePhoneSend} className="space-y-4">
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (+1234567890)" className="w-full rounded-md border p-3 text-sm" />
                <button disabled={submitting} className="w-full rounded-md bg-cedar py-3 text-white font-semibold">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <input required type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full rounded-md border p-3 text-sm tracking-widest text-center" />
                <button disabled={submitting} className="w-full rounded-md bg-cedar py-3 text-white font-semibold">Verify</button>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "signup" && <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full rounded-md border p-3 text-sm" />}
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border p-3 text-sm" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md border p-3 text-sm" />
              <button disabled={submitting} className="w-full rounded-md bg-cedar py-3 text-white font-semibold">{mode === "login" ? "Sign In" : "Sign Up"}</button>
            </form>
          )}

          <div className="mt-6">
            <button onClick={signInWithGoogle} className="w-full rounded-md border border-ink/20 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/5 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
