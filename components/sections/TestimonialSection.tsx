import Image from "next/image";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { getTestimonialsData } from "@/lib/data";

const FALLBACK_TESTIMONIALS = [
 { id: 1, name: "H. Slamet", location: "Trenggalek", role: "Ketua Panitia", text: "Kubah tidak bocor 3 tahun", result: "Anti bocor 3 tahun", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-1-scaled.jpg", rating: 5 },
];

export default async function TestimonialSection() {
 let testimonials: any[] = [];
 try {
 const dbTestimonials = await getTestimonialsData();
 testimonials = dbTestimonials.length > 0 ? dbTestimonials : FALLBACK_TESTIMONIALS;
 } catch {
 testimonials = FALLBACK_TESTIMONIALS;
 }

 return (
 <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
  <div className="container mx-auto px-4 lg:px-8">
  <SectionHeader
   badge={`Testimoni Klien - ${testimonials.length} Ulasan`}
   badgeVariant="gold"
   title={
   <>
    Dipercaya <span className="text-maroon-700">Ratusan Panitia Masjid</span>
   </>
   }
   description="Testimoni nyata dari panitia pembangunan masjid di seluruh Indonesia yang telah menggunakan jasa BSA GRC - data dari."
  />

  <div className="mt-10 flex flex-wrap justify-center items-center gap-6">
   <div className="flex items-center gap-3 bg-gold-50 border border-gold-200 rounded-full px-5 py-2.5">
   <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
    ))}
   </div>
   <span className="font-bold text-sm">5.0</span>
   <span className="text-xs text-muted-foreground">({testimonials.length} ulasan)</span>
   </div>
   <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border">
  , kelola di /admin/testimonials
   </span>
  </div>

  <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
   {testimonials.slice(0, 6).map((testi: any) => (
   <div
    key={testi.id}
    className="group relative bg-white rounded-2xl border border-border shadow-soft overflow-hidden hover:shadow-large hover:-translate-y-1 transition-all duration-300"
   >
    <div className="relative h-64">
    <Image
     src={testi.photo || "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png"}
     alt={testi.name}
     fill
     className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
     sizes="(max-width: 768px) 50vw, 16vw"
     loading="lazy"
    />
    <div className="absolute top-2 right-2 w-7 h-7 bg-gold-400 rounded-full flex items-center justify-center shadow-gold">
     <Quote className="w-3.5 h-3.5 text-maroon-900 fill-maroon-900" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
     <p className="text-white text-xs font-bold truncate">{testi.name}</p>
     <p className="text-white/70 text-[10px] truncate">{testi.location}</p>
    </div>
    </div>
    <div className="p-3 text-center">
    <div className="flex justify-center gap-0.5 mb-1">
     {Array.from({ length: testi.rating || 5 }).map((_, i) => (
     <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
     ))}
    </div>
    <p className="text-[11px] font-medium text-foreground line-clamp-2">{testi.text?.slice(0, 60)}...</p>
    <p className="text-[10px] text-green-600 font-semibold mt-1">{testi.result}</p>
    </div>
   </div>
   ))}
  </div>
  </div>
 </section>
 );
}
