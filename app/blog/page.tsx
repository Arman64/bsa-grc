import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import { getPublishedBlogs } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import { BlogGrid } from "@/components/ui/BlogCard";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog & Artikel - Tips Kubah Masjid, Harga, Panduan Kontraktor GRC",
  description: "Blog BSA GRC: tips memilih kubah masjid, harga kubah GRC terbaru 2026, perbedaan bahan GRC vs Enamel vs Galvalum, panduan kontraktor. Update dari pabrik Trenggalek.",
  url: `${COMPANY_INFO.website}/blog`,
});

const categories = ["Semua", "Panduan Kubah", "Harga & Biaya", "Edukasi & Material", "Portofolio", "Tips Perawatan"];

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge={`${blogs.length} Artikel`}
            badgeVariant="gold"
            title={
              <>
                Blog & <span className="text-maroon-700">Panduan Kubah Masjid</span>
              </>
            }
            description="Artikel SEO friendly dari tim BSA GRC: tips memilih kubah, harga terbaru, perbandingan bahan, panduan perawatan. Update langsung dari pabrik Trenggalek untuk panitia masjid seluruh Indonesia."
          />

          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border shadow-soft p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4 text-maroon-700" />
                <span>
                  <strong className="text-foreground">{blogs.length} artikel</strong> terbit • Update mingguan • SEO optimized • Neon DB
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${cat === "Semua" ? "bg-maroon-700 text-white border-maroon-700" : "bg-white hover:border-maroon-200 hover:text-maroon-700"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <BlogGrid posts={blogs as any} />

          <div className="mt-16 bg-maroon-900 text-white rounded-[2rem] p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  Butuh Konsultasi <span className="text-gold-400">Gratis</span> Setelah Baca Artikel?
                </h3>
                <p className="text-white/70 mt-3 leading-relaxed">Tim BSA GRC siap bantu pilih model kubah, hitung harga per meter, dan buatkan desain 3D custom gratis. Chat WA sekarang respon &lt;5 menit.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <a href="https://api.whatsapp.com/send?phone=6281230469914" target="_blank" className="bg-gold-400 text-maroon-900 font-bold px-6 py-3 rounded-xl text-center hover:bg-gold-300 transition-colors">
                  Konsultasi WA Gratis
                </a>
                <a href="/kontak" className="border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-center hover:bg-white/10 transition-colors">
                  Form Penawaran
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
