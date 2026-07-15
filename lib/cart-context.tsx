'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Producto } from '@/lib/products';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  getQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
  totalItems: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'overstreet-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migración: si el viejo formato era Producto[], convertir a CartItem[]
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].cantidad) {
          setItems(parsed.map((p: Producto) => ({ producto: p, cantidad: 1 })));
        } else {
          setItems(parsed as CartItem[]);
        }
      }
    } catch { /* ignora errores de parse */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (producto: Producto, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.producto.id === producto.id);
      if (existing) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { producto, cantidad }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.producto.id !== id));
  };

  const updateQuantity = (id: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.producto.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const getQuantity = (id: string) => items.find((item) => item.producto.id === id)?.cantidad ?? 0;

  const isInCart = (id: string) => items.some((item) => item.producto.id === id);

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, getQuantity, isInCart, totalItems: items.reduce((sum, item) => sum + item.cantidad, 0), clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider');
  return ctx;
}
