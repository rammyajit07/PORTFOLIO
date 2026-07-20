'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  '/carousels/frame1.png',
  '/carousels/frame2.png',
  '/carousels/frame3.png',
  '/carousels/frame4.png',
  '/carousels/frame5.png',
  '/carousels/frame6.png',
  '/carousels/frame7.png',
  '/carousels/frame8.png',
  '/carousels/frame9.png',
  '/carousels/frame10.png',
];

const INSTAGRAM_URL = 'https://www.instagram.com/p/Da7DF80E3mX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';

export default function FigmaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const handleViewportPointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing';
  }, []);

  const handleViewportPointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLDivElement).style.cursor = 'grab';
    if (!pointerDownPos.current) return;
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;
    // Only open link if pointer barely moved (genuine tap/click, not a drag)
    if (dx < 5 && dy < 5) {
      window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'ArrowRight') scrollNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scrollPrev, scrollNext]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    if (isHovered) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, isHovered]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Embla Viewport — click opens Instagram post, drag scrolls */}
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950"
        style={{ cursor: 'grab' }}
        onPointerDown={handleViewportPointerDown}
        onPointerUp={handleViewportPointerUp}
      >
        <div className="flex">
          {SLIDES.map((src, i) => (
            <div
              key={i}
              className="relative flex-[0_0_100%] aspect-[4/5]"
              style={{ minWidth: 0 }}
            >
              <Image
                src={src}
                alt={`Figma Carousel Frame ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollPrev(); }}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 flex items-center justify-center
          bg-black/60 border border-zinc-700 rounded-full
          text-fg-muted hover:text-accent hover:border-accent
          opacity-0 group-hover/carousel:opacity-100
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          backdrop-blur-sm"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollNext(); }}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
          w-9 h-9 flex items-center justify-center
          bg-black/60 border border-zinc-700 rounded-full
          text-fg-muted hover:text-accent hover:border-accent
          opacity-0 group-hover/carousel:opacity-100
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          backdrop-blur-sm"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollTo(i); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-300 ease-out ${
              i === selectedIndex
                ? 'bg-accent w-6'
                : 'bg-zinc-700 hover:bg-zinc-500 w-3'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-3 right-3 z-10
        text-[10px] tracking-widest uppercase text-fg-muted
        bg-black/60 backdrop-blur-sm border border-zinc-800
        px-2.5 py-1 rounded-full
        opacity-0 group-hover/carousel:opacity-100
        transition-opacity duration-300"
      >
        {String(selectedIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </div>
  );
}
