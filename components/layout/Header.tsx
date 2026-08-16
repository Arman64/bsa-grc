"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { useCompany } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";

interface NavChild {
 id: string;
 label: string;
 href: string;
}

interface NavItem {
 id: string;
 label: string;
 href: string;
 children?: NavChild[];
}

export default function Header() {
 const { company: dynamicCompany } = useCompany();
 const [isOpen, setIsOpen] = useState(false);
 const [isScrolled, setIsScrolled] = useState(false);
 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
 const [navItems, setNavItems] = useState<NavItem[]>([]);

 const company = {
 whatsapp: dynamicCompany.whatsapp,
 whatsappDisplay: dynamicCompany.whatsappDisplay,
 whatsappLink: dynamicCompany.whatsappLink,
 yearsExperience: dynamicCompany.yearsExperience,
 projectsCompleted: dynamicCompany.projectsCompleted,
 regency: dynamicCompany.regency,
 district: COMPANY_INFO.address.district,
 };

 useEffect(() => {
 const handleScroll = () => {
  setIsScrolled(window.scrollY > 20);
 };
 window.addEventListener("scroll", handleScroll);

 // Fetch services from for dynamic Layanan dropdown
 fetch("/api/services", { cache: "no-store" })
  .then((res) => res.json())
  .then((json) => {
  const services = json.success && json.data ? json.data : [];
  const serviceChildren: NavChild[] = services.map((s: any) => ({
   id: s.id,
   label: s.title,
   href: `/layanan/${s.slug}`,
  }));

  const baseNav: NavItem[] = [
   { id: "home", label: "Beranda", href: "/" },
   { id: "profil", label: "Profil", href: "/profil" },
   {
   id: "layanan",
   label: "Layanan",
   href: "/layanan",
   children: serviceChildren.length > 0 ? serviceChildren : [
    { id: "kubah-grc", label: "Kubah Masjid GRC", href: "/layanan/kubah-grc" },
    { id: "menara", label: "Menara Masjid GRC", href: "/layanan/menara" },
    { id: "lisplang", label: "Lisplang GRC", href: "/layanan/lisplang" },
    { id: "krawangan", label: "Krawangan & Ornamen GRC", href: "/layanan/krawangan" },
    { id: "mihrab-acp", label: "Mihrab ACP", href: "/layanan/mihrab-acp" },
   ],
   },
   { id: "portofolio", label: "Portofolio", href: "/portofolio" },
   { id: "blog", label: "Blog", href: "/blog" },
   { id: "kontak", label: "Kontak", href: "/kontak" },
  ];

  setNavItems(baseNav);
  })
  .catch(() => {
  // Fallback if API fails
  setNavItems([
   { id: "home", label: "Beranda", href: "/" },
   { id: "profil", label: "Profil", href: "/profil" },
   {
   id: "layanan",
   label: "Layanan",
   href: "/layanan",
   children: [
    { id: "kubah-grc", label: "Kubah Masjid GRC", href: "/layanan/kubah-grc" },
    { id: "menara", label: "Menara Masjid GRC", href: "/layanan/menara" },
    { id: "lisplang", label: "Lisplang GRC", href: "/layanan/lisplang" },
    { id: "krawangan", label: "Krawangan & Ornamen GRC", href: "/layanan/krawangan" },
    { id: "mihrab-acp", label: "Mihrab ACP", href: "/layanan/mihrab-acp" },
   ],
   },
   { id: "portofolio", label: "Portofolio", href: "/portofolio" },
   { id: "blog", label: "Blog", href: "/blog" },
   { id: "kontak", label: "Kontak", href: "/kontak" },
  ]);
  });

 return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
 <>
  <div id="global-topbar" className="hidden md:block bg-maroon-700 text-white text-sm">
  <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between py-2">
   <div className="flex items-center gap-6">
   <span className="flex items-center gap-2">
    <Phone className="w-4 h-4 text-gold-400" />
    {company.whatsappDisplay} | {company.district}, {company.regency}
   </span>
   </div>
   <div className="flex items-center gap-1 text-gold-200">
   <span>Pengalaman {company.yearsExperience}+ Tahun</span>
   <span className="mx-2">•</span>
   <span className="text-gold-400 font-semibold">{company.projectsCompleted}+ Proyek Selesai</span>
   </div>
  </div>
  </div>

  <header
  className={cn(
   "sticky top-0 z-50 w-full transition-all duration-300 border-b",
   isScrolled ? "bg-white/95 backdrop-blur-xl shadow-medium border-border" : "bg-white shadow-soft border-transparent"
  )}
  >
  <div className="container mx-auto px-4 lg:px-8">
   <div className="flex items-center justify-between h-16 lg:h-[72px]">
   <Link href="/" className="flex items-center gap-3 group">
    <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden bg-gradient-soft shadow-soft group-hover:shadow-medium transition-all">
    <Image
     src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png"
     alt="BSA GRC Logo"
     fill
     className="object-contain p-1"
     sizes="56px"
     priority
    />
    </div>
    <div className="flex flex-col">
    <span className="font-display font-bold text-lg lg:text-xl leading-none text-maroon-700">
     BSA <span className="text-gold-500">GRC</span>
    </span>
    <span className="text-[10px] lg:text-xs text-muted-foreground font-medium tracking-widest uppercase">Kubah & Menara Masjid</span>
    </div>
   </Link>

   <nav className="hidden lg:flex items-center gap-1">
    {navItems.map((item) => (
    <div key={item.id} className="relative group" onMouseEnter={() => item.children && setActiveDropdown(item.id)} onMouseLeave={() => setActiveDropdown(null)}>
     <Link href={item.href} className={cn("relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1", "text-foreground hover:text-maroon-600 hover:bg-maroon-50")}>
     {item.label}
     {item.children && <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === item.id && "rotate-180")} />}
     </Link>

     {item.children && activeDropdown === item.id && (
     <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-large border border-border p-2 animate-fade-in">
      <div className="islamic-border rounded-xl overflow-hidden">
      <div className="pt-3 grid gap-1">
       {item.children.map((child) => (
       <Link key={child.id} href={child.href} className="px-4 py-3 rounded-lg hover:bg-maroon-50 group/item transition-colors flex flex-col">
        <span className="font-semibold text-sm text-maroon-700 group-hover/item:text-maroon-800 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
        {child.label}
        </span>
       </Link>
       ))}
      </div>
      </div>
     </div>
     )}
    </div>
    ))}
   </nav>

   <div className="hidden lg:flex items-center gap-3">
    <Link href={company.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
    <Phone className="w-4 h-4" />
    Konsultasi Gratis
    </Link>
   </div>

   <button aria-label="Toggle Menu" onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
   </button>
   </div>
  </div>

  {isOpen && (
   <div className="lg:hidden border-t bg-white animate-slide-up max-h-[85vh] overflow-y-auto">
   <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
    {navItems.map((item) => (
    <div key={item.id} className="flex flex-col">
     <Link href={item.href} onClick={() => !item.children && setIsOpen(false)} className="px-4 py-3 rounded-xl font-medium hover:bg-maroon-50 hover:text-maroon-700 transition-colors flex justify-between items-center">
     {item.label}
     {item.children && <ChevronDown className="w-4 h-4" />}
     </Link>
     {item.children && (
     <div className="ml-4 pl-4 border-l-2 border-gold-200 flex flex-col gap-1 mt-1">
      {item.children.map((child) => (
      <Link key={child.id} href={child.href} onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-maroon-700 hover:bg-gold-50 transition-colors">
       {child.label}
      </Link>
      ))}
     </div>
     )}
    </div>
    ))}
    <div className="pt-4 mt-2 border-t">
    <Link href={company.whatsappLink} target="_blank" className="btn-primary w-full justify-center gap-2 text-base py-4">
     <Phone className="w-5 h-5" />
     Hubungi WhatsApp {company.whatsappDisplay}
    </Link>
    <p className="text-xs text-center text-muted-foreground mt-3 px-4">{COMPANY_INFO.address.full}</p>
    </div>
   </nav>
   </div>
  )}
  </header>
 </>
 );
}
