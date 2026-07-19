'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const xPercentRef = useRef(0);
  const directionRef = useRef(-1);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Request animation frame loop for seamless infinite slider
    let animationFrameId: number;

    const animateSlider = () => {
      if (xPercentRef.current <= -100) {
        xPercentRef.current = 0;
      }
      if (xPercentRef.current > 0) {
        xPercentRef.current = -100;
      }

      gsap.set(sliderRef.current, { xPercent: xPercentRef.current });
      xPercentRef.current += 0.05 * directionRef.current;
      animationFrameId = requestAnimationFrame(animateSlider);
    };

    animationFrameId = requestAnimationFrame(animateSlider);

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (e) => {
        // Change direction based on scroll up/down
        directionRef.current = e.direction === 1 ? -1 : 1;
        // Increase speed drastically based on scroll velocity
        xPercentRef.current += e.getVelocity() / 3000;
      }
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full bg-[#999999] overflow-hidden flex flex-col justify-end text-white"
    >
      {/* Navbar overlay elements can go here if needed, but we have a global Navbar.tsx */}

      {/* Background/Center Portrait Image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] md:w-full max-w-[1000px] md:max-w-[1200px] h-screen z-0 pointer-events-none flex items-end justify-center">
        <Image
          src="/profile.png"
          alt="Rammyajit Deb Portrait"
          fill
          priority
          className="object-contain object-bottom scale-110"
        />
      </div>

      {/* Location Pill (Desktop Only - Middle Left) */}
      <div className="hidden md:flex absolute top-[45%] -translate-y-1/2 left-0 z-20 pointer-events-none">
        <div className="bg-[#1c1d20] rounded-r-full py-4 pr-4 pl-8 flex items-center gap-6 shadow-2xl pointer-events-auto" data-cursor="magnetic">
           <p className="text-sm font-medium text-white leading-snug">Located<br/>in<br/>India, Assam</p>
           <div className="w-16 h-16 rounded-full bg-[#5a5a5c] flex items-center justify-center">
             <Globe size={28} className="text-white" strokeWidth={1} />
           </div>
        </div>
      </div>

      {/* Arrow & Title (Mobile: Bottom Left, Desktop: Middle Right) */}
      <div className="absolute bottom-[5%] left-[5%] md:top-[50%] md:bottom-auto md:-translate-y-1/2 md:left-auto md:right-[15%] z-20 flex flex-col gap-2 md:gap-6 pointer-events-none">
        <ArrowDownRight size={28} strokeWidth={1.5} className="text-white md:w-9 md:h-9" />
        <p className="text-[22px] md:text-[40px] font-light text-white leading-tight">
          Freelance <br /> Designer & Developer
        </p>
      </div>

      {/* Globe Icon (Mobile Only - Bottom Right) */}
      <div className="absolute bottom-[5%] right-[5%] md:hidden z-20 pointer-events-none">
        <Globe size={32} className="text-white" strokeWidth={1} />
      </div>

      {/* Slider Container (Massive text overlapping the bottom of the image) */}
      <div className="absolute bottom-[25%] md:bottom-[10%] left-0 w-full whitespace-nowrap overflow-visible pointer-events-none z-10">
        <div ref={sliderRef} className="relative w-max flex items-center flex-nowrap m-0">
          <p className="whitespace-nowrap text-[120px] md:text-[250px] leading-none font-sans font-medium tracking-tight m-0 pr-[50px] text-white">
            - Rammyajit Deb - Rammyajit Deb - Rammyajit Deb -
          </p>
          <p className="whitespace-nowrap text-[120px] md:text-[250px] leading-none font-sans font-medium tracking-tight m-0 pr-[50px] absolute left-[100%] top-0 text-white">
            - Rammyajit Deb - Rammyajit Deb - Rammyajit Deb -
          </p>
        </div>
      </div>
    </section>
  );
}
