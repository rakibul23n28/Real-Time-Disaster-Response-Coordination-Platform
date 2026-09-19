import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Logo from "../../components/common/Logo";
import DisasterMap from "../../components/maps/DisasterMap";
import { apiClient, type Incident, type LandingStats } from "../../lib/api";

const statLabels = [
  { key: "totalReports", label: "মোট রিপোর্ট", sub: "Total Reports" },
  { key: "verifiedIncidents", label: "যাচাইকৃত ঘটনা", sub: "Verified Incidents" },
  { key: "activeVolunteers", label: "সক্রিয় স্বেচ্ছাসেবক", sub: "Active Volunteers" },
  { key: "activeZones", label: "সক্রিয় দুর্যোগ এলাকা", sub: "Active Disaster Zones" },
] as const;

const emptyStats: LandingStats = {
  totalReports: 0,
  verifiedIncidents: 0,
  activeVolunteers: 0,
  activeZones: 0,
};

function useCountUp(target: number, duration = 1800, start = false): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, label, sub, animate }: { value: number; label: string; sub: string; animate: boolean }) {
  const count = useCountUp(value, 1600, animate);
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-[#2E7D5B]">{animate ? count.toLocaleString("bn-BD") : value.toLocaleString("bn-BD")}</p>
      <p className="text-base font-semibold text-[#17221D] mt-1">{label}</p>
      <p className="text-xs text-[#66736D]">{sub}</p>
    </div>
  );
}

const problems = [
  { num: "১", title: "সমন্বয়ের অভাব", desc: "বিভিন্ন সংস্থা ও স্বেচ্ছাসেবক আলাদাভাবে কাজ করলে জরুরি সহায়তা পৌঁছাতে দেরি হয়।" },
  { num: "২", title: "তথ্যের বিলম্ব", desc: "ম্যানুয়াল যোগাযোগের কারণে গুরুত্বপূর্ণ তথ্য দ্রুত ছড়িয়ে পড়ে না।" },
  { num: "৩", title: "ত্রাণের অপচয়", desc: "একই এলাকায় অতিরিক্ত সহায়তা গেলেও অন্য এলাকায় প্রয়োজনীয় সামগ্রী পৌঁছাতে পারে না।" },
  { num: "৪", title: "অগ্রাধিকার নির্ধারণের সমস্যা", desc: "কোন এলাকায় আগে সহায়তা পাঠানো উচিত তা নির্ধারণ করা কঠিন হয়।" },
];

const steps = [
  { num: "০১", title: "তথ্য দিন", desc: "নাগরিক দুর্যোগের তথ্য ও অবস্থান পাঠায়।", icon: "📍" },
  { num: "০২", title: "যাচাই করুন", desc: "প্রশাসক রিপোর্ট যাচাই করে।", icon: "✅" },
  { num: "০৩", title: "তীব্রতা নির্ধারণ", desc: "সিস্টেম দুর্যোগের তীব্রতা অনুযায়ী অগ্রাধিকার নির্ধারণ করে।", icon: "📊" },
  { num: "০৪", title: "সহায়তা বরাদ্দ", desc: "প্রয়োজন অনুযায়ী ত্রাণ ও সম্পদ বরাদ্দ করা হয়।", icon: "📦" },
  { num: "০৫", title: "মাঠপর্যায়ে কার্যক্রম", desc: "স্বেচ্ছাসেবক কাজ গ্রহণ করে এবং অগ্রগতি আপডেট করে।", icon: "🤝" },
];

