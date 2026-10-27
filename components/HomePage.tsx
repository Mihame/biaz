'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { MessageCircle, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '@/data/translations';

export default function HomePage() {
  const {
    t,
    language,
    direction,
    navigateTo,
    openProductDetail,
    openWhatsApp,
    openWhatsAppForProduct,
  } = useShop();

  const featuredProducts = PRODUCTS.slice(0, 4);

  const shoeTypes = [
    {
      key: 'oxford',
      title: t.home.types.oxford.name,
      desc: t.home.types.oxford.desc,
      image: '/images/hero_oxford_leather_1792953837188.jpg',
    },
    {
      key: 'derby',
      title: t.home.types.derby.name,
      desc: t.home.types.derby.desc,
      image: '/images/craft_leather_grain_1792953850533.jpg',
    },
    {
      key: 'loafer',
      title: t.home.types.loafer.name,
      desc: t.home.types.loafer.desc,
      image: '/images/craft_leather_sole_1792953851868.jpg',
    },
    {
      key: 'boot',
      title: t.home.types.boot.name,
      desc: t.home.types.boot.desc,
      image: '/images/craft_welt_stitch_1792953850875.jpg',
    },
  ];

  const craftCards = [
    {
      image: '/images/craft_leather_grain_1792953850533.jpg',
      title: t.home.craftItems[0].title,
      desc: t.home.craftItems[0].desc,
    },
    {
      image: '/images/craft_welt_stitch_1792953850875.jpg',
      title: t.home.craftItems[1].title,
      desc: t.home.craftItems[1].desc,
    },
    {
      image: '/images/craft_calf_lining_1792953852032.jpg',
      title: t.home.craftItems[2].title,
      desc: t.home.craftItems[2].desc,
    },
    {
      image: '/images/craft_leather_sole_1792953851868.jpg',
      title: t.home.craftItems[3].title,
      desc: t.home.craftItems[3].desc,
    },
  ];

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-10 sm:pt-16 space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Shoe Types Section (أنواع الأحذية المتوفرة) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
            {t.home.categoriesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#6B635B]">
            {t.home.categoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shoeTypes.map((type) => (
            <div
              key={type.key}
              onClick={() => navigateTo('products', type.key)}
              className="group cursor-pointer bg-white rounded-sm border border-[#E2DAD0] overflow-hidden hover:border-[#9A5B2E]/60 transition-all hover:shadow-md flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden bg-[#F1ECE4]">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between text-start">
                <div>
                  <h3 className="text-lg font-heading-latin rtl:font-heading-arabic font-semibold text-[#1E1A17] group-hover:text-[#9A5B2E] transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] mt-1 line-clamp-2">
                    {type.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2DAD0]/60 flex items-center justify-between text-xs font-semibold text-[#9A5B2E]">
                  <span>{language === 'fr' ? 'Découvrir' : 'استكشف الموديل'}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section (قسم المنتجات المميزة) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E2DAD0]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {t.home.featuredTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B] mt-1">
              {t.home.featuredSubtitle}
            </p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A5B2E] hover:underline cursor-pointer"
          >
            <span>{t.home.viewAllProducts}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const displayName = language === 'fr' ? `${product.modelName} ${product.colorNameFr}` : `${product.modelName} ${product.colorNameAr}`;
            const displayType = language === 'fr' ? product.shoeTypeFr : product.shoeTypeAr;

            return (
              <div
                key={product.id}
                className="bg-white rounded-sm border border-[#E2DAD0] overflow-hidden flex flex-col justify-between hover:border-[#9A5B2E] transition-all shadow-xs group"
              >
                {/* Clickable Image */}
                <div
                  onClick={() => openProductDetail(product.id)}
                  className="aspect-4/3 bg-[#F1ECE4] overflow-hidden cursor-pointer relative"
                >
                  <img
                    src={product.images[0]?.url || '/images/hero_oxford_leather_1792953837188.jpg'}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#1E1A17]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <span className="bg-white/95 text-[#1E1A17] text-xs font-semibold px-3 py-1.5 rounded-xs shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                      <Eye className="w-3.5 h-3.5 text-[#9A5B2E]" />
                      <span>{t.products.viewDetails}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between text-start space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9A5B2E] font-medium block">
                      {displayType}
                    </span>
                    <h3
                      onClick={() => openProductDetail(product.id)}
                      className="text-base font-semibold text-[#1E1A17] mt-0.5 cursor-pointer hover:text-[#9A5B2E] transition-colors"
                    >
                      {displayName}
                    </h3>
                    <p className="text-base font-bold text-[#1E1A17] mt-1">
                      {product.priceMAD.toLocaleString()} {t.products.mad}
                    </p>
                    <p className="text-[11px] text-[#6B635B] mt-1">
                      {language === 'fr' ? 'Pointures : 39 à 46 · En stock' : 'المقاسات: 39 إلى 46 · متوفر للشحن'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => openProductDetail(product.id)}
                      className="w-full min-h-[42px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold py-2 px-3 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      aria-label={`Voir les détails de ${displayName}`}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>{t.products.viewDetails}</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppForProduct(displayName, product.priceMAD)}
                      className="w-full min-h-[36px] bg-[#FAF8F5] hover:bg-[#25D366] hover:text-white text-[#1E1A17] border border-[#E2DAD0] text-xs font-medium py-1.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      aria-label={`Commander ${displayName} via WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.home.orderWhatsapp}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Craftsmanship & Shoe Details Section (قسم يبرز تفاصيل الأحذية) */}
      <section className="bg-[#F1ECE4]/60 border-y border-[#E2DAD0] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {t.home.craftTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#6B635B]">
              {t.home.craftSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {craftCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-sm border border-[#E2DAD0] p-4 space-y-4 text-start">
                <div className="aspect-4/3 rounded-xs overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-[#1E1A17]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Short Brand Introduction (قسم قصير يقدم العلامة التجارية) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#9A5B2E] font-semibold">
          BIAZ Shoes
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
          {t.home.brandTeaser.title}
        </h2>
        <p className="text-base text-[#6B635B] leading-relaxed">
          {t.home.brandTeaser.text}
        </p>
        <div>
          <button
            onClick={() => navigateTo('about')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E1A17] hover:text-[#9A5B2E] border-b border-[#1E1A17] hover:border-[#9A5B2E] pb-1 transition-colors cursor-pointer"
          >
            <span>{t.home.brandTeaser.linkText}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. WhatsApp Customer Assistance Section (قسم للتواصل مع العملاء عبر WhatsApp) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1A17] text-[#FAF8F5] rounded-sm p-8 sm:p-12 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-white">
              {t.home.whatsappSection.title}
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F5]/80">
              {t.home.whatsappSection.subtitle}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openWhatsApp()}
              className="min-h-[48px] px-8 py-3 bg-[#25D366] text-white font-semibold text-sm rounded-sm hover:bg-[#20ba5a] transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.home.whatsappSection.buttonText}</span>
            </button>
            <span className="text-xs text-[#FAF8F5]/80">
              {t.home.whatsappSection.numberText}{' '}
              <span dir="ltr" className="inline-block font-sans font-semibold text-white">{WHATSAPP_DISPLAY}</span>
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
