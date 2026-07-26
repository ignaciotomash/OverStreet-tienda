import { display, body, mono } from '@/lib/fonts';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-14">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 border-t border-black pt-8 sm:flex-row sm:items-end">
          <div>
            <span className={`${display.className} text-lg`}>OVERSTREET</span>
            <p className={`${body.className} mt-2 max-w-sm text-sm text-black/60`}>
              Ropa y tecnología al por mayor y menor. Seguinos en redes para ver novedades y hacer tu pedido.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/l.overstreet_/"
              target="_blank"
              rel="noreferrer"
              className={`${mono.className} border border-black px-4 py-2 text-sm uppercase tracking-wide transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
            >
              @overstreet · Instagram
            </a>
            <a
              href="https://www.facebook.com/marketplace/profile/100088868303531/?ref=permalink&mibextid=6ojiHh"
              target="_blank"
              rel="noreferrer"
              className={`${mono.className} border border-black px-4 py-2 text-sm uppercase tracking-wide transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
            >
              Overstreet · Facebook
            </a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}