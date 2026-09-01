interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export default function Logo({ size = "md", variant = "full" }: LogoProps) {
  const iconSize = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";
  const subSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${iconSize} relative flex-shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="16" cy="16" r="16" fill="#2E7D5B" />
          {/* Location pin */}
          <path d="M16 6C12.686 6 10 8.686 10 12C10 16.5 16 22 16 22C16 22 22 16.5 22 12C22 8.686 19.314 6 16 6Z" fill="white" opacity="0.9" />
          <circle cx="16" cy="12" r="2.5" fill="#2E7D5B" />
          {/* Helping hands hint */}
          <path d="M9 24C9 24 11.5 21.5 16 21.5C20.5 21.5 23 24 23 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          {/* Alert exclamation */}
          <rect x="14.5" y="24.5" width="3" height="1.5" rx="0.75" fill="white" opacity="0.9" />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-[#17221D] ${textSize}`}>দুর্যোগ সাড়া</span>
          <span className={`text-[#66736D] font-medium tracking-wide uppercase ${subSize}`}>Disaster Response</span>
        </div>
      )}
    </div>
  );
}
