import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import DisasterMap from "../../components/maps/DisasterMap";

export default function LoginPage() {
  const { login, error: authError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectMap: Record<string, string> = {
    citizen: "/citizen",
    volunteer: "/volunteer",
    admin: "/admin",
  };

  const from = (location.state as { from?: string } | null)?.from ?? null;

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from || redirectMap[user.role] || "/citizen", { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("প্লিজ ইমেইল এবং পাসওয়ার্ড প্রবেশ করুন");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      const userRole = localStorage.getItem("duryog-user");
      const target = from || (userRole ? JSON.parse(userRole)?.role : null);
      navigate(target ? redirectMap[target] || "/citizen" : "/citizen", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "লগইন ব্যর্থ হয়েছে";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#F4FBF6] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#17221D] p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-9 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white font-bold">দ</div>
              <div>
                <p className="font-bold text-white">দুর্যোগ সাড়া</p>
                <p className="text-[10px] text-[#66736D] uppercase tracking-wide">Disaster Response</p>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            একসাথে কাজ করি,<br />
            <span className="text-[#4ade80]">দুর্যোগ মোকাবিলা করি</span>
          </h2>
          <p className="text-[#9aada4] text-sm leading-relaxed mb-8">
            বাংলাদেশের নাগরিক, স্বেচ্ছাসেবক ও প্রশাসনকে একত্রিত করে দুর্যোগ ব্যবস্থাপনার প্ল্যাটফর্ম।
          </p>
        </div>

        <div className="relative z-10 flex-1 min-h-0">
          <DisasterMap height="100%" />
        </div>

        {/* Decorative bg */}
        <div className="absolute bottom-0 right-0 size-64 bg-[#2E7D5B]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#17221D]">স্বাগতম</h1>
              <p className="text-sm text-[#66736D] mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
            </div>

            {(error || authError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error || authError}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#DCE6E0]" />
              <span className="text-xs text-[#66736D]">আপনার অ্যাকাউন্টে লগইন করুন</span>
              <div className="flex-1 h-px bg-[#DCE6E0]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ইমেইল"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <Input
                label="পাসওয়ার্ড"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#66736D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-[#DCE6E0] accent-[#2E7D5B]"
                  />
                  আমাকে মনে রাখুন
                </label>
                <Link to="/forgot-password" className="text-sm text-[#2E7D5B] hover:underline font-medium">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <Button type="submit" fullWidth loading={loading}>
                লগইন করুন
              </Button>
            </form>

            <p className="text-sm text-center text-[#66736D] mt-5">
              নতুন ব্যবহারকারী?{" "}
              <Link to="/register" className="text-[#2E7D5B] font-medium hover:underline">
                নতুন অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
