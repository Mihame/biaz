import { ShopProvider } from '@/context/ShopContext';
import StorefrontApp from '@/components/StorefrontApp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BIAZ - Suivi de commande | تتبع الطلب',
  description: 'Suivez en temps réel l’état d’avancement de votre commande de souliers en cuir BIAZ au Maroc.',
};

export default function TrackOrderRoutePage() {
  return (
    <ShopProvider initialView="track-order">
      <StorefrontApp />
    </ShopProvider>
  );
}
