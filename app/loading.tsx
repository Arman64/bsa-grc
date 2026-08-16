export default function Loading() {
 return (
 <div className="min-h-[60vh] flex items-center justify-center py-20 bg-gradient-to-br from-white to-gold-50/30">
  <div className="text-center space-y-6">
  <div className="relative w-20 h-20 mx-auto">
   <div className="absolute inset-0 border-4 border-maroon-100 rounded-full" />
   <div className="absolute inset-0 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin" />
   <div className="absolute inset-3 bg-gold-400 rounded-full animate-pulse-soft" />
  </div>
  <div className="space-y-2">
   <p className="font-bold text-foreground">Memuat Halaman BSA GRC</p>
   <p className="text-sm text-muted-foreground">Kontraktor Kubah GRC, Menara GRC Terbaik...</p>
  </div>
  <div className="flex justify-center gap-1">
   <span className="w-2 h-2 bg-maroon-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
   <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
   <span className="w-2 h-2 bg-maroon-600 rounded-full animate-bounce" />
  </div>
  </div>
 </div>
 );
}
