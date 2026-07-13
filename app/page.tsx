import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';

// Suspense es requerido por Next.js porque HomeContent usa useSearchParams
// (para poder leer ?categoria=... cuando volvés desde la página de detalle).
export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}