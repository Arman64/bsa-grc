import { cn } from "@/lib/utils";

interface IslamicPatternProps {
 variant?: "maroon" | "gold" | "light" | "subtle";
 className?: string;
 opacity?: number;
}

/**
 * Minimalist Islamic Geometric Pattern - Decorative Accent
 * Used across BSA GRC site as per Styling Guidelines
 * PERFORMANCE: Pure CSS, no extra images for LCP optimization
 */
export default function IslamicPattern({ variant = "subtle", className }: IslamicPatternProps) {
 const variants = {
 maroon: "text-maroon-500/5",
 gold: "text-gold-400/10",
 light: "text-maroon-900/5",
 subtle: "text-maroon-700/[0.04]",
 };

 return (
 <div
  aria-hidden="true"
  className={cn("absolute inset-0 pointer-events-none overflow-hidden", variants[variant], className)}
 >
  {/* SVG Islamic Geometric Pattern - Minimalist */}
  <svg
  width="100%"
  height="100%"
  xmlns="http://www.w3.org/2000/svg"
  className="absolute inset-0 w-full h-full"
  >
  <defs>
   <pattern id={`islamic-${variant}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
   {/* 8-pointed star simplified */}
   <g fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6">
    <path d="M40 10 L44 34 L68 40 L44 46 L40 70 L36 46 L12 40 L36 34 Z" />
    <circle cx="40" cy="40" r="12" />
    <circle cx="40" cy="40" r="22" />
   </g>
   {/* Corner dots */}
   <circle cx="0" cy="0" r="1" fill="currentColor" opacity="0.3" />
   <circle cx="80" cy="0" r="1" fill="currentColor" opacity="0.3" />
   <circle cx="0" cy="80" r="1" fill="currentColor" opacity="0.3" />
   <circle cx="80" cy="80" r="1" fill="currentColor" opacity="0.3" />
   </pattern>
   <pattern id={`islamic-sub-${variant}`} x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
   <rect width="160" height="160" fill={`url(#islamic-${variant})`} />
   <g stroke="currentColor" strokeWidth="0.3" opacity="0.2" fill="none">
    <path d="M0 80 H160 M80 0 V160" />
   </g>
   </pattern>
  </defs>
  <rect width="100%" height="100%" fill={`url(#islamic-sub-${variant})`} />
  </svg>
 </div>
 );
}

export function GoldAccent({ className }: { className?: string }) {
 return (
 <div className={cn("h-[3px] w-full bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700", className)} aria-hidden="true" />
 );
}

export function DividerIslamic({ className }: { className?: string }) {
 return (
 <div className={cn("flex items-center justify-center gap-3 my-6", className)} aria-hidden="true">
  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-300" />
  <div className="w-2 h-2 rotate-45 bg-gold-400" />
  <div className="w-1.5 h-1.5 rotate-45 bg-maroon-300" />
  <div className="w-2 h-2 rotate-45 bg-gold-400" />
  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-300" />
 </div>
 );
}
