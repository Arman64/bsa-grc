"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { SectionCard } from "@/components/admin/FieldEditor";
import { SECTION_LABELS } from "@/lib/content-defaults";
import { Save, ExternalLink, ArrowLeft, Loader2, CheckCircle2, Search } from "lucide-react";

const publicPath = (slug: string) => (slug === "beranda" ? "/" : `/${slug}`);

export default function PageEditor() {
  const params = useParams();
  const slug = String(params.slug);

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/page-content?slug=${slug}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setContent(j.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const setSection = (key: string, value: any) => {
    setContent((prev: any) => ({ ...prev, sections: { ...prev.sections, [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const j = await res.json();
      setToast({ type: j.success ? "ok" : "err", msg: j.message });
    } catch {
      setToast({ type: "err", msg: "Gagal menyimpan" });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Memuat konten...
        </div>
      </AdminLayout>
    );
  }

  if (!content) {
    return (
      <AdminLayout>
        <p className="text-red-600">Konten tidak ditemukan.</p>
      </AdminLayout>
    );
  }

  const sectionKeys = Object.keys(content.sections || {});

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-5 pb-24">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link href="/admin/pages" className="text-xs text-muted-foreground hover:text-maroon-700 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Halaman
            </Link>
            <h1 className="text-2xl font-bold capitalize">Edit Halaman: {slug}</h1>
          </div>
          <Link href={publicPath(slug)} target="_blank" className="inline-flex items-center gap-1.5 border px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
            <ExternalLink className="w-4 h-4" /> Lihat Halaman
          </Link>
        </div>

        <div className="space-y-3">
          {sectionKeys.map((key, i) => (
            <SectionCard
              key={key}
              title={SECTION_LABELS[key] || key}
              obj={content.sections[key]}
              onChange={(v) => setSection(key, v)}
              folder={slug}
              defaultOpen={i === 0}
            />
          ))}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border shadow-soft p-5 space-y-4">
          <p className="font-bold text-sm flex items-center gap-2"><Search className="w-4 h-4 text-maroon-700" /> SEO Halaman Ini</p>
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Judul SEO (Meta Title)</label>
            <input
              value={content.seoTitle || ""}
              onChange={(e) => setContent({ ...content, seoTitle: e.target.value })}
              placeholder={content.title}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              data-testid="seo-title-input"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Deskripsi SEO (Meta Description)</label>
            <textarea
              value={content.seoDescription || ""}
              onChange={(e) => setContent({ ...content, seoDescription: e.target.value })}
              placeholder={content.description}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              data-testid="seo-desc-input"
            />
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t shadow-lg px-4 lg:px-8 py-3 flex items-center justify-between z-30">
        <div className="text-sm">
          {toast && (
            <span className={`flex items-center gap-1.5 font-medium ${toast.type === "ok" ? "text-green-600" : "text-red-600"}`}>
              <CheckCircle2 className="w-4 h-4" /> {toast.msg}
            </span>
          )}
        </div>
        <button
          onClick={save}
          disabled={saving}
          data-testid="save-page-btn"
          className="inline-flex items-center gap-2 bg-maroon-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-maroon-800 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </AdminLayout>
  );
}
