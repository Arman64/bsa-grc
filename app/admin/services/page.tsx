/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Edit3, Upload, Building2, CheckCircle2, Megaphone, Eye, Image as ImageIcon, LibraryBig, AlertTriangle, Award, Star, HelpCircle, Trash2, Plus, X } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface LandingPageData {
 headline: string;
 subHeadline: string;
 badge?: string;
 heroImage: string;
 heroImages?: string[];
 heroVideoUrl?: string;
 valueProps: { title: string; description: string }[];
 benefits?: { title: string; desc: string }[];
 socialProof: {
 rating: string;
 reviews: string;
 projects: string;
 provinces: string;
 testimonials: { name: string; location: string; role: string; text: string; result: string; photo?: string }[];
 };
 ctaPrimary: string;
 ctaSecondary?: string;
 ctaSubtext?: string;
 guarantees: string[];
 painPoints?: { pain: string; solution: string }[];
 faqs?: { q: string; a: string }[];
 priceNote?: string;
}

interface ServiceItem {
 id: string;
 slug: string;
 title: string;
 shortTitle: string;
 description: string;
 longDescription: string;
 features: string[];
 image: string;
 originalImage: string;
 icon: string;
 priceRange: string;
 isActive: boolean;
 landingPage?: LandingPageData;
}

