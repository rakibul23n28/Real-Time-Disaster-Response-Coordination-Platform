import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "volunteer" ? "/volunteer" : "/citizen";
  const links = [
    { label: "হোম", to: "/" },
    { label: "সহায়তা দিন", to: "/donate" },
    { label: "অনুদান লগ", to: "/donations/log" },
  ];
  return <>
    <nav className="sticky top-0 z-50 border-b border-[#DCE6E0] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/"><Logo size="md" /></Link>
        <div className="hidden items-center gap-6 md:flex">{links.map((link) => <Link key={link.to} to={link.to} className="text-sm font-medium text-[#66736D] transition-colors hover:text-[#17221D]">{link.label}</Link>)}</div>
        <div className="flex items-center gap-2">{user ? <><Link to={dashboardPath} className="hidden px-4 py-2 text-sm font-medium text-[#2E7D5B] transition-colors hover:text-[#185C43] sm:block">ড্যাশবোর্ড</Link><button onClick={() => void logout()} className="hidden px-3 py-2 text-sm font-medium text-[#66736D] transition-colors hover:text-red-600 sm:block">লগআউট</button></> : <Link to="/login" className="hidden px-4 py-2 text-sm font-medium text-[#2E7D5B] transition-colors hover:text-[#185C43] sm:block">লগইন</Link>}<Link to="/donate" className="rounded-[9px] bg-[#2E7D5B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#185C43]">সহায়তা দিন</Link><button className="rounded-lg p-2 text-[#66736D] hover:bg-[#F4FBF6] md:hidden" onClick={() => setOpen((value) => !value)} aria-label="মেনু"><svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 6h16M4 12h16M4 18h16" /></svg></button></div>
      </div>
      {open && <div className="space-y-1 border-t border-[#DCE6E0] bg-white px-4 py-3 md:hidden">{links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-[#66736D]">{link.label}</Link>)}{user ? <><Link to={dashboardPath} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-[#2E7D5B]">ড্যাশবোর্ড</Link><button onClick={() => { setOpen(false); void logout(); }} className="block py-2 text-sm font-medium text-red-600">লগআউট</button></> : <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-[#2E7D5B]">লগইন</Link>}</div>}
    </nav>
  </>;
}
