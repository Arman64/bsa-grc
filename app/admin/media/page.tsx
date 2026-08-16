"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Upload, Trash2, Copy, Image as ImageIcon, Folder, X } from "lucide-react";

interface MediaItem {
  id: number;
  url: string;
  fileName: string;
  originalName?: string;
  size: number;
  type: string;
  folder: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folderFilter === "all" ? "general" : folderFilter);
      fd.append("alt", file.name);
      await fetch("/api/admin/upload", { method: "POST", body: fd });
    }
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus gambar ini dari library? File fisik tetap ada di public/images")) return;
    const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchMedia();
    else alert(json.message);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(`URL disalin: ${url}`);
  };

  const filtered = items.filter((item) => {
    const matchSearch = `${item.fileName} ${item.alt} ${item.folder}`.toLowerCase().includes(search.toLowerCase());
    const matchFolder = folderFilter === "all" || item.folder === folderFilter;
    return matchSearch && matchFolder;
  });

  const folders = ["all", ...Array.from(new Set(items.map((i) => i.folder)))];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-maroon-700" />
              Media Library - Kelola Gambar (WordPress Style)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Upload, kelola, hapus, copy URL gambar. Semua otomatis AVIF 77% saving. Data Neon DB.</p>
          </div>
          <label className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 cursor-pointer hover:bg-maroon-800">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Gambar"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
          </label>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragOver ? "border-maroon-500 bg-maroon-50" : "border-gold-200 bg-white"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        >
          <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-semibold">Drag & Drop gambar di sini atau klik Upload</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, AVIF max 5MB - Otomatis convert ke AVIF 77% saving</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-soft p-4 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama file, alt, folder..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {folders.map((f) => (
                <button key={f} onClick={() => setFolderFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap ${folderFilter === f ? "bg-maroon-700 text-white border-maroon-700" : "bg-white hover:bg-muted"}`}>
                  <Folder className="w-3 h-3 inline mr-1" />
                  {f === "all" ? "Semua" : f} ({f === "all" ? items.length : items.filter((i) => i.folder === f).length})
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-muted-foreground self-center">Total: <b>{filtered.length}</b> file • {formatSize(filtered.reduce((acc, cur) => acc + cur.size, 0))}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold">Belum ada gambar di folder {folderFilter}</p>
            <p className="text-sm text-muted-foreground mt-1">Upload gambar baru untuk mulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl border shadow-soft overflow-hidden hover:shadow-large hover:-translate-y-1 transition-all">
                <div className="relative h-32 bg-muted overflow-hidden">
                  <img src={item.url} alt={item.alt || item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleCopy(item.url)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gold-50">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold border">{item.folder}</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-xs truncate" title={item.fileName}>{item.fileName}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{formatSize(item.size)} • {item.type.split("/")[1]?.toUpperCase()}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">{item.alt || "No alt"}</p>
                  <div className="mt-2 flex gap-1">
                    <button onClick={() => handleCopy(item.url)} className="flex-1 text-[11px] bg-muted border py-1 rounded-full hover:bg-maroon-50 hover:text-maroon-700">Copy URL</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
