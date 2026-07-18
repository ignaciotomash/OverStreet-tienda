'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthModalMode = 'signin' | 'signup' | null;

interface AuthModalContextValue {
  openSignIn: () => void;
  openSignUp: () => void;
  close: () => void;
  mode: AuthModalMode;
  returnUrl: string | null;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthModalMode>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  return (
    <AuthModalContext.Provider
      value={{
        mode,
        returnUrl,
        openSignIn: () => {
          setReturnUrl(window.location.pathname);
          setMode('signin');
        },
        openSignUp: () => {
          setReturnUrl(window.location.pathname);
          setMode('signup');
        },
        close: () => {
          setMode(null);
          setReturnUrl(null);
        },
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
