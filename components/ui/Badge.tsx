import { cn } from "@/lib/utils";

interface BadgeProps {
 children: React.ReactNode;
 variant?: "maroon" | "gold" | "outline" | "muted";
 className?: string;
}

export default function Badge({ children, variant = "maroon", className }: BadgeProps) {
 const variants = {
 maroon: "bg-maroon-50 text-maroon-700 border-maroon-200",
 gold: "bg-gold-50 text-gold-700 border-gold-200",
 outline: "bg-transparent text-foreground border-border",
 muted: "bg-muted text-muted-foreground border-transparent",
 };

 return (
 <span
  className={cn(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
  variants[variant],
  className
  )}
 >
  {children}
 </span>
 );
}
