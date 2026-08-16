"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Upload, Search, X, Save, MapPin, Images, Star } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  images?: string[];
  diameter?: string;
  client?: string;
  description?: string;
  material?: string;
}

const categories = ["Kubah GRC", "Menara GRC", "Krawangan", "Mihrab ACP", "Lisplang GRC", "Lainnya"];

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [form, setForm] = useState<Partial<PortfolioItem>>({
    title: "",
    category: "Kubah GRC",
    location: "",
    year: new Date().getFullYear().toString(),
    image: "",
    images: [],
    diameter: "",
    client: "",
    description: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/portfolio");
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "portfolio");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.success) {
      setForm({ ...form, image: json.data.url });
    } else {
      alert(json.message);
    }
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);

    const newImages: string[] = [...(form.images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        newImages.push(json.data.url);
      }
    }

    setForm({ ...form, images: newImages });
    setUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(form.images || [])];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const setAsMain = (url: string) => {
    setForm({ ...form, image: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      alert("Judul dan gambar utama wajib!");
      return;
    }

    const method = editing ? "PUT" : "POST";
    const payload = editing ? { ...form, id: editing.id } : form;

    const res = await fetch("/api/admin/portfolio", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (json.success) {
      setShowModal(false);
      setEditing(null);
      setForm({ title: "", category: "Kubah GRC", location: "", year: new Date().getFullYear().toString(), image: "", images: [], diameter: "", client: "", description: "" });
      fetchData();
    } else {
      alert(json.message);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({ ...item, images: (item as any).images || [] });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus portofolio ini?")) return;
    const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) fetchData();
    else alert(json.message);
  };

  const filtered = items.filter((i) => `${i.title} ${i.category} ${i.location}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Images className="w-6 h-6 text-maroon-700" />
              Kelola Portofolio + Carousel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Upload gambar utama + galeri carousel (support lebih dari 5 gambar). Gambar otomatis AVIF 77% saving. Data Neon DB.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ title: "", category: "Kubah GRC", location: "", year: new Date().getFullYear().toString(), image: "", images: [], diameter: "", client: "", description: "" }); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Portofolio
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-soft p-4 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul, kategori, lokasi..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-maroon-200 focus:border-maroon-500 outline-none" />
          </div>
          <p className="text-sm text-muted-foreground flex items-center">
            Total: <span className="font-bold text-foreground ml-1">{filtered.length} proyek</span> • Carousel Ready
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border shadow-soft overflow-hidden group hover:shadow-large transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold border">{item.category}</span>
                  {(item.images?.length || 0) > 0 && (
                    <span className="absolute top-2 right-2 bg-maroon-700 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Images className="w-3 h-3" /> {(item.images?.length || 0) + 1} foto
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleEdit(item)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gold-50 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 leading-tight">{item.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" /> {item.location} • {item.year}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full border">{item.client || "Masjid"}</span>
                    <span className="text-xs font-medium text-gold-700">{item.diameter || "Ø 6m"} • {item.images?.length ? `${item.images.length + 1} foto` : "1 foto"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-[1.5rem] shadow-large w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-[1.5rem]">
                <h3 className="font-bold text-lg">{editing ? "Edit Portofolio + Carousel" : "Tambah Portofolio Baru + Carousel lebih dari 5"}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Gambar Utama * (Cover)</label>
                    <div className="border-2 border-dashed rounded-xl p-4 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                      {form.image ? (
                        <div className="relative">
                          <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded-xl mx-auto" />
                          <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
                          <p className="text-xs text-muted-foreground mt-2 break-all">{form.image}</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Gambar utama proyek</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleUpload} className="mt-3 text-sm" disabled={uploading} />
                      {uploading && <p className="text-xs text-maroon-700 mt-2">Mengupload...</p>}
                    </div>
                    <input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://... atau /images/portfolio/... (manual URL)" className="mt-3 w-full px-4 py-2.5 rounded-xl border text-sm" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                      <Images className="w-4 h-4" />
                      Galeri Carousel (Support lebih dari 5 Gambar) - Baru
                    </label>
                    <div className="border-2 border-dashed border-gold-200 rounded-xl p-4 bg-gold-50/30 min-h-[200px]">
                      {form.images && form.images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {form.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                                <button type="button" onClick={() => setAsMain(img)} className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gold-50" title="Jadikan utama">
                                  <Star className="w-3 h-3" />
                                </button>
                                <button type="button" onClick={() => removeGalleryImage(idx)} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">{idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-8">Belum ada galeri. Upload beberapa gambar untuk carousel (bisa lebih dari 5)</p>
                      )}

                      <div className="mt-3">
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="text-xs" disabled={uploadingGallery} />
                        {uploadingGallery && <p className="text-xs text-maroon-700 mt-1">Mengupload {form.images?.length || 0} gambar...</p>}
                        <p className="text-[11px] text-muted-foreground mt-2">Bisa pilih banyak file sekaligus. Support JPG, PNG, WebP → otomatis jadi AVIF. Carousel di detail akan tampil dengan next/prev + thumbnails scrollable + lightbox.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Judul Proyek *</label>
                  <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Contoh: Kubah Masjid GRC Model Bawang Gold" className="w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-maroon-200 focus:border-maroon-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Kategori *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm bg-white">
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Tahun</label>
                    <input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2023" className="w-full px-4 py-3 rounded-xl border text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Lokasi</label>
                    <input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Trenggalek, Jatim" className="w-full px-4 py-3 rounded-xl border text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Klien / Masjid</label>
                    <input value={form.client || ""} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Masjid Jami'" className="w-full px-4 py-3 rounded-xl border text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Diameter / Ukuran</label>
                    <input value={form.diameter || ""} onChange={(e) => setForm({ ...form, diameter: e.target.value })} placeholder="Ø 6m" className="w-full px-4 py-3 rounded-xl border text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Material</label>
                    <input value={(form as any).material || ""} onChange={(e) => setForm({ ...form, material: e.target.value } as any)} placeholder="GRC Premium" className="w-full px-4 py-3 rounded-xl border text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Deskripsi Detail</label>
                  <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Deskripsi singkat pengerjaan, model kubah, dll" className="w-full px-4 py-3 rounded-xl border text-sm resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">Batal</button>
                  <button type="submit" className="flex-1 bg-maroon-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-maroon-800 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editing ? "Update" : "Simpan"} Portofolio + Carousel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
