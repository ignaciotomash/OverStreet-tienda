'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthModalMode = 'signin' | 'signup' | null;

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
  close: () => void;
  mode: AuthModalMode;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthModalMode>(null);

  return (
    <AuthModalContext.Provider
      value={{
        mode,
        openSignIn: () => setMode('signin'),
        openSignUp: () => setMode('signup'),
        close: () => setMode(null),
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
