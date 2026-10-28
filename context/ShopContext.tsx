'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Direction, ViewState, Product } from '@/data/types';
import { TRANSLATIONS, WHATSAPP_PHONE } from '@/data/translations';
import { PRODUCTS } from '@/data/products';

interface ShopContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  view: ViewState;
  selectedStyleFilter: string | null;
  setSelectedStyleFilter: (filter: string | null) => void;
  navigateTo: (view: ViewState, styleFilter?: string | null) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;
  products: Product[];
  refreshProducts: () => Promise<void>;
  t: typeof TRANSLATIONS.fr;
  openWhatsApp: (customMessage?: string) => void;
  openWhatsAppForProduct: (productName: string, priceMAD: number, selectedSize?: number) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({
  children,
  initialView = 'home',
}: {
  children: React.ReactNode;
  initialView?: ViewState;
}) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [view, setView] = useState<ViewState>(initialView);
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('[ShopContext] Error fetching products:', err);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Synchronize language and HTML attributes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newDir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDir);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newDir;
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
  }, [direction, language]);

  const navigateTo = (newView: ViewState, styleFilter?: string | null) => {
    setSelectedProductId(null);
    setView(newView);
    if (styleFilter !== undefined) {
      setSelectedStyleFilter(styleFilter);
    }
    // Smooth scroll to top on page change
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = (customMessage?: string) => {
    const defaultMsg = language === 'fr'
      ? "Bonjour BIAZ Shoes, je souhaite avoir des informations sur votre collection de souliers en cuir."
      : "مرحباً BIAZ Shoes، أود الاستفسار عن تشكيلة الأحذية الجلدية الرجالية المتوفرة لديكم وطريقة الطلب والتوصيل.";
    const messageToSend = customMessage || defaultMsg;
    const cleanPhone = WHATSAPP_PHONE.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageToSend)}`;
    window.open(url, '_blank');
  };

  const openWhatsAppForProduct = (productName: string, priceMAD: number, selectedSize?: number) => {
    const sizeText = selectedSize 
      ? (language === 'fr' ? ` (Pointure : ${selectedSize})` : ` (المقاس : ${selectedSize})`)
      : '';
    const message = language === 'fr'
      ? `Bonjour BIAZ Shoes, je souhaite commander le modèle : ${productName} - ${priceMAD} MAD${sizeText}. Est-il disponible ?`
      : `مرحباً BIAZ Shoes، أود الاستفسار وطلب حذاء : ${productName} - بسعر ${priceMAD} درهم${sizeText}. هل المقاس متوفر للشحن ؟`;
    
    const cleanPhone = WHATSAPP_PHONE.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const t = TRANSLATIONS[language];

  return (
    <ShopContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        view,
        selectedStyleFilter,
        setSelectedStyleFilter,
        navigateTo,
        selectedProductId,
        openProductDetail,
        closeProductDetail,
        products,
        refreshProducts,
        t,
        openWhatsApp,
        openWhatsAppForProduct,
      }}
    >
      <div dir={direction} className={language === 'ar' ? 'font-arabic' : 'font-latin'}>
        {children}
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
