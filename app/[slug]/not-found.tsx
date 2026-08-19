import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-white to-gold-50/30 px-4 py-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-maroon-50 border border-maroon-100 flex items-center justify-center mb-5">
          <FileQuestion className="w-8 h-8 text-maroon-700" />
        </div>
        <p className="text-5xl font-extrabold text-maroon-700">404</p>
        <h1 className="text-xl font-bold mt-3">Artikel Tidak Ditemukan</h1>
        <p className="text-sm text-muted-foreground mt-2">Halaman atau artikel yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/blog" className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon-800 transition-colors">Lihat Semua Artikel</Link>
          <Link href="/" className="border px-5 py-2.5 rounded-xl font-semibold hover:bg-muted transition-colors">Beranda</Link>
        </div>
      </div>
    </section>
  );
}
