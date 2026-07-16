'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { display, body, mono } from '@/lib/fonts';
import { formatearPrecio, getSubcategoriaLabel, type Producto } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useAuthModal } from '@/lib/auth-modal-context';
import NavBar from './NavBar';
import Footer from './Footer';
import Reveal from './Reveal';
import Swatch from './Swatch';

interface ProductDetailProps {
  producto: Producto;
}

export default function ProductDetail({ producto }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useAuthModal();
  const subcategoria = searchParams.get('subcategoria');
  const { addItem, removeItem, isInCart, getQuantity, updateQuantity } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const agotado =
    producto.categoria === 'tecnologia'
      ? producto.stockUnidades === 0
      : producto.talles?.every((t) => !t.disponible);

  const stockMaximo = producto.categoria === 'tecnologia'
    ? (producto.stockUnidades ?? 1)
    : (producto.talles?.filter((t) => t.disponible).length ?? 1);

  const enCarrito = isInCart(producto.id);
  const cantidadEnCarrito = getQuantity(producto.id);

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar />

      <section className="mx-auto max-w-5xl px-5 pb-20 pt-24">
        <Reveal>
          <Link
            href={`/?categoria=${producto.categoria}${subcategoria ? `&subcategoria=${subcategoria}` : ''}`}
            className={`${mono.className} inline-flex items-center gap-2 text-sm text-black/60 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            ← Volver al catálogo
          </Link>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="relative max-h-[65vh] border border-black bg-[#ECEAE4]">
              <div className="absolute left-4 top-4 z-10 h-4 w-4 rounded-full border border-black bg-[#ECEAE4]" />
              {agotado && (
                <div className="absolute right-4 top-4 z-10 rotate-[-8deg] border-2 border-[#C1272D] px-2 py-0.5">
                  <span className={`${mono.className} text-xs font-bold uppercase tracking-wider text-[#C1272D]`}>
                    Agotado
                  </span>
                </div>
              )}
              <Swatch seed={producto.id} aspectClassName="aspect-[4/3]" foto={producto.foto} alt={producto.nombre} />
            </div>
          </Reveal>

          <Reveal direction="right" delay={80}>
            <span className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
              {producto.categoria === 'indumentaria' ? 'Indumentaria' : 'Tecnología'} ·{' '}
              {getSubcategoriaLabel(producto.categoria, producto.subcategoria)} · Cód. {producto.id}
            </span>

            <h1 className={`${display.className} mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-tight`}>
              {producto.nombre}
            </h1>

            <span className={`${mono.className} mt-4 block text-3xl font-bold`}>
              {formatearPrecio(producto.precio)}
            </span>

            <div className="perforada my-5" />

            <p className={`${body.className} text-base leading-relaxed text-black/70`}>
              {producto.descripcionLarga}
            </p>

            {producto.categoria === 'indumentaria' && producto.talles && (
              <div className="mt-6">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Talles disponibles
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {producto.talles.map((t) => (
                    <span
                      key={t.talle}
                      className={`${mono.className} flex h-9 min-w-9 items-center justify-center border px-2 text-sm ${
                        t.disponible ? 'border-black text-black' : 'border-black/20 text-black/25 line-through'
                      }`}
                    >
                      {t.talle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {producto.categoria === 'tecnologia' && (
              <div className="mt-6">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Disponibilidad
                </span>
                <p className={`${mono.className} mt-2 text-sm`}>
                  {agotado ? 'Sin stock por el momento' : `${producto.stockUnidades} unidades disponibles`}
                </p>
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

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={`${mono.className} mt-8 inline-block border border-black px-5 py-3 text-sm uppercase tracking-wide transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
            >
              Consultar por Instagram
            </a>

            {!agotado && (
              <div className="mt-4">
                <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
                  Cantidad
                </span>
                <div className="mt-2 flex items-center gap-3">
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
                  <span className={`${mono.className} text-xs text-black/40`}>
                    (máx. {stockMaximo})
                  </span>
                </div>
              </div>
            )}

            <div className="mt-3">
              {enCarrito ? (
                <div className="space-y-2">
                  <div className={`${mono.className} flex items-center justify-center gap-2 border border-black/20 py-2 text-xs text-black/50`}>
                    <span>En carrito: {cantidadEnCarrito}</span>
                  </div>
                  <button
                    onClick={() => removeItem(producto.id)}
                    className={`${mono.className} w-full border border-[#C1272D]/30 px-5 py-3 text-sm uppercase tracking-wide text-[#C1272D] transition-colors hover:border-[#C1272D] hover:bg-[#C1272D] hover:text-white`}
                  >
                    Quitar del carrito
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isSignedIn) { openSignIn(); return; }
                    addItem(producto!, cantidad);
                  }}
                  className={`${mono.className} w-full border border-black bg-black px-5 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black`}
                >
                  Agregar al carrito
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
