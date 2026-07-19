'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', org: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timezone clock setup (e.g. London GMT or User local time, let's use a nice UTC+1 or user timezone)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Section header reveal
    gsap.fromTo(
      '.contact-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-header',
          start: 'top 85%'
        }
      }
    );

    // Form content fade reveal
    gsap.fromTo(
      '.contact-grid',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%'
        }
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Animate submit success state
    setIsSubmitted(true);
    setFormData({ name: '', email: '', org: '', message: '' });
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

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
          
          {/* Left Column: Direct Info & Social links */}
          <div className="lg:col-span-4 flex flex-col gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-fg-muted">Direct Email</span>
              <a
                href="mailto:contact@rammysen.dev"
                className="text-lg md:text-xl font-serif text-fg-main hover:text-accent transition-colors duration-300 pointer-events-auto"
                data-cursor="pointer"
              >
                contact@rammysen.dev
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-fg-muted">Current Clock</span>
              <span className="text-lg font-serif text-fg-main tabular-nums">
                {currentTime || '12:00:00 GMT'}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-widest text-fg-muted">Social Directory</span>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {['LinkedIn', 'GitHub', 'Twitter', 'Dribbble'].map((social) => (
                  <MagneticButton key={social} range={30} strength={0.3} className="pointer-events-auto">
                    <a
                      href="#"
                      className="text-xs uppercase tracking-widest text-fg-main hover:text-accent transition-colors duration-300 block py-1"
                    >
                      {social}
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-8 w-full">
            {isSubmitted ? (
              <div className="bg-[#121214] border border-zinc-800 rounded-lg p-8 md:p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[380px] transition-all">
                <CheckCircle2 size={48} className="text-accent animate-bounce" />
                <h3 className="text-2xl font-serif text-fg-main">Transmission Received</h3>
                <p className="text-sm text-fg-muted max-w-sm">
                  Thank you for reaching out. I will review your message and connect back with you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-12 w-full pointer-events-auto">
                {/* Form Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-2 relative group">
                    <label className="text-[10px] uppercase tracking-wider text-fg-muted group-focus-within:text-accent transition-colors">
                      What is your name? *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="bg-transparent border-b border-zinc-800 py-3 text-fg-main placeholder-zinc-700 outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative group">
                    <label className="text-[10px] uppercase tracking-wider text-fg-muted group-focus-within:text-accent transition-colors">
                      What is your email? *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="bg-transparent border-b border-zinc-800 py-3 text-fg-main placeholder-zinc-700 outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Form Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-2 relative group">
                    <label className="text-[10px] uppercase tracking-wider text-fg-muted group-focus-within:text-accent transition-colors">
                      What is your organization?
                    </label>
                    <input
                      type="text"
                      name="org"
                      value={formData.org}
                      onChange={handleChange}
                      placeholder="Aether Corp (Optional)"
                      className="bg-transparent border-b border-zinc-800 py-3 text-fg-main placeholder-zinc-700 outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative group">
                    <label className="text-[10px] uppercase tracking-wider text-fg-muted group-focus-within:text-accent transition-colors">
                      Tell me about your project *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={1}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your design and dev goals..."
                      className="bg-transparent border-b border-zinc-800 py-3 text-fg-main placeholder-zinc-700 outline-none focus:border-accent transition-colors resize-none overflow-hidden"
                    />
                  </div>
                </div>

                {/* Submit button wrapped in Magnetic Button */}
                <div className="mt-8 flex justify-end">
                  <MagneticButton range={50} strength={0.25}>
                    <button
                      type="submit"
                      className="w-40 h-40 rounded-full bg-fg-main hover:bg-accent text-bg-main hover:text-bg-main border border-zinc-800 flex flex-col items-center justify-center transition-all duration-500 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg"
                      data-cursor="pointer"
                    >
                      <span>Send</span>
                      <span>Message</span>
                      <ArrowRight size={14} className="mt-1" />
                    </button>
                  </MagneticButton>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
