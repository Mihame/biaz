'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { ArrowRight, ArrowLeft, Sparkles, Feather, Shield } from 'lucide-react';

export default function AboutPage() {
  const { t, language, direction, navigateTo } = useShop();

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
      
      {/* 1. Header & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest rtl:tracking-normal text-[#9A5B2E] font-semibold">
          {language === 'fr' ? 'Notre Histoire & Philosophie' : 'قصتنا ورؤيتنا'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] tracking-tight rtl:tracking-normal">
          {t.about.pageTitle}
        </h1>
        <p className="text-base sm:text-lg text-[#6B635B] leading-relaxed pt-2">
          {t.about.pageSubtitle}
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative aspect-16/9 rounded-sm overflow-hidden bg-[#F1ECE4] border border-[#E2DAD0] shadow-sm">
        <img
          src="/images/hero_oxford_leather_1792953837188.jpg"
          alt="Atelier BIAZ"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Brand Vision & Philosophy Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-start">
        <div className="p-8 bg-white rounded-sm border border-[#E2DAD0] space-y-3">
          <div className="w-10 h-10 rounded-sm bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center text-[#9A5B2E]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-heading-latin rtl:font-heading-arabic font-semibold text-[#1E1A17]">
            {t.about.section1.title}
          </h2>
          <p className="text-sm text-[#6B635B] leading-relaxed">
            {t.about.section1.content}
          </p>
        </div>

        <div className="p-8 bg-white rounded-sm border border-[#E2DAD0] space-y-3">
          <div className="w-10 h-10 rounded-sm bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center text-[#9A5B2E]">
            <Feather className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-heading-latin rtl:font-heading-arabic font-semibold text-[#1E1A17]">
            {t.about.section2.title}
          </h2>
          <p className="text-sm text-[#6B635B] leading-relaxed">
            {t.about.section2.content}
          </p>
        </div>
      </div>

      {/* 3. Materials & Craftsmanship with Macro Photos */}
      <div className="bg-[#F1ECE4]/60 border border-[#E2DAD0] rounded-sm p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest rtl:tracking-normal text-[#9A5B2E] font-semibold">
              {language === 'fr' ? 'Savoir-Faire & Matières' : 'الخامات والتشطيب'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {t.about.section3.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed">
              {t.about.section3.content}
            </p>
            <p className="text-xs text-[#6B635B] italic pt-2">
              {language === 'fr'
                ? '* Les données et spécifications de cuir peuvent être adaptées selon les arrivages et les collections d\'atelier.'
                : '* مواصفات ونوعيات الجلد قابلة للتعديل والتحديث بحسب دفعات التجهيز والتشكيلات الجديدة.'}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-sm overflow-hidden bg-white border border-[#E2DAD0]">
              <img
                src="/images/craft_leather_grain_1792953850533.jpg"
                alt="Grain de cuir naturel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-sm overflow-hidden bg-white border border-[#E2DAD0]">
              <img
                src="/images/craft_welt_stitch_1792953850875.jpg"
                alt="Détail de la couture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Brand Mission & Commitment */}
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#1E1A17] text-[#FAF8F5] flex items-center justify-center mx-auto">
          <Shield className="w-5 h-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
          {t.about.section4.title}
        </h2>
        <p className="text-base text-[#6B635B] leading-relaxed">
          {t.about.section4.content}
        </p>

        {/* CTA to Products Page */}
        <div className="pt-4">
          <button
            onClick={() => navigateTo('products')}
            className="min-h-[48px] px-8 py-3.5 bg-[#1E1A17] text-[#FAF8F5] text-sm font-semibold rounded-sm hover:bg-[#2D2723] transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <span>{t.about.ctaText}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
