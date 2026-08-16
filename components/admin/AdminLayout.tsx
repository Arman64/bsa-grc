"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Images, Briefcase, Settings, LogOut, Menu, X, Home, FileText, Building2, BookOpen, Star, HelpCircle, Layers, Image as ImageIcon } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Halaman", href: "/admin/pages", icon: Layers, badge: "Edit Teks & Gambar" },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon, badge: "Kelola Gambar" },
  { label: "Portofolio", href: "/admin/portfolio", icon: Images, badge: "Gambar" },
  { label: "Layanan", href: "/admin/services", icon: Briefcase, badge: "5 Layanan" },
  { label: "Blog Artikel", href: "/admin/blog", icon: BookOpen, badge: "SEO + MCP" },
  { label: "Testimoni", href: "/admin/testimonials", icon: Star, badge: "Sosial Proof" },
  { label: "FAQ", href: "/admin/faqs", icon: HelpCircle, badge: "Tanya Jawab" },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings, badge: "Teks & Kontak" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const router = useRouter();
 const [sidebarOpen, setSidebarOpen] = useState(false);

 const handleLogout = async () => {
 await fetch("/api/admin/logout", { method: "POST" });
 router.push("/admin/login");
 router.refresh();
 };

 return (
 <div className="min-h-screen bg-muted/40 flex">
  {/* Sidebar - Desktop */}
  <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-maroon-950 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
  <div className="p-6 border-b border-white/10">
   <Link href="/admin" className="flex items-center gap-3">
   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
    <Image src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" alt="BSA" width={36} height={36} className="object-contain" />
   </div>
   <div>
    <p className="font-bold leading-none">BSA <span className="text-gold-400">GRC</span></p>
    <p className="text-[11px] text-white/50 tracking-widest uppercase mt-1">Admin Panel</p>
   </div>
   </Link>
  </div>

  <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
   <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold px-3 mb-3 mt-2">Menu Utama</p>
   {menuItems.map((item) => {
   const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
   return (
    <Link
    key={item.href}
    href={item.href}
    onClick={() => setSidebarOpen(false)}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
     isActive ? "bg-white text-maroon-900 shadow-soft" : "text-white/70 hover:text-white hover:bg-white/10"
    }`}
    >
    <item.icon className={`w-5 h-5 ${isActive ? "text-maroon-700" : "text-gold-400"}`} />
    <span className="flex-1">{item.label}</span>
    {item.badge && (
     <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-maroon-100 text-maroon-700" : "bg-white/10 text-white/60"}`}>
     {item.badge}
     </span>
    )}
    </Link>
   );
   })}

   <div className="pt-6 mt-6 border-t border-white/10 space-y-1">
   <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold px-3 mb-3">Website</p>
   <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
    <Home className="w-5 h-5" /> Lihat Website
   </Link>
   <Link href="/portofolio" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
    <FileText className="w-5 h-5" /> Portofolio Publik
   </Link>
   </div>
  </nav>

  <div className="p-4 border-t border-white/10">
   <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 mb-3">
   <div className="w-9 h-9 rounded-full bg-gold-400 text-maroon-900 flex items-center justify-center font-bold text-sm">A</div>
   <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold truncate">Admin BSA GRC</p>
    <p className="text-xs text-white/50 truncate">admin@bsagrc.co.id</p>
   </div>
   </div>
   <button
   onClick={handleLogout}
   className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-red-500/20 transition-colors"
   >
   <LogOut className="w-5 h-5" /> Keluar
   </button>
   <p className="text-[11px] text-white/30 text-center mt-4">© {new Date().getFullYear()} BSA GRC • {COMPANY_INFO.address.regency}</p>
  </div>
  </aside>

  {/* Overlay Mobile */}
  {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

  {/* Main */}
  <div className="flex-1 flex flex-col min-h-screen">
  {/* Topbar Mobile */}
  <header className="lg:hidden sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center justify-between">
   <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl bg-muted">
   {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
   </button>
   <div className="flex items-center gap-2 font-bold">
   BSA <span className="text-gold-600">GRC</span> Admin
   </div>
   <div className="w-9" />
  </header>

  <main className="flex-1 p-4 lg:p-8">{children}</main>
  </div>
 </div>
 );
}
