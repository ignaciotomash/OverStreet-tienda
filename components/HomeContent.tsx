'use client';

import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';

export default function HomeContent() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} bg-white text-black ${body.className}`}>
      <NavBar />
      <div className="pt-16">
        <Hero />
        <div className="-mt-8">
          <Marquee />
        </div>
        <Footer />
      </div>
    </div>
  );
}
