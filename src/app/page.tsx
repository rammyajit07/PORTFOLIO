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
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {/* 
        The main content wrapper. We transition it from opacity 0 to 1 once loaded.
        We keep it unrendered during loading to avoid layout shifts or untimely animation triggers.
      */}
      <div 
        className={`relative w-full transition-opacity duration-1000 ease-out ${
          loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'
        }`}
      >
        {!loading && (
          <>
            <Navbar />
            <main className="w-full">
              <Hero />
              <About />
              <Projects />
              <Contact />
            </main>
            <Footer />
          </>
        )}
      </div>
    </>
  );
}
