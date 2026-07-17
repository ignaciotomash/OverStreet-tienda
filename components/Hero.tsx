'use client';

import Image from 'next/image';
import Link from 'next/link';
import { display, body, mono } from '@/lib/fonts';
import Reveal from './Reveal';

export default function Hero() {

  return (
    <section className="mx-auto grid min-h-[85vh] max-w-6xl grid-cols-1 items-center gap-6 px-5 py-16 sm:gap-8 sm:py-20 lg:min-h-0 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-4 lg:pb-14 lg:pt-10">
      <div className="flex flex-col items-center sm:items-start">
        <Reveal>
          <p className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
            Catálogo · Actualizado a mayo 2026
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className={`${display.className} mt-3 whitespace-pre-line text-center sm:text-left text-[clamp(2.5rem,8vw,5.5rem)] lg:text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tight`}>
            {'EL ESTILO\nCOMIENZA ACÁ'}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className={`${body.className} mt-5 max-w-xl text-center sm:text-left text-base text-black/70`}>
            {'Comunicación directa con tu vendedor de máxima confianza.'}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <Link
            href="/catalogo"
            className={`${mono.className} mt-6 inline-block border border-black px-10 py-3.5 text-xs uppercase tracking-widest transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            Ver catálogo
          </Link>
        </Reveal>
      </div>

      {/* mascota de marca: parado junto al título, recortado sin fondo */}
      <Reveal delay={220} direction="right" distance={60} className="mx-auto hidden lg:block lg:mx-0">
        <Image
          src="/wachin_original.jpeg"
          alt="Mascota de OverStreet"
          width={848}
          height={1267}
          priority
          className="h-[340px] w-auto select-none"
        />
      </Reveal>
    </section>
  );
}