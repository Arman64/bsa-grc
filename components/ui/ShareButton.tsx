"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title, text }: { title: string; text?: string }) {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: text || title, url });
      } catch {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link artikel disalin!");
    }
  };

  return (
    <button onClick={handleShare} className="inline-flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
      <Share2 className="w-4 h-4" /> Bagikan
    </button>
  );
}
