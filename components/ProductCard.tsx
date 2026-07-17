import Link from 'next/link';
import { display, body, mono } from '@/lib/fonts';
import { formatearPrecio, type Producto } from '@/lib/products';
import Swatch from './Swatch';

interface ProductCardProps {
  producto: Producto;
  subcategoria?: string;
  onAntesDeNavegar?: () => void;
}

export default function ProductCard({ producto, subcategoria, onAntesDeNavegar }: ProductCardProps) {
  const agotado =
    producto.categoria === 'tecnologia'
      ? producto.stockUnidades === 0
      : producto.talles?.every((t) => !t.disponible);

  return (
    <Link
      href={`/producto/${producto.id}${subcategoria && subcategoria !== 'todos' ? `?subcategoria=${subcategoria}` : ''}`}
      onClick={onAntesDeNavegar}
      aria-label={`Ver detalle de ${producto.nombre}`}
      className="tag-card group relative block border border-black bg-[#ECEAE4] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Swatch seed={producto.id} aspectClassName="aspect-[3/4]" foto={producto.foto} alt={producto.nombre} />

      {agotado && (
        <div className="stamp absolute right-2.5 top-2.5 z-10 rotate-[-8deg] border-2 border-[#C1272D] px-1.5 py-0.5">
          <span className={`${mono.className} text-[10px] font-bold uppercase tracking-wider text-[#C1272D]`}>
            Agotado
          </span>
        </div>
      )}

      <div className="p-3">
        <h3 className={`${display.className} text-sm leading-tight`}>{producto.nombre}</h3>
        <p className={`${body.className} mt-1 text-xs text-black/60`}>{producto.descripcion}</p>

        <div className="perforada my-2" />

        <div className="flex items-end justify-between">
          <span className={`${mono.className} text-base font-bold`}>{formatearPrecio(producto.precio)}</span>
          {producto.categoria === 'tecnologia' && (
            <span className={`${mono.className} text-[11px] text-black/60`}>
              STOCK {producto.stockUnidades ?? 0}
            </span>
          )}
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

    </Link>
  );
}