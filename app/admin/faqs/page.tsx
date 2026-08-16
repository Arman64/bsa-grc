"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Search, X, Save, HelpCircle } from "lucide-react";

interface Faq {
 id: number;
 question: string;
 answer: string;
 category: string;
 serviceSlug?: string;
 isActive: boolean;
}

const categories = ["Umum", "Kubah GRC", "Menara GRC", "Lisplang GRC", "Krawangan", "Mihrab ACP", "Harga & Biaya"];

export default function AdminFaqsPage() {
 const [items, setItems] = useState<Faq[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState<Faq | null>(null);
 const [form, setForm] = useState<Partial<Faq>>({ question: "", answer: "", category: "Umum", serviceSlug: "", isActive: true });

 const fetchData = async () => {
 setLoading(true);
 const res = await fetch("/api/admin/faqs");
 const json = await res.json();
 if (json.success) setItems(json.data);
 setLoading(false);
 };

 useEffect(() => { fetchData(); }, []);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const method = editing ? "PUT" : "POST";
 const payload = editing ? { ...form, id: editing.id } : form;
 const res = await fetch("/api/admin/faqs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
 const json = await res.json();
 if (json.success) {
  setShowModal(false);
  setEditing(null);
  setForm({ question: "", answer: "", category: "Umum", serviceSlug: "", isActive: true });
  fetchData();
 } else alert(json.message);
 };

 const handleEdit = (item: Faq) => { setEditing(item); setForm(item); setShowModal(true); };
 const handleDelete = async (id: number) => {
 if (!confirm("Hapus FAQ ini?")) return;
 const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
 const json = await res.json();
 if (json.success) fetchData();
 else alert(json.message);
 };

 const filtered = items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(search.toLowerCase()));

 return (
 <AdminLayout>
  <div className="max-w-6xl mx-auto space-y-6">
  <div className="flex justify-between items-start">
   <div>
   <h1 className="text-2xl font-bold">Kelola FAQ - Tanya Jawab</h1>
   <p className="text-sm text-muted-foreground mt-1">FAQ untuk homepage & landing page ads. Kategori bisa Umum atau per layanan (kubah-grc, menara, dll). Data.</p>
   </div>
   <button onClick={() => { setEditing(null); setForm({ question: "", answer: "", category: "Umum", serviceSlug: "", isActive: true }); setShowModal(true); }} className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
   <Plus className="w-4 h-4" /> Tambah FAQ
   </button>
  </div>

  <div className="bg-white rounded-2xl border shadow-soft p-4 flex justify-between">
   <div className="relative flex-1 max-w-md">
   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
   <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pertanyaan, jawaban..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" />
   </div>
   <span className="text-sm text-muted-foreground">Total: <b>{filtered.length}</b> FAQ</span>
  </div>

  {loading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />)}</div> : (
   <div className="space-y-3">
   {filtered.map((item) => (
    <div key={item.id} className="bg-white rounded-2xl border shadow-soft p-5 flex justify-between gap-4">
    <div className="flex-1">
     <div className="flex items-center gap-2 mb-2">
     <HelpCircle className="w-4 h-4 text-maroon-700" />
     <span className="text-xs bg-gold-50 border border-gold-200 px-2 py-1 rounded-full font-semibold">{item.category}</span>
     {item.serviceSlug && <span className="text-xs bg-maroon-50 border border-maroon-100 px-2 py-1 rounded-full">{item.serviceSlug}</span>}
     </div>
     <p className="font-bold text-sm">{item.question}</p>
     <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.answer}</p>
    </div>
    <div className="flex gap-1">
     <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50"><Edit3 className="w-4 h-4" /></button>
     <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
    </div>
    </div>
   ))}
   </div>
  )}

  {showModal && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
   <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
   <div className="relative bg-white rounded-2xl shadow-large w-full max-w-2xl">
    <div className="p-6 border-b flex justify-between items-center">
    <h3 className="font-bold text-lg">{editing ? "Edit" : "Tambah"} FAQ</h3>
    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
    </div>
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
    <input value={form.question || ""} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Pertanyaan - Contoh: Berapa harga kubah GRC per meter?" className="w-full px-4 py-3 rounded-xl border text-sm font-semibold" required />
    <textarea value={form.answer || ""} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} placeholder="Jawaban lengkap..." className="w-full px-4 py-3 rounded-xl border text-sm" required />
    <div className="grid grid-cols-2 gap-3">
     <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 rounded-xl border text-sm bg-white">
     {categories.map((c) => <option key={c} value={c}>{c}</option>)}
     </select>
     <input value={form.serviceSlug || ""} onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })} placeholder="serviceSlug (opsional) - kubah-grc" className="px-4 py-3 rounded-xl border text-sm" />
    </div>
    <div className="flex gap-3 pt-2">
     <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-3 rounded-xl">Batal</button>
     <button type="submit" className="flex-1 bg-maroon-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Simpan</button>
    </div>
    </form>
   </div>
   </div>
  )}
  </div>
 </AdminLayout>
 );
}
