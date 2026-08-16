import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: "default" | "maroon" | "gold" | "premium";
}

export function Card({ children, hover = true, variant = "default", className, ...props }: CardProps) {
  const variants = {
    default: "bg-white border-border shadow-soft",
    maroon: "bg-gradient-to-br from-maroon-700 to-maroon-900 text-white border-maroon-800 shadow-maroon",
    gold: "bg-gradient-to-br from-gold-50 to-white border-gold-200 shadow-gold",
    premium: "bg-gradient-to-br from-white to-gold-50/40 border-border shadow-soft",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden",
        variants[variant],
        hover && variant === "default" && "hover:shadow-large hover:-translate-y-1 transition-all duration-500",
        hover && variant !== "default" && "hover:shadow-large hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0 mt-auto", className)} {...props}>
      {children}
    </div>
  );
}
