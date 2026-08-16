import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - BSA GRC",
  description: "Admin panel BSA GRC untuk mengelola konten website",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No header/footer for admin
  return <div className="min-h-screen bg-muted/30">{children}</div>;
}
