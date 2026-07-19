'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    // Disable custom cursor entirely on mobile touch interfaces
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    if (!cursorRef.current) return;
    
    // QuickTo triggers for ultra-smooth spring animations (snappier duration)
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.15, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.15, ease: 'power3.out' });

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!isVisible) {
        setIsVisible(true);
        document.body.classList.add('custom-cursor-active');
      }
    };

    // Handle mouse leaving window
    const handleMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.remove('custom-cursor-active');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isVisible]);

  useEffect(() => {
    // Disable hover events entirely on touch screens
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Hover event listeners (Event delegation for performance)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest interactive element
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, [data-cursor]');
      
      if (interactiveEl) {
        const cursorAttr = interactiveEl.getAttribute('data-cursor');
        
        if (cursorAttr === 'view') {
          setIsViewMode(true);
          setCursorText('VIEW');
          setIsHovered(true);
        } else if (cursorAttr === 'magnetic') {
          setIsHovered(true);
          setCursorText('');
        } else {
          setIsHovered(true);
          setCursorText('');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, [data-cursor]');
      if (interactiveEl) {
        setIsHovered(false);
        setIsViewMode(false);
        setCursorText('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center duration-300 ease-out hidden md:flex ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        isViewMode 
          ? 'w-24 h-24 bg-fg-main text-bg-main' 
          : isHovered 
            ? 'w-20 h-20 bg-fg-main' 
            : 'w-4 h-4 bg-fg-main'
      }`}
      style={{ transitionProperty: 'width, height, background-color, opacity' }}
    >
      {isViewMode && (
        <span className="text-[10px] tracking-[0.2em] font-medium text-black">
          {cursorText}
        </span>
      )}
    </div>
  );
}
