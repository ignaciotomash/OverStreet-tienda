import type { Metadata } from 'next';
import ContactoContent from '@/components/ContactoContent';

export const metadata: Metadata = {
  title: 'Contacto - OverStreet',
  description: 'Contactanos por Instagram, WhatsApp, Facebook o email.',
};

export default function ContactoPage() {
  return <ContactoContent />;
}
