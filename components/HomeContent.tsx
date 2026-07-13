'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { display, body, mono } from '@/lib/fonts';
import type { Categoria } from '@/lib/products';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Catalog from '@/components/Catalog';
import Footer from '@/components/Footer';

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaInicial: Categoria = searchParams.get('categoria') === 'tecnologia' ? 'tecnologia' : 'indumentaria';
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);

  const cambiarCategoria = (nueva: Categoria) => {
    setCategoria(nueva);
    router.replace(`/?categoria=${nueva}`, { scroll: false });
  };

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar categoria={categoria} onChange={cambiarCategoria} />
      <Hero categoria={categoria} />
      <Marquee />
      <Catalog key={categoria} categoria={categoria} />
      <Marquee reverse />
      <Footer />
    </div>
  );
}