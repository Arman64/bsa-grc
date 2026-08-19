import { getPageContentCached } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";
import { Building2, Users, Award, Globe } from "lucide-react";

const icons = [Building2, Users, Award, Globe];

export default async function StatsSection() {
  let items: any[] = HOME_DEFAULT.stats.items;
  try {
    const content = await getPageContentCached("beranda");
    items = content.sections.stats?.items?.length ? content.sections.stats.items : HOME_DEFAULT.stats.items;
  } catch {}

  return (
    <section className="cv-auto py-10 lg:py-14 bg-maroon-900 relative overflow-hidden border-y border-maroon-800">
      <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((stat: any, idx: number) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={idx} className="text-center lg:text-left flex flex-col lg:flex-row items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-400 group-hover:text-maroon-900 transition-colors">
                  <Icon className="w-6 h-6 text-gold-300 group-hover:text-maroon-900 transition-colors" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-white leading-none">{stat.value}</p>
                  <p className="text-sm font-semibold text-gold-300 mt-1">{stat.label}</p>
                  <p className="text-xs text-white/50">{stat.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
