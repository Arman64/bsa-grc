"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserCog, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function AccountPage() {
  const [me, setMe] = useState<any>({});
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((j) => { if (j.success) setMe(j.user); });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ type: "err", text: "Password baru minimal 8 karakter" });
    if (next !== confirm) return setMsg({ type: "err", text: "Konfirmasi password tidak cocok" });
    setSaving(true);
    const res = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: current, newPassword: next }) });
    const j = await res.json();
    setMsg({ type: j.success ? "ok" : "err", text: j.message });
    if (j.success) { setCurrent(""); setNext(""); setConfirm(""); }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><UserCog className="w-6 h-6 text-maroon-700" /> Akun & Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola keamanan akun admin.</p>
        </div>

        <div className="bg-white rounded-xl border shadow-soft p-6 space-y-2">
          <p className="text-xs text-muted-foreground">Login sebagai</p>
          <p className="font-bold text-foreground">{me.name || "Administrator"}</p>
          <p className="text-sm text-maroon-700 font-mono">{me.email}</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><KeyRound className="w-4 h-4 text-maroon-700" /> Ganti Password</h3>
          {msg && <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === "ok" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>{msg.text}</div>}
          <div><label className="text-xs font-semibold mb-1.5 block">Password Saat Ini</label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full px-3 py-2 rounded-lg border text-sm" data-testid="current-password" /></div>
          <div><label className="text-xs font-semibold mb-1.5 block">Password Baru (min 8 karakter)</label><input type="password" value={next} onChange={(e) => setNext(e.target.value)} required className="w-full px-3 py-2 rounded-lg border text-sm" data-testid="new-password" /></div>
          <div><label className="text-xs font-semibold mb-1.5 block">Konfirmasi Password Baru</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-3 py-2 rounded-lg border text-sm" data-testid="confirm-password" /></div>
          <button type="submit" disabled={saving} data-testid="change-password-btn" className="w-full bg-maroon-700 text-white py-3 rounded-lg font-bold hover:bg-maroon-800 flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} {saving ? "Menyimpan..." : "Ganti Password"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
