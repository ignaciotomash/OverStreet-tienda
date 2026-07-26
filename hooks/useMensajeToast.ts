'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Mensaje {
  tipo: 'exito' | 'error';
  texto: string;
}

export function useMensajeToast(duracionVisible = 2700, duracionFade = 300) {
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mensaje) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = setTimeout(() => setMensaje(null), duracionFade);
      }, duracionVisible);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mensaje, duracionVisible, duracionFade]);

  const mostrarMensaje = useCallback((tipo: Mensaje['tipo'], texto: string) => {
    setMensaje({ tipo, texto });
  }, []);

  return { mensaje, visible, mostrarMensaje };
}
