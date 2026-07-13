import { notFound } from 'next/navigation';
import { PRODUCTOS, getProductoPorId } from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';

interface ProductoPageProps {
  // Next.js 15+: params llega como Promise, hay que resolverla con await.
  params: Promise<{ id: string }>;
}

// Pre-genera una ruta estática por cada producto del catálogo.
export function generateStaticParams() {
  return PRODUCTOS.map((producto) => ({ id: producto.id }));
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id } = await params;
  const producto = getProductoPorId(id);

  if (!producto) {
    notFound();
  }

  return <ProductDetail producto={producto} />;
}