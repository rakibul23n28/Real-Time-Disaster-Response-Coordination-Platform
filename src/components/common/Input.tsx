import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({ label, error, hint, leftIcon, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#17221D]">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736D]">{leftIcon}</span>
        )}
        <input
          className={`
            w-full border rounded-[9px] py-2 text-sm text-[#17221D] placeholder:text-[#66736D]
            bg-white transition-colors
            ${leftIcon ? "pl-9 pr-3" : "px-3"}
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
              : "border-[#DCE6E0] hover:border-[#b0c4b8] focus:border-[#2E7D5B] focus:ring-1 focus:ring-[#E8F5E9]"
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#66736D]">{hint}</p>}
    </div>
  );
}
