'use client';

import { mono } from '@/lib/fonts';
import { formatearPrecio } from '@/lib/products';
import { useCart, cartKey } from '@/lib/cart-context';

interface SlideCartProps {
  abierto: boolean;
  cerrar: () => void;
}

export default function SlideCart({ abierto, cerrar }: SlideCartProps) {
  const { items, removeItem, clearCart, updateQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

  const getStockMaximo = (item: typeof items[0]) =>
    item.producto.stockUnidades ?? 1;

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
                  {items.map((item) => {
                    const stock = getStockMaximo(item);
                    return (
                      <li key={cartKey(item.producto.id, item.talle, item.color)} className="relative border-b border-black/10 pb-3 pr-16">
                        <p className={`${mono.className} min-w-0 truncate text-xs font-bold uppercase`}>{item.producto.nombre}</p>
                        <button
                          onClick={() => removeItem(item.producto.id, item.talle, item.color)}
                          className={`${mono.className} absolute right-0 top-0 border border-[#C1272D]/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#C1272D] transition-colors hover:border-[#C1272D] hover:bg-[#C1272D] hover:text-white`}
                        >
                          Quitar
                        </button>
                        {(item.talle || item.color) && (
                          <p className={`${mono.className} mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-black/50`}>
                            {item.talle && <span>{item.talle}</span>}
                            {item.talle && item.color && <span>·</span>}
                            {item.color && (
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                          </p>
                        )}
                        <p className={`${mono.className} mt-0.5 text-[11px] text-black/50`}>{item.producto.descripcion}</p>
                        <p className={`${mono.className} mt-1 text-base font-bold`}>
                          {formatearPrecio(item.producto.precio * item.cantidad)}
                        </p>
                        <div className="flex items-center w-fit mt-5 border border-black rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.producto.id, Math.max(1, item.cantidad - 1), item.talle, item.color)}
                            disabled={item.cantidad <= 1}
                            className={`${mono.className} flex h-7 w-7 shrink-0 items-center justify-center border-r border-black text-sm transition-colors ${
                              item.cantidad <= 1
                                ? 'border-black/15 text-black/25'
                                : 'hover:bg-black hover:text-white'
                            }`}
                          >
                            −
                          </button>
                          <span className={`${mono.className} h-7 min-w-[2ch] shrink-0 flex items-center justify-center text-sm font-bold border-r border-black px-2`}>
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.producto.id, Math.min(stock, item.cantidad + 1), item.talle, item.color)}
                            disabled={item.cantidad >= stock}
                            className={`${mono.className} flex h-7 w-7 shrink-0 items-center justify-center text-sm transition-colors ${
                              item.cantidad >= stock
                                ? 'border-black/15 text-black/25'
                                : 'hover:bg-black hover:text-white'
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border-t border-black px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>Total</span>
                  <span className={`${mono.className} text-lg font-bold`}>{formatearPrecio(total)}</span>
                </div>
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
