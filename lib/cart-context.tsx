'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Producto } from '@/lib/products';

interface CartContextType {
  items: Producto[];
  addItem: (producto: Producto) => void;
  removeItem: (id: string) => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'overstreet-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Producto[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as Producto[]);
    } catch { /* ignora errores de parse */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (producto: Producto) => {
    setItems((prev) => (prev.some((p) => p.id === producto.id) ? prev : [...prev, producto]));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const isInCart = (id: string) => items.some((p) => p.id === id);

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, isInCart, totalItems: items.length, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider');
  return ctx;
}
