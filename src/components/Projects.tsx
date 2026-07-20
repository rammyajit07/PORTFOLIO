'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import FigmaCarousel from './FigmaCarousel';

const PROJECTS = [
  {
    id: 'minimalistart',
    title: 'MINIMALISTART.CO',
    category: 'Handcrafted Crochet Showcase & E-Store',
    year: '2025',
    src: '/project-minimalistart.png',
    tags: ['Slow Craft', 'React & Vite', 'E-Commerce'],
    link: 'https://minimalisticart-co.vercel.app/',
    description: undefined as string | undefined,
    carousel: false,
    linkLabel: 'View Live Site',
  },
  {
    id: 'figma-carousels',
    title: 'FIGMA CAROUSELS',
    category: 'Instagram Carousel Collection',
    year: '2026',
    src: undefined as string | undefined,
    tags: ['FIGMA', 'INSTAGRAM', 'UI DESIGN'],
    link: undefined as string | undefined,
    description: 'A collection of Instagram carousel designs created in Figma, showcasing clean layouts, visual storytelling, and attention to detail.',
    carousel: true,
    linkLabel: 'VIEW GALLERY',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const projectCards = containerRef.current?.querySelectorAll('.project-card');
    if (!projectCards) return;

    projectCards.forEach((card) => {
      const imageWrapper = card.querySelector('.img-parallax-wrapper');
      const image = card.querySelector('.project-img');

      // 1. Scroll-triggered clip-path and reveal for the card container
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        }
      );

      // 2. Smooth parallax effect on the image
      if (imageWrapper && image) {
        gsap.fromTo(
          image,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });

    // Header reveal
    gsap.fromTo(
      '.projects-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-header',
          start: 'top 85%'
        }
      }
    );
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen w-full bg-bg-main py-24 md:py-36 border-b border-zinc-900"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="projects-header flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-32">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold block mb-4">
              02 / SELECTED WORK
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-fg-main select-none leading-none">
              Projects 
            </h2>
          </div>
          <p className="text-sm text-fg-muted max-w-xs mt-6 md:mt-0 font-normal leading-relaxed">
            A collection of projects showcasing my skills in web development, design, and creating modern digital experiences.
          </p>
        </div>

        {/* Project Listings */}
        <div className="flex flex-col gap-24 md:gap-36">
          {PROJECTS.map((project, idx) => {
            const CardWrapper = project.link
              ? ({ children }: { children: React.ReactNode }) => (
                  <a
                    href={project.link}
                    className="project-card group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full border-b border-zinc-900 pb-16 md:pb-24 overflow-hidden cursor-none"
                    data-cursor="view"
                  >
                    {children}
                  </a>
                )
              : ({ children }: { children: React.ReactNode }) => (
                  <div
                    className="project-card group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full border-b border-zinc-900 pb-16 md:pb-24 overflow-hidden"
                    data-cursor="view"
                  >
                    {children}
                  </div>
                );

            return (
              <CardWrapper key={project.id}>
                {/* Left Side: Project details */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wider text-fg-muted">
                      0{idx + 1} / {project.year}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-serif text-fg-main font-light mt-4 tracking-tight group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-fg-muted mt-3 max-w-sm">
                      {project.category}
                    </p>
                    {project.description && (
                      <p className="text-sm text-fg-muted mt-4 max-w-sm leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="project-details flex flex-col gap-4 mt-8 lg:mt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] tracking-widest uppercase border border-zinc-800 text-fg-muted px-3 py-1 rounded-full group-hover:border-zinc-700 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fg-main mt-2">
                      <span>{project.linkLabel}</span>
                      <ArrowUpRight size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Image / Carousel */}
                <div className="lg:col-span-8 w-full">
                  {project.carousel ? (
                    <FigmaCarousel />
                  ) : (
                    <div className="img-parallax-wrapper relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 rounded-lg border border-zinc-900">
                      <Image
                        src={project.src!}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        priority={idx === 0}
                        className="project-img object-cover scale-110 group-hover:scale-[1.14] transition-transform duration-700 ease-out will-change-transform"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    </div>
                  )}
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
