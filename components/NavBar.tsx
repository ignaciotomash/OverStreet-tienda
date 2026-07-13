'use client';

import { display } from '@/lib/fonts';

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <span className={`${display.className} text-lg tracking-tight sm:text-xl`}>OVERSTREET</span>

        {/* Reservado para el botón de login (Clerk) y, más adelante, favoritos/carrito. */}
        <div />
      </div>
    </header>
  );
}