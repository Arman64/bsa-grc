"use client";

import { useState } from "react";
import { Upload, ImageOff, LibraryBig } from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";

export default function ImageField({
  value,
  onChange,
  folder = "pages",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) onChange(json.data.url);
      else setErr(json.message || "Gagal upload");
    } catch {
      setErr("Gagal upload");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start">
      <div className="w-28 h-20 rounded-lg border bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="preview" className="w-full h-full object-contain" />
        ) : (
          <ImageOff className="w-6 h-6 text-muted-foreground/50" />
        )}
      </div>
      <div className="flex-1 w-full space-y-2">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... atau https://..."
          className="w-full px-3 py-2 rounded-lg border text-xs"
          data-testid="image-field-url-input"
        />
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-1.5 bg-maroon-50 border border-maroon-100 text-maroon-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-maroon-100 transition-colors">
            <Upload className="w-3.5 h-3.5" /> {uploading ? "Mengupload..." : "Upload Gambar"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} data-testid="image-field-upload-input" />
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            data-testid="image-field-gallery-btn"
            className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-800 px-3 py-1.5 rounded-lg text-xs hover:bg-gold-100 transition-colors"
          >
            <LibraryBig className="w-3.5 h-3.5" /> Pilih dari Galeri
          </button>
        </div>
        {err && <p className="text-[11px] text-red-600">{err}</p>}
      </div>

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => onChange(url)} initialFolder={folder} />
    </div>
  );
}

