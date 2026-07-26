'use client';

import { useState, useRef } from 'react';
import { mono } from '@/lib/fonts';
import { type Categoria, type SubcategoriaOpcion } from '@/lib/products';

interface NuevaSubcategoriaInputProps {
  categoria: Categoria;
  subcategorias: SubcategoriaOpcion[];
  onAgregarSubcat: (categoria: Categoria, sub: SubcategoriaOpcion) => void;
  onSubcategoriaChange: (value: string) => void;
  onCerrar: () => void;
}

export default function NuevaSubcategoriaInput({
  categoria,
  subcategorias,
  onAgregarSubcat,
  onSubcategoriaChange,
  onCerrar,
}: NuevaSubcategoriaInputProps) {
  const [valor, setValor] = useState('');
  const cerrando = useRef(false);

  const confirmar = () => {
    if (cerrando.current) return;
    cerrando.current = true;
    const trimmed = valor.trim();
    if (trimmed) {
      const value = trimmed.toLowerCase().replace(/\s+/g, '-');
      const label = trimmed;
      if (!subcategorias.find((s) => s.value === value)) {
        onAgregarSubcat(categoria, { value, label });
      }
      onSubcategoriaChange(value);
    }
    onCerrar();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Nueva subcategoría..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && valor.trim()) confirmar();
          if (e.key === 'Escape') onCerrar();
        }}
        onBlur={confirmar}
        autoFocus
        className={`${mono.className} flex-1 border border-black/20 bg-transparent px-3 py-2 text-xs`}
      />
      <button
        type="button"
        onClick={() => { if (valor.trim()) confirmar(); else onCerrar(); }}
        className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
      >
        ✓
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCerrar}
        className={`${mono.className} flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black/5 text-sm text-black transition-colors hover:bg-black/10`}
      >
        X
      </button>
    </div>
  );
}
