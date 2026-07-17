'use client';

import { display, body, mono } from '@/lib/fonts';
import type { Producto } from '@/lib/products';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';

interface HomeContentProps {
  productos: Producto[];
}

export default function HomeContent({ productos }: HomeContentProps) {
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