export default function AdminServicesPage() {
 const [services, setServices] = useState<ServiceItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [editing, setEditing] = useState<ServiceItem | null>(null);
 const [form, setForm] = useState<Partial<ServiceItem>>({});
 const [saving, setSaving] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [tab, setTab] = useState<"basic" | "landing">("basic");
 const [pickerTarget, setPickerTarget] = useState<"originalImage" | "landingHero" | null>(null);

 const fetchServices = async () => {
 setLoading(true);
 const res = await fetch("/api/admin/services");
 const json = await res.json();
 if (json.success) setServices(json.data);
 setLoading(false);
 };

 useEffect(() => {
 fetchServices();
 }, []);

 const handleEdit = (svc: ServiceItem) => {
 setEditing(svc);
 setForm({
  ...svc,
  landingPage: svc.landingPage || {
  headline: `${svc.title} Anti Bocor Garansi, Harga Pabrik`,
  subHeadline: svc.longDescription,
  badge: "Pabrik Langsung Trenggalek • 500+ Proyek",
  heroImage: svc.originalImage,
  heroImages: [svc.originalImage],
  valueProps: [
   { title: "Manfaat 1", description: "Deskripsi manfaat" },
   { title: "Manfaat 2", description: "Deskripsi manfaat" },
  ],
  benefits: [],
  socialProof: {
   rating: "5.0",
   reviews: "127",
   projects: "500+",
   provinces: "34 Provinsi",
   testimonials: [],
  },
  ctaPrimary: "Dapatkan Penawaran Gratis Sekarang",
  ctaSubtext: "Gratis desain 3D & survey",
  guarantees: ["Garansi 1 Tahun", "Gratis Desain & Survey", "Data Aman"],
  },
 });
 setTab("basic");
 };

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "originalImage" | "landingHero" = "originalImage") => {
 const file = e.target.files?.[0];
 if (!file) return;
 setUploading(true);
 const fd = new FormData();
 fd.append("file", file);
 fd.append("folder", "services");
 const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
 const json = await res.json();
 if (json.success) {
  applyImageToField(field, json.data.url);
 } else alert(json.message);
 setUploading(false);
 };

 const applyImageToField = (field: "originalImage" | "landingHero", url: string) => {
  if (field === "originalImage") {
  setForm({ ...form, originalImage: url, image: url });
  } else {
  setForm({
   ...form,
   landingPage: { ...form.landingPage!, heroImage: url, heroImages: [url, ...(form.landingPage?.heroImages || [])].slice(0, 5) } as LandingPageData,
  });
  }
 };

 const updateLP = (patch: Partial<LandingPageData>) => setForm({ ...form, landingPage: { ...form.landingPage!, ...patch } as LandingPageData });

 const removeHeroGalleryImage = (idx: number) => {
  const heroImages = [...(form.landingPage?.heroImages || [])];
  heroImages.splice(idx, 1);
  updateLP({ heroImages });
 };
 const addHeroGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "services");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (json.success) updateLP({ heroImages: [...(form.landingPage?.heroImages || []), json.data.url] });
 };

 const addPainPoint = () => updateLP({ painPoints: [...(form.landingPage?.painPoints || []), { pain: "", solution: "" }] });
 const updatePainPoint = (idx: number, key: "pain" | "solution", value: string) => {
  const list = [...(form.landingPage?.painPoints || [])];
  list[idx] = { ...list[idx], [key]: value };
  updateLP({ painPoints: list });
 };
 const removePainPoint = (idx: number) => {
  const list = [...(form.landingPage?.painPoints || [])];
  list.splice(idx, 1);
  updateLP({ painPoints: list });
 };

 const addBenefit = () => updateLP({ benefits: [...(form.landingPage?.benefits || []), { title: "", desc: "" }] });
 const updateBenefit = (idx: number, key: "title" | "desc", value: string) => {
  const list = [...(form.landingPage?.benefits || [])];
  list[idx] = { ...list[idx], [key]: value };
  updateLP({ benefits: list });
 };
 const removeBenefit = (idx: number) => {
  const list = [...(form.landingPage?.benefits || [])];
  list.splice(idx, 1);
  updateLP({ benefits: list });
 };

 const addFaq = () => updateLP({ faqs: [...(form.landingPage?.faqs || []), { q: "", a: "" }] });
 const updateFaq = (idx: number, key: "q" | "a", value: string) => {
  const list = [...(form.landingPage?.faqs || [])];
  list[idx] = { ...list[idx], [key]: value };
  updateLP({ faqs: list });
 };
 const removeFaq = (idx: number) => {
  const list = [...(form.landingPage?.faqs || [])];
  list.splice(idx, 1);
  updateLP({ faqs: list });
 };

 const updateSocialProof = (key: "rating" | "reviews" | "projects" | "provinces", value: string) => {
  updateLP({ socialProof: { ...form.landingPage!.socialProof, [key]: value } });
 };
 const addTestimonial = () =>
  updateLP({ socialProof: { ...form.landingPage!.socialProof, testimonials: [...(form.landingPage?.socialProof.testimonials || []), { name: "", location: "", role: "Panitia Masjid", text: "", result: "", photo: "" }] } });
 const updateTestimonial = (idx: number, key: "name" | "location" | "role" | "text" | "result" | "photo", value: string) => {
  const list = [...(form.landingPage?.socialProof.testimonials || [])];
  list[idx] = { ...list[idx], [key]: value };
  updateLP({ socialProof: { ...form.landingPage!.socialProof, testimonials: list } });
 };
 const removeTestimonial = (idx: number) => {
  const list = [...(form.landingPage?.socialProof.testimonials || [])];
  list.splice(idx, 1);
  updateLP({ socialProof: { ...form.landingPage!.socialProof, testimonials: list } });
 };
 const uploadTestimonialPhoto = async (idx: number, file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "testimonials");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (json.success) updateTestimonial(idx, "photo", json.data.url);
 };

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.id) return;
 setSaving(true);
 const res = await fetch("/api/admin/services", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
 });
 const json = await res.json();
 if (json.success) {
  setEditing(null);
  fetchServices();
 } else alert(json.message);
 setSaving(false);
 };

 return (
 <AdminLayout>
  <div className="max-w-6xl mx-auto space-y-6">
  <div className="flex flex-col sm:flex-row justify-between gap-4">
   <div>
   <h1 className="text-2xl font-bold flex items-center gap-2">
    <Megaphone className="w-6 h-6 text-maroon-700" />
    Kelola Layanan & Landing Page Ads
   </h1>
   <p className="text-sm text-muted-foreground mt-1">Edit teks, gambar, headline, value prop, testimoni, CTA untuk landing page Google Ads & FB Ads. Tiap halaman /layanan/[slug] adalah landing page tanpa navigasi.</p>
   </div>
   <div className="flex items-center gap-2">
   <span className="text-xs bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">5 Layanan Aktif • Ads Ready</span>
   </div>
  </div>

  {loading ? (
   <div className="grid md:grid-cols-2 gap-4">
   {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
   ))}
   </div>
  ) : editing ? (
   <div className="bg-white rounded-2xl border shadow-soft overflow-hidden max-w-5xl">
   <div className="flex justify-between items-center p-6 border-b bg-muted/30">
    <div>
    <h3 className="font-bold text-lg">Edit: {editing.title}</h3>
    <p className="text-xs text-muted-foreground">Slug: /layanan/{editing.slug} • Landing Page Ads</p>
    </div>
    <div className="flex gap-2">
    <a href={`/layanan/${editing.slug}`} target="_blank" className="text-sm border bg-white px-4 py-2 rounded-xl hover:bg-muted flex items-center gap-1">
     <Eye className="w-4 h-4" /> Preview Ads
    </a>
    <button onClick={() => setEditing(null)} className="text-sm border px-4 py-2 rounded-xl bg-white hover:bg-muted">
     Kembali
    </button>
    </div>
   </div>

   {/* Tabs */}
   <div className="flex gap-1 p-2 bg-muted/50 border-b">
    <button onClick={() => setTab("basic")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === "basic" ? "bg-white shadow-soft border" : "text-muted-foreground hover:text-foreground"}`}>
    Basic Info
    </button>
    <button onClick={() => setTab("landing")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === "landing" ? "bg-maroon-700 text-white shadow-maroon" : "text-muted-foreground hover:text-foreground"}`}>
    <Megaphone className="w-4 h-4 inline mr-1" />
    Landing Page Ads (8 Elemen)
    </button>
   </div>

   <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
    {tab === "basic" ? (
    <div className="grid md:grid-cols-2 gap-6">
     <div className="space-y-4">
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Gambar Layanan (Upload)</label>
      <div className="border-2 border-dashed rounded-xl p-3 text-center bg-muted/20">
      {form.originalImage && <img src={form.originalImage} alt="Preview" className="w-full h-40 object-contain bg-muted rounded-xl mb-3" />}
      <div className="flex items-center gap-2 justify-center flex-wrap">
      <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "originalImage")} className="text-xs" />
      <button type="button" onClick={() => setPickerTarget("originalImage")} data-testid="service-image-gallery-btn" className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 px-2.5 py-1 rounded-lg text-xs hover:bg-gold-100">
       <LibraryBig className="w-3.5 h-3.5" /> Galeri
      </button>
      </div>
      {uploading && <p className="text-xs text-maroon-700 mt-1">Uploading...</p>}
      </div>
     </div>
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Judul Lengkap *</label>
      <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
     </div>
     <div className="grid grid-cols-2 gap-3">
      <div>
      <label className="text-sm font-semibold mb-1.5 block">Short Title</label>
      <input value={form.shortTitle || ""} onChange={(e) => setForm({ ...form, shortTitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
      </div>
      <div>
      <label className="text-sm font-semibold mb-1.5 block">Harga Range</label>
      <input value={form.priceRange || ""} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
      </div>
     </div>
     </div>

     <div className="space-y-4">
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Deskripsi Singkat</label>
      <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
     </div>
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Deskripsi Panjang</label>
      <textarea value={form.longDescription || ""} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
     </div>
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Fitur (comma separated)</label>
      <textarea
      value={form.features?.join(", ") || ""}
      onChange={(e) => setForm({ ...form, features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
      rows={2}
      className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none"
      />
     </div>
     </div>
    </div>
    ) : (
    <div className="space-y-6">
     {/* Headline - Elemen 1 & 2 */}
     <div className="bg-gradient-to-br from-maroon-50 to-gold-50 border border-gold-100 rounded-2xl p-5 space-y-4">
     <h4 className="font-bold flex items-center gap-2">1 & 2. Headline & Sub-headline (Manfaat, Jelas Spesifik, Persuasif)</h4>
     <div>
      <label className="text-xs font-bold mb-1 block">Badge Atas (contoh: 🔥 Pabrik Langsung • 500+ Masjid)</label>
      <input value={form.landingPage?.badge || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, badge: e.target.value } as LandingPageData })} className="w-full px-3 py-2 rounded-xl border text-sm" />
     </div>
     <div>
      <label className="text-xs font-bold mb-1 block">Headline Memikat (Fokus Manfaat, Jelas) - Contoh: Kubah Masjid Anti Bocor 20 Tahun, Harga Pabrik Mulai Rp 1jt/m² - Pasang 7 Hari Beres</label>
      <input value={form.landingPage?.headline || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, headline: e.target.value } as LandingPageData })} className="w-full px-3 py-2 rounded-xl border text-sm font-bold" />
     </div>
     <div>
      <label className="text-xs font-bold mb-1 block">Sub-headline Pendukung (Persuasif, Elaborasi Janji)</label>
      <textarea value={form.landingPage?.subHeadline || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, subHeadline: e.target.value } as LandingPageData })} rows={3} className="w-full px-3 py-2 rounded-xl border text-sm resize-none" />
     </div>
     </div>

     {/* Visual Hero - Elemen 3 */}
     <div className="bg-white border rounded-2xl p-5 space-y-4">
     <h4 className="font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> 3. Visual Hero - Gambar/Video Real Project (Bukan Stock)</h4>
     <div>
      <label className="text-xs font-bold mb-1 block">Hero Image (Real Project, Kualitas Tinggi)</label>
      <div className="flex gap-3">
      {form.landingPage?.heroImage && <img src={form.landingPage.heroImage} alt="Hero" className="w-24 h-24 object-cover rounded-xl border" />}
      <div className="flex-1">
       <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "landingHero")} className="text-xs mb-2" />
       <button type="button" onClick={() => setPickerTarget("landingHero")} data-testid="service-hero-gallery-btn" className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 px-2.5 py-1 rounded-lg text-xs hover:bg-gold-100 mb-2 ml-2">
        <LibraryBig className="w-3.5 h-3.5" /> Galeri
       </button>
       <input value={form.landingPage?.heroImage || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, heroImage: e.target.value } as LandingPageData })} placeholder="URL hero image" className="w-full px-3 py-2 rounded-xl border text-xs" />
      </div>
      </div>
     </div>
     <div>
      <label className="text-xs font-bold mb-1 block">Hero Video URL (30-60 detik, YouTube optional)</label>
      <input value={form.landingPage?.heroVideoUrl || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, heroVideoUrl: e.target.value } as LandingPageData })} placeholder="https://youtube.com/..." className="w-full px-3 py-2 rounded-xl border text-xs" />
     </div>
     <div>
      <label className="text-xs font-bold mb-1 block">Galeri Foto Tambahan (Gallery Strip di bawah Hero Image)</label>
      <div className="flex flex-wrap gap-2 mb-2">
      {(form.landingPage?.heroImages || []).map((img, idx) => (
       <div key={idx} className="relative w-16 h-16 rounded-lg border overflow-hidden group">
       <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
       <button type="button" onClick={() => removeHeroGalleryImage(idx)} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <X className="w-4 h-4" />
       </button>
       </div>
      ))}
      </div>
      <input type="file" accept="image/*" onChange={addHeroGalleryImage} className="text-xs" />
     </div>
     </div>

     {/* Value Prop - Elemen 4 */}
     <div className="bg-white border rounded-2xl p-5 space-y-3">
     <h4 className="font-bold">4. Value Proposition - Manfaat Bukan Fitur (Bullet Points, Bahasa Sehari-hari)</h4>
     {(form.landingPage?.valueProps || []).map((vp, idx) => (
      <div key={idx} className="grid grid-cols-2 gap-2 border rounded-xl p-3 bg-muted/20">
      <input value={vp.title} onChange={(e) => { const vps = [...(form.landingPage?.valueProps || [])]; vps[idx].title = e.target.value; setForm({ ...form, landingPage: { ...form.landingPage!, valueProps: vps } as LandingPageData }); }} placeholder="Judul manfaat (Tidak Bocor Lagi)" className="px-3 py-2 rounded-lg border text-xs font-semibold" />
      <input value={vp.description} onChange={(e) => { const vps = [...(form.landingPage?.valueProps || [])]; vps[idx].description = e.target.value; setForm({ ...form, landingPage: { ...form.landingPage!, valueProps: vps } as LandingPageData }); }} placeholder="Deskripsi bahasa sehari-hari" className="px-3 py-2 rounded-lg border text-xs" />
      </div>
     ))}
     <button type="button" onClick={() => setForm({ ...form, landingPage: { ...form.landingPage!, valueProps: [...(form.landingPage?.valueProps || []), { title: "Manfaat Baru", description: "Deskripsi" }] } as LandingPageData })} className="text-xs border px-3 py-1 rounded-full hover:bg-muted">
      + Tambah Manfaat
     </button>
     </div>

     {/* Pain Points - Elemen 5 */}
     <div className="bg-white border rounded-2xl p-5 space-y-3">
     <h4 className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> 5. Pain Points - Masalah vs Solusi (tampil sebagai section "Apakah Anda Mengalami Masalah Ini?")</h4>
     {(form.landingPage?.painPoints || []).map((pp, idx) => (
      <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 border rounded-xl p-3 bg-red-50/30">
      <input value={pp.pain} onChange={(e) => updatePainPoint(idx, "pain", e.target.value)} placeholder="Masalah (Kubah bocor tiap hujan)" className="px-3 py-2 rounded-lg border text-xs" />
      <input value={pp.solution} onChange={(e) => updatePainPoint(idx, "solution", e.target.value)} placeholder="Solusi BSA GRC" className="px-3 py-2 rounded-lg border text-xs" />
      <button type="button" onClick={() => removePainPoint(idx)} className="text-red-600 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
      </div>
     ))}
     <button type="button" onClick={addPainPoint} className="text-xs border px-3 py-1 rounded-full hover:bg-muted inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Pain Point</button>
     </div>

     {/* Benefits Grid - Elemen 6 */}
     <div className="bg-white border rounded-2xl p-5 space-y-3">
     <h4 className="font-bold flex items-center gap-2"><Award className="w-4 h-4 text-maroon-700" /> 6. Keunggulan (Grid "6 Keunggulan BSA GRC" + dipakai ulang di CTA bawah)</h4>
     {(form.landingPage?.benefits || []).map((b, idx) => (
      <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 border rounded-xl p-3 bg-muted/20">
      <input value={b.title} onChange={(e) => updateBenefit(idx, "title", e.target.value)} placeholder="Judul keunggulan" className="px-3 py-2 rounded-lg border text-xs font-semibold" />
      <input value={b.desc} onChange={(e) => updateBenefit(idx, "desc", e.target.value)} placeholder="Deskripsi singkat" className="px-3 py-2 rounded-lg border text-xs" />
      <button type="button" onClick={() => removeBenefit(idx)} className="text-red-600 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
      </div>
     ))}
     <button type="button" onClick={addBenefit} className="text-xs border px-3 py-1 rounded-full hover:bg-muted inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Keunggulan</button>
     </div>

     {/* Social Proof - Elemen 7 */}
     <div className="bg-white border rounded-2xl p-5 space-y-4">
     <h4 className="font-bold flex items-center gap-2"><Star className="w-4 h-4 text-gold-500" /> 7. Social Proof - Rating, Statistik & Testimoni</h4>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div><label className="text-[11px] font-bold mb-1 block">Rating</label><input value={form.landingPage?.socialProof.rating || ""} onChange={(e) => updateSocialProof("rating", e.target.value)} placeholder="5.0" className="w-full px-3 py-2 rounded-lg border text-xs" /></div>
      <div><label className="text-[11px] font-bold mb-1 block">Jumlah Ulasan</label><input value={form.landingPage?.socialProof.reviews || ""} onChange={(e) => updateSocialProof("reviews", e.target.value)} placeholder="127" className="w-full px-3 py-2 rounded-lg border text-xs" /></div>
      <div><label className="text-[11px] font-bold mb-1 block">Jumlah Proyek</label><input value={form.landingPage?.socialProof.projects || ""} onChange={(e) => updateSocialProof("projects", e.target.value)} placeholder="500+" className="w-full px-3 py-2 rounded-lg border text-xs" /></div>
      <div><label className="text-[11px] font-bold mb-1 block">Provinsi</label><input value={form.landingPage?.socialProof.provinces || ""} onChange={(e) => updateSocialProof("provinces", e.target.value)} placeholder="34 Provinsi" className="w-full px-3 py-2 rounded-lg border text-xs" /></div>
     </div>

     <div className="space-y-3">
      <p className="text-xs font-bold">Testimoni (tampil sebagai kartu "Apa Kata Panitia yang Sudah Pakai?")</p>
      {(form.landingPage?.socialProof.testimonials || []).map((t, idx) => (
      <div key={idx} className="border rounded-xl p-3 bg-muted/20 space-y-2">
       <div className="flex items-center gap-3">
       {t.photo && <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover border flex-shrink-0" />}
       <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadTestimonialPhoto(idx, f); }} className="text-[11px] flex-1" />
       <button type="button" onClick={() => removeTestimonial(idx)} className="text-red-600 hover:bg-red-50 rounded-lg p-1.5 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
       </div>
       <div className="grid grid-cols-2 gap-2">
       <input value={t.name} onChange={(e) => updateTestimonial(idx, "name", e.target.value)} placeholder="Nama - H. Slamet" className="px-3 py-2 rounded-lg border text-xs" />
       <input value={t.location} onChange={(e) => updateTestimonial(idx, "location", e.target.value)} placeholder="Lokasi - Masjid Jami' Trenggalek" className="px-3 py-2 rounded-lg border text-xs" />
       </div>
       <input value={t.role} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} placeholder="Role - Ketua Panitia" className="w-full px-3 py-2 rounded-lg border text-xs" />
       <textarea value={t.text} onChange={(e) => updateTestimonial(idx, "text", e.target.value)} rows={2} placeholder="Isi testimoni spesifik" className="w-full px-3 py-2 rounded-lg border text-xs resize-none" />
       <input value={t.result} onChange={(e) => updateTestimonial(idx, "result", e.target.value)} placeholder="Hasil - Anti bocor 3 tahun" className="w-full px-3 py-2 rounded-lg border text-xs" />
      </div>
      ))}
      <button type="button" onClick={addTestimonial} className="text-xs border px-3 py-1 rounded-full hover:bg-muted inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Testimoni</button>
     </div>
     </div>

     {/* CTA - Elemen 8 */}
     <div className="grid md:grid-cols-2 gap-4">
     <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 space-y-3">
      <h4 className="font-bold text-sm">8. CTA Menonjol (Kontras Tinggi, Teks Aksi)</h4>
      <div>
      <label className="text-xs font-bold mb-1 block">Teks CTA (Jangan 'Kirim', pakai 'Dapatkan Penawaran Gratis Sekarang')</label>
      <input value={form.landingPage?.ctaPrimary || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, ctaPrimary: e.target.value } as LandingPageData })} className="w-full px-3 py-2 rounded-xl border text-sm font-bold" />
      </div>
      <div>
      <label className="text-xs font-bold mb-1 block">Subtext CTA (Gratis desain 3D + survey...)</label>
      <input value={form.landingPage?.ctaSubtext || ""} onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, ctaSubtext: e.target.value } as LandingPageData })} className="w-full px-3 py-2 rounded-xl border text-xs" />
      </div>
     </div>

     <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
      <h4 className="font-bold text-sm">9. Risk Reversal (Garansi, Data Aman)</h4>
      <textarea
      value={form.landingPage?.guarantees?.join(", ") || ""}
      onChange={(e) => setForm({ ...form, landingPage: { ...form.landingPage!, guarantees: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } as LandingPageData })}
      rows={4}
      placeholder="Garansi 1 Tahun, Data Aman 100%, Tanpa Biaya Tersembunyi"
      className="w-full px-3 py-2 rounded-xl border text-xs resize-none"
      />
     </div>
     </div>

     {/* FAQ - Elemen 10 */}
     <div className="bg-white border rounded-2xl p-5 space-y-3">
     <h4 className="font-bold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-maroon-700" /> 10. FAQ - Objection Handling</h4>
     {(form.landingPage?.faqs || []).map((faq, idx) => (
      <div key={idx} className="border rounded-xl p-3 bg-muted/20 space-y-2">
      <div className="flex gap-2">
       <input value={faq.q} onChange={(e) => updateFaq(idx, "q", e.target.value)} placeholder="Pertanyaan" className="flex-1 px-3 py-2 rounded-lg border text-xs font-semibold" />
       <button type="button" onClick={() => removeFaq(idx)} className="text-red-600 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
      </div>
      <textarea value={faq.a} onChange={(e) => updateFaq(idx, "a", e.target.value)} rows={2} placeholder="Jawaban" className="w-full px-3 py-2 rounded-lg border text-xs resize-none" />
      </div>
     ))}
     <button type="button" onClick={addFaq} className="text-xs border px-3 py-1 rounded-full hover:bg-muted inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah FAQ</button>
     </div>

     <div className="bg-muted/30 border border-dashed rounded-2xl p-4 text-xs">
     <p className="text-muted-foreground">Navigasi menu sudah dihapus otomatis di landing page (hapus semua menu atas agar tidak kabur) + loading cepat + mobile responsif sudah optimal.</p>
     </div>
    </div>
    )}

    <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white p-2">
    <button type="button" onClick={() => setEditing(null)} className="flex-1 border py-3 rounded-xl font-semibold">
     Batal
    </button>
    <button type="submit" disabled={saving} className="flex-1 bg-maroon-700 text-white py-3 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
     <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Landing Page"}
    </button>
    </div>
   </form>
   </div>
  ) : (
   <div className="grid md:grid-cols-2 gap-6">
   {services.map((svc) => (
    <div key={svc.id} className="bg-white rounded-2xl border shadow-soft p-5 hover:shadow-medium transition-shadow">
    <div className="flex gap-4">
     <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0 border">
     <img src={svc.originalImage} alt={svc.title} className="w-full h-full object-contain p-1" />
     </div>
     <div className="flex-1 min-w-0">
     <h3 className="font-bold text-sm truncate">{svc.title}</h3>
     <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{svc.landingPage?.headline || svc.description}</p>
     <div className="flex items-center gap-2 mt-3">
      <span className="text-xs bg-gold-50 text-gold-700 border px-2 py-1 rounded-full">{svc.priceRange}</span>
      <span className={`text-xs px-2 py-1 rounded-full border ${svc.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700"}`}>{svc.isActive ? "Ads Ready" : "Draft"}</span>
     </div>
     </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
     <button onClick={() => handleEdit(svc)} className="bg-maroon-50 hover:bg-maroon-100 text-maroon-700 border border-maroon-100 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1">
     <Edit3 className="w-4 h-4" /> Edit Landing Page
     </button>
     <a href={`/layanan/${svc.slug}`} target="_blank" className="bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1">
     <Building2 className="w-4 h-4" /> Preview Ads
     </a>
    </div>
    </div>
   ))}
   </div>
  )}
  </div>

  <MediaPickerModal
   open={pickerTarget !== null}
   onClose={() => setPickerTarget(null)}
   initialFolder="services"
   onSelect={(url) => { if (pickerTarget) applyImageToField(pickerTarget, url); }}
  />
 </AdminLayout>
 );
}
