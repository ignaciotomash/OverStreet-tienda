'use client';

import { useState } from 'react';
import Image from 'next/image';
import { display, mono } from '@/lib/fonts';
import { useCart } from '@/lib/cart-context';
import SlideCart from './SlideCart';
import Link from 'next/link';

export default function NavBar() {
  const { totalItems } = useCart();
  const [cartAbierto, setCartAbierto] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`${display.className} cursor-pointer text-lg tracking-tight sm:text-xl`}
          >
            OVERSTREET
          </Link>

          <button
            onClick={() => setCartAbierto(true)}
            className={`${mono.className} relative flex items-center gap-1.5 border border-black px-10 py-2.5 text-xs uppercase tracking-wider transition-colors hover:bg-gray-300 hover:text-white`}
          >
            <Image src="/carrito.png" alt="Carrito" width={16} height={16} className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <SlideCart abierto={cartAbierto} cerrar={() => setCartAbierto(false)} />
    </>
  );
}
