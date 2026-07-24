'use client';

import { useState, useEffect } from 'react';
import { mono, body } from '@/lib/fonts';
import { getUsuarios, type UsuarioClerk } from '@/app/actions/actions';
import Reveal from '../Reveal';

export default function CuentasRegistradas() {
  const [usuarios, setUsuarios] = useState<UsuarioClerk[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getUsuarios().then((u) => {
      setUsuarios(u);
      setCargando(false);
    });
  }, []);

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (cargando) {
    return (
      <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
        Cargando cuentas...
      </p>
    );
  }

  if (usuarios.length === 0) {
    return (
      <p className={`${mono.className} py-10 text-center text-sm text-black/50`}>
        No hay cuentas registradas.
      </p>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="mb-6 flex items-center justify-between border-b border-black pb-4">
          <span className={`${mono.className} text-xs uppercase tracking-wide text-black/50`}>
            {usuarios.length} cuenta{usuarios.length !== 1 ? 's' : ''} registrada{usuarios.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/20">
                <th className={`${mono.className} pb-3 text-[10px] uppercase tracking-wider text-black/40`}>Foto</th>
                <th className={`${mono.className} pb-3 text-[10px] uppercase tracking-wider text-black/40`}>Nombre</th>
                <th className={`${mono.className} pb-3 text-[10px] uppercase tracking-wider text-black/40`}>Email</th>
                <th className={`${mono.className} pb-3 text-[10px] uppercase tracking-wider text-black/40`}>Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-black/10 transition-colors hover:bg-black/[0.02]">
                  <td className="py-3 pr-4">
                    {usuario.foto ? (
                      <img
                        src={usuario.foto}
                        alt={usuario.nombre}
                        className="h-9 w-9 rounded-full border border-black/10 object-cover"
                      />
                    ) : (
                      <div className={`${mono.className} flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-xs text-black/30`}>
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className={`${body.className} py-3 pr-4 text-sm font-medium`}>
                    {usuario.nombre}
                  </td>
                  <td className={`${mono.className} py-3 pr-4 text-xs text-black/60`}>
                    {usuario.email}
                  </td>
                  <td className={`${mono.className} py-3 text-xs text-black/40`}>
                    {formatearFecha(usuario.creadoEn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
