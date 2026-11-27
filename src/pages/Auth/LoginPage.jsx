import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Layers,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';
import notechIcon from '../../assets/notech-icon.png';
import loginVideo from '../../assets/login-bg.mp4';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, addToast, supabaseConfigured } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cinematic full-screen video intro -> smooth, measured slide to half-screen split
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplit(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-fill Super Admin credentials
  const handleAutoFill = () => {
    setEmail('h.gray@localindustries.org');
    setPassword('SuperAdmin#2026');
    setIsAutoFilled(true);
    addToast('Super Admin credentials auto-filled', 'success', 2500);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter an administrator email address', 'error');
      return;
    }
    if (supabaseConfigured && !password) {
      addToast('Please enter your password', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      addToast(
        supabaseConfigured
          ? 'Authenticated via Supabase'
          : 'Authenticated as Super Admin (Harrison Gray)',
        'success'
      );
      navigate('/', { replace: true });
    } catch (err) {
      addToast(err?.message || 'Authentication failed. Check your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#0E1013] text-[#121417] dark:text-[#E4E7EB] font-sans antialiased overflow-x-hidden">
      {/* ========================================================= */}
      {/* LEFT SECTION: Ambient Industrial Video & Ops Hero          */}
      {/* Starts full-screen, then measuredly glides to 50% split    */}
      {/* ========================================================= */}
      <div
        onClick={() => { if (!isSplit) setIsSplit(true); }}
        className={`
          bg-[#121417] text-white p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between relative overflow-hidden lg:flex-shrink-0
          transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isSplit 
            ? 'w-full lg:w-1/2 min-h-[500px] lg:min-h-screen' 
            : 'w-full lg:w-full min-h-screen cursor-pointer'}
        `}
      >
        {/* Ambient Industrial Video Background - Scaled to crop out baked-in video text */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.32] origin-bottom pointer-events-none select-none"
        >
          <source src={loginVideo} type="video/mp4" />
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient Directional Contrast Protection - Keeps video bright while ensuring 100% text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10 flex items-center gap-3.5">
          <img
            src={notechIcon}
            alt="No-Tech HVAC"
            className="h-10 sm:h-12 w-auto object-contain select-none drop-shadow-lg"
          />
          <div className="font-display flex items-center text-xl sm:text-2xl font-bold tracking-[-0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            <span className="text-white">No-Tech </span>
            <span className="bg-gradient-to-r from-[#D8E6AF] via-[#9CB35F] to-[#788A4E] bg-clip-text text-transparent ml-1.5">HVAC</span>
          </div>
        </div>

        {/* Middle: Headline, Value Proposition, and Concise Capability Grid */}
        <div className="relative z-10 my-auto py-10 lg:py-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#9CB35F]/35 text-[11px] font-mono font-semibold text-[#D8E6AF] uppercase tracking-[0.14em] mb-4 w-fit shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CB35F] animate-pulse" />
            OPERATIONS CONSOLE
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-[-0.03em] leading-[1.12] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
            Operations &amp; <span className="bg-gradient-to-r from-[#D8E6AF] via-[#9CB35F] to-[#889C55] bg-clip-text text-transparent">Production Control</span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-[#E2E6D5] font-normal leading-relaxed max-w-lg tracking-[-0.01em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Real-time assembly telemetry, contractor dispatch, and certified compliance.
          </p>

          {/* 3 Core Highlights - Clean Unified Engineering Spec-Shelf */}
          <div className="mt-8 border border-white/15 bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 max-w-xl">
            <div className="sm:pr-5">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#9CB35F]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9CB35F]">01 &middot; Production</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-white tracking-tight mt-1.5 drop-shadow-md">
                Batch Tracking
              </div>
              <div className="text-xs text-[#CCD4BE] mt-0.5 leading-snug drop-shadow-sm">
                Reservation lifecycle
              </div>
            </div>

            <div className="sm:border-l sm:border-white/15 sm:px-5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-[#9CB35F]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9CB35F]">02 &middot; Network</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-white tracking-tight mt-1.5 drop-shadow-md">
                Contractors
              </div>
              <div className="text-xs text-[#CCD4BE] mt-0.5 leading-snug drop-shadow-sm">
                Dispatch &amp; approvals
              </div>
            </div>

            <div className="sm:border-l sm:border-white/15 sm:pl-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9CB35F]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9CB35F]">03 &middot; Integrity</span>
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-white tracking-tight mt-1.5 drop-shadow-md">
                QC Standards
              </div>
              <div className="text-xs text-[#CCD4BE] mt-0.5 leading-snug drop-shadow-sm">
                Zero-loss compliance
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Restricted System Notice & Live Telemetry Badge */}
        <div className="relative z-10 pt-6 flex items-center justify-between text-[11px] font-mono text-[#DCE1CF]/85 drop-shadow-md">
          <span>&copy; 2026 No-Tech HVAC &middot; Industrial Ops</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-[#A4A77E]/30 text-[#CCD4BE] text-[10px] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A4A77E] animate-pulse" />
            Telemetry Live
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SECTION: Super Admin Sign-In Form                   */}
      {/* Full-bleed pure white side, measuredly slides in from rgt */}
      {/* ========================================================= */}
      <div
        className={`
          flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#1A1D21] lg:flex-shrink-0
          transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isSplit
            ? 'w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 xl:px-20 py-12 opacity-100 translate-x-0'
            : 'w-full lg:w-0 max-h-0 lg:max-h-none p-0 lg:p-0 opacity-0 translate-x-12 overflow-hidden pointer-events-none'}
        `}
      >
        <div
          className={`w-full max-w-[480px] my-auto transition-all duration-[1100ms] delay-400 ${
            isSplit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Top Pill: ADMIN ACCESS ONLY */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#EFEFEA] dark:bg-[#252A20] text-[#555845] dark:text-[#C5CAAE] border-0 select-none">
            <Shield className="w-3.5 h-3.5 text-[#737953] dark:text-[#A4A77E]" />
            <span>ADMIN ACCESS ONLY</span>
          </div>

          {/* Heading & Subhead */}
          <h2 className="font-display text-2xl sm:text-[32px] font-bold text-slate-900 dark:text-white tracking-[-0.025em] mt-5 leading-tight">
            Sign in to the admin dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter your administrator credentials to continue.
          </p>

          {/* Quick Auto-Fill Banner */}
          <div className="mt-5 p-3 sm:p-3.5 rounded-2xl bg-[#F6F7F2] dark:bg-[#22262C] border border-[#E2E5D8]/80 dark:border-white/5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A4A77E]" />
                <span>Super Admin Quick Access</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate mt-0.5">
                h.gray@localindustries.org
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFill}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A4A77E] hover:bg-[#8F926B] active:scale-95 text-slate-950 font-bold text-xs shadow-xs cursor-pointer transition-all border-0"
            >
              {isAutoFilled ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto-Filled</span>
                </>
              ) : (
                <span>Auto-Fill Credentials</span>
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
            {/* Work Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Work email
              </label>
              <div className="relative rounded-xl border border-slate-200/90 dark:border-[#383E47] focus-within:border-[#A4A77E] focus-within:ring-2 focus-within:ring-[#A4A77E]/25 bg-[#FAFAFA] dark:bg-[#22262C] focus-within:bg-white dark:focus-within:bg-[#22262C] transition-all">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@notechhvac.com"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl border border-slate-200/90 dark:border-[#383E47] focus-within:border-[#A4A77E] focus-within:ring-2 focus-within:ring-[#A4A77E]/25 bg-[#FAFAFA] dark:bg-[#22262C] focus-within:bg-white dark:focus-within:bg-[#22262C] transition-all">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl outline-none bg-transparent font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep Signed In & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5 text-xs sm:text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#A4A77E] focus:ring-[#A4A77E] accent-[#A4A77E] cursor-pointer"
                />
                <span className="font-medium">Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  addToast('For security, password resets require contacting Super Admin.', 'info')
                }
                className="font-semibold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Primary Action Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 sm:py-4 px-4 rounded-xl bg-[#121417] hover:bg-black dark:bg-[#252A30] dark:hover:bg-[#2F353D] text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] cursor-pointer transition-all border-0"
            >
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Security Notice */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-start gap-2.5 text-xs text-slate-400 dark:text-slate-500 leading-normal">
            <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              This area is limited to authorized administrators. Every sign-in is logged.
            </span>
          </div>

          {/* Under Form: Need Access */}
          <div className="text-center mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Need access?{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Contact your Super Admin.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
