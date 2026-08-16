"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Save, X, FileText, Eye, Search } from "lucide-react";

interface PageSettings {
  id: number;
  slug: string;
  title: string;
  description?: string;
  sections: any;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
}

const defaultPages = [
  { slug: "beranda", title: "Beranda - Homepage", description: "Halaman utama" },
  { slug: "profil", title: "Profil Perusahaan", description: "Sejarah, visi misi, pabrik" },
  { slug: "layanan", title: "Layanan Kami", description: "List semua layanan" },
  { slug: "portofolio", title: "Portofolio Proyek", description: "Galeri proyek" },
  { slug: "kontak", title: "Kontak & Penawaran", description: "Form kontak & maps" },
  { slug: "blog", title: "Blog & Artikel", description: "Artikel SEO" },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PageSettings | null>(null);
  const [form, setForm] = useState<Partial<PageSettings>>({ slug: "", title: "", description: "", sections: {}, seoTitle: "", seoDescription: "", isActive: true });
  const [search, setSearch] = useState("");

  const fetchPages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    const json = await res.json();
    if (json.success) setPages(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const payload = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/api/admin/pages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (json.success) {
      setShowModal(false);
      setEditing(null);
      setForm({ slug: "", title: "", description: "", sections: {}, seoTitle: "", seoDescription: "", isActive: true });
      fetchPages();
    } else alert(json.message);
  };

  const handleEdit = (page: PageSettings) => {
    setEditing(page);
    setForm(page);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengaturan halaman ini?")) return;
    const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchPages();
    else alert(json.message);
  };

  const handleCreateDefault = (def: any) => {
    setEditing(null);
    setForm({
      slug: def.slug,
      title: def.title,
      description: def.description,
      sections: {
        hero: { title: def.title, subtitle: "", image: "", cta: "Konsultasi Gratis" },
        content: { heading: def.title, body: "Edit konten halaman " + def.title },
      },
      seoTitle: `${def.title} | BSA GRC`,
      seoDescription: def.description,
      isActive: true,
    });
    setShowModal(true);
  };

  const filtered = pages.filter((p) => `${p.slug} ${p.title}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pengaturan Halaman - Edit Teks & Gambar Tiap Halaman</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola teks dan gambar untuk tiap halaman: Beranda, Profil, Layanan, Portofolio, Kontak, Blog. Data dari Neon DB.</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ slug: "", title: "", description: "", sections: {}, seoTitle: "", seoDescription: "", isActive: true }); setShowModal(true); }} className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Halaman
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-soft p-4">
          <p className="text-sm font-semibold mb-3">Template Halaman Default (Klik untuk buat cepat):</p>
          <div className="flex flex-wrap gap-2">
            {defaultPages.map((dp) => (
              <button key={dp.slug} onClick={() => handleCreateDefault(dp)} className="text-xs border px-3 py-1.5 rounded-full hover:bg-maroon-50 hover:border-maroon-200 hover:text-maroon-700">
                + {dp.title} ({dp.slug})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-soft p-4 flex justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari halaman..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" />
          </div>
          <span className="text-sm text-muted-foreground">Total: <b>{filtered.length}</b> halaman</span>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((page) => (
              <div key={page.id} className="bg-white rounded-2xl border shadow-soft p-5 hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{page.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Slug: /{page.slug} • {page.isActive ? "Aktif" : "Nonaktif"}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{page.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-2">Sections: {Object.keys(page.sections || {}).length} blok</p>
                  </div>
                  <div className="flex gap-1">
                    <a href={`/${page.slug === "beranda" ? "" : page.slug}`} target="_blank" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleEdit(page)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(page.id)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {Object.keys(page.sections || {}).slice(0, 5).map((sec) => (
                    <span key={sec} className="text-[10px] bg-gold-50 border border-gold-100 px-2 py-1 rounded-full">{sec}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-large w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                <h3 className="font-bold text-lg">{editing ? "Edit" : "Tambah"} Halaman - {form.slug}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block">Slug (URL) *</label>
                    <input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="beranda, profil, kontak" className="w-full px-4 py-2.5 rounded-xl border text-sm" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Judul Halaman *</label>
                    <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Beranda - BSA GRC" className="w-full px-4 py-2.5 rounded-xl border text-sm" required />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block">Deskripsi Singkat</label>
                  <input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi halaman untuk SEO" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block">SEO Title</label>
                    <input value={form.seoTitle || ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO Title 60 char" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">SEO Description</label>
                    <input value={form.seoDescription || ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="SEO Desc 160 char" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1 block">Sections JSON - Edit Tiap Teks & Gambar Halaman (JSON)</label>
                  <p className="text-[11px] text-muted-foreground mb-2">Format: {`{"hero": {"title": "...", "subtitle": "...", "image": "/images/hero.avif"}, "about": {"heading": "...", "body": "..."}}`}</p>
                  <textarea
                    value={typeof form.sections === "string" ? form.sections : JSON.stringify(form.sections || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setForm({ ...form, sections: parsed });
                      } catch {
                        setForm({ ...form, sections: e.target.value as any });
                      }
                    }}
                    rows={15}
                    placeholder='{"hero": {"title": "Kontraktor Kubah...", "image": "/images/hero.avif"}, "about": {...}}'
                    className="w-full px-4 py-3 rounded-xl border text-xs font-mono resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-3 rounded-xl">Batal</button>
                  <button type="submit" className="flex-1 bg-maroon-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Simpan Halaman
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
