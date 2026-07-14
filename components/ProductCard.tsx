import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { display, body, mono } from '@/lib/fonts';
import { formatearPrecio, type Producto } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import Swatch from './Swatch';

interface ProductCardProps {
  producto: Producto;
  subcategoria?: string;
  onAntesDeNavegar?: () => void;
}

export default function ProductCard({ producto, subcategoria, onAntesDeNavegar }: ProductCardProps) {
  const { push } = useRouter();
  const { isSignedIn } = useAuth();
  const { addItem, removeItem, isInCart } = useCart();

  const agotado =
    producto.categoria === 'tecnologia'
      ? producto.stockUnidades === 0
      : producto.talles?.every((t) => !t.disponible);

  const toggleCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) {
      push('/sign-in');
      return;
    }
    if (isInCart(producto.id)) {
      removeItem(producto.id);
    } else {
      addItem(producto);
    }
  };

  return (
    <Link
      href={`/producto/${producto.id}${subcategoria && subcategoria !== 'todos' ? `?subcategoria=${subcategoria}` : ''}`}
      onClick={onAntesDeNavegar}
      aria-label={`Ver detalle de ${producto.nombre}`}
      className="tag-card group relative block border border-black bg-[#ECEAE4] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {/* ojal de la etiqueta */}
      <div className="absolute left-2.5 top-2.5 z-10 h-3 w-3 rounded-full border border-black bg-[#ECEAE4]" />

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

      {/* código de barras decorativo */}
      <div className="flex items-center gap-2 border-t border-black/10 px-3 py-1.5">
        <button
          onClick={toggleCarrito}
          className={`${mono.className} z-20 whitespace-nowrap border px-2 py-0.5 text-[9px] uppercase tracking-wider transition-colors hover:bg-black hover:text-white ${
            isInCart(producto.id)
              ? 'border-black bg-black text-white'
              : 'border-black/30 text-black/60 hover:border-black hover:text-black'
          }`}
        >
          {isInCart(producto.id) ? '✓ En carrito' : '+ Carrito'}
        </button>
        <div className="flex h-4 flex-1 items-end gap-[1.5px] opacity-40">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="bg-black" style={{ width: 1, height: (i * 7) % 5 === 0 ? '100%' : '60%' }} />
          ))}
        </div>
      </div>
    </Link>
  );
}