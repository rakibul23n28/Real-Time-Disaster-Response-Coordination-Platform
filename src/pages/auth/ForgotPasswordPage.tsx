import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-full bg-[#F4FBF6] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/"><Logo size="lg" /></Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE6E0] shadow-sm p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="size-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                <svg className="size-7 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#17221D] mb-2">ইমেইল পাঠানো হয়েছে</h2>
              <p className="text-sm text-[#66736D] mb-6">
                পাসওয়ার্ড রিসেটের লিংক আপনার ইমেইলে পাঠানো হয়েছে।
              </p>
              <Link to="/login" className="text-sm text-[#2E7D5B] font-medium hover:underline">লগইনে ফিরুন</Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#17221D]">পাসওয়ার্ড পুনরুদ্ধার</h1>
                <p className="text-sm text-[#66736D] mt-1">আপনার ইমেইল দিন, আমরা লিংক পাঠাব।</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="ইমেইল" type="email" placeholder="email@example.com" required />
                <Button type="submit" fullWidth loading={loading}>
                  পাসওয়ার্ড রিসেট লিংক পাঠান
                </Button>
              </form>
              <p className="text-sm text-center text-[#66736D] mt-5">
                <Link to="/login" className="text-[#2E7D5B] font-medium hover:underline">← লগইনে ফিরুন</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
