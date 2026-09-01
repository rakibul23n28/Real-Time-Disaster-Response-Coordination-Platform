import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppState } from "../../hooks/useAppState";

const roleLabels: Record<string, string> = {
  citizen: "নাগরিক",
  volunteer: "স্বেচ্ছাসেবক",
  admin: "প্রশাসক",
};

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const { notifications, markNotificationsRead } = useAppState();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifTypeIcon: Record<string, string> = {
    task: "📋",
    report: "📄",
    alert: "🚨",
    resource: "📦",
  };

  return (
    <header className="h-14 bg-white border-b border-[#DCE6E0] flex items-center gap-3 px-4 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-[#66736D] hover:bg-[#F4FBF6]"
        aria-label="মেনু"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-[#17221D] truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Demo mode badge */}
        <div className="hidden sm:flex items-center gap-1 bg-[#E8F5E9] border border-[#b8ddc5] rounded-full px-2.5 py-0.5 cursor-default" title="এই সংস্করণে প্রদর্শনের জন্য ডেমো ডেটা ব্যবহার করা হচ্ছে।">
          <span className="size-1.5 rounded-full bg-[#2E7D5B]" />
          <span className="text-[10px] font-semibold text-[#2E7D5B]">ডেমো</span>
        </div>

        {/* Emergency status */}
        <div className="hidden sm:flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
          <span className="size-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-red-700">৪টি সক্রিয় ঘটনা</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif((v) => !v); setShowUser(false); }}
            className="relative p-2 rounded-lg text-[#66736D] hover:bg-[#F4FBF6] transition-colors"
            aria-label="নোটিফিকেশন"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl border border-[#DCE6E0] shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#DCE6E0] flex items-center justify-between">
                <span className="font-semibold text-sm text-[#17221D]">নোটিফিকেশন</span>
                {unread > 0 && (
                  <button onClick={markNotificationsRead} className="text-xs text-[#2E7D5B] font-medium hover:underline">
                    {unread}টি নতুন · সব পড়া হয়েছে
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-sm text-[#66736D] text-center py-6">কোনো নোটিফিকেশন নেই।</p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    role={n.link ? "button" : undefined}
                    onClick={() => { if (n.link) { setShowNotif(false); navigate(n.link); } }}
                    className={`px-4 py-3 border-b border-[#F4FBF6] transition-colors ${!n.read ? "bg-[#F4FBF6]" : ""} ${n.link ? "hover:bg-[#E8F5E9] cursor-pointer" : "hover:bg-[#F4FBF6]"}`}
                  >
                    <div className="flex gap-3">
                      <span className="text-lg flex-shrink-0">{notifTypeIcon[n.type] ?? "📣"}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-[#17221D] leading-snug">{n.message}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-[#66736D]">{n.time}</p>
                          {n.link && <span className="text-[10px] text-[#2E7D5B] font-medium">দেখুন →</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUser((v) => !v); setShowNotif(false); }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-[#F4FBF6] transition-colors"
          >
            <div className="size-8 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0] ?? "U"}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-[#17221D]">{user?.name}</span>
              <span className="text-[11px] text-[#66736D]">{user?.role ? roleLabels[user.role] : ""}</span>
            </div>
          </button>

          {showUser && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-[#DCE6E0] shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#DCE6E0]">
                <p className="font-semibold text-sm text-[#17221D]">{user?.name}</p>
                <p className="text-xs text-[#66736D]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                লগআউট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
