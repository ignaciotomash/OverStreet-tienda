'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import { display, mono } from '@/lib/fonts';
import { useCart } from '@/lib/cart-context';
import SlideCart from './SlideCart';

export default function NavBar() {
  const { totalItems } = useCart();
  const [cartAbierto, setCartAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setMenuAbierto(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-6">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`${display.className} cursor-pointer text-lg tracking-tight sm:text-xl`}
          >
            OVERSTREET
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop: auth buttons inline */}
            <div className="hidden items-center gap-3 md:flex">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className={`${mono.className} border border-black/30 px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white`}>
                    Ingresar
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className={`${mono.className} border border-black bg-black px-2.5 py-1 text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black`}>
                    Registrarse
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

            {/* Mobile: UserButton when signed in */}
            <div className="md:hidden">
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

            {/* Cart — always visible */}
            <button
              onClick={() => setCartAbierto(true)}
              className={`${mono.className} relative flex h-9 w-9 shrink-0 items-center justify-center overflow-visible rounded-full border border-black transition-colors hover:bg-gray-300 hover:text-black`}
            >
              <Image src="/carrito.png" alt="Carrito" width={18} height={18} className="h-4.5 w-4.5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <Show when="signed-out">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className={`${mono.className} relative z-50 flex h-9 w-9 shrink-0 items-center justify-center md:hidden`}
                aria-label="Menu"
              >
                <Image src="/persona.png" alt="Usuario" width={20} height={20} className="h-5 w-5" />
              </button>
            </Show>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuAbierto(false)}
      >
        <div
          className={`${mono.className} absolute right-4 top-16 flex w-fit flex-col gap-2 border border-black bg-white p-3 transition-all duration-300 ${
            menuAbierto ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                onClick={() => setMenuAbierto(false)}
                className="w-full border border-black/30 px-6 py-2.5 text-center text-[11px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Ingresar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                onClick={() => setMenuAbierto(false)}
                className="w-full border border-black bg-black px-6 py-2.5 text-center text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                Registrarse
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>

      <SlideCart abierto={cartAbierto} cerrar={() => setCartAbierto(false)} />
    </>
  );
}
