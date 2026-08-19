"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Globe, Loader2, BarChart3, Webhook, Facebook, Info } from "lucide-react";

export default function IntegrationsPage() {
  const [intg, setIntg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/chrome").then((r) => r.json()).then((j) => { if (j.success) setIntg(j.data.integrations); setLoading(false); });
  }, []);

  const set = (patch: any) => setIntg((s: any) => ({ ...s, ...patch }));

  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/chrome", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ integrations: intg }) });
    const j = await res.json();
    setMsg(j.success ? "✓ " + j.message : "Gagal menyimpan");
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  if (loading || !intg) return <AdminLayout><div className="flex items-center gap-2 text-muted-foreground h-64 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Memuat...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6 text-maroon-700" /> SEO & Integrasi</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics, pixel, webhook form kontak & script tambahan.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm flex gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> SEO judul/deskripsi tiap halaman diedit di <b>Halaman → (pilih) → SEO Halaman Ini</b>. SEO global di <b>Pengaturan Umum</b>.
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{msg}</div>}

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-maroon-700" /> Google Analytics 4</h3>
          <div><label className="text-xs font-semibold mb-1.5 block">Measurement ID (G-XXXXXXX)</label><input value={intg.gaId || ""} onChange={(e) => set({ gaId: e.target.value })} placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2 rounded-lg border text-sm font-mono" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Facebook className="w-4 h-4 text-maroon-700" /> Meta / Facebook Pixel</h3>
          <div><label className="text-xs font-semibold mb-1.5 block">Pixel ID</label><input value={intg.metaPixelId || ""} onChange={(e) => set({ metaPixelId: e.target.value })} placeholder="1234567890" className="w-full px-3 py-2 rounded-lg border text-sm font-mono" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-maroon-700" /> Webhook Form Kontak</h3>
          <div><label className="text-xs font-semibold mb-1.5 block">Webhook URL (mis. n8n / Zapier). Data form kontak dikirim ke sini.</label><input value={intg.webhookUrl || ""} onChange={(e) => set({ webhookUrl: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm">Script Kustom (lanjutan)</h3>
          <div><label className="text-xs font-semibold mb-1.5 block">Kode JavaScript tambahan (dijalankan di semua halaman)</label><textarea value={intg.headScripts || ""} onChange={(e) => set({ headScripts: e.target.value })} rows={4} placeholder="// contoh: console.log('hi')" className="w-full px-3 py-2 rounded-lg border text-xs font-mono resize-none" /></div>
          <p className="text-[11px] text-muted-foreground">Masukkan JS murni tanpa tag &lt;script&gt;. Kosongkan jika tidak perlu.</p>
        </div>

        <button onClick={save} disabled={saving} data-testid="save-integrations-btn" className="w-full bg-maroon-700 text-white py-3.5 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saving ? "Menyimpan..." : "Simpan Integrasi"}
        </button>
      </div>
    </AdminLayout>
  );
}
