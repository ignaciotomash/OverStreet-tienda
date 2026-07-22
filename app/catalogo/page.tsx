import { Suspense } from 'react';
import CatalogoContent from '@/components/CatalogoContent';
import { getProductos } from '@/app/actions/actions';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  const productos = await getProductos();

  return (
    <Suspense fallback={null}>
      <CatalogoContent productos={productos} />
    </Suspense>
  );
}
