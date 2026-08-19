"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Search, Eye, X, Save, Upload, Calendar, Tag, LibraryBig } from "lucide-react";
import type { BlogPost } from "@/lib/data";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

const categories = ["Panduan Kubah", "Harga & Biaya", "Edukasi & Material", "Portofolio", "Tips Perawatan", "Artikel"];

export default function AdminBlogPage() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState<BlogPost | null>(null);
 const [uploading, setUploading] = useState(false);
 const [pickerOpen, setPickerOpen] = useState(false);
 const [form, setForm] = useState<Partial<BlogPost>>({
 title: "",
 excerpt: "",
 content: "",
 coverImage: "",
 category: "Panduan Kubah",
 tags: [],
 seoTitle: "",
 seoDescription: "",
 keywords: [],
 isPublished: true,
 });

 const fetchPosts = async () => {
 setLoading(true);
 const res = await fetch("/api/admin/blog");
 const json = await res.json();
 if (json.success) setPosts(json.data);
 setLoading(false);
 };

 useEffect(() => {
 fetchPosts();
 }, []);

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setUploading(true);
 const fd = new FormData();
 fd.append("file", file);
 fd.append("folder", "blog");
 const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
 const json = await res.json();
 if (json.success) setForm({ ...form, coverImage: json.data.url });
 else alert(json.message);
 setUploading(false);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.title || !form.content) {
  alert("Judul & konten wajib");
  return;
 }

 const method = editing ? "PUT" : "POST";
 const payload = editing ? { ...form, id: editing.id } : form;

 const res = await fetch("/api/admin/blog", {
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
 });

 const json = await res.json();
 if (json.success) {
  setShowModal(false);
  setEditing(null);
  setForm({ title: "", excerpt: "", content: "", coverImage: "", category: "Panduan Kubah", tags: [], seoTitle: "", seoDescription: "", keywords: [], isPublished: true });
  fetchPosts();
 } else alert(json.message);
 };

 const handleEdit = (post: BlogPost) => {
 setEditing(post);
 setForm(post);
 setShowModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm("Yakin hapus artikel ini?")) return;
 const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
 const json = await res.json();
 if (json.success) fetchPosts();
 else alert(json.message);
 };

 const filtered = posts.filter((p) => `${p.title} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()));

 return (
 <AdminLayout>
  <div className="max-w-6xl mx-auto space-y-6">
  <div className="flex flex-col sm:flex-row justify-between gap-4">
   <div>
   <h1 className="text-2xl font-bold">Kelola Blog & Artikel SEO</h1>
   <p className="text-sm text-muted-foreground mt-1">Tulis artikel SEO friendly untuk ranking kata kunci kontraktor kubah masjid. Support Markdown, auto SEO meta, schema BlogPosting. Bisa automasi via MCP API.</p>
   </div>
   <button onClick={() => { setEditing(null); setForm({ title: "", excerpt: "", content: "", coverImage: "", category: "Panduan Kubah", tags: [], seoTitle: "", seoDescription: "", keywords: [], isPublished: true }); setShowModal(true); }} className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon-800">
   <Plus className="w-4 h-4" /> Tulis Artikel Baru
   </button>
  </div>

  {/* MCP Info */}
  <div className="bg-gradient-to-r from-gold-50 to-maroon-50 border border-gold-200 rounded-2xl p-5 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
   <div>
   <p className="font-bold text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-gold-700" /> Automasi MCP / N8N Ready</p>
   <p className="text-xs text-muted-foreground mt-1">POST ke <code className="bg-white border px-1.5 py-0.5 rounded">/api/mcp/blog</code> dengan header <code className="bg-white border px-1">X-API-KEY</code>. Buat & kelola token (kadaluarsa + permission) di menu Sistem.</p>
   </div>
   <a href="/admin/mcp" className="text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-muted whitespace-nowrap">Kelola Token</a>
  </div>

  <div className="bg-white rounded-2xl border shadow-soft p-4 flex flex-col sm:flex-row gap-3 justify-between">
   <div className="relative flex-1 max-w-md">
   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
   <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul, kategori, tag..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-maroon-200 outline-none" />
   </div>
   <p className="text-sm text-muted-foreground">Total: <span className="font-bold text-foreground">{filtered.length}</span> artikel • {filtered.filter((p) => p.isPublished).length} published</p>
  </div>

  {loading ? (
   <div className="grid md:grid-cols-2 gap-4">
   {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
   ))}
   </div>
  ) : (
   <div className="grid md:grid-cols-2 gap-6">
   {filtered.map((post) => (
    <div key={post.id} className="bg-white rounded-2xl border shadow-soft overflow-hidden group hover:shadow-large transition-all">
    <div className="relative h-40 overflow-hidden">
     <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
     <span className="absolute top-2 left-2 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold border">{post.category}</span>
     <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold ${post.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>{post.isPublished ? "Published" : "Draft"}</span>
     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
     <button onClick={() => handleEdit(post)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center"><Edit3 className="w-4 h-4" /></button>
     <button onClick={() => handleDelete(post.id)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-red-600"><Trash2 className="w-4 h-4" /></button>
     <a href={`/${post.slug}`} target="_blank" className="w-9 h-9 bg-white rounded-full flex items-center justify-center"><Eye className="w-4 h-4" /></a>
     </div>
    </div>
    <div className="p-4">
     <h3 className="font-bold text-sm line-clamp-2 leading-tight">{post.title}</h3>
     <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>
     <div className="flex items-center justify-between mt-3">
     <span className="text-xs flex items-center gap-1 text-muted-foreground"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString("id-ID")}</span>
     <span className="text-xs bg-muted border px-2 py-1 rounded-full">{post.readingTime || 5} menit</span>
     </div>
    </div>
    </div>
   ))}
   </div>
  )}

  {/* Modal */}
  {showModal && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
   <div className="relative bg-white rounded-[1.5rem] shadow-large w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
    <h3 className="font-bold text-lg">{editing ? "Edit Artikel" : "Tulis Artikel Baru - SEO Friendly"}</h3>
    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-6">
    <div className="grid lg:grid-cols-2 gap-6">
     <div className="space-y-4">
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Cover Image (Upload) *</label>
      <div className="border-2 border-dashed rounded-xl p-3 text-center bg-muted/20">
      {form.coverImage && <img src={form.coverImage} alt="Preview" className="w-full h-32 object-cover rounded-xl mb-2" />}
      <div className="flex items-center gap-2 justify-center flex-wrap">
      <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
      <button type="button" onClick={() => setPickerOpen(true)} data-testid="blog-gallery-picker-btn" className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 px-2.5 py-1 rounded-lg text-xs hover:bg-gold-100">
       <LibraryBig className="w-3.5 h-3.5" /> Galeri
      </button>
      </div>
      {uploading && <p className="text-xs text-maroon-700 mt-1">Uploading...</p>}
      <input value={form.coverImage || ""} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="URL manual" className="mt-2 w-full px-3 py-2 rounded-xl border text-xs" />
      </div>
     </div>

     <div>
      <label className="text-sm font-semibold mb-1.5 block">Judul Artikel * (SEO)</label>
      <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Contoh: Cara Memilih Kubah Masjid Terbaik 2026" className="w-full px-4 py-3 rounded-xl border text-sm font-semibold" />
      <p className="text-[11px] text-muted-foreground mt-1">Slug auto: {form.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "auto-generate"}</p>
     </div>

     <div>
      <label className="text-sm font-semibold mb-1.5 block">Excerpt (Ringkasan 160 karakter)</label>
      <textarea value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} placeholder="Ringkasan untuk list blog & meta description" className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none" />
     </div>

     <div className="grid grid-cols-2 gap-3">
      <div>
      <label className="text-sm font-semibold mb-1.5 block">Kategori</label>
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white">
       {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      </div>
      <div>
      <label className="text-sm font-semibold mb-1.5 block">Status</label>
      <select value={form.isPublished ? "published" : "draft"} onChange={(e) => setForm({ ...form, isPublished: e.target.value === "published" })} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white">
       <option value="published">Published - Live</option>
       <option value="draft">Draft - Private</option>
      </select>
      </div>
     </div>

     <div>
      <label className="text-sm font-semibold mb-1.5 block">Tags (pisah koma)</label>
      <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags || ""} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="kubah masjid, harga kubah GRC, kontraktor" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
     </div>
     </div>

     <div className="space-y-4">
     <div>
      <label className="text-sm font-semibold mb-1.5 block">Konten Artikel * (Markdown Support)</label>
      <textarea value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={18} placeholder="Tulis artikel dengan format Markdown: ## Heading, **bold**, list, table, dll. Support SEO friendly..." className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono resize-none" />
      <p className="text-[11px] text-muted-foreground mt-1">Support Markdown: ## H2, ### H3, **bold**, | Table |, - list, 1. numbered</p>
     </div>
     </div>
    </div>

    {/* SEO Fields */}
    <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 space-y-4">
     <h4 className="font-bold text-sm text-gold-800">SEO Advanced (Otomatis jika kosong)</h4>
     <div>
     <label className="text-xs font-semibold mb-1 block">SEO Title (60 karakter ideal)</label>
     <input value={form.seoTitle || ""} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Auto: Judul | BSA GRC" className="w-full px-3 py-2 rounded-xl border text-xs" />
     </div>
     <div>
     <label className="text-xs font-semibold mb-1 block">SEO Description (160 karakter)</label>
     <textarea value={form.seoDescription || ""} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} placeholder="Auto: excerpt" className="w-full px-3 py-2 rounded-xl border text-xs resize-none" />
     </div>
     <div>
     <label className="text-xs font-semibold mb-1 block">Keywords (pisah koma) untuk SEO</label>
     <input value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords || ""} onChange={(e) => setForm({ ...form, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} placeholder="model kubah masjid, harga kubah GRC" className="w-full px-3 py-2 rounded-xl border text-xs" />
     </div>
    </div>

    <div className="flex gap-3 pt-2">
     <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-3 rounded-xl font-semibold">Batal</button>
     <button type="submit" className="flex-1 bg-maroon-700 text-white py-3 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2">
     <Save className="w-4 h-4" /> {editing ? "Update" : "Publish"} Artikel
     </button>
    </div>
    </form>
   </div>
   </div>
  )}
  </div>

  <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => setForm({ ...form, coverImage: url })} initialFolder="blog" />
 </AdminLayout>
 );
}
