import Image from 'next/image';
import { mono } from '@/lib/fonts';

interface SwatchProps {
  seed: string;
  /** Clase de aspect-ratio de Tailwind. Default: la proporción original (más alta). */
  aspectClassName?: string;
  /** Ruta de la foto real en /public. Si no se pasa, se muestra el placeholder. */
  foto?: string;
  /** Nombre del producto, para el alt de la foto real. */
  alt?: string;
}

/**
 * Caja de foto de producto: si hay `foto`, la muestra recortada para llenar
 * el recuadro (object-cover) sin importar sus proporciones originales.
 * Si no hay foto todavía, muestra un placeholder gris tipo muestra de tela.
 */
export default function Swatch({ seed, aspectClassName = 'aspect-[4/5]', foto, alt }: SwatchProps) {
  if (foto) {
    return (
      <div className={`relative ${aspectClassName} w-full overflow-hidden border-b border-black bg-white`}>
        <Image src={foto} alt={alt ?? 'Foto del producto'} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      </div>
    );
  }

  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const tono = 18 + (hash % 12);

  return (
    <div
      className={`relative ${aspectClassName} w-full overflow-hidden border-b border-black`}
      style={{
        background: `repeating-linear-gradient(135deg, hsl(0,0%,${tono}%) 0px, hsl(0,0%,${tono}%) 10px, hsl(0,0%,${tono + 6}%) 10px, hsl(0,0%,${tono + 6}%) 20px)`,
      }}
    >
      <span className={`${mono.className} absolute bottom-2 right-2 text-[10px] text-white/70`}>
        FOTO PENDIENTE
      </span>
    </div>
  );
}