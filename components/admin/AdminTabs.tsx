'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { mono } from '@/lib/fonts';
import CrearProducto from './CrearProducto';
import EditarProducto from './EditarProducto';
import EliminarProducto from './EliminarProducto';
import CuentasRegistradas from './CuentasRegistradas';
import HistorialPedidos from './HistorialPedidos';

type Tab = 'crear' | 'editar' | 'eliminar' | 'cuentas' | 'pedidos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'crear', label: 'Crear' },
  { id: 'editar', label: 'Editar' },
  { id: 'eliminar', label: 'Eliminar' },
  { id: 'cuentas', label: 'Cuentas' },
  { id: 'pedidos', label: 'Pedidos' },
];

export default function AdminTabs() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam === 'eliminar' || tabParam === 'editar' || tabParam === 'cuentas' || tabParam === 'pedidos' ? tabParam as Tab : 'crear'
  );

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
        {activeTab === 'editar' && <EditarProducto />}
        {activeTab === 'eliminar' && <EliminarProducto />}
        {activeTab === 'cuentas' && <CuentasRegistradas />}
        {activeTab === 'pedidos' && <HistorialPedidos />}
      </div>
    </div>
  );
}
