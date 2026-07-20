'use client';

import React, { useState } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      
      {/* 
        The main content wrapper is rendered immediately. 
        This allows Next.js to inject image preload tags and Lighthouse to record 
        an instant LCP, while the absolute preloader handles the visual entrance.
      */}
      <div className="relative w-full">
        <Navbar />
        <main className="w-full">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
