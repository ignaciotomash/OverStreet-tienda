'use client';

import { mono } from '@/lib/fonts';
import { formatearPrecio } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

interface SlideCartProps {
  abierto: boolean;
  cerrar: () => void;
}

export default function SlideCart({ abierto, cerrar }: SlideCartProps) {
  const { items, removeItem, clearCart } = useCart();

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={cerrar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-96 max-w-[90vw] border-l border-black bg-white shadow-xl transition-transform duration-300 ${
          abierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black px-4 py-4">
            <span className={`${mono.className} text-xs uppercase tracking-widest`}>Tu carrito</span>
            <button
              onClick={cerrar}
              className={`${mono.className} border border-black px-2 py-1 text-xs transition-colors hover:bg-black hover:text-white`}
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <p className={`${mono.className} text-center text-xs text-black/50`}>
                No hay productos en tu carrito.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-3">
                  {items.map((p) => (
                    <li key={p.id} className="flex items-start justify-between gap-3 border-b border-black/10 pb-3">
                      <div className="min-w-0 flex-1">
                        <p className={`${mono.className} text-xs font-bold uppercase`}>{p.nombre}</p>
                        <p className={`${mono.className} mt-0.5 text-[11px] text-black/50`}>{p.descripcion}</p>
                        <p className={`${mono.className} mt-1 text-xs`}>{formatearPrecio(p.precio)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(p.id)}
                        className={`${mono.className} mt-0.5 border border-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white`}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-black px-4 py-4">
                <button
                  onClick={clearCart}
                  className={`${mono.className} w-full border border-black/30 px-4 py-2 text-xs uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white`}
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
