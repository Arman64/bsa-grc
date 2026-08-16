"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

interface PortfolioCarouselProps {
  images: string[];
  title: string;
  mainImage: string;
}

export default function PortfolioCarousel({ images, title, mainImage }: PortfolioCarouselProps) {
  // Combine main image + additional images, deduplicate
  const allImages = [mainImage, ...(images || [])].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % uniqueImages.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  if (uniqueImages.length === 0) {
    return (
      <div className="h-[380px] lg:h-[500px] rounded-[2rem] border bg-muted flex items-center justify-center">
        <Images className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative h-[380px] lg:h-[500px] rounded-[2rem] overflow-hidden border shadow-large bg-muted group">
          <Image
            src={uniqueImages[currentIndex]}
            alt={`${title} - ${currentIndex + 1}`}
            fill
            className="object-cover cursor-zoom-in"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={currentIndex === 0}
            onClick={() => setShowLightbox(true)}
          />

          {/* Navigation Arrows - Show if more than 1 image */}
          {uniqueImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-large flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-large flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {uniqueImages.length}
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-xl p-3 border flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {uniqueImages.length} Foto Proyek - Klik untuk zoom
            </span>
            <span className="text-xs text-muted-foreground">Geser untuk lihat</span>
          </div>
        </div>

        {/* Thumbnails Carousel - Supports lebih dari 5 images with horizontal scroll */}
        {uniqueImages.length > 1 && (
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold-200 scrollbar-track-muted/50 snap-x snap-mandatory">
              {uniqueImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => goTo(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 snap-start transition-all ${
                    idx === currentIndex ? "border-maroon-700 shadow-medium scale-105" : "border-gold-100 hover:border-maroon-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  {idx === currentIndex && (
                    <div className="absolute inset-0 ring-2 ring-maroon-700 ring-offset-1 rounded-xl pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Scroll indicators for lebih dari 5 */}
            {uniqueImages.length > 5 && (
              <div className="flex justify-center mt-2 gap-1">
                {Array.from({ length: Math.ceil(uniqueImages.length / 5) }).map((_, groupIdx) => {
                  const isActiveGroup = Math.floor(currentIndex / 5) === groupIdx;
                  return <div key={groupIdx} className={`h-1 rounded-full transition-all ${isActiveGroup ? "w-6 bg-maroon-700" : "w-2 bg-muted"}`} />;
                })}
              </div>
            )}

            <p className="text-[11px] text-center text-muted-foreground mt-2">
              {uniqueImages.length} foto • Klik thumbnail untuk ganti • Geser untuk lihat lebih banyak
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowLightbox(false)}>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={uniqueImages[currentIndex]} alt={title} fill className="object-contain" sizes="100vw" />
            <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30">
              <X className="w-5 h-5" />
            </button>
            {uniqueImages.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold">
              {currentIndex + 1} / {uniqueImages.length} - {title}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
