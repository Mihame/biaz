'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { MessageCircle, Menu, X, Globe } from 'lucide-react';
import { ViewState } from '@/data/types';
import { WHATSAPP_DISPLAY } from '@/data/translations';

export default function Header() {
  const {
    t,
    language,
    setLanguage,
    navigateTo,
    view,
    openWhatsApp,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const navItems: { key: ViewState; label: string }[] = [
    { key: 'home', label: t.nav.home },
    { key: 'products', label: t.nav.products },
    { key: 'about', label: t.nav.about },
    { key: 'contact', label: t.nav.contact },
    { key: 'track-order', label: t.nav.trackOrder },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2DAD0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1E1A17] hover:bg-[#F1ECE4] rounded-xs transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-xl sm:text-2xl font-bold tracking-tight text-[#1E1A17] whitespace-nowrap hover:opacity-85 transition-opacity text-start cursor-pointer"
          >
            <img
              src="/assets/aistudio/favicon_147b139c.png"
              alt="BIAZ"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-xs"
            />
            <span className="font-heading-latin rtl:font-heading-arabic tracking-wider uppercase font-semibold text-[#1E1A17]">
              BIAZ
            </span>
          </button>
        </div>

        {/* Desktop Navigation: EXACTLY the 4 links */}
        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigateTo(item.key)}
                className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#1E1A17] font-semibold'
                    : 'text-[#1E1A17]/70 hover:text-[#1E1A17]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9A5B2E] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Discreet Minimal Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="h-8 px-2.5 text-xs font-semibold tracking-wider text-[#1E1A17]/80 hover:text-[#1E1A17] border border-[#E2DAD0] rounded-xs bg-white/70 hover:bg-white transition-all cursor-pointer select-none flex items-center justify-center shadow-2xs"
            aria-label={language === 'fr' ? 'Passer en arabe' : 'Changer en français'}
            title={language === 'fr' ? 'العربية' : 'Français'}
          >
            <span>{language === 'fr' ? 'العربية' : 'FR'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer: Exactly the 4 links + Compact Language Switcher */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DAD0] bg-[#FAF8F5] px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2 text-base font-medium text-[#1E1A17]">
            {navItems.map((item) => {
              const isActive = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    navigateTo(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full py-3 border-b border-[#E2DAD0]/60 text-start cursor-pointer ${
                    isActive ? 'text-[#9A5B2E] font-semibold' : 'text-[#1E1A17]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#9A5B2E]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#6B635B] font-medium">
              {language === 'fr' ? 'Langue / اللغة' : 'اللغة / Langue'}
            </span>
            <button
              type="button"
              onClick={() => {
                handleLanguageToggle();
                setMobileMenuOpen(false);
              }}
              className="h-8 px-3 text-xs font-semibold border border-[#E2DAD0] rounded-xs bg-white text-[#1E1A17] shadow-2xs cursor-pointer"
            >
              {language === 'fr' ? 'العربية' : 'FR'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
