import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";

const skillOptions = ["উদ্ধার", "প্রাথমিক চিকিৎসা", "রান্না", "নৌচালনা", "গাড়ি চালানো", "যোগাযোগ", "লজিস্টিক্স"];
const districtOptions = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "ময়মনসিংহ", "রংপুর", "সুনামগঞ্জ", "কক্সবাজার"];

export default function RegisterPage() {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<"citizen" | "volunteer">("citizen");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("সকল ক্ষেত্র পূরণ করুন");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }

    if (formData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: role,
      });
      navigate(role === "citizen" ? "/citizen" : "/volunteer");
    } catch (err) {
      const message = err instanceof Error ? err.message : "নিবন্ধন ব্যর্থ হয়েছে";
      setError(message);
    } finally {
      setLoading(false);
    }
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

          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error || authError}</p>
            </div>
          )}

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-[#17221D] mb-3">আপনি কীভাবে প্ল্যাটফর্ম ব্যবহার করবেন?</p>
            <div className="grid grid-cols-2 gap-3">
              {(["citizen", "volunteer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
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
            <Input
              label="পূর্ণ নাম"
              type="text"
              name="name"
              placeholder="আপনার পূর্ণ নাম"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ইমেইল"
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="মোবাইল নম্বর"
                type="tel"
                name="phone"
                placeholder="01XXX-XXXXXX"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="পাসওয়ার্ড"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                label="পাসওয়ার্ড নিশ্চিত করুন"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

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
