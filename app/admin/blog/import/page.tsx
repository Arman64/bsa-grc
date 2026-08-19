"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  UploadCloud, FileWarning, Loader2, CheckCircle2, XCircle, SkipForward, RefreshCw,
  Image as ImageIcon, ArrowLeft,
} from "lucide-react";

type ResultRow = { slug: string; title: string; status: "imported" | "updated" | "skipped" | "failed"; url?: string; reason?: string };
type Summary = { total: number; imported: number; updated: number; skipped: number; failed: number };

export default function BlogImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [downloadImages, setDownloadImages] = useState(true);
  const [defaultStatus, setDefaultStatus] = useState<"publish" | "draft" | "keep">("publish");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Pilih file export XML WordPress terlebih dahulu");
      return;
    }
    setLoading(true);
    setError("");
    setSummary(null);
    setResults([]);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("overwriteExisting", String(overwriteExisting));
    fd.append("downloadImages", String(downloadImages));
    fd.append("defaultStatus", defaultStatus);

    try {
      const res = await fetch("/api/admin/blog-import", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Import gagal");
      } else {
        setSummary(json.summary);
        setResults(json.results || []);
      }
    } catch (err) {
      setError("Gagal menghubungi server - coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const badgeFor = (status: ResultRow["status"]) => {
    if (status === "imported") return { icon: CheckCircle2, cls: "bg-green-50 text-green-700 border-green-200", label: "Baru" };
    if (status === "updated") return { icon: RefreshCw, cls: "bg-blue-50 text-blue-700 border-blue-200", label: "Diupdate" };
    if (status === "skipped") return { icon: SkipForward, cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Dilewati" };
    return { icon: XCircle, cls: "bg-red-50 text-red-700 border-red-200", label: "Gagal" };
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-maroon-700 mb-2" data-testid="back-to-blog-link">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Blog
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2"><UploadCloud className="w-6 h-6 text-maroon-700" /> Import Artikel dari WordPress (XML)</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload file export WordPress (Tools → Export → All content) untuk bulk-import artikel lama ke database baru dengan slug &amp; URL yang sama.</p>
        </div>

        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-sm flex gap-3">
          <FileWarning className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
          <p className="text-gold-800/90">
            Lakukan import ini <b>SEBELUM</b> domain bsagrc.co.id dialihkan ke website baru. Selama domain lama masih aktif, gambar-gambar artikel akan otomatis diunduh &amp; disimpan ke storage baru — setelah domain dialihkan, gambar di wp-content/uploads lama tidak bisa diakses lagi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-soft p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm" data-testid="import-error">{error}</div>}

          <div>
            <label className="text-xs font-semibold mb-1.5 block">File Export XML (WXR)</label>
            <input
              type="file"
              accept=".xml"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white"
              data-testid="wp-xml-file-input"
            />
            {file && <p className="text-xs text-muted-foreground mt-1">Terpilih: {file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-start gap-2.5 text-sm cursor-pointer border rounded-lg p-3 hover:bg-muted">
              <input type="checkbox" checked={downloadImages} onChange={(e) => setDownloadImages(e.target.checked)} className="mt-0.5 rounded" data-testid="download-images-checkbox" />
              <span>
                <span className="font-semibold flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Download &amp; simpan ulang gambar</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Disarankan ON sebelum domain lama mati.</span>
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-sm cursor-pointer border rounded-lg p-3 hover:bg-muted">
              <input type="checkbox" checked={overwriteExisting} onChange={(e) => setOverwriteExisting(e.target.checked)} className="mt-0.5 rounded" data-testid="overwrite-existing-checkbox" />
              <span>
                <span className="font-semibold">Timpa artikel dengan slug sama</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Kalau OFF, artikel dengan slug yang sudah ada akan dilewati.</span>
              </span>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Status artikel hasil import</label>
            <select
              value={defaultStatus}
              onChange={(e) => setDefaultStatus(e.target.value as any)}
              className="w-full md:w-72 px-3 py-2 rounded-lg border text-sm bg-white"
              data-testid="default-status-select"
            >
              <option value="publish">Langsung Published (rekomendasi untuk SEO)</option>
              <option value="draft">Draft — review manual dulu</option>
              <option value="keep">Ikuti status asli dari WordPress</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="start-import-btn"
            className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-maroon-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {loading ? "Memproses import..." : "Mulai Import"}
          </button>
          {loading && <p className="text-xs text-muted-foreground">Untuk file besar dengan banyak gambar, proses ini bisa memakan waktu beberapa menit. Jangan tutup halaman ini.</p>}
        </form>

        {summary && (
          <div className="bg-white rounded-xl border shadow-soft overflow-hidden" data-testid="import-summary">
            <div className="px-5 py-4 border-b grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div><p className="text-2xl font-bold">{summary.total}</p><p className="text-xs text-muted-foreground">Ditemukan</p></div>
              <div><p className="text-2xl font-bold text-green-600">{summary.imported}</p><p className="text-xs text-muted-foreground">Baru</p></div>
              <div><p className="text-2xl font-bold text-blue-600">{summary.updated}</p><p className="text-xs text-muted-foreground">Diupdate</p></div>
              <div><p className="text-2xl font-bold text-amber-600">{summary.skipped}</p><p className="text-xs text-muted-foreground">Dilewati</p></div>
              <div><p className="text-2xl font-bold text-red-600">{summary.failed}</p><p className="text-xs text-muted-foreground">Gagal</p></div>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {results.map((r, i) => {
                const b = badgeFor(r.status);
                return (
                  <div key={i} className="p-3.5 flex items-center justify-between gap-3 text-sm" data-testid={`import-row-${r.slug}`}>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.url || r.reason || r.slug}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${b.cls}`}>
                      <b.icon className="w-3 h-3" /> {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
