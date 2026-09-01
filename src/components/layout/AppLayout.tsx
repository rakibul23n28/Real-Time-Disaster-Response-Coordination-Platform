import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../hooks/useAuth";

const pageTitles: Record<string, string> = {
  "/citizen": "ড্যাশবোর্ড",
  "/citizen/report": "দুর্যোগ রিপোর্ট করুন",
  "/citizen/reports": "আমার রিপোর্ট",
  "/citizen/map": "মানচিত্র",
  "/citizen/profile": "প্রোফাইল",
  "/volunteer": "ড্যাশবোর্ড",
  "/volunteer/map": "দুর্যোগ মানচিত্র",
  "/volunteer/tasks": "আমার কাজ",
  "/volunteer/issues": "মাঠের সমস্যা",
  "/volunteer/profile": "প্রোফাইল",
  "/admin": "ড্যাশবোর্ড",
  "/admin/reports": "রিপোর্ট যাচাই",
  "/admin/map": "দুর্যোগ মানচিত্র",
  "/admin/severity": "তীব্রতা বিশ্লেষণ",
  "/admin/resources": "ত্রাণ বরাদ্দ",
  "/admin/inventory": "মজুত ব্যবস্থাপনা",
  "/admin/operations": "অপারেশন",
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const title = pageTitles[location.pathname] ?? "ড্যাশবোর্ড";

  return (
    <div className="flex h-full bg-[#F7F9F8] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 h-full w-60">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
