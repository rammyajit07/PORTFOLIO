'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  range?: number;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  range = 60,
  strength = 0.35,
  ...props
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container) return;

    // quickTo helper for high-performance translation updating
    const xTo = gsap.quickTo(container, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(container, 'y', { duration: 0.8, ease: 'power3.out' });
    
    const textXTo = text ? gsap.quickTo(text, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
    const textYTo = text ? gsap.quickTo(text, 'y', { duration: 0.8, ease: 'power3.out' }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.hypot(distanceX, distanceY);

      // Check if mouse is within active range (which includes elements dimensions)
      const maxDistance = Math.max(rect.width, rect.height) / 2 + range;

      if (distance < maxDistance) {
        // Move button toward cursor
        xTo(distanceX * strength);
        yTo(distanceY * strength);
        
        // Move text slightly less for 3D depth / parallax effect
        if (textXTo && textYTo) {
          textXTo(distanceX * (strength * 0.4));
          textYTo(distanceY * (strength * 0.4));
        }
      } else {
        resetMovement();
      }
    };

    const resetMovement = () => {
      gsap.to(container, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1.1, 0.4)' });
      if (text) {
        gsap.to(text, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1.1, 0.4)' });
      }
    };

    const handleMouseLeave = () => {
      resetMovement();
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [range, strength]);

  return (
    <div
      ref={containerRef}
      className={`inline-block ${className}`}
      data-cursor="magnetic"
      {...props}
    >
      <div ref={textRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
