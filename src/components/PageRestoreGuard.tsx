'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { getLenis } from '@/lib/getLenis';

/**
 * PageRestoreGuard
 *
 * Fixes the Android Chrome "black screen" bug that occurs when the user
 * navigates away (e.g. to an external project link) and then returns.
 *
 * Root cause: Android Chrome uses bfcache (back-forward cache) which freezes
 * the page mid-state. GSAP animations that were in-flight (especially the
 * #nav-transition-overlay with z-[99999]) restore with their frozen inline
 * styles, covering the entire viewport with a black rectangle.
 *
 * This component listens for `pageshow` (bfcache restore) and
 * `visibilitychange` (tab switch) events and resets all animation state.
 */
export default function PageRestoreGuard() {
  useEffect(() => {
    const resetPageState = () => {
      // 1. Force the nav-transition overlay to be invisible and non-blocking
      const overlay = document.getElementById('nav-transition-overlay');
      if (overlay) {
        gsap.set(overlay, { opacity: 0, yPercent: 100, pointerEvents: 'none' });
        // Belt-and-suspenders: also set via inline style so it survives GSAP resets
        overlay.style.pointerEvents = 'none';
      }

      const overlayText = document.getElementById('nav-transition-text');
      if (overlayText) {
        gsap.set(overlayText, { opacity: 0 });
      }

      // 2. Refresh GSAP ScrollTrigger — recalculates all trigger positions
      //    and restarts any paused scrub animations
      ScrollTrigger.refresh();

      // 3. Restart Lenis smooth scroll (it may have been stopped/paused)
      const lenis = getLenis();
      if (lenis) {
        lenis.start();
      }

      // 4. Remove any stale overflow:hidden that Lenis may have left
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    };

    // `pageshow` fires when the page is restored from bfcache
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was restored from bfcache — do a full reset
        resetPageState();
      }
    };

    // `visibilitychange` fires when the user switches tabs/apps
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetPageState();
      }
    };

    // Run immediately on mount — fixes Vercel SSR hydration edge case where
    // the overlay might have stale inline styles from a previous GSAP session
    resetPageState();

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
