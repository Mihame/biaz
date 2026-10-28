'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Truck, MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '@/data/translations';

export default function AnnouncementBar() {
  const { language } = useShop();

  return (
    <aside
      aria-label="Informations BIAZ"
      className="w-full bg-[#181412] text-[#FAF8F5] border-b border-[#2C241E] text-xs py-2 px-4 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start">
        <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#FAF8F5]/90">
          <Truck className="w-3.5 h-3.5 text-[#C48A58] shrink-0" aria-hidden="true" />
          <span>
            {language === 'fr'
              ? 'Livraison offerte dans toutes les villes du Maroc · Essayage à domicile'
              : 'خدمة التوصيل المجاني لكافة المدن المغربية · قياس منزلي قبل الاستلام'}
          </span>
        </div>

        <div className="text-[11px] sm:text-xs text-[#C48A58] font-medium">
          <span>
            {language === 'fr' ? 'Paiement en espèces à la livraison' : 'الدفع نقداً عند الاستلام والمعاينة'}
          </span>
        </div>
      </div>
    </aside>
  );
}
