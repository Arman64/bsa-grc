import { Phone, Palette, Ruler, Building2, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { getPageContentCached } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";

const stepIcons = [Phone, Palette, Ruler, Building2, CheckCircle];
const stepColors = [
  "bg-green-50 border-green-200 text-green-700",
  "bg-gold-50 border-gold-200 text-gold-700",
  "bg-blue-50 border-blue-200 text-blue-700",
  "bg-maroon-50 border-maroon-200 text-maroon-700",
  "bg-green-50 border-green-200 text-green-700",
];

export default async function ProcessSection() {
  let process: any = HOME_DEFAULT.process;
  try {
    const content = await getPageContentCached("beranda");
    process = content.sections.process || HOME_DEFAULT.process;
  } catch {}

  const steps = process.steps?.length ? process.steps : HOME_DEFAULT.process.steps;

  return (
    <section className="cv-auto py-16 lg:py-24 bg-white border-y border-gold-100/50">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader badge={process.badge} badgeVariant="maroon" title={process.title} description={process.description} />

        <div className="mt-12 lg:mt-16 relative">
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-green-200 via-gold-200 to-maroon-200" />

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step: any, idx: number) => {
              const Icon = stepIcons[idx % stepIcons.length];
              const color = stepColors[idx % stepColors.length];
              return (
                <div key={idx} className="relative group">
                  <div className="bg-white border rounded-2xl shadow-soft p-6 hover:shadow-large hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="flex lg:flex-col items-start gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-soft ${color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-maroon-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-maroon">
                          {step.number}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-sm leading-tight text-foreground mb-2">{step.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
