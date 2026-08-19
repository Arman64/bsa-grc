"use client";

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { labelFor } from "@/lib/content-defaults";
import ImageField from "./ImageField";

function isImageKey(k: string) {
  return /image|photo|logo|favicon|icon|cover|foto|gambar/i.test(k);
}
function isLongText(k: string, v: any) {
  return /desc|description|subtitle|answer|content|text|body|note|tagline/i.test(k) || (typeof v === "string" && v.length > 90);
}

function emptyLike(v: any): any {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") {
    const out: any = {};
    for (const k of Object.keys(v)) out[k] = emptyLike(v[k]);
    return out;
  }
  return "";
}

function Field({ fieldKey, value, onChange, folder }: { fieldKey: string; value: any; onChange: (v: any) => void; folder: string }) {
  const label = labelFor(fieldKey);

  // Image
  if (isImageKey(fieldKey) && (typeof value === "string" || value === undefined)) {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">{label}</label>
        <ImageField value={value || ""} onChange={onChange} folder={folder} />
      </div>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="rounded" />
        <span className="font-medium">{label}</span>
      </label>
    );
  }

  // Number
  if (typeof value === "number") {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">{label}</label>
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border text-sm" />
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return <ArrayEditor fieldKey={fieldKey} value={value} onChange={onChange} folder={folder} />;
  }

  // Object (nested)
  if (value && typeof value === "object") {
    return (
      <div className="border rounded-xl p-3 bg-muted/20">
        <p className="text-xs font-bold text-maroon-700 mb-2">{label}</p>
        <ObjectEditor obj={value} onChange={onChange} folder={folder} />
      </div>
    );
  }

  // Long text
  if (isLongText(fieldKey, value)) {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">{label}</label>
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" />
      </div>
    );
  }

  // Short string
  return (
    <div>
      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
    </div>
  );
}

function ArrayEditor({ fieldKey, value, onChange, folder }: { fieldKey: string; value: any[]; onChange: (v: any[]) => void; folder: string }) {
  const label = labelFor(fieldKey);
  const isObjArray = value.length > 0 && value[0] && typeof value[0] === "object" && !Array.isArray(value[0]);
  const template = value.length > 0 ? emptyLike(value[0]) : "";

  const setAt = (idx: number, v: any) => {
    const next = [...value];
    next[idx] = v;
    onChange(next);
  };
  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const add = () => onChange([...value, isObjArray ? template : ""]);

  return (
    <div className="border rounded-xl p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-maroon-700">{label} <span className="text-muted-foreground font-normal">({value.length})</span></p>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 text-[11px] bg-maroon-50 border border-maroon-100 text-maroon-700 px-2 py-1 rounded-lg hover:bg-maroon-100">
          <Plus className="w-3 h-3" /> Tambah
        </button>
      </div>
      <div className="space-y-2">
        {value.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start bg-muted/30 rounded-lg p-2">
            <div className="flex-1 min-w-0">
              {isObjArray ? (
                <ObjectEditor obj={item} onChange={(v) => setAt(idx, v)} folder={folder} />
              ) : isImageKey(fieldKey) ? (
                <ImageField value={item || ""} onChange={(v) => setAt(idx, v)} folder={folder} />
              ) : (
                <input value={item ?? ""} onChange={(e) => setAt(idx, e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" placeholder={`${label} ${idx + 1}`} />
              )}
            </div>
            <button type="button" onClick={() => removeAt(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0" aria-label="Hapus">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {value.length === 0 && <p className="text-[11px] text-muted-foreground">Belum ada item. Klik Tambah.</p>}
      </div>
    </div>
  );
}

export function ObjectEditor({ obj, onChange, folder = "pages" }: { obj: Record<string, any>; onChange: (v: any) => void; folder?: string }) {
  const setKey = (k: string, v: any) => onChange({ ...obj, [k]: v });
  return (
    <div className="space-y-3">
      {Object.keys(obj).map((k) => (
        <Field key={k} fieldKey={k} value={obj[k]} onChange={(v) => setKey(k, v)} folder={folder} />
      ))}
    </div>
  );
}

/** A collapsible card wrapping ObjectEditor for one section */
export function SectionCard({ title, obj, onChange, folder = "pages", defaultOpen = false }: { title: string; obj: any; onChange: (v: any) => void; folder?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const count = obj && typeof obj === "object" ? Object.keys(obj).length : 0;
  return (
    <div className="bg-white rounded-xl border shadow-soft overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
        <span className="font-bold text-sm text-foreground flex items-center gap-2">
          {title}
          <span className="text-[10px] bg-gold-50 border border-gold-200 text-gold-700 px-2 py-0.5 rounded-full">{count} field</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t bg-muted/10">
          {obj && typeof obj === "object" ? <ObjectEditor obj={obj} onChange={onChange} folder={folder} /> : null}
        </div>
      )}
    </div>
  );
}
