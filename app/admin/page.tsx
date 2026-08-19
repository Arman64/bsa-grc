import { getSession } from "@/lib/auth";
import { getPortfolioData, getServicesData, getSettingsData, getBlogData } from "@/lib/data";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Images, Briefcase, BookOpen, Building2, Layers, Palette, Menu as MenuIcon, Settings, MapPin, Phone, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [portfolio, services, settings, blogs] = await Promise.all([
    getPortfolioData().catch(() => []),
    getServicesData().catch(() => []),
    getSettingsData().catch(() => ({ company: {} } as any)),
    getBlogData().catch(() => []),
  ]);

  const stats = [
    { label: "Portofolio", value: portfolio.length, icon: Images, href: "/admin/portfolio" },
    { label: "Layanan Aktif", value: services.filter((s: any) => s.isActive).length, icon: Briefcase, href: "/admin/services" },
    { label: "Blog Artikel", value: blogs.length, icon: BookOpen, href: "/admin/blog" },
    { label: "Proyek Selesai", value: settings.company?.projectsCompleted || 0, icon: Building2, href: "/admin/settings" },
  ];

  const quick = [
    { label: "Edit Halaman", desc: "Teks & gambar tiap section", icon: Layers, href: "/admin/pages" },
    { label: "Logo & Tampilan", desc: "Logo, favicon, top bar, footer", icon: Palette, href: "/admin/appearance" },
    { label: "Menu Navigasi", desc: "Menu header & footer", icon: MenuIcon, href: "/admin/menus" },
    { label: "Pengaturan Umum", desc: "Kontak, maps, SEO", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Halo, <span className="text-maroon-700">{session.name || "Admin"}</span></h1>
            <p className="text-muted-foreground mt-1">Kelola seluruh isi website dari sini. Setiap perubahan langsung tayang.</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon-800 transition-colors">
            <Eye className="w-4 h-4" /> Lihat Website
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="rounded-xl border bg-white p-5 hover:shadow-medium hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-2 text-foreground">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center"><s.icon className="w-5 h-5" /></div>
              </div>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4">Aksi Cepat</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quick.map((q) => (
              <Link key={q.href} href={q.href} className="group rounded-xl border bg-white p-5 hover:border-maroon-200 hover:shadow-medium transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white flex items-center justify-center mb-3"><q.icon className="w-5 h-5" /></div>
                <p className="font-bold text-sm text-foreground flex items-center gap-1">{q.label}<ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></p>
                <p className="text-xs text-muted-foreground mt-1">{q.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-soft p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Images className="w-5 h-5 text-maroon-700" /> Portofolio Terbaru</h3>
            <div className="space-y-3">
              {portfolio.slice(0, 4).map((item: any) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border hover:bg-muted/50 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl bg-muted object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="w-3 h-3" /> {item.location} • {item.category}</p>
                  </div>
                  <span className="text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded-full border h-fit">{item.year}</span>
                </div>
              ))}
              {portfolio.length === 0 && <p className="text-sm text-muted-foreground">Belum ada portofolio.</p>}
            </div>
            <Link href="/admin/portfolio" className="mt-4 inline-flex text-sm font-semibold text-maroon-700 items-center gap-1">Kelola Portofolio <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <div className="bg-white rounded-xl border shadow-soft p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-gold-600" /> Info Kontak</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3"><Phone className="w-4 h-4 text-green-600 mt-0.5" /><div><p className="text-xs text-muted-foreground">WhatsApp</p><p className="font-semibold">{settings.company?.whatsappDisplay}</p></div></div>
              <div className="flex gap-3"><MapPin className="w-4 h-4 text-maroon-600 mt-0.5" /><div><p className="text-xs text-muted-foreground">Pabrik</p><p className="font-medium leading-snug">{settings.company?.address}</p></div></div>
            </div>
            <Link href="/admin/settings" className="mt-4 inline-flex text-sm font-semibold text-maroon-700 items-center gap-1">Edit Pengaturan <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
