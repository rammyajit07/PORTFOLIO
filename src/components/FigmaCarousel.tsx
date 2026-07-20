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
  // Track if embla is dragging so we don't navigate on drag
  const isDraggingRef = useRef(false);

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
    // Track drag state so click handler knows not to navigate after a drag
    const onDragStart = () => { isDraggingRef.current = true; };
    const onDragEnd = () => {
      // Small delay so the click event (which fires after pointerup) can read the flag
      setTimeout(() => { isDraggingRef.current = false; }, 100);
    };
    emblaApi.on('pointerDown', onDragStart);
    emblaApi.on('pointerUp', onDragEnd);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('pointerDown', onDragStart);
      emblaApi.off('pointerUp', onDragEnd);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Embla Viewport */}
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950"
        style={{ cursor: 'grab', touchAction: 'pan-y' }}
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

      {/* Transparent anchor overlay — covers the carousel for click/tap navigation.
          Pointer events are passed through to embla for dragging; clicks only fire
          when embla didn't drag (isDraggingRef stays false). */}
      <a
        href={INSTAGRAM_URL}
        aria-label="View Instagram carousel post"
        onClick={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
          }
        }}
        className="absolute inset-0 z-[5] rounded-lg"
        style={{ touchAction: 'pan-y' }}
      />

      {/* Navigation Arrows — sit above the overlay */}
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

      {/* Dot Indicators — above the overlay */}
      <div className="relative z-10 flex justify-center gap-1.5 mt-3">
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

      {/* Slide Counter — above the overlay */}
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
