import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: ButtonVariant;
 size?: ButtonSize;
 href?: string;
 external?: boolean;
 isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
 primary: "bg-maroon-500 text-white hover:bg-maroon-600 shadow-maroon hover:shadow-large",
 gold: "bg-gold-400 text-maroon-900 hover:bg-gold-600 shadow-gold hover:shadow-large",
 outline: "border-2 border-maroon-500 text-maroon-600 hover:bg-maroon-500 hover:text-white bg-transparent",
 ghost: "text-foreground hover:bg-muted bg-transparent",
 white: "bg-white text-maroon-800 hover:bg-gold-50 shadow-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
 sm: "px-4 py-2 text-xs",
 md: "px-6 py-3 text-sm",
 lg: "px-7 py-3.5 text-[15px]",
 xl: "px-8 py-4 text-base",
};

export default function Button({
 children,
 variant = "primary",
 size = "md",
 href,
 external = false,
 isLoading = false,
 className,
 disabled,
 ...props
}: ButtonProps) {
 const baseClasses = cn(
 "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0",
 variantStyles[variant],
 sizeStyles[size],
 className
 );

 if (href) {
 if (external) {
  return (
  <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
   {children}
  </a>
  );
 }
 return (
  <Link href={href} className={baseClasses}>
  {children}
  </Link>
 );
 }

 return (
 <button className={baseClasses} disabled={disabled || isLoading} {...props}>
  {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
  {children}
 </button>
 );
}
