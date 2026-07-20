'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MagneticButton from './MagneticButton';
import { getLenis } from '@/lib/getLenis';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(false);
  
  const burgerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);

  // Monitor scroll height to transition header to sticky burger button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowBurger(true);
      } else {
        setShowBurger(false);
        if (!isOpen) {
          // If menu is open, don't hide the burger
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Animate the burger button scale
  useGSAP(() => {
    if (showBurger || isOpen) {
      gsap.to(burgerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        pointerEvents: 'all'
      });
    } else {
      gsap.to(burgerRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        pointerEvents: 'none'
      });
    }
  }, [showBurger, isOpen]);

  // Animate menu open/close
  useGSAP(() => {
    const menu = menuRef.current;
    const path = pathRef.current;
    const links = linksRef.current?.querySelectorAll('.menu-link');
    const overlay = bgOverlayRef.current;

    if (!menu || !path || !links || !overlay) return;

    const height = window.innerHeight;

    if (isOpen) {
      // Prevent body scrolling
      getLenis()?.stop();

      // Show overlay background
      gsap.to(overlay, {
        opacity: 0.5,
        duration: 0.5,
        pointerEvents: 'all'
      });

      // Animate SVG path curve for organic slide-in
      const initialPath = `M100 0 L100 ${height} Q-100 ${height / 2} 100 0`;
      const targetPath = `M100 0 L100 ${height} Q100 ${height / 2} 100 0`;

      gsap.set(path, { attr: { d: initialPath } });

      gsap.timeline()
        .to(menu, {
          x: 0,
          duration: 0.85,
          ease: 'power4.inOut'
        })
        .to(path, {
          attr: { d: targetPath },
          duration: 0.85,
          ease: 'power3.inOut'
        }, 0)
        .fromTo(links, 
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out' },
          '-=0.45'
        );
    } else {
      // Allow body scrolling
      getLenis()?.start();

      // Hide overlay background
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        pointerEvents: 'none'
      });

      const exitPath = `M100 0 L100 ${height} Q-60 ${height / 2} 100 0`;

      gsap.timeline()
        .to(links, {
          y: -40,
          opacity: 0,
          stagger: 0.04,
          duration: 0.4,
          ease: 'power3.in'
        })
        .to(path, {
          attr: { d: exitPath },
          duration: 0.6,
          ease: 'power3.inOut'
        }, '-=0.2')
        .to(menu, {
          x: '100%',
          duration: 0.65,
          ease: 'power3.inOut'
        }, '-=0.6')
        .set(path, { attr: { d: `M100 0 L100 ${height} Q100 ${height / 2} 100 0` } });
    }
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    
    // Smooth scroll to element using Lenis
    const target = document.querySelector(href) as HTMLElement | null;
    const lenis = getLenis();
    if (target && lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    }
  };

  return (
    <>
      {/* 1. Header (Floating Nav bar on load) */}
      <header className="fixed top-0 left-0 w-full z-40 p-6 md:p-10 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="text-lg md:text-xl font-medium tracking-wide text-fg-main pointer-events-auto">
          <a 
            href="/" 
            onClick={(e) => { 
              e.preventDefault(); 
              window.location.reload(); 
            }}
            className="relative block overflow-hidden group py-1"
            data-cursor="pointer"
          >
            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
              © Code by Rammyajit
            </span>
            <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full text-white">
              Rammyajit Deb
            </span>
          </a>
        </div>
        
        <nav className={`flex items-center gap-4 md:gap-12 text-xs md:text-sm font-medium md:tracking-[0.2em] text-fg-main transition-opacity duration-300 pointer-events-auto ${
          showBurger ? 'opacity-0' : 'opacity-100'
        }`}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
              className="relative py-2 group overflow-hidden"
              data-cursor="pointer"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {link.label}
              </span>
              <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full text-accent">
                {link.label}
              </span>
            </a>
          ))}
        </nav>
      </header>

      {/* 2. Burger Button (Sticky on scroll) */}
      <div
        ref={burgerRef}
        className="fixed top-6 right-6 md:top-10 md:right-10 z-50 opacity-0 scale-0 pointer-events-none"
      >
        <MagneticButton
          className="w-16 h-16 rounded-full bg-fg-main border border-zinc-800 flex items-center justify-center text-bg-main shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col gap-1.5 items-center justify-center w-full h-full">
            <span className={`block w-6 h-[2px] bg-black transition-transform duration-300 ${
              isOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`} />
            <span className={`block w-6 h-[2px] bg-black transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`} />
            <span className={`block w-6 h-[2px] bg-black transition-transform duration-300 ${
              isOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`} />
          </div>
        </MagneticButton>
      </div>

      {/* 3. Black Backdrop Overlay */}
      <div
        ref={bgOverlayRef}
        className="fixed inset-0 bg-black opacity-0 z-40 pointer-events-none transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* 4. Full-screen Menu Drawer */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-[#121214] z-40 translate-x-full border-l border-zinc-900 flex flex-col justify-between p-12 md:p-20 overflow-visible"
      >
        {/* Curved Morphing Edge SVG */}
        <svg className="absolute top-0 left-[-99px] w-[100px] h-full fill-[#121214] stroke-none pointer-events-none">
          <path ref={pathRef} d="M100 0 L100 1000 Q100 500 100 0" />
        </svg>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] tracking-[0.35em] text-fg-muted uppercase border-b border-zinc-800 pb-4">
            Navigation
          </span>
          <div ref={linksRef} className="flex flex-col gap-6 mt-8">
            {LINKS.map((link) => (
              <div key={link.label} className="overflow-hidden">
                <span
                  onClick={() => handleLinkClick(link.href)}
                  className="menu-link block text-4xl md:text-5xl font-serif text-fg-main hover:text-accent cursor-pointer transition-colors duration-300 py-1"
                >
                  {link.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-[11px] uppercase tracking-widest text-fg-muted">
            <span className="text-[9px] uppercase tracking-[0.3em] text-fg-muted font-bold block mb-2">Socials</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-accent transition-colors">GitHub</a>
              <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
