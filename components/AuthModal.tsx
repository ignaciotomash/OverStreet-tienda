'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { useAuthModal } from '@/lib/auth-modal-context';
import { mono } from '@/lib/fonts';

export default function AuthModal() {
  const { mode, close } = useAuthModal();

  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative">
        <button
          onClick={close}
          className={`${mono.className} absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-black bg-white text-sm transition-colors hover:bg-black hover:text-white`}
        >
          ✕
        </button>
        {mode === 'signin' ? (
          <SignIn
            routing="hash"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'border border-black shadow-none',
              },
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'border border-black shadow-none',
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
