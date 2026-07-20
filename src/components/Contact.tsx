'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiInstagram, FiMail } from 'react-icons/fi';

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/rammyajit07',
    Icon: FiGithub,
    hoverColor: '#f4f4f6',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/rammyajit/',
    label: 'Instagram',
    Icon: FiInstagram,
    hoverColor: '#E1306C',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:rammyajit07@gmail.com',
    Icon: FiMail,
    hoverColor: '#c5a880',
  },
];

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short',
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.contact-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-header', start: 'top 85%' },
      }
    );

    gsap.fromTo(
      '.contact-grid',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
      }
    );
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen w-full bg-bg-main py-24 md:py-36 border-b border-zinc-900"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="contact-header flex flex-col mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold block mb-4">
            03 / COLLABORATION
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-fg-main select-none leading-none">
            Let&apos;s Build <span className="italic text-fg-muted font-normal">Together</span>
          </h2>
        </div>

        {/* Contact Grid */}
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start w-full">

          {/* Left Column: Direct Info */}
          <div className="lg:col-span-4 flex flex-col gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-fg-muted">Direct Email</span>
              <a
                href="mailto:rammyajit07@gmail.com"
                className="text-lg md:text-xl font-serif text-fg-main hover:text-accent transition-colors duration-300"
                data-cursor="pointer"
              >
                rammyajit07@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-fg-muted">Current Clock</span>
              <span className="text-lg font-serif text-fg-main tabular-nums">
                {currentTime || '00:00:00 GMT'}
              </span>
            </div>
          </div>

          {/* Right Column: Connect With Me */}
          <div className="lg:col-span-8 w-full flex flex-col items-center justify-center gap-10 py-8">
            {/* Heading */}
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-fg-muted font-semibold">
                Connect With Me
              </span>
              <div className="w-8 h-px bg-zinc-800" />
            </div>

            {/* Social Icons */}
            <div className="flex flex-row items-center justify-center gap-10 md:gap-16">
              {SOCIALS.map(({ id, label, href, Icon, hoverColor }) => (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  data-cursor="pointer"
                  className="group flex flex-col items-center gap-3"
                >
                  <span
                    className="flex items-center justify-center w-16 h-16 rounded-2xl border border-zinc-800 bg-zinc-950
                      text-fg-muted
                      group-hover:-translate-y-2 group-hover:scale-110 group-hover:border-zinc-600
                      transition-all duration-300 ease-out"
                  >
                    <Icon
                      size={28}
                      style={{
                        transition: 'color 300ms ease',
                        color: 'inherit',
                      }}
                      className={
                        id === 'github'
                          ? 'group-hover:!text-[#f4f4f6]'
                          : id === 'instagram'
                          ? 'group-hover:!text-[#E1306C]'
                          : 'group-hover:!text-accent'
                      }
                    />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-fg-muted group-hover:text-fg-main transition-colors duration-300">
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* Sub-text */}
            <p className="text-sm text-fg-muted text-center max-w-xs leading-relaxed">
              Feel free to connect with me.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
