'use client';

import { display, body, mono } from '@/lib/fonts';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const CONTACTOS = [
  {
    label: 'Instagram',
    value: '@l.overstreet_',
    href: 'https://www.instagram.com/l.overstreet_/',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: '+54 2976 232 709',
    href: 'https://wa.me/542976232709',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5m0 0a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    value: 'OverStreet',
    href: 'https://www.facebook.com/marketplace/profile/100088868303531/?ref=permalink&mibextid=6ojiHh',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'facuhermida8@gmail.com',
    href: 'mailto:facuhermida8@gmail.com',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function ContactoContent() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white text-black ${body.className}`}>
      <NavBar />
      <div className="pt-16">
        <section className="mx-auto max-w-3xl px-5 pt-10 pb-20 sm:pt-14 sm:pb-28">
          <Reveal>
            <p className={`${mono.className} text-xs uppercase tracking-[0.2em] text-black/50`}>
              Contacto
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className={`${display.className} mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight`}>
              REDES Y CONTACTO
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className={`${body.className} mt-5 max-w-lg text-sm leading-relaxed text-black/60 sm:text-base`}>
              Elegí la forma que te quede más cómoda. Respondemos rápido.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-4">
            {CONTACTOS.map((c, i) => (
              <Reveal key={c.label} delay={200 + i * 60} direction="left">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 border border-black/10 bg-[#EBE9E6]/60 px-6 py-5 transition-all duration-300 hover:border-black/30 hover:bg-[#EBE9E6]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/15 text-black/50 transition-colors group-hover:border-black group-hover:text-black">
                    {c.icon}
                  </span>
                  <div className="min-w-0">
                    <span className={`${mono.className} block text-[10px] uppercase tracking-[0.15em] text-black/40`}>
                      {c.label}
                    </span>
                    <span className={`${body.className} mt-0.5 block truncate text-sm font-medium sm:text-base`}>
                      {c.value}
                    </span>
                  </div>
                  <svg className="ml-auto h-4 w-4 shrink-0 text-black/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