const features = [
  { icon: "🚨", title: "রিয়েল-টাইম দুর্যোগ রিপোর্টিং", sub: "Live Incident Reporting", desc: "নাগরিক দুর্যোগের তথ্য অবস্থান ও ছবি সহ জমা দিতে পারে।" },
  { icon: "🗺️", title: "ইন্টার‌্যাক্টিভ দুর্যোগ মানচিত্র", sub: "Interactive Map", desc: "ক্ষতিগ্রস্ত এলাকা, আশ্রয়কেন্দ্র ও সম্পদের অবস্থান দেখুন।" },
  { icon: "📋", title: "স্বেচ্ছাসেবক কাজের ট্র্যাকিং", sub: "Volunteer Task Tracking", desc: "স্বেচ্ছাসেবক কাজ গ্রহণ করে এবং অবস্থা আপডেট করতে পারে।" },
  { icon: "🚩", title: "মাঠপর্যায়ের সমস্যা জানানো", sub: "Field Exception Tagging", desc: "রাস্তা বন্ধ, নৌকা প্রয়োজন, চিকিৎসা সহায়তা দ্রুত জানান।" },
  { icon: "✔️", title: "রিপোর্ট যাচাই", sub: "Admin Verification", desc: "প্রশাসক নাগরিকের রিপোর্ট যাচাই করে কার্যক্রম শুরু করে।" },
  { icon: "📈", title: "দুর্যোগের তীব্রতা নির্ধারণ", sub: "Severity Scoring", desc: "ক্ষতিগ্রস্ত এলাকা তীব্রতা অনুযায়ী র‍্যাংক করা হয়।" },
  { icon: "🏥", title: "ত্রাণ বরাদ্দ", sub: "Resource Allocation", desc: "উপলব্ধ সম্পদ উচ্চ-অগ্রাধিকার এলাকায় বরাদ্দ করা হয়।" },
  { icon: "🗄️", title: "ত্রাণ মজুত ব্যবস্থাপনা", sub: "Inventory Management", desc: "খাদ্য, ওষুধ, পানি ও অন্যান্য সম্পদ ট্র্যাক করুন।" },
];

const roles = [
  {
    icon: "👤",
    title: "নাগরিক / তথ্যদাতা",
    sub: "Citizen / Reporter",
    items: ["নিবন্ধন ও লগইন", "দুর্যোগের তথ্য প্রদান", "ছবি আপলোড", "অবস্থান শেয়ার", "রিপোর্টের অবস্থা দেখা"],
    cta: "নাগরিক হিসেবে শুরু করুন",
    path: "/login",
    color: "border-[#2E7D5B]",
    badge: "bg-[#E8F5E9] text-[#2E7D5B]",
  },
  {
    icon: "🛡️",
    title: "স্বেচ্ছাসেবক / মাঠকর্মী",
    sub: "Volunteer / Field Worker",
    items: ["দুর্যোগ মানচিত্র দেখা", "কাজ গ্রহণ", "কাজের অবস্থা আপডেট", "মাঠপর্যায়ের সমস্যা জানানো"],
    cta: "স্বেচ্ছাসেবক হিসেবে শুরু করুন",
    path: "/login",
    color: "border-[#2563EB]",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    icon: "⚙️",
    title: "সমন্বয়কারী / প্রশাসক",
    sub: "Coordinator / Admin",
    items: ["রিপোর্ট যাচাই", "দুর্যোগ এলাকা পর্যবেক্ষণ", "ত্রাণ বরাদ্দ", "মজুত ব্যবস্থাপনা", "কার্যক্রম পর্যবেক্ষণ"],
    cta: "প্রশাসনিক প্যানেল",
    path: "/login",
    color: "border-[#F59E0B]",
    badge: "bg-amber-50 text-amber-700",
  },
];

const footerLinks = {
  "প্ল্যাটফর্ম": ["আমাদের সম্পর্কে", "কীভাবে কাজ করে", "বৈশিষ্ট্য"],
  "ব্যবহারকারী": ["নাগরিক", "স্বেচ্ছাসেবক", "প্রশাসন"],
  "সহায়তা": ["সাহায্য", "যোগাযোগ", "জরুরি নির্দেশনা"],
};

