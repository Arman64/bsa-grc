"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Save, X, FileText, Eye, Search, Image as ImageIcon, Upload } from "lucide-react";

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
  { slug: "beranda", title: "Beranda - Homepage", description: "Halaman utama dengan hero, layanan, portfolio, testimoni" },
  { slug: "profil", title: "Profil Perusahaan", description: "Sejarah, visi misi, pabrik, nilai profesionalisme" },
  { slug: "layanan", title: "Layanan Kami", description: "List semua layanan kubah, menara, dll" },
  { slug: "portofolio", title: "Portofolio Proyek", description: "Galeri proyek nyata" },
  { slug: "kontak", title: "Kontak & Penawaran", description: "Form kontak, maps, info kontak" },
  { slug: "blog", title: "Blog & Artikel", description: "Artikel SEO kubah masjid" },
];

// Helper to get default sections per page slug - matches public page components
function getDefaultSections(slug: string) {
  const defaults: Record<string, any> = {
    beranda: {
      hero: { badge: "10+ Tahun Pengalaman", title: "Kontraktor Kubah GRC, Menara & Ornamen GRC Terbaik", subtitle: "Pabrik Trenggalek, 500+ proyek selesai di Indonesia", image: "/images/services/hero.avif", ctaPrimary: "Konsultasi Gratis", ctaSecondary: "Lihat Portofolio" },
      stats: { projects: "500+", years: "10+", rating: "5.0", provinces: "34", reviews: "127" },
      about: { badge: "Profil Perusahaan", title: "BSA GRC - 10+ Tahun Profesional", description: "Bergerak khusus industri GRC...", image: "/images/Profil-BSA.avif", benefits: ["Proses produksi tepat - tahan lama", "Motif & warna custom", "Rangka Kremona paling kuat", "Finishing cat mudah", "Pemasangan rapi cepat", "Gratis desain & survey"] },
      services: { badge: "Layanan Utama", title: "Spesialis Kubah, Menara & Ornamen GRC", description: "Fokus produksi GRC..." },
      portfolio: { badge: "500+ Proyek Selesai", title: "Portofolio Proyek Nyata", description: "Dokumentasi pengerjaan kubah, menara..." },
      testimonials: { badge: "Testimoni Klien", title: "Dipercaya Ratusan Panitia Masjid" },
      faq: { title: "Pertanyaan yang Sering Ditanyakan" },
      cta: { title: "Siap Membangun Kubah Masjid Impian?", subtitle: "Gratis desain 3D & survey", button: "Hubungi Kami" }
    },
    profil: {
      hero: { badge: "Tentang Kami", title: "BSA GRC - Kontraktor Profesional", description: "Spesialis Kubah Masjid, Menara & Ornamen GRC berpengalaman", image: "/images/Profil-BSA.avif" },
      stats: { projects: "500+", years: "10+", rating: "5.0", provinces: "34" },
      about: { badge: "Profil Perusahaan", title: "BSA GRC - 10+ Tahun Profesional", description: "Bergerak khusus industri GRC...", image: "/images/Profil-BSA.avif", benefits: ["Proses produksi tepat", "Motif custom", "Rangka Kremona", "Finishing mudah", "Pemasangan rapi", "Gratis desain"] },
      visi: { title: "Visi", description: "Menjadi kontraktor kubah & ornamen masjid GRC terpercaya nomor 1 di Indonesia dengan kualitas terbaik, harga terjangkau, dan pelayanan nasional hingga pelosok.", icon: "Eye" },
      misi: { title: "Misi", points: ["Memberikan produk GRC kualitas tinggi, tahan lama, ringan, awet, rapi & presisi", "Gratis jasa desain, konsultasi & survey lokasi seluruh Indonesia", "Melayani dengan harga pabrik langsung - transparan", "Menjaga kepuasan panitia masjid & institusi dengan garansi"] },
      nilai: { title: "Nilai Profesionalisme BSA GRC", points: [{ title: "Cepat", desc: "Pengerjaan cepat tanpa mengorbankan presisi & kerapian." }, { title: "Kuat & Ringan", desc: "Bahan GRC kualitas SNI, rangka Kremona kokoh." }, { title: "Awet & Tahan Cuaca", desc: "Anti bocor dengan pelapis membran bakar berkualitas." }, { title: "Rapi & Presisi", desc: "Detil motif sesuai keinginan customer dengan tenaga ahli." }] },
      cta: { title: "Siap Bekerjasama?", subtitle: "Hubungi tim BSA GRC sekarang", button: "Kontak Kami" }
    },
    layanan: {
      hero: { badge: "5 Spesialisasi Utama", title: "Layanan BSA GRC - Solusi Lengkap Masjid", description: "Dari pabrik Trenggalek untuk seluruh Indonesia" },
      services: { badge: "Layanan Utama", title: "Spesialis Kubah, Menara & Ornamen GRC" },
      cta: { title: "Butuh Konsultasi Gratis?", subtitle: "Gratis desain 3D & survey" }
    },
    portofolio: {
      hero: { badge: "500+ Proyek", title: "Portofolio Proyek Nyata BSA GRC", description: "Galeri lengkap dokumentasi kubah, menara, krawangan & mihrab ACP" },
      categories: ["Semua", "Kubah GRC", "Menara GRC", "Krawangan", "Mihrab ACP"]
    },
    kontak: {
      hero: { badge: "Gratis Konsultasi & Survey", title: "Hubungi Tim BSA GRC Sekarang", description: "Tim BSA GRC siap membantu proyek masjid Anda di seluruh Indonesia" },
      info: { whatsapp: "0812-3046-9914", email: "info@bsagrc.co.id", address: "Dsn. Setri, Klampis, Wonorejo, Gandusari, Trenggalek", hours: "Senin - Sabtu 08:00-17:00" },
      form: { title: "Form Penawaran Proyek", subtitle: "Isi form, tim kami akan hubungi via WhatsApp" },
      map: { lat: -8.140676, lng: 111.696329, zoom: 15 }
    },
    blog: {
      hero: { badge: "Artikel & Blog", title: "Blog & Panduan Kubah Masjid", description: "Artikel SEO friendly dari tim BSA GRC" }
    }
  };

  return defaults[slug] || { hero: { title: "Halaman " + slug } };
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PageSettings | null>(null);
  const [form, setForm] = useState<Partial<PageSettings>>({ slug: "", title: "", description: "", sections: {}, seoTitle: "", seoDescription: "", isActive: true });
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    const json = await res.json();
    if (json.success) setPages(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionKey: string, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(`${sectionKey}-${fieldKey}`);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "pages");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.success) {
      const newSections = { ...form.sections };
      if (!newSections[sectionKey]) newSections[sectionKey] = {};
      newSections[sectionKey][fieldKey] = json.data.url;
      setForm({ ...form, sections: newSections });
    } else {
      alert(json.message);
    }
    setUploading(null);
  };

  const handleSectionFieldChange = (sectionKey: string, fieldKey: string, value: any) => {
    const newSections = { ...form.sections };
    if (!newSections[sectionKey]) newSections[sectionKey] = {};
    newSections[sectionKey][fieldKey] = value;
    setForm({ ...form, sections: newSections });
  };

  const handleArrayFieldChange = (sectionKey: string, fieldKey: string, index: number, value: string) => {
    const newSections = { ...form.sections };
    if (!newSections[sectionKey]) newSections[sectionKey] = {};
    if (!Array.isArray(newSections[sectionKey][fieldKey])) newSections[sectionKey][fieldKey] = [];
    newSections[sectionKey][fieldKey][index] = value;
    setForm({ ...form, sections: newSections });
  };

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
    // Merge existing DB sections with default complete sections for that slug
    // So admin shows all components that exist in public page, not just 1 section
    const defaults = getDefaultSections(page.slug);
    const mergedSections = { ...defaults, ...(page.sections || {}) };
    // Deep merge: for each section in defaults, merge fields
    for (const key of Object.keys(defaults)) {
      if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && page.sections && page.sections[key]) {
        mergedSections[key] = { ...defaults[key], ...page.sections[key] };
      }
    }
    setEditing(page);
    setForm({ ...page, sections: mergedSections });
    setShowModal(true);
  };

  const handleLoadFullTemplate = () => {
    if (!form.slug) return;
    const full = getDefaultSections(form.slug);
    if (confirm(`Load template lengkap untuk halaman ${form.slug} dengan ${Object.keys(full).length} sections (hero, stats, about, dll)? Data saat ini akan digabung, field yang kosong akan terisi default.`)) {
      setForm({ ...form, sections: { ...full, ...(form.sections || {}) } });
    }
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
      sections: getDefaultSections(def.slug),
      seoTitle: `${def.title} | BSA GRC`,
      seoDescription: def.description,
      isActive: true,
    });
    setShowModal(true);
  };

  const filtered = pages.filter((p) => `${p.slug} ${p.title}`.toLowerCase().includes(search.toLowerCase()));

  const renderSectionEditor = () => {
    const slug = form.slug || "";
    const sections = form.sections || {};
    
    // Common hero editor for all pages
    return (
      <div className="space-y-6">
        {Object.keys(sections).map((sectionKey) => {
          const section = sections[sectionKey];
          return (
            <div key={sectionKey} className="border rounded-2xl p-5 bg-muted/20">
              <h4 className="font-bold text-sm capitalize mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-maroon-700" />
                Section: {sectionKey}
                <span className="text-xs bg-white border px-2 py-0.5 rounded-full">{typeof section === 'object' ? Object.keys(section).length + ' field' : 'text'}</span>
              </h4>
              
              {typeof section === 'object' && !Array.isArray(section) ? (
                <div className="space-y-3">
                  {Object.keys(section).map((fieldKey) => {
                    const value = section[fieldKey];
                    const isImage = fieldKey.toLowerCase().includes('image') || fieldKey.toLowerCase().includes('foto');
                    const isLongText = typeof value === 'string' && value.length > 100;
                    const isArray = Array.isArray(value);

                    if (isArray) {
                      return (
                        <div key={fieldKey} className="bg-white rounded-xl border p-4 space-y-2">
                          <label className="text-xs font-bold capitalize">{fieldKey} (Array - {value.length} item)</label>
                          {value.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                value={typeof item === 'string' ? item : JSON.stringify(item)}
                                onChange={(e) => {
                                  const newVal = [...value];
                                  try {
                                    newVal[idx] = JSON.parse(e.target.value);
                                  } catch {
                                    newVal[idx] = e.target.value;
                                  }
                                  handleSectionFieldChange(sectionKey, fieldKey, newVal);
                                }}
                                placeholder={`${fieldKey} ${idx + 1}`}
                                className="flex-1 px-3 py-2 rounded-xl border text-xs"
                              />
                              <button type="button" onClick={() => {
                                const newVal = [...value];
                                newVal.splice(idx, 1);
                                handleSectionFieldChange(sectionKey, fieldKey, newVal);
                              }} className="text-red-500 text-xs">Hapus</button>
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const newVal = [...value, ""];
                            handleSectionFieldChange(sectionKey, fieldKey, newVal);
                          }} className="text-xs border px-3 py-1 rounded-full hover:bg-muted">+ Tambah {fieldKey}</button>
                        </div>
                      );
                    }

                    return (
                      <div key={fieldKey} className="bg-white rounded-xl border p-3">
                        <label className="text-xs font-bold capitalize mb-1 block">{fieldKey} {isImage && "(Gambar)"}</label>
                        {isImage ? (
                          <div className="space-y-2">
                            {value && <img src={value} alt={fieldKey} className="w-full h-32 object-cover rounded-xl border" />}
                            <div className="flex gap-2">
                              <input
                                value={value || ""}
                                onChange={(e) => handleSectionFieldChange(sectionKey, fieldKey, e.target.value)}
                                placeholder={`/images/... atau https://...`}
                                className="flex-1 px-3 py-2 rounded-xl border text-xs"
                              />
                              <label className="bg-maroon-50 border border-maroon-100 px-3 py-2 rounded-xl text-xs cursor-pointer hover:bg-maroon-100 flex items-center gap-1">
                                <Upload className="w-3 h-3" /> {uploading === `${sectionKey}-${fieldKey}` ? "..." : "Upload"}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, sectionKey, fieldKey)} disabled={!!uploading} />
                              </label>
                            </div>
                          </div>
                        ) : isLongText ? (
                          <textarea
                            value={value || ""}
                            onChange={(e) => handleSectionFieldChange(sectionKey, fieldKey, e.target.value)}
                            rows={3}
                            placeholder={`${fieldKey}...`}
                            className="w-full px-3 py-2 rounded-xl border text-xs resize-none"
                          />
                        ) : (
                          <input
                            value={value || ""}
                            onChange={(e) => handleSectionFieldChange(sectionKey, fieldKey, e.target.value)}
                            placeholder={`${fieldKey}...`}
                            className="w-full px-3 py-2 rounded-xl border text-xs"
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="flex gap-2 pt-2">
                    <input id={`new-field-${sectionKey}`} placeholder="Nama field baru (contoh: subtitle)" className="flex-1 px-3 py-1.5 rounded-full border text-xs" />
                    <button type="button" onClick={() => {
                      const input = document.getElementById(`new-field-${sectionKey}`) as HTMLInputElement;
                      if (input && input.value) {
                        handleSectionFieldChange(sectionKey, input.value, "");
                        input.value = "";
                      }
                    }} className="text-xs bg-white border px-3 py-1.5 rounded-full">+ Field</button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border p-3">
                  <textarea
                    value={typeof section === 'string' ? section : JSON.stringify(section, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setForm({ ...form, sections: { ...form.sections, [sectionKey]: parsed } });
                      } catch {
                        setForm({ ...form, sections: { ...form.sections, [sectionKey]: e.target.value } });
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="flex gap-2">
          <input id="new-section" placeholder="Nama section baru (contoh: visi, misi, cta)" className="flex-1 px-3 py-2 rounded-xl border text-xs" />
          <button type="button" onClick={() => {
            const input = document.getElementById("new-section") as HTMLInputElement;
            if (input && input.value) {
              setForm({ ...form, sections: { ...form.sections, [input.value]: { title: "", description: "" } } });
              input.value = "";
            }
          }} className="bg-gold-50 border border-gold-200 px-4 py-2 rounded-xl text-xs font-semibold">+ Section</button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pengaturan Halaman - Edit Tiap Teks & Gambar</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola teks dan gambar untuk tiap halaman sesuai komponen yang tampil di public. Data Neon DB - Perubahan langsung live.</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ slug: "", title: "", description: "", sections: getDefaultSections("beranda"), seoTitle: "", seoDescription: "", isActive: true }); setShowModal(true); }} className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Halaman
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-soft p-4">
          <p className="text-sm font-semibold mb-3">Template Halaman (Klik untuk buat/edit sesuai komponen public):</p>
          <div className="flex flex-wrap gap-2">
            {defaultPages.map((dp) => {
              const exists = pages.find((p) => p.slug === dp.slug);
              return (
                <button key={dp.slug} onClick={() => exists ? handleEdit(exists) : handleCreateDefault(dp)} className={`text-xs border px-3 py-1.5 rounded-full ${exists ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "hover:bg-maroon-50 hover:border-maroon-200 hover:text-maroon-700"}`}>
                  {exists ? "✓ " : "+ "}{dp.title} ({dp.slug}) {exists ? `• ${Object.keys(exists.sections || {}).length} section` : ""}
                </button>
              );
            })}
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
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{page.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Slug: /{page.slug === "beranda" ? "" : page.slug} • {page.isActive ? "Aktif" : "Nonaktif"}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{page.description}</p>
                    <div className="mt-3">
                      <p className="text-[11px] font-bold">Komponen yang bisa diedit:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.keys(page.sections || {}).map((sec) => (
                          <span key={sec} className="text-[10px] bg-gold-50 border border-gold-100 px-2 py-1 rounded-full capitalize">{sec}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <a href={`/${page.slug === "beranda" ? "" : page.slug}`} target="_blank" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleEdit(page)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(page.id)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-large w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{editing ? "Edit" : "Tambah"} Halaman - {form.slug} <span className="text-xs bg-gold-50 border border-gold-200 px-2 py-1 rounded-full ml-2">{Object.keys(form.sections || {}).length} sections</span></h3>
                  <p className="text-xs text-muted-foreground mt-1">Edit tiap teks & gambar sesuai komponen di halaman public /{form.slug}. Perubahan langsung live di Neon DB.</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[11px] text-muted-foreground">Komponen public: {form.slug === 'beranda' ? 'hero, stats, about, layanan, portofolio, testimoni, FAQ, CTA' : form.slug === 'profil' ? 'hero, stats, about, visi, misi, nilai, CTA' : 'hero, content, CTA'} • </span>
                    <button type="button" onClick={handleLoadFullTemplate} className="text-[11px] bg-maroon-50 border border-maroon-100 text-maroon-700 px-2 py-0.5 rounded-full hover:bg-maroon-100">🔄 Load Template Lengkap ({Object.keys(getDefaultSections(form.slug || 'beranda')).length} sections)</button>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ml-4"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                {renderSectionEditor()}

                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
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
