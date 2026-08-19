"use client";

import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { PAGE_ORDER, PAGE_DEFAULTS } from "@/lib/content-defaults";
import { Layers, Edit3, ExternalLink } from "lucide-react";

const publicPath = (slug: string) => (slug === "beranda" ? "/" : `/${slug}`);

export default function AdminPagesList() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-maroon-700" /> Halaman
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Edit teks & gambar tiap bagian yang tampil di website. Perubahan langsung tayang.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {PAGE_ORDER.map((slug) => {
            const def = PAGE_DEFAULTS[slug];
            const sectionCount = Object.keys(def.sections).length;
            return (
              <div key={slug} className="bg-white rounded-xl border shadow-soft p-5 hover:shadow-medium transition-shadow flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground capitalize">{slug}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{def.description}</p>
                  </div>
                  <span className="text-[10px] bg-gold-50 border border-gold-200 text-gold-700 px-2 py-1 rounded-full whitespace-nowrap">{sectionCount} bagian</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link href={`/admin/pages/${slug}`} data-testid={`edit-page-${slug}`} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-maroon-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-maroon-800 transition-colors">
                    <Edit3 className="w-4 h-4" /> Edit
                  </Link>
                  <Link href={publicPath(slug)} target="_blank" className="inline-flex items-center justify-center gap-1.5 border px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                    <ExternalLink className="w-4 h-4" /> Lihat
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
