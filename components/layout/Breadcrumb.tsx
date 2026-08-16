import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-maroon-700 transition-colors">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            {item.href && idx !== items.length - 1 ? (
              <Link href={item.href} className="text-muted-foreground hover:text-maroon-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
