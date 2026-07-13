'use client';

import { useState } from 'react';
import { display, mono } from '@/lib/fonts';
import { PRODUCTOS, SUBCATEGORIAS, type Categoria } from '@/lib/products';
import Reveal from './Reveal';
import ProductCard from './ProductCard';

interface CatalogProps {
  categoria: Categoria;
}

const TODOS = 'todos';

export default function Catalog({ categoria }: CatalogProps) {
  const [subcategoria, setSubcategoria] = useState<string>(TODOS);
  const subcategorias = SUBCATEGORIAS[categoria];

  const productos = PRODUCTOS.filter(
    (p) => p.categoria === categoria && (subcategoria === TODOS || p.subcategoria === subcategoria),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-black pb-3">
          <h2 className={`${display.className} text-2xl`}>
            {categoria === 'indumentaria' ? 'Indumentaria' : 'Tecnología'}
          </h2>
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
              <ProductCard producto={producto} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}