'use client';

import { useEffect, useState } from 'react';
import { mono } from '@/lib/fonts';
import { getSubcategoriasCompletas, type Categoria, type Producto } from '@/lib/products';
import Reveal from './Reveal';
import ProductCard from './ProductCard';

interface CatalogProps {
  categoria: Categoria;
  subcategoriaInicial?: string;
  onChangeCategoria: (categoria: Categoria) => void;
  productos: Producto[];
}

const TODOS = 'todos';

type Orden = 'recientes' | 'precio-asc' | 'precio-desc' | 'vistas-asc' | 'vistas-desc';

export default function Catalog({ categoria, subcategoriaInicial, onChangeCategoria, productos }: CatalogProps) {
  const [subcategoria, setSubcategoria] = useState<string>(TODOS);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<Orden>('recientes');

  useEffect(() => {
    setSubcategoria(subcategoriaInicial ?? TODOS);
    setBusqueda('');
  }, [categoria, subcategoriaInicial]);
  const subcategorias = getSubcategoriasCompletas(categoria, productos);

  const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const busquedaNorm = normalizar(busqueda);
  const productosFiltrados = productos.filter(
    (p) =>
      p.categoria === categoria &&
      (subcategoria === TODOS || p.subcategoria === subcategoria) &&
      (busquedaNorm === '' || normalizar(p.nombre).includes(busquedaNorm)),
  );

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    const aAgotado = a.stockUnidades === 0;
    const bAgotado = b.stockUnidades === 0;
    if (aAgotado !== bAgotado) return aAgotado ? 1 : -1;

    switch (orden) {
      case 'precio-asc': return a.precio - b.precio;
      case 'precio-desc': return b.precio - a.precio;
      case 'vistas-asc': return (a.vistas ?? 0) - (b.vistas ?? 0);
      case 'vistas-desc': return (b.vistas ?? 0) - (a.vistas ?? 0);
      default: return 0;
    }
  });

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
    <section id="catalogo" className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14">
      <Reveal>
        <div className="mb-6 flex flex-col items-center gap-4 border-b border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
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
            <button
              role="tab"
              aria-selected={categoria === 'perfumeria'}
              onClick={() => onChangeCategoria('perfumeria')}
              className={`${mono.className} border-l border-black px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                categoria === 'perfumeria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              Perfumería
            </button>
          </nav>

          <span className={`${mono.className} text-sm text-black/50`}>{productosFiltrados.length} productos</span>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="group" aria-label="Filtrar por subcategoría">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
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
            {subcategorias.filter((sub) => sub.value !== 'todos').map((sub) => (
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
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className={`${mono.className} border border-black/30 bg-white px-3 py-2 text-xs uppercase tracking-wide text-black focus:border-black focus:outline-none`}
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="vistas-asc">Vistas: menor a mayor</option>
            <option value="vistas-desc">Vistas: mayor a menor</option>
          </select>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mb-6 relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className={`${mono.className} w-full border border-black/30 bg-white py-2.5 pl-10 pr-4 text-xs uppercase tracking-wide text-black placeholder:text-black/40 focus:border-black focus:outline-none`}
          />
        </div>
      </Reveal>

      {productosOrdenados.length === 0 ? (
        <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
          No hay productos en esta subcategoría por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {productosOrdenados.map((producto, i) => (
            <Reveal key={producto.id} delay={(i % 3) * 90}>
              <ProductCard producto={producto} subcategoria={subcategoria} onAntesDeNavegar={guardarScroll} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}