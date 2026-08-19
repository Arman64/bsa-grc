import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { changeAdminPassword } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    const result = await changeAdminPassword(session.email, currentPassword, newPassword);
    if (!result.ok) return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("change-password error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
