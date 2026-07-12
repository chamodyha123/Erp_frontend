import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import authService from '../../services/authService';

type Step = 'email' | 'otp' | 'password' | 'success';

type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string>;
    };
  };
};

function getErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiError;
  const responseData = apiError.response?.data;

  if (responseData?.message) return responseData.message;

  if (responseData?.errors) {
    const firstError = Object.values(responseData.errors)[0];
    if (firstError) return firstError;
  }

  return fallback;
}

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (!email.trim()) {
      setError('Enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const responseMessage = await authService.forgotPassword(email.trim());
      setMessage(responseMessage);
      setStep('otp');
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to send the OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must contain exactly six digits.');
      return;
    }

    setLoading(true);
    try {
      const responseMessage = await authService.verifyResetOtp(email, otp);
      setMessage(responseMessage);
      setStep('password');
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'OTP verification failed. Check the code and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (newPassword.length < 8) {
      setError('The new password must contain at least eight characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, newPassword });
      setStep('success');
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to reset the password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    clearFeedback();
    setLoading(true);
    try {
      const responseMessage = await authService.forgotPassword(email);
      setOtp('');
      setMessage(responseMessage);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to resend the OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const title =
    step === 'email'
      ? 'Recover Access Key'
      : step === 'otp'
        ? 'Verify Security Code'
        : step === 'password'
          ? 'Create New Access Key'
          : 'Access Key Updated';

  const description =
    step === 'email'
      ? 'Enter the email address connected to your NexaERP account.'
      : step === 'otp'
        ? `Enter the six-digit code sent to ${email}.`
        : step === 'password'
          ? 'Choose a secure password containing at least eight characters.'
          : 'Your password has been reset successfully. You can now sign in.';

  return (
    <div className="min-h-screen bg-[#030712] text-blue-100 relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_10%_90%,rgba(37,99,235,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,#02050c_90%)]" />

      <main className="relative z-10 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:border-sky-500/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to login
        </button>

        <section className="rounded-3xl border border-blue-900/40 bg-slate-950/85 p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-2xl md:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-sky-950/40">
              {step === 'success' ? (
                <ShieldCheck className="h-7 w-7 text-white" />
              ) : (
                <KeyRound className="h-7 w-7 text-white" />
              )}
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400">
                NexaERP Security Layer
              </span>
              <h1 className="mt-1 text-xl font-bold text-white">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-blue-300/80">{description}</p>
            </div>
          </div>

          {step !== 'success' && (
            <div className="mb-6 grid grid-cols-3 gap-2">
              {['Email', 'OTP', 'Password'].map((label, index) => {
                const currentIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;
                const active = index <= currentIndex;
                return (
                  <div key={label} className="text-center">
                    <div className={`h-1.5 rounded-full ${active ? 'bg-sky-500' : 'bg-blue-950'}`} />
                    <span className={`mt-2 block text-[10px] font-bold uppercase tracking-wider ${active ? 'text-sky-300' : 'text-slate-600'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-blue-900/50 bg-blue-950/45 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-950/50 transition hover:from-blue-500 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Security Code
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label htmlFor="reset-otp" className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                  Six-Digit OTP
                </label>
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded-xl border border-blue-900/50 bg-blue-950/45 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:from-blue-500 hover:to-sky-500 disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify Security Code
              </button>

              <button type="button" onClick={handleResendOtp} disabled={loading} className="w-full text-xs font-semibold text-sky-400 transition hover:text-sky-300 disabled:opacity-50">
                Didn&apos;t receive the code? Resend OTP
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-xl border border-blue-900/50 bg-blue-950/45 py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white" aria-label="Toggle new password visibility">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-blue-900/50 bg-blue-950/45 py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/10"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white" aria-label="Toggle confirmation password visibility">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:from-blue-500 hover:to-sky-500 disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <button type="button" onClick={() => navigate('/login')} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:from-blue-500 hover:to-sky-500">
                Continue to Login
              </button>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          {message && step !== 'success' && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center font-mono text-xs text-emerald-400">
              {message}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 pt-5 font-mono text-[10px] uppercase tracking-wider text-blue-500/70">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
            Secure password recovery
          </div>
        </section>
      </main>
    </div>
  );
}
