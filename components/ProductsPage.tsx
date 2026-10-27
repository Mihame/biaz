'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { MessageCircle, Filter, ArrowUpDown, Eye } from 'lucide-react';
import { Product } from '@/data/types';

export default function ProductsPage() {
  const {
    t,
    language,
    selectedStyleFilter,
    setSelectedStyleFilter,
    openProductDetail,
    openWhatsAppForProduct,
  } = useShop();

  const activeFilter = selectedStyleFilter || 'all';
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

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
    let list: Product[] = [...PRODUCTS];

    if (activeFilter !== 'all') {
      list = list.filter((p) => p.style === activeFilter);
    }

    if (sortBy === 'asc') {
      list.sort((a, b) => a.priceMAD - b.priceMAD);
    } else if (sortBy === 'desc') {
      list.sort((a, b) => b.priceMAD - a.priceMAD);
    }

    return list;
  }, [activeFilter, sortBy]);

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
            const displayName = language === 'fr'
              ? `${product.modelName} ${product.colorNameFr}`
              : `${product.modelName} ${product.colorNameAr}`;
            const displayType = language === 'fr' ? product.shoeTypeFr : product.shoeTypeAr;
            const displayColor = language === 'fr' ? product.colorNameFr : product.colorNameAr;
            const currentSelectedSize = selectedSizes[product.id] || 0;

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
                    src={product.images[0]?.url || '/images/hero_oxford_leather_1792953837188.jpg'}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.colorHex && (
                    <div
                      className="absolute top-3 end-3 w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: product.colorHex }}
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
                    <span className="text-[11px] uppercase tracking-wider rtl:tracking-normal text-[#9A5B2E] font-medium block">
                      {displayType}
                    </span>
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
                        {t.products.colorsLabel} {displayColor}
                      </span>
                    </div>

                    {/* Sizes Selection Preview */}
                    <div className="mt-3 pt-2 border-t border-[#E2DAD0]/60">
                      <span className="text-[11px] font-medium text-[#1E1A17] block mb-1.5">
                        {t.products.sizesLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.availableSizes.slice(0, 7).map((sizeObj) => {
                          const isSelected = currentSelectedSize === sizeObj.eu;
                          return (
                            <button
                              key={sizeObj.eu}
                              type="button"
                              onClick={() => handleSizeSelect(product.id, sizeObj.eu)}
                              className={`w-7 h-7 text-[11px] rounded-xs font-medium border flex items-center justify-center transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1E1A17] text-white border-[#1E1A17]'
                                  : 'bg-[#FAF8F5] text-[#1E1A17] border-[#E2DAD0] hover:border-[#1E1A17]'
                              }`}
                              title={language === 'fr' ? `Pointure ${sizeObj.eu}` : `المقاس ${sizeObj.eu}`}
                            >
                              {sizeObj.eu}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA: Open Product Details & Complete Order */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => openProductDetail(product.id)}
                      className="w-full min-h-[44px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold py-2.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      aria-label={`Voir les détails et commander ${displayName}`}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>{t.products.viewDetails}</span>
                    </button>

                    {/* Quick WhatsApp button */}
                    <button
                      onClick={() => openWhatsAppForProduct(displayName, product.priceMAD, currentSelectedSize || undefined)}
                      className="w-full min-h-[36px] bg-[#FAF8F5] hover:bg-[#25D366] hover:text-white text-[#1E1A17] border border-[#E2DAD0] text-xs font-medium py-1.5 px-3 rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      aria-label={`Commander ${displayName} via WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {t.products.orderButton}
                        {currentSelectedSize ? ` (${currentSelectedSize})` : ''}
                      </span>
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
