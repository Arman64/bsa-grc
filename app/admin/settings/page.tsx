"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Building2, Phone, MapPin, Search, Link2, Info, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [syncPhone, setSyncPhone] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const data = json.data;
          data.seo = data.seo || { siteUrl: "", googleVerification: "", ogImage: "" };
          if (!data.company.phoneDisplay) data.company.phoneDisplay = data.company.phone || data.company.whatsappDisplay;
          if (!data.company.phone) data.company.phone = data.company.whatsapp?.replace(/^62/, "0") || data.company.phoneDisplay;
          setSettings(data);
        }
        setLoading(false);
      });
  }, []);

  const setC = (patch: any) => setSettings((s: any) => ({ ...s, company: { ...s.company, ...patch } }));
  const setSeo = (patch: any) => setSettings((s: any) => ({ ...s, seo: { ...s.seo, ...patch } }));

  const handleWhatsAppChange = (value: string) => {
    const patch: any = { whatsapp: value };
    if (syncPhone) {
      const phone0 = value.replace(/^62/, "0");
      const display = phone0.replace(/(\d{4})(\d{4})(\d{4,5})/, "$1-$2-$3");
      patch.phone = phone0;
      patch.phoneDisplay = display;
      patch.whatsappDisplay = display;
    }
    setC(patch);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    const json = await res.json();
    setMessage(json.success ? "✓ Tersimpan & langsung tayang di header, footer, kontak, floating button." : "Gagal menyimpan.");
    setSaving(false);
    setTimeout(() => setMessage(""), 5000);
  };

  if (loading) return <AdminLayout><div className="flex items-center gap-2 text-muted-foreground h-64 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Memuat...</div></AdminLayout>;
  if (!settings) return null;
  const c = settings.company;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-maroon-700" /> Pengaturan Umum</h1>
          <p className="text-sm text-muted-foreground mt-1">Info perusahaan, kontak, lokasi maps & SEO global.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm flex gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Teks hero, judul section, dll diedit di menu <Link href="/admin/pages" className="font-bold underline">Halaman</Link>. Logo & warna di <Link href="/admin/appearance" className="font-bold underline">Tampilan</Link>.</span>
        </div>

        {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{message}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-sm">Informasi Perusahaan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold mb-1.5 block">Nama Perusahaan</label><input value={c.name || ""} onChange={(e) => setC({ name: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
              <div><label className="text-xs font-semibold mb-1.5 block">Tagline</label><input value={c.tagline || ""} onChange={(e) => setC({ tagline: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            </div>
            <div><label className="text-xs font-semibold mb-1.5 block">Deskripsi</label><textarea value={c.description || ""} onChange={(e) => setC({ description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" /></div>
            <div><label className="text-xs font-semibold mb-1.5 block">Alamat Lengkap</label><textarea value={c.address || ""} onChange={(e) => setC({ address: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs font-semibold mb-1.5 block">Email</label><input value={c.email || ""} onChange={(e) => setC({ email: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
              <div><label className="text-xs font-semibold mb-1.5 block">Tahun Pengalaman</label><input type="number" value={c.yearsExperience || 0} onChange={(e) => setC({ yearsExperience: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
              <div><label className="text-xs font-semibold mb-1.5 block">Proyek Selesai</label><input type="number" value={c.projectsCompleted || 0} onChange={(e) => setC({ projectsCompleted: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-maroon-700" /> Kontak WhatsApp & Telepon</h3>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" checked={syncPhone} onChange={(e) => setSyncPhone(e.target.checked)} className="rounded" /><Link2 className="w-3 h-3" /> Samakan</label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-green-700">WhatsApp</p>
                <input value={c.whatsapp || ""} onChange={(e) => handleWhatsAppChange(e.target.value)} placeholder="6281230469914" className="w-full px-3 py-2 rounded-lg border text-sm font-mono" />
                <input value={c.whatsappDisplay || ""} onChange={(e) => setC({ whatsappDisplay: e.target.value })} placeholder="0812-3046-9914" className="w-full px-3 py-2 rounded-lg border text-sm" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-maroon-700">Telepon</p>
                <input value={c.phone || ""} onChange={(e) => setC({ phone: e.target.value })} placeholder="081230469914" className="w-full px-3 py-2 rounded-lg border text-sm font-mono" disabled={syncPhone} />
                <input value={c.phoneDisplay || ""} onChange={(e) => setC({ phoneDisplay: e.target.value })} placeholder="0812-3046-9914" className="w-full px-3 py-2 rounded-lg border text-sm" disabled={syncPhone} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-maroon-700" /> Lokasi Maps (Halaman Kontak)</h3>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-[11px] font-bold mb-1 block">Latitude</label><input type="number" step="any" value={c.mapLat ?? -8.129491} onChange={(e) => setC({ mapLat: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm font-mono" /></div>
              <div><label className="text-[11px] font-bold mb-1 block">Longitude</label><input type="number" step="any" value={c.mapLng ?? 111.721688} onChange={(e) => setC({ mapLng: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm font-mono" /></div>
              <div><label className="text-[11px] font-bold mb-1 block">Zoom</label><input type="number" min="1" max="20" value={c.mapZoom ?? 15} onChange={(e) => setC({ mapZoom: parseInt(e.target.value) })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            </div>
            <div><label className="text-[11px] font-bold mb-1 block">Link Google Maps (tombol Buka Maps)</label><input value={c.mapLink || ""} onChange={(e) => setC({ mapLink: e.target.value })} placeholder="https://maps.google.com/?q=..." className="w-full px-3 py-2 rounded-lg border text-xs" /></div>
            <div className="h-[180px] rounded-lg overflow-hidden border bg-muted">
              <iframe src={c.mapEmbedUrl || `https://www.google.com/maps?q=${c.mapLat ?? -8.129491},${c.mapLng ?? 111.721688}&z=${c.mapZoom ?? 15}&output=embed`} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Preview Maps" />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2"><Search className="w-4 h-4 text-maroon-700" /> SEO Global</h3>
            <div><label className="text-xs font-semibold mb-1.5 block">Site URL</label><input value={settings.seo.siteUrl || ""} onChange={(e) => setSeo({ siteUrl: e.target.value })} placeholder="https://bsagrc.co.id" className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="text-xs font-semibold mb-1.5 block">Google Site Verification</label><input value={settings.seo.googleVerification || ""} onChange={(e) => setSeo({ googleVerification: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="text-xs font-semibold mb-1.5 block">Gambar OG (Open Graph / share)</label><input value={settings.seo.ogImage || ""} onChange={(e) => setSeo({ ogImage: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-maroon-700 text-white py-3.5 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
