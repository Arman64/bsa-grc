import { NextRequest, NextResponse } from "next/server";
import { verifyAdminLogin, checkLockout, recordFailedAttempt, clearAttempts } from "@/lib/cms";
import { createSessionCookie, AUTH_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email & password wajib" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const identifier = `${ip}:${email.toLowerCase()}`;

    const lock = await checkLockout(identifier);
    if (lock.locked) {
      const mins = Math.ceil(lock.remainingSec / 60);
      return NextResponse.json(
        { success: false, message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${mins} menit.` },
        { status: 429 }
      );
    }

    const user = await verifyAdminLogin(email, password);
    if (!user) {
      await recordFailedAttempt(identifier);
      return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 });
    }

    await clearAttempts(identifier);
    const token = await createSessionCookie(user);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: { email: user.email, name: user.name, role: user.role },
    });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
