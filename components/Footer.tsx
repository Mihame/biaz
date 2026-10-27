'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { MessageCircle, Phone, MapPin, Lock } from 'lucide-react';
import { WHATSAPP_DISPLAY, STORE_CITY } from '@/data/translations';

export default function Footer() {
  const { t, navigateTo, openWhatsApp } = useShop();

  return (
    <footer className="bg-[#181412] text-[#FAF8F5] border-t border-[#2C241E] pt-12 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-[#2C241E] text-start">
          
          {/* Column 1: Brand presentation */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/favicon_147b139c.png"
                alt="BIAZ Shoes"
                className="w-7 h-7 object-contain drop-shadow-xs"
              />
              <span className="font-heading-latin rtl:font-heading-arabic text-xl font-bold tracking-wider uppercase text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
          </div>

          {/* Column 2: Exact 4 Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest rtl:tracking-normal text-[#C48A58]">
              {t.footer.navTitle}
            </h3>
            <ul className="space-y-2 text-sm text-[#FAF8F5]/80">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & WhatsApp */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest rtl:tracking-normal text-[#C48A58]">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/80">
              <li>
                <button
                  onClick={() => openWhatsApp()}
                  className="inline-flex items-center gap-2 hover:text-[#25D366] transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>WhatsApp : <span dir="ltr" className="inline-block font-sans">{WHATSAPP_DISPLAY}</span></span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C48A58] shrink-0" />
                <span dir="ltr" className="inline-block font-sans">{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C48A58] shrink-0" />
                <span>{t.footer.city}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} {t.footer.allRightsReserved}</p>
            <span className="text-[#FAF8F5]/30 hidden sm:inline">·</span>
            <Link
              href="/admin"
              className="text-[#FAF8F5]/50 hover:text-[#C48A58] transition-colors inline-flex items-center gap-1.5 text-[11px]"
              title="لوحة تحكم الإدارة"
            >
              <Lock className="w-3 h-3 text-[#C48A58]" />
              <span>لوحة الإدارة (/admin)</span>
            </Link>
          </div>
          <p className="text-[11px] text-[#FAF8F5]/40">{t.footer.madCurrency}</p>
        </div>

      </div>
    </footer>
  );
}
