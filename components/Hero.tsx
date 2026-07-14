import Image from 'next/image';
import { display, body, mono } from '@/lib/fonts';
import type { Categoria } from '@/lib/products';
import Reveal from './Reveal';

interface HeroProps {
  categoria: Categoria;
}

export default function Hero({ categoria }: HeroProps) {
  const esIndumentaria = categoria === 'indumentaria';

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-6 px-5 pb-10 pt-6 sm:gap-8 sm:pb-14 sm:pt-10 lg:grid-cols-[1fr_auto] lg:gap-4">
      <div className="flex flex-col items-center sm:items-start">
        <Reveal>
          <p className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
            Catálogo · Actualizado a mayo 2026
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className={`${display.className} mt-3 whitespace-pre-line text-center sm:text-left text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight`}>
            {esIndumentaria ? 'EL ESTILO\nCOMIENZA ACÁ' : 'TECNOLOGÍA\nA TU ALCANCE'}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className={`${body.className} mt-5 max-w-xl text-center sm:text-left text-base text-black/70`}>
            {'Comunicación directa con tu vendedor de máxima confianza.'}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <button
            onClick={() => {
              const el = document.getElementById('catalogo');
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className={`${mono.className} mt-6 border border-black px-10 py-3.5 text-xs uppercase tracking-widest transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
          >
            Ver catálogo
          </button>
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