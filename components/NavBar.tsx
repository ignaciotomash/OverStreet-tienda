'use client';

import { display, mono } from '@/lib/fonts';
import type { Categoria } from '@/lib/products';

interface NavBarProps {
  categoria: Categoria;
  onChange: (categoria: Categoria) => void;
}

export default function NavBar({ categoria, onChange }: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-5 sm:py-4">
        <span className={`${display.className} text-lg tracking-tight sm:text-xl`}>OVERSTREET</span>

        <nav role="tablist" aria-label="Categoría de catálogo" className="relative flex border border-black text-sm">
          <button
            role="tab"
            aria-selected={categoria === 'indumentaria'}
            onClick={() => onChange('indumentaria')}
            className={`${mono.className} flex-1 px-3 py-2.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
              categoria === 'indumentaria' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
            }`}
          >
            Indumentaria
          </button>
          <button
            role="tab"
            aria-selected={categoria === 'tecnologia'}
            onClick={() => onChange('tecnologia')}
            className={`${mono.className} flex-1 border-l border-black px-3 py-2.5 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
              categoria === 'tecnologia' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
            }`}
          >
            Tecnología
          </button>
        </nav>
      </div>
    </header>
  );
}