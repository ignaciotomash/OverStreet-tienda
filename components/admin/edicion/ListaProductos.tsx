'use client';

import { mono } from '@/lib/fonts';
import { type Categoria, type Producto, type SubcategoriaOpcion } from '@/lib/products';
import ProductCard from '../../cliente/ProductCard';
import Reveal from '../../cliente/Reveal';

const TODOS = 'todos';

interface ListaProductosProps {
  cargando: boolean;
  categoria: Categoria;
  subcategoria: string;
  busqueda: string;
  productosFiltrados: Producto[];
  subcategorias: SubcategoriaOpcion[];
  mensaje: { tipo: 'exito' | 'error'; texto: string } | null;
  visible: boolean;
  onCategoriaChange: (cat: Categoria) => void;
  onSubcategoriaChange: (sub: string) => void;
  onBusquedaChange: (q: string) => void;
  onSeleccionar: (producto: Producto) => void;
}

export default function ListaProductos({
  cargando,
  categoria,
  subcategoria,
  busqueda,
  productosFiltrados,
  subcategorias,
  mensaje,
  visible,
  onCategoriaChange,
  onSubcategoriaChange,
  onBusquedaChange,
  onSeleccionar,
}: ListaProductosProps) {
  return (
    <div>
      {cargando ? (
        <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
          Cargando productos...
        </p>
      ) : (
        <>
          <Reveal>
            <div className="mb-6 flex flex-col items-center gap-4 border-b border-black pb-4 sm:flex-row sm:items-end sm:justify-between">
              <nav role="tablist" aria-label="Categoría" className="flex w-fit border border-black text-sm">
                <button
                  role="tab"
                  aria-selected={categoria === 'indumentaria'}
                  onClick={() => onCategoriaChange('indumentaria')}
                  className={`${mono.className} px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                    categoria === 'indumentaria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                  }`}
                >
                  Indumentaria
                </button>
                <button
                  role="tab"
                  aria-selected={categoria === 'tecnologia'}
                  onClick={() => onCategoriaChange('tecnologia')}
                  className={`${mono.className} border-l border-black px-4 py-2 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:text-sm ${
                    categoria === 'tecnologia' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                  }`}
                >
                  Tecnología
                </button>
                <button
                  role="tab"
                  aria-selected={categoria === 'perfumeria'}
                  onClick={() => onCategoriaChange('perfumeria')}
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
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start" role="group" aria-label="Filtrar por subcategoría">
              <button
                onClick={() => onSubcategoriaChange(TODOS)}
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
                  onClick={() => onSubcategoriaChange(sub.value)}
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

          <Reveal delay={60}>
            <div className="mb-8 relative">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                placeholder="Buscar por nombre..."
                className={`${mono.className} w-full border border-black/30 bg-white py-2.5 pl-10 pr-4 text-xs uppercase tracking-wide text-black placeholder:text-black/40 focus:border-black focus:outline-none`}
              />
            </div>
          </Reveal>

          {productosFiltrados.length === 0 ? (
            <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
              No hay productos en esta subcategoría por ahora.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {productosFiltrados.map((producto, i) => (
                <Reveal key={producto.id} delay={(i % 3) * 90}>
                  <ProductCard
                    producto={producto}
                    subcategoria={subcategoria}
                    onSeleccionar={onSeleccionar}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}

      {mensaje && (
        <div
          className={`${mono.className} fixed right-5 top-24 z-50 border px-4 py-3 text-xs uppercase tracking-wider shadow-lg transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          } ${
            mensaje.tipo === 'exito'
              ? 'border-green-600/30 bg-green-600/10 text-green-700'
              : 'border-[#C1272D]/30 bg-[#C1272D]/10 text-[#C1272D]'
          }`}
        >
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
