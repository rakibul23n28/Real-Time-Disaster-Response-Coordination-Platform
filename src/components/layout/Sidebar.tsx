import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const citizenNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", path: "/citizen", icon: <GridIcon /> },
  { label: "দুর্যোগ রিপোর্ট করুন", path: "/citizen/report", icon: <AlertIcon /> },
  { label: "আমার রিপোর্ট", path: "/citizen/reports", icon: <DocIcon /> },
  { label: "মানচিত্র", path: "/citizen/map", icon: <MapIcon /> },
  { label: "প্রোফাইল", path: "/citizen/profile", icon: <UserIcon /> },
];

const volunteerNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", path: "/volunteer", icon: <GridIcon /> },
  { label: "দুর্যোগ মানচিত্র", path: "/volunteer/map", icon: <MapIcon /> },
  { label: "আমার কাজ", path: "/volunteer/tasks", icon: <TaskIcon /> },
  { label: "মাঠের সমস্যা", path: "/volunteer/issues", icon: <FlagIcon /> },
  { label: "প্রোফাইল", path: "/volunteer/profile", icon: <UserIcon /> },
];

const adminNav: NavItem[] = [
  { label: "ড্যাশবোর্ড", path: "/admin", icon: <GridIcon /> },
  { label: "রিপোর্ট যাচাই", path: "/admin/reports", icon: <CheckIcon /> },
  { label: "দুর্যোগ মানচিত্র", path: "/admin/map", icon: <MapIcon /> },
  { label: "তীব্রতা বিশ্লেষণ", path: "/admin/severity", icon: <ChartIcon /> },
  { label: "ত্রাণ বরাদ্দ", path: "/admin/resources", icon: <BoxIcon /> },
  { label: "মজুত ব্যবস্থাপনা", path: "/admin/inventory", icon: <InventoryIcon /> },
  { label: "অপারেশন", path: "/admin/operations", icon: <OpsIcon /> },
  { label: "প্রোফাইল", path: "/admin/profile", icon: <UserIcon /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    user?.role === "citizen" ? citizenNav :
    user?.role === "volunteer" ? volunteerNav :
    adminNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`
      h-full flex flex-col bg-white border-r border-[#DCE6E0]
      ${collapsed ? "w-16" : "w-60"}
      transition-all duration-200
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-[#DCE6E0] ${collapsed ? "justify-center" : "justify-between"}`}>
        {collapsed ? <Logo variant="icon" size="sm" /> : <Logo size="sm" />}
        {onClose && !collapsed && (
          <button onClick={onClose} className="lg:hidden p-1 rounded text-[#66736D] hover:bg-[#F4FBF6]">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/citizen" || item.path === "/volunteer" || item.path === "/admin"}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? "bg-[#E8F5E9] text-[#2E7D5B]"
                : "text-[#66736D] hover:bg-[#F4FBF6] hover:text-[#17221D]"
              }
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0 size-4.5">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-[#DCE6E0] py-3 px-2 space-y-0.5`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#66736D] hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "লগআউট" : undefined}
        >
          <span className="flex-shrink-0 size-4.5"><LogoutIcon /></span>
          {!collapsed && "লগআউট"}
        </button>
      </div>
    </aside>
  );
}

function GridIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
}
function AlertIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
}
function DocIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
}
function MapIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" /></svg>;
}
function UserIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
}
function TaskIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>;
}
function FlagIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 7l2.55 2.4A1 1 0 0116 11H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
}
function ChartIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
}
function BoxIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/></svg>;
}
function InventoryIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg>;
}
function OpsIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>;
}
function LogoutIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" className="size-full"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>;
}
