"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Layers, Briefcase, Images, BookOpen, Star, HelpCircle,
  Image as ImageIcon, Palette, Menu as MenuIcon, Settings, Globe, UserCog,
  LogOut, ExternalLink, X, ChevronRight,
} from "lucide-react";

const MENU = [
  {
    group: "Utama",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Konten",
    items: [
      { label: "Halaman", href: "/admin/pages", icon: Layers },
      { label: "Layanan", href: "/admin/services", icon: Briefcase },
      { label: "Portofolio", href: "/admin/portfolio", icon: Images },
      { label: "Blog", href: "/admin/blog", icon: BookOpen },
      { label: "Testimoni", href: "/admin/testimonials", icon: Star },
      { label: "FAQ", href: "/admin/faqs", icon: HelpCircle },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    group: "Tampilan",
    items: [
      { label: "Logo & Tampilan", href: "/admin/appearance", icon: Palette },
      { label: "Menu Navigasi", href: "/admin/menus", icon: MenuIcon },
    ],
  },
  {
    group: "Sistem",
    items: [
      { label: "Pengaturan Umum", href: "/admin/settings", icon: Settings },
      { label: "SEO & Integrasi", href: "/admin/integrations", icon: Globe },
      { label: "Akun & Password", href: "/admin/account", icon: UserCog },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [me, setMe] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((j) => { if (j.success) setMe(j.user); }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-[#f3ede6]">
      {/* Admin Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-12 bg-maroon-950 text-white flex items-center justify-between px-3 lg:px-4 shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Menu">
            {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span className="w-7 h-7 rounded-lg bg-gold-400 text-maroon-900 flex items-center justify-center text-xs font-extrabold">BSA</span>
            <span className="hidden sm:inline">BSA <span className="text-gold-400">GRC</span></span>
          </Link>
          <Link href="/" target="_blank" className="ml-2 flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors" data-testid="admin-view-site">
            <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Lihat Situs</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-white/70">Halo, <b className="text-white">{me.name || "Admin"}</b></span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-red-500/30 px-2.5 py-1.5 rounded-lg transition-colors" data-testid="admin-logout">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </div>

      <div className="flex pt-12">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-64 bg-maroon-900 text-white flex flex-col transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <nav className="flex-1 p-3 space-y-5">
            {MENU.map((section) => (
              <div key={section.group}>
                <p className="text-[10px] text-gold-300/70 uppercase tracking-widest font-bold px-3 mb-2">{section.group}</p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        data-testid={`admin-nav-${item.href.replace(/\//g, "-")}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-gold-400 text-maroon-900 shadow" : "text-white/75 hover:text-white hover:bg-white/10"}`}
                      >
                        <item.icon className={`w-[18px] h-[18px] ${active ? "text-maroon-900" : "text-gold-400"}`} />
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight className="w-4 h-4" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 text-[11px] text-white/40">
            © {new Date().getFullYear()} BSA GRC Admin
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 top-12 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-w-0 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
