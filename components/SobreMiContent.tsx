'use client';

import Image from 'next/image';
import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default function SobreMiContent() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar />
      <div className="pt-16">
        <section className="relative overflow-hidden pt-4 pb-20 sm:pt-6 sm:pb-28">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2">

            {/* ── Círculo cortado por el borde izquierdo ── */}
            <Reveal direction="left">
              <div className="relative flex items-center justify-start">
                <div className="absolute -left-[550px] h-[975px] w-[975px] rounded-full bg-[#EBE9E6] sm:-left-[500px] sm:h-[1125px] sm:w-[1125px]" />
                <div className="relative z-10 ml-6 max-w-md py-10 sm:ml-10 lg:ml-14">
                  <p className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
                    Sobre nosotros
                  </p>
                  <h1 className={`${display.className} mt-4 text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-tight`}>
                    NUESTRA HISTORIA
                  </h1>
                  <div className="mt-6 border-t border-black/15 pt-6">
                    <p className={`${body.className} text-sm leading-relaxed text-black/70 sm:text-lg`}>
                      En Overstreet llevamos más de dos años acercando productos de tecnología e indumentaria seleccionados por su calidad, diseño y relación precio-calidad.
                    </p>
                  </div>
                  <p className={`${body.className} mt-4 text-sm leading-relaxed text-black/70 sm:text-lg`}>
                    Durante este tiempo estudiamos las necesidades de nuestros clientes y a ofrecer una atención cercana, con el compromiso de brindar siempre productos confiables y una experiencia de compra simple, segura y pensada para quienes nos eligen.
                  </p>

                </div>
              </div>
            </Reveal>

            {/* ── Imagen sobre mí ── */}
            <Reveal direction="right">
              <div className="hidden lg:flex items-center justify-center">
                <Image
                  src="/foto-sobre-mi.jpeg"
                  alt="Foto sobre nosotros"
                  width={500}
                  height={600}
                  className="rounded-2xl object-cover shadow-lg"
                  priority
                />
              </div>
            </Reveal>

          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
