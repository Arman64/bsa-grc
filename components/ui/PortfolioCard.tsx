import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Building2, Ruler, Award, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  diameter?: string;
  height?: string;
  material?: string;
  client?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
  priority?: boolean;
}

export default function PortfolioCard({ item, className, priority = false }: PortfolioCardProps) {
  return (
    <Link href={`/portofolio/${item.id}`} className={cn("card-portfolio group flex flex-col bg-white border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-large hover:-translate-y-1 transition-all duration-500", className)}>
      {/* Image - next/image for optimization */}
      <div className="relative h-[260px] overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-maroon-700 border border-gold-200 text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            {item.category}
          </span>
          <span className="inline-flex items-center gap-1 bg-maroon-700/90 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <Award className="w-3 h-3 text-gold-400" />
            BSA GRC
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-3 border border-gold-100 shadow-medium flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Ruler className="w-3.5 h-3.5 text-maroon-600" />
              {item.diameter || "Ø 6m"}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 text-gold-600" />
              {item.material || "GRC Premium"}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1 text-maroon-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Selesai
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[16px] leading-tight text-foreground group-hover:text-maroon-700 transition-colors line-clamp-2 mb-3">
          {item.title}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/70 rounded-full px-3 py-1.5 border">
            <MapPin className="w-3.5 h-3.5 text-maroon-500 flex-shrink-0" />
            <span className="truncate font-medium">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/70 rounded-full px-3 py-1.5 border">
            <Calendar className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
            <span className="truncate font-medium">{item.year}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-dashed border-gold-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-maroon-100 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-maroon-700" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">{item.client || "Masjid Jami'"}</span>
          </div>
          <span className="text-[11px] text-white font-bold tracking-wide uppercase bg-maroon-700 px-3 py-1.5 rounded-full group-hover:bg-maroon-800 transition-colors">
            Detail Proyek →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PortfolioGrid({ items, className }: { items: PortfolioItem[]; className?: string }) {
  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8", className)}>
      {items.map((item, idx) => (
        <PortfolioCard key={item.id} item={item} priority={idx < 3} />
      ))}
    </div>
  );
}
