'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Desde dónde entra el contenido: 'up' (default, de abajo hacia arriba),
   *  'right' (de derecha hacia izquierda) o 'left' (de izquierda hacia derecha). */
  direction?: Direction;
  /** Distancia del desplazamiento inicial en px. */
  distance?: number;
}

const OFFSETS: Record<Direction, (d: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  right: (d) => `translateX(${d}px)`,
  left: (d) => `translateX(-${d}px)`,
};

/**
 * Envuelve cualquier contenido y le agrega una animación de
 * aparición cuando entra en el viewport (scroll reveal).
 * Respeta prefers-reduced-motion vía la clase .reveal en globals.css.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  distance = 24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : OFFSETS[direction](distance),
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}