import { display } from '@/lib/fonts';

interface MarqueeProps {
  reverse?: boolean;
}

const TEXTO = ' · OVERSTREET · STREETWEAR PARA TODOS';

export default function Marquee({ reverse = false }: MarqueeProps) {
  return (
    <div className="marquee-wrap border-y border-black bg-black text-white">
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        {Array.from({ length: 2 }).map((_, i) => (
          <span
            key={i}
            className={`${display.className} whitespace-nowrap px-6 text-[clamp(1.5rem,4vw,3rem)] tracking-tight`}
          >
            {TEXTO.repeat(4)}
          </span>
        ))}
      </div>
    </div>
  );
}