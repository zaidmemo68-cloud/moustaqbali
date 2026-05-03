import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "relative flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-[#C9A84C] text-[#0a1628] shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:shadow-[0_0_25px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 active:translate-y-0",
      secondary: "bg-white/10 text-[#F5F0E8] border border-white/20 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0",
      outline: "border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
