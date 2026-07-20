'use client';

import { Suspense } from 'react';
import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/NavBar';
import AdminTabs from '@/components/admin/AdminTabs';

export default function AdminPage() {
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
