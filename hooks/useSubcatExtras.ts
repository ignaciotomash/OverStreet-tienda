'use client';

import { useState, useEffect } from 'react';
import { getSubcategoriasCompletas, type Categoria, type Producto, type SubcategoriaOpcion } from '@/lib/products';

type SubcatExtras = Record<Categoria, SubcategoriaOpcion[]>;

const EMPTY: SubcatExtras = { indumentaria: [], tecnologia: [], perfumeria: [] };

function readFromStorage(): SubcatExtras {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const stored = localStorage.getItem('subcatExtras');
    return stored ? JSON.parse(stored) : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useSubcatExtras() {
  const [subcatExtras, setSubcatExtras] = useState<SubcatExtras>(readFromStorage);

  useEffect(() => {
    localStorage.setItem('subcatExtras', JSON.stringify(subcatExtras));
  }, [subcatExtras]);

  const agregarSubcat = (categoria: Categoria, sub: SubcategoriaOpcion) => {
    setSubcatExtras((prev) => ({
      ...prev,
      [categoria]: [...prev[categoria], sub],
    }));
  };

  const eliminarSubcatExtra = (categoria: Categoria, value: string, productos: Producto[]) => {
    const base = getSubcategoriasCompletas(categoria, productos);
    const esBase = base.some((s) => s.value === value);
    const tieneProductos = productos.some(
      (p) => p.categoria === categoria && p.subcategoria === value,
    );
    if (!esBase && !tieneProductos) {
      setSubcatExtras((prev) => ({
        ...prev,
        [categoria]: prev[categoria].filter((e) => e.value !== value),
      }));
      return base[0]?.value ?? '';
    }
    return null;
  };

  const obtenerSubcategorias = (categoria: Categoria, productos: Producto[]): SubcategoriaOpcion[] => {
    const base = getSubcategoriasCompletas(categoria, productos);
    const extrasDedup = [...new Map(
      subcatExtras[categoria]
        .filter((extra) => !base.find((s) => s.value === extra.value))
        .map((extra) => [extra.value, extra]),
    ).values()];
    return [...base, ...extrasDedup];
  };

  return { subcatExtras, agregarSubcat, eliminarSubcatExtra, obtenerSubcategorias };
}
