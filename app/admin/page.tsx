import { getSession } from "@/lib/auth";
import { getPortfolioData, getServicesData, getSettingsData, getBlogData } from "@/lib/data";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Images, Briefcase, Settings, Eye, TrendingUp, MapPin, Building2, Phone, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
 const session = await getSession();
 if (!session) redirect("/admin/login");

 const [portfolio, services, settings, blogs] = await Promise.all([
 getPortfolioData(),
 getServicesData(),
 getSettingsData(),
 getBlogData(),
 ]);

 const stats = [
 { label: "Total Portofolio", value: portfolio.length, icon: Images, color: "bg-blue-50 text-blue-700 border-blue-100", href: "/admin/portfolio" },
 { label: "Layanan Aktif", value: services.filter((s) => s.isActive).length, icon: Briefcase, color: "bg-gold-50 text-gold-700 border-gold-100", href: "/admin/services" },
 { label: "Blog Artikel", value: blogs.length, icon: BookOpen, color: "bg-purple-50 text-purple-700 border-purple-100", href: "/admin/blog" },
 { label: "Proyek Selesai", value: settings.company.projectsCompleted, icon: Building2, color: "bg-green-50 text-green-700 border-green-100", href: "/admin/portfolio" },
 ];

 return (
 <AdminLayout>
  <div className="max-w-6xl mx-auto space-y-8">
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
   <div>
   <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
    Selamat Datang, <span className="text-maroon-700">Admin BSA GRC</span> 👋
   </h1>
   <p className="text-muted-foreground mt-2">Kelola gambar, teks, dan portofolio pekerjaan dengan mudah. Semua perubahan langsung tampil di website. {process.env.DATABASE_URL ? "Database Aktif ✅" : "Mode File JSON"}</p>
   </div>
   <Link href="/" target="_blank" className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon-800 transition-colors">
   <Eye className="w-4 h-4" /> Lihat Website
   </Link>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
   {stats.map((stat) => (
   <Link key={stat.label} href={stat.href} className={`rounded-2xl border-2 p-5 hover:shadow-medium hover:-translate-y-0.5 transition-all ${stat.color} bg-white`}>
    <div className="flex items-start justify-between">
    <div>
     <p className="text-xs uppercase tracking-wide font-semibold opacity-70">{stat.label}</p>
     <p className="text-2xl font-bold mt-2">{stat.value}</p>
    </div>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
     <stat.icon className="w-5 h-5" />
    </div>
    </div>
   </Link>
   ))}
  </div>

  <div className="grid lg:grid-cols-3 gap-6">
   <div className="lg:col-span-2 space-y-6">
   <div className="bg-white rounded-2xl border shadow-soft p-6">
    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
    <Images className="w-5 h-5 text-maroon-700" />
    Portofolio Terbaru
    </h3>
    <div className="space-y-3">
    {portfolio.slice(0, 4).map((item) => (
     <div key={item.id} className="flex gap-4 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
     <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
     </div>
     <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate">{item.title}</p>
      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
      <MapPin className="w-3 h-3" /> {item.location} • {item.category}
      </p>
     </div>
     <span className="text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded-full border h-fit">{item.year}</span>
     </div>
    ))}
    </div>
    <Link href="/admin/portfolio" className="mt-4 inline-flex text-sm font-semibold text-maroon-700 hover:gap-2 gap-1 items-center transition-all">
    Kelola Semua Portofolio →
    </Link>
   </div>

   <div className="bg-white rounded-2xl border shadow-soft p-6">
    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-purple-700" />
    Blog Artikel Terbaru (SEO)
    </h3>
    <div className="space-y-3">
    {blogs.slice(0, 3).map((post) => (
     <div key={post.id} className="flex gap-4 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
     <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
     </div>
     <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate">{post.title}</p>
      <p className="text-xs text-muted-foreground mt-1">{post.category} • {post.readingTime} menit • {post.isPublished ? "Published" : "Draft"}</p>
     </div>
     </div>
    ))}
    </div>
    <Link href="/admin/blog" className="mt-4 inline-flex text-sm font-semibold text-maroon-700 gap-1 items-center">
    Kelola Blog & Automasi MCP →
    </Link>
   </div>
   </div>

   <div className="space-y-6">
   <div className="bg-gradient-to-br from-maroon-700 to-maroon-900 text-white rounded-2xl p-6 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
    <div className="relative">
    <h3 className="font-bold mb-2">Cara Penggunaan</h3>
    <ol className="text-sm text-white/80 space-y-2 list-decimal pl-4">
     <li>Login dengan akun admin</li>
     <li>Pilih menu Portofolio/Layanan/Blog/Pengaturan</li>
     <li>Upload gambar, edit teks, simpan</li>
     <li>Perubahan langsung live di website</li>
    </ol>
    <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/10">
     <p className="text-xs font-semibold text-gold-300">Database:</p>
     <p className="text-xs text-white/70 mt-1">{process.env.DATABASE_URL ? "Database aktif - data persist ✅" : "Mode file JSON"}</p>
    </div>
    </div>
   </div>

   <div className="bg-white rounded-2xl border shadow-soft p-6">
    <h3 className="font-bold mb-4 flex items-center gap-2">
    <Settings className="w-5 h-5 text-gold-600" />
    Info Kontak Saat Ini
    </h3>
    <div className="space-y-3 text-sm">
    <div className="flex gap-3">
     <Phone className="w-4 h-4 text-green-600 mt-0.5" />
     <div>
     <p className="text-xs text-muted-foreground">WhatsApp</p>
     <p className="font-semibold">{settings.company.whatsappDisplay}</p>
     </div>
    </div>
    <div className="flex gap-3">
     <MapPin className="w-4 h-4 text-maroon-600 mt-0.5" />
     <div>
     <p className="text-xs text-muted-foreground">Pabrik</p>
     <p className="font-medium leading-snug">{settings.company.address}</p>
     </div>
    </div>
    </div>
    <Link href="/admin/settings" className="mt-4 inline-flex text-sm font-semibold text-maroon-700">
    Edit Pengaturan →
    </Link>
   </div>
   </div>
  </div>
  </div>
 </AdminLayout>
 );
}
