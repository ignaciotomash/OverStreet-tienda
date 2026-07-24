'use client';

import { useState, useEffect } from 'react';
import { mono, body } from '@/lib/fonts';
import { formatearPrecio } from '@/lib/products';
import { getPedidos, actualizarEstadoPedido, type Pedido, type PedidoItem } from '@/app/actions/actions';
import Reveal from '../Reveal';

const ESTADOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'] as const;

const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700',
  confirmado: 'border-blue-500/30 bg-blue-500/10 text-blue-700',
  enviado: 'border-purple-500/30 bg-purple-500/10 text-purple-700',
  entregado: 'border-green-600/30 bg-green-600/10 text-green-700',
  cancelado: 'border-[#C1272D]/30 bg-[#C1272D]/10 text-[#C1272D]',
};

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);

  useEffect(() => {
    getPedidos().then((p) => {
      setPedidos(p);
      setCargando(false);
    });
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    await actualizarEstadoPedido(id, nuevoEstado);
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpandir = (id: string) => {
    setPedidoExpandido((prev) => (prev === id ? null : id));
  };

  if (cargando) {
    return (
      <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
        Cargando pedidos...
      </p>
    );
  }

  if (pedidos.length === 0) {
    return (
      <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
        No hay pedidos registrados.
      </p>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="mb-6 flex items-center justify-between border-b border-black pb-4">
          <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Reveal>

      <div className="space-y-3">
        {pedidos.map((pedido, i) => (
          <Reveal key={pedido.id} delay={(i % 5) * 60}>
            <div className="border border-black/15 transition-colors hover:border-black/30">
              <div
                onClick={() => toggleExpandir(pedido.id)}
                className="flex cursor-pointer items-center gap-4 p-4"
              >
                {pedido.usuarioFoto ? (
                  <img
                    src={pedido.usuarioFoto}
                    alt={pedido.usuarioNombre}
                    className="h-8 w-8 shrink-0 rounded-full border border-black/10 object-cover"
                  />
                ) : (
                  <div className={`${mono.className} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-xs text-black/30`}>
                    {pedido.usuarioNombre.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className={`${body.className} truncate text-sm font-medium`}>
                    {pedido.usuarioNombre}
                  </p>
                  <p className={`${mono.className} text-[10px] text-black/40`}>
                    {formatearFecha(pedido.creadoEn)}
                  </p>
                </div>

                <span className={`${mono.className} shrink-0 text-sm font-bold`}>
                  {formatearPrecio(pedido.total)}
                </span>

                <select
                  value={pedido.estado}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                  className={`${mono.className} shrink-0 border border-black/20 bg-transparent px-2 py-1 text-[10px] uppercase tracking-wider transition-colors hover:border-black/40 ${
                    ESTADO_STYLES[pedido.estado] || ''
                  }`}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>

                <svg
                  className={`h-4 w-4 shrink-0 text-black/30 transition-transform ${
                    pedidoExpandido === pedido.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {pedidoExpandido === pedido.id && (
                <div className="border-t border-black/10 px-4 py-3">
                  <ul className="space-y-2">
                    {pedido.items.map((item: PedidoItem, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-xs">
                        <span className={`${mono.className} text-black/40`}>{idx + 1}.</span>
                        <span className={`${body.className} flex-1`}>
                          {item.producto.nombre}
                        </span>
                        {item.talle && (
                          <span className={`${mono.className} text-black/40`}>Talle: {item.talle}</span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1">
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                        <span className={`${mono.className} text-black/50`}>x{item.cantidad}</span>
                        <span className={`${mono.className} font-bold`}>
                          {formatearPrecio(item.producto.precio * item.cantidad)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
