"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, AlertCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import Button from "@/components/ui/Button";
import type { ContactFormData } from "@/lib/validations";

interface FormErrors {
 name?: string;
 phone?: string;
 service?: string;
 location?: string;
 message?: string;
}

export default function ContactSection() {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);
 const [errors, setErrors] = useState<FormErrors>({});
 const [waLink, setWaLink] = useState<string>("");

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setIsSubmitting(true);
 setErrors({});

 const formData = new FormData(e.currentTarget);
 const data: ContactFormData = {
  name: (formData.get("name") as string)?.trim() || "",
  phone: (formData.get("phone") as string)?.trim() || "",
  service: (formData.get("service") as string)?.trim() || "",
  location: (formData.get("location") as string)?.trim() || "",
  size: (formData.get("size") as string)?.trim(),
  message: (formData.get("message") as string)?.trim() || "",
 };

 try {
  const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
  if (json.errors) setErrors(json.errors);
  throw new Error(json.message);
  }

  setWaLink(json.data?.whatsappLink || "");
  setIsSuccess(true);
  if (json.data?.whatsappLink) {
  setTimeout(() => window.open(json.data.whatsappLink, "_blank"), 800);
  }
 } catch (err) {
  console.error(err);
  if (Object.keys(errors).length === 0) {
  // Fallback direct WA
  const fallbackText = encodeURIComponent(
   `Halo BSA GRC, saya ${data.name} - ${data.service} di ${data.location}. ${data.message}`
  );
  const fallbackLink = `https://api.whatsapp.com/send?phone=${COMPANY_INFO.contact.whatsapp}&text=${fallbackText}`;
  setWaLink(fallbackLink);
  setIsSuccess(true);
  setTimeout(() => window.open(fallbackLink, "_blank"), 500);
  }
 } finally {
  setIsSubmitting(false);
 }
 };

 return (
 <div className="py-16 lg:py-24 bg-gradient-to-br from-white to-gold-50/20">
  <div className="container mx-auto px-4 lg:px-8">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14">
   {/* Info */}
   <div className="space-y-8">
   <div className="space-y-4">
    <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-100 text-maroon-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    Gratis Konsultasi & Survey
    </div>
    <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
    Hubungi Tim <span className="text-maroon-700">BSA GRC</span> Sekarang
    </h1>
    <p className="text-muted-foreground leading-relaxed">
    Tim BSA GRC siap membantu proyek masjid Anda di seluruh Indonesia. Konsultasi desain kustom, estimasi harga, dan survey lokasi gratis. Respon &lt;5 menit.
    </p>
   </div>

   <div className="space-y-4">
    <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-soft border border-gold-100 hover:shadow-medium transition-shadow">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
     <Phone className="w-6 h-6 text-green-600" />
    </div>
    <div className="flex-1">
     <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">WhatsApp & Telepon</p>
     <p className="font-bold text-lg text-foreground mt-1">{COMPANY_INFO.contact.whatsappDisplay}</p>
     <p className="text-sm text-green-600 font-semibold">Online • Balas &lt;5 menit</p>
     <Link
     href={COMPANY_INFO.contact.whatsappLink}
     target="_blank"
     className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition-colors"
     >
     <MessageCircle className="w-3.5 h-3.5" />
     Chat WhatsApp Sekarang
     </Link>
    </div>
    </div>

    <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-soft border hover:shadow-medium transition-shadow">
    <div className="w-12 h-12 rounded-xl bg-maroon-50 border border-maroon-100 flex items-center justify-center flex-shrink-0">
     <MapPin className="w-6 h-6 text-maroon-600" />
    </div>
    <div>
     <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Pabrik & Workshop</p>
     <p className="font-medium text-foreground mt-1 leading-snug">{COMPANY_INFO.address.full}</p>
     <p className="text-xs text-muted-foreground mt-2 bg-muted px-2.5 py-1 rounded-full border inline-block">
     Akses mudah, pengiriman nasional 34 provinsi
     </p>
    </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
    <div className="p-4 bg-white rounded-xl border shadow-soft">
     <Mail className="w-5 h-5 text-gold-600 mb-2" />
     <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
     <p className="text-sm font-semibold text-foreground mt-1">{COMPANY_INFO.contact.email}</p>
    </div>
    <div className="p-4 bg-white rounded-xl border shadow-soft">
     <Clock className="w-5 h-5 text-maroon-600 mb-2" />
     <p className="text-xs text-muted-foreground uppercase tracking-wide">Jam Kerja</p>
     <p className="text-sm font-semibold text-foreground mt-1">Senin - Sabtu 08:00-17:00</p>
    </div>
    </div>
   </div>

   {/* Map placeholder */}
   <div className="rounded-2xl overflow-hidden border h-[220px] bg-muted relative">
    <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.5!2d111.7!3d-8.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDcnMDAuMCJTIDExMcKwNDInMDAuMCJF!5e0!3m2!1sen!2sid"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Lokasi Pabrik BSA GRC Trenggalek"
    />
   </div>
   </div>

   {/* Form - Webhook Ready */}
   <div className="bg-white rounded-[2rem] shadow-large border border-gold-100 p-6 lg:p-8 relative overflow-hidden">
   <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

   <div className="mb-6">
    <h2 className="font-bold text-xl text-foreground">Form Penawaran Proyek</h2>
    <p className="text-sm text-muted-foreground mt-2">
    Isi form, tim kami akan hubungi via WhatsApp. Data aman, langsung ke webhook CRM (n8n automation ready).
    </p>
   </div>

   {isSuccess ? (
    <div className="py-12 text-center space-y-4 animate-fade-in">
    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
     <CheckCircle2 className="w-8 h-8 text-green-600" />
    </div>
    <h3 className="font-bold text-lg">Penawaran Terkirim!</h3>
    <p className="text-sm text-muted-foreground">Terima kasih, tim BSA GRC akan menghubungi Anda via WhatsApp &lt;5 menit. Membuka WhatsApp...</p>
    <div className="flex flex-col gap-2">
     <Button variant="primary" href={waLink || COMPANY_INFO.contact.whatsappLink} external className="mt-2">
     <MessageCircle className="w-4 h-4" />
     Buka WhatsApp Sekarang
     </Button>
     <button onClick={() => setIsSuccess(false)} className="text-xs text-muted-foreground hover:text-foreground">
     Kirim penawaran lain
     </button>
    </div>
    </div>
   ) : (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
    <div className="grid sm:grid-cols-2 gap-4">
     <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">Nama Panitia / Masjid *</label>
     <input
      type="text"
      name="name"
      placeholder="Nama Anda"
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 outline-none transition-all bg-white ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-maroon-500 focus:ring-maroon-200"}`}
     />
     {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
     </div>
     <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">No. WhatsApp *</label>
     <input
      type="tel"
      name="phone"
      placeholder="08xxx"
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 outline-none bg-white ${errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-maroon-500 focus:ring-maroon-200"}`}
     />
     {errors.phone && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
     </div>
    </div>

    <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">Jenis Layanan *</label>
     <select
     name="service"
     className={`w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 outline-none bg-white ${errors.service ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-maroon-500 focus:ring-maroon-200"}`}
     >
     <option value="">Pilih layanan</option>
     <option>Kubah Masjid GRC</option>
     <option>Menara Masjid GRC</option>
     <option>Lisplang GRC</option>
     <option>Krawangan & Ornamen GRC</option>
     <option>Mihrab ACP</option>
     <option>Paket Lengkap Masjid</option>
     </select>
     {errors.service && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.service}</p>}
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
     <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">Lokasi Proyek *</label>
     <input
      type="text"
      name="location"
      placeholder="Masjid Al-Ikhlas, Surabaya"
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 outline-none bg-white ${errors.location ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-maroon-500 focus:ring-maroon-200"}`}
     />
     {errors.location && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.location}</p>}
     </div>
     <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">Diameter / Ukuran</label>
     <input
      type="text"
      name="size"
      placeholder="Ø 6 meter / 4x6 m"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:ring-2 focus:ring-maroon-200 focus:border-maroon-500 outline-none bg-white"
     />
     </div>
    </div>

    <div>
     <label className="text-sm font-semibold mb-1.5 block text-foreground">Detail Kebutuhan *</label>
     <textarea
     name="message"
     rows={4}
     placeholder="Ceritakan kebutuhan kubah / menara masjid Anda, model yang diinginkan, budget, dan jadwal..."
     className={`w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 outline-none resize-none bg-white ${errors.message ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-border focus:border-maroon-500 focus:ring-maroon-200"}`}
     ></textarea>
     {errors.message && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
    </div>

    <button
     type="submit"
     disabled={isSubmitting}
     className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-4 rounded-xl shadow-maroon hover:shadow-large hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
    >
     {isSubmitting ? (
     <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Mengirim & Membuka WA...
     </>
     ) : (
     <>
      <Send className="w-5 h-5" />
      Kirim Penawaran & Konsultasi Gratis
     </>
     )}
    </button>

    <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
     Aman & tidak spam. Data dikirim ke CRM via webhook <code className="bg-muted px-1 rounded">/api/contact</code> → n8n automation ready sesuai PRD. Fallback langsung ke WhatsApp.
    </p>
    </form>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
