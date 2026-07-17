'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Producto } from '@/lib/products';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  talle?: string;
  color?: string;
}

export function cartKey(id: string, talle?: string, color?: string): string {
  return `${id}__${talle ?? ''}__${color ?? ''}`;
}

interface CartContextType {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number, talle?: string, color?: string) => void;
  removeItem: (id: string, talle?: string, color?: string) => void;
  updateQuantity: (id: string, cantidad: number, talle?: string, color?: string) => void;
  getQuantity: (id: string, talle?: string, color?: string) => number;
  isInCart: (id: string, talle?: string, color?: string) => boolean;
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

  const addItem = (producto: Producto, cantidad = 1, talle?: string, color?: string) => {
    setItems((prev) => {
      const key = cartKey(producto.id, talle, color);
      const existing = prev.find((item) => cartKey(item.producto.id, item.talle, item.color) === key);
      if (existing) {
        return prev.map((item) =>
          cartKey(item.producto.id, item.talle, item.color) === key
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { producto, cantidad, talle, color }];
    });
  };

  const removeItem = (id: string, talle?: string, color?: string) => {
    const key = cartKey(id, talle, color);
    setItems((prev) => prev.filter((item) => cartKey(item.producto.id, item.talle, item.color) !== key));
  };

  const updateQuantity = (id: string, cantidad: number, talle?: string, color?: string) => {
    const key = cartKey(id, talle, color);
    setItems((prev) =>
      prev.map((item) =>
        cartKey(item.producto.id, item.talle, item.color) === key ? { ...item, cantidad } : item
      )
    );
  };

  const getQuantity = (id: string, talle?: string, color?: string) => {
    const key = cartKey(id, talle, color);
    return items.find((item) => cartKey(item.producto.id, item.talle, item.color) === key)?.cantidad ?? 0;
  };

  const isInCart = (id: string, talle?: string, color?: string) => {
    const key = cartKey(id, talle, color);
    return items.some((item) => cartKey(item.producto.id, item.talle, item.color) === key);
  };

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
