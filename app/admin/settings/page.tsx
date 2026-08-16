/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Building2, Phone, Image as ImageIcon, FileText, MessageCircle, Link2 } from "lucide-react";

interface Settings {
 company: {
 name: string;
 fullName: string;
 tagline: string;
 description: string;
 whatsapp: string;
 whatsappDisplay: string;
 phone: string;
 phoneDisplay: string;
 email: string;
 address: string;
 yearsExperience: number;
 projectsCompleted: number;
 };
 hero: {
 title: string;
 subtitle: string;
 image: string;
 ctaPrimary: string;
 ctaSecondary: string;
 };
 usp: { title: string; description: string }[];
 seo: { siteUrl: string; googleVerification: string };
}

export default function AdminSettingsPage() {
 const [settings, setSettings] = useState<Settings | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [message, setMessage] = useState("");
 const [syncPhone, setSyncPhone] = useState(true);

 const fetchSettings = async () => {
 setLoading(true);
 const res = await fetch("/api/admin/settings");
 const json = await res.json();
 if (json.success) {
  // Ensure phoneDisplay exists for backward compat
  const data = json.data as Settings;
  if (!data.company.phoneDisplay) {
  data.company.phoneDisplay = data.company.phone || data.company.whatsappDisplay;
  }
  if (!data.company.phone) {
  data.company.phone = data.company.whatsapp?.replace(/^62/, "0") || data.company.phoneDisplay;
  }
  setSettings(data);
  // Check if phone and whatsapp are synced
  const wa0 = data.company.whatsapp?.replace(/^62/, "0");
  setSyncPhone(wa0 === data.company.phone || data.company.phone === data.company.whatsappDisplay);
 }
 setLoading(false);
 };

 useEffect(() => {
 fetchSettings();
 }, []);

 const handleUploadHero = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file || !settings) return;
 setUploading(true);
 const fd = new FormData();
 fd.append("file", file);
 fd.append("folder", "services");
 const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
 const json = await res.json();
 if (json.success) {
  setSettings({ ...settings, hero: { ...settings.hero, image: json.data.url } });
 }
 setUploading(false);
 };

 const handleWhatsAppChange = (value: string) => {
 if (!settings) return;
 const newSettings = { ...settings, company: { ...settings.company, whatsapp: value } };
 
 // If sync enabled, auto update phone & displays
 if (syncPhone) {
  const phone0 = value.replace(/^62/, "0");
  // Format display: 0812-3046-9914 style (simple: add dashes)
  const display = phone0.replace(/(\d{4})(\d{4})(\d{4,5})/, "$1-$2-$3");
  newSettings.company.phone = phone0;
  newSettings.company.phoneDisplay = display;
  // Also update whatsappDisplay if it was same as before or empty
  if (!settings.company.whatsappDisplay || settings.company.whatsappDisplay === settings.company.phoneDisplay) {
  newSettings.company.whatsappDisplay = display;
  }
 }
 setSettings(newSettings);
 };

 const handleWhatsAppDisplayChange = (value: string) => {
 if (!settings) return;
 const newSettings = { ...settings, company: { ...settings.company, whatsappDisplay: value } };
 if (syncPhone) {
  newSettings.company.phoneDisplay = value;
  newSettings.company.phone = value.replace(/-/g, "");
 }
 setSettings(newSettings);
 };

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!settings) return;
 setSaving(true);
 setMessage("");

 const res = await fetch("/api/admin/settings", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settings),
 });

 const json = await res.json();
 setMessage(json.message + " - Coba refresh frontend (Ctrl+Shift+R) untuk lihat perubahan di header, footer, floating buttons.");
 setSaving(false);
 setTimeout(() => setMessage(""), 6000);
 };

 if (loading) {
 return (
  <AdminLayout>
  <div className="max-w-4xl mx-auto space-y-6">
   <div className="h-32 bg-muted animate-pulse rounded-2xl" />
   <div className="h-96 bg-muted animate-pulse rounded-2xl" />
  </div>
  </AdminLayout>
 );
 }

 if (!settings) return null;

 return (
 <AdminLayout>
  <div className="max-w-4xl mx-auto space-y-6">
  <div>
   <h1 className="text-2xl font-bold">Pengaturan Website</h1>
   <p className="text-sm text-muted-foreground mt-1">Atur teks hero, info perusahaan, USP, kontak (WA & Telepon terpisah), SEO. Perubahan langsung live di semua halaman termasuk floating buttons tengah.</p>
  </div>

  {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{message}</div>}

  <form onSubmit={handleSave} className="space-y-8">
   {/* Company Info */}
   <div className="bg-white rounded-2xl border shadow-soft p-6 space-y-5">
   <h3 className="font-bold flex items-center gap-2">
    <Building2 className="w-5 h-5 text-maroon-700" />
    Informasi Perusahaan
   </h3>

   <div className="grid md:grid-cols-2 gap-4">
    <div>
    <label className="text-sm font-semibold mb-1.5 block">Nama Perusahaan</label>
    <input value={settings.company.name} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, name: e.target.value } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    </div>
    <div>
    <label className="text-sm font-semibold mb-1.5 block">Tagline</label>
    <input value={settings.company.tagline} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, tagline: e.target.value } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    </div>
   </div>

   <div>
    <label className="text-sm font-semibold mb-1.5 block">Deskripsi Perusahaan</label>
    <textarea value={settings.company.description} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, description: e.target.value } })} rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
   </div>

   {/* Kontak - WA & Telepon Terpisah dengan Sync */}
   <div className="bg-gradient-to-br from-gold-50 to-maroon-50/30 border border-gold-100 rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
    <h4 className="font-bold text-sm flex items-center gap-2">
     <Phone className="w-4 h-4 text-maroon-700" />
     Kontak WhatsApp & Telepon (Terpisah)
    </h4>
    <label className="flex items-center gap-2 text-xs cursor-pointer">
     <input type="checkbox" checked={syncPhone} onChange={(e) => setSyncPhone(e.target.checked)} className="rounded" />
     <span className="flex items-center gap-1">
     <Link2 className="w-3 h-3" /> Samakan No. Telp & WA
     </span>
    </label>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
    <div className="bg-white rounded-xl border p-4 space-y-3">
     <p className="text-xs font-bold text-green-700 flex items-center gap-1">
     <MessageCircle className="w-3 h-3" /> WhatsApp (untuk tombol hijau)
     </p>
     <div>
     <label className="text-[11px] font-semibold mb-1 block">No WA Format 628... (untuk link api.whatsapp.com)</label>
     <input value={settings.company.whatsapp} onChange={(e) => handleWhatsAppChange(e.target.value)} placeholder="6281230469914" className="w-full px-3 py-2 rounded-xl border text-sm font-mono" />
     </div>
     <div>
     <label className="text-[11px] font-semibold mb-1 block">Tampilan WA (0812-3046-9914)</label>
     <input value={settings.company.whatsappDisplay} onChange={(e) => handleWhatsAppDisplayChange(e.target.value)} placeholder="0812-3046-9914" className="w-full px-3 py-2 rounded-xl border text-sm" />
     </div>
     <p className="text-[11px] text-muted-foreground">Tombol hijau WA di tengah bawah + bubble chat</p>
    </div>

    <div className="bg-white rounded-xl border p-4 space-y-3">
     <p className="text-xs font-bold text-maroon-700 flex items-center gap-1">
     <Phone className="w-3 h-3" /> Telepon (untuk tombol maroon)
     </p>
     <div>
     <label className="text-[11px] font-semibold mb-1 block">No Telepon Format 08... (untuk tel: link)</label>
     <input value={settings.company.phone} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, phone: e.target.value } })} placeholder="081230469914" className="w-full px-3 py-2 rounded-xl border text-sm font-mono" disabled={syncPhone} />
     </div>
     <div>
     <label className="text-[11px] font-semibold mb-1 block">Tampilan Telepon (0812-3046-9914)</label>
     <input value={settings.company.phoneDisplay} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, phoneDisplay: e.target.value } })} placeholder="0812-3046-9914" className="w-full px-3 py-2 rounded-xl border text-sm" disabled={syncPhone} />
     </div>
     <p className="text-[11px] text-muted-foreground">Tombol maroon telepon di tengah bawah (header top bar)</p>
    </div>
    </div>

    <div className="bg-white/70 rounded-xl p-3 border border-dashed text-[11px] text-muted-foreground">
    <p className="font-semibold text-foreground">Penjelasan:</p>
    <ul className="list-disc pl-4 mt-1 space-y-1">
     <li><strong>Jika centang "Samakan"</strong>: Ubah WA → Telepon ikut berubah otomatis. Cocok jika pakai nomor sama untuk WA & telepon (umum).</li>
     <li><strong>Jika tidak centang</strong>: WA & Telepon bisa beda nomor. Misal WA 0812-3046-9915 (admin) & Telepon 0812-3046-9914 (kantor).</li>
     <li>Display = format yang tampil di frontend (pakai dash). Nomor asli 628... untuk link.</li>
    </ul>
    </div>
   </div>

   <div>
    <label className="text-sm font-semibold mb-1.5 block">Alamat Lengkap Pabrik</label>
    <textarea value={settings.company.address} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, address: e.target.value } })} rows={2} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
   </div>

   <div className="grid grid-cols-3 gap-4">
    <div>
    <label className="text-sm font-semibold mb-1.5 block">Email</label>
    <input value={settings.company.email} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, email: e.target.value } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    </div>
    <div>
    <label className="text-sm font-semibold mb-1.5 block">Tahun Pengalaman</label>
    <input type="number" value={settings.company.yearsExperience} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, yearsExperience: Number(e.target.value) } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    </div>
    <div>
    <label className="text-sm font-semibold mb-1.5 block">Proyek Selesai</label>
    <input type="number" value={settings.company.projectsCompleted} onChange={(e) => setSettings({ ...settings, company: { ...settings.company, projectsCompleted: Number(e.target.value) } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    </div>
   </div>
   </div>

   {/* Hero Section */}
   <div className="bg-white rounded-2xl border shadow-soft p-6 space-y-5">
   <h3 className="font-bold flex items-center gap-2">
    <ImageIcon className="w-5 h-5 text-gold-600" />
    Hero Section - Beranda (Gambar & Teks)
   </h3>

   <div>
    <label className="text-sm font-semibold mb-1.5 block">Hero Image (Gambar Utama LCP)</label>
    <div className="border-2 border-dashed rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
    {settings.hero.image && <img src={settings.hero.image} alt="Hero" className="w-full sm:w-56 h-36 object-contain bg-muted rounded-xl border" />}
    <div className="flex-1 space-y-2">
     <input type="file" accept="image/*" onChange={handleUploadHero} className="text-xs" />
     {uploading && <p className="text-xs text-maroon-700">Uploading...</p>}
     <input value={settings.hero.image} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, image: e.target.value } })} placeholder="URL gambar hero" className="w-full px-3 py-2 rounded-xl border text-xs" />
     <p className="text-[11px] text-muted-foreground">Rekomendasi: WebP/AVIF, max 500KB, priority LCP &lt;2.5s. Upload otomatis ke /images/services/</p>
    </div>
    </div>
   </div>

   <div>
    <label className="text-sm font-semibold mb-1.5 block">Judul Hero (H1)</label>
    <input value={settings.hero.title} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
   </div>

   <div>
    <label className="text-sm font-semibold mb-1.5 block">Sub Judul / Deskripsi Hero</label>
    <textarea value={settings.hero.subtitle} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })} rows={3} className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
   </div>
   </div>

   {/* USP */}
   <div className="bg-white rounded-2xl border shadow-soft p-6 space-y-4">
   <h3 className="font-bold flex items-center gap-2">
    <FileText className="w-5 h-5 text-maroon-700" />
    USP - Keunggulan (4 poin di Hero)
   </h3>
   <div className="grid md:grid-cols-2 gap-4">
    {settings.usp.map((usp, idx) => (
    <div key={idx} className="border rounded-xl p-4 space-y-2">
     <input value={usp.title} onChange={(e) => { const newUsp = [...settings.usp]; newUsp[idx].title = e.target.value; setSettings({ ...settings, usp: newUsp }); }} placeholder="Judul USP" className="w-full px-3 py-2 rounded-lg border text-sm font-semibold" />
     <input value={usp.description} onChange={(e) => { const newUsp = [...settings.usp]; newUsp[idx].description = e.target.value; setSettings({ ...settings, usp: newUsp }); }} placeholder="Deskripsi singkat" className="w-full px-3 py-2 rounded-lg border text-xs" />
    </div>
    ))}
   </div>
   </div>

   <button type="submit" disabled={saving} className="w-full bg-maroon-700 text-white py-4 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
   <Save className="w-5 h-5" /> {saving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
   </button>

   <p className="text-xs text-center text-muted-foreground">Perubahan disimpan ke <code className="bg-muted px-1 py-0.5 rounded">data/settings.json</code> & langsung tampil di header top bar, footer, floating buttons tengah (Telepon & WA terpisah), hero, dll. Hard refresh Ctrl+Shift+R untuk lihat.</p>
  </form>
  </div>
 </AdminLayout>
 );
}
