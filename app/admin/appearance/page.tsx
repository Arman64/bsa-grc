"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageField from "@/components/admin/ImageField";
import { Save, Palette, Loader2, Image as ImageIcon, PanelTop, Layout } from "lucide-react";

export default function AppearancePage() {
  const [ap, setAp] = useState<any>(null);
  const [footer, setFooter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/chrome").then((r) => r.json()).then((j) => {
      if (j.success) { setAp(j.data.appearance); setFooter(j.data.footer); }
      setLoading(false);
    });
  }, []);

  const set = (patch: any) => setAp((s: any) => ({ ...s, ...patch }));
  const setF = (patch: any) => setFooter((s: any) => ({ ...s, ...patch }));

  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/chrome", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appearance: ap, footer }) });
    const j = await res.json();
    setMsg(j.success ? "✓ " + j.message : "Gagal menyimpan");
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  if (loading || !ap) return <AdminLayout><div className="flex items-center gap-2 text-muted-foreground h-64 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Memuat...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Palette className="w-6 h-6 text-maroon-700" /> Logo & Tampilan</h1>
          <p className="text-sm text-muted-foreground mt-1">Atur logo, favicon, nama brand, top bar & footer.</p>
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{msg}</div>}

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-5">
          <h3 className="font-bold text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4 text-maroon-700" /> Logo & Favicon</h3>
          <div><label className="text-xs font-semibold mb-1.5 block">Logo Header</label><ImageField value={ap.logo} onChange={(v) => set({ logo: v })} folder="brand" /></div>
          <div><label className="text-xs font-semibold mb-1.5 block">Logo Footer</label><ImageField value={ap.logoFooter} onChange={(v) => set({ logoFooter: v })} folder="brand" /></div>
          <div><label className="text-xs font-semibold mb-1.5 block">Favicon (ikon tab browser)</label><ImageField value={ap.favicon} onChange={(v) => set({ favicon: v })} folder="brand" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Layout className="w-4 h-4 text-maroon-700" /> Nama Brand & Warna</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold mb-1.5 block">Nama Brand</label><input value={ap.brandName || ""} onChange={(e) => set({ brandName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="text-xs font-semibold mb-1.5 block">Aksen Brand</label><input value={ap.brandAccent || ""} onChange={(e) => set({ brandAccent: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          </div>
          <div><label className="text-xs font-semibold mb-1.5 block">Tagline Brand</label><input value={ap.brandTagline || ""} onChange={(e) => set({ brandTagline: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold block">Warna Tema (browser)</label>
            <input type="color" value={ap.themeColor || "#7A0C10"} onChange={(e) => set({ themeColor: e.target.value })} className="w-10 h-8 rounded border cursor-pointer" />
            <input value={ap.themeColor || ""} onChange={(e) => set({ themeColor: e.target.value })} className="px-3 py-2 rounded-lg border text-sm font-mono w-32" />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><PanelTop className="w-4 h-4 text-maroon-700" /> Top Bar (atas header)</h3>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!ap.showTopbar} onChange={(e) => set({ showTopbar: e.target.checked })} className="rounded" /> Tampilkan top bar</label>
          <div><label className="text-xs font-semibold mb-1.5 block">Teks Kiri (setelah nomor telp)</label><input value={ap.topbarLeft || ""} onChange={(e) => set({ topbarLeft: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          <div><label className="text-xs font-semibold mb-1.5 block">Teks Kanan</label><input value={ap.topbarRight || ""} onChange={(e) => set({ topbarRight: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        </div>

        {footer && (
          <div className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-sm">Footer</h3>
            <div><label className="text-xs font-semibold mb-1.5 block">Deskripsi Footer</label><textarea value={footer.description || ""} onChange={(e) => setF({ description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold mb-1.5 block">Badge 1</label><input value={footer.badge1 || ""} onChange={(e) => setF({ badge1: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
              <div><label className="text-xs font-semibold mb-1.5 block">Badge 2</label><input value={footer.badge2 || ""} onChange={(e) => setF({ badge2: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            </div>
            <div><label className="text-xs font-semibold mb-1.5 block">Catatan Bawah</label><input value={footer.bottomNote || ""} onChange={(e) => setF({ bottomNote: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          </div>
        )}

        <button onClick={save} disabled={saving} data-testid="save-appearance-btn" className="w-full bg-maroon-700 text-white py-3.5 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saving ? "Menyimpan..." : "Simpan Tampilan"}
        </button>
      </div>
    </AdminLayout>
  );
}
