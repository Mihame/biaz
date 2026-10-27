'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { MOROCCAN_CITIES } from '@/data/moroccoCities';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Home,
  Info,
  Loader2,
  Maximize2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const { language, direction, t, navigateTo } = useShop();
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  // Image Gallery & Zoom State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Selection State
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'delivery'>('specs');

  // Checkout Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]?.nameAr || 'الدار البيضاء');
  const [customCity, setCustomCity] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<{
    size?: string;
    fullName?: string;
    phone?: string;
    city?: string;
    address?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<any | null>(null);
  const [hasCopiedRef, setHasCopiedRef] = useState(false);

  const orderFormRef = useRef<HTMLDivElement>(null);
  const sizeSelectorRef = useRef<HTMLDivElement>(null);

  const ArrowBackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const PrevIcon = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const displayName = language === 'fr'
    ? `${product.modelName} ${product.colorNameFr}`
    : `${product.modelName} ${product.colorNameAr}`;
  const displayType = language === 'fr' ? product.shoeTypeFr : product.shoeTypeAr;
  const displayColor = language === 'fr' ? product.colorNameFr : product.colorNameAr;
  const displayDesc = language === 'fr' ? product.descriptionFr : product.descriptionAr;
  const displayAdvice = language === 'fr' ? product.betweenSizesAdviceFr : product.betweenSizesAdviceAr;
  const careGuide = language === 'fr' ? product.careGuideFr : product.careGuideAr;

  // Helper to sanitize placeholder text in specs
  const cleanSpec = (text: string) => {
    return text.replace(/^\[PLACEHOLDER\s*:\s*/i, '').replace(/\]$/, '').trim();
  };

  // Strictly enforce maximum 3 authentic images per product as requested
  const images = (product.images && product.images.length > 0 ? product.images : [
    {
      label: 'Vue principale',
      angle: 'side' as const,
      url: '/images/hero_oxford_leather_1792953837188.jpg',
      alt: displayName,
    },
  ]).slice(0, 3);

  const safeActiveIndex = Math.min(activeImageIndex, Math.max(0, images.length - 1));
  const currentImage = images[safeActiveIndex] || images[0];

  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const scrollToSlide = (idx: number) => {
    setActiveImageIndex(idx);
    if (mobileScrollRef.current) {
      const width = mobileScrollRef.current.offsetWidth;
      mobileScrollRef.current.scrollTo({
        left: idx * width,
        behavior: 'smooth',
      });
    }
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.offsetWidth || 1;
    const scrollLeft = Math.abs(container.scrollLeft);
    const newIdx = Math.min(images.length - 1, Math.max(0, Math.round(scrollLeft / width)));
    if (newIdx !== activeImageIndex) {
      setActiveImageIndex(newIdx);
    }
  };

  // Keyboard navigation for zoom lightbox
  useEffect(() => {
    if (!isZoomOpen) return;
    const total = images.length;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setZoomScale(1);
      } else if (e.key === 'ArrowRight') {
        if (direction === 'rtl') {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
        } else {
          setActiveImageIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowLeft') {
        if (direction === 'rtl') {
          setActiveImageIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
        } else {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, direction, images.length]);

  const handleScrollToOrder = () => {
    if (!selectedSize) {
      setFormErrors((prev) => ({
        ...prev,
        size: t.orderForm.errors.sizeRequired,
      }));
      sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    if (!selectedSize) {
      errors.size = t.orderForm.errors.sizeRequired;
    }
    if (!fullName.trim()) {
      errors.fullName = t.orderForm.errors.nameRequired;
    }
    const cleanPhoneInput = phone.replace(/[\s\-\.\(\)]/g, '');
    if (!cleanPhoneInput || cleanPhoneInput.length < 9) {
      errors.phone = t.orderForm.errors.phoneRequired;
    }
    const finalCity = isCustomCity ? customCity.trim() : city.trim();
    if (!finalCity) {
      errors.city = t.orderForm.errors.cityRequired;
    }
    if (!address.trim()) {
      errors.address = t.orderForm.errors.addressRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) {
      if (!selectedSize) {
        sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const finalCity = isCustomCity ? customCity.trim() : city.trim();

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          quantity,
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: finalCity,
          address: address.trim(),
          notes: notes.trim(),
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.orderForm.processingError);
      }

      setOrderConfirmation(data.order);

      // Scroll smoothly to top so customer views the Thank You screen immediately
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('[BIAZ] Order submission failed:', err);
      setSubmissionError(
        err.message ||
          (language === 'fr'
            ? "Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez vérifier vos informations ou réessayer."
            : "حدث خطأ أثناء تسجيل طلبكم. يرجى التأكد من البيانات والمحاولة مجدداً.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAngleLabel = (angle: string, defaultLabel: string) => {
    const angleMap = t.productDetail.angles as Record<string, string>;
    return angleMap[angle] || defaultLabel;
  };

  // Dedicated In-App Thank You Screen after Successful Background Order Dispatch
  if (orderConfirmation) {
    const orderItem = orderConfirmation.item || {
      modelName: product.modelName,
      shoeTypeFr: product.shoeTypeFr,
      shoeTypeAr: product.shoeTypeAr,
      colorNameFr: product.colorNameFr,
      colorNameAr: product.colorNameAr,
      size: selectedSize,
      quantity,
      unitPriceMAD: product.priceMAD,
      totalMAD: product.priceMAD * quantity,
    };
    const orderPricing = orderConfirmation.pricing || {
      totalMAD: product.priceMAD * quantity,
      deliveryFeeMAD: 0,
    };
    const orderCustomer = orderConfirmation.customer || {
      fullName,
      phone,
      city: isCustomCity ? customCity : city,
      address,
      notes,
    };

    return (
      <div className="bg-[#FAF8F5] pb-24 text-[#1E1A17] min-h-[75vh]">
        {/* Breadcrumb & Navigation Bar */}
        <div className="border-b border-[#E2DAD0] bg-white sticky top-16 sm:top-20 z-20 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E1A17] hover:text-[#9A5B2E] transition-colors cursor-pointer group"
            >
              <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
              <span>{t.thankYou.continueShopping}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B635B]">
              <span>{t.nav.home}</span>
              <span>/</span>
              <span>{t.nav.products}</span>
              <span>/</span>
              <span className="font-semibold text-[#2F6B4F]">{t.thankYou.statusReceived}</span>
            </div>
          </div>
        </div>

        {/* Thank You Main Card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="bg-white rounded-sm border border-[#E2DAD0] p-6 sm:p-10 shadow-sm text-start space-y-8 animate-fadeIn">
            
            {/* Header: Verified Checkmark & Warm Moroccan Elegance */}
            <div className="text-center space-y-3 pb-6 border-b border-[#E2DAD0]">
              <div className="w-16 h-16 rounded-full bg-[#2F6B4F]/10 border-2 border-[#2F6B4F]/30 flex items-center justify-center text-[#2F6B4F] mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-[#2F6B4F]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
                {t.thankYou.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B635B] max-w-lg mx-auto">
                {t.thankYou.subtitle}
              </p>

              {/* Order Reference Number Display */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="inline-flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-xs border border-[#9A5B2E]/40 shadow-xs">
                  <span className="text-xs font-semibold text-[#6B635B]">{t.thankYou.orderRefLabel}</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-[#9A5B2E] tracking-wider">
                    {orderConfirmation.orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(orderConfirmation.orderId);
                      setHasCopiedRef(true);
                      setTimeout(() => setHasCopiedRef(false), 2500);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xs border border-[#E2DAD0] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] transition-colors cursor-pointer"
                >
                  {hasCopiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2F6B4F]" />
                      <span className="text-[#2F6B4F] font-bold">{t.thankYou.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#9A5B2E]" />
                      <span>{t.thankYou.copyRef}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className="pt-1 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F6B4F]/10 text-[#2F6B4F] text-xs font-bold border border-[#2F6B4F]/20">
                  <span className="w-2 h-2 rounded-full bg-[#2F6B4F] animate-pulse" />
                  <span>{t.thankYou.statusReceived}</span>
                </span>
              </div>
            </div>

            {/* Two-column summary: Order Details + Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Product Details & Price Summary */}
              <div className="p-5 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A5B2E] pb-2 border-b border-[#E2DAD0]">
                  {t.thankYou.detailsTitle}
                </h3>

                <div className="flex gap-3.5 items-center">
                  <div className="w-16 h-16 rounded-xs overflow-hidden bg-white border border-[#E2DAD0] shrink-0">
                    <img
                      src={currentImage.url}
                      alt={orderItem.modelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1E1A17] truncate">{orderItem.modelName}</h4>
                    <p className="text-xs text-[#6B635B] truncate">
                      {language === 'fr' ? orderItem.shoeTypeFr : orderItem.shoeTypeAr} · {language === 'fr' ? orderItem.colorNameFr : orderItem.colorNameAr}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-bold px-2 py-0.5 bg-[#1E1A17] text-white rounded-xs">
                        {t.orderForm.sizeLabel} {orderItem.size}
                      </span>
                      <span className="text-[#6B635B]">
                        {t.orderForm.quantityLabel} {orderItem.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E2DAD0] text-xs">
                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.unitPriceLabel}</span>
                    <span className="font-semibold text-[#1E1A17]">
                      {orderItem.unitPriceMAD.toLocaleString()} {t.products.mad}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.quantityLabel}</span>
                    <span className="font-semibold text-[#1E1A17]">x {orderItem.quantity}</span>
                  </div>
                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.deliveryLabel}</span>
                    <span className="font-bold text-[#2F6B4F]">{t.orderForm.freeDelivery}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#1E1A17]/10 text-sm">
                    <span className="font-bold text-[#1E1A17]">{t.orderForm.totalLabel}</span>
                    <span className="text-xl font-extrabold text-[#9A5B2E]">
                      {orderPricing.totalMAD.toLocaleString()} {t.products.mad}
                    </span>
                  </div>
                </div>

                {/* Cash On Delivery Assurance */}
                <div className="p-3 bg-white rounded-xs border border-[#E2DAD0] text-[11px] text-[#4A433D] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1A17]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                    <span>{t.thankYou.paymentNoticeTitle}</span>
                  </div>
                  <p className="leading-relaxed">{t.thankYou.paymentNoticeDesc}</p>
                </div>
              </div>

              {/* Delivery Details & What's Next */}
              <div className="p-5 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A5B2E] pb-2 border-b border-[#E2DAD0]">
                  {t.thankYou.customerTitle}
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#6B635B] block text-[11px]">{t.thankYou.customerName}</span>
                    <p className="font-bold text-[#1E1A17]">{orderCustomer.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[#6B635B] block text-[11px]">{t.thankYou.customerPhone}</span>
                    <p className="font-bold text-[#1E1A17]" dir="ltr">{orderCustomer.phone}</p>
                  </div>
                  <div>
                    <span className="text-[#6B635B] block text-[11px]">{t.thankYou.customerCity}</span>
                    <p className="font-semibold text-[#1E1A17]">{orderCustomer.city}</p>
                  </div>
                  <div>
                    <span className="text-[#6B635B] block text-[11px]">{t.thankYou.customerAddress}</span>
                    <p className="text-[#1E1A17] leading-relaxed">{orderCustomer.address}</p>
                  </div>
                  {orderCustomer.notes && (
                    <div>
                      <span className="text-[#6B635B] block text-[11px]">{t.thankYou.customerNotes}</span>
                      <p className="text-[#6B635B] italic">{orderCustomer.notes}</p>
                    </div>
                  )}
                </div>

                {/* Next Steps Guidance */}
                <div className="p-3 bg-white rounded-xs border border-[#E2DAD0] text-[11px] text-[#4A433D] space-y-1 mt-4">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1A17]">
                    <PackageCheck className="w-3.5 h-3.5 text-[#9A5B2E]" />
                    <span>{t.thankYou.nextStepsTitle}</span>
                  </div>
                  <p className="leading-relaxed">{t.thankYou.nextStepsDesc}</p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#2F6B4F]">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="font-semibold">{t.productDetail.freeDeliveryBadge}</span>
                </div>
              </div>

            </div>

            {/* Navigation Buttons to continue within the 4 store pages */}
            <div className="pt-4 border-t border-[#E2DAD0] flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto min-h-[44px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-xs font-bold py-2.5 px-6 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.thankYou.continueShopping}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-full sm:w-auto min-h-[44px] bg-white hover:bg-[#FAF8F5] text-[#1E1A17] border border-[#E2DAD0] text-xs font-bold py-2.5 px-6 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{t.thankYou.returnHome}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] pb-24 text-[#1E1A17]">
      {/* 1. Breadcrumb and Back Bar */}
      <div className="border-b border-[#E2DAD0] bg-white sticky top-16 sm:top-20 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E1A17] hover:text-[#9A5B2E] transition-colors cursor-pointer group"
          >
            <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            <span>{t.productDetail.backToProducts}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B635B]">
            <span>{t.nav.home}</span>
            <span>/</span>
            <span>{t.nav.products}</span>
            <span>/</span>
            <span className="font-semibold text-[#1E1A17]">{product.modelName}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Presentation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: 1. 3-Image Luxury Gallery & High-Res Inspection */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Desktop Editorial Gallery */}
            <div className="hidden sm:block space-y-3">
              {/* Primary Large Stage View */}
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative aspect-[4/3] bg-[#F7F5F0] rounded-xs border border-[#E2DAD0] overflow-hidden group cursor-zoom-in shadow-2xs"
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.alt || displayName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                />

                {/* Angle Tag Kicker */}
                <div className="absolute top-3.5 start-3.5 bg-white/95 text-[#1E1A17] text-xs px-3 py-1.5 rounded-xs border border-[#E2DAD0] font-semibold shadow-2xs flex items-center gap-1.5 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#9A5B2E]" />
                  <span>{getAngleLabel(currentImage.angle, currentImage.label)}</span>
                </div>

                {/* Minimalist Image Counter (e.g. 01 / 03) */}
                <div className="absolute top-3.5 end-3.5 bg-[#1E1A17]/85 text-white text-[11px] font-mono px-2.5 py-1 rounded-xs backdrop-blur-xs flex items-center gap-1">
                  <span>0{safeActiveIndex + 1}</span>
                  <span className="opacity-60">/</span>
                  <span className="opacity-80">0{images.length}</span>
                </div>

                {/* Zoom CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(true);
                  }}
                  className="absolute bottom-3.5 end-3.5 bg-white/95 hover:bg-[#1E1A17] text-[#1E1A17] hover:text-white text-xs px-3 py-1.5 rounded-xs border border-[#E2DAD0] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs font-semibold"
                  title={t.productDetail.zoomHint}
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#9A5B2E]" />
                  <span>{language === 'fr' ? 'Agrandir les détails' : 'تكبير تفاصيل الحذاء'}</span>
                </button>

                {/* Desktop Prev / Next hover navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E1A17] flex items-center justify-center shadow-md border border-[#E2DAD0] transition-opacity cursor-pointer opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <PrevIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E1A17] flex items-center justify-center shadow-md border border-[#E2DAD0] transition-opacity cursor-pointer opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <NextIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Balanced Editorial Secondary Cards (Max 3 Total Images) */}
              {images.length > 1 && (
                <div className={`grid gap-3 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {images.map((img, idx) => {
                    const isActive = idx === safeActiveIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`group/thumb text-start p-2 rounded-xs border transition-all cursor-pointer bg-white relative ${
                          isActive
                            ? 'border-[#9A5B2E] ring-1 ring-[#9A5B2E]/40 bg-[#FAF8F5]'
                            : 'border-[#E2DAD0] hover:border-[#9A5B2E]/60 hover:bg-[#FAF8F5]/50'
                        }`}
                      >
                        <div className="aspect-[4/3] bg-[#F7F5F0] rounded-xs overflow-hidden relative border border-[#E2DAD0]/60">
                          <img
                            src={img.url}
                            alt={img.alt || `Vue ${idx + 1}`}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-[#9A5B2E]/10 pointer-events-none" />
                          )}
                          <div className="absolute top-1.5 start-1.5 w-1.5 h-1.5 rounded-full bg-[#9A5B2E] opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] leading-tight">
                          <span className={`font-semibold truncate ${isActive ? 'text-[#9A5B2E]' : 'text-[#1E1A17]'}`}>
                            {getAngleLabel(img.angle, img.label)}
                          </span>
                          <span className="text-[#6B635B] font-mono text-[10px] shrink-0">
                            0{idx + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Touch-Friendly Swipeable Gallery */}
            <div className="sm:hidden space-y-2">
              <div className="relative">
                <div
                  ref={mobileScrollRef}
                  onScroll={handleMobileScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth rounded-xs border border-[#E2DAD0] bg-[#F7F5F0]"
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomOpen(true);
                      }}
                      className="w-full shrink-0 snap-center aspect-[4/3] relative overflow-hidden cursor-zoom-in"
                    >
                      <img
                        src={img.url}
                        alt={img.alt || displayName}
                        className="w-full h-full object-cover"
                      />
                      {/* Quiet Angle Tag */}
                      <div className="absolute top-3 start-3 bg-white/95 text-[#1E1A17] text-[11px] px-2.5 py-1 rounded-xs border border-[#E2DAD0] font-semibold shadow-2xs">
                        {getAngleLabel(img.angle, img.label)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Minimalist Mobile Image Indicator: e.g. 1 / 3 */}
                <div className="absolute bottom-3 end-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                  <span>{safeActiveIndex + 1}</span>
                  <span className="opacity-60">/</span>
                  <span className="opacity-80">{images.length}</span>
                </div>

                {/* Minimalist Mobile Zoom Trigger */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-3 start-3 bg-white/95 text-[#1E1A17] text-[11px] px-2.5 py-1 rounded-xs border border-[#E2DAD0] flex items-center gap-1 shadow-2xs font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#9A5B2E]" />
                  <span>{language === 'fr' ? 'Agrandir' : 'تكبير'}</span>
                </button>
              </div>

              {/* Touch Indicator Dots */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        idx === safeActiveIndex
                          ? 'w-6 bg-[#9A5B2E]'
                          : 'w-2 bg-[#E2DAD0]'
                      }`}
                      aria-label={`Image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Information, Sizes, Delivery & Order Flow (Strict Order 2 to 8) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 2. Shoe Model Name & Visual Identification */}
            <div className="border-b border-[#E2DAD0] pb-4 space-y-1.5 text-start">
              <span className="text-xs uppercase tracking-wider text-[#9A5B2E] font-semibold block">
                {displayType}
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17] leading-tight">
                {displayName}
              </h1>

              {/* Color swatch & name */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#6B635B]">
                <span className="font-medium text-[#1E1A17]">{t.products.colorsLabel}</span>
                <span className="inline-block w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: product.colorHex }} />
                <span>{displayColor}</span>
              </div>
            </div>

            {/* 3. Price in Moroccan Dirham & Live Stock Status */}
            <div className="flex items-baseline justify-between py-1 border-b border-[#E2DAD0]/60 text-start">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1E1A17]">
                  {product.priceMAD.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#1E1A17]">
                  {t.products.mad}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2F6B4F]/10 text-[#2F6B4F] text-xs font-semibold rounded-xs border border-[#2F6B4F]/20">
                <span className="w-2 h-2 rounded-full bg-[#2F6B4F] animate-pulse" />
                <span>{t.productDetail.inStock}</span>
              </div>
            </div>

            {/* 4. Concise and Accurate Product Description */}
            <div className="text-start">
              <p className="text-sm text-[#4A433D] leading-relaxed">
                {displayDesc}
              </p>
            </div>

            {/* 5. Available Sizes Selector */}
            <div
              ref={sizeSelectorRef}
              className={`p-4 sm:p-5 rounded-xs border transition-all text-start space-y-3 ${
                formErrors.size
                  ? 'bg-[#A33A2B]/5 border-[#A33A2B]'
                  : 'bg-white border-[#E2DAD0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E1A17] uppercase tracking-wider">
                  {t.products.sizesLabel}
                </label>
                {selectedSize ? (
                  <span className="text-xs font-bold text-[#9A5B2E]">
                    {t.productDetail.sizeSelected} {selectedSize}
                  </span>
                ) : (
                  <span className="text-xs text-[#6B635B]">
                    {t.productDetail.selectSizePrompt}
                  </span>
                )}
              </div>

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {product.availableSizes.map((sizeObj) => {
                  const isSelected = selectedSize === sizeObj.eu;

                  return (
                    <button
                      key={sizeObj.eu}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sizeObj.eu);
                        setFormErrors((prev) => ({ ...prev, size: undefined }));
                      }}
                      className={`min-h-[44px] text-xs font-bold rounded-xs border transition-all flex flex-col items-center justify-center p-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E1A17] text-white border-[#1E1A17] shadow-sm'
                          : 'bg-[#FAF8F5] text-[#1E1A17] border-[#E2DAD0] hover:border-[#9A5B2E] hover:bg-white'
                      }`}
                    >
                      <span className="text-sm font-bold">{sizeObj.eu}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-[#6B635B]'}`}>
                        {sizeObj.cm} cm
                      </span>
                    </button>
                  );
                })}
              </div>

              {formErrors.size && (
                <p className="text-xs font-semibold text-[#A33A2B] flex items-center gap-1.5 pt-1">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{formErrors.size}</span>
                </p>
              )}

              {/* Between sizes advice */}
              <div className="pt-1.5 text-[11px] text-[#6B635B] bg-[#F1ECE4]/60 p-2.5 rounded-xs border border-[#E2DAD0]/60 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#9A5B2E] shrink-0 mt-0.5" />
                <span>
                  <strong>{t.productDetail.betweenSizesTitle}:</strong> {displayAdvice}
                </span>
              </div>
            </div>

            {/* 6. Quantity Selector */}
            <div className="p-3.5 bg-white rounded-xs border border-[#E2DAD0] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E1A17] uppercase tracking-wider">
                {t.productDetail.quantity}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] text-[#1E1A17] flex items-center justify-center hover:bg-white disabled:opacity-40 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold font-mono text-[#1E1A17]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  disabled={quantity >= 5}
                  className="w-8 h-8 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] text-[#1E1A17] flex items-center justify-center hover:bg-white disabled:opacity-40 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 7. Delivery & Exchange Policy Info */}
            <div className="p-4 bg-white rounded-xs border border-[#E2DAD0] space-y-2.5 text-xs text-start">
              <div className="flex items-center gap-2.5 text-[#1E1A17]">
                <Truck className="w-4 h-4 text-[#9A5B2E] shrink-0" />
                <span className="font-semibold">
                  {language === 'fr' ? 'Livraison gratuite 24h à 48h partout au Maroc' : 'توصيل مجاني وسريع خلال 24 إلى 48 ساعة لكافة مدن المملكة'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1E1A17]">
                <ShieldCheck className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="font-semibold">
                  {language === 'fr' ? 'Paiement à la livraison après essayage à domicile' : 'الدفع نقداً عند الاستلام بعد المعاينة وقياس الحذاء بالمنزل'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1E1A17]">
                <RotateCcw className="w-4 h-4 text-[#9A5B2E] shrink-0" />
                <span className="font-semibold">
                  {language === 'fr' ? 'Échange de pointure gratuit et immédiat' : 'استبدال مجاني وفوري للمقاس في حال عدم الملاءمة'}
                </span>
              </div>
            </div>

            {/* 8. Order CTA Button (Direct access to order completion) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleScrollToOrder}
                className="w-full min-h-[50px] bg-[#1E1A17] hover:bg-[#9A5B2E] text-white text-sm font-bold py-3.5 px-6 rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group"
              >
                <span>{t.productDetail.orderCta}</span>
                <ArrowBackIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rotate-180 rtl:rotate-0" />
              </button>
              <p className="text-[11px] text-[#6B635B] text-center">
                {t.productDetail.directOrderSubtitle}
              </p>
            </div>

          </div>
        </div>

        {/* 3. Craftsmanship Specifications & Care Tabs */}
        <div className="mt-14 pt-8 border-t border-[#E2DAD0]">
          <div className="flex flex-wrap gap-2 border-b border-[#E2DAD0] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-[#1E1A17] text-white'
                  : 'bg-white text-[#6B635B] hover:text-[#1E1A17] border border-[#E2DAD0]'
              }`}
            >
              {t.productDetail.specsTitle}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('care')}
              className={`px-4 py-2 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                activeTab === 'care'
                  ? 'bg-[#1E1A17] text-white'
                  : 'bg-white text-[#6B635B] hover:text-[#1E1A17] border border-[#E2DAD0]'
              }`}
            >
              {t.productDetail.careTitle}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-start">
                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.leatherType}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.leatherType)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.construction}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.construction)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.lining}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.lining)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.sole}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.sole)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.lastWidth}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.lastWidth)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-sm border border-[#E2DAD0]">
                  <span className="text-[11px] font-semibold text-[#9A5B2E] block uppercase">
                    {t.productDetail.finish}
                  </span>
                  <p className="text-xs font-medium text-[#1E1A17] mt-1">
                    {cleanSpec(product.specs.finish)}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="bg-white p-6 rounded-sm border border-[#E2DAD0] text-start max-w-3xl">
                <h4 className="text-sm font-bold text-[#1E1A17] mb-3">
                  {language === 'fr' ? 'Recommandations pour préserver le cuir :' : 'إرشادات المحافظة على بهاء ولمعان الجلد:'}
                </h4>
                <ul className="space-y-2.5">
                  {careGuide.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4A433D]">
                      <Check className="w-4 h-4 text-[#2F6B4F] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 4. Dedicated Customer Order Form & Order Summary Section */}
        <div ref={orderFormRef} className="mt-16 pt-10 border-t-2 border-[#9A5B2E]/30">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#9A5B2E] font-bold">
                {language === 'fr' ? 'Expédition Sécurisée BIAZ' : 'خدمة التوصيل المباشر من BIAZ'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading-latin rtl:font-heading-arabic font-bold text-[#1E1A17]">
                {t.orderForm.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B635B] max-w-lg mx-auto">
                {t.orderForm.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Order Summary Box (Real-time updates) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-[#E2DAD0] shadow-sm text-start space-y-5">
                <h3 className="text-sm font-bold text-[#1E1A17] pb-3 border-b border-[#E2DAD0] flex items-center justify-between">
                  <span>{t.orderForm.summaryTitle}</span>
                  <span className="text-xs font-normal text-[#6B635B]">
                    {language === 'fr' ? 'Paiement à réception' : 'الدفع عند الاستلام'}
                  </span>
                </h3>

                {/* Product Snippet */}
                <div className="flex gap-3.5 items-center">
                  <div className="w-16 h-16 rounded-xs overflow-hidden bg-[#F1ECE4] border border-[#E2DAD0] shrink-0">
                    <img
                      src={currentImage.url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1E1A17] truncate">{product.modelName}</h4>
                    <p className="text-xs text-[#6B635B] truncate">{displayType} · {displayColor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedSize ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-[#1E1A17] text-white rounded-xs">
                          {t.orderForm.sizeLabel} {selectedSize}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-[#A33A2B]/10 text-[#A33A2B] rounded-xs animate-pulse">
                          {t.orderForm.sizeNotSelectedWarning}
                        </span>
                      )}
                      <span className="text-[11px] text-[#6B635B]">
                        {t.orderForm.quantityLabel} {quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calculation lines */}
                <div className="space-y-2.5 pt-3 border-t border-[#E2DAD0]/60 text-xs">
                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.unitPriceLabel}</span>
                    <span className="font-semibold text-[#1E1A17]">
                      {product.priceMAD.toLocaleString()} {t.products.mad}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.quantityLabel}</span>
                    <span className="font-semibold text-[#1E1A17]">x {quantity}</span>
                  </div>

                  <div className="flex justify-between text-[#6B635B]">
                    <span>{t.orderForm.deliveryLabel}</span>
                    <span className="font-bold text-[#2F6B4F]">
                      {t.orderForm.freeDelivery}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-[#1E1A17]/10 text-sm">
                    <span className="font-bold text-[#1E1A17]">
                      {t.orderForm.totalLabel}
                    </span>
                    <span className="text-xl font-extrabold text-[#9A5B2E]">
                      {(product.priceMAD * quantity).toLocaleString()} {t.products.mad}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] text-[11px] text-[#6B635B] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1E1A17]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                    <span>{language === 'fr' ? 'Garantie de satisfaction BIAZ' : 'ضمان المعاينة والتأكد:'}</span>
                  </div>
                  <p>
                    {language === 'fr'
                      ? "Vous ne réglez votre commande qu'après avoir reçu et essayé votre paire auprès du livreur."
                      : "لا تدفع أي مبلغ إلا بعد وصول الموزع، وتجربة الحذاء والتأكد من مطابقة المقاس والجودة تماماً."}
                  </p>
                </div>

              </div>

              {/* Order Form Inputs */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-[#E2DAD0] shadow-sm text-start">
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                      {t.orderForm.fullNameLabel} <span className="text-[#A33A2B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) {
                          setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      placeholder={t.orderForm.fullNamePlaceholder}
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border bg-[#FAF8F5] focus:outline-none focus:bg-white transition-colors ${
                        formErrors.fullName
                          ? 'border-[#A33A2B] focus:border-[#A33A2B]'
                          : 'border-[#E2DAD0] focus:border-[#9A5B2E]'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-[#A33A2B] mt-1 font-medium">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                      {t.orderForm.phoneLabel} <span className="text-[#A33A2B]">*</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) {
                          setFormErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder={t.orderForm.phonePlaceholder}
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border bg-[#FAF8F5] focus:outline-none focus:bg-white transition-colors text-start ${
                        formErrors.phone
                          ? 'border-[#A33A2B] focus:border-[#A33A2B]'
                          : 'border-[#E2DAD0] focus:border-[#9A5B2E]'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-[#A33A2B] mt-1 font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* City Dropdown & Custom City */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                      {t.orderForm.cityLabel} <span className="text-[#A33A2B]">*</span>
                    </label>
                    <select
                      value={isCustomCity ? '__OTHER__' : city}
                      onChange={(e) => {
                        if (e.target.value === '__OTHER__') {
                          setIsCustomCity(true);
                        } else {
                          setIsCustomCity(false);
                          setCity(e.target.value);
                        }
                        if (formErrors.city) {
                          setFormErrors((prev) => ({ ...prev, city: undefined }));
                        }
                      }}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors cursor-pointer"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option
                          key={c.id}
                          value={language === 'fr' ? c.nameFr : c.nameAr}
                        >
                          {language === 'fr' ? c.nameFr : c.nameAr} ({c.deliveryDays})
                        </option>
                      ))}
                      <option value="__OTHER__">{t.orderForm.cityOtherOption}</option>
                    </select>

                    {isCustomCity && (
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          if (formErrors.city) {
                            setFormErrors((prev) => ({ ...prev, city: undefined }));
                          }
                        }}
                        placeholder={t.orderForm.cityPlaceholder}
                        className="w-full mt-2 text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
                      />
                    )}
                    {formErrors.city && (
                      <p className="text-[11px] text-[#A33A2B] mt-1 font-medium">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                      {t.orderForm.addressLabel} <span className="text-[#A33A2B]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) {
                          setFormErrors((prev) => ({ ...prev, address: undefined }));
                        }
                      }}
                      placeholder={t.orderForm.addressPlaceholder}
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border bg-[#FAF8F5] focus:outline-none focus:bg-white transition-colors ${
                        formErrors.address
                          ? 'border-[#A33A2B] focus:border-[#A33A2B]'
                          : 'border-[#E2DAD0] focus:border-[#9A5B2E]'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[11px] text-[#A33A2B] mt-1 font-medium">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] mb-1.5">
                      {t.orderForm.notesLabel}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t.orderForm.notesPlaceholder}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xs border border-[#E2DAD0] bg-[#FAF8F5] focus:outline-none focus:border-[#9A5B2E] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Submit CTA & Security Notice */}
                  <div className="pt-3 space-y-3">
                    {/* Error Notice */}
                    {submissionError && (
                      <div className="p-3.5 bg-[#A33A2B]/10 border border-[#A33A2B]/30 rounded-xs text-xs text-[#A33A2B] font-semibold flex items-start gap-2 animate-fadeIn">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{submissionError}</span>
                      </div>
                    )}

                    {/* Order Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[50px] bg-[#1E1A17] hover:bg-[#9A5B2E] disabled:bg-[#1E1A17]/60 text-white text-sm font-bold py-3.5 px-6 rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                          <span>{t.orderForm.submitButtonLoading}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5 shrink-0 text-[#E5C158] group-hover:scale-110 transition-transform" />
                          <span>{t.orderForm.submitButton}</span>
                        </>
                      )}
                    </button>

                    {/* Cash On Delivery Assurance Disclaimer */}
                    <div className="p-3 bg-[#FAF8F5] rounded-xs border border-[#E2DAD0] text-[11px] text-[#6B635B] leading-relaxed flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2F6B4F] shrink-0 mt-0.5" />
                      <span>{t.orderForm.disclaimer}</span>
                    </div>
                  </div>

                </form>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* 5. High-Resolution Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => {
            setIsZoomOpen(false);
            setZoomScale(1);
          }}
        >
          {/* Modal Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-semibold">
                {product.modelName} · {getAngleLabel(currentImage.angle, currentImage.label)}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-white/20 text-white/90">
                0{safeActiveIndex + 1} / 0{images.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoomScale((s) => (s === 1 ? 1.75 : 1))}
                className="px-3 py-1.5 rounded-xs bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {zoomScale === 1 ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                <span>{zoomScale === 1 ? '175%' : '100%'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomScale(1);
                }}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={t.productDetail.closeZoom}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Image Container */}
          <div
            className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center overflow-auto rounded-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt || displayName}
              style={{ transform: `scale(${zoomScale})` }}
              className="max-h-full max-w-full object-contain transition-transform duration-300 select-none cursor-grab active:cursor-grabbing"
              onClick={() => setZoomScale((s) => (s === 1 ? 1.75 : 1))}
            />

            {/* Lightbox Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute start-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                  aria-label="Previous image"
                >
                  <PrevIcon className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute end-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                  aria-label="Next image"
                >
                  <NextIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Modal Bottom Gallery Thumbnails */}
          {images.length > 1 && (
            <div
              className="mt-4 flex items-center gap-2 overflow-x-auto max-w-md p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setZoomScale(1);
                  }}
                  className={`w-14 h-11 rounded-xs overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    idx === safeActiveIndex ? 'border-[#9A5B2E]' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
