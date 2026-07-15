import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getProductos } from '@/app/actions/actions';

// Suspense es requerido por Next.js porque HomeContent usa useSearchParams
// (para poder leer ?categoria=... cuando volvés desde la página de detalle).
export default async function Page() {
  const productos = await getProductos();

  return (
    <Suspense fallback={null}>
      <HomeContent productos={productos} />
    </Suspense>
  );
}
