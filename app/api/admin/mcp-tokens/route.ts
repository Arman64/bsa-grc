import { NextRequest, NextResponse } from "next/server";
import { listTokens, createToken, revokeToken, deleteToken } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tokens = await listTokens();
    return NextResponse.json({ success: true, data: tokens });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Gagal ambil token: " + String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ success: false, message: "Nama token wajib" }, { status: 400 });
    }
    const token = await createToken({
      name: body.name,
      permissions: Array.isArray(body.permissions) ? body.permissions : [],
      expiresAt: body.expiresAt || null,
    });
    return NextResponse.json({ success: true, message: "Token baru berhasil dibuat", data: token });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Gagal membuat token: " + String(e) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "id wajib" }, { status: 400 });
    await revokeToken(Number(body.id), body.revoked !== false);
    return NextResponse.json({ success: true, message: body.revoked === false ? "Token diaktifkan" : "Token dicabut" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Gagal: " + String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id wajib" }, { status: 400 });
    await deleteToken(Number(id));
    return NextResponse.json({ success: true, message: "Token dihapus" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Gagal: " + String(e) }, { status: 500 });
  }
}
