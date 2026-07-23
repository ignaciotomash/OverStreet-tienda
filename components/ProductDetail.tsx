'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { display, body, mono } from '@/lib/fonts';
import { formatearPrecio, getSubcategoriaLabel, COLORES_MOCKUP, type Producto } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import NavBar from './NavBar';
import Footer from './Footer';
import Reveal from './Reveal';
import Swatch from './Swatch';

const WHATSAPP_NUMERO = '542976232709';

interface ProductDetailProps {
  producto: Producto;
}

export default function ProductDetail({ producto }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const subcategoria = searchParams.get('subcategoria');
  const fromAdmin = searchParams.get('from') === 'admin';
  const { addItem, removeItem, isInCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const imagenes = producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : (producto.foto ? [producto.foto] : []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const delta = touchCurrentX.current - touchStartX.current;
    setDragOffset(delta);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    const delta = touchCurrentX.current - touchStartX.current;
    const umbral = 50;

    if (delta < -umbral && imagenActiva < imagenes.length - 1) {
      setImagenActiva((prev) => prev + 1);
    } else if (delta > umbral && imagenActiva > 0) {
      setImagenActiva((prev) => prev - 1);
    }
    setDragOffset(0);
  }, [imagenActiva, imagenes.length]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    touchStartX.current = e.clientX;
    touchCurrentX.current = e.clientX;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    touchCurrentX.current = e.clientX;
    const delta = touchCurrentX.current - touchStartX.current;
    setDragOffset(delta);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = touchCurrentX.current - touchStartX.current;
    const umbral = 50;

    if (delta < -umbral && imagenActiva < imagenes.length - 1) {
      setImagenActiva((prev) => prev + 1);
    } else if (delta > umbral && imagenActiva > 0) {
      setImagenActiva((prev) => prev - 1);
    }
    setDragOffset(0);
  }, [isDragging, imagenActiva, imagenes.length]);

  useEffect(() => {
    setCantidad(1);
  }, [talleSeleccionado]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const agotado = producto.stockUnidades === 0;

  const talleActual = talleSeleccionado
    ? producto.talles?.find((t) => t.talle === talleSeleccionado)
    : undefined;

  const stockMaximo = talleActual?.stock ?? producto.stockUnidades ?? 1;

  const colores = producto.colores ?? (producto.categoria === 'indumentaria' ? COLORES_MOCKUP : undefined);

  const enCarrito = isInCart(producto.id, talleSeleccionado ?? undefined, colorSeleccionado ?? undefined);

  const construirMensajeWhatsApp = () => {
  let mensaje = `¡Buenas! Me interesa el siguiente producto y quisiera realizar una consulta o concretar la compra.

*Producto:*
  ${producto.nombre}`;

    if (talleSeleccionado) {
      mensaje += `

*Talle:*
  ${talleSeleccionado}`;
    }

    if (colorSeleccionado) {
      mensaje += `

*Color:*
  ${colorSeleccionado}`;
    }

    mensaje += `

*Link de la publicación:*
${currentUrl}

Quedo atento. ¡Muchas gracias!`;

    return encodeURIComponent(mensaje);
  };

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar />

      <section className="mx-auto max-w-5xl px-5 pb-20 pt-24">
        <Reveal>
          <Link
            href={fromAdmin ? '/admin?tab=eliminar' : `/catalogo?categoria=${producto.categoria}${subcategoria ? `&subcategoria=${subcategoria}` : ''}`}
            className={`${mono.className} inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            {fromAdmin ? '← Volver al panel' : '← Volver al catálogo'}
          </Link>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="relative border border-black bg-[#ECEAE4]">
              {agotado && (
                <div className="absolute inset-0 z-20 flex items-start justify-center overflow-hidden pt-60 pointer-events-none">
                  <div className={`${mono.className} w-[200%] -rotate-[35deg] bg-[#C1272D]/70 py-3 text-center text-sm font-bold uppercase tracking-widest text-white`}>
                    Agotado
                  </div>
                </div>
              )}

              {imagenes.length > 0 ? (
                <div
                  className="overflow-hidden aspect-[3/4] touch-pan-y select-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div
                    className={`flex h-full ${isDragging ? '' : 'transition-transform duration-500 ease-in-out'}`}
                    style={{ transform: `translateX(calc(-${imagenActiva * 100}% + ${dragOffset}px))` }}
                  >
                    {imagenes.map((url, i) => (
                      <div key={i} className="relative h-full w-full flex-shrink-0">
                        <img
                          src={url}
                          alt={`${producto.nombre} foto ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Swatch seed={producto.id} aspectClassName="aspect-[3/4]" />
              )}

              {imagenes.length > 1 && (
                <>
                  {imagenActiva > 0 && (
                    <button
                      type="button"
                      onClick={() => setImagenActiva((prev) => prev - 1)}
                      className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/70 text-black backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  {imagenActiva < imagenes.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setImagenActiva((prev) => prev + 1)}
                      className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/70 text-black backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                  <span className={`${mono.className} absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] text-white`}>
                    {imagenActiva + 1} / {imagenes.length}
                  </span>
                </>
              )}
            </div>
          </Reveal>

          <Reveal direction="right" delay={80}>
            <span className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
              {producto.categoria === 'indumentaria' ? 'Indumentaria' : producto.categoria === 'tecnologia' ? 'Tecnología' : 'Perfumería'} ·{' '}
              {getSubcategoriaLabel(producto.categoria, producto.subcategoria)}
            </span>

            <h1 className={`${display.className} mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-tight`}>
              {producto.nombre}
            </h1>

            <span className={`${mono.className} mt-4 block text-3xl font-bold`}>
              {formatearPrecio(producto.precio)}
            </span>

            <div className="perforada my-5" />

            <p className={`${body.className} text-base leading-relaxed whitespace-pre-line text-black/70`}>
              {producto.descripcionLarga}
            </p>

            {producto.categoria === 'indumentaria' && producto.talles && (
              <div className="mt-6">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Talle
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {producto.talles.map((t) => (
                    <div key={t.talle} className="flex flex-col items-center gap-1">
                      <button
                        disabled={!t.disponible}
                        onClick={() => setTalleSeleccionado(t.talle)}
                        className={`${mono.className} flex h-9 min-w-9 items-center justify-center border px-2 text-sm transition-colors ${
                          !t.disponible
                            ? 'cursor-not-allowed border-black/20 text-black/25 line-through'
                            : talleSeleccionado === t.talle
                              ? 'border-black bg-black text-white'
                              : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {t.talle}
                      </button>
                      {t.stock != null && (
                        <span className={`${mono.className} text-[10px] text-black/40`}>
                          {t.stock} disp.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {colores && (
              <div className="mt-4">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Color
                </span>
                <div className="mt-2 flex gap-2">
                  {colores.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorSeleccionado(color)}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${
                        colorSeleccionado === color
                          ? 'scale-110 border-black'
                          : 'border-black/20 hover:border-black/50'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-black pt-5">
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                Detalles
              </span>
              <ul className="mt-3 space-y-2">
                {producto.detalles.map((detalle) => (
                  <li key={detalle} className={`${body.className} flex items-start gap-2 text-sm text-black/70`}>
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-black" />
                    {detalle}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                Stock
              </span>
              <p className={`${mono.className} mt-1 text-sm`}>
                {talleActual?.stock != null
                  ? talleActual.stock === 0
                    ? 'Sin stock para este talle'
                    : `${talleActual.stock} unidades disponibles para ${talleSeleccionado}`
                  : agotado
                    ? 'Sin stock por el momento'
                    : `${producto.stockUnidades} unidades disponibles`}
              </p>
            </div>

            {!agotado && (
              <div className="mt-4 text-center">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Cantidad (máx. {stockMaximo})
                </span>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className={`${mono.className} flex h-9 w-9 items-center justify-center rounded-full border border-black text-lg transition-colors hover:bg-black hover:text-white`}
                  >
                    −
                  </button>
                  <span className={`${mono.className} min-w-[2ch] text-center text-lg font-bold`}>
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad((c) => Math.min(stockMaximo, c + 1))}
                    className={`${mono.className} flex h-9 w-9 items-center justify-center rounded-full border border-black text-lg transition-colors hover:bg-black hover:text-white`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div id="agregar-al-carrito" className="mt-3 flex justify-center">
              {enCarrito ? (
                <button
                  onClick={() => removeItem(producto.id, talleSeleccionado ?? undefined, colorSeleccionado ?? undefined)}
                  className={`${mono.className} w-full border border-[#C1272D]/30 bg-[#C1272D]/10 px-5 py-3 text-sm uppercase tracking-wide text-[#C1272D] transition-colors hover:border-[#C1272D] hover:bg-[#C1272D] hover:text-white`}
                >
                  Quitar del carrito
                </button>
              ) : (
                <button
                  onClick={() => {
                    addItem(producto, cantidad, talleSeleccionado ?? undefined, colorSeleccionado ?? undefined);
                  }}
                  disabled={agotado}
                  className={`${mono.className} w-full border border-black bg-black px-5 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white`}
                >
                  Agregar al carrito
                </button>
              )}
            </div>

            <div className="mt-3 flex justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}?text=${construirMensajeWhatsApp()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${mono.className} flex w-full items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-5 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:border-[#1ebe5d] hover:bg-[#1ebe5d]`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
