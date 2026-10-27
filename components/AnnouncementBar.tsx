'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Truck, MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '@/data/translations';

export default function AnnouncementBar() {
  const { language, openWhatsApp } = useShop();

  return (
    <aside
      aria-label="Informations BIAZ Shoes"
      className="w-full bg-[#181412] text-[#FAF8F5] border-b border-[#2C241E] text-xs py-2 px-4 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start">
        <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#FAF8F5]/90">
          <Truck className="w-3.5 h-3.5 text-[#C48A58] shrink-0" aria-hidden="true" />
          <span>
            {language === 'fr'
              ? 'Livraison disponible dans toutes les villes du Maroc'
              : 'خدمة التوصيل متوفرة لكافة المدن المغربية'}
          </span>
        </div>

        <button
          onClick={() => openWhatsApp()}
          className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#C48A58] hover:text-[#e4a46d] transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" aria-hidden="true" />
          <span>
            {language === 'fr' ? 'WhatsApp direct :' : 'تواصل مباشر عبر واتساب :'}{' '}
            <span dir="ltr" className="inline-block font-sans font-medium">{WHATSAPP_DISPLAY}</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
