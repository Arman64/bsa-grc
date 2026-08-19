/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Star, Search, X, Save, LibraryBig } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface Testimonial {
 id: number;
 name: string;
 location: string;
 role: string;
 text: string;
 result?: string;
 photo?: string;
 rating: number;
 category: string;
 isActive: boolean;
}

export default function AdminTestimonialsPage() {
 const [items, setItems] = useState<Testimonial[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState<Testimonial | null>(null);
 const [form, setForm] = useState<Partial<Testimonial>>({ name: "", location: "", role: "Panitia Masjid", text: "", result: "", photo: "", rating: 5, category: "Kubah GRC", isActive: true });
 const [pickerOpen, setPickerOpen] = useState(false);

 const fetchData = async () => {
 setLoading(true);
 const res = await fetch("/api/admin/testimonials");
 const json = await res.json();
 if (json.success) setItems(json.data);
 setLoading(false);
 };

 useEffect(() => { fetchData(); }, []);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const method = editing ? "PUT" : "POST";
 const payload = editing ? { ...form, id: editing.id } : form;
 const res = await fetch("/api/admin/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
 const json = await res.json();
 if (json.success) {
  setShowModal(false);
  setEditing(null);
  setForm({ name: "", location: "", role: "Panitia Masjid", text: "", result: "", photo: "", rating: 5, category: "Kubah GRC", isActive: true });
  fetchData();
 } else alert(json.message);
 };

 const handleEdit = (item: Testimonial) => { setEditing(item); setForm(item); setShowModal(true); };
 const handleDelete = async (id: number) => {
 if (!confirm("Hapus testimoni ini?")) return;
 const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
 const json = await res.json();
 if (json.success) fetchData();
 else alert(json.message);
 };

 const filtered = items.filter((i) => `${i.name} ${i.location} ${i.text}`.toLowerCase().includes(search.toLowerCase()));

 return (
 <AdminLayout>
  <div className="max-w-6xl mx-auto space-y-6">
  <div className="flex justify-between items-start">
   <div>
   <h1 className="text-2xl font-bold">Kelola Testimoni - Social Proof</h1>
   <p className="text-sm text-muted-foreground mt-1">Testimoni spesifik dengan foto & hasil - tampil di landing page & homepage. Data.</p>
   </div>
   <button onClick={() => { setEditing(null); setForm({ name: "", location: "", role: "Panitia Masjid", text: "", result: "", photo: "", rating: 5, category: "Kubah GRC", isActive: true }); setShowModal(true); }} className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
   <Plus className="w-4 h-4" /> Tambah Testimoni
   </button>
  </div>

  <div className="bg-white rounded-2xl border shadow-soft p-4 flex justify-between">
   <div className="relative flex-1 max-w-md">
   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
   <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, lokasi, testimoni..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" />
   </div>
   <span className="text-sm text-muted-foreground">Total: <b>{filtered.length}</b> testimoni</span>
  </div>

  {loading ? <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}</div> : (
   <div className="grid md:grid-cols-2 gap-6">
   {filtered.map((item) => (
    <div key={item.id} className="bg-white rounded-2xl border shadow-soft p-5">
    <div className="flex gap-3">
     <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
     {item.photo ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-maroon-100 flex items-center justify-center font-bold">{item.name[0]}</div>}
     </div>
     <div className="flex-1">
     <p className="font-bold text-sm">{item.name}</p>
     <p className="text-xs text-muted-foreground">{item.role} • {item.location}</p>
     <div className="flex gap-0.5 mt-1">
      {Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
     </div>
     </div>
     <div className="flex gap-1">
     <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-maroon-50"><Edit3 className="w-4 h-4" /></button>
     <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
     </div>
    </div>
    <p className="text-sm mt-3 italic">"{item.text}"</p>
    <p className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-full mt-3 inline-flex">Hasil: {item.result}</p>
    </div>
   ))}
   </div>
  )}

  {showModal && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
   <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
   <div className="relative bg-white rounded-2xl shadow-large w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    <div className="p-6 border-b flex justify-between items-center">
    <h3 className="font-bold text-lg">{editing ? "Edit" : "Tambah"} Testimoni</h3>
    <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
    </div>
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
    <div className="grid grid-cols-2 gap-3">
     <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama - Contoh: H. Slamet" className="px-4 py-2.5 rounded-xl border text-sm" required />
     <input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lokasi - Masjid Jami' Trenggalek" className="px-4 py-2.5 rounded-xl border text-sm" required />
    </div>
    <div className="grid grid-cols-2 gap-3">
     <input value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role - Ketua Panitia" className="px-4 py-2.5 rounded-xl border text-sm" />
     <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategori - Kubah GRC" className="px-4 py-2.5 rounded-xl border text-sm" />
    </div>
    <textarea value={form.text || ""} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Isi testimoni spesifik dengan hasil..." className="w-full px-4 py-2.5 rounded-xl border text-sm" required />
    <input value={form.result || ""} onChange={(e) => setForm({ ...form, result: e.target.value })} placeholder="Hasil - Contoh: Anti bocor 3 tahun, jamaah +40%" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
    <div className="flex items-center gap-2">
     {form.photo && <img src={form.photo} alt="preview" className="w-10 h-10 rounded-full object-cover border" />}
     <input value={form.photo || ""} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="URL Foto - https://..." className="flex-1 px-4 py-2.5 rounded-xl border text-sm" />
     <button type="button" onClick={() => setPickerOpen(true)} data-testid="testimonial-photo-gallery-btn" className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 px-3 py-2.5 rounded-xl text-xs hover:bg-gold-100 whitespace-nowrap">
      <LibraryBig className="w-3.5 h-3.5" /> Galeri
     </button>
    </div>
    <div className="flex gap-2">
     <label className="text-sm">Rating:</label>
     <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="border rounded-xl px-3 py-1 text-sm">
     {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Bintang</option>)}
     </select>
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

  <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => setForm({ ...form, photo: url })} />
 </AdminLayout>
 );
}
