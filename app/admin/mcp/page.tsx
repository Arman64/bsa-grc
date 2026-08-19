"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { KeyRound, Plus, Trash2, Copy, Check, Eye, EyeOff, Ban, RotateCcw, Loader2, ShieldCheck, Terminal } from "lucide-react";

const PERMS = [
  { id: "blog:read", label: "Baca Blog (GET /api/mcp/blog)" },
  { id: "blog:write", label: "Tulis / Publish Blog (POST /api/mcp/blog)" },
];

const EXPIRY_OPTIONS = [
  { label: "Tidak pernah", days: 0 },
  { label: "7 hari", days: 7 },
  { label: "30 hari", days: 30 },
  { label: "90 hari", days: 90 },
  { label: "1 tahun", days: 365 },
];

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1 text-xs bg-white border px-2 py-1 rounded-lg hover:bg-muted"
      data-testid="copy-token-btn"
    >
      {done ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />} {done ? "Tersalin" : "Salin"}
    </button>
  );
}

function TokenValue({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  const masked = value.slice(0, 11) + "••••••••••••" + value.slice(-4);
  return (
    <div className="flex items-center gap-2">
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">{show ? value : masked}</code>
      <button onClick={() => setShow(!show)} className="p-1 hover:bg-muted rounded" aria-label="toggle">
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <CopyBtn text={value} />
    </div>
  );
}

export default function McpTokensPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [justCreated, setJustCreated] = useState<any>(null);

  const [name, setName] = useState("");
  const [perms, setPerms] = useState<string[]>(["blog:read", "blog:write"]);
  const [expiryDays, setExpiryDays] = useState(0);

  const load = async () => {
    const j = await (await fetch("/api/admin/mcp-tokens")).json();
    if (j.success) setTokens(j.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const togglePerm = (id: string) => setPerms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setCreating(true); setJustCreated(null);
    const expiresAt = expiryDays > 0 ? new Date(Date.now() + expiryDays * 86400000).toISOString() : null;
    const j = await (await fetch("/api/admin/mcp-tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, permissions: perms, expiresAt }) })).json();
    if (j.success) { setJustCreated(j.data); setName(""); await load(); }
    else setMsg(j.message || "Gagal");
    setCreating(false);
  };

  const toggleRevoke = async (t: any) => {
    await fetch("/api/admin/mcp-tokens", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: t.id, revoked: t.status !== "revoked" ? true : false }) });
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("Hapus token ini? Aplikasi yang memakainya akan berhenti berfungsi.")) return;
    await fetch(`/api/admin/mcp-tokens?id=${id}`, { method: "DELETE" });
    load();
  };

  const badge = (s: string) => s === "active" ? "bg-green-50 text-green-700 border-green-200" : s === "expired" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200";
  const badgeLabel = (s: string) => s === "active" ? "Aktif" : s === "expired" ? "Kadaluarsa" : "Dicabut";

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><KeyRound className="w-6 h-6 text-maroon-700" /> Token MCP / API</h1>
          <p className="text-sm text-muted-foreground mt-1">Buat & kelola token akses untuk automasi (n8n, AI agent) ke endpoint MCP. Atur kadaluarsa & permission.</p>
        </div>

        {/* Docs */}
        <div className="bg-maroon-50 border border-maroon-100 rounded-xl p-4 text-sm">
          <p className="font-bold text-maroon-800 flex items-center gap-2"><Terminal className="w-4 h-4" /> Cara pakai</p>
          <p className="text-maroon-700/90 mt-1">Kirim request ke <code className="bg-white border px-1.5 py-0.5 rounded">/api/mcp/blog</code> dengan header <code className="bg-white border px-1.5 py-0.5 rounded">X-API-KEY: &lt;token&gt;</code>.</p>
          <code className="block bg-white border rounded-lg p-2 mt-2 text-[11px] font-mono overflow-x-auto">{`curl -X POST https://bsa-grc.vercel.app/api/mcp/blog -H "X-API-KEY: TOKEN_ANDA" -H "Content-Type: application/json" -d '{"title":"Judul","content":"## Isi"}'`}</code>
        </div>

        {/* Create form */}
        <form onSubmit={create} className="bg-white rounded-xl border shadow-soft p-6 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-maroon-700" /> Generate Token Baru</h3>
          {msg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{msg}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Nama Token</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="mis. n8n Automation" className="w-full px-3 py-2 rounded-lg border text-sm" data-testid="token-name-input" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Kadaluarsa</label>
              <select value={expiryDays} onChange={(e) => setExpiryDays(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border text-sm bg-white" data-testid="token-expiry-select">
                {EXPIRY_OPTIONS.map((o) => <option key={o.days} value={o.days}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block">Permission</label>
            <div className="space-y-2">
              {PERMS.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={perms.includes(p.id)} onChange={() => togglePerm(p.id)} className="rounded" data-testid={`perm-${p.id}`} />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={creating} data-testid="generate-token-btn" className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-maroon-800 disabled:opacity-50">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Generate Token
          </button>

          {justCreated && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-2">
              <p className="text-sm font-bold text-green-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Token dibuat — salin & simpan sekarang</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <code className="text-xs bg-white border px-2 py-1.5 rounded font-mono break-all">{justCreated.token}</code>
                <CopyBtn text={justCreated.token} />
              </div>
            </div>
          )}
        </form>

        {/* List */}
        <div className="bg-white rounded-xl border shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b font-bold text-sm">Daftar Token ({tokens.length})</div>
          {loading ? (
            <div className="p-8 flex justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : tokens.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Belum ada token. Generate token pertama Anda di atas.</p>
          ) : (
            <div className="divide-y">
              {tokens.map((t) => (
                <div key={t.id} className="p-4 lg:p-5 space-y-3" data-testid={`token-row-${t.id}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{t.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge(t.status)}`}>{badgeLabel(t.status)}</span>
                      {(t.permissions || []).map((p: string) => (
                        <span key={p} className="text-[10px] bg-gold-50 border border-gold-200 text-gold-700 px-2 py-0.5 rounded-full font-mono">{p}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleRevoke(t)} className="inline-flex items-center gap-1 text-xs border px-2.5 py-1.5 rounded-lg hover:bg-muted" data-testid={`toggle-revoke-${t.id}`}>
                        {t.status === "revoked" ? <><RotateCcw className="w-3.5 h-3.5" /> Aktifkan</> : <><Ban className="w-3.5 h-3.5" /> Cabut</>}
                      </button>
                      <button onClick={() => remove(t.id)} className="inline-flex items-center gap-1 text-xs text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50" data-testid={`delete-token-${t.id}`}>
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                  <TokenValue value={t.token} />
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
                    <span>Kadaluarsa: <b className="text-foreground">{fmt(t.expiresAt)}</b></span>
                    <span>Terakhir dipakai: <b className="text-foreground">{fmt(t.lastUsedAt)}</b></span>
                    <span>Dibuat: {fmt(t.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
