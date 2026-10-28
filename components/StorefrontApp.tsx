'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import ProductsPage from './ProductsPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import ProductDetailPage from './ProductDetailPage';
import TrackOrderPage from './TrackOrderPage';

export default function StorefrontApp() {
  const { view, selectedProductId, closeProductDetail } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1A17] selection:bg-[#9A5B2E]/20">
      
      {/* Global Navigation Header with BIAZ branding */}
      <Header />

      {/* Main Views */}
      <main className="flex-1">
        {selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onBack={closeProductDetail} />
        ) : (
          <>
            {view === 'home' && <HomePage />}
            {view === 'products' && <ProductsPage />}
            {view === 'about' && <AboutPage />}
            {view === 'contact' && <ContactPage />}
            {view === 'track-order' && <TrackOrderPage />}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
