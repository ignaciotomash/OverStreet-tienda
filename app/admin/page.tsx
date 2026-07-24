'use client';

import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/NavBar';
import AdminTabs from '@/components/admin/AdminTabs';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (isLoaded && !isAdmin) {
    return (
      <div className={`${display.variable} ${body.variable} ${mono.variable} bg-white text-black ${body.className}`}>
        <NavBar />
        <main className="mx-auto min-h-screen max-w-6xl px-5 pt-28 pb-16 lg:px-8">
          <p className={`${mono.className} text-sm text-black/50`}>
            No tenés acceso a esta página.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} bg-white text-black ${body.className}`}>
      <NavBar />
      <main className="mx-auto min-h-screen max-w-6xl px-5 pt-28 pb-16 lg:px-8">
        <h1 className={`${display.className} text-2xl sm:text-3xl tracking-tight`}>
          Panel de administrador
        </h1>
        <Suspense>
          <AdminTabs />
        </Suspense>
      </main>
    </div>
  );
}
