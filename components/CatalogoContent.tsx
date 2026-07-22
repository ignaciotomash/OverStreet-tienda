'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { display, body, mono } from '@/lib/fonts';
import type { Categoria, Producto } from '@/lib/products';
import NavBar from '@/components/NavBar';
import Marquee from '@/components/Marquee';
import Catalog from '@/components/Catalog';
import Footer from '@/components/Footer';

interface CatalogoContentProps {
  productos: Producto[];
}

export default function CatalogoContent({ productos }: CatalogoContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('categoria');
  const categoriaInicial: Categoria =
    catParam === 'tecnologia' || catParam === 'perfumeria' ? catParam : 'indumentaria';
  const subcategoriaInicial = searchParams.get('subcategoria') ?? undefined;
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);

  const cambiarCategoria = (nueva: Categoria) => {
    setCategoria(nueva);
    router.replace(`/catalogo?categoria=${nueva}`, { scroll: false });
    sessionStorage.removeItem('catalogScrollY');
  };

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar />
      <div className="pt-16">
        <Catalog key={categoria} categoria={categoria} subcategoriaInicial={subcategoriaInicial} onChangeCategoria={cambiarCategoria} productos={productos} />
        <Marquee reverse />
        <Footer />
      </div>
    </div>
  );
}
