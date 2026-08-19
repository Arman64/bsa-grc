"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Save, Menu as MenuIcon, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Info } from "lucide-react";

function LinkList({ title, items, onChange, allowServices }: { title: string; items: any[]; onChange: (v: any[]) => void; allowServices?: boolean }) {
  const setAt = (i: number, patch: any) => { const n = [...items]; n[i] = { ...n[i], ...patch }; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  const add = () => onChange([...items, { label: "Menu Baru", href: "/" }]);
  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="bg-white rounded-xl border shadow-soft p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">{title} <span className="text-muted-foreground font-normal">({items.length})</span></h3>
        <button onClick={add} className="inline-flex items-center gap-1 text-xs bg-maroon-50 border border-maroon-100 text-maroon-700 px-2.5 py-1.5 rounded-lg hover:bg-maroon-100"><Plus className="w-3.5 h-3.5" /> Tambah</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center bg-muted/30 rounded-lg p-2">
            <input value={item.label || ""} onChange={(e) => setAt(i, { label: e.target.value })} placeholder="Label" className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border text-sm" />
            <input value={item.href || ""} onChange={(e) => setAt(i, { href: e.target.value })} placeholder="/path atau https://" className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border text-sm font-mono" />
            {allowServices && (
              <label className="flex items-center gap-1 text-[11px] whitespace-nowrap" title="Tampilkan dropdown daftar layanan">
                <input type="checkbox" checked={!!item.isServices} onChange={(e) => setAt(i, { isServices: e.target.checked })} className="rounded" /> Dropdown Layanan
              </label>
            )}
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="p-1.5 hover:bg-white rounded" aria-label="Naik"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => move(i, 1)} className="p-1.5 hover:bg-white rounded" aria-label="Turun"><ArrowDown className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" aria-label="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenusPage() {
  const [nav, setNav] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/chrome").then((r) => r.json()).then((j) => { if (j.success) setNav(j.data.navigation); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/chrome", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ navigation: nav }) });
    const j = await res.json();
    setMsg(j.success ? "✓ " + j.message : "Gagal menyimpan");
    setSaving(false);
    setTimeout(() => setMsg(""), 4000);
  };

  if (loading || !nav) return <AdminLayout><div className="flex items-center gap-2 text-muted-foreground h-64 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Memuat...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><MenuIcon className="w-6 h-6 text-maroon-700" /> Menu Navigasi</h1>
          <p className="text-sm text-muted-foreground mt-1">Atur menu header & footer. Urutkan dengan panah.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm flex gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> Centang "Dropdown Layanan" pada satu menu agar menampilkan daftar layanan otomatis.
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{msg}</div>}

        <LinkList title="Menu Header" items={nav.header || []} onChange={(v) => setNav({ ...nav, header: v })} allowServices />
        <div className="bg-white rounded-xl border shadow-soft p-5">
          <label className="text-xs font-semibold mb-1.5 block">Label Tombol CTA (header kanan)</label>
          <input value={nav.ctaLabel || ""} onChange={(e) => setNav({ ...nav, ctaLabel: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
        </div>
        <LinkList title="Menu Footer" items={nav.footerLinks || []} onChange={(v) => setNav({ ...nav, footerLinks: v })} />

        <button onClick={save} disabled={saving} data-testid="save-menus-btn" className="w-full bg-maroon-700 text-white py-3.5 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saving ? "Menyimpan..." : "Simpan Menu"}
        </button>
      </div>
    </AdminLayout>
  );
}
