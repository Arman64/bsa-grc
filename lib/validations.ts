/**
 * BSA GRC - Validations
 * Strict TypeScript - No any
 */

export interface ContactFormData {
  name: string;
  phone: string;
  service: string;
  location: string;
  size?: string;
  message: string;
}

export interface WebhookPayload extends ContactFormData {
  timestamp: string;
  source: string;
  userAgent: string;
  url: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Nama minimal 3 karakter";
  }

  if (!data.phone || !/^[0-9+\-\s]{10,15}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "No WhatsApp tidak valid (10-15 digit)";
  }

  if (!data.service) {
    errors.service = "Pilih jenis layanan";
  }

  if (!data.location || data.location.trim().length < 5) {
    errors.location = "Lokasi proyek minimal 5 karakter";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Detail kebutuhan minimal 10 karakter";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatWhatsAppMessage(data: ContactFormData): string {
  return `
Assalamualaikum BSA GRC,

Saya ingin konsultasi proyek:

Nama: ${data.name}
No WA: ${data.phone}
Layanan: ${data.service}
Lokasi Proyek: ${data.location}
Ukuran: ${data.size || "-"}
Detail: ${data.message}

Mohon info penawaran & katalog. Terima kasih.

Sumber: bsagrc.co.id (revamp)
`.trim();
}
