"use client";

import { useEffect, useState } from "react";
import { X, Search, Folder, ImageOff, Check } from "lucide-react";

interface MediaItem {
  id: number;
  url: string;
  fileName: string;
  originalName?: string;
  size: number;
  type: string;
  folder: string;
  alt?: string;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  multiple = false,
  onSelectMultiple,
  initialFolder,
}: {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  multiple?: boolean;
  onSelectMultiple?: (urls: string[]) => void;
  initialFolder?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    setSearch("");
    setFolderFilter(initialFolder || "all");
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setItems(j.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open, initialFolder]);

  if (!open) return null;

  const filtered = items.filter((item) => {
    const matchSearch = `${item.fileName} ${item.alt} ${item.folder}`.toLowerCase().includes(search.toLowerCase());
    const matchFolder = folderFilter === "all" || item.folder === folderFilter;
    return matchSearch && matchFolder;
  });
  const folders = ["all", ...Array.from(new Set(items.map((i) => i.folder)))];

  const toggleSelect = (url: string) => {
    if (!multiple) {
      onSelect?.(url);
      onClose();
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const confirmMultiple = () => {
    onSelectMultiple?.(Array.from(selected));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="media-picker-overlay"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-bold">Pilih dari Media Library</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg" data-testid="media-picker-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari gambar..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
              data-testid="media-picker-search"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {folders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolderFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                  folderFilter === f ? "bg-maroon-700 text-white border-maroon-700" : "bg-white hover:bg-muted"
                }`}
              >
                <Folder className="w-3 h-3 inline mr-1" />
                {f === "all" ? "Semua" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ImageOff className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Belum ada gambar. Upload dulu di Media Library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {filtered.map((item) => {
                const isSelected = selected.has(item.url);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelect(item.url)}
                    data-testid={`media-picker-item-${item.id}`}
                    className={`relative aspect-square rounded-xl border-2 overflow-hidden group ${
                      isSelected ? "border-maroon-600 ring-2 ring-maroon-300" : "border-transparent hover:border-gold-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt || item.fileName} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-maroon-700 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.fileName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="px-5 py-3 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{selected.size} gambar dipilih</span>
            <button
              type="button"
              onClick={confirmMultiple}
              disabled={selected.size === 0}
              data-testid="media-picker-confirm"
              className="bg-maroon-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
            >
              Gunakan {selected.size} Gambar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
