import { NextRequest, NextResponse } from "next/server";
import { validateContactForm, type ContactFormData, type WebhookPayload } from "@/lib/validations";
import { COMPANY_INFO } from "@/lib/constants";
import { getSettingsData } from "@/lib/data";
import { getSiteChrome } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ApiResponse {
 success: boolean;
 message: string;
 data?: {
  whatsappLink: string;
 };
 errors?: Record<string, string>;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
 try {
  const body = (await request.json()) as Partial<ContactFormData>;

  const validation = validateContactForm(body);
  if (!validation.isValid) {
   return NextResponse.json(
    {
     success: false,
     message: "Validasi gagal. Periksa kembali data Anda.",
     errors: validation.errors as Record<string, string>,
    },
    { status: 400 }
   );
  }

  let whatsappNumber: string = COMPANY_INFO.contact.whatsapp;
  try {
   const settings = await getSettingsData();
   if (settings.company?.whatsapp) {
    whatsappNumber = settings.company.whatsapp;
   }
  } catch {}

  const payload: WebhookPayload = {
   name: body.name!.trim(),
   phone: body.phone!.trim(),
   service: body.service!.trim(),
   location: body.location!.trim(),
   size: body.size?.trim(),
   message: body.message!.trim(),
   timestamp: new Date().toISOString(),
   source: "bsagrc.co.id revamp - Next.js",
   userAgent: request.headers.get("user-agent") || "unknown",
   url: request.headers.get("referer") || COMPANY_INFO.website,
  };

  let webhookUrl = process.env.WEBHOOK_URL || process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
  if (!webhookUrl) {
   try {
    const chrome = await getSiteChrome();
    webhookUrl = chrome.integrations?.webhookUrl || "";
   } catch {}
  }

  if (webhookUrl) {
   try {
    await fetch(webhookUrl, {
     method: "POST",
     headers: { "Content-Type": "application/json", "X-Source": "bsa-grc-website" },
     body: JSON.stringify(payload),
    });
   } catch (webhookError) {
    console.error("Webhook failed:", webhookError);
   }
  }

  const waText = encodeURIComponent(
   `Assalamualaikum BSA GRC,%0A%0ANama: ${payload.name}%0ANo WA: ${payload.phone}%0ALayanan: ${payload.service}%0ALokasi: ${payload.location}%0AUkuran: ${payload.size || "-"}%0ADetail: ${payload.message}%0A%0ASumber: Website bsagrc.co.id%0A%0AMohon info penawaran. Terima kasih.`
  );
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${waText}`;

  return NextResponse.json({
   success: true,
   message: "Penawaran berhasil dikirim! Tim BSA GRC akan menghubungi Anda <5 menit.",
   data: { whatsappLink },
  });
 } catch (error) {
  console.error("API /api/contact error:", error);
  return NextResponse.json(
   {
    success: false,
    message: "Terjadi kesalahan server. Silakan hubungi langsung via WhatsApp.",
   },
   { status: 500 }
  );
 }
}

export async function GET(): Promise<NextResponse> {
 return NextResponse.json(
  {
   success: false,
   message: "Method not allowed. Use POST.",
  },
  { status: 405 }
 );
}
