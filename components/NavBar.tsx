'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import { display, mono } from '@/lib/fonts';
import { useCart } from '@/lib/cart-context';
import SlideCart from './SlideCart';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Nosotros', href: '#' },
  { label: 'Contacto', href: '#' },
];

export default function NavBar() {
  const { totalItems } = useCart();
  const [cartAbierto, setCartAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [navAbierto, setNavAbierto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMenuAbierto(false);
        setNavAbierto(false);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto || navAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto, navAbierto]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-black/10 bg-[#EBE9E6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`${display.className} cursor-pointer text-2xl tracking-tight sm:text-3xl`}
          >
            OVERSTREET
          </Link>

          {/* ── Links de navegación (solo desktop) ── */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={link.href === '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
                className={`${mono.className} text-[11px] uppercase tracking-[0.15em] text-black/50 transition-colors hover:text-black`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Iconos de acción + Auth ── */}
          <div className="flex items-center gap-2">

            {/* Auth: desktop */}
            <div className="hidden items-center md:flex">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    className={`${mono.className} flex h-9 w-9 items-center justify-center text-black/50 transition-colors hover:text-black`}
                    aria-label="Iniciar sesión"
                  >
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

            {/* User icon (mobile, signed-out) — abre auth dropdown */}
            <Show when="signed-out">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className={`${mono.className} relative z-50 flex h-9 w-9 items-center justify-center md:hidden`}
                aria-label="Iniciar sesión"
              >
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
            </Show>

            {/* Mobile: UserButton when signed in */}
            <div className="md:hidden">
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartAbierto(true)}
              className={`${mono.className} relative flex h-10 w-10 items-center justify-center text-black/50 transition-colors hover:text-black`}
              aria-label="Carrito"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger (solo mobile) — abre panel nav izquierdo */}
            <button
              onClick={() => setNavAbierto(!navAbierto)}
              className={`${mono.className} relative z-50 flex h-9 w-9 items-center justify-center md:hidden`}
              aria-label="Menú de navegación"
            >
              {navAbierto ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile auth dropdown (derecha) ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuAbierto(false)}
      >
        <div
          className={`${mono.className} absolute right-5 top-16 flex w-fit flex-col gap-2 border border-black bg-white p-3 transition-all duration-300 ${
            menuAbierto ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                onClick={() => setMenuAbierto(false)}
                className="w-full border border-black/30 px-6 py-2.5 text-[11px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Iniciar sesión
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                onClick={() => setMenuAbierto(false)}
                className="w-full border border-black bg-black px-6 py-2.5 text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                Registrarse
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>

      {/* ── Mobile nav panel (izquierda) ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          navAbierto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setNavAbierto(false)}
      >
        <nav
          className={`${mono.className} flex h-full w-64 flex-col bg-white p-6 pt-20 transition-transform duration-300 ease-in-out ${
            navAbierto ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => {
                setNavAbierto(false);
                if (link.href === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border-b border-black/10 py-3 text-[11px] uppercase tracking-[0.15em] text-black/50 transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-auto flex flex-col gap-2 border-t border-black/10 pt-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  onClick={() => setNavAbierto(false)}
                  className="w-full border border-black/30 px-6 py-2.5 text-[11px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Iniciar sesión
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => setNavAbierto(false)}
                  className="w-full border border-black bg-black px-6 py-2.5 text-[11px] uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                >
                  Registrarse
                </button>
              </SignUpButton>
            </Show>
          </div>
        </nav>
      </div>

      <SlideCart abierto={cartAbierto} cerrar={() => setCartAbierto(false)} />
    </>
  );
}
