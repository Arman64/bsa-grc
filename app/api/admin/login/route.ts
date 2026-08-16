import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
 try {
  const { email, password } = (await request.json()) as { email: string; password: string };

  const creds = getAdminCredentials();

  if (email !== creds.email || password !== creds.password) {
   return NextResponse.json({ success: false, message: "Email atau password salah. Cek ENV ADMIN_EMAIL & ADMIN_PASSWORD." }, { status: 401 });
  }

  const user = {
   email,
   name: "Administrator BSA GRC",
   role: "admin" as const,
   loginAt: new Date().toISOString(),
  };

  const token = createSessionToken(user);

  const response = NextResponse.json({
   success: true,
   message: "Login berhasil",
   user,
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   sameSite: "lax",
   maxAge: 60 * 60 * 8,
   path: "/",
  });

  return response;
 } catch (error) {
  console.error("Login error:", error);
  return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
 }
}
