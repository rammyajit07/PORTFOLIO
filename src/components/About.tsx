'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ABOUT_PARAGRAPH = 
  "I specialize in constructing digital pathways that bridge structural engineering with visual poetry. By prioritizing meticulous typographic hierarchy, generous white space, and organic scroll-triggered physics, I create interfaces that feel responsive, tactile, and highly premium. No templates. No shortcuts. Just raw craftsmanship designed to capture attention and elevate digital communication.";

const TIMELINE = [
  { year: '2024 — Present', role: 'Senior Creative Developer', company: 'Studio Aether' },
  { year: '2022 — 2024', role: 'Interaction Architect', company: 'Vortex Digital' },
  { year: '2020 — 2022', role: 'Frontend Engineer', company: 'Spectra Tech' }
];

const SKILLS = [
  'Next.js / App Router',
  'TypeScript & API Design',
  'GSAP / Motion Design',
  'Fluid Layouts (Tailwind CSS)',
  'Creative Technical Direction',
  'Performance Optimization',
  'Semantic Accessibility',
  'Interaction Engineering'
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Word-by-word scroll-light-up reveal
    const words = textRef.current?.querySelectorAll('.word-span');
    if (words && words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: true
          }
        }
      );
    }

    // 2. Timeline divider lines reveal
    const dividers = timelineRef.current?.querySelectorAll('.timeline-divider');
    if (dividers && dividers.length > 0) {
      gsap.fromTo(
        dividers,
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 85%'
          }
        }
      );
    }

    // 3. Section Title Entrance
    gsap.fromTo(
      '.about-title',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  const wordsArray = ABOUT_PARAGRAPH.split(' ');

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen w-full bg-bg-main py-24 md:py-36 border-b border-zinc-900"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold block mb-4">
              01 / PERSPECTIVE
            </span>
            <h2 className="about-title text-4xl md:text-5xl font-serif text-fg-main font-light leading-tight select-none">
              Engineering <br />
              <span className="italic text-fg-muted font-normal">Fluid Aesthetics</span>
            </h2>
          </div>

          {/* Right Column: Paragraph and Details */}
          <div className="lg:col-span-8 flex flex-col gap-20">
            {/* Scroll reveal paragraph */}
            <div className="max-w-3xl">
              <p ref={textRef} className="text-xl md:text-3xl font-serif text-fg-main leading-relaxed font-light select-none">
                {wordsArray.map((word, i) => (
                  <span
                    key={i}
                    className="word-span inline-block mr-2.5 transition-opacity will-change-transform opacity-20"
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>

            {/* Experience Timeline */}
            <div ref={timelineRef} className="flex flex-col w-full">
              <span className="text-[10px] uppercase tracking-[0.25em] text-fg-muted font-semibold block mb-8">
                Timeline & Engagements
              </span>
              
              <div className="flex flex-col">
                {TIMELINE.map((item, index) => (
                  <div key={index} className="group relative w-full overflow-hidden">
                    {/* Divider Line */}
                    <div className="timeline-divider w-full h-[1px] bg-zinc-800 origin-left scale-x-0" />
                    
                    {/* Content Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 transition-all duration-300 group-hover:translate-x-3">
                      <span className="text-xs tracking-wider text-fg-muted md:w-1/4">
                        {item.year}
                      </span>
                      <span className="text-lg md:text-xl font-serif text-fg-main md:w-2/5 mt-1 md:mt-0 transition-colors group-hover:text-accent">
                        {item.role}
                      </span>
                      <span className="text-sm text-fg-muted md:w-1/4 mt-1 md:mt-0 md:text-right">
                        {item.company}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Closing Bottom Divider Line */}
                <div className="timeline-divider w-full h-[1px] bg-zinc-800 origin-left scale-x-0" />
              </div>
            </div>

            {/* Skills / Capabilities */}
            <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-fg-muted font-semibold block">
                Technical Mastery & Capabilities
              </span>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs uppercase tracking-widest text-fg-main border border-zinc-800 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
