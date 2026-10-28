'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS, getProductColors } from '@/data/products';
import { Filter, ArrowUpDown, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/types';

export default function ProductsPage() {
  const {
    t,
    language,
    selectedStyleFilter,
    setSelectedStyleFilter,
    openProductDetail,
    products,
  } = useShop();

  const activeFilter = selectedStyleFilter || 'all';
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [cardActiveColors, setCardActiveColors] = useState<Record<string, string>>({});

  const handleFilterChange = (filter: string) => {
    setSelectedStyleFilter(filter === 'all' ? null : filter);
  };

  const handleSizeSelect = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: prev[productId] === size ? 0 : size, // toggle
    }));
  };

  const filterOptions = [
    { key: 'all', label: t.products.filterAll },
    { key: 'oxford', label: t.products.filterOxford },
    { key: 'derby', label: t.products.filterDerby },
    { key: 'loafer', label: t.products.filterLoafer },
    { key: 'boot', label: t.products.filterBoot },
  ];

  const filteredProducts = useMemo(() => {
    const sourceList = (products && products.length > 0) ? products : PRODUCTS;
    let list: Product[] = [...sourceList];

    if (activeFilter !== 'all') {
      list = list.filter((p) => p.style === activeFilter);
    }

    if (sortBy === 'asc') {
      list.sort((a, b) => a.priceMAD - b.priceMAD);
    } else if (sortBy === 'desc') {
      list.sort((a, b) => b.priceMAD - a.priceMAD);
    }

    return list;
  }, [activeFilter, sortBy, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header section */}
      <div className="text-start space-y-3 pb-6 border-b border-[#E2DAD0]">
        <h1 className="text-3xl sm:text-4xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
          {t.products.pageTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#6B635B] max-w-2xl">
          {t.products.pageSubtitle}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-sm border border-[#E2DAD0]">
        
        {/* Style Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-[#9A5B2E] shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleFilterChange(opt.key)}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === opt.key
                  ? 'bg-[#1E1A17] text-white'
                  : 'bg-[#F1ECE4]/80 text-[#1E1A17] hover:bg-[#F1ECE4]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#6B635B]" />
          <span className="text-xs text-[#6B635B]">{t.products.sortBy} :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-[#FAF8F5] border border-[#E2DAD0] rounded-sm py-1.5 px-2.5 text-[#1E1A17] focus:outline-none focus:border-[#9A5B2E] cursor-pointer"
          >
            <option value="default">{t.products.sortDefault}</option>
            <option value="asc">{t.products.sortPriceAsc}</option>
            <option value="desc">{t.products.sortPriceDesc}</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-sm border border-[#E2DAD0] p-8">
          <p className="text-[#6B635B] text-sm">{t.products.noResults}</p>
          <button
            onClick={() => handleFilterChange('all')}
            className="mt-4 px-4 py-2 bg-[#1E1A17] text-white text-xs rounded-sm"
          >
            {t.products.filterAll}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const colors = getProductColors(product);
            const activeColorId = cardActiveColors[product.id] || colors[0]?.id;
            const activeColor = colors.find((c) => c.id === activeColorId) || colors[0];
            const activeImage = activeColor?.images?.[0]?.url || product.images?.[0]?.url || '/images/hero_oxford_leather_1792953837188.jpg';

            const activeColorName = language === 'fr' ? activeColor?.colorNameFr : activeColor?.colorNameAr;
            const displayName = language === 'fr'
              ? `${product.modelName} ${activeColorName || product.colorNameFr}`
              : `${product.modelName} ${activeColorName || product.colorNameAr}`;
            const displayType = language === 'fr' ? product.shoeTypeFr : product.shoeTypeAr;
            const displayColor = activeColorName || (language === 'fr' ? product.colorNameFr : product.colorNameAr);
            const currentSelectedSize = selectedSizes[product.id] || 0;

            const cardSizes = (activeColor?.availableSizes && activeColor.availableSizes.length > 0)
              ? activeColor.availableSizes
              : product.availableSizes;

            return (
              <div
                key={product.id}
                className="bg-white rounded-sm border border-[#E2DAD0] overflow-hidden flex flex-col justify-between hover:border-[#9A5B2E] transition-all shadow-xs group"
              >
                {/* Product Image - Clickable to open full gallery and detail view */}
                <div
                  onClick={() => openProductDetail(product.id)}
                  className="aspect-4/3 bg-[#F1ECE4] relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={activeImage}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {activeColor?.colorHex && (
                    <div
                      className="absolute top-3 end-3 w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: activeColor.colorHex }}
                      title={displayColor}
                    />
                  )}
                  {/* Subtle hover prompt to view details & zoom */}
                  <div className="absolute inset-0 bg-[#1E1A17]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <span className="bg-white/95 text-[#1E1A17] text-xs font-semibold px-3 py-1.5 rounded-xs shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                      <Eye className="w-3.5 h-3.5 text-[#9A5B2E]" />
                      <span>{t.products.viewDetails}</span>
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between text-start space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] uppercase tracking-wider rtl:tracking-normal text-[#9A5B2E] font-medium block truncate">
                        {displayType}
                      </span>
                      {colors.length > 1 && (
                        <span className="text-[10px] font-semibold text-[#6B635B] px-1.5 py-0.5 rounded-xs bg-[#FAF8F5] border border-[#E2DAD0] shrink-0">
                          {colors.length} {language === 'fr' ? (colors.length > 1 ? 'couleurs' : 'couleur') : (colors.length === 2 ? 'لونان' : colors.length > 2 ? 'ألوان' : 'لون')}
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => openProductDetail(product.id)}
                      className="text-base font-semibold text-[#1E1A17] mt-0.5 leading-snug cursor-pointer hover:text-[#9A5B2E] transition-colors"
                    >
                      {displayName}
                    </h2>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base font-bold text-[#1E1A17]">
                        {product.priceMAD.toLocaleString()} {t.products.mad}
                      </span>
                      <span className="text-[11px] text-[#6B635B]">
                        {displayColor}
                      </span>
                    </div>

                    {/* Color Swatches Thumbnails */}
                    {colors.length > 1 && (
                      <div className="mt-2.5 pt-2 border-t border-[#E2DAD0]/60">
                        <span className="text-[10px] text-[#6B635B] block mb-1">
                          {language === 'fr' ? 'Couleurs disponibles :' : 'الألوان المتوفرة :'}
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {colors.map((c) => {
                            const isColorSelected = c.id === activeColor.id;
                            const cName = language === 'fr' ? c.colorNameFr : c.colorNameAr;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardActiveColors((prev) => ({ ...prev, [product.id]: c.id }));
                                }}
                                className={`w-6 h-6 rounded-xs overflow-hidden border transition-all cursor-pointer relative ${
                                  isColorSelected
                                    ? 'ring-2 ring-[#9A5B2E] ring-offset-1 border-[#1E1A17] scale-110 shadow-xs'
                                    : 'border-[#E2DAD0] opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                                title={cName}
                              >
                                <img
                                  src={c.images?.[0]?.url || activeImage}
                                  alt={cName}
                                  className="w-full h-full object-cover"
                                />
                                <span
                                  className="absolute bottom-0 end-0 w-2 h-2 rounded-full border border-white"
                                  style={{ backgroundColor: c.colorHex }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sizes Selection Preview */}
                    <div className="mt-2.5 pt-2 border-t border-[#E2DAD0]/60">
                      <span className="text-[11px] font-medium text-[#1E1A17] block mb-1.5">
                        {t.products.sizesLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cardSizes.slice(0, 7).map((sizeObj) => {
                          const isSelected = currentSelectedSize === sizeObj.eu;
                          const isUnavailable = (sizeObj.stock !== undefined && sizeObj.stock <= 0) || activeColor?.inStock === false;
                          return (
                            <button
                              key={sizeObj.eu}
                              type="button"
                              disabled={isUnavailable}
                              onClick={() => {
                                if (isUnavailable) return;
                                handleSizeSelect(product.id, sizeObj.eu);
                              }}
                              className={`w-7 h-7 text-[11px] rounded-xs font-medium border flex items-center justify-center transition-colors ${
                                isUnavailable
                                  ? 'opacity-30 bg-[#FAF8F5] text-[#A8A29E] border-dashed cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#1E1A17] text-white border-[#1E1A17] cursor-pointer'
                                  : 'bg-[#FAF8F5] text-[#1E1A17] border-[#E2DAD0] hover:border-[#1E1A17] cursor-pointer'
                              }`}
                              title={
                                isUnavailable
                                  ? (language === 'fr' ? 'Épuisé' : 'نفد')
                                  : (language === 'fr' ? `Pointure ${sizeObj.eu}` : `المقاس ${sizeObj.eu}`)
                              }
                            >
                              {sizeObj.eu}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Single Action Button: Commander / اطلب الآن */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openProductDetail(product.id)}
                      className="w-full min-h-[44px] bg-[#1E1A17] hover:bg-[#2C241E] active:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      aria-label={`${language === 'fr' ? 'Commander' : 'اطلب الآن'} ${displayName}`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0 text-[#C48A58]" />
                      <span>{language === 'fr' ? 'Commander' : 'اطلب الآن'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Order Instructions Note */}
      <div className="p-4 bg-[#F1ECE4]/60 rounded-sm border border-[#E2DAD0] text-center text-xs text-[#6B635B]">
        <p>{t.products.sizeHint}</p>
      </div>

    </div>
  );
}
