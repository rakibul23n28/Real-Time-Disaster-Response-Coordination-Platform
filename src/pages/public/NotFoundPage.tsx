import { Link } from "react-router-dom";
import Logo from "../../components/common/Logo";

export default function NotFoundPage() {
  return (
    <div className="min-h-full bg-[#F4FBF6] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="text-8xl font-black text-[#DCE6E0] mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-[#17221D] mb-2">এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।</h1>
        <p className="text-[#66736D] text-sm mb-8 leading-relaxed">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নামকরণ করা হয়েছে বা অস্থায়ীভাবে অনুপলব্ধ।
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D5B] text-white font-semibold rounded-[9px] hover:bg-[#185C43] transition-colors text-sm"
        >
          ← হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
