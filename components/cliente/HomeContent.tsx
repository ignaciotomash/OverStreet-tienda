'use client';

import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/cliente/NavBar';
import Hero from '@/components/cliente/Hero';
import Marquee from '@/components/cliente/Marquee';
import Footer from '@/components/cliente/Footer';

export default function HomeContent() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} bg-white text-black ${body.className}`}>
      <NavBar />
      <div className="pt-16">
        <Hero />
        <div className="-mt-5">
          <Marquee />
        </div>
        <Footer />
      </div>
    </div>
  );
}
