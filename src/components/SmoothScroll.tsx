'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to ScrollTrigger updates
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Integrate Lenis scroll with GSAP ticker
    const updatePhysics = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updatePhysics);

    // Refresh ScrollTrigger when Lenis resizes
    const handleRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener('refresh', handleRefresh);
    
    // Initial refresh
    ScrollTrigger.refresh();

    // Export lenis globally for simple scrolling interactions elsewhere
    window.lenis = lenis;

    return () => {
      gsap.ticker.remove(updatePhysics);
      ScrollTrigger.removeEventListener('refresh', handleRefresh);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return <div className="relative w-full">{children}</div>;
}
