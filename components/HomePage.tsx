'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS, getProductColors } from '@/data/products';
import { Product } from '@/data/types';
import {
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const { language, direction, t, navigateTo, openProductDetail, products } = useShop();

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  // Selected color variant state for each product card on homepage
  const [cardSelectedColors, setCardSelectedColors] = useState<Record<string, string>>({});

  // Real shoe styles that actually exist in the collection
  const collectionCategories = [
    {
      key: 'oxford',
      title: language === 'fr' ? 'Richelieu Oxford' : 'أوكسفورد كلاسيكي (Oxford)',
      desc: language === 'fr'
        ? 'Lignes pures et laçage fermé pour les cérémonies et les tenues formelles.'
        : 'القصة الأكثر رسمية برباط مغلق وأناقة نقية للمناسبات والبدلات الفاخرة.',
      image: '/images/hero_oxford_leather_1792953837188.jpg',
      badge: language === 'fr' ? 'Cérémonie & Affaires' : 'للمناسبات والعمل',
    },
    {
      key: 'derby',
      title: language === 'fr' ? 'Derby' : 'ديربي (Derby)',
      desc: language === 'fr'
        ? 'Laçage ouvert adaptable pour un confort souverain au quotidien.'
        : 'مرونة عالية وراحة إضافية لمشط القدم بفضل الأربطة المفتوحة.',
      image: '/images/biaz_oxford_dark_brown.jpg',
      badge: language === 'fr' ? 'Élégance quotidienne' : 'أناقة يومية راقية',
    },
    {
      key: 'loafer',
      title: language === 'fr' ? 'Mocassin Penny Loafer' : 'موكاسين (Penny Loafer)',
      desc: language === 'fr'
        ? 'Enfilage immédiat et cambrure soignée pour une allure méditerranéenne.'
        : 'تصميم انسيابي عملي وخفيف الوزن، يجمع بين البساطة والتميز.',
      image: '/images/biaz_loafer_noir.jpg',
      badge: language === 'fr' ? 'Casual Chic' : 'إطلالة عصرية أنيقة',
    },
    {
      key: 'boot',
      title: language === 'fr' ? 'Bottine Chelsea' : 'بوت الكاحل (Chelsea Boot)',
      desc: language === 'fr'
        ? 'Maintien protecteur et silhouette racée taillée pour la ville.'
        : 'حضور واثق وتصميم محكم يحتضن القدم بثبات في مختلف الفصول.',
      image: '/images/biaz_oxford_cognac.jpg',
      badge: language === 'fr' ? 'Caractère affirmé' : 'قوة وثبات وأناقة',
    },
  ];

  // Featured / Best-selling products from real database
  const productList = (products && products.length > 0) ? products : PRODUCTS;
  const bestSellers = productList.filter((p) => p.isBestSeller);
  const featuredProducts = (bestSellers.length > 0 ? bestSellers : productList).slice(0, 6);

  // Craftsmanship spotlight items using verified images
  const craftsmanshipItems = [
    {
      image: '/images/craft_leather_grain_1792953850533.jpg',
      title: language === 'fr' ? 'Sélection rigoureuse des cuirs' : 'انتقاء دقيق لأجود الجلود',
      desc: language === 'fr'
        ? 'Une fleur de cuir naturelle qui préserve sa souplesse et développe une patine profonde au fil des ports.'
        : 'جلود ذات ملمس طبيعي ناعم تحتفظ بمرونتها وتكتسب بريقاً معتقاً ومميزاً بمرور الوقت.',
    },
    {
      image: '/images/craft_welt_stitch_1792953850875.jpg',
      title: language === 'fr' ? 'Assemblage & coutures précises' : 'خياطة محكمة وتجميع متقن',
      desc: language === 'fr'
        ? 'Chaque empiècement est aligné et cousu avec régularité pour garantir un maintien durable sans affaissement.'
        : 'درزات متناسقة ومشدودة بعناية لضمان ثبات هيكل الحذاء وتحمله للاستعمال المتكرر.',
    },
    {
      image: '/images/craft_leather_sole_1792953851868.jpg',
      title: language === 'fr' ? 'Semelle robuste & équilibrée' : 'نعل متين بتوازن مدروس',
      desc: language === 'fr'
        ? 'Une assise solide travaillée pour offrir un appui franc, isoler de la dureté du sol et favoriser une marche sereine.'
        : 'قاعدة متينة صُممت لتوفير استقرار تام وعزل ممتاز للأرضية لراحة القدمين طوال ساعات المشي.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 text-[#1E1A17]">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION (الواجهة الرئيسية الافتتاحية)                 */}
      {/* ============================================================ */}
      <section className="relative bg-[#F7F5F0] border-b border-[#E2DAD0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Editorial Content (Left/Right depending on language) */}
            <div className="lg:col-span-5 text-start space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E2DAD0] rounded-xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A5B2E]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1E1A17]">
                  {language === 'fr' ? 'BIAZ · Souliers d’exception' : 'BIAZ · أحذية جلدية أصيلة'}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] leading-[1.15] tracking-tight">
                  {language === 'fr'
                    ? "L'élégance se révèle dans les détails."
                    : 'أناقة تبدأ من التفاصيل'}
                </h1>
                <p className="text-sm sm:text-base text-[#4A433D] leading-relaxed max-w-lg">
                  {language === 'fr'
                    ? "Des souliers d'exception alliant raffinement classique et confort absolu, confectionnés avec rigueur au Maroc."
                    : 'صناعة أحذية جلدية تجمع بين الفخامة الكلاسيكية وراحة المشي، مصممة بعناية للرجل الأنيق في المغرب.'}
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="min-h-[48px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs sm:text-sm font-bold py-3 px-8 rounded-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm group"
                >
                  <span>{language === 'fr' ? 'Découvrir la collection' : 'اكتشف المجموعة'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('track-order')}
                  className="min-h-[48px] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] border border-[#E2DAD0] text-xs sm:text-sm font-semibold py-3 px-6 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5 text-[#9A5B2E]" />
                  <span>{language === 'fr' ? 'Suivre ma commande' : 'تتبع طلبك'}</span>
                </button>
              </div>

              {/* Discreet Service Badges */}
              <div className="pt-4 border-t border-[#E2DAD0]/80 grid grid-cols-2 gap-3 text-xs text-[#6B635B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                  <span>{language === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#9A5B2E] shrink-0" />
                  <span>{language === 'fr' ? 'Essayage à domicile' : 'معاينة وقياس منزلي'}</span>
                </div>
              </div>
            </div>

            {/* Authentic Showcase Image */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-white border border-[#E2DAD0] shadow-sm">
                <img
                  src="/images/hero_oxford_leather_1792953837188.jpg"
                  alt="BIAZ Oxford Leather Shoe"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. COLLECTION DISCOVERY (اكتشاف المجموعة حسب النوع)         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-[#E2DAD0]">
          <div className="text-start space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#9A5B2E] font-bold">
              {language === 'fr' ? 'Styles & Modèles' : 'أنواع وتصاميم الأحذية'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Explorer par type de soulier' : 'استكشف التشكيلة حسب النوع'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9A5B2E] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'fr' ? 'Tous les modèles' : 'عرض كافة الموديلات'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Real Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collectionCategories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => navigateTo('products', cat.key)}
              className="group cursor-pointer bg-white rounded-sm border border-[#E2DAD0] overflow-hidden hover:border-[#1E1A17]/60 transition-all shadow-2xs hover:shadow-sm flex flex-col text-start"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F7F5F0] relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-xs bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#1E1A17] border border-[#E2DAD0]">
                  {cat.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] group-hover:text-[#9A5B2E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2DAD0]/60 flex items-center justify-between text-xs font-bold text-[#1E1A17] group-hover:text-[#9A5B2E]">
                  <span>{language === 'fr' ? 'Découvrir' : 'تصفح الموديل'}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED PRODUCTS (المنتجات المميزة مع تبديل الألوان)     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-3 border-b border-[#E2DAD0]">
          <div className="text-start space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#9A5B2E] font-bold">
              {language === 'fr' ? 'Sélection BIAZ' : 'أحذية مختارة'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Les modèles les plus demandés' : 'الأكثر طلبًا وتميّزًا'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#9A5B2E] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'fr' ? 'Voir toute la collection' : 'عرض كامل التشكيلة'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => {
            const colors = getProductColors(product);
            const activeColorId = cardSelectedColors[product.id] || colors[0]?.id;
            const activeColorVariant = colors.find((c) => c.id === activeColorId) || colors[0];

            // Primary image for active color or fallback to product image
            const cardImageUrl = activeColorVariant?.images?.[0]?.url || product.images?.[0]?.url;
            const activeColorName = language === 'fr' ? activeColorVariant?.colorNameFr : activeColorVariant?.colorNameAr;
            const shoeTypeDisplay = language === 'fr' ? product.shoeTypeFr : product.shoeTypeAr;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-sm border border-[#E2DAD0] overflow-hidden hover:border-[#1E1A17]/70 transition-all shadow-2xs hover:shadow-md flex flex-col text-start"
              >
                {/* Product Image Clickable to Detail */}
                <div
                  onClick={() => openProductDetail(product.id)}
                  className="aspect-[4/3] bg-[#F7F5F0] overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={cardImageUrl}
                    alt={product.modelName}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#9A5B2E] uppercase tracking-wider block">
                      {shoeTypeDisplay}
                    </span>

                    <h3
                      onClick={() => openProductDetail(product.id)}
                      className="text-lg font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] hover:text-[#9A5B2E] transition-colors cursor-pointer"
                    >
                      {product.modelName}
                    </h3>

                    {/* Price in MAD */}
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="font-mono text-xl font-extrabold text-[#1E1A17]">
                        {product.priceMAD.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-[#1E1A17]">
                        {t.products.mad}
                      </span>
                    </div>

                    {/* Interactive Color Variant Thumbnails (if multiple exist) */}
                    {colors.length > 1 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6B635B] mb-1.5">
                          <span>{language === 'fr' ? 'Couleur :' : 'اللون:'}</span>
                          <span className="font-semibold text-[#1E1A17]">{activeColorName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {colors.map((c) => {
                            const isSelected = c.id === activeColorVariant.id;
                            const thumbUrl = c.images?.[0]?.url || product.images?.[0]?.url;
                            const cName = language === 'fr' ? c.colorNameFr : c.colorNameAr;

                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setCardSelectedColors((prev) => ({ ...prev, [product.id]: c.id }))}
                                className={`relative w-8 h-8 rounded-xs overflow-hidden border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'ring-2 ring-[#1E1A17] ring-offset-1 border-transparent shadow-xs'
                                    : 'border-[#E2DAD0] hover:border-[#1E1A17]/60 opacity-80 hover:opacity-100'
                                }`}
                                title={cName}
                              >
                                <img
                                  src={thumbUrl}
                                  alt={cName}
                                  className="w-full h-full object-cover"
                                />
                                <span
                                  className="absolute bottom-0.5 right-0.5 rtl:right-auto rtl:left-0.5 w-2 h-2 rounded-full border border-white shadow-2xs"
                                  style={{ backgroundColor: c.colorHex }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Single Clean Action Button */}
                  <div className="pt-3 border-t border-[#E2DAD0]/60">
                    <button
                      type="button"
                      onClick={() => openProductDetail(product.id)}
                      className="w-full min-h-[44px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold py-2.5 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Commander' : 'اطلب الآن'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PRODUCT DETAILS & CRAFTSMANSHIP (إبراز تفاصيل المنتج)     */}
      {/* ============================================================ */}
      <section className="bg-[#F7F5F0] border-y border-[#E2DAD0] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <span className="text-xs uppercase tracking-wider text-[#9A5B2E] font-bold">
              {language === 'fr' ? 'La signature BIAZ' : 'بصمة الصنعة والإتقان'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Les détails qui font la différence' : 'تفاصيل تصنع الفارق في كل خطوة'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
              {language === 'fr'
                ? 'Une observation attentive de la matière, des coutures et de la structure qui composent chaque paire.'
                : 'معاينة واقعية لملمس الجلود الطبيعية ودقة الخياطة وتوازن النعل.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {craftsmanshipItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2DAD0] rounded-sm overflow-hidden text-start shadow-2xs"
              >
                <div className="aspect-[4/3] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-bold text-[#1E1A17]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B635B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BIAZ STORY & PHILOSOPHY (قصة BIAZ وفلسفتها)               */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E2DAD0] rounded-sm p-8 sm:p-12 shadow-2xs">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#9A5B2E] font-bold">
              <span>{language === 'fr' ? 'À propos de BIAZ' : 'عن دار BIAZ'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] leading-tight">
              {language === 'fr'
                ? "L'engagement d'une élégance sobre et accessible au Maroc."
                : 'التزام بالأناقة الهادئة والذوق الرفيع بالمغرب'}
            </h2>

            <p className="text-xs sm:text-sm text-[#4A433D] leading-relaxed">
              {language === 'fr'
                ? "BIAZ est née de la volonté d'offrir aux hommes des souliers en cuir alliant pureté des lignes classiques et confort d'usage. Nous privilégions une sélection rigoureuse des modèles, des finitions nettes et une relation directe avec chaque client, sans intermédiaires superflus."
                : 'انطلقت دار BIAZ من رؤية واضحة لتقديم أحذية جلدية تجمع بين نقاء الخطوط الكلاسيكية والراحة العملية اليومية. نركز على اختيار الموديلات بعناية، والاهتمام بالتشطيب المتقن، مع خدمة عملاء مباشرة وموثوقة تضع رضاكم في المقام الأول.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#9A5B2E] hover:text-[#1E1A17] transition-colors cursor-pointer group"
              >
                <span>{language === 'fr' ? 'En savoir plus sur notre philosophie' : 'تعرف أكثر على فلسفة BIAZ'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TRUST & SERVICE (الثقة والخدمات الموثوقة للمتجر)           */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          
          {/* Service 1: Home fitting */}
          <div className="p-6 bg-white border border-[#E2DAD0] rounded-sm space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center text-[#9A5B2E]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Essayage à domicile' : 'معاينة وقياس منزلي مريح'}
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {language === 'fr'
                ? 'Essayez tranquillement votre paire dès l’arrivée du livreur pour valider la pointure et le confort avant tout engagement.'
                : 'يمكنكم تجربة الحذاء بهدوء عند وصول الموزع والتأكد من مطابقة المقاس والراحة التامة قبل الدفع.'}
            </p>
          </div>

          {/* Service 2: Cash on Delivery */}
          <div className="p-6 bg-white border border-[#E2DAD0] rounded-sm space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center text-[#2F6B4F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Paiement à la livraison' : 'الدفع نقداً عند الاستلام'}
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {language === 'fr'
                ? 'Réglez votre commande en espèces directement auprès du transporteur après avoir vérifié votre produit.'
                : 'تسديد قيمة الحذاء مباشرة للموزع نقداً بعد فحص الطلب والتأكد من جودته ومقاسه.'}
            </p>
          </div>

          {/* Service 3: Real order tracking */}
          <div className="p-6 bg-white border border-[#E2DAD0] rounded-sm space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E2DAD0] flex items-center justify-center text-[#1E1A17]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1A17]">
              {language === 'fr' ? 'Suivi de commande direct' : 'تتبع مباشر لحالة الطلب'}
            </h3>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {language === 'fr'
                ? 'Consultez l’état d’avancement de votre commande à tout moment grâce à notre outil de suivi en ligne.'
                : 'تابعوا مرحلة معالجة طلبكم وموعد خروجه للتسليم في أي وقت عبر صفحة تتبع الطلبات المخصصة.'}
            </p>
            <button
              type="button"
              onClick={() => navigateTo('track-order')}
              className="text-xs font-bold text-[#9A5B2E] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{language === 'fr' ? 'Accéder au suivi' : 'الانتقال لصفحة التتبع'}</span>
              <ArrowIcon className="w-3 h-3" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
