'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { display, mono } from '@/lib/fonts';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import { useCart } from '@/lib/cart-context';
import SlideCart from './SlideCart';

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

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton>
                <button className={`${mono.className} border border-black/30 px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white`}>
                  Ingresar
                </button>
              </SignInButton>
              <SignUpButton>
                <button className={`${mono.className} border border-black bg-black px-2.5 py-1 text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black`}>
                  Registrarse
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>

            <button
              onClick={() => setCartAbierto(true)}
              className={`${mono.className} relative flex items-center gap-1.5 border border-black px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors hover:bg-black hover:text-white`}
            >
              <Image src="/carrito.png" alt="Carrito" width={14} height={14} className="h-3.5 w-3.5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SlideCart abierto={cartAbierto} cerrar={() => setCartAbierto(false)} />
    </>
  );
}
