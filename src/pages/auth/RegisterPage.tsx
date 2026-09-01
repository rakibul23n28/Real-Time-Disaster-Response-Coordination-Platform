import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { type UserRole } from "../../data/mockUsers";

const skillOptions = ["উদ্ধার", "প্রাথমিক চিকিৎসা", "রান্না", "নৌচালনা", "গাড়ি চালানো", "যোগাযোগ", "লজিস্টিক্স"];
const districtOptions = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "ময়মনসিংহ", "রংপুর", "সুনামগঞ্জ", "কক্সবাজার"];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"citizen" | "volunteer">("citizen");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(role as UserRole);
    navigate(role === "citizen" ? "/citizen" : "/volunteer");
  };

  return (
    <div className="min-h-full bg-[#F4FBF6] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17221D]">অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="text-sm text-[#66736D] mt-1">Create Account</p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-[#17221D] mb-3">আপনি কীভাবে প্ল্যাটফর্ম ব্যবহার করবেন?</p>
            <div className="grid grid-cols-2 gap-3">
              {(["citizen", "volunteer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    role === r
                      ? "border-[#2E7D5B] bg-[#E8F5E9] text-[#2E7D5B]"
                      : "border-[#DCE6E0] text-[#66736D] hover:border-[#b0c4b8]"
                  }`}
                >
                  {r === "citizen" ? "👤 নাগরিক" : "🛡️ স্বেচ্ছাসেবক"}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#66736D] mt-2">
              প্রশাসক অ্যাকাউন্ট পূর্বনির্ধারিত। পাবলিক নিবন্ধন নেই।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="পূর্ণ নাম" type="text" placeholder="আপনার পূর্ণ নাম" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="ইমেইল" type="email" placeholder="email@example.com" required />
              <Input label="মোবাইল নম্বর" type="tel" placeholder="01XXX-XXXXXX" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="পাসওয়ার্ড" type="password" placeholder="••••••••" required />
              <Input label="পাসওয়ার্ড নিশ্চিত করুন" type="password" placeholder="••••••••" required />
            </div>

            {/* Volunteer extras */}
            {role === "volunteer" && (
              <div className="space-y-4 pt-2 border-t border-[#DCE6E0]">
                <p className="text-xs font-semibold text-[#66736D] uppercase tracking-wide">স্বেচ্ছাসেবক তথ্য</p>
                <div>
                  <label className="text-sm font-medium text-[#17221D] block mb-1.5">দক্ষতার ধরন</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((s) => (
                      <label key={s} className="flex items-center gap-1.5 text-sm text-[#66736D] cursor-pointer">
                        <input type="checkbox" className="accent-[#2E7D5B] rounded" />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#17221D] block mb-1.5">এলাকা</label>
                  <select className="w-full border border-[#DCE6E0] rounded-[9px] px-3 py-2 text-sm text-[#17221D] bg-white hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:outline-none">
                    <option value="">জেলা নির্বাচন করুন</option>
                    {districtOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <Input label="জরুরি যোগাযোগ নম্বর" type="tel" placeholder="01XXX-XXXXXX" />
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} className="mt-2">
              নিবন্ধন করুন
            </Button>
          </form>

          <p className="text-sm text-center text-[#66736D] mt-5">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link to="/login" className="text-[#2E7D5B] font-medium hover:underline">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
