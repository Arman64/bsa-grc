"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { COMPANY_INFO } from "@/lib/constants";

interface CompanyInfo {
 whatsapp: string;
 whatsappDisplay: string;
 whatsappLink: string;
 phone: string;
 phoneDisplay: string;
 phoneLink: string;
 name: string;
 email: string;
 address: string;
 yearsExperience: number;
 projectsCompleted: number;
 regency: string;
}

interface SettingsContextType {
 company: CompanyInfo;
 loading: boolean;
}

const defaultCompany: CompanyInfo = {
 whatsapp: COMPANY_INFO.contact.whatsapp,
 whatsappDisplay: COMPANY_INFO.contact.whatsappDisplay,
 whatsappLink: COMPANY_INFO.contact.whatsappLink,
 phone: COMPANY_INFO.contact.phone,
 phoneDisplay: COMPANY_INFO.contact.whatsappDisplay,
 phoneLink: `tel:${COMPANY_INFO.contact.phone}`,
 name: COMPANY_INFO.name,
 email: COMPANY_INFO.contact.email,
 address: COMPANY_INFO.address.full,
 yearsExperience: COMPANY_INFO.yearsExperience,
 projectsCompleted: COMPANY_INFO.projectsCompleted,
 regency: COMPANY_INFO.address.regency,
};

const SettingsContext = createContext<SettingsContextType>({
 company: defaultCompany,
 loading: true,
});

export function useCompany() {
 return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
 const [company, setCompany] = useState<CompanyInfo>(defaultCompany);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 // Fetch once, cache in sessionStorage to avoid repeated fetches on navigation
 const cached = sessionStorage.getItem("bsa_company_settings");
 const cachedTime = sessionStorage.getItem("bsa_company_settings_time");
 const now = Date.now();

 if (cached && cachedTime && now - Number(cachedTime) < 60000) {
  try {
  setCompany(JSON.parse(cached));
  setLoading(false);
  return;
  } catch {}
 }

 fetch("/api/settings", { cache: "no-store" })
  .then((res) => res.json())
  .then((json) => {
  if (json.success && json.data?.company) {
   const c = json.data.company;
   const mapped: CompanyInfo = {
   whatsapp: c.whatsapp || defaultCompany.whatsapp,
   whatsappDisplay: c.whatsappDisplay || defaultCompany.whatsappDisplay,
   whatsappLink: `https://api.whatsapp.com/send?phone=${c.whatsapp || defaultCompany.whatsapp}`,
   phone: c.phone || defaultCompany.phone,
   phoneDisplay: c.phoneDisplay || c.phone || defaultCompany.phoneDisplay,
   phoneLink: `tel:${c.phone || defaultCompany.phone}`,
   name: c.name || defaultCompany.name,
   email: c.email || defaultCompany.email,
   address: c.address || defaultCompany.address,
   yearsExperience: c.yearsExperience || defaultCompany.yearsExperience,
   projectsCompleted: c.projectsCompleted || defaultCompany.projectsCompleted,
   regency: defaultCompany.regency,
   };
   setCompany(mapped);
   sessionStorage.setItem("bsa_company_settings", JSON.stringify(mapped));
   sessionStorage.setItem("bsa_company_settings_time", String(now));
  }
  })
  .catch(() => {})
  .finally(() => setLoading(false));
 }, []);

 return <SettingsContext.Provider value={{ company, loading }}>{children}</SettingsContext.Provider>;
}
