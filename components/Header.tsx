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
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E1A17] hover:bg-[#F1ECE4] rounded-sm transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              alt="BIAZ Shoes"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-xs"
            />
            <span className="font-heading-latin rtl:font-heading-arabic tracking-wider uppercase font-semibold text-[#1E1A17]">
              {t.brandName}
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

        {/* Right Actions: Language Switcher + WhatsApp Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="min-h-[42px] px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-[#1E1A17] border border-[#E2DAD0] bg-[#F1ECE4]/70 hover:bg-[#F1ECE4] rounded-sm transition-colors cursor-pointer select-none"
            aria-label={`Changer de langue vers ${language === 'fr' ? 'العربية' : 'Français'}`}
            title={`Changer de langue vers ${language === 'fr' ? 'العربية' : 'Français'}`}
          >
            <Globe className="w-3.5 h-3.5 text-[#9A5B2E] shrink-0" aria-hidden="true" />
            <span>{t.nav.changeLang}</span>
          </button>

          {/* WhatsApp Direct CTA Button */}
          <button
            onClick={() => openWhatsApp()}
            className="min-h-[42px] px-3 sm:px-4 py-2 flex items-center gap-2 bg-[#25D366] text-white text-xs sm:text-sm font-medium rounded-sm hover:bg-[#20ba5a] transition-all cursor-pointer shadow-xs"
            aria-label={t.nav.whatsapp}
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline font-semibold">{t.nav.whatsapp}</span>
            <span className="sm:hidden font-semibold">WhatsApp</span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer: Exactly the 4 links + WhatsApp + Language */}
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

          <div className="pt-3 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsApp();
              }}
              className="w-full min-h-[46px] flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium text-sm rounded-sm hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {t.nav.whatsapp}{' '}
                <span dir="ltr" className="inline-block font-sans text-xs">({WHATSAPP_DISPLAY})</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
