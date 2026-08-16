"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("admin@bsagrc.co.id");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 relative overflow-hidden">
      {/* Islamic pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "24px 24px"
      }} />

      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <Image src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" alt="BSA" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="font-bold text-xl">BSA <span className="text-gold-400">GRC</span></p>
              <p className="text-xs text-white/60 tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Kelola<br />
            <span className="text-gold-400">Website BSA GRC</span><br />
            Dengan Mudah
          </h1>
          <p className="text-white/70 leading-relaxed max-w-md">
            Panel admin untuk mengatur gambar, teks hero, layanan, portofolio pekerjaan, testimoni, dan pengaturan perusahaan. Aman & cepat.
          </p>
          <div className="flex gap-3">
            {["Gambar", "Teks", "Portofolio", "Layanan"].map((f) => (
              <span key={f} className="text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1.5">{f}</span>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} BSA GRC • Pabrik Trenggalek</p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-large border border-gold-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto bg-maroon-700 rounded-2xl flex items-center justify-center shadow-maroon mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Login Admin</h2>
            <p className="text-sm text-muted-foreground mt-2">Masuk ke dashboard untuk kelola konten website</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex gap-2 mb-6">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Email Admin</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bsagrc.co.id"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-border focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Default: admin@bsagrc.co.id / BSA@GRC2026! (ganti via ENV)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold py-3.5 rounded-xl shadow-maroon hover:shadow-large hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memeriksa...
                </>
              ) : (
                <>Masuk Dashboard</>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">Lupa password? Set via ENV ADMIN_EMAIL & ADMIN_PASSWORD</p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-dashed text-center">
            <p className="text-xs text-muted-foreground">
              Kembali ke website?{" "}
              <a href="/" className="font-semibold text-maroon-700 hover:underline">
                Beranda BSA GRC
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
