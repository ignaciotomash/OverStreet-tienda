import type { Metadata } from 'next';
import SobreMiContent from '@/components/SobreMiContent';

export const metadata: Metadata = {
  title: 'Sobre mi - OverStreet',
  description: 'Conocé OverStreet: más de dos años acercando productos de tecnología e indumentaria.',
};

export default function SobreMiPage() {
  return <SobreMiContent />;
}
