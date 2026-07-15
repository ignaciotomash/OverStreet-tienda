import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductoPorId } from '@/app/actions/actions';
import ProductDetail from '@/components/ProductDetail';

interface ProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id } = await params;
  const producto = await getProductoPorId(id);

  if (!producto) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <ProductDetail producto={producto} />
    </Suspense>
  );
}
