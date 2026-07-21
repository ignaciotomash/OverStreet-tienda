import Link from 'next/link';
import { display, body, mono } from '@/lib/fonts';
import { formatearPrecio, type Producto } from '@/lib/products';
import { incrementarVistas } from '@/app/actions/actions';
import Swatch from './Swatch';

interface ProductCardProps {
  producto: Producto;
  subcategoria?: string;
  onAntesDeNavegar?: () => void;
  onEliminar?: (id: string) => void;
  onSeleccionar?: (producto: Producto) => void;
}

export default function ProductCard({ producto, subcategoria, onAntesDeNavegar, onEliminar, onSeleccionar }: ProductCardProps) {
  const agotado = producto.stockUnidades === 0;
  const esAdmin = !!onEliminar || !!onSeleccionar;

  const handleClick = (e: React.MouseEvent) => {
    if (onSeleccionar) {
      e.preventDefault();
      e.stopPropagation();
      onSeleccionar(producto);
    } else {
      onAntesDeNavegar?.();
      incrementarVistas(producto.id).catch(() => {});
    }
  };

  return (
    <div>
      <Link
        href={`/producto/${producto.id}${subcategoria && subcategoria !== 'todos' ? `?subcategoria=${subcategoria}` : ''}${onEliminar ? `${subcategoria && subcategoria !== 'todos' ? '&' : '?'}from=admin` : ''}`}
        onClick={handleClick}
        aria-label={`Ver detalle de ${producto.nombre}`}
        className="tag-card group relative block border border-black bg-[#ECEAE4] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <Swatch seed={producto.id} aspectClassName="aspect-[3/4]" foto={producto.foto} alt={producto.nombre} />

        {!esAdmin && (
          <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 border border-black/20 bg-white/80 px-1.5 py-0.5 backdrop-blur-sm">
            <svg className="h-3 w-3 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`${mono.className} text-[10px] text-black/60`}>{producto.vistas ?? 0}</span>
          </div>
        )}

        {agotado && (
          <div className="stamp absolute -right-5 -top-1 z-10 rotate-[30deg] border-2 border-[#C1272D] bg-[#C1272D]/10 px-3 py-1.5">
            <span className={`${mono.className} text-[11px] font-bold uppercase tracking-wider text-[#C1272D]`}>
              Agotado
            </span>
          </div>
        )}

        {onEliminar && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEliminar(producto.id);
            }}
            className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center border-2 border-[#C1272D] bg-white text-[#C1272D] transition-colors hover:bg-[#C1272D] hover:text-white ${agotado ? 'top-12' : ''}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <div className="p-3 pb-8">
          <h3 className={`${display.className} text-sm leading-tight`}>{producto.nombre}</h3>
          <p className={`${body.className} mt-1 text-xs text-black/60`}>{producto.descripcion}</p>

          <div className="perforada my-2" />

          <div className="flex items-end justify-between">
            <span className={`${mono.className} text-base font-bold`}>{formatearPrecio(producto.precio)}</span>
          </div>

          {producto.categoria === 'indumentaria' && producto.talles && (
            <div className="mt-2 flex flex-wrap gap-1">
              {producto.talles.map((t) => (
                <span
                  key={t.talle}
                  className={`${mono.className} flex h-5 min-w-5 items-center justify-center border px-1 text-[10px] ${
                    t.disponible ? 'border-black text-black' : 'border-black/20 text-black/25 line-through'
                  }`}
                >
                  {t.talle}
                </span>
              ))}
            </div>
          )}
        </div>

        {!esAdmin && (
          <span className={`${mono.className} absolute bottom-2 right-2.5 text-xs text-black`}>
            {producto.stockUnidades ?? 0} en stock
          </span>
        )}
      </Link>
    </div>
  );
}