export default function LandingPage() {
  const [landingStats, setLandingStats] = useState<LandingStats>(emptyStats);
  const [landingIncidents, setLandingIncidents] = useState<Incident[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    apiClient.getPublicLandingData().then(({ stats, incidents }) => {
      setLandingStats(stats);
      setLandingIncidents(incidents);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-full bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#DCE6E0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-6">
            {(
              [
                { label: "হোম", href: "#hero" },
                { label: "কীভাবে কাজ করে", href: "#how-it-works" },
                { label: "আমাদের লক্ষ্য", href: "#mission" },
                { label: "যোগাযোগ", href: "#contact" },
              ] as const
            ).map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-[#66736D] hover:text-[#17221D] transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:flex px-4 py-2 text-sm font-medium text-[#2E7D5B] hover:text-[#185C43] transition-colors"
            >
              লগইন
            </Link>
            <Link
              to="/register"
              className="hidden sm:flex px-4 py-2 text-sm font-medium bg-[#E8F5E9] text-[#2E7D5B] rounded-[9px] hover:bg-[#d4ede0] transition-colors"
            >
              নিবন্ধন
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium bg-[#2E7D5B] text-white rounded-[9px] hover:bg-[#185C43] transition-colors"
            >
              জরুরি তথ্য দিন
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-[#66736D] hover:bg-[#F4FBF6]"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="মেনু"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileNav && (
          <div className="md:hidden border-t border-[#DCE6E0] bg-white px-4 py-3 space-y-1">
            {(
              [
                { label: "হোম", href: "#hero" },
                { label: "কীভাবে কাজ করে", href: "#how-it-works" },
                { label: "আমাদের লক্ষ্য", href: "#mission" },
                { label: "যোগাযোগ", href: "#contact" },
              ] as const
            ).map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMobileNav(false)} className="block py-2 text-sm font-medium text-[#66736D]">{item.label}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 text-center py-2 text-sm font-medium border border-[#DCE6E0] rounded-lg text-[#17221D]">লগইন</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-sm font-medium bg-[#2E7D5B] rounded-lg text-white">নিবন্ধন</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-b border-red-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">
              <span className="font-bold">জরুরি পরিস্থিতি?</span> নিকটস্থ বিপদ সম্পর্কে এখনই তথ্য দিন।
            </p>
          </div>
          <Link
            to="/login"
            className="flex-shrink-0 px-4 py-1.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            রিপোর্ট করুন
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section id="hero" className="bg-[#F4FBF6] border-b border-[#DCE6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8F5E9] border border-[#b8ddc5] rounded-full px-3 py-1 mb-5">
                <span className="size-2 rounded-full bg-[#2E7D5B]" />
                <span className="text-xs font-semibold text-[#2E7D5B]">বাংলাদেশ দুর্যোগ ব্যবস্থাপনা প্ল্যাটফর্ম</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#17221D] leading-tight mb-4">
                দুর্যোগের সময় দ্রুত সাড়া,<br />
                <span className="text-[#2E7D5B]">একসাথে সমন্বিত উদ্যোগ</span>
              </h1>
              <p className="text-base text-[#66736D] leading-relaxed mb-8">
                নাগরিক, স্বেচ্ছাসেবক এবং প্রশাসনকে একটি প্ল্যাটফর্মে যুক্ত করে দুর্যোগ মোকাবিলায় দ্রুত ও কার্যকর সমন্বয়।
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-[#2E7D5B] text-white font-semibold rounded-[10px] hover:bg-[#185C43] transition-colors shadow-sm"
                >
                  দুর্যোগের তথ্য দিন
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 border border-[#DCE6E0] text-[#17221D] font-semibold rounded-[10px] hover:border-[#2E7D5B] hover:text-[#2E7D5B] bg-white transition-colors"
                >
                  প্ল্যাটফর্ম সম্পর্কে জানুন
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <DisasterMap height="360px" incidents={landingIncidents} />
              <div className="flex items-center gap-4 justify-center">
                <span className="flex items-center gap-1.5 text-xs text-[#66736D]">
                  <span className="size-3 rounded-full bg-[#DC2626]" /> উচ্চ ঝুঁকি
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#66736D]">
                  <span className="size-3 rounded-full bg-[#F59E0B]" /> মাঝারি ঝুঁকি
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#66736D]">
                  <span className="size-3 rounded-full bg-[#16A34A]" /> পর্যবেক্ষণে
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#DCE6E0]" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statLabels.map((stat) => (
              <StatItem key={stat.label} value={landingStats[stat.key]} label={stat.label} sub={stat.sub} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-[#F7F9F8] border-b border-[#DCE6E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17221D]">কেন এই প্ল্যাটফর্ম?</h2>
            <p className="text-[#66736D] mt-2 text-sm">বাংলাদেশের দুর্যোগ ব্যবস্থাপনার মূল সমস্যাগুলো</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problems.map((p) => (
              <div key={p.num} className="bg-white rounded-xl border border-[#DCE6E0] p-5 hover:border-[#2E7D5B] transition-colors group">
                <div className="size-9 rounded-lg bg-[#E8F5E9] text-[#2E7D5B] font-bold text-sm flex items-center justify-center mb-3 group-hover:bg-[#2E7D5B] group-hover:text-white transition-colors">
                  {p.num}
                </div>
                <h3 className="font-semibold text-[#17221D] mb-2">{p.title}</h3>
                <p className="text-sm text-[#66736D] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-b border-[#DCE6E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17221D]">কীভাবে কাজ করে</h2>
            <p className="text-[#66736D] mt-2 text-sm">রিপোর্ট থেকে মাঠ পর্যায়ের কার্যক্রম পর্যন্ত ৫টি ধাপ</p>
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start gap-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex-1 relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-[#DCE6E0] z-0" />
                )}
                <div className="relative z-10 inline-flex flex-col items-center">
                  <div className="size-10 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center mb-3 text-lg">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono text-[#2E7D5B] font-semibold mb-1">{step.num}</span>
                  <h3 className="font-semibold text-[#17221D] text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-[#66736D] leading-relaxed max-w-[130px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-10 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center text-lg flex-shrink-0">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-[#DCE6E0] mt-1" />}
                </div>
                <div className="pb-4">
                  <span className="text-xs font-mono text-[#2E7D5B] font-semibold">{step.num}</span>
                  <h3 className="font-semibold text-[#17221D] mt-0.5">{step.title}</h3>
                  <p className="text-sm text-[#66736D] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F4FBF6] border-b border-[#DCE6E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17221D]">মূল বৈশিষ্ট্যসমূহ</h2>
            <p className="text-[#66736D] mt-2 text-sm">Core Features</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-[#DCE6E0] p-5 hover:shadow-md transition-shadow">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-[#17221D] text-sm mb-0.5">{f.title}</h3>
                <p className="text-[11px] text-[#2E7D5B] font-medium mb-2">{f.sub}</p>
                <p className="text-xs text-[#66736D] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map preview */}
      <section className="bg-white border-b border-[#DCE6E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17221D]">বর্তমান দুর্যোগ পরিস্থিতি</h2>
            <p className="text-[#66736D] mt-2 text-sm">Current Disaster Situation — Live Demo Map</p>
          </div>
          <DisasterMap height="420px" incidents={landingIncidents} />
          <div className="flex items-center gap-6 justify-center mt-4 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-[#66736D]">
              <span className="size-3.5 rounded-full bg-[#DC2626]" /> উচ্চ ঝুঁকি
            </span>
            <span className="flex items-center gap-2 text-sm text-[#66736D]">
              <span className="size-3.5 rounded-full bg-[#F59E0B]" /> মাঝারি ঝুঁকি
            </span>
            <span className="flex items-center gap-2 text-sm text-[#66736D]">
              <span className="size-3.5 rounded-full bg-[#16A34A]" /> পর্যবেক্ষণে
            </span>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="mission" className="bg-[#F7F9F8] border-b border-[#DCE6E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17221D]">কারা ব্যবহার করবেন?</h2>
            <p className="text-[#66736D] mt-2 text-sm">তিনটি ভূমিকায় প্ল্যাটফর্ম ব্যবহার করুন</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.title} className={`bg-white rounded-2xl border-2 ${role.color} p-6 hover:shadow-lg transition-shadow`}>
                <div className={`inline-flex items-center gap-2 ${role.badge} rounded-full px-3 py-1 mb-4`}>
                  <span className="text-lg">{role.icon}</span>
                  <span className="text-xs font-semibold">{role.sub}</span>
                </div>
                <h3 className="font-bold text-[#17221D] text-lg mb-4">{role.title}</h3>
                <ul className="space-y-2 mb-6">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#66736D]">
                      <span className="size-1.5 rounded-full bg-[#2E7D5B] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={role.path}
                  className="block text-center py-2.5 px-4 rounded-[9px] text-sm font-semibold bg-[#2E7D5B] text-white hover:bg-[#185C43] transition-colors"
                >
                  {role.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#17221D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="size-8 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white font-bold text-sm">দ</div>
                  <div>
                    <p className="font-bold text-white text-sm">দুর্যোগ সাড়া</p>
                    <p className="text-[10px] text-[#66736D] uppercase tracking-wide">Disaster Response</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#9aada4] leading-relaxed">
                সমন্বিত উদ্যোগে দ্রুত প্রতিক্রিয়া।<br />
                Coordinated rapid response to disasters.
              </p>
            </div>
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-semibold text-white text-sm mb-3">{section}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[#9aada4] hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2E7D5B]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-[#9aada4]">দুর্যোগ সাড়া — সমন্বিত উদ্যোগে দ্রুত প্রতিক্রিয়া।</p>
            <p className="text-sm text-[#9aada4]">© 2026 Disaster Response Coordination Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
