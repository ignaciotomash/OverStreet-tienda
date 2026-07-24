'use client';

import { mono } from '@/lib/fonts';
import { formatearPrecio, colorA_nombre, type Categoria } from '@/lib/products';
import { useCart, cartKey } from '@/lib/cart-context';
import { useAuth, useUser } from '@clerk/nextjs';
import { useAuthModal } from '@/lib/auth-modal-context';
import { crearPedido } from '@/app/actions/actions';

const WHATSAPP_NUMERO = '542976232709';

const CATEGORIA_LABEL: Record<Categoria, string> = {
  indumentaria: 'Indumentaria',
  tecnologia: 'Tecnología',
  perfumeria: 'Perfumería',
};

interface SlideCartProps {
  abierto: boolean;
  cerrar: () => void;
}

export default function SlideCart({ abierto, cerrar }: SlideCartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useAuthModal();

  const getStockMaximo = (item: typeof items[0]) => {
    if (item.talle) {
      const talleData = item.producto.talles?.find((t) => t.talle === item.talle);
      if (talleData?.stock != null) return talleData.stock;
    }
    return item.producto.stockUnidades ?? 1;
  };

  const construirMensajeWhatsApp = () => {
    let mensaje = '¡Buenas! Quiero realizar el siguiente pedido:\n----------------------------------------\nProductos:';

    items.forEach((item, index) => {
      const tieneTalle = item.producto.talles && item.talle;
      const tieneColor = item.producto.colores && item.color;

      mensaje += `\n${index + 1}.\nCategoría: ${CATEGORIA_LABEL[item.producto.categoria]}\nProducto: ${item.producto.nombre}`;

      if (tieneTalle) {
        mensaje += `\nTalle: ${item.talle}`;
      }

      if (tieneColor) {
        mensaje += `\nColor: ${colorA_nombre(item.color!)}`;
      }

      mensaje += `\nCantidad: ${item.cantidad}\n----------------------------------------`;
    });

    mensaje += `\n*Total a pagar:*\n*${formatearPrecio(total)}*\n----------------------------------------\nQuedo atento a la confirmación del pedido para poder realizar el pago.\n¡Muchas gracias!`;

    return encodeURIComponent(mensaje);
  };

  const hayProductos = items.length > 0;

  const handleRealizarPedido = async () => {
    if (!hayProductos) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const pedidoItems = items.map((item) => ({
      producto: {
        id: item.producto.id,
        nombre: item.producto.nombre,
        precio: item.producto.precio,
        categoria: item.producto.categoria,
      },
      cantidad: item.cantidad,
      talle: item.talle,
      color: item.color,
    }));

    await crearPedido({
      userId: user!.id,
      usuarioNombre: [user!.firstName, user!.lastName].filter(Boolean).join(' ') || 'Sin nombre',
      usuarioFoto: user!.imageUrl,
      items: pedidoItems,
      total,
    });

    clearCart();
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${construirMensajeWhatsApp()}`, '_blank');
  };

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
                  onClick={handleRealizarPedido}
                  disabled={!hayProductos}
                  className={`${mono.className} flex w-full items-center justify-center gap-2 border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                    hayProductos
                      ? 'border-[#25D366] bg-[#25D366] text-white hover:border-[#1ebe5d] hover:bg-[#1ebe5d]'
                      : 'pointer-events-none border-black/15 bg-transparent text-black/25'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Realizar pedido
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
