'use client';

import { useEffect, useState } from 'react';
import { mono } from '@/lib/fonts';
import { PRODUCTOS, SUBCATEGORIAS, type Categoria } from '@/lib/products';
import Reveal from './Reveal';
import ProductCard from './ProductCard';

interface CatalogProps {
  categoria: Categoria;
  subcategoriaInicial?: string;
  onChangeCategoria: (categoria: Categoria) => void;
}

const TODOS = 'todos';

export default function Catalog({ categoria, subcategoriaInicial, onChangeCategoria }: CatalogProps) {
  const [subcategoria, setSubcategoria] = useState<string>(TODOS);

  useEffect(() => {
    setSubcategoria(subcategoriaInicial ?? TODOS);
  }, [categoria, subcategoriaInicial]);
  const subcategorias = SUBCATEGORIAS[categoria];

  const productos = PRODUCTOS.filter(
    (p) => p.categoria === categoria && (subcategoria === TODOS || p.subcategoria === subcategoria),
  );

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('catalogScrollY');
    if (savedScrollY) {
      sessionStorage.removeItem('catalogScrollY');
      requestAnimationFrame(() => window.scrollTo(0, Number(savedScrollY)));
    }
  }, []);

  const guardarScroll = () => {
    sessionStorage.setItem('catalogScrollY', String(window.scrollY));
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14">
      <Reveal>
        <div className="mb-6 flex flex-col gap-4 border-b border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
          <nav role="tablist" aria-label="Categoría de catálogo" className="flex w-fit border border-black text-sm">
            <button
              role="tab"
              aria-selected={categoria === 'indumentaria'}
              onClick={() => onChangeCategoria('indumentaria')}
              className={`${mono.className} px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                categoria === 'indumentaria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              Indumentaria
            </button>
            <button
              role="tab"
              aria-selected={categoria === 'tecnologia'}
              onClick={() => onChangeCategoria('tecnologia')}
              className={`${mono.className} border-l border-black px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                categoria === 'tecnologia' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              Tecnología
            </button>
          </nav>

          <span className={`${mono.className} text-sm text-black/50`}>{productos.length} productos</span>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por subcategoría">
          <button
            onClick={() => setSubcategoria(TODOS)}
            aria-pressed={subcategoria === TODOS}
            className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              subcategoria === TODOS
                ? 'border-black bg-black text-white'
                : 'border-black/30 text-black/60 hover:border-black hover:text-black'
            }`}
          >
            Todos
          </button>
          {subcategorias.map((sub) => (
            <button
              key={sub.value}
              onClick={() => setSubcategoria(sub.value)}
              aria-pressed={subcategoria === sub.value}
              className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                subcategoria === sub.value
                  ? 'border-black bg-black text-white'
                  : 'border-black/30 text-black/60 hover:border-black hover:text-black'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </Reveal>

      {productos.length === 0 ? (
        <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
          No hay productos en esta subcategoría por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto, i) => (
            <Reveal key={producto.id} delay={(i % 3) * 90}>
              <ProductCard producto={producto} subcategoria={subcategoria} onAntesDeNavegar={guardarScroll} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}