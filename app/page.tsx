import { ShopProvider } from '@/context/ShopContext';
import StorefrontApp from '@/components/StorefrontApp';

export default function HomePage() {
  return (
    <ShopProvider>
      <StorefrontApp />
    </ShopProvider>
  );
}
