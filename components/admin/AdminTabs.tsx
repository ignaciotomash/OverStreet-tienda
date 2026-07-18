'use client';

import { useState } from 'react';
import { mono } from '@/lib/fonts';
import CrearProducto from './CrearProducto';

type Tab = 'crear' | 'editar' | 'eliminar';

const TABS: { id: Tab; label: string }[] = [
  { id: 'crear', label: 'Crear' },
  { id: 'editar', label: 'Editar' },
  { id: 'eliminar', label: 'Eliminar' },
];

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('crear');

  return (
    <div className="mt-8">
      <div className="flex gap-1 border-b border-black/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${mono.className} relative px-5 py-3 text-xs uppercase tracking-[0.15em] transition-colors ${
              activeTab === tab.id
                ? 'text-black'
                : 'text-black/50 hover:text-black/70'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'crear' && <CrearProducto />}
        {activeTab === 'editar' && (
          <p className={`${mono.className} text-sm text-black/50`}>
            Próximamente...
          </p>
        )}
        {activeTab === 'eliminar' && (
          <p className={`${mono.className} text-sm text-black/50`}>
            Próximamente...
          </p>
        )}
      </div>
    </div>
  );
}
