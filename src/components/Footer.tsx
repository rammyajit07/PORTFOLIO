'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { getLenis } from '@/lib/getLenis';

export default function Footer() {
  const handleScrollTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo('#home', { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-bg-main py-12 md:py-20 border-t border-zinc-900 overflow-hidden">
      {/* Subtle grid line backdrop */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
        <div className="border-r border-zinc-900 h-full" />
        <div className="border-r border-zinc-900 h-full" />
        <div className="border-r border-zinc-900 h-full" />
        <div className="h-full" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 w-full">
          
          {/* Left Side: Copyright / Location */}
          <div className="flex flex-col gap-4 text-xs text-fg-muted uppercase tracking-widest">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-fg-main">©PORTFOLIO</span>
              <span>All rights reserved. Designed from scratch.</span>
            </div>
            <span>Designed by, Rammyajit Deb</span>
          </div>

          {/* Center: A nice quote or brand motto */}
          <div className="hidden lg:block text-xs font-serif italic text-fg-muted max-w-xs text-center leading-relaxed">
            &ldquo;Clean design. Smooth interactions. Built with attention to detail.&rdquo;
          </div>

          {/* Right Side: Back to top action with magnetic button */}
          <div className="flex items-center justify-start md:justify-end">
            <MagneticButton range={40} strength={0.3} className="pointer-events-auto">
              <button
                onClick={handleScrollTop}
                className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center text-fg-main hover:bg-fg-main hover:text-bg-main transition-all duration-300"
                aria-label="Scroll back to top"
                data-cursor="pointer"
              >
                <ArrowUp size={16} />
              </button>
            </MagneticButton>
            <span className="text-xs uppercase tracking-widest text-fg-muted ml-4 md:hidden block">
              Back to top
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
