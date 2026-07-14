'use client';

import { type ReactNode } from 'react';
import { CartProvider } from '@/lib/cart-context';
import { AuthModalProvider } from '@/lib/auth-modal-context';
import AuthModal from './AuthModal';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AuthModalProvider>
        {children}
        <AuthModal />
      </AuthModalProvider>
    </CartProvider>
  );
}
