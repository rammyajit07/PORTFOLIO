'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getLenis } from '@/lib/getLenis';

const GREETINGS = [
  "Hello", "Bonjour", "Hola", "Ciao", "Olá", "Hallo", "Namaste", "こんにちは", "안녕하세요", "你好", "مرحباً", "Привет"
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    getLenis()?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        getLenis()?.start();
      }
    });

    wordsRef.current.forEach((word, index) => {
      if (!word) return;
      
      const isLast = index === wordsRef.current.length - 1;
      
      // Initial state before animation starts
      gsap.set(word, { opacity: 0, y: 15, filter: 'blur(5px)' });

      // Animate word in (appends to end of timeline sequentially)
      tl.to(word, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.08,
        ease: 'power2.out',
      });
      
      // Animate word out
      if (!isLast) {
        tl.to(word, {
          opacity: 0,
          y: -15,
          filter: 'blur(5px)',
          duration: 0.08,
          ease: 'power2.in',
        }, "+=0.03"); // hold for 0.03s before fading out
      } else {
        // Hold the last word briefly for impact, then fade out
        tl.to(word, {
          opacity: 0,
          y: -15,
          filter: 'blur(5px)',
          duration: 0.3,
          ease: 'power3.inOut',
        }, "+=0.3"); // hold for 0.3s
      }
    });

    // Slide up and fade out the entire preloader to reveal homepage
    tl.to(containerRef.current, {
      yPercent: -100,
      opacity: 0, 
      duration: 0.8,
      ease: 'power4.inOut',
    }, "-=0.15"); // Start moving up right as the last word is finishing its fade out

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen bg-[#0B0B0B] z-[9999] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {GREETINGS.map((word, i) => (
          <div
            key={i}
            ref={(el) => {
              wordsRef.current[i] = el;
            }}
            className="absolute flex items-center gap-4 will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent" />
            <span className="text-4xl md:text-5xl font-serif font-light text-fg-main tracking-normal">
              {word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
