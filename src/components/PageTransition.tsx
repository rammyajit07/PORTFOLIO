'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getLenis } from '@/lib/getLenis';

interface PageTransitionContextType {
  transitionTo: (href: string, label: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used within PageTransitionProvider');
  return ctx;
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const playOutro = useCallback(() => {
    const overlay = overlayRef.current;
    const text = textRef.current;
    if (!overlay || !text) return;

    gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        // Hide the overlay via display none — zero chance of blocking interaction
        gsap.set(overlay, { display: 'none' });
      }
    })
    .to(overlay, {
      yPercent: -100,
      duration: 0.75,
      ease: 'power4.inOut'
    })
    .to(text, {
      opacity: 0,
      duration: 0.3
    }, '-=0.5');
  }, []);

  const transitionTo = useCallback((href: string, label: string) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    const text = textRef.current;

    if (!overlay || !text) {
      isAnimating.current = false;
      const el = document.querySelector(href) as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Kill any in-flight tweens
    gsap.killTweensOf([overlay, text]);

    // Set label text DIRECTLY on the DOM — no React state, no re-render lag
    text.textContent = label;

    // ── STEP 1: Position overlay off-screen bottom INSTANTLY, then make it visible ──
    // Using display:block (not visibility/opacity tricks) so there is zero layout
    // flicker and no CSS specificity battle with .overlay-idle
    gsap.set(overlay, {
      display: 'flex',
      yPercent: 100, // parked below viewport
      opacity: 1,
    });
    gsap.set(text, { opacity: 0, y: 20 });

    // ── STEP 2: Run intro — overlay slides up to cover the full screen ──
    const tl = gsap.timeline({
      onComplete: () => {
        // Screen is 100% covered. Navigate NOW.
        const target = document.querySelector(href) as HTMLElement | null;
        if (target) {
          try {
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(target, { immediate: true });
          } catch (_) { /* noop */ }
          // Fallback for when Lenis isn't ready
          target.scrollIntoView({ behavior: 'auto' });
        }

        // Brief hold — lets new content paint behind the overlay
        gsap.delayedCall(0.05, playOutro);
      }
    });

    tl
      // Slide up from bottom — covers entire viewport
      .to(overlay, {
        yPercent: 0,
        duration: 0.75,
        ease: 'power4.inOut',
      })
      // Fade in the destination label
      .to(text, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
      }, '-=0.35')
      // Hold for visual impact
      .to({}, { duration: 0.3 });

  }, [playOutro]);

  return (
    <PageTransitionContext.Provider value={{ transitionTo }}>
      {children}

      {/*
        Transition overlay — hidden via display:none by default.
        GSAP switches it to display:flex then back to display:none.
        No visibility/opacity CSS class tricks that can race with GSAP.
      */}
      <div
        ref={overlayRef}
        id="nav-transition-overlay"
        className="fixed inset-0 z-[99999] bg-bg-main flex items-center justify-center"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-4 text-fg-main text-4xl md:text-5xl font-serif font-light">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent flex-shrink-0" />
          <span ref={textRef} />
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
